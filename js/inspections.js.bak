// ═══════════════════════════════════════════════════════
// SMART AUTO-REMINDERS FROM INSPECTION DATA
// ═══════════════════════════════════════════════════════
function addDays(dateStr, days) {
  var d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0,10);
}

async function autoGenerateReminders(savedRow, obj) {
  var hive = DATA.hives.find(function(h){return h.id===obj.hive_id;});
  var hiveName = hive ? hive.name : 'Hive';
  var inspDate = obj.date;
  var remindersAdded = [];

  // ── 1. VARROA CHECK REMINDER ──────────────────────────
  // If varroa was checked, remind to recheck in 21 days (one brood cycle)
  if (obj.varroa && obj.varroa !== 'Not checked') {
    var varroaLevel = obj.varroa.toLowerCase();
    var daysUntilCheck = 21;
    var urgencyNote = 'Routine brood-cycle Varroa recheck.';
    if (varroaLevel.includes('high')) {
      daysUntilCheck = 7;
      urgencyNote = '⚠️ High mite load detected — verify treatment efficacy.';
    } else if (varroaLevel.includes('medium')) {
      daysUntilCheck = 14;
      urgencyNote = 'Moderate mites — monitor closely, consider treatment.';
    }
    var varroaRem = {
      hive_id: obj.hive_id,
      next_date: addDays(inspDate, daysUntilCheck),
      rem_type: 'Inspection',
      notes: hiveName + ': Varroa alcohol wash recheck. ' + urgencyNote,
      item_name: null, item_cost: null, item_qty: null, supplier_id: null
    };
    var vRow = await dbInsert('reminders', varroaRem);
    if (vRow) {
      DATA.reminders.push({...vRow, hiveId:vRow.hive_id, nextDate:vRow.next_date, remType:vRow.rem_type, itemName:null, itemCost:null, itemQty:null, supplierId:null, addedToFinance:false});
      remindersAdded.push('Varroa recheck in ' + daysUntilCheck + ' days');
    }
  }

  // ── 2. QUEEN CHECK REMINDER ─────────────────────────
  // If no queen seen, check again in 5 days
  if (obj.queen_seen === 'No ✗') {
    var queenRem = {
      hive_id: obj.hive_id,
      next_date: addDays(inspDate, 5),
      rem_type: 'Inspection',
      notes: hiveName + ': Queen not seen — re-inspect for signs of queen or eggs in 5 days.',
      item_name: null, item_cost: null, item_qty: null, supplier_id: null
    };
    var qRow = await dbInsert('reminders', queenRem);
    if (qRow) {
      DATA.reminders.push({...qRow, hiveId:qRow.hive_id, nextDate:qRow.next_date, remType:qRow.rem_type, itemName:null, itemCost:null, itemQty:null, supplierId:null, addedToFinance:false});
      remindersAdded.push('Queen check in 5 days');
    }
  }

  // ── 3. LOW HONEY STORES REMINDER ─────────────────────
  // If honey stores are 1-2 stars, remind to feed in 3 days
  if (obj.honey && Number(obj.honey) <= 2) {
    var feedRem = {
      hive_id: obj.hive_id,
      next_date: addDays(inspDate, 3),
      rem_type: 'Task',
      notes: hiveName + ': Low honey stores (' + obj.honey + '/5) — check feed levels and refill syrup or patties as needed.',
      item_name: 'Sugar syrup / feed', item_cost: null, item_qty: null, supplier_id: null
    };
    var fRow = await dbInsert('reminders', feedRem);
    if (fRow) {
      DATA.reminders.push({...fRow, hiveId:fRow.hive_id, nextDate:fRow.next_date, remType:fRow.rem_type, itemName:fRow.item_name, itemCost:null, itemQty:null, supplierId:null, addedToFinance:false});
      remindersAdded.push('Feed check in 3 days');
    }
  }

  // ── 4. LOW POPULATION REMINDER ───────────────────────
  // If population is 1 star, inspect again in 7 days
  if (obj.population && Number(obj.population) <= 1) {
    var popRem = {
      hive_id: obj.hive_id,
      next_date: addDays(inspDate, 7),
      rem_type: 'Inspection',
      notes: hiveName + ': Very low population — re-inspect in 7 days. Check for disease, queen failure, or absconding.',
      item_name: null, item_cost: null, item_qty: null, supplier_id: null
    };
    var pRow = await dbInsert('reminders', popRem);
    if (pRow) {
      DATA.reminders.push({...pRow, hiveId:pRow.hive_id, nextDate:pRow.next_date, remType:pRow.rem_type, itemName:null, itemCost:null, itemQty:null, supplierId:null, addedToFinance:false});
      remindersAdded.push('Low population check in 7 days');
    }
  }

  // ── 5. DEFENSIVE TEMPERAMENT ─────────────────────────
  if (obj.temperament === 'Defensive') {
    var tempRem = {
      hive_id: obj.hive_id,
      next_date: addDays(inspDate, 14),
      rem_type: 'Inspection',
      notes: hiveName + ': Defensive temperament noted — re-inspect in 14 days. Consider requeening if behavior persists.',
      item_name: null, item_cost: null, item_qty: null, supplier_id: null
    };
    var tRow = await dbInsert('reminders', tempRem);
    if (tRow) {
      DATA.reminders.push({...tRow, hiveId:tRow.hive_id, nextDate:tRow.next_date, remType:tRow.rem_type, itemName:null, itemCost:null, itemQty:null, supplierId:null, addedToFinance:false});
      remindersAdded.push('Temperament follow-up in 14 days');
    }
  }

  // ── 6. ROUTINE NEXT INSPECTION ───────────────────────
  // Always schedule next inspection in 14 days (good beekeeping practice)
  var routineRem = {
    hive_id: obj.hive_id,
    next_date: addDays(inspDate, 14),
    rem_type: 'Inspection',
    notes: hiveName + ': Routine next inspection (14-day cycle).',
    item_name: null, item_cost: null, item_qty: null, supplier_id: null
  };
  var rRow = await dbInsert('reminders', routineRem);
  if (rRow) {
    DATA.reminders.push({...rRow, hiveId:rRow.hive_id, nextDate:rRow.next_date, remType:rRow.rem_type, itemName:null, itemCost:null, itemQty:null, supplierId:null, addedToFinance:false});
    remindersAdded.push('Next inspection in 14 days');
  }

  // Show toast notification if any reminders were added
  if (remindersAdded.length > 0) {
    showAutoRemindToast(remindersAdded.length + ' smart reminder' + (remindersAdded.length>1?'s':'') + ' added');
  }
}

function showAutoRemindToast(msg) {
  var existing = document.querySelector('.auto-remind-toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.className = 'auto-remind-toast';
  toast.innerHTML = '<svg viewBox="0 0 16 16" fill="none" style="width:14px;height:14px;vertical-align:-2px;margin-right:5px" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 8l2 2L10.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' + msg;
  document.body.appendChild(toast);
  setTimeout(function(){ toast.classList.add('show'); }, 50);
  setTimeout(function(){ toast.classList.remove('show'); setTimeout(function(){ toast.remove(); }, 400); }, 3500);
}
function deleteInsp(id) {
  confirmDelete('Delete this inspection report?', async function(){
    await dbDelete('inspections',id);
    DATA.inspections=DATA.inspections.filter(function(i){return i.id!==id;}); renderAll();
  });
}
