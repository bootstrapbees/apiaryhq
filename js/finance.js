
// ═══════════════════════════════════════════════════════
// TRANSACTION MODAL
// ═══════════════════════════════════════════════════════
function openTxnModal(txn) {
  var edit = !!txn;
  var today = new Date().toISOString().slice(0,10);
  var cur = _prefs.currency;
  var h = '<div class="modal-title">'+(edit?'Edit':'Add')+' Transaction</div>';
  h += '<div class="fg"><label>Type</label>'+makePills('tty',['Income','Expense'],txn?(txn.type==='income'?'Income':'Expense'):'Expense')+'</div>';
  h += '<div class="fg"><label>Amount ('+cur+')</label><input id="f-tamt" type="number" step="0.01" placeholder="0.00" value="'+esc(txn?txn.amount||'':'')+'"></div>';
  h += '<div class="fg"><label>Description</label><input id="f-tdesc" placeholder="e.g. Honey harvest sale" value="'+esc(txn?txn.desc||'':'')+'"></div>';
  h += '<div class="fg"><label>Date</label><input id="f-tdate" type="date" value="'+(txn?txn.date:today)+'"></div>';
  h += '<div class="fg"><label>Category</label><select id="f-tcat"><optgroup label="Income"><option'+(txn&&txn.category==='Honey Sales'?' selected':'')+'>Honey Sales</option><option'+(txn&&txn.category==='Beeswax Sales'?' selected':'')+'>Beeswax Sales</option><option'+(txn&&txn.category==='Nucleus Sale'?' selected':'')+'>Nucleus Sale</option><option'+(txn&&txn.category==='Pollination Fee'?' selected':'')+'>Pollination Fee</option><option'+(txn&&txn.category==='Other Income'?' selected':'')+'>Other Income</option></optgroup><optgroup label="Expenses"><option'+(txn&&txn.category==='Equipment'?' selected':'')+'>Equipment</option><option'+(txn&&txn.category==='Feed / Sugar'?' selected':'')+'>Feed / Sugar</option><option'+(txn&&txn.category==='Medications'?' selected':'')+'>Medications</option><option'+(txn&&txn.category==='Hive Purchase'?' selected':'')+'>Hive Purchase</option><option'+(txn&&txn.category==='Protective Gear'?' selected':'')+'>Protective Gear</option><option'+(txn&&txn.category==='Supplies'?' selected':'')+'>Supplies</option><option'+(txn&&txn.category==='Transport'?' selected':'')+'>Transport</option><option'+(txn&&txn.category==='Other'?' selected':'')+'>Other</option></optgroup></select></div>';
  h += '<div class="fg"><label>Notes</label><input id="f-tnotes" placeholder="Optional notes" value="'+esc(txn?txn.notes||'':'')+'"></div>';
  h += '<div style="margin:14px 0 8px;padding:12px;background:rgba(232,160,32,.08);border-radius:12px;border:1px solid rgba(232,160,32,.2)">';
  h += '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--txt2);margin-bottom:10px">🏪 Vendor / Payee</div>';
  // Supplier from contacts
  var suppliers = DATA.contacts.filter(function(c){return c.role==='Supplier'||c.role==='supplier';});
  if (suppliers.length) {
    h += '<div class="fg"><label>Select Supplier (optional)</label><select id="f-tvcontact" onchange="fillVendorFromContact()"><option value="">— Type manually below —</option>'+suppliers.map(function(s){return '<option value="'+s.id+'">'+esc(s.name)+'</option>';}).join('')+'</select></div>';
  }
  h += '<div class="fg"><label>Vendor Name</label><input id="f-tvname" placeholder="e.g. Mann Lake Ltd" value="'+esc(txn?txn.vendor_name||'':'')+'"></div>';
  h += '<div class="fg"><label>Address</label><input id="f-tvaddr" placeholder="e.g. 501 S Hwy 61, Hackensack MN" value="'+esc(txn?txn.vendor_address||'':'')+'"></div>';
  h += '<div class="row2"><div class="fg"><label>Phone</label><input id="f-tvphone" type="tel" placeholder="(800) 555-0100" value="'+esc(txn?txn.vendor_phone||'':'')+'"></div><div class="fg"><label>Website</label><input id="f-tvweb" type="url" placeholder="https://…" value="'+esc(txn?txn.vendor_website||'':'')+'"></div></div>';
  h += '</div>';
  h += '<button class="btn btn-p" onclick="saveTxn(\''+(edit?txn.id:'')+'\','+(edit?1:0)+')">'+(edit?'Save Changes':'Add Transaction 💰')+'</button>';
  if (edit) h += '<button class="btn btn-d" onclick="deleteTxn(\''+txn.id+'\')">Delete</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}
function fillVendorFromContact() {
  var sel = document.getElementById('f-tvcontact');
  if (!sel || !sel.value) return;
  var contact = DATA.contacts.find(function(c){return c.id===sel.value;});
  if (!contact) return;
  var nm = document.getElementById('f-tvname'); if(nm) nm.value = contact.name||'';
  var ph = document.getElementById('f-tvphone'); if(ph) ph.value = contact.phone||'';
  var wb = document.getElementById('f-tvweb'); if(wb) wb.value = contact.website||'';
  var ad = document.getElementById('f-tvaddr'); if(ad) ad.value = contact.address||'';
}
async function saveTxn(eid, isEdit) {
  var amt=parseFloat(gv('f-tamt')), desc=gv('f-tdesc');
  if (!amt||!desc) { alert('Please enter amount and description'); return; }
  var vname=gv('f-tvname'), vaddr=gv('f-tvaddr'), vphone=gv('f-tvphone'), vweb=gv('f-tvweb');
  var obj={type:getPill('tty')==='Income'?'income':'expense',amount:amt,description:desc,date:gv('f-tdate'),category:gv('f-tcat'),notes:gv('f-tnotes'),vendor_name:vname,vendor_address:vaddr,vendor_phone:vphone,vendor_website:vweb};
  if (isEdit) {
    await dbUpdate('transactions',eid,obj); Object.assign(DATA.transactions.find(function(x){return x.id===eid;}),{...obj,desc:obj.description});
  } else {
    var row=await dbInsert('transactions',obj); if(row) DATA.transactions.push({...row,desc:row.description});
  }
  if (vname) {
    var exists = DATA.contacts.find(function(c){ return c.name.toLowerCase()===vname.toLowerCase(); });
    if (!exists) {
      // Create new contact from vendor info
      var cobj={name:vname, role:'Supplier', phone:vphone||'', email:'', website:vweb||'', address:vaddr||'', notes:'Added from Finance'};
      var crow=await dbInsert('contacts',cobj);
      if (crow) DATA.contacts.push(crow);
    } else {
      // Update existing contact's missing fields with any new info entered
      var updates = {};
      if (vweb && !exists.website) updates.website = vweb;
      if (vphone && !exists.phone) updates.phone = vphone;
      if (vaddr && !exists.address) updates.address = vaddr;
      if (Object.keys(updates).length) {
        await dbUpdate('contacts', exists.id, updates);
        Object.assign(exists, updates);
      }
    }
  }
  closeModal(); renderAll();
}
function deleteTxn(id) {
  confirmDelete('Delete this transaction?', async function(){
    await dbDelete('transactions',id); DATA.transactions=DATA.transactions.filter(function(t){return t.id!==id;}); renderAll();
  });
}
