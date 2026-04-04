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
  h += '<div class="fg"><label>Species</label>'+makePills('hsp',['Italian','Carniolan','Buckfast','Russian','Other'],hive?hive.species||'Italian':'Italian')+'</div>';
  h += '<div class="fg"><label>Status</label>'+makePills('hst',['Healthy','Monitoring','Weak','Queenless'],hive?hive.status||'Healthy':'Healthy')+'</div>';
  h += '<div class="fg"><label>Notes</label><textarea id="f-hnotes">'+esc(hive?hive.notes||'':'')+'</textarea></div>';
  h += '<div class="fg"><label>Photos</label><div class="pgal" id="pgal-h">'+buildGallery(tid)+'</div></div>';
  h += '<button class="btn btn-p" onclick="saveHive(\''+tid+'\','+(edit?1:0)+')">'+(edit?'Save Changes':'Add Hive')+'</button>';
  if (edit) h += '<button class="btn btn-d" onclick="deleteHive(\''+hive.id+'\')">Delete Hive</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}
async function saveHive(tid, isEdit) {
  var name = gv('f-hname');
  if (!name) { alert('Please enter a hive name'); return; }
  var obj = {name,location:gv('f-hloc'),year:gv('f-hyear'),boxes:gv('f-hboxes'),species:getPill('hsp'),status:getPill('hst'),notes:gv('f-hnotes')};
  if (isEdit) {
    await dbUpdate('hives', tid, obj);
    var hv = DATA.hives.find(function(x){return x.id===tid;}); Object.assign(hv, obj);
    if (PHOTOS[tid]) {
      for (var ep of PHOTOS[tid]) {
        if (/^p/.test(String(ep.id))) {
          var s=await dbInsert('photos',{context_id:tid,data_url:ep.dataUrl}); if(s) ep.id=s.id;
        }
      }
    }
  } else {
    var row = await dbInsert('hives', obj);
    if (row) {
      if (PHOTOS[tid]) { for(var p of PHOTOS[tid]){await dbInsert('photos',{context_id:row.id,data_url:p.dataUrl});} delete PHOTOS[tid]; }
      DATA.hives.push(row);
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
    renderAll();
  });
}

// ═══════════════════════════════════════════════════════
// INSPECTION MODAL
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
    wxBanner='<div class="fg"><label>Live Weather</label><div style="background:linear-gradient(135deg,#1a3a5c,#2563a8);border-radius:12px;padding:11px;color:#fff;font-size:13px;display:flex;align-items:center;gap:10px"><span style="font-size:22px">'+WX.icon+'</span><span>'+WX.temp+'°F · '+WX.desc+' · 💨'+WX.wind+'mph</span></div></div>';
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
  h += '<div class="fg"><label>Actions Taken</label><textarea id="f-iact" placeholder="e.g. Added super, treated for varroa…">'+(edit?esc(item.actions||''):'')+'</textarea></div>';
  h += '<div class="fg"><label>Notes</label><textarea id="f-inotes" placeholder="Observations…">'+(edit?esc(item.notes||''):'')+'</textarea></div>';
  h += '<div class="fg"><label>Photos</label><div class="pgal" id="pgal-h">'+buildGallery(tid)+'</div></div>';
  if (!edit) {
    h += '<div class="smart-rem-badge"><svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.3"/><path d="M4.5 7l2 2 3-3.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>Smart reminders will be auto-created from this inspection</div>';
  }
  h += '<button class="btn btn-p" onclick="saveInsp(\''+tid+'\','+(edit?1:0)+')">'+(edit?'Save Changes':'Save Inspection')+'</button>';
  if (edit) h += '<button class="btn btn-d" onclick="deleteInsp(\''+item.id+'\')">Delete</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}
async function saveInsp(tid, isEdit) {
  var hiveId=gv('f-ihive'), date=gv('f-idate');
  if (!date) { alert('Select a date'); return; }
  var WX=window._wx;
  var ws=WX?{temp:WX.temp,desc:WX.desc,wind:WX.wind,score:WX.score}:null;
  var obj={hive_id:hiveId,date,weather_snap:ws,weather:getPill('iwx'),queen_seen:getPill('iq'),population:getStar('ip'),honey:getStar('ih'),brood:getStar('ib'),temperament:getPill('itm'),varroa:getPill('iv'),actions:gv('f-iact'),notes:gv('f-inotes')};
  if (isEdit) {
    await dbUpdate('inspections', tid, obj);
    Object.assign(DATA.inspections.find(function(x){return x.id===tid;}), {...obj,hiveId:obj.hive_id,queenSeen:obj.queen_seen,weatherSnap:obj.weather_snap});
  } else {
    var row=await dbInsert('inspections',obj);
    if (row) {
      if (PHOTOS[tid]) { for(var p of PHOTOS[tid]){var s=await dbInsert('photos',{context_id:row.id,data_url:p.dataUrl}); if(s){PHOTOS[row.id]=PHOTOS[row.id]||[];PHOTOS[row.id].push({id:s.id,dataUrl:p.dataUrl});}} delete PHOTOS[tid]; }
      DATA.inspections.push({...row,hiveId:row.hive_id,queenSeen:row.queen_seen,weatherSnap:row.weather_snap});
      // Auto-generate smart reminders from inspection data
      await autoGenerateReminders(row, obj);
    }
  }
  closeModal(); renderAll();
}
