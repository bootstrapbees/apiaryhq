// ═══════════════════════════════════════════════════════
// APIARY HQ — SMART REMINDER ENGINE
// Phase-aware, season-aware, zone-aware, dedup-safe
// © 2026 Bootstrap Beekeeping. All rights reserved.
// ═══════════════════════════════════════════════════════

// ── HARVEST REMINDERS ───────────────────────────────────
async function saveHarvestReminders(savedRow, obj) {
  var hive = DATA.hives.find(function(h) { return h.id === obj.hive_id; });
  if (!hive) return;
  var hiveName = hive.name;
  var harvestDate = obj.date;
  var added = [];

  if (!hasSimilarReminder(hive.id, 'post-harvest')) {
    await insertSmartReminder({
      hive_id: hive.id, next_date: addDays(harvestDate, 7), rem_type: 'Treatment',
      notes: hiveName + ': Varroa wash post-harvest — supers are off. Get a mite count baseline before deciding on Apivar.',
      item_name: null, item_cost: null, item_qty: null, supplier_id: null, completed: false, added_to_finance: false
    });
    added.push('Post-harvest Varroa wash in 7 days');
  }

  if (!hasSimilarReminder(hive.id, 'treatment decision')) {
    await insertSmartReminder({
      hive_id: hive.id, next_date: addDays(harvestDate, 14), rem_type: 'Treatment',
      notes: hiveName + ': Treatment decision — review mite count. Apply Apivar (2 strips) if count exceeds 2 mites per 100 bees.',
      item_name: null, item_cost: null, item_qty: null, supplier_id: null, completed: false, added_to_finance: false
    });
    added.push('Treatment decision at 14 days');
  }

  if (added.length) showAutoRemindToast(added.length + ' post-harvest reminder' + (added.length > 1 ? 's' : '') + ' set');
}

// ── Date helpers ─────────────────────────────────────────
function addDays(dateStr, days) {
  var d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0,10);
}
function daysBetween(a, b) {
  return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5);
}
function getMonth(dateStr) {
  return new Date(dateStr + 'T12:00:00').getMonth() + 1; // 1-12
}

// ── Colony Phase Detection ────────────────────────────────
// Zone-aware via _userZone from core.js (defaults to 7b)
// Returns: 'new_package' | 'swarm_season' | 'summer' | 'treatment' | 'fall_prep' | 'winter'
function getColonyPhase(hive, today) {
  var month = getMonth(today);

  // New package: first 28 days after install
  if (hive.install_date) {
    var daysOld = daysBetween(hive.install_date, today);
    if (daysOld >= 0 && daysOld <= 28) return 'new_package';
  }

  // Apivar / amitraz active
  if (DATA.treatments) {
    var activeTreatment = DATA.treatments.find(function(t) {
      if (t.hiveId !== hive.id || !t.date) return false;
      var product = (t.product || t.category || '').toLowerCase();
      if (!product.includes('apivar') && !product.includes('amitraz')) return false;
      return today >= t.date && today <= addDays(t.date, 56);
    });
    if (activeTreatment) return 'treatment';
  }

  // Zone-aware seasonal calendar
  var zone = (typeof _userZone !== 'undefined' && _userZone) ? _userZone : '7b';
  var cal = (typeof getZoneSeasonalCalendar === 'function')
    ? getZoneSeasonalCalendar(zone)
    : { swarm:[3,5], summer:[6,7], fallPrep:[8,11], winter:[12,2] };

  function inRange(m, range) {
    if (range[0] <= range[1]) return m >= range[0] && m <= range[1];
    return m >= range[0] || m <= range[1]; // wraps year boundary
  }

  if (inRange(month, cal.swarm))    return 'swarm_season';
  if (inRange(month, cal.summer))   return 'summer';
  if (inRange(month, cal.fallPrep)) return 'fall_prep';
  return 'winter';
}

// ── Inspection interval by phase ─────────────────────────
function getInspectionInterval(phase) {
  switch (phase) {
    case 'new_package':  return 7;
    case 'swarm_season': return 8;
    case 'summer':       return 14;
    case 'treatment':    return null;
    case 'fall_prep':    return 21;
    case 'winter':       return null;
    default:             return 14;
  }
}

