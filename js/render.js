
// ═══════════════════════════════════════════════════════
// RENDER ALL
// ═══════════════════════════════════════════════════════

// Inline SVG snippets for use in dynamically rendered HTML
var SVG = {
  edit:     '<svg viewBox="0 0 20 20" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:-2px" xmlns="http://www.w3.org/2000/svg"><path d="M14 3l3 3-9 9H5v-3l9-9z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  trash:    '<svg viewBox="0 0 20 20" fill="none" style="width:14px;height:14px;display:inline-block;vertical-align:-2px" xmlns="http://www.w3.org/2000/svg"><path d="M5 6h10l-1 11H6L5 6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 6h14M8 6V4h4v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  inspect:  '<svg viewBox="0 0 20 20" fill="none" style="width:13px;height:13px;display:inline-block;vertical-align:-2px" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><line x1="7" y1="7" x2="13" y2="7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="7" y1="13" x2="10" y2="13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  warn:     '<svg viewBox="0 0 20 20" fill="none" style="width:15px;height:15px;display:inline-block;vertical-align:-3px;flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L18 16H2L10 3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><line x1="10" y1="9" x2="10" y2="12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="10" cy="14" r="1" fill="currentColor"/></svg>',
  check:    '<svg viewBox="0 0 20 20" fill="none" style="width:15px;height:15px;display:inline-block;vertical-align:-3px;flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.6"/><path d="M6 10l3 3 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pin:      '<svg viewBox="0 0 20 20" fill="none" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M10 11s-5 4-5 7h10c0-3-5-7-5-7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  phone:    '<svg viewBox="0 0 20 20" fill="none" style="width:15px;height:15px;display:inline-block;vertical-align:-3px" xmlns="http://www.w3.org/2000/svg"><path d="M5 3h3l1.5 3.5-2 1.2a9 9 0 004.8 4.8l1.2-2L17 11.5V14a2 2 0 01-2 2C7.6 16 4 12.4 4 8a2 2 0 012-2l-.5-.5L5 3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  email:    '<svg viewBox="0 0 20 20" fill="none" style="width:15px;height:15px;display:inline-block;vertical-align:-3px" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M2 7l8 5 8-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  web:      '<svg viewBox="0 0 20 20" fill="none" style="width:15px;height:15px;display:inline-block;vertical-align:-3px" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/><ellipse cx="10" cy="10" rx="3.5" ry="8" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  download: '<svg viewBox="0 0 20 20" fill="none" style="width:13px;height:13px;display:inline-block;vertical-align:-2px" xmlns="http://www.w3.org/2000/svg"><path d="M10 3v10m0 0l-3-3m3 3l3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 15h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  doc:      '<svg viewBox="0 0 20 20" fill="none" style="width:22px;height:22px" xmlns="http://www.w3.org/2000/svg"><path d="M5 3h8l4 4v11H5V3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M13 3v4h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="7" y1="13" x2="13" y2="13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  treatment:'<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="2" width="4" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M5 7h10l1.5 11H3.5L5 7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="10" y1="11" x2="10" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8.5" y1="12.5" x2="11.5" y2="12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  honey:    '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px" xmlns="http://www.w3.org/2000/svg"><path d="M10 2L17 6V14L10 18L3 14V6L10 2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 7L12.5 8.5V11.5L10 13L7.5 11.5V8.5L10 7z" fill="currentColor" opacity=".3"/></svg>',
  income:   '<svg viewBox="0 0 20 20" fill="none" style="width:16px;height:16px" xmlns="http://www.w3.org/2000/svg"><path d="M10 15V5m0 0L6 9m4-4l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  expense:  '<svg viewBox="0 0 20 20" fill="none" style="width:16px;height:16px" xmlns="http://www.w3.org/2000/svg"><path d="M10 5v10m0 0l4-4m-4 4L6 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  remind:   '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px" xmlns="http://www.w3.org/2000/svg"><path d="M10 3a6 6 0 016 6v3.5l1.5 1.5H2.5L4 12.5V9a6 6 0 016-6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 17a2 2 0 004 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  supply:   '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h14l-1.5 10H4.5L3 6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 6V5a3 3 0 016 0v1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  task:     '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M7 10l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  art:      '<svg viewBox="0 0 20 20" fill="none" style="width:22px;height:22px" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.6"/><circle cx="7" cy="8.5" r="1.2" fill="currentColor" opacity=".5"/><circle cx="13" cy="8.5" r="1.2" fill="currentColor" opacity=".5"/><circle cx="10" cy="12.5" r="1.2" fill="currentColor" opacity=".5"/></svg>',
  tree:     '<svg viewBox="0 0 20 20" fill="none" style="width:16px;height:16px" xmlns="http://www.w3.org/2000/svg"><path d="M10 2l5 7H5l5-7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="currentColor" opacity=".15"/><path d="M10 7l5 8H5l5-8z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="currentColor" opacity=".15"/><line x1="10" y1="15" x2="10" y2="18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  grass:    '<svg viewBox="0 0 20 20" fill="none" style="width:16px;height:16px" xmlns="http://www.w3.org/2000/svg"><path d="M10 17V9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10 11C8 8 5 8 5 8s.5 4 5 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" opacity=".1"/><path d="M10 13c2-3 5-3 5-3s-.5 4-5 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" opacity=".1"/></svg>',
  flower:   '<svg viewBox="0 0 20 20" fill="none" style="width:16px;height:16px" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2.5" fill="currentColor" opacity=".3" stroke="currentColor" stroke-width="1.4"/><ellipse cx="10" cy="5" rx="2" ry="3" stroke="currentColor" stroke-width="1.3" opacity=".7"/><ellipse cx="10" cy="15" rx="2" ry="3" stroke="currentColor" stroke-width="1.3" opacity=".7"/><ellipse cx="5" cy="10" rx="3" ry="2" stroke="currentColor" stroke-width="1.3" opacity=".7"/><ellipse cx="15" cy="10" rx="3" ry="2" stroke="currentColor" stroke-width="1.3" opacity=".7"/></svg>',
};

