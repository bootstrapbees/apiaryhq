
// ═══════════════════════════════════════════════════════
// FEEDING MODAL (multi-row for new entries)
// ═══════════════════════════════════════════════════════
function feedingHiveOptions(selectedId) {
  return DATA.hives.map(function(h) {
    return '<option value="' + h.id + '"' + (selectedId && selectedId === h.id ? ' selected' : '') + '>' + esc(h.name) + '</option>';
  }).join('');
}

function feedingFormRowHTML(i, r, totalRows) {
  r = r || {};
  var today = new Date().toISOString().slice(0, 10);
  var hiveId = r.hiveId || r.hive_id || '';
  var date = r.date || today;
  var ft = r.feedType || r.feed_type || 'Sugar syrup 1:1';
  var amt = (r.amount != null && r.amount !== '') ? esc(String(r.amount)) : '';
  var un = r.unit || 'gal';
  var notes = r.notes != null ? esc(String(r.notes)) : '';
  var pid = 'fty-' + i;
  var showRemove = totalRows > 1;
  var h = '<div class="feed-form-block" data-feed-idx="' + i + '"' + (i > 0 ? ' style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(74,44,10,.12)"' : '') + '>';
  if (showRemove) {
    h += '<div style="text-align:right;margin-bottom:8px"><button type="button" class="btn btn-c" style="padding:6px 12px;font-size:12px" onclick="removeFeedingFormRow(' + i + ')">Remove this entry</button></div>';
  }
  h += '<div class="fg"><label>Hive</label><select id="f-fhive-' + i + '">' + feedingHiveOptions(hiveId) + '</select></div>';
  h += '<div class="fg"><label>Date</label><input id="f-fdate-' + i + '" type="date" value="' + esc(date) + '"></div>';
  h += '<div class="fg"><label>Feed type</label>' + makePills(pid, ['Sugar syrup 1:1', 'Sugar syrup 2:1', 'Fondant', 'Dry sugar', 'Pollen patty', 'Protein supplement', 'Other'], ft) + '</div>';
  h += '<div class="row2"><div class="fg"><label>Amount <span style="font-weight:400;color:var(--txt2)">(optional)</span></label><input id="f-famt-' + i + '" type="number" step="0.01" min="0" value="' + amt + '" placeholder="e.g. 0.5"></div><div class="fg"><label>Unit</label><select id="f-funit-' + i + '">' +
    ['gal', 'qt', 'L', 'ml', 'lbs', 'kg', 'patty', 'frame'].map(function(u) {
      return '<option' + (un === u ? ' selected' : '') + '>' + u + '</option>';
    }).join('') + '</select></div></div>';
  h += '<div class="fg"><label>Notes</label><input id="f-fnotes-' + i + '" value="' + notes + '" placeholder="e.g. Top feeder, stimulated for spring"></div>';
  h += '</div>';
  return h;
}

function collectFeedingRowsFromDOM() {
  var wrap = document.getElementById('feed-rows');
  if (!wrap) return [];
  var n = wrap.querySelectorAll('.feed-form-block').length;
  var out = [];
  for (var i = 0; i < n; i++) {
    out.push({
      hiveId: gv('f-fhive-' + i),
      date: gv('f-fdate-' + i),
      feedType: getPill('fty-' + i) || 'Sugar syrup 1:1',
      amount: gv('f-famt-' + i),
      unit: gv('f-funit-' + i),
      notes: gv('f-fnotes-' + i)
    });
  }
  return out;
}

function rebuildFeedingRows(rows) {
  var wrap = document.getElementById('feed-rows');
  if (!wrap) return;
  var total = rows.length;
  wrap.innerHTML = '';
  rows.forEach(function(r, i) {
    wrap.insertAdjacentHTML('beforeend', feedingFormRowHTML(i, {
      hiveId: r.hiveId,
      date: r.date,
      feedType: r.feedType,
      amount: r.amount,
      unit: r.unit,
      notes: r.notes
    }, total));
  });
}

function appendFeedingFormRow() {
  var rows = collectFeedingRowsFromDOM();
  var last = rows[rows.length - 1] || {};
  rows.push({
    hiveId: last.hiveId || '',
    date: last.date || new Date().toISOString().slice(0, 10),
    feedType: 'Sugar syrup 1:1',
    amount: '',
    unit: last.unit || 'gal',
    notes: ''
  });
  rebuildFeedingRows(rows);
}

