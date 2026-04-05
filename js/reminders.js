
// ═══════════════════════════════════════════════════════
// REMINDERS MODAL (unified task + supply)
// ═══════════════════════════════════════════════════════
function openReminderModal(item) {
  var edit = !!item;
  var today = new Date().toISOString().slice(0,10);
  var hiveOpts = DATA.hives.map(function(h){return '<option value="'+h.id+'"'+(item&&item.hiveId===h.id?' selected':'')+'>'+esc(h.name)+'</option>';}).join('');
  var suppliers = DATA.contacts.filter(function(c){return c.role==='Supplier';});
  var supOpts = suppliers.map(function(s){return '<option value="'+s.id+'"'+(item&&item.supplierId===s.id?' selected':'')+'>'+esc(s.name)+'</option>';}).join('');
  var remType = item ? (item.remType||'Inspection') : 'Inspection';
  var h = '<div class="modal-title">'+(edit?'Edit':'New')+' Reminder</div>';
  h += '<div class="fg"><label>Type</label>'+makePills('rty',['Inspection','Treatment','Supply Purchase','General Task'],remType)+'</div>';
  h += (DATA.hives.length ? '<div class="fg"><label>Hive (optional)</label><select id="f-rhive"><option value="">— All / N/A —</option>'+hiveOpts+'</select></div>' : '');
  h += '<div class="fg"><label>Due Date</label><input id="f-rdate" type="date" value="'+(edit?item.nextDate||today:today)+'"></div>';
  h += '<div class="fg"><label>Notes / Description</label><textarea id="f-rnotes">'+esc(item?item.notes||'':'')+'</textarea></div>';
  h += '<div id="supply-fields" style="margin-top:2px">';
  h += '<div style="padding:12px;background:rgba(37,99,168,.06);border-radius:12px;border:1px solid rgba(37,99,168,.15)">';
  h += '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--blu);margin-bottom:10px">🛒 Supply / Purchase Details</div>';
  h += '<div class="fg"><label>Item Name</label><input id="f-ritem" value="'+esc(item?item.itemName||'':'')+'" placeholder="e.g. Apivar strips, sugar, etc."></div>';
  h += '<div class="row2"><div class="fg"><label>Qty</label><input id="f-rqty" type="number" value="'+esc(item?item.itemQty||'':'')+'" placeholder="1"></div><div class="fg"><label>Est. Cost ('+_prefs.currency+')</label><input id="f-rcost" type="number" step="0.01" value="'+esc(item?item.itemCost||'':'')+'" placeholder="0.00"></div></div>';
  h += (supOpts ? '<div class="fg"><label>Supplier (from Contacts)</label><select id="f-rsupplier"><option value="">— None —</option>'+supOpts+'</select></div>' : '');
  h += '</div></div>';
  h += '<button class="btn btn-p" onclick="saveReminder(\''+(edit?item.id:'')+'\','+(edit?1:0)+')">'+(edit?'Save Changes':'Add Reminder 🔔')+'</button>';
  if (edit && !item.completed) h += '<button class="btn btn-s" onclick="completeReminder(\''+item.id+'\')">✅ Mark Complete</button>';
  if (edit) h += '<button class="btn btn-d" onclick="deleteReminder(\''+item.id+'\')">Delete</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}
async function saveReminder(eid, isEdit) {
  var remType = getPill('rty') || 'Inspection';
  var hiveId = gv('f-rhive') || null;
  var obj = {rem_type:remType,hive_id:hiveId,next_date:gv('f-rdate'),notes:gv('f-rnotes'),item_name:gv('f-ritem'),item_qty:gv('f-rqty'),item_cost:parseFloat(gv('f-rcost'))||null,supplier_id:gv('f-rsupplier')||null,completed:false,added_to_finance:false};
  if (isEdit) {
    await (typeof dbUpdateSafe==='function'?dbUpdateSafe('reminders',eid,obj):dbUpdate('reminders',eid,obj));
    Object.assign(DATA.reminders.find(function(x){return x.id===eid;}),{...obj,hiveId:obj.hive_id,nextDate:obj.next_date,remType:obj.rem_type,itemName:obj.item_name,itemCost:obj.item_cost,itemQty:obj.item_qty,supplierId:obj.supplier_id});
  } else {
    var row=await (typeof dbInsertSafe==='function'?dbInsertSafe('reminders',obj):dbInsert('reminders',obj));
    if (row) DATA.reminders.push({...row,hiveId:row.hive_id,nextDate:row.next_date,remType:row.rem_type,itemName:row.item_name,itemCost:row.item_cost,itemQty:row.item_qty,supplierId:row.supplier_id,addedToFinance:row.added_to_finance});
  }
  closeModal(); renderAll();
}
async function completeReminder(id) {
  var rem = DATA.reminders.find(function(r){return r.id===id;});
  if (!rem) return;
  await dbUpdate('reminders', id, {completed:true});
  rem.completed = true;
  closeModal();
  // If supply type with cost, prompt to add to finance
  if ((rem.remType==='Supply Purchase' || rem.remType==='Treatment') && rem.itemCost) {
    promptAddToFinance(rem);
  } else {
    renderAll();
  }
}
function promptAddToFinance(rem) {
  var h = '<div class="modal-title">Add to Finance?</div>';
  h += '<div style="font-size:14px;color:var(--txt2);margin-bottom:16px;line-height:1.6">You completed <strong>'+esc(rem.itemName||rem.notes||'task')+'</strong>';
  if (rem.itemCost) h += ' with an estimated cost of <strong>'+_prefs.currency+parseFloat(rem.itemCost).toFixed(2)+'</strong>';
  h += '. Would you like to add this as an expense in Finance?</div>';
  h += '<button class="btn btn-p" onclick="addReminderToFinance(\''+rem.id+'\')">Yes, Add to Finance 💰</button>';
  h += '<button class="btn btn-c" onclick="closeModal();renderAll();">No Thanks</button>';
  openModal(h);
}
async function addReminderToFinance(remId) {
  var rem = DATA.reminders.find(function(r){return r.id===remId;});
  if (!rem) return;
  var desc = rem.itemName || rem.notes || 'Supply purchase';
  var contact = rem.supplierId ? DATA.contacts.find(function(c){return c.id===rem.supplierId;}) : null;
  var obj = {type:'expense',amount:parseFloat(rem.itemCost)||0,description:desc,date:new Date().toISOString().slice(0,10),category:'Supplies',notes:'Auto-added from completed reminder',vendor_name:contact?contact.name:'',vendor_phone:contact?contact.phone:'',vendor_website:contact?contact.website:''};
  var row=await dbInsert('transactions',obj);
  if (row) DATA.transactions.push({...row,desc:row.description});
  await dbUpdate('reminders',remId,{added_to_finance:true});
  rem.addedToFinance = true;
  closeModal(); renderAll();
}
function deleteReminder(id) {
  confirmDelete('Delete this reminder?', async function(){
    await dbDelete('reminders',id); DATA.reminders=DATA.reminders.filter(function(r){return r.id!==id;}); renderAll();
  });
}