// ── Dedup: one active inspection reminder per hive ───────
function hasActiveInspectionReminder(hiveId) {
  var today = new Date().toISOString().slice(0,10);
  return DATA.reminders.some(function(r) {
    return r.hiveId === hiveId &&
           r.remType === 'Inspection' &&
           !r.completed &&
           r.nextDate >= today;
  });
}

// ── Dedup: check for similar pending note ────────────────
function hasSimilarReminder(hiveId, fragment) {
  var today = new Date().toISOString().slice(0,10);
  return DATA.reminders.some(function(r) {
    return r.hiveId === hiveId &&
           !r.completed &&
           r.nextDate >= today &&
           (r.notes || '').toLowerCase().includes(fragment.toLowerCase());
  });
}

// ── Safe reminder insert ──────────────────────────────────
async function insertSmartReminder(obj) {
  var row = await (typeof dbInsertSafe === 'function'
    ? dbInsertSafe('reminders', obj)
    : dbInsert('reminders', obj));
  if (row) {
    DATA.reminders.push({
      ...row,
      hiveId: row.hive_id,
      nextDate: row.next_date,
      remType: row.rem_type,
      itemName: row.item_name || null,
      itemCost: row.item_cost || null,
      itemQty: row.item_qty || null,
      supplierId: row.supplier_id || null,
      addedToFinance: false
    });
  }
  return row;
}

