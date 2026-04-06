
// ═══════════════════════════════════════════════════════
// FEEDING MODAL (multi-row for new entries)
// ═══════════════════════════════════════════════════════
function feedingHiveOptions(selectedId) {
  return DATA.hives.map(function(h) {
    return '<option value="' + h.id + '"' + (selectedId && selectedId === h.id ? ' selected' : '') + '>' + esc(h.name) + '</option>';
  }).join('');
}

function syncFeedingOtherRow(idx) {
  idx = String(idx);
  var ow = document.getElementById('f-fother-wrap-' + idx);
  var sw = document.getElementById('f-sother-wrap-' + idx);
  if (ow) ow.style.display = (getPill('fty-' + idx) === 'Other') ? '' : 'none';
  if (sw) sw.style.display = (getPill('sup-' + idx) === 'Other') ? '' : 'none';
}

function initFeedingOtherVisibility() {
  document.querySelectorAll('.feed-form-block').forEach(function(b) {
    var i = b.getAttribute('data-feed-idx');
    if (i !== null) syncFeedingOtherRow(i);
  });
}

function feedingFormRowHTML(i, r, totalRows) {
  r = r || {};
  var today = new Date().toISOString().slice(0, 10);
  var hiveId = r.hiveId || r.hive_id || '';
  var fo = r.feedOther || r.feed_other || '';
  var so = r.supplementOther || r.supplement_other || '';
  var ft = r.feedType || r.feed_type || 'Sugar syrup 1:1';
  if (fo) ft = 'Other';
  var sup = r.supplement != null && r.supplement !== '' ? r.supplement : 'None';
  if (so) sup = 'Other';
  var amt = (r.amount != null && r.amount !== '') ? esc(String(r.amount)) : '';
  var un = r.unit || 'gal';
  var notes = r.notes != null ? esc(String(r.notes)) : '';
  var pid = 'fty-' + i;
  var sid = 'sup-' + i;
  var supOpts = ['None', 'Honey-B-Healthy', 'Probiotic', 'Essential oils', 'AP23 / patty additive', 'Vitamin B', 'Other'];
  var showRemove = totalRows > 1;
  var h = '<div class="feed-form-block" data-feed-idx="' + i + '"' + (i > 0 ? ' style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(74,44,10,.12)"' : '') + '>';
  if (showRemove) {
    h += '<div style="text-align:right;margin-bottom:8px"><button type="button" class="btn btn-c" style="padding:6px 12px;font-size:12px" onclick="removeFeedingFormRow(' + i + ')">Remove this entry</button></div>';
  }
  h += '<div class="fg"><label>Hive</label><select id="f-fhive-' + i + '">' + feedingHiveOptions(hiveId) + '</select></div>';
  h += '<div class="fg"><label>Date</label><input id="f-fdate-' + i + '" type="date" value="' + esc(r.date || today) + '"></div>';
  h += '<div class="fg"><label>Feed type</label>' + makePills(pid, ['Sugar syrup 1:1', 'Sugar syrup 2:1', 'Fondant', 'Dry sugar', 'Pollen patty', 'Protein supplement', 'Other'], ft) + '</div>';
  h += '<div class="fg" id="f-fother-wrap-' + i + '" style="display:none"><label>Describe feed (Other)</label><input id="f-fother-' + i + '" value="' + esc(fo) + '" placeholder="e.g. Custom syrup mix, candy board…"></div>';
  h += '<div class="row2"><div class="fg"><label>Amount <span style="font-weight:400;color:var(--txt2)">(optional)</span></label><input id="f-famt-' + i + '" type="number" step="0.01" min="0" value="' + amt + '" placeholder="e.g. 0.5"></div><div class="fg"><label>Unit</label><select id="f-funit-' + i + '">' +
    ['gal', 'qt', 'L', 'ml', 'lbs', 'kg', 'patty', 'frame'].map(function(u) {
      return '<option' + (un === u ? ' selected' : '') + '>' + u + '</option>';
    }).join('') + '</select></div></div>';
  h += '<div class="fg"><label>Supplements</label>' + makePills(sid, supOpts, sup) + '</div>';
  h += '<div class="fg" id="f-sother-wrap-' + i + '" style="display:none"><label>Describe supplement (Other)</label><input id="f-sother-' + i + '" value="' + esc(so) + '" placeholder="e.g. Brand name, custom mix…"></div>';
  h += '<div class="fg"><label>Observation / Notes</label><textarea id="f-fnotes-' + i + '" rows="3" placeholder="Feed check: uptake, feeder level, robbing, weather, anything unusual…">' + notes + '</textarea></div>';
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
      feedOther: gv('f-fother-' + i),
      supplement: getPill('sup-' + i) || 'None',
      supplementOther: gv('f-sother-' + i),
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
      feedOther: r.feedOther,
      supplement: r.supplement,
      supplementOther: r.supplementOther,
      amount: r.amount,
      unit: r.unit,
      notes: r.notes
    }, total));
  });
  setTimeout(initFeedingOtherVisibility, 0);
}

