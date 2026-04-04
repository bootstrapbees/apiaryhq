
// ═══════════════════════════════════════════════════════
// CONTACTS
// ═══════════════════════════════════════════════════════
window._contactFilter = 'All';
function filterContacts(cat, btn) {
  window._contactFilter = cat;
  document.querySelectorAll('#contact-filter-row .pill').forEach(function(p){p.classList.remove('active');});
  if (btn) btn.classList.add('active');
  renderAll();
}


function openContactModal(contact) {
  var edit = !!contact;
  var h = '<div class="modal-title">'+(edit?'Edit':'Add')+' Contact</div>';
  h += '<div class="fg"><label>Name</label><input id="f-cname" value="'+esc(contact?contact.name||'':'')+'" placeholder="Full name or business"></div>';
  h += '<div class="fg"><label>Role / Category</label>'+makePills('crol',['Supplier','Veterinarian','Inspector','Customer','Fellow Beekeeper','Other'],contact?contact.role||'Supplier':'Supplier')+'</div>';
  h += '<div class="row2"><div class="fg"><label>Phone</label><input id="f-cphone" type="tel" value="'+esc(contact?contact.phone||'':'')+'" placeholder="(555) 000-0000"></div><div class="fg"><label>Email</label><input id="f-cemail" type="email" value="'+esc(contact?contact.email||'':'')+'" placeholder="name@email.com"></div></div>';
  h += '<div class="fg"><label>Address</label><input id="f-caddr" value="'+esc(contact?contact.address||'':'')+'" placeholder="Street, City, State"></div>';
  h += '<div class="fg"><label>Website</label><input id="f-cweb" type="url" value="'+esc(contact?contact.website||'':'')+'" placeholder="https://…"></div>';
  h += '<div class="fg"><label>Notes</label><textarea id="f-cnotes">'+esc(contact?contact.notes||'':'')+'</textarea></div>';
  h += '<button class="btn btn-p" onclick="saveContact(\''+(edit?contact.id:'')+'\','+(edit?1:0)+')">'+(edit?'Save Changes':'Add Contact 👤')+'</button>';
  if (edit) h += '<button class="btn btn-d" onclick="deleteContact(\''+contact.id+'\')">Delete</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}
async function saveContact(eid, isEdit) {
  var name=gv('f-cname');
  if (!name) { alert('Enter a name'); return; }
  var obj={name,role:getPill('crol'),phone:gv('f-cphone'),email:gv('f-cemail'),address:gv('f-caddr'),website:gv('f-cweb'),notes:gv('f-cnotes')};
  if (isEdit) {
    await dbUpdate('contacts',eid,obj); Object.assign(DATA.contacts.find(function(x){return x.id===eid;}),obj);
  } else {
    var row=await dbInsert('contacts',obj); if(row) DATA.contacts.push(row);
  }
  closeModal(); renderAll();
}
function deleteContact(id) {
  confirmDelete('Delete this contact?', async function(){
    await dbDelete('contacts',id); DATA.contacts=DATA.contacts.filter(function(c){return c.id!==id;}); renderAll();
  });
}