// ═══════════════════════════════════════════════════════
// MAIN ENGINE
// ═══════════════════════════════════════════════════════
async function _runReminderEngine(savedRow, obj) {
  var hive = DATA.hives.find(function(h) { return h.id === obj.hive_id; });
  if (!hive) return;

  var hiveName = hive.name;
  var inspDate = obj.date;
  var phase = getColonyPhase(hive, inspDate);
  var remindersAdded = [];

  // Treatment phase: suppress all, queue post-treatment check
  if (phase === 'treatment') {
    var activeTx = DATA.treatments && DATA.treatments.find(function(t) {
      if (t.hiveId !== hive.id || !t.date) return false;
      var p = (t.product || t.category || '').toLowerCase();
      return (p.includes('apivar') || p.includes('amitraz')) &&
             inspDate >= t.date && inspDate <= addDays(t.date, 56);
    });
    if (activeTx && !hasSimilarReminder(hive.id, 'post-apivar')) {
      var postCheck = addDays(activeTx.date, 64);
      await insertSmartReminder({
        hive_id: hive.id, next_date: postCheck, rem_type: 'Inspection',
        notes: hiveName + ': Post-Apivar inspection — confirm queen is laying, do alcohol wash to verify treatment efficacy.',
        item_name: null, item_cost: null, item_qty: null, supplier_id: null, completed: false, added_to_finance: false
      });
      remindersAdded.push('Post-Apivar check scheduled');
    }
    if (remindersAdded.length) showAutoRemindToast(remindersAdded.length + ' smart reminder set');
    return;
  }

  // Winter: no full inspections
  if (phase === 'winter') {
    showAutoRemindToast('Winter mode — no full inspection reminders set');
    return;
  }

  // New package milestones
  if (phase === 'new_package' && hive.install_date) {
    var daysOld = daysBetween(hive.install_date, inspDate);

    if (daysOld < 3 && !hasSimilarReminder(hive.id, 'queen cage')) {
      await insertSmartReminder({
        hive_id: hive.id, next_date: addDays(hive.install_date, 4), rem_type: 'Inspection',
        notes: hiveName + ': Queen cage check — confirm queen has been released. Peek only, do NOT do a full inspection.',
        item_name: null, item_cost: null, item_qty: null, supplier_id: null, completed: false, added_to_finance: false
      });
      remindersAdded.push('Queen cage check at day 4');
    }

    if (daysOld < 7 && !hasSimilarReminder(hive.id, 'first brood')) {
      await insertSmartReminder({
        hive_id: hive.id, next_date: addDays(hive.install_date, 8), rem_type: 'Inspection',
        notes: hiveName + ': First brood check — look for eggs and young larvae confirming queen is laying.',
        item_name: null, item_cost: null, item_qty: null, supplier_id: null, completed: false, added_to_finance: false
      });
      remindersAdded.push('First brood check at day 8');
    }

    if (!hasSimilarReminder(hive.id, 'alcohol wash')) {
      await insertSmartReminder({
        hive_id: hive.id, next_date: addDays(hive.install_date, 21), rem_type: 'Treatment',
        notes: hiveName + ': Baseline alcohol wash — day 21-25 Varroa baseline per AUBEE 5-phase protocol.',
        item_name: null, item_cost: null, item_qty: null, supplier_id: null, completed: false, added_to_finance: false
      });
      remindersAdded.push('Baseline alcohol wash at day 21');
    }
  }

  // Condition-triggered reminders
  if (obj.queen_seen === 'No ✗' && !hasSimilarReminder(hive.id, 'queen not seen')) {
    await insertSmartReminder({
      hive_id: hive.id, next_date: addDays(inspDate, 5), rem_type: 'Inspection',
      notes: hiveName + ': Queen not seen — re-inspect in 5 days for eggs or queen presence.',
      item_name: null, item_cost: null, item_qty: null, supplier_id: null, completed: false, added_to_finance: false
    });
    remindersAdded.push('Queen check in 5 days');
  }

  if (obj.varroa && obj.varroa.toLowerCase().includes('high') && !hasSimilarReminder(hive.id, 'varroa recheck')) {
    await insertSmartReminder({
      hive_id: hive.id, next_date: addDays(inspDate, 7), rem_type: 'Treatment',
      notes: hiveName + ': High Varroa — urgent recheck in 7 days. Verify treatment efficacy with alcohol wash.',
      item_name: null, item_cost: null, item_qty: null, supplier_id: null, completed: false, added_to_finance: false
    });
    remindersAdded.push('Urgent Varroa recheck in 7 days');
  } else if (obj.varroa && obj.varroa.toLowerCase().includes('medium') && !hasSimilarReminder(hive.id, 'varroa recheck')) {
    await insertSmartReminder({
      hive_id: hive.id, next_date: addDays(inspDate, 14), rem_type: 'Treatment',
      notes: hiveName + ': Moderate Varroa — recheck in 14 days. Consider treatment if trending up.',
      item_name: null, item_cost: null, item_qty: null, supplier_id: null, completed: false, added_to_finance: false
    });
    remindersAdded.push('Varroa recheck in 14 days');
  }

  if (obj.honey && Number(obj.honey) <= 2 && !hasSimilarReminder(hive.id, 'low honey')) {
    await insertSmartReminder({
      hive_id: hive.id, next_date: addDays(inspDate, 3), rem_type: 'General Task',
      notes: hiveName + ': Low honey stores (' + obj.honey + '/5) — check feeders and refill syrup jars.',
      item_name: 'Sugar syrup', item_cost: null, item_qty: null, supplier_id: null, completed: false, added_to_finance: false
    });
    remindersAdded.push('Feed check in 3 days');
  }

  if (obj.population && Number(obj.population) <= 1 && !hasSimilarReminder(hive.id, 'low population')) {
    await insertSmartReminder({
      hive_id: hive.id, next_date: addDays(inspDate, 7), rem_type: 'Inspection',
      notes: hiveName + ': Very low population — re-inspect in 7 days. Check for disease, queen failure, or absconding.',
      item_name: null, item_cost: null, item_qty: null, supplier_id: null, completed: false, added_to_finance: false
    });
    remindersAdded.push('Low population check in 7 days');
  }

  if (obj.temperament === 'Defensive' && !hasSimilarReminder(hive.id, 'temperament')) {
    await insertSmartReminder({
      hive_id: hive.id, next_date: addDays(inspDate, 14), rem_type: 'Inspection',
      notes: hiveName + ': Defensive temperament — re-inspect in 14 days. Consider requeening if behavior continues.',
      item_name: null, item_cost: null, item_qty: null, supplier_id: null, completed: false, added_to_finance: false
    });
    remindersAdded.push('Temperament follow-up in 14 days');
  }

  if (obj.queenCells && obj.queenCells !== 'None' && !hasSimilarReminder(hive.id, 'queen cell')) {
    await insertSmartReminder({
      hive_id: hive.id, next_date: addDays(inspDate, 5), rem_type: 'Inspection',
      notes: hiveName + ': Queen cells noted — re-inspect in 5 days. Decide: split, allow supersedure, or remove cells.',
      item_name: null, item_cost: null, item_qty: null, supplier_id: null, completed: false, added_to_finance: false
    });
    remindersAdded.push('Queen cell follow-up in 5 days');
  }

  // Routine next inspection
  var interval = getInspectionInterval(phase);
  if (interval && !hasActiveInspectionReminder(hive.id)) {
    var phaseLabel = {
      new_package:  'new package weekly check',
      swarm_season: 'swarm season check',
      summer:       'routine inspection',
      fall_prep:    'fall prep inspection'
    }[phase] || 'routine inspection';
    await insertSmartReminder({
      hive_id: hive.id,
      next_date: addDays(inspDate, interval),
      rem_type: 'Inspection',
      notes: hiveName + ': Next ' + phaseLabel + ' — ' + interval + '-day interval (' + phase.replace(/_/g,' ') + ' phase).',
      item_name: null, item_cost: null, item_qty: null, supplier_id: null, completed: false, added_to_finance: false
    });
    remindersAdded.push('Next inspection in ' + interval + ' days');
  }

  if (remindersAdded.length > 0) {
    showAutoRemindToast(remindersAdded.length + ' smart reminder' + (remindersAdded.length > 1 ? 's' : '') + ' set');
  }
}

