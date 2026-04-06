
// ═══════════════════════════════════════════════════════
// HIVE HISTORY
// ═══════════════════════════════════════════════════════
function openHiveHistory(hiveId) {
  var hive=DATA.hives.find(function(h){return h.id===hiveId;}); if(!hive) return;
  var insps=DATA.inspections.filter(function(i){return i.hiveId===hiveId;}).sort(function(a,b){return b.date.localeCompare(a.date);});
  var harvs=DATA.harvests.filter(function(v){return v.hiveId===hiveId;}).sort(function(a,b){return b.date.localeCompare(a.date);});
  var feeds=DATA.feedings.filter(function(f){return f.hiveId===hiveId;}).sort(function(a,b){return b.date.localeCompare(a.date);});
  var treats=DATA.treatments.filter(function(t){return t.hiveId===hiveId;}).sort(function(a,b){return b.date.localeCompare(a.date);});
  var h='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px"><div style="font-family:\'Playfair Display\',serif;font-size:21px;color:var(--bark)">📜 '+esc(hive.name)+'</div><button onclick="closeHiveHistory()" style="background:rgba(74,44,10,.1);border:none;border-radius:10px;padding:7px 13px;font-size:14px;cursor:pointer;color:var(--txt2)">✕ Close</button></div>';
  h+='<div style="font-family:\'Playfair Display\',serif;font-size:16px;color:var(--bark);margin:10px 0 8px">Inspections ('+insps.length+')</div>';
  if (insps.length) insps.forEach(function(i){
    h+='<div class="irow card" style="margin-bottom:8px"><div class="irow-hdr"><div><div class="irow-name">'+fmtDate(i.date)+'</div><div class="irow-date">'+esc(i.weather||'')+(i.weatherSnap?' · '+i.weatherSnap.temp+'°F':'')+'</div></div><span class="tag '+(i.queenSeen==='Yes ✓'?'t-ok':'t-warn')+'">Queen: '+esc(i.queenSeen)+'</span></div>';
    h+='<div class="stars-row"><div class="star-item"><div class="star-lbl">Pop</div><div class="star-val">'+starsHTML(i.population)+'</div></div><div class="star-item"><div class="star-lbl">Honey</div><div class="star-val">'+starsHTML(i.honey)+'</div></div><div class="star-item"><div class="star-lbl">Brood</div><div class="star-val">'+starsHTML(i.brood)+'</div></div></div>';
    if (i.actions) h+='<div class="irow-note"><strong>Actions:</strong> '+esc(i.actions)+'</div>';
    if (i.notes) h+='<div class="irow-note">'+esc(i.notes)+'</div>';
    h+='</div>';
  });
  else h+='<div style="font-size:13px;color:var(--txt2);font-style:italic;margin-bottom:10px">No inspections recorded.</div>';
  h+='<div style="font-family:\'Playfair Display\',serif;font-size:16px;color:var(--bark);margin:10px 0 8px">💊 Treatments ('+treats.length+')</div>';
  if (treats.length) treats.forEach(function(t){
    h+='<div class="treat-row card" style="margin-bottom:8px"><div class="treat-ico">💊</div><div class="treat-info"><div class="treat-name">'+esc(t.category||t.product)+'</div><div class="treat-meta">'+fmtDate(t.date)+' · '+esc(t.product)+(t.duration?' · '+esc(t.duration):'')+'</div></div></div>';
  });
  else h+='<div style="font-size:13px;color:var(--txt2);font-style:italic;margin-bottom:10px">No treatments recorded.</div>';
  h+='<div style="font-family:\'Playfair Display\',serif;font-size:16px;color:var(--bark);margin:10px 0 8px">🥣 Feeding ('+feeds.length+')</div>';
  if (feeds.length) feeds.forEach(function(f){
    var ftype=esc(f.feedType||f.feed_type||'Feeding');
    var amt=(f.amount!=null&&f.amount!==''&&!isNaN(parseFloat(f.amount)))?parseFloat(f.amount)+' '+esc(f.unit||''):'';
    var sup=f.supplement;
    var supPart=(sup&&sup!=='None')?' · '+esc(sup):'';
    var notePart=f.notes?'<div style="font-size:12px;color:var(--txt2);margin-top:4px;white-space:pre-wrap">'+esc(f.notes)+'</div>':'';
    h+='<div class="harv-row card" style="margin-bottom:8px"><div class="harv-ico" style="font-size:18px">🥣</div><div class="harv-info"><div class="harv-name">'+fmtDate(f.date)+'</div><div class="harv-meta">'+ftype+(amt?' · '+amt:'')+supPart+'</div>'+notePart+'</div></div>';
  });
  else h+='<div style="font-size:13px;color:var(--txt2);font-style:italic;margin-bottom:10px">No feeding records.</div>';
  h+='<div style="font-family:\'Playfair Display\',serif;font-size:16px;color:var(--bark);margin:10px 0 8px">🍯 Harvests ('+harvs.length+')</div>';
  if (harvs.length) harvs.forEach(function(v){
    h+='<div class="harv-row card" style="margin-bottom:8px"><div class="harv-ico">🍯</div><div class="harv-info"><div class="harv-name">'+fmtDate(v.date)+'</div><div class="harv-meta">'+esc(v.type||'Honey')+(v.notes?' · '+esc(v.notes):'')+'</div></div><div class="harv-yield">'+v.yield+' '+esc(v.unit)+'</div></div>';
  });
  else h+='<div style="font-size:13px;color:var(--txt2);font-style:italic">No harvests recorded.</div>';
  document.getElementById('hist-inner').innerHTML = h;
  document.getElementById('hist-overlay').classList.add('open');
}
function closeHiveHistory() { document.getElementById('hist-overlay').classList.remove('open'); }
document.getElementById('hist-overlay').addEventListener('click', function(e){ if(e.target===this) closeHiveHistory(); });
