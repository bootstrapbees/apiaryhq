// ═══════════════════════════════════════════════════════
// HIVE MODAL
// ═══════════════════════════════════════════════════════
function openHiveById(id) { var h=DATA.hives.find(function(x){return x.id===id;}); if(h) openHiveModal(h); }
function openHiveModal(hive) {
  var edit = !!hive;
  var tid = edit ? hive.id : ('h'+Date.now());
  var h = '<div class="modal-title">'+(edit?'Edit':'Add')+' Hive</div>';
  h += '<div class="fg"><label>Hive Name</label><input id="f-hname" value="'+esc(hive?hive.name:'')+'" placeholder="e.g. Queen Beatrice"></div>';
  h += '<div class="fg"><label>Location</label><input id="f-hloc" value="'+esc(hive?hive.location||'':'')+'" placeholder="e.g. North Orchard"></div>';
  h += '<div class="row2"><div class="fg"><label>Year Est.</label><input id="f-hyear" type="number" value="'+esc(hive?hive.year||'':'')+'" placeholder="'+new Date().getFullYear()+'"></div><div class="fg"><label>Boxes</label><input id="f-hboxes" type="number" value="'+esc(hive?hive.boxes||'':'')+'" placeholder="2"></div></div>';
  // Installation date — drives queen-release and feed auto-reminders
  h += '<div class="fg"><label>Installation Date <span style="font-size:11px;color:var(--txt2);font-weight:400">(package or nuc)</span></label><input id="f-hinstall" type="date" value="'+esc(hive?hive.install_date||'':'')+'"></div>';
  h += '<div class="fg"><label>Species</label>'+makePills('hsp',['Italian','Carniolan','Buckfast','Russian','Other'],hive?hive.species||'Italian':'Italian')+'</div>';
  h += '<div class="fg"><label>Status</label>'+makePills('hst',['Healthy','Monitoring','Weak','Queenless'],hive?hive.status||'Healthy':'Healthy')+'</div>';
  h += '<div class="fg"><label>Notes</label><textarea id="f-hnotes">'+esc(hive?hive.notes||'':'')+'</textarea></div>';
  // Photo area
  h += '<div class="fg"><label>Hive Photos</label>'+
    '<div style="margin-bottom:8px;display:flex;gap:8px">'+
    '<button type="button" onclick="showPhotoSourcePicker(\''+tid+'\',\'photo\')" style="display:flex;align-items:center;gap:8px;padding:10px 16px;background:linear-gradient(135deg,var(--honey),var(--amber));border:none;border-radius:12px;color:#fff;font-size:14px;font-weight:700;font-family:\'Source Serif 4\',serif;cursor:pointer;flex:1;justify-content:center">'+
    '<svg viewBox="0 0 24 24" fill="none" style="width:18px;height:18px" xmlns="http://www.w3.org/2000/svg"><path d="M3 9a2 2 0 012-2h2l1.5-2h7L17 7h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="14" r="3.5" stroke="currentColor" stroke-width="2"/></svg>'+
    'Add Photo</button></div>'+
    '<div class="pgal" id="pgal-h">'+buildGallery(tid)+'</div></div>';
  h += '<button class="btn btn-p" onclick="saveHive(\''+tid+'\','+(edit?1:0)+')">'+(edit?'Save Changes':'Add Hive')+'</button>';
  if (edit) h += '<button class="btn btn-d" onclick="deleteHive(\''+hive.id+'\')">Delete Hive</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}

async function saveHive(tid, isEdit) {
  var name = gv('f-hname');
  if (!name) { alert('Please enter a hive name'); return; }
  var installDate = gv('f-hinstall') || null;
  var obj = {
    name, location:gv('f-hloc'), year:gv('f-hyear'), boxes:gv('f-hboxes'),
    species:getPill('hsp'), status:getPill('hst'), notes:gv('f-hnotes'),
    install_date: installDate
  };
  if (isEdit) {
    var prevHive = DATA.hives.find(function(x){return x.id===tid;});
    var prevInstall = prevHive ? prevHive.install_date : null;
    await dbUpdate('hives', tid, obj);
    var hv = DATA.hives.find(function(x){return x.id===tid;}); Object.assign(hv, obj);
    if (PHOTOS[tid]) {
      for (var ep of PHOTOS[tid]) {
        if (/^p/.test(String(ep.id))) {
          var s=await dbInsert('photos',{context_id:tid,data_url:ep.dataUrl}); if(s) ep.id=s.id;
        }
      }
    }
    // If install date was newly added or changed, prompt for install reminders
    if (installDate && installDate !== prevInstall) {
      closeModal();
      promptInstallReminders(hv);
      renderAll();
      return;
    }
  } else {
    var row = await dbInsert('hives', obj);
    if (row) {
      if (PHOTOS[tid]) { for(var p of PHOTOS[tid]){await dbInsert('photos',{context_id:row.id,data_url:p.dataUrl});} delete PHOTOS[tid]; }
      DATA.hives.push(row);
      // If install date provided on new hive, prompt for install reminders
      if (installDate) {
        closeModal();
        promptInstallReminders(row);
        renderAll();
        return;
      }
    }
  }
  closeModal(); renderAll();
}

function deleteHive(id) {
  confirmDelete('Delete this hive and all its records?', async function(){
    await dbDelete('hives', id);
    DATA.hives = DATA.hives.filter(function(h){return h.id!==id;});
    DATA.inspections = DATA.inspections.filter(function(i){return i.hiveId!==id;});
    DATA.treatments = DATA.treatments.filter(function(t){return t.hiveId!==id;});
    DATA.harvests = DATA.harvests.filter(function(v){return v.hiveId!==id;});
    DATA.feedings = DATA.feedings.filter(function(f){return f.hiveId!==id;});
    renderAll();
  });
}

// ═══════════════════════════════════════════════════════
// CONFIRM INSTALLATION FLOW
// ═══════════════════════════════════════════════════════

// Called from hive card "Confirm Install" button OR after saveHive detects a new install date
function promptInstallReminders(hive) {
  var installDate = hive.install_date;
  if (!installDate) return;
  var reminders = buildInstallReminderList(hive);

  var h = '<div class="modal-title" style="display:flex;align-items:center;gap:10px">'+
    '<svg viewBox="0 0 24 24" fill="none" style="width:22px;height:22px;color:var(--amber)" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'+
    '<circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.6"/></svg>'+
    'Confirm Installation</div>';
  h += '<div style="font-size:13px;color:var(--txt2);margin-bottom:14px;line-height:1.6">'+
    'Package installed <strong>'+fmtDate(installDate)+'</strong> in <strong>'+esc(hive.name)+'</strong>.<br>'+
    'The following smart reminders will be created — confirm or skip below.'+
  '</div>';

  // Preview list
  h += '<div style="background:var(--wax);border-radius:12px;padding:12px 14px;margin-bottom:16px;display:flex;flex-direction:column;gap:9px">';
  reminders.forEach(function(r) {
    h += '<div style="display:flex;align-items:flex-start;gap:10px">'+
      '<span style="font-size:16px;flex-shrink:0;margin-top:1px">'+r.icon+'</span>'+
      '<div>'+
        '<div style="font-size:13px;font-weight:700;color:var(--txt)">'+esc(r.label)+'</div>'+
        '<div style="font-size:11px;color:var(--txt2);margin-top:2px">'+fmtDate(r.date)+' &nbsp;·&nbsp; '+esc(r.desc)+'</div>'+
      '</div>'+
    '</div>';
  });
  h += '</div>';

  h += '<button class="btn btn-p" onclick="confirmInstallReminders(\''+hive.id+'\')">✅ Confirm &amp; Create Reminders</button>';
  h += '<button class="btn btn-c" onclick="skipInstallReminders()">Skip for Now</button>';
  h += '<button class="btn btn-d" onclick="dismissInstallReminders(\''+hive.id+'\')">Don\'t Ask Again for This Hive</button>';
  openModal(h);
}

function buildInstallReminderList(hive) {
  var d = hive.install_date;
  return [
    { icon:'🐝', label:'Queen Cage Check',       date:addDays(d,4),  type:'Inspection', desc:'Check candy plug is being worked. Do NOT manually release yet unless plug is completely untouched.' },
    { icon:'👑', label:'Queen Release Confirm',   date:addDays(d,8),  type:'Inspection', desc:'Confirm queen has been released and accepted. Look for eggs or young larvae as proof.' },
    { icon:'🍯', label:'Feed Check — Day 4',      date:addDays(d,4),  type:'Task',       desc:'Check quart jar / feeder level. Refill 1:1 syrup as needed.' },
    { icon:'🍯', label:'Feed Check — Day 8',      date:addDays(d,8),  type:'Task',       desc:'Check feeder level. Refill 1:1 syrup as needed.' },
    { icon:'🍯', label:'Feed Check — Day 14',     date:addDays(d,14), type:'Task',       desc:'Check feeder level. Consider adding protein patty if population is slow to build.' },
    { icon:'🔬', label:'Varroa Baseline Wash',    date:addDays(d,22), type:'Treatment',  desc:'First alcohol wash — broodless window post-install. Target <2% (under 2 mites per 100 bees).' },
  ];
}

async function confirmInstallReminders(hiveId) {
  var hive = DATA.hives.find(function(h){return h.id===hiveId;});
  if (!hive) { closeModal(); return; }
  var reminders = buildInstallReminderList(hive);
  var added = 0;
  for (var r of reminders) {
    var obj = {
      hive_id:          hiveId,
      next_date:        r.date,
      rem_type:         r.type,
      notes:            hive.name + ': ' + r.label + ' — ' + r.desc,
      item_name:        r.label.startsWith('Feed') ? 'Sugar syrup (1:1)' : null,
      item_cost:        null,
      item_qty:         null,
      supplier_id:      null,
      completed:        false,
      added_to_finance: false
    };
    var row = await dbInsert('reminders', obj);
    if (row) {
      DATA.reminders.push({
        ...row,
        hiveId: row.hive_id, nextDate: row.next_date, remType: row.rem_type,
        itemName: row.item_name, itemCost: null, itemQty: null, supplierId: null,
        addedToFinance: false
      });
      added++;
    }
  }
  // Mark hive so card stops showing the Confirm Install button
  await dbUpdate('hives', hiveId, { install_confirmed: true });
  hive.install_confirmed = true;
  closeModal();
  renderAll();
  if (added > 0) showAutoRemindToast(added + ' installation reminders created');
}

function skipInstallReminders() {
  // Just dismiss — hive card will still show the button next visit
  closeModal();
  renderAll();
}

async function dismissInstallReminders(hiveId) {
  // Permanently suppress the Confirm Install button for this hive
  await dbUpdate('hives', hiveId, { install_confirmed: true });
  var hive = DATA.hives.find(function(h){return h.id===hiveId;});
  if (hive) hive.install_confirmed = true;
  closeModal();
  renderAll();
}

// ═══════════════════════════════════════════════════════
// INSPECTION MODAL  (unchanged — preserved exactly)
// ═══════════════════════════════════════════════════════
function openInspModal(item) {
  if (!DATA.hives.length) { alert('Please add a hive first!'); return; }
  var edit = !!item;
  var today = new Date().toISOString().slice(0,10);
  var opts = DATA.hives.map(function(h){return '<option value="'+h.id+'"'+(item&&item.hiveId===h.id?' selected':'')+'>'+esc(h.name)+'</option>';}).join('');
  var tid = edit ? item.id : ('i'+Date.now());
  var WX = window._wx;
  var selWx='☀️ Sunny', wxBanner='';
  if (WX) {
    var dl=WX.desc.toLowerCase();
    if(dl.includes('rain')||dl.includes('drizzle')||dl.includes('thunder')) selWx='🌧️ Rainy';
    else if(dl.includes('cloud')||dl.includes('fog')||dl.includes('overcast')) selWx='⛅ Cloudy';
    else if(dl.includes('wind')) selWx='🌬️ Windy';
    wxBanner='<div class="fg"><label>Live Weather</label><div style="background:linear-gradient(135deg,#1a3a5c,#2563a8);border-radius:12px;padding:11px;color:#fff;font-size:13px;display:flex;align-items:center;gap:10px"><span style="font-size:22px">'+WX.wxSvg+'</span><span>'+WX.temp+'°F · '+WX.desc+' · 💨'+WX.wind+'mph</span></div></div>';
  }
  var h = '<div class="modal-title">'+(edit?'Edit':'New')+' Inspection</div>';
  h += '<div class="fg"><label>Hive</label><select id="f-ihive">'+opts+'</select></div>';
  h += '<div class="fg"><label>Date</label><input id="f-idate" type="date" value="'+(edit?item.date:today)+'"></div>';
  h += wxBanner;
  h += '<div class="fg"><label>Weather</label>'+makePills('iwx',['☀️ Sunny','⛅ Cloudy','🌧️ Rainy','🌬️ Windy'],edit?item.weather||selWx:selWx)+'</div>';
  h += '<div class="fg"><label>Queen Seen?</label>'+makePills('iq',['Yes ✓','No ✗','Eggs Only'],edit?item.queenSeen||'Yes ✓':'Yes ✓')+'</div>';
  h += '<div class="fg"><label>Population</label>'+makeStars('ip',edit?item.population:3)+'</div>';
  h += '<div class="fg"><label>Honey Stores</label>'+makeStars('ih',edit?item.honey:3)+'</div>';
  h += '<div class="fg"><label>Brood Pattern</label>'+makeStars('ib',edit?item.brood:3)+'</div>';
  h += '<div class="fg"><label>Temperament</label>'+makePills('itm',['Calm','Moderate','Defensive'],edit?item.temperament||'Calm':'Calm')+'</div>';
  h += '<div class="fg"><label>Varroa Level</label>'+makePills('iv',['Not checked','Low (<2%)','Medium (2-4%)','High (>4%)'],edit?item.varroa||'Not checked':'Not checked')+'</div>';
  // ── FEEDING SECTION ──
  var feedType = edit ? (item.feed_type||'None') : 'None';
  var feedQty  = edit ? (item.feed_qty||'') : '';
  var feedNote = edit ? (item.feed_notes||'') : '';
  h += '<div style="background:var(--wax);border-radius:12px;padding:12px 14px;margin-bottom:2px">'+
    '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--amber);margin-bottom:10px">🍯 Feeding</div>'+
    '<div class="fg" style="margin-bottom:8px"><label>Fed Today?</label>'+makePills('ifd',['None','1:1 Syrup','2:1 Syrup','Pollen Patty','Candy Board','Dry Sugar'],feedType)+'</div>'+
    '<div class="row2">'+
      '<div class="fg"><label>Quantity</label><input id="f-ifdqty" value="'+esc(feedQty)+'" placeholder="e.g. 1 qt, 2 lbs"></div>'+
      '<div class="fg"><label>Feed Notes</label><input id="f-ifdnotes" value="'+esc(feedNote)+'" placeholder="e.g. jar nearly empty"></div>'+
    '</div>'+
  '</div>';
  // ── FRAME LOGGING SECTION ──
  var existingBoxData = (edit && (item.box_data||item.boxData)) ? deserializeFrameBoxes(item.box_data||item.boxData) : null;
  if (!existingBoxData) {
    // New inspection — carry forward foundation types from last inspection for this hive
    var lastInsp = DATA.inspections
      .filter(function(x){ return x.hiveId === (edit ? item.hiveId : gv('f-ihive')); })
      .sort(function(a,b){ return b.date.localeCompare(a.date); })[0];
    var priorBoxData = (lastInsp && (lastInsp.box_data||lastInsp.boxData))
      ? deserializeFrameBoxes(lastInsp.box_data||lastInsp.boxData) : null;
    if (priorBoxData) {
      // Copy foundation only, leave everything else blank
      existingBoxData = priorBoxData.map(function(box) {
        return {
          label: box.label,
          frames: box.frames.map(function(fr) {
            return { foundation: fr.foundation||'', contents:[], pattern:'', queenCell:'None', notes:'' };
          })
        };
      });
    }
  }
  initFrameBoxes(existingBoxData);
  h += '<div style="background:var(--warn-bg);border-radius:12px;padding:12px 14px;margin-bottom:2px">';
  h += '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--forest);margin-bottom:10px">🖼️ Frame Map</div>';
  h += '<div id="frame-section-wrap"></div>';
  h += '</div>';
  h += '<div class="fg"><label>Actions Taken</label><textarea id="f-iact" placeholder="e.g. Added super, treated for varroa…">'+(edit?esc(item.actions||''):'')+'</textarea></div>';
  h += '<div class="fg"><label>Notes</label><textarea id="f-inotes" placeholder="Observations…">'+(edit?esc(item.notes||''):'')+'</textarea></div>';
  h += '<div class="fg"><label>Inspection Photos</label>'+
    '<div style="margin-bottom:8px;display:flex;gap:8px">'+
    '<button type="button" onclick="showPhotoSourcePicker(\''+tid+'\',\'photo\')" style="display:flex;align-items:center;gap:8px;padding:10px 16px;background:linear-gradient(135deg,var(--honey),var(--amber));border:none;border-radius:12px;color:#fff;font-size:14px;font-weight:700;font-family:\'Source Serif 4\',serif;cursor:pointer;flex:1;justify-content:center">'+
    '<svg viewBox="0 0 24 24" fill="none" style="width:18px;height:18px" xmlns="http://www.w3.org/2000/svg"><path d="M3 9a2 2 0 012-2h2l1.5-2h7L17 7h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="14" r="3.5" stroke="currentColor" stroke-width="2"/></svg>'+
    'Add Photo</button></div>'+
    '<div class="pgal" id="pgal-h">'+buildGallery(tid)+'</div></div>';
  if (!edit) {
    h += '<div class="smart-rem-badge"><svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.3"/><path d="M4.5 7l2 2 3-3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>Smart reminders will be auto-created from this inspection</div>';
  }
  h += '<button class="btn btn-p" onclick="saveInsp(\''+tid+'\','+(edit?1:0)+')">'+(edit?'Save Changes':'Save Inspection')+'</button>';
  if (edit) h += '<button class="btn btn-d" onclick="deleteInsp(\''+item.id+'\')">Delete</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
  renderFrameSection();
}

async function saveInsp(tid, isEdit) {
  var hiveId=gv('f-ihive'), date=gv('f-idate');
  if (!date) { alert('Select a date'); return; }
  var WX=window._wx;
  var ws=WX?{temp:WX.temp,desc:WX.desc,wind:WX.wind,score:WX.score}:null;
  var feedType = getPill('ifd')||'None';
  var obj={hive_id:hiveId,date,weather_snap:ws,weather:getPill('iwx'),queen_seen:getPill('iq'),population:getStar('ip'),honey:getStar('ih'),brood:getStar('ib'),temperament:getPill('itm'),varroa:getPill('iv'),feed_type:feedType==='None'?null:feedType,feed_qty:gv('f-ifdqty')||null,feed_notes:gv('f-ifdnotes')||null,actions:gv('f-iact'),notes:gv('f-inotes'),box_data:serializeFrameBoxes()};
  if (isEdit) {
    await (typeof dbUpdateSafe==='function'?dbUpdateSafe('inspections',tid,obj):dbUpdate('inspections',tid,obj));
    Object.assign(DATA.inspections.find(function(x){return x.id===tid;}), {...obj,hiveId:obj.hive_id,queenSeen:obj.queen_seen,weatherSnap:obj.weather_snap,feedType:obj.feed_type,feedQty:obj.feed_qty,feedNotes:obj.feed_notes,boxData:obj.box_data});
  } else {
    var row=await (typeof dbInsertSafe==='function'?dbInsertSafe('inspections',obj):dbInsert('inspections',obj));
    if (row) {
      if (PHOTOS[tid]) { for(var p of PHOTOS[tid]){var s=await dbInsert('photos',{context_id:row.id,data_url:p.dataUrl}); if(s){PHOTOS[row.id]=PHOTOS[row.id]||[];PHOTOS[row.id].push({id:s.id,dataUrl:p.dataUrl});}} delete PHOTOS[tid]; }
      DATA.inspections.push({...row,hiveId:row.hive_id,queenSeen:row.queen_seen,weatherSnap:row.weather_snap,feedType:row.feed_type,feedQty:row.feed_qty,feedNotes:row.feed_notes,boxData:row.box_data});
      await autoGenerateReminders(row, obj);
    }
  }
  closeModal(); renderAll();
}

// ═══════════════════════════════════════════════════════
// HIVE SPLIT MODAL
// ═══════════════════════════════════════════════════════
function openSplitModal(hiveId) {
  var parentHive = DATA.hives.find(function(h){return h.id===hiveId;});
  if (!parentHive) return;
  var today = new Date().toISOString().slice(0,10);
  var h = '<div class="modal-title" style="display:flex;align-items:center;gap:10px">'+
    '<svg viewBox="0 0 24 24" fill="none" style="width:20px;height:20px;color:var(--amber)" xmlns="http://www.w3.org/2000/svg">'+
    '<path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'+
    'Log Hive Split</div>';
  h += '<div style="font-size:13px;color:var(--txt2);margin-bottom:14px">Splitting from <strong>'+esc(parentHive.name)+'</strong>. A new hive record will be created for the split.</div>';
  h += '<div class="fg"><label>Split Date</label><input id="f-splitdate" type="date" value="'+today+'"></div>';
  h += '<div class="fg"><label>New Hive Name</label><input id="f-splitname" placeholder="e.g. Queen Beatrice II" value="'+esc(parentHive.name)+' Split"></div>';
  h += '<div class="fg"><label>New Hive Location</label><input id="f-splitloc" placeholder="e.g. South Orchard" value="'+esc(parentHive.location||'')+'"></div>';
  h += '<div class="fg"><label>Queen Strategy</label>'+makePills('sqsrc',['Walk-away (raise own queen)','Purchased queen','Raised cell from colony'],'Walk-away (raise own queen)')+'</div>';
  h += '<div class="fg"><label>Lineage / Notes</label><textarea id="f-splitnotes" placeholder="e.g. Daughter of Queen Beatrice — VSH genetics. Walk-away split, will check for queen cells at day 5."></textarea></div>';
  h += '<button class="btn btn-p" onclick="saveSplit(\''+hiveId+'\')">Save Split &amp; Create New Hive</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}

async function saveSplit(parentHiveId) {
  var parentHive = DATA.hives.find(function(h){return h.id===parentHiveId;});
  if (!parentHive) return;
  var splitDate = gv('f-splitdate');
  var newName   = gv('f-splitname');
  if (!newName)   { alert('Please enter a name for the new hive'); return; }
  if (!splitDate) { alert('Please enter the split date'); return; }
  var queenSrc  = getPill('sqsrc');
  var notes     = gv('f-splitnotes');

  // Create the new child hive record
  var newHiveObj = {
    name:              newName,
    location:          gv('f-splitloc'),
    year:              new Date(splitDate).getFullYear(),
    boxes:             1,
    species:           parentHive.species || 'Italian',
    status:            'Monitoring',
    notes:             'Split from '+parentHive.name+' on '+splitDate+(notes?'. '+notes:''),
    install_date:      splitDate,
    install_confirmed: true,   // skip the package install reminder flow for splits
    parent_hive_id:    parentHiveId,
    queen_source:      queenSrc
  };
  var newHiveRow = await dbInsert('hives', newHiveObj);
  if (!newHiveRow) { alert('Error creating split hive — please try again'); return; }
  DATA.hives.push(newHiveRow);

  // Auto-generate queen-check reminders based on strategy
  var reminders = buildSplitReminderList(newHiveRow, queenSrc);
  var added = 0;
  for (var r of reminders) {
    var obj = {
      hive_id:          newHiveRow.id,
      next_date:        r.date,
      rem_type:         'Inspection',
      notes:            newName + ': ' + r.label + ' — ' + r.desc,
      item_name:        null, item_cost: null, item_qty: null,
      supplier_id:      null, completed: false, added_to_finance: false
    };
    var row = await dbInsert('reminders', obj);
    if (row) {
      DATA.reminders.push({
        ...row,
        hiveId: row.hive_id, nextDate: row.next_date, remType: row.rem_type,
        itemName: null, itemCost: null, itemQty: null, supplierId: null,
        addedToFinance: false
      });
      added++;
    }
  }

  closeModal();
  renderAll();
  showAutoRemindToast('Split logged — "'+newName+'" created with '+added+' queen-check reminders');
}

function buildSplitReminderList(newHive, queenSrc) {
  var d = newHive.install_date;
  if (queenSrc && queenSrc.includes('Walk-away')) {
    return [
      { label:'Queen Cell Check',           date:addDays(d,5),  desc:'Look for capped queen cells. Do NOT destroy extras yet — let them sort it out or remove extras on day 10.' },
      { label:'Virgin Queen Hatch Check',   date:addDays(d,14), desc:'Virgin queen should have hatched. Minimal disturbance — no full inspection needed, just observe entrance activity.' },
      { label:'Queen Mating / Laying Check',date:addDays(d,24), desc:'Check for eggs and young larvae to confirm mated queen is laying. No eggs by day 28 = emergency requeen.' },
    ];
  } else if (queenSrc && queenSrc.includes('Purchased')) {
    return [
      { label:'Queen Cage Check',      date:addDays(d,4), desc:'Confirm candy plug being worked by workers. Do NOT force-release.' },
      { label:'Queen Release Confirm', date:addDays(d,8), desc:'Confirm queen released and accepted. Look for eggs or young larvae.' },
    ];
  } else {
    // Raised cell from colony
    return [
      { label:'Queen Cell Check',         date:addDays(d,7),  desc:'Confirm a good capped queen cell is present and undamaged.' },
      { label:'Virgin Queen Hatch Check', date:addDays(d,16), desc:'Virgin queen should be hatching — leave undisturbed.' },
      { label:'Queen Laying Check',       date:addDays(d,26), desc:'Check for eggs and young larvae confirming mated laying queen.' },
    ];
  }
}

// ═══════════════════════════════════════════════════════
// REQUEENING MODAL
// ═══════════════════════════════════════════════════════
function openRequeenModal(hiveId) {
  var hive = DATA.hives.find(function(h){return h.id===hiveId;});
  if (!hive) return;
  var today = new Date().toISOString().slice(0,10);
  var h = '<div class="modal-title" style="display:flex;align-items:center;gap:10px">'+
    '<svg viewBox="0 0 24 24" fill="none" style="width:20px;height:20px;color:var(--amber)" xmlns="http://www.w3.org/2000/svg">'+
    '<circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/>'+
    '<path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'+
    'Log Requeening</div>';
  h += '<div style="font-size:13px;color:var(--txt2);margin-bottom:14px">Recording a requeening event for <strong>'+esc(hive.name)+'</strong>.</div>';
  h += '<div class="fg"><label>Requeening Date</label><input id="f-rqdate" type="date" value="'+today+'"></div>';
  h += '<div class="fg"><label>Old Queen Status</label>'+makePills('rqold',['Found &amp; removed','Removed (not found)','Supersedure in progress'],'Found &amp; removed')+'</div>';
  h += '<div class="fg"><label>New Queen Source</label>'+makePills('rqsrc',['Purchased (mated)','Raised in-house','Emergency cell from colony'],'Purchased (mated)')+'</div>';
  h += '<div class="fg"><label>New Queen Marked?</label>'+makePills('rqmark',['Yes','No'],'No')+'</div>';
  h += '<div class="fg"><label>Mark Color / ID <span style="font-size:11px;color:var(--txt2);font-weight:400">(optional)</span></label><input id="f-rqmarkid" placeholder="e.g. White dot — 2026, or breeder tag"></div>';
  h += '<div class="fg"><label>Source / Breeder Notes</label><textarea id="f-rqnotes" placeholder="e.g. Purchased from Kelley Bees — VSH Italian, 2026 queen. Good temperament line."></textarea></div>';
  h += '<button class="btn btn-p" onclick="saveRequeen(\''+hiveId+'\')">Save &amp; Create Acceptance Reminders</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}

async function saveRequeen(hiveId) {
  var hive = DATA.hives.find(function(h){return h.id===hiveId;});
  if (!hive) return;
  var rqDate = gv('f-rqdate');
  if (!rqDate) { alert('Please enter the requeening date'); return; }
  var oldQ   = getPill('rqold');
  var src    = getPill('rqsrc');
  var marked = getPill('rqmark');
  var markId = gv('f-rqmarkid');
  var notes  = gv('f-rqnotes');

  // Append requeening event to hive notes and set status to Monitoring
  var eventNote = '[Requeened '+rqDate+'] Old queen: '+oldQ+
    '. New queen: '+src+(marked==='Yes'&&markId?' (marked: '+markId+')':marked==='Yes'?' (marked)':'')+
    (notes?'. '+notes:'.');
  var updatedNotes = (hive.notes ? hive.notes.trim()+'\n' : '') + eventNote;
  var rqMeta = { status: 'Monitoring', notes: updatedNotes };
  await dbUpdate('hives', hiveId, rqMeta);
  Object.assign(hive, rqMeta);

  // Build acceptance-check reminders based on queen source
  var rems = buildRequeenReminderList(hive, rqDate, src);
  var added = 0;
  for (var r of rems) {
    var obj = {
      hive_id:          hiveId,
      next_date:        r.date,
      rem_type:         'Inspection',
      notes:            hive.name + ': ' + r.label + ' — ' + r.desc,
      item_name:        null, item_cost: null, item_qty: null,
      supplier_id:      null, completed: false, added_to_finance: false
    };
    var row = await dbInsert('reminders', obj);
    if (row) {
      DATA.reminders.push({
        ...row,
        hiveId: row.hive_id, nextDate: row.next_date, remType: row.rem_type,
        itemName: null, itemCost: null, itemQty: null, supplierId: null,
        addedToFinance: false
      });
      added++;
    }
  }

  closeModal();
  renderAll();
  showAutoRemindToast('Requeening logged — '+added+' acceptance reminders created');
}

function buildRequeenReminderList(hive, rqDate, src) {
  if (src && src.includes('Purchased')) {
    return [
      { label:'Queen Cage Check',       date:addDays(rqDate,4), desc:'Check candy plug — confirm workers are chewing through it. Do NOT manually release.' },
      { label:'Queen Acceptance Check', date:addDays(rqDate,8), desc:'Confirm queen released and accepted. Look for eggs or young larvae. No eggs by day 10 = emergency action needed.' },
    ];
  } else if (src && src.includes('Emergency')) {
    return [
      { label:'Queen Cell Hatch Check',    date:addDays(rqDate,8),  desc:'Emergency queen cell should be hatching — keep disturbance minimal.' },
      { label:'Virgin Queen Laying Check', date:addDays(rqDate,24), desc:'Check for eggs and young brood confirming mated laying queen.' },
    ];
  } else {
    // Raised in-house
    return [
      { label:'Queen Introduction Check', date:addDays(rqDate,5),  desc:'Confirm queen is out of her cage or introduction cell. Calm bee behavior is a good sign.' },
      { label:'Queen Laying Check',        date:addDays(rqDate,14), desc:'Look for eggs and young larvae confirming queen accepted and actively laying.' },
    ];
  }
}