function remTypeIcon(remType) {
  if (remType === 'Inspection') return SVG.inspect;
  if (remType === 'Treatment')  return SVG.treatment;
  if (remType === 'Supply Purchase') return SVG.supply;
  return SVG.task;
}

function renderAll() {
  var today = new Date().toISOString().slice(0,10);
  var income = DATA.transactions.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
  var expenses = DATA.transactions.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
  var net = income - expenses;
  var cur = _prefs.currency;

  // ── DASHBOARD ──
  var sg = document.getElementById('dash-stats');
  if (sg) {
    var overdue = DATA.reminders.filter(function(r){return !r.completed&&r.nextDate<today;}).length;
    sg.innerHTML =
      '<div class="card stat"><div class="n">'+DATA.hives.length+'</div><div class="l">Hives</div></div>'+
      '<div class="card stat"><div class="n">'+DATA.inspections.length+'</div><div class="l">Inspections</div></div>'+
      '<div class="card stat'+(overdue>0?' stat-alert':'')+'"><div class="n" style="'+(overdue>0?'color:var(--red)':'')+'">'+overdue+'</div><div class="l" style="'+(overdue>0?'color:var(--red)':'')+'">Overdue</div></div>';
  }

  // Alerts
  var alerts='';
  if (DATA.treatments.some(function(t){return t.diseaseType==='American Foulbrood';})) {
    alerts+='<div class="dash-alert">'+SVG.warn+' Active AFB record — contact your state apiary inspector immediately.</div>';
  }
  var treatFollowUp = DATA.treatments.filter(function(t){
    if (!t.date) return false;
    var fu = new Date(t.date); fu.setDate(fu.getDate()+21);
    return fu.toISOString().slice(0,10) < today;
  });
  treatFollowUp.forEach(function(t){
    var hive = DATA.hives.find(function(h){return h.id===t.hiveId;});
    alerts+='<div class="dash-alert">'+SVG.warn+' Follow-up wash overdue for <strong>'+(hive?esc(hive.name):'a hive')+'</strong> — '+esc(t.product||t.category||'treatment')+' applied '+fmtDate(t.date)+'.</div>';
  });
  var expiring = DATA.docs.filter(function(d){return d.expiry&&d.expiry<=new Date(Date.now()+30*864e5).toISOString().slice(0,10);});
  expiring.forEach(function(d){alerts+='<div class="dash-alert">'+SVG.warn+' Document expiring: <strong>'+esc(d.name)+'</strong> ('+fmtDate(d.expiry)+')</div>';});
  var da=document.getElementById('dash-alerts'); if(da) da.innerHTML=alerts;

  // Upcoming reminders
  var remDue = DATA.reminders.filter(function(r){return !r.completed;}).sort(function(a,b){return a.nextDate.localeCompare(b.nextDate);}).slice(0,5);
  var duc=document.getElementById('dash-upcoming');
  if (duc) duc.innerHTML = remDue.length ? remDue.map(function(r){
    var days=Math.ceil((new Date(r.nextDate)-new Date(today+'T00:00:00'))/864e5);
    var hive=DATA.hives.find(function(h){return h.id===r.hiveId;});
    var color=days<0?'var(--red)':days<=3?'var(--amber)':'var(--moss)';
    var dayLabel=days<0?Math.abs(days)+'d late':days===0?'Today':'in '+days+'d';
    return '<div class="dash-upcoming">'+
      '<span class="dash-rem-ico" style="color:'+color+'">'+remTypeIcon(r.remType)+'</span>'+
      '<div style="flex:1"><div style="font-size:13px;color:var(--txt);font-weight:600">'+esc(r.notes||r.itemName||r.remType)+'</div>'+
      '<div style="font-size:11px;color:var(--txt2);margin-top:1px">'+(hive?esc(hive.name)+' · ':'')+fmtDate(r.nextDate)+'</div></div>'+
      '<span class="due-chip" style="color:'+color+';background:'+color+'1a">'+dayLabel+'</span>'+
    '</div>';
  }).join('') : '<div style="font-size:13px;color:var(--txt2);font-style:italic;padding:4px 0">No upcoming reminders.</div>';

  // Harvest snap
  var totalHarv=DATA.harvests.reduce(function(s,v){return s+v.yield;},0);
  var dhs=document.getElementById('dash-harvest-snap');
  if (dhs) dhs.innerHTML='<div style="display:flex;gap:22px;flex-wrap:wrap;align-items:baseline">'+
    '<div><span style="font-family:\'Playfair Display\',serif;font-size:26px;color:var(--amber)">'+totalHarv.toFixed(1)+'</span> <span style="font-size:12px;color:var(--txt2)">lbs harvested</span></div>'+
    '<div><span style="font-family:\'Playfair Display\',serif;font-size:26px;color:var(--amber)">'+DATA.harvests.length+'</span> <span style="font-size:12px;color:var(--txt2)">harvests</span></div>'+
    '</div>';

  var dds=document.getElementById('dash-docs-snap');
  if (dds) {
    if (expiring.length) dds.innerHTML='<div style="font-size:13px;color:var(--red);font-weight:600">'+expiring.length+' document'+(expiring.length>1?'s':'')+' expiring within 30 days.</div>';
    else dds.innerHTML='<div style="font-size:13px;color:var(--moss);display:flex;align-items:center;gap:5px">'+SVG.check+' All documents current.</div>';
  }

  // ── HIVES ──
  var hb=document.getElementById('b-hives'); if(hb) hb.textContent=DATA.hives.length;
  var hl=document.getElementById('hive-list');
  if (hl) hl.innerHTML = DATA.hives.length
    ? DATA.hives.map(function(hive){
        var lastInsp=DATA.inspections.filter(function(i){return i.hiveId===hive.id;}).sort(function(a,b){return b.date.localeCompare(a.date);})[0];
        var statusCls={Healthy:'t-ok',Monitoring:'t-warn',Weak:'t-crit',Queenless:'t-crit'}[hive.status]||'t-ok';
        return '<div class="hrow card" onclick="openHiveHistory(\''+hive.id+'\')" oncontextmenu="openHiveModal(DATA.hives.find(function(h){return h.id===\''+hive.id+'\';}));return false">'+
          hiveThumb(hive)+
          '<div class="hinfo">'+
            '<div class="hname">'+esc(hive.name)+'</div>'+
            '<div class="hmeta">'+(hive.location?esc(hive.location)+' · ':'')+esc(hive.species||'')+(hive.boxes?' · '+hive.boxes+' boxes':'')+'</div>'+
            '<div class="hmeta">'+(lastInsp?'Last: '+fmtDate(lastInsp.date):'No inspections yet')+'</div>'+
          '</div>'+
          '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">'+
            '<span class="tag '+statusCls+'">'+esc(hive.status||'Healthy')+'</span>'+
            '<button class="use-btn" onclick="event.stopPropagation();openInspChoice(\''+hive.id+'\')">'+SVG.inspect+' Inspect</button>'+
            '<button class="icon-btn-sm" onclick="event.stopPropagation();openHiveModal(DATA.hives.find(function(h){return h.id===\''+hive.id+'\';}))">'+SVG.edit+'</button>'+
          '</div>'+
        '</div>';
      }).join('')
    : '<div class="empty"><div class="ei">'+icon('hive')+'</div><div class="et">No hives yet</div><div class="es">Tap + to add your first hive</div></div>';

  // ── INSPECTIONS ──
  var ib=document.getElementById('b-insp'); if(ib) ib.textContent=DATA.inspections.length;
  var sortedInsp=DATA.inspections.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  var il=document.getElementById('insp-list');
  if (il) il.innerHTML = sortedInsp.length
    ? sortedInsp.map(function(i){
        var hive=DATA.hives.find(function(h){return h.id===i.hiveId;});
        var photos=getPhotos(i.id);
        var qCls=i.queenSeen==='Yes ✓'?'t-ok':'t-warn';
        return '<div class="irow card">'+
          '<div class="irow-hdr">'+
            '<div><div class="irow-name">'+(hive?esc(hive.name):'Unknown Hive')+'</div>'+
            '<div class="irow-date">'+fmtDate(i.date)+(i.weather?' · '+esc(i.weather):'')+(i.weatherSnap?' · '+i.weatherSnap.temp+'°F':'')+'</div></div>'+
            '<span class="tag '+qCls+'">Queen: '+esc(i.queenSeen||'?')+'</span>'+
          '</div>'+
          '<div class="stars-row">'+
            '<div class="star-item"><div class="star-lbl">Pop</div><div class="star-val">'+starsHTML(i.population)+'</div></div>'+
            '<div class="star-item"><div class="star-lbl">Honey</div><div class="star-val">'+starsHTML(i.honey)+'</div></div>'+
            '<div class="star-item"><div class="star-lbl">Brood</div><div class="star-val">'+starsHTML(i.brood)+'</div></div>'+
            (i.varroa&&i.varroa!=='Not checked'?'<div class="star-item"><div class="star-lbl">Varroa</div><div style="font-size:10px;color:var(--amber);margin-top:2px;font-weight:700">'+esc(i.varroa)+'</div></div>':'')+
          '</div>'+
          (i.actions?'<div class="irow-note"><strong>Actions:</strong> '+esc(i.actions)+'</div>':'')+
          (i.notes?'<div class="irow-note">'+esc(i.notes)+'</div>':'')+
          (photos.length?'<div class="photo-strip">'+photos.map(function(p,idx){return '<img src="'+p.dataUrl+'" data-ctx="'+i.id+'" data-idx="'+idx+'" onclick="openLbox(this.dataset.ctx,+this.dataset.idx)">';}).join('')+'</div>':'')+
          '<div class="row-actions">'+
            '<button class="action-btn" onclick="openInspModal(DATA.inspections.find(function(x){return x.id===\''+i.id+'\';}))">'+SVG.edit+' Edit</button>'+
            '<button class="action-btn action-btn-del" onclick="deleteInsp(\''+i.id+'\')">'+SVG.trash+'</button>'+
          '</div>'+
        '</div>';
      }).join('')
    : '<div class="empty"><div class="ei">'+icon('inspect')+'</div><div class="et">No inspections yet</div><div class="es">Tap + to log your first inspection</div></div>';

  // ── TREATMENTS ──
  var tb=document.getElementById('b-treat'); if(tb) tb.textContent=DATA.treatments.length;
  var sortedTreat=DATA.treatments.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  var tl=document.getElementById('treat-list');
  if (tl) tl.innerHTML = sortedTreat.length
    ? sortedTreat.map(function(t){
        var hive=DATA.hives.find(function(h){return h.id===t.hiveId;});
        var isAfb=(t.diseaseType==='American Foulbrood');
        return '<div class="treat-row card"'+(isAfb?' style="border-left:3px solid var(--red)"':'')+'>'+
          '<div class="treat-ico">'+SVG.treatment+'</div>'+
          '<div class="treat-info">'+
            (isAfb?'<div class="afb-badge">NOTIFIABLE</div>':'')+
            '<div class="treat-name">'+esc(t.category||t.product||'Treatment')+'</div>'+
            '<div class="treat-meta">'+(hive?esc(hive.name)+' · ':'')+fmtDate(t.date)+(t.product?' · '+esc(t.product):'')+(t.duration?' · '+esc(t.duration):'')+(t.notes?'<br><em>'+esc(t.notes)+'</em>':'')+'</div>'+
          '</div>'+
          '<div class="row-actions-col">'+
            '<button class="icon-btn-sm" onclick="openTreatmentModal(DATA.treatments.find(function(x){return x.id===\''+t.id+'\';}))">'+SVG.edit+'</button>'+
            '<button class="icon-btn-sm icon-btn-del" onclick="deleteTreatment(\''+t.id+'\')">'+SVG.trash+'</button>'+
          '</div>'+
        '</div>';
      }).join('')
    : '<div class="empty"><div class="ei">'+icon('treatment')+'</div><div class="et">No treatments logged</div><div class="es">Tap + to record a treatment</div></div>';

  // ── HARVEST ──
  var hb2=document.getElementById('b-harvest'); if(hb2) hb2.textContent=DATA.harvests.length;
  var totalHarv2=DATA.harvests.reduce(function(s,v){return s+v.yield;},0);
  var sortedHarv=DATA.harvests.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  var hs=document.getElementById('harv-sum');
  if (hs) hs.innerHTML='<div class="harv-card">'+
    '<div style="font-size:10px;text-transform:uppercase;letter-spacing:1.5px;opacity:.75;margin-bottom:4px;font-weight:700">Total Harvest</div>'+
    '<div style="font-family:\'Playfair Display\',serif;font-size:36px;color:#fff;line-height:1.1">'+totalHarv2.toFixed(1)+'<span style="font-size:14px;opacity:.7;margin-left:4px">units</span></div>'+
    '<div style="display:flex;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.2)">'+
      '<div style="text-align:center"><div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;opacity:.65;font-weight:700">Harvests</div><div style="font-family:\'Playfair Display\',serif;font-size:20px;color:#d4f0a0;margin-top:2px">'+DATA.harvests.length+'</div></div>'+
      '<div style="text-align:center"><div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;opacity:.65;font-weight:700">Hives</div><div style="font-family:\'Playfair Display\',serif;font-size:20px;color:#d4f0a0;margin-top:2px">'+[...new Set(DATA.harvests.map(function(v){return v.hiveId;}))].length+'</div></div>'+
      '<div style="text-align:center"><div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;opacity:.65;font-weight:700">Latest</div><div style="font-family:\'Playfair Display\',serif;font-size:12px;color:#d4f0a0;margin-top:4px">'+(sortedHarv.length?fmtDate(sortedHarv[0].date):'—')+'</div></div>'+
    '</div></div>';
  var vl=document.getElementById('harv-list');
  if (vl) vl.innerHTML = sortedHarv.length
    ? sortedHarv.map(function(v){
        var hv=DATA.hives.find(function(x){return x.id===v.hiveId;});
        return '<div class="harv-row card">'+
          '<div class="harv-ico">'+SVG.honey+'</div>'+
          '<div class="harv-info"><div class="harv-name">'+(hv?esc(hv.name):'Unknown Hive')+'</div>'+
          '<div class="harv-meta">'+fmtDate(v.date)+' · '+esc(v.type||'Honey')+(v.notes?' · '+esc(v.notes):'')+'</div></div>'+
          '<div style="display:flex;align-items:center;gap:6px">'+
            '<div class="harv-yield">'+v.yield+'<span style="font-size:11px;font-weight:400;color:var(--txt2)"> '+esc(v.unit)+'</span></div>'+
            '<button class="icon-btn-sm" onclick="openHarvestModal(DATA.harvests.find(function(x){return x.id===\''+v.id+'\';}))">'+SVG.edit+'</button>'+
            '<button class="icon-btn-sm icon-btn-del" onclick="deleteHarvest(\''+v.id+'\')">'+SVG.trash+'</button>'+
          '</div></div>';
      }).join('')
    : '<div class="empty"><div class="ei">'+icon('harvest')+'</div><div class="et">No harvests yet</div><div class="es">Tap + to log your first harvest</div></div>';

  // ── FINANCE ──
  var fb=document.getElementById('b-txn'); if(fb) fb.textContent=DATA.transactions.length;
  var fs=document.getElementById('fin-sum');
  if (fs) fs.innerHTML='<div class="fin-card">'+
    '<div class="fin-lbl">Net P&amp;L</div>'+
    '<div class="fin-net'+(net<0?' neg':'')+'">'+cur+net.toFixed(2)+'</div>'+
    '<div class="fin-cols">'+
      '<div class="fin-col"><div class="cl">Income</div><div class="cv c-inc">'+cur+income.toFixed(2)+'</div></div>'+
      '<div class="fin-col"><div class="cl">Expenses</div><div class="cv c-exp">'+cur+expenses.toFixed(2)+'</div></div>'+
      '<div class="fin-col"><div class="cl">Transactions</div><div class="cv">'+DATA.transactions.length+'</div></div>'+
    '</div></div>';

  var pendingFin = DATA.reminders.filter(function(r){return r.completed&&r.itemCost&&!r.addedToFinance;});
  var fpa=document.getElementById('fin-prompt-area');
  if (fpa) fpa.innerHTML = pendingFin.map(function(r){
    return '<div class="fin-prompt"><span><strong>'+esc(r.itemName||r.notes||'Purchase')+'</strong> ('+cur+parseFloat(r.itemCost).toFixed(2)+') not yet in Finance.</span><button class="use-btn" onclick="addReminderToFinance(\''+r.id+'\')">Add ›</button></div>';
  }).join('');

  var sortedTxn=DATA.transactions.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  var tl2=document.getElementById('txn-list');
  if (tl2) tl2.innerHTML = sortedTxn.length
    ? sortedTxn.map(function(t){
        return '<div class="txn-row card">'+
          '<div class="txn-ico '+(t.type==='income'?'income':'expense')+'">'+(t.type==='income'?SVG.income:SVG.expense)+'</div>'+
          '<div class="txn-info"><div class="txn-desc">'+esc(t.desc||t.description||'')+'</div>'+
          '<div class="txn-meta">'+fmtDate(t.date)+' · '+esc(t.category||'')+(t.vendor_name?' · '+esc(t.vendor_name):'')+'</div></div>'+
          '<div class="txn-amt '+(t.type==='income'?'income':'expense')+'">'+(t.type==='income'?'+':'-')+cur+parseFloat(t.amount).toFixed(2)+'</div>'+
          '<button class="icon-btn-sm" onclick="openTxnModal(DATA.transactions.find(function(x){return x.id===\''+t.id+'\';}))">'+SVG.edit+'</button>'+
          '<button class="icon-btn-sm icon-btn-del" onclick="deleteTxn(\''+t.id+'\')">'+SVG.trash+'</button>'+
        '</div>';
      }).join('')
    : '<div class="empty"><div class="ei">'+icon('finance')+'</div><div class="et">No transactions yet</div><div class="es">Tap + to record income or expenses</div></div>';

  // ── REMINDERS ──
  var rb2=document.getElementById('b-remind');
  var activeRem=DATA.reminders.filter(function(r){return !r.completed;});
  if(rb2) rb2.textContent=activeRem.length;
  var remSorted=activeRem.slice().sort(function(a,b){return a.nextDate.localeCompare(b.nextDate);});
  var rl=document.getElementById('remind-list');
  if (rl) {
    var rHtml=''; var completed=DATA.reminders.filter(function(r){return r.completed;}).slice(-5).reverse();
    remSorted.forEach(function(r){
      var hive=DATA.hives.find(function(h){return h.id===r.hiveId;});
      var days=Math.ceil((new Date(r.nextDate)-new Date(today+'T00:00:00'))/864e5);
      var cls=days<0?'remind-overdue':days<=7?'remind-soon':'remind-ok';
      var color=days<0?'var(--red)':days<=7?'var(--amber)':'var(--moss)';
      var dayLabel=days<0?Math.abs(days)+'d overdue':days===0?'Today':days+'d';
      rHtml+='<div class="remind-row card '+cls+'" onclick="openReminderModal(DATA.reminders.find(function(x){return x.id===\''+r.id+'\';}))">'+
        '<div class="remind-type-ico" style="color:'+color+'">'+remTypeIcon(r.remType)+'</div>'+
        '<div style="flex:1;min-width:0">'+
          '<div class="hname">'+esc(r.notes||r.itemName||r.remType)+'</div>'+
          '<div class="hmeta">'+(hive?esc(hive.name)+' · ':'')+fmtDate(r.nextDate)+(r.itemCost?' · '+cur+parseFloat(r.itemCost).toFixed(2):'')+'</div>'+
          '<div style="margin-top:4px"><span class="rem-type-tag rt-'+r.remType.toLowerCase().split(' ')[0]+'">'+esc(r.remType)+'</span></div>'+
        '</div>'+
        '<span class="due-chip" style="color:'+color+';background:'+color+'1a">'+dayLabel+'</span>'+
      '</div>';
    });
    if (completed.length) {
      rHtml+='<div class="section-divider">'+SVG.check+' Recently Completed</div>';
      completed.forEach(function(r){
        var hive=DATA.hives.find(function(h){return h.id===r.hiveId;});
        rHtml+='<div class="remind-row card" style="opacity:.55;cursor:pointer" onclick="openReminderModal(DATA.reminders.find(function(x){return x.id===\''+r.id+'\';}))">'+
          '<div class="remind-type-ico" style="color:var(--moss)">'+SVG.check+'</div>'+
          '<div style="flex:1"><div class="hname" style="text-decoration:line-through">'+esc(r.notes||r.itemName||r.remType)+'</div>'+
          '<div class="hmeta">'+(hive?esc(hive.name)+' · ':'')+fmtDate(r.nextDate)+'</div></div>'+
          '<div style="font-size:11px;color:var(--txt2)">Tap to edit</div></div>';
      });
    }
    if (!remSorted.length && !completed.length) rHtml='<div class="empty"><div class="ei">'+icon('remind')+'</div><div class="et">No reminders yet</div><div class="es">Tap + to add a reminder or task</div></div>';
    rl.innerHTML = rHtml;
  }

  // ── DOCS ──
  var db2=document.getElementById('b-docs'); if(db2) db2.textContent=DATA.docs.length;
  var dl=document.getElementById('doc-list');
  var TAG_MAP={'License':'t-lic','Certificate':'t-cert','Permit':'t-per','Insurance':'t-ins','Inspection Report':'t-warn','Other':'t-oth'};
  if (dl) dl.innerHTML = DATA.docs.length
    ? DATA.docs.map(function(d){
        var thumb=d.dataUrl&&d.mime!=='application/pdf'
          ?'<img class="doc-thumb" src="'+d.dataUrl+'" alt="">'
          :'<div class="doc-ico">'+SVG.doc+'</div>';
        var expired=d.expiry&&d.expiry<today;
        var exp2=d.expiry&&!expired&&d.expiry<=new Date(Date.now()+30*864e5).toISOString().slice(0,10);
        return '<div class="doc-row card" onclick="openDlbox(DATA.docs.find(function(x){return x.id===\''+d.id+'\';}))">'+thumb+
          '<div class="doc-info"><div class="doc-name">'+esc(d.name)+'</div>'+
          '<div class="doc-meta"><span class="tag '+(TAG_MAP[d.category]||'t-oth')+'">'+esc(d.category||'')+'</span>'+
          (d.expiry?' <span class="tag '+(expired?'t-crit':exp2?'t-warn':'t-ok')+'">'+(expired?'Expired':'Expires')+': '+fmtDate(d.expiry)+'</span>':'')+'</div></div></div>';
      }).join('')
    : '<div class="empty"><div class="ei">'+icon('docs')+'</div><div class="et">No documents yet</div><div class="es">Tap + to upload a license or certificate</div></div>';

  // ── ASSETS ──
  var ab=document.getElementById('b-assets'); if(ab) ab.textContent=DATA.assets.length;
  var al=document.getElementById('asset-list');
  if (al) al.innerHTML = DATA.assets.length
    ? DATA.assets.map(function(a){
        var thumb=a.data_url?'<img class="asset-thumb" src="'+a.data_url+'" alt="">':'<div class="asset-thumb-placeholder">'+SVG.art+'</div>';
        return '<div class="asset-card">'+thumb+
          '<div class="asset-info"><div class="asset-name">'+esc(a.name)+'</div>'+
          '<div class="asset-meta">'+esc(a.category||'')+'</div>'+
          '<div style="display:flex;gap:5px;margin-top:6px">'+
            '<button class="use-btn" onclick="window.open(\''+esc(a.data_url)+'\',\'_blank\')">'+SVG.download+' Download</button>'+
            '<button class="icon-btn-sm icon-btn-del" onclick="deleteAsset(\''+a.id+'\')">'+SVG.trash+'</button>'+
          '</div></div></div>';
      }).join('')
    : '<div class="empty" style="grid-column:span 2"><div class="ei">'+icon('library')+'</div><div class="et">No brand assets yet</div><div class="es">Tap + to upload logos and graphics</div></div>';

  // ── CONTACTS ──
  var cb=document.getElementById('b-contacts'); if(cb) cb.textContent=DATA.contacts.length;
  var cl=document.getElementById('contact-list');
  var ROLE_COLOR={'Supplier':'var(--blu)','Veterinarian':'var(--pur)','Inspector':'var(--amber)','Customer':'var(--moss)','Fellow Beekeeper':'var(--honey)','Other':'var(--txt2)'};
  var _cf = window._contactFilter || 'All';
  var filteredContacts = _cf === 'All' ? DATA.contacts : DATA.contacts.filter(function(c){ return c.role === _cf; });
  if (cl) cl.innerHTML = filteredContacts.length
    ? filteredContacts.map(function(c){
        return '<div class="contact-row card">'+
          '<div class="contact-ico">'+initials(c.name)+'</div>'+
          '<div class="contact-info">'+
            '<div class="contact-name">'+esc(c.name)+'</div>'+
            '<div class="contact-meta">'+esc(c.role||'')+(c.phone?' · '+esc(c.phone):'')+'</div>'+
            (c.address?'<div class="contact-detail">'+SVG.pin+' '+esc(c.address)+'</div>':'')+
            (c.notes?'<div style="font-size:11px;color:var(--txt2);margin-top:2px;font-style:italic">'+esc(c.notes)+'</div>':'')+
          '</div>'+
          '<div class="contact-actions">'+
            (c.phone?'<a href="tel:'+esc(c.phone)+'" class="contact-btn" title="Call" onclick="event.stopPropagation()">'+SVG.phone+'</a>':'')+
            (c.email?'<a href="mailto:'+esc(c.email)+'" class="contact-btn" title="Email" onclick="event.stopPropagation()">'+SVG.email+'</a>':'')+
            (c.website?'<a href="'+esc(c.website)+'" target="_blank" class="contact-btn contact-btn-web" title="Website" onclick="event.stopPropagation()">'+SVG.web+'</a>':'')+
            '<button class="contact-btn" onclick="openContactModal(DATA.contacts.find(function(x){return x.id===\''+c.id+'\';}))">'+SVG.edit+'</button>'+
          '</div>'+
        '</div>';
      }).join('')
    : '<div class="empty"><div class="ei">'+icon('contacts')+'</div><div class="et">No contacts'+((_cf!=='All')?' in this category':' yet')+'</div><div class="es">'+((_cf!=='All')?'Try a different filter or add a contact':'Tap + to add suppliers, vets, inspectors')+'</div></div>';
}

