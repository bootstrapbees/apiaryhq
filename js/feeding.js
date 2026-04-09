// ═══════════════════════════════════════════════════════
// FEEDING LOG
// ═══════════════════════════════════════════════════════

var FEED_TYPES = ['1:1 Syrup','2:1 Syrup','Candy Board','Fondant','Pollen Patty','Dry Sugar','Other'];
var FEED_UNITS = ['qt','gal','lbs','oz','kg','patties'];
var FEED_SUPPLEMENTS = ['None','Honey-B-Healthy','HBH Super Plus','HBH Vitamin B','Nozevit Plus','Optima','Complete','AP23 / Brood Builder','Other'];

function openFeedingModal(item, keepHive, keepDate) {
  if (!DATA.hives.length) { alert('Please add a hive first!'); return; }
  var edit = !!item;
  var today = new Date().toISOString().slice(0,10);
  var defaultDate = keepDate || today;
  var opts = DATA.hives.map(function(h) {
    var sel = (item && item.hiveId === h.id) || (!item && keepHive && keepHive === h.id);
    return '<option value="' + h.id + '"' + (sel ? ' selected' : '') + '>' + esc(h.name) + '</option>';
  }).join('');

  var selectedType = item ? (item.feedType || item.feed_type || '1:1 Syrup') : '1:1 Syrup';
  var selectedSup  = item ? (item.supplement || 'None') : 'None';
  var selectedUnit = item ? (item.unit || 'qt') : 'qt';

  var h = '<div class="modal-title">' + (edit ? 'Edit' : 'Log') + ' Feeding</div>';
  h += '<div class="fg"><label>Hive</label><select id="f-feed-hive">' + opts + '</select></div>';
  h += '<div class="fg"><label>Date</label><input id="f-feed-date" type="date" value="' + (edit ? (item.date || today) : defaultDate) + '"></div>';
  h += '<div class="fg"><label>Feed Type</label>' + makePills('feedtype', FEED_TYPES, selectedType) + '</div>';
  h += '<div class="fg" id="fg-feed-other" style="' + (selectedType === 'Other' ? '' : 'display:none') + '">';
  h += '<label>Specify Feed Type</label><input id="f-feed-other" value="' + esc(item ? (item.feedOther || item.feed_other || '') : '') + '" placeholder="e.g. Mega Bee patty"></div>';
  h += '<div class="row2">';
  h += '<div class="fg"><label>Amount</label><input id="f-feed-amount" type="number" step="0.1" min="0" value="' + esc(item ? (item.amount != null ? item.amount : '') : '') + '" placeholder="e.g. 1"></div>';
  h += '<div class="fg"><label>Unit</label>' + makePills('feedunit', FEED_UNITS, selectedUnit) + '</div>';
  h += '</div>';
  h += '<div class="fg"><label>Supplement Added</label>' + makePills('feedsup', FEED_SUPPLEMENTS, selectedSup) + '</div>';
  h += '<div class="fg" id="fg-sup-other" style="' + (selectedSup === 'Other' ? '' : 'display:none') + '">';
  h += '<label>Specify Supplement</label><input id="f-feed-sup-other" value="' + esc(item ? (item.supplementOther || item.supplement_other || '') : '') + '" placeholder="e.g. Fumagilin-B"></div>';
  h += '<div class="fg"><label>Notes</label><textarea id="f-feed-notes" placeholder="Feeder type, observations...">' + esc(item ? (item.notes || '') : '') + '</textarea></div>';
  h += '<button class="btn btn-p" onclick="saveFeeding(\'' + (edit ? item.id : '') + '\',' + (edit ? 1 : 0) + ',false)">' + (edit ? 'Save Changes' : 'Log Feeding') + '</button>';
  if (!edit) {
    h += '<button class="btn" style="background:var(--moss);color:#fff" onclick="saveFeeding(\'\',0,true)">+ Log Another</button>';
  }
  if (edit) h += '<button class="btn btn-d" onclick="deleteFeeding(\'' + item.id + '\')">Delete</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';

  openModal(h);

  setTimeout(function() {
    document.querySelectorAll('#pill-feedtype .pill').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var fg = document.getElementById('fg-feed-other');
        if (fg) fg.style.display = btn.textContent.trim() === 'Other' ? '' : 'none';
      });
    });
    document.querySelectorAll('#pill-feedsup .pill').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var fg = document.getElementById('fg-sup-other');
        if (fg) fg.style.display = btn.textContent.trim() === 'Other' ? '' : 'none';
      });
    });
  }, 50);
}

async function saveFeeding(eid, isEdit, logAnother) {
  var hiveId = gv('f-feed-hive');
  var date   = gv('f-feed-date');
  if (!date) { alert('Please enter a date'); return; }

  var feedType        = getPill('feedtype') || '1:1 Syrup';
  var feedOther       = gv('f-feed-other');
  var amount          = gv('f-feed-amount');
  var unit            = getPill('feedunit') || 'qt';
  var supplement      = getPill('feedsup') || 'None';
  var supplementOther = gv('f-feed-sup-other');
  var notes           = gv('f-feed-notes');

  var obj = {
    hive_id:          hiveId,
    date:             date,
    feed_type:        feedType,
    feed_other:       feedOther,
    amount:           amount !== '' ? parseFloat(amount) : null,
    unit:             unit,
    supplement:       supplement,
    supplement_other: supplementOther,
    notes:            notes
  };

  if (isEdit) {
    await dbUpdate('feedings', eid, obj);
    var idx = DATA.feedings.findIndex(function(f) { return f.id === eid; });
    if (idx >= 0) {
      DATA.feedings[idx] = Object.assign(DATA.feedings[idx], obj, {
        hiveId:          obj.hive_id,
        feedType:        obj.feed_type,
        feedOther:       obj.feed_other,
        supplementOther: obj.supplement_other
      });
    }
  } else {
    var row = await dbInsert('feedings', obj);
    if (row) {
      DATA.feedings.push(Object.assign({}, row, {
        hiveId:          row.hive_id,
        feedType:        row.feed_type,
        feedOther:       row.feed_other,
        supplementOther: row.supplement_other
      }));
    }
  }

  if (logAnother) {
    // Re-open a fresh modal keeping the same hive and date
    openFeedingModal(null, hiveId, date);
  } else {
    closeModal();
    renderAll();
  }
}

function deleteFeeding(id) {
  confirmDelete('Delete this feeding record?', async function() {
    await dbDelete('feedings', id);
    DATA.feedings = DATA.feedings.filter(function(f) { return f.id !== id; });
    renderAll();
  });
}