function removeFeedingFormRow(i) {
  var rows = collectFeedingRowsFromDOM();
  if (rows.length <= 1) return;
  rows.splice(i, 1);
  rebuildFeedingRows(rows);
}

function openFeedingModal(item) {
  if (!DATA.hives.length) { alert('Please add a hive first!'); return; }
  var edit = !!item;
  var today = new Date().toISOString().slice(0, 10);
  var h = '<div class="modal-title">' + (edit ? 'Edit' : 'Log') + ' Feeding</div>';
  if (edit) {
    h += '<div id="feed-rows">' + feedingFormRowHTML(0, {
      hiveId: item.hiveId,
      date: item.date,
      feedType: item.feedType || item.feed_type,
      amount: item.amount,
      unit: item.unit,
      notes: item.notes
    }, 1) + '</div>';
    h += '<button class="btn btn-p" onclick="saveFeeding(\'' + item.id + '\',1)">Save Changes</button>';
    h += '<button class="btn btn-d" onclick="deleteFeeding(\'' + item.id + '\')">Delete</button>';
    h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  } else {
    h += '<div id="feed-rows">' + feedingFormRowHTML(0, { date: today }, 1) + '</div>';
    h += '<button type="button" class="btn btn-c" style="width:100%;margin-bottom:10px" onclick="appendFeedingFormRow()">+ Add another feeding</button>';
    h += '<button class="btn btn-p" onclick="saveFeedingMulti()">Log feeding(s)</button>';
    h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  }
  openModal(h);
}

async function saveFeedingMulti() {
  var rows = collectFeedingRowsFromDOM();
  if (!rows.length) return;
  var payloads = [];
  for (var j = 0; j < rows.length; j++) {
    var r = rows[j];
    var amtStr = r.amount;
    var amt = amtStr === '' ? null : parseFloat(amtStr);
    if (amtStr !== '' && (isNaN(amt) || amt < 0)) {
      alert('Entry ' + (j + 1) + ': enter a valid amount or leave it blank');
      return;
    }
    if (!r.hiveId || !r.date) {
      alert('Entry ' + (j + 1) + ': hive and date are required');
      return;
    }
    payloads.push({
      hive_id: r.hiveId,
      date: r.date,
      feed_type: r.feedType,
      amount: amt,
      unit: amt != null ? r.unit : null,
      notes: r.notes
    });
  }
  for (var k = 0; k < payloads.length; k++) {
    var obj = payloads[k];
    var ins = await (typeof dbInsertSafe === 'function' ? dbInsertSafe('feedings', obj) : dbInsert('feedings', obj));
    if (ins) DATA.feedings.push({ ...ins, hiveId: ins.hive_id, feedType: ins.feed_type });
  }
  closeModal();
  renderAll();
}

async function saveFeeding(eid, isEdit) {
  var amtStr = gv('f-famt-0');
  var amt = amtStr === '' ? null : parseFloat(amtStr);
  if (amtStr !== '' && (isNaN(amt) || amt < 0)) { alert('Enter a valid amount or leave it blank'); return; }
  var obj = {
    hive_id: gv('f-fhive-0'),
    date: gv('f-fdate-0'),
    feed_type: getPill('fty-0'),
    amount: amt,
    unit: amt != null ? gv('f-funit-0') : null,
    notes: gv('f-fnotes-0')
  };
  if (!obj.hive_id || !obj.date) { alert('Hive and date are required'); return; }
  if (isEdit) {
    await (typeof dbUpdateSafe === 'function' ? dbUpdateSafe('feedings', eid, obj) : dbUpdate('feedings', eid, obj));
    var row = DATA.feedings.find(function(x) { return x.id === eid; });
    if (row) Object.assign(row, { ...obj, hiveId: obj.hive_id, feedType: obj.feed_type });
  } else {
    var ins = await (typeof dbInsertSafe === 'function' ? dbInsertSafe('feedings', obj) : dbInsert('feedings', obj));
    if (ins) DATA.feedings.push({ ...ins, hiveId: ins.hive_id, feedType: ins.feed_type });
  }
  closeModal();
  renderAll();
}

function deleteFeeding(id) {
  confirmDelete('Delete this feeding record?', async function() {
    await dbDelete('feedings', id);
    DATA.feedings = DATA.feedings.filter(function(x) { return x.id !== id; });
    renderAll();
  });
}