// ═══════════════════════════════════════════════════════
// PUBLIC ENTRY POINTS
// ═══════════════════════════════════════════════════════
async function saveInspectionReminders(savedRow, obj) {
  return _runReminderEngine(savedRow, obj);
}
async function saveFeedingReminders(savedRow, obj) {
  // Feedings never trigger inspection reminders
}
async function saveTreatmentReminders(savedRow, obj) {
  return _runReminderEngine(savedRow, obj);
}
async function saveSplitReminders(savedRow, obj) {
  return _runReminderEngine(savedRow, obj);
}

// ═══════════════════════════════════════════════════════
// INSTALL REMINDER FLOW
// ═══════════════════════════════════════════════════════
async function promptInstallReminders(hive) {
  var h = '<div class="modal-title">Set Install Reminders?</div>';
  h += '<div style="font-size:14px;color:var(--txt2);margin-bottom:18px;line-height:1.6">';
  h += 'Apiary HQ will set smart reminders for <strong>' + esc(hive.name) + '</strong>:<br><br>';
  h += '&bull; <strong>Day 4</strong> — Queen cage release check<br>';
  h += '&bull; <strong>Day 8</strong> — First brood inspection<br>';
  h += '&bull; <strong>Day 21</strong> — Baseline alcohol wash<br>';
  h += '&bull; <strong>Day 28</strong> — End of new-package phase';
  h += '</div>';
  h += '<button class="btn btn-p" onclick="confirmInstallReminders(\'' + hive.id + '\')">Set Reminders</button>';
  h += '<button class="btn btn-c" onclick="dismissInstallConfirm(\'' + hive.id + '\')">Skip</button>';
  openModal(h);
}

async function confirmInstallReminders(hiveId) {
  var hive = DATA.hives.find(function(h) { return h.id === hiveId; });
  if (!hive || !hive.install_date) { closeModal(); return; }
  var base = hive.install_date;
  var hn = hive.name;
  var schedule = [
    { days: 4,  type: 'Inspection', frag: 'queen cage',         note: hn + ': Queen cage check — confirm queen has been released. Peek only, no full inspection.' },
    { days: 8,  type: 'Inspection', frag: 'first brood',        note: hn + ': First brood check — look for eggs and young larvae confirming queen is laying.' },
    { days: 21, type: 'Treatment',  frag: 'alcohol wash',       note: hn + ': Baseline alcohol wash — day 21-25 Varroa baseline per AUBEE 5-phase protocol.' },
    { days: 28, type: 'Inspection', frag: 'end of new-package', note: hn + ': End of new-package phase — colony should be established. Shift to swarm-season schedule.' }
  ];
  var added = 0;
  for (var i = 0; i < schedule.length; i++) {
    var s = schedule[i];
    if (!hasSimilarReminder(hiveId, s.frag)) {
      await insertSmartReminder({
        hive_id: hiveId, next_date: addDays(base, s.days), rem_type: s.type, notes: s.note,
        item_name: null, item_cost: null, item_qty: null, supplier_id: null, completed: false, added_to_finance: false
      });
      added++;
    }
  }
  await (typeof dbUpdateSafe === 'function'
    ? dbUpdateSafe('hives', hiveId, { install_confirmed: true })
    : dbUpdate('hives', hiveId, { install_confirmed: true }));
  var h = DATA.hives.find(function(x) { return x.id === hiveId; });
  if (h) h.install_confirmed = true;
  closeModal();
  showAutoRemindToast(added + ' install reminders set for ' + hn);
  renderAll();
}

