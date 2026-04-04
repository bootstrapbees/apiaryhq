// ═══════════════════════════════════════════════════════
// APIARY HQ — FEEDING LOG
// © 2026 Bootstrap Beekeeping. All rights reserved.
// ═══════════════════════════════════════════════════════

var _feedingEntryCount = 0;

function makeFeedEntryBlock(idx, entry) {
  entry = entry || {};
  var type = entry.feed_type || 'Syrup';
  var isSyrup = type === 'Syrup';
  return '<div class="feed-entry-block" id="feb-'+idx+'" style="background:rgba(232,160,32,.06);border:1px solid rgba(232,160,32,.2);border-radius:14px;padding:14px;margin-bottom:10px">'+
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">'+
      '<div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:var(--amber)">Feed Source '+(idx+1)+'</div>'+
      (idx > 0 ? '<button type="button" onclick="removeFeedEntry('+idx+')" style="background:none;border:none;color:var(--red);font-size:13px;font-weight:700;cursor:pointer;padding:2px 6px">✕ Remove</button>' : '')+
    '</div>'+
    '<div class="fg"><label>Feed Type</label>'+
    '<input type="hidden" id="feb-type-'+idx+'" value="'+type+'">'+
    '<div class="feed-type-pills" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px">'+
      '<button type="button" class="feed-type-btn'+(type==='Syrup'?' active':'')+'" onclick="selectFeedType('+idx+',\'Syrup\')">'+
        '<svg viewBox="0 0 22 22" fill="none" style="width:22px;height:22px" xmlns="http://www.w3.org/2000/svg"><path d="M7 4h8l1.5 4H5.5L7 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><rect x="5" y="8" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 13c0 1.5 1 2 2 2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'+
        '<span>Syrup</span>'+
      '</button>'+
      '<button type="button" class="feed-type-btn'+(type==='Patty'?' active':'')+'" onclick="selectFeedType('+idx+',\'Patty\')">'+
        '<svg viewBox="0 0 22 22" fill="none" style="width:22px;height:22px" xmlns="http://www.w3.org/2000/svg"><ellipse cx="11" cy="13" rx="8" ry="4.5" stroke="currentColor" stroke-width="1.6"/><path d="M3 13c0-2 3.6-4 8-4s8 2 8 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8 9c.5-2 1.5-4 3-5 1.5 1 2.5 3 3 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'+
        '<span>Patty</span>'+
      '</button>'+
      '<button type="button" class="feed-type-btn'+(type==='Dry Sugar'?' active':'')+'" onclick="selectFeedType('+idx+',\'Dry Sugar\')">'+
        '<svg viewBox="0 0 22 22" fill="none" style="width:22px;height:22px" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="6" width="14" height="12" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M8 6V5a3 3 0 016 0v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8.5" cy="11.5" r="1" fill="currentColor"/><circle cx="11" cy="13.5" r="1" fill="currentColor"/><circle cx="13.5" cy="11.5" r="1" fill="currentColor"/></svg>'+
        '<span>Dry Sugar</span>'+
      '</button>'+
      '<button type="button" class="feed-type-btn'+(type==='Fondant'?' active':'')+'" onclick="selectFeedType('+idx+',\'Fondant\')">'+
        '<svg viewBox="0 0 22 22" fill="none" style="width:22px;height:22px" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="9" width="16" height="9" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M6 9V7.5a5 5 0 0110 0V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 14h2m3 0h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'+
        '<span>Fondant</span>'+
      '</button>'+
    '</div>'+
    '</div>'+
    // Syrup fields
    '<div id="feb-syrup-'+idx+'" style="'+(isSyrup?'':'display:none')+'">'+
      '<div class="row2">'+
        '<div class="fg"><label>Quarts</label><input id="feb-qts-'+idx+'" type="number" step="0.5" min="0" value="'+(entry.quarts||'')+'" placeholder="e.g. 4"></div>'+
        '<div class="fg"><label>Ratio</label>'+
          '<select id="feb-ratio-'+idx+'">'+
            '<option value="1:1"'+(entry.ratio==='1:1'||!entry.ratio?' selected':'')+'>1:1 (Spring/Fall)</option>'+
            '<option value="2:1"'+(entry.ratio==='2:1'?' selected':'')+'>2:1 (Winter prep)</option>'+
          '</select>'+
        '</div>'+
      '</div>'+
    '</div>'+
    // Quantity/weight fields (Patty uses count, Dry Sugar/Fondant use lbs)
    '<div id="feb-weight-'+idx+'" style="'+(isSyrup?'display:none':'')+'">'+
      '<div id="feb-patty-'+idx+'" style="'+(type==='Patty'?'':'display:none')+'">'+
        '<div class="fg"><label>Quantity</label>'+
          '<select id="feb-qty-'+idx+'">'+
            '<option value="0.5"'+(entry.qty===0.5?' selected':'')+'>½ Patty</option>'+
            '<option value="1"'+(!entry.qty||entry.qty===1?' selected':'')+'>1 Patty</option>'+
            '<option value="1.5"'+(entry.qty===1.5?' selected':'')+'>1½ Patties</option>'+
            '<option value="2"'+(entry.qty===2?' selected':'')+'>2 Patties</option>'+
          '</select>'+
        '</div>'+
      '</div>'+
      '<div id="feb-lbs-wrap-'+idx+'" style="'+(type==='Patty'?'display:none':'')+'">'+
        '<div class="fg"><label>Weight (lbs)</label><input id="feb-lbs-'+idx+'" type="number" step="0.25" min="0" value="'+(entry.lbs||'')+'" placeholder="e.g. 1.5"></div>'+
      '</div>'+
    '</div>'+
    '<div style="margin-top:10px;padding-top:10px;border-top:1px dashed rgba(232,160,32,.3)">'+
      '<div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:var(--txt3);margin-bottom:8px">Supplement / Additive (optional)</div>'+
      '<div class="row2">'+
        '<div class="fg"><label>Product Name</label><input id="feb-supp-'+idx+'" value="'+(entry.supplement||'')+'" placeholder="e.g. HiveAlive, Honey-B-Healthy"></div>'+
        '<div class="fg"><label>Dose / Amount</label><input id="feb-supp-dose-'+idx+'" value="'+(entry.suppDose||'')+'" placeholder="e.g. 15ml, 1 tsp"></div>'+
      '</div>'+
    '</div>'+
  '</div>';
}

