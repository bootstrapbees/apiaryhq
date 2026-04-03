// ═══════════════════════════════════════════════════════
// HARVEST MODAL
// ═══════════════════════════════════════════════════════
function openHarvestModal(item) {
  if (!DATA.hives.length) { alert('Please add a hive first!'); return; }
  var edit = !!item;
  var today = new Date().toISOString().slice(0,10);
  var opts = DATA.hives.map(function(h){return '<option value="'+h.id+'"'+(item&&item.hiveId===h.id?' selected':'')+'>'+esc(h.name)+'</option>';}).join('');
  var h = '<div class="modal-title">'+(edit?'Edit':'Log')+' Harvest</div>';
  h += '<div class="fg"><label>Hive</label><select id="f-vhive">'+opts+'</select></div>';
  h += '<div class="fg"><label>Date</label><input id="f-vdate" type="date" value="'+(edit?item.date:today)+'"></div>';
  h += '<div class="row2"><div class="fg"><label>Yield</label><input id="f-vyield" type="number" step="0.1" min="0" value="'+(edit?item.yield:'')+'" placeholder="12.5"></div><div class="fg"><label>Unit</label><select id="f-vunit"><option '+(edit&&item.unit==='lbs'?'selected':'')+(''===_prefs.units?' selected':'')+'>lbs</option><option '+(edit&&item.unit==='kg'?'selected':'')+(_prefs.units==='kg'?' selected':'')+'>kg</option><option '+(edit&&item.unit==='jars'?'selected':'')+(_prefs.units==='jars'?' selected':'')+'>jars</option><option '+(edit&&item.unit==='frames'?'selected':'')+(_prefs.units==='frames'?' selected':'')+'>frames</option></select></div></div>';
  h += '<div class="fg"><label>Product Type</label>'+makePills('vty',['Honey','Beeswax','Propolis','Pollen','Other'],edit?item.type||'Honey':'Honey')+'</div>';
  h += '<div class="fg"><label>Notes</label><input id="f-vnotes" value="'+(edit?esc(item.notes||''):'')+'" placeholder="e.g. Spring harvest, light floral"></div>';
  h += '<button class="btn btn-p" onclick="saveHarvest(\''+(edit?item.id:'')+'\','+(edit?1:0)+')">'+(edit?'Save Changes':'Log Harvest 🍯')+'</button>';
  if (edit) h += '<button class="btn btn-d" onclick="deleteHarvest(\''+item.id+'\')">Delete</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}
async function saveHarvest(eid, isEdit) {
  var yld = parseFloat(gv('f-vyield'));
  if (!yld) { alert('Enter a yield amount'); return; }
  var obj = {hive_id:gv('f-vhive'),date:gv('f-vdate'),yield:yld,unit:gv('f-vunit'),type:getPill('vty'),notes:gv('f-vnotes')};
  if (isEdit) {
    await (typeof dbUpdateSafe==='function'?dbUpdateSafe('harvests',eid,obj):dbUpdate('harvests',eid,obj));
    Object.assign(DATA.harvests.find(function(x){return x.id===eid;}),{...obj,hiveId:obj.hive_id});
  } else {
    var row=await (typeof dbInsertSafe==='function'?dbInsertSafe('harvests',obj):dbInsert('harvests',obj));
    if (row) {
      DATA.harvests.push({...row,hiveId:row.hive_id});
      await saveHarvestReminders(row, obj);
    }
  }
  closeModal(); renderAll();
}
function deleteHarvest(id) {
  confirmDelete('Delete this harvest record?', async function(){
    await dbDelete('harvests',id); DATA.harvests=DATA.harvests.filter(function(x){return x.id!==id;}); renderAll();
  });
}