function appendFeedingFormRow() {
  var rows = collectFeedingRowsFromDOM();
  var last = rows[rows.length - 1] || {};
  rows.push({
    hiveId: last.hiveId || '',
    date: last.date || new Date().toISOString().slice(0, 10),
    feedType: 'Sugar syrup 1:1',
    feedOther: '',
    supplement: 'None',
    supplementOther: '',
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

function feedingPayloadFromRow(r, j) {
  var ft = r.feedType;
  var fo = (ft === 'Other') ? r.feedOther.trim() : '';
  if (ft === 'Other' && !fo) {
    alert('Entry ' + (j + 1) + ': describe the feed type when “Other” is selected');
    return null;
  }
  var sup = r.supplement || 'None';
  var so = (sup === 'Other') ? r.supplementOther.trim() : '';
  if (sup === 'Other' && !so) {
    alert('Entry ' + (j + 1) + ': describe the supplement when “Other” is selected');
    return null;
  }
  var amtStr = r.amount;
  var amt = amtStr === '' ? null : parseFloat(amtStr);
  if (amtStr !== '' && (isNaN(amt) || amt < 0)) {
    alert('Entry ' + (j + 1) + ': enter a valid amount or leave it blank');
    return null;
  }
  if (!r.hiveId || !r.date) {
    alert('Entry ' + (j + 1) + ': hive and date are required');
    return null;
  }
  return {
    hive_id: r.hiveId,
    date: r.date,
    feed_type: ft,
    feed_other: ft === 'Other' ? fo : null,
    supplement: sup,
    supplement_other: sup === 'Other' ? so : null,
    amount: amt,
    unit: amt != null ? r.unit : null,
    notes: r.notes
  };
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
      feedOther: item.feedOther || item.feed_other,
      supplement: item.supplement,
      supplementOther: item.supplementOther || item.supplement_other,
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
  setTimeout(initFeedingOtherVisibility, 0);
}

async function saveFeedingMulti() {
  var rows = collectFeedingRowsFromDOM();
  if (!rows.length) return;
  var payloads = [];
  for (var j = 0; j < rows.length; j++) {
    var obj = feedingPayloadFromRow(rows[j], j);
    if (!obj) return;
    payloads.push(obj);
  }
  for (var k = 0; k < payloads.length; k++) {
    var obj = payloads[k];
    var ins = await (typeof dbInsertSafe === 'function' ? dbInsertSafe('feedings', obj) : dbInsert('feedings', obj));
    if (ins) {
      DATA.feedings.push({
        ...ins,
        hiveId: ins.hive_id,
        feedType: ins.feed_type,
        feedOther: ins.feed_other,
        supplement: ins.supplement,
        supplementOther: ins.supplement_other
      });
    }
  }
  closeModal();
  renderAll();
}

async function saveFeeding(eid, isEdit) {
  var row = collectFeedingRowsFromDOM()[0];
  if (!row) return;
  var obj = feedingPayloadFromRow(row, 0);
  if (!obj) return;
  if (isEdit) {
    await (typeof dbUpdateSafe === 'function' ? dbUpdateSafe('feedings', eid, obj) : dbUpdate('feedings', eid, obj));
    var rw = DATA.feedings.find(function(x) { return x.id === eid; });
    if (rw) {
      Object.assign(rw, {
        ...obj,
        hiveId: obj.hive_id,
        feedType: obj.feed_type,
        feedOther: obj.feed_other,
        supplement: obj.supplement,
        supplementOther: obj.supplement_other
      });
    }
  } else {
    var ins = await (typeof dbInsertSafe === 'function' ? dbInsertSafe('feedings', obj) : dbInsert('feedings', obj));
    if (ins) {
      DATA.feedings.push({
        ...ins,
        hiveId: ins.hive_id,
        feedType: ins.feed_type,
        feedOther: ins.feed_other,
        supplement: ins.supplement,
        supplementOther: ins.supplement_other
      });
    }
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