function selectFeedType(idx, type) {
  // Update hidden input value
  var inp = document.getElementById('feb-type-'+idx);
  if (inp) inp.value = type;
  // Update active state on pill buttons
  var block = document.getElementById('feb-'+idx);
  if (block) {
    block.querySelectorAll('.feed-type-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.getAttribute('onclick').includes("'"+type+"'"));
    });
  }
  // Show/hide relevant fields
  var syrupDiv  = document.getElementById('feb-syrup-'+idx);
  var weightDiv = document.getElementById('feb-weight-'+idx);
  var pattyDiv  = document.getElementById('feb-patty-'+idx);
  var lbsWrap   = document.getElementById('feb-lbs-wrap-'+idx);
  if (syrupDiv)  syrupDiv.style.display  = type === 'Syrup' ? '' : 'none';
  if (weightDiv) weightDiv.style.display = type === 'Syrup' ? 'none' : '';
  if (pattyDiv)  pattyDiv.style.display  = type === 'Patty' ? '' : 'none';
  if (lbsWrap)   lbsWrap.style.display   = type === 'Patty' ? 'none' : '';
}

function onFeedTypeChange(idx) {
  // Legacy shim — pill buttons call selectFeedType directly
  selectFeedType(idx, document.getElementById('feb-type-'+idx).value);
}

function addFeedEntry() {
  _feedingEntryCount++;
  var container = document.getElementById('feed-entries');
  if (!container) return;
  var div = document.createElement('div');
  div.innerHTML = makeFeedEntryBlock(_feedingEntryCount - 1);
  container.appendChild(div.firstChild);
}

function removeFeedEntry(idx) {
  var el = document.getElementById('feb-'+idx);
  if (el) el.remove();
}