// ═══════════════════════════════════════════════════════
// LIBRARY TAB CONTROLLER
// ═══════════════════════════════════════════════════════
window._libTab = 'ref';

function showLibTab(tab) {
  window._libTab = tab;
  ['ref','notes'].forEach(function(t){
    var el = document.getElementById('lib-sub-'+t);
    var btn = document.getElementById('stnl-'+t);
    if (el) el.style.display = t === tab ? '' : 'none';
    if (btn) btn.classList.toggle('active', t === tab);
  });
  if (tab === 'ref') renderTreatRefLibrary();
  if (tab === 'notes') renderNotes();
}

function initLibTab() {
  renderTreatRefLibrary();
}

function renderTreatRefLibrary() {
  var el = document.getElementById('lib-ref-list');
  if (!el) return;
  if (typeof VARROA_TREATMENTS === 'undefined') {
    el.innerHTML = '<div style="color:var(--txt2);font-size:13px;padding:20px;text-align:center">Treatment data loading…</div>';
    return;
  }
  el.innerHTML = VARROA_TREATMENTS.map(function(t) {
    var typeClass = t.type || 'organic';
    return '<div class="tref-card">'+
      '<div class="tref-header" onclick="this.nextElementSibling.classList.toggle(\'open\');this.querySelector(\'.tref-chevron\').classList.toggle(\'open\')">'+
        '<div class="tref-ico '+typeClass+'">'+SVG.treatment+'</div>'+
        '<div style="flex:1;min-width:0">'+
          '<div class="tref-name">'+esc(t.name)+'</div>'+
          '<div class="tref-tags">'+
            '<span class="tref-tag '+typeClass+'">'+esc(t.type||'organic')+'</span>'+
            (t.supersOk?'<span class="tref-tag supers-ok">Supers OK</span>':'<span class="tref-tag supers-off">No Supers</span>')+
            (t.broodlessOnly?'<span class="tref-tag broodless">Broodless only</span>':'')+
            (t.resistanceRisk?'<span class="tref-tag resistance">Resistance risk</span>':'')+
          '</div>'+
        '</div>'+
        '<span class="tref-chevron">▾</span>'+
      '</div>'+
      '<div class="tref-body">'+
        (t.activeIngredient?'<div class="tref-section"><div class="tref-section-title">Active Ingredient</div><div class="tref-row"><div>'+esc(t.activeIngredient)+'</div></div></div>':'')+
        (t.application?'<div class="tref-section"><div class="tref-section-title">Application</div>'+t.application.map(function(a){return '<div class="tref-row"><div class="tref-row-ico">•</div><div>'+esc(a)+'</div></div>';}).join('')+'</div>':'')+
        (t.thresholds?'<div class="tref-section"><div class="tref-section-title">AUBEE Thresholds</div><div class="tref-threshold">'+
          '<div class="tref-thresh-pill tp-green">'+esc(t.thresholds.low||'')+'<br><span style="font-weight:400;opacity:.7">Low risk</span></div>'+
          '<div class="tref-thresh-pill tp-yellow">'+esc(t.thresholds.med||'')+'<br><span style="font-weight:400;opacity:.7">Treat</span></div>'+
          '<div class="tref-thresh-pill tp-red">'+esc(t.thresholds.high||'')+'<br><span style="font-weight:400;opacity:.7">Urgent</span></div>'+
        '</div></div>':'')+
        (t.warnings&&t.warnings.length?'<div class="tref-warn">'+t.warnings.map(function(w){return esc(w);}).join('<br>')+'</div>':'')+
        (t.notes?'<div class="tref-note">'+esc(t.notes)+'</div>':'')+
        '<button class="use-btn" style="margin-top:10px" onclick="openTreatmentModal(null)">+ Log Treatment</button>'+
      '</div>'+
    '</div>';
  }).join('');
}