async function dismissInstallConfirm(hiveId) {
  await (typeof dbUpdateSafe === 'function'
    ? dbUpdateSafe('hives', hiveId, { install_confirmed: true })
    : dbUpdate('hives', hiveId, { install_confirmed: true }));
  var h = DATA.hives.find(function(x) { return x.id === hiveId; });
  if (h) h.install_confirmed = true;
  closeModal();
  renderAll();
}

// ═══════════════════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════════════════
function showAutoRemindToast(msg) {
  var existing = document.querySelector('.auto-remind-toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.className = 'auto-remind-toast';
  toast.innerHTML = '<svg viewBox="0 0 16 16" fill="none" style="width:14px;height:14px;vertical-align:-2px;margin-right:5px" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 8l2 2L10.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' + msg;
  document.body.appendChild(toast);
  setTimeout(function() { toast.classList.add('show'); }, 50);
  setTimeout(function() { toast.classList.remove('show'); setTimeout(function() { toast.remove(); }, 400); }, 3500);
}

// ═══════════════════════════════════════════════════════
// REMINDER MODAL
// ═══════════════════════════════════════════════════════
function openReminderModal(item) {
  var edit = !!item;
  var today = new Date().toISOString().slice(0,10);
  var hiveOpts = DATA.hives.map(function(h) {
    return '<option value="'+h.id+'"'+(item&&item.hiveId===h.id?' selected':'')+'>'+esc(h.name)+'</option>';
  }).join('');
  var suppliers = DATA.contacts.filter(function(c) { return c.role === 'Supplier'; });
  var supOpts = suppliers.map(function(s) {
    return '<option value="'+s.id+'"'+(item&&item.supplierId===s.id?' selected':'')+'>'+esc(s.name)+'</option>';
  }).join('');
  var remType = item ? (item.remType || 'Inspection') : 'Inspection';
  var h = '<div class="modal-title">'+(edit?'Edit':'New')+' Reminder</div>';
  h += '<div class="fg"><label>Type</label>'+makePills('rty',['Inspection','Treatment','Supply Purchase','General Task'],remType)+'</div>';
  h += (DATA.hives.length ? '<div class="fg"><label>Hive (optional)</label><select id="f-rhive"><option value="">All / N/A</option>'+hiveOpts+'</select></div>' : '');
  h += '<div class="fg"><label>Due Date</label><input id="f-rdate" type="date" value="'+(edit?item.nextDate||today:today)+'"></div>';
  h += '<div class="fg"><label>Notes</label><textarea id="f-rnotes">'+esc(item?item.notes||'':'')+'</textarea></div>';
  h += '<div style="padding:12px;background:rgba(37,99,168,.06);border-radius:12px;border:1px solid rgba(37,99,168,.15);margin-top:2px">';
  h += '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--blu);margin-bottom:10px">Supply / Purchase Details</div>';
  h += '<div class="fg"><label>Item Name</label><input id="f-ritem" value="'+esc(item?item.itemName||'':'')+'" placeholder="e.g. Apivar strips, sugar"></div>';
  h += '<div class="row2"><div class="fg"><label>Qty</label><input id="f-rqty" type="number" value="'+esc(item?item.itemQty||'':'')+'" placeholder="1"></div>';
  h += '<div class="fg"><label>Est. Cost ('+_prefs.currency+')</label><input id="f-rcost" type="number" step="0.01" value="'+esc(item?item.itemCost||'':'')+'" placeholder="0.00"></div></div>';
  h += (supOpts ? '<div class="fg"><label>Supplier</label><select id="f-rsupplier"><option value="">None</option>'+supOpts+'</select></div>' : '');
  h += '</div>';
  h += '<button class="btn btn-p" onclick="saveReminder(\''+(edit?item.id:'')+'\','+(edit?1:0)+')">'+(edit?'Save Changes':'Add Reminder')+'</button>';
  if (edit && !item.completed) h += '<button class="btn btn-s" onclick="completeReminder(\''+item.id+'\')">Mark Complete</button>';
  if (edit) h += '<button class="btn btn-d" onclick="deleteReminder(\''+item.id+'\')">Delete</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}

async function saveReminder(eid, isEdit) {
  var remType = getPill('rty') || 'Inspection';
  var hiveId = gv('f-rhive') || null;
  var obj = {
    rem_type: remType, hive_id: hiveId, next_date: gv('f-rdate'), notes: gv('f-rnotes'),
    item_name: gv('f-ritem'), item_qty: gv('f-rqty'), item_cost: parseFloat(gv('f-rcost')) || null,
    supplier_id: gv('f-rsupplier') || null, completed: false, added_to_finance: false
  };
  if (isEdit) {
    await (typeof dbUpdateSafe === 'function' ? dbUpdateSafe('reminders', eid, obj) : dbUpdate('reminders', eid, obj));
    Object.assign(DATA.reminders.find(function(x) { return x.id === eid; }), {
      ...obj, hiveId: obj.hive_id, nextDate: obj.next_date, remType: obj.rem_type,
      itemName: obj.item_name, itemCost: obj.item_cost, itemQty: obj.item_qty, supplierId: obj.supplier_id
    });
  } else {
    var row = await (typeof dbInsertSafe === 'function' ? dbInsertSafe('reminders', obj) : dbInsert('reminders', obj));
    if (row) DATA.reminders.push({
      ...row, hiveId: row.hive_id, nextDate: row.next_date, remType: row.rem_type,
      itemName: row.item_name, itemCost: row.item_cost, itemQty: row.item_qty,
      supplierId: row.supplier_id, addedToFinance: row.added_to_finance
    });
  }
  closeModal(); renderAll();
}

async function completeReminder(id) {
  var rem = DATA.reminders.find(function(r) { return r.id === id; });
  if (!rem) return;
  await dbUpdate('reminders', id, { completed: true });
  rem.completed = true;
  closeModal();
  if ((rem.remType === 'Supply Purchase' || rem.remType === 'Treatment') && rem.itemCost) {
    promptAddToFinance(rem);
  } else {
    renderAll();
  }
}

function promptAddToFinance(rem) {
  var h = '<div class="modal-title">Add to Finance?</div>';
  h += '<div style="font-size:14px;color:var(--txt2);margin-bottom:16px;line-height:1.6">You completed <strong>'+esc(rem.itemName||rem.notes||'task')+'</strong>';
  if (rem.itemCost) h += ' — estimated cost <strong>'+_prefs.currency+parseFloat(rem.itemCost).toFixed(2)+'</strong>';
  h += '. Add as Finance expense?</div>';
  h += '<button class="btn btn-p" onclick="addReminderToFinance(\''+rem.id+'\')">Yes, Add to Finance</button>';
  h += '<button class="btn btn-c" onclick="closeModal();renderAll();">No Thanks</button>';
  openModal(h);
}

async function addReminderToFinance(remId) {
  var rem = DATA.reminders.find(function(r) { return r.id === remId; });
  if (!rem) return;
  var desc = rem.itemName || rem.notes || 'Supply purchase';
  var contact = rem.supplierId ? DATA.contacts.find(function(c) { return c.id === rem.supplierId; }) : null;
  var obj = {
    type: 'expense', amount: parseFloat(rem.itemCost) || 0, description: desc,
    date: new Date().toISOString().slice(0,10), category: 'Supplies',
    notes: 'Auto-added from completed reminder',
    vendor_name: contact ? contact.name : '', vendor_phone: contact ? contact.phone : '',
    vendor_website: contact ? contact.website : ''
  };
  var row = await dbInsert('transactions', obj);
  if (row) DATA.transactions.push({ ...row, desc: row.description });
  await dbUpdate('reminders', remId, { added_to_finance: true });
  rem.addedToFinance = true;
  closeModal(); renderAll();
}

function deleteReminder(id) {
  confirmDelete('Delete this reminder?', async function() {
    await dbDelete('reminders', id);
    DATA.reminders = DATA.reminders.filter(function(r) { return r.id !== id; });
    renderAll();
  });
}