function openFeedingModal(item) {
  _feedingEntryCount = 1;
  var edit = !!item;
  var today = new Date().toISOString().slice(0,10);
  var hiveOpts = DATA.hives.map(function(h){
    return '<option value="'+h.id+'"'+(item&&item.hive_id===h.id?' selected':'')+'>'+esc(h.name)+'</option>';
  }).join('');

  var entries = (item && item.entries && item.entries.length) ? item.entries : [{}];
  _feedingEntryCount = entries.length;

  var entriesHtml = entries.map(function(e, i){ return makeFeedEntryBlock(i, e); }).join('');

  var h = '<div class="modal-title">'+(edit?'Edit':'Log')+'  Feeding</div>';
  h += '<div class="fg"><label>Hive</label><select id="f-feed-hive">'+(DATA.hives.length?'<option value="">— Select Hive —</option>'+hiveOpts:'<option value="">No hives yet</option>')+'</select></div>';
  h += '<div class="fg"><label>Date</label><input id="f-feed-date" type="date" value="'+(item?item.date:today)+'"></div>';
  h += '<div id="feed-entries">'+entriesHtml+'</div>';
  h += '<button type="button" class="btn btn-s" style="margin-bottom:14px" onclick="addFeedEntry()">+ Add Another Feed</button>';
  h += '<div class="fg"><label>Observations / Notes</label><textarea id="f-feed-notes" placeholder="e.g. Pollen coming in strong, bees taking syrup quickly, noticed robbing activity…" style="min-height:80px">'+esc(item?item.notes||'':'')+'</textarea></div>';
  h += '<button class="btn btn-p" onclick="saveFeeding(\''+(edit?item.id:'')+'\','+(edit?1:0)+')">'+(edit?'Save Changes':'Save Feeding Log')+'</button>';
  if (edit) h += '<button class="btn btn-d" onclick="deleteFeeding(\''+item.id+'\')">Delete</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}

function collectFeedEntries() {
  var entries = [];
  var blocks = document.querySelectorAll('.feed-entry-block');
  blocks.forEach(function(block) {
    var id = block.id.replace('feb-','');
    var typeEl = document.getElementById('feb-type-'+id);
    if (!typeEl) return;
    var type = typeEl.value;
    var entry = { feed_type: type };
    if (type === 'Syrup') {
      entry.quarts = parseFloat(document.getElementById('feb-qts-'+id).value) || null;
      entry.ratio  = document.getElementById('feb-ratio-'+id).value;
      entry.qty    = null;
      entry.lbs    = null;
    } else if (type === 'Patty') {
      entry.qty    = parseFloat(document.getElementById('feb-qty-'+id).value) || 1;
      entry.quarts = null;
      entry.ratio  = null;
      entry.lbs    = null;
    } else {
      entry.lbs    = parseFloat(document.getElementById('feb-lbs-'+id).value) || null;
      entry.quarts = null;
      entry.ratio  = null;
      entry.qty    = null;
    }
    var suppEl = document.getElementById('feb-supp-'+id);
    var suppDoseEl = document.getElementById('feb-supp-dose-'+id);
    entry.supplement = suppEl ? suppEl.value.trim() : '';
    entry.suppDose   = suppDoseEl ? suppDoseEl.value.trim() : '';
    entries.push(entry);
  });
  return entries;
}

async function saveFeeding(eid, isEdit) {
  var hiveId = gv('f-feed-hive') || null;
  var date = gv('f-feed-date');
  var notes = gv('f-feed-notes');
  if (!date) { alert('Please enter a date.'); return; }

  var entries = collectFeedEntries();
  if (!entries.length) { alert('Please add at least one feed source.'); return; }

  var obj = {
    hive_id: hiveId,
    date: date,
    notes: notes,
    entries: entries  // stored as JSONB in Supabase
  };

  if (isEdit) {
    var updated = await (typeof dbUpdateSafe==='function'
      ? dbUpdateSafe('feedings', eid, obj)
      : dbUpdate('feedings', eid, obj));
    var existing = DATA.feedings.find(function(f){ return f.id===eid; });
    if (existing) Object.assign(existing, obj);
  } else {
    var row = await (typeof dbInsertSafe==='function'
      ? dbInsertSafe('feedings', obj)
      : dbInsert('feedings', obj));
    if (row) {
      DATA.feedings.push(row);
      // Feeding logs never trigger inspection reminders
      await saveFeedingReminders(row, obj);
    }
  }
  closeModal();
  renderAll();
}

function deleteFeeding(id) {
  confirmDelete('Delete this feeding log?', async function(){
    await dbDelete('feedings', id);
    DATA.feedings = DATA.feedings.filter(function(f){ return f.id !== id; });
    renderAll();
  });
}
