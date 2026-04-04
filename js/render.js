
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

  // Varroa status per hive
  var dvv = document.getElementById('dash-varroa');
  if (dvv) {
    if (!DATA.hives.length) {
      dvv.innerHTML = '<div style="font-size:13px;color:var(--txt2);font-style:italic">No hives yet.</div>';
    } else {
      dvv.innerHTML = DATA.hives.map(function(hive) {
        // Get most recent inspection with a varroa reading
        var lastVarroaInsp = DATA.inspections
          .filter(function(i){ return i.hiveId===hive.id && i.varroa && i.varroa!=='Not checked'; })
          .sort(function(a,b){ return b.date.localeCompare(a.date); })[0];
        // Get most recent wash result from treatments
        var lastWash = DATA.treatments
          .filter(function(t){ return t.hiveId===hive.id && t.miteCount!=null; })
          .sort(function(a,b){ return b.date.localeCompare(a.date); })[0];
        var statusColor, statusLabel, statusBg;
        if (lastVarroaInsp) {
          var v = lastVarroaInsp.varroa;
          if (v.includes('High')) { statusColor='var(--red)'; statusBg='rgba(180,50,50,.1)'; statusLabel='High'; }
          else if (v.includes('Medium')) { statusColor='var(--amber)'; statusBg='rgba(212,132,10,.1)'; statusLabel='Medium'; }
          else if (v.includes('Low')) { statusColor='var(--moss)'; statusBg='rgba(60,120,60,.1)'; statusLabel='Low'; }
          else { statusColor='var(--txt2)'; statusBg='rgba(0,0,0,.05)'; statusLabel='Checked'; }
        } else {
          statusColor='var(--txt2)'; statusBg='rgba(0,0,0,.05)'; statusLabel='Not checked';
        }
        var lastDate = lastVarroaInsp ? fmtDate(lastVarroaInsp.date) : (lastWash ? fmtDate(lastWash.date) : null);
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)">'+
          '<div style="font-size:13px;font-weight:600;color:var(--txt)">'+esc(hive.name)+'</div>'+
          '<div style="display:flex;align-items:center;gap:8px">'+
            (lastDate?'<div style="font-size:11px;color:var(--txt2)">'+lastDate+'</div>':'')+
            '<span style="font-size:11px;font-weight:700;color:'+statusColor+';background:'+statusBg+';padding:3px 9px;border-radius:20px">'+statusLabel+'</span>'+
          '</div>'+
        '</div>';
      }).join('');
    }
  }

  // Quick actions
  var dqa = document.getElementById('dash-quick-actions');
  if (dqa && DATA.hives.length) {
    dqa.style.display = '';
  } else if (dqa) {
    dqa.style.display = 'none';
  }

  // ── HIVES ──
  var hb=document.getElementById('b-hives'); if(hb) hb.textContent=DATA.hives.length;
  var hl=document.getElementById('hive-list');
  if (hl) hl.innerHTML = DATA.hives.length
    ? DATA.hives.map(function(hive){
        var lastInsp=DATA.inspections.filter(function(i){return i.hiveId===hive.id;}).sort(function(a,b){return b.date.localeCompare(a.date);})[0];
        var statusCls={Healthy:'t-ok',Monitoring:'t-warn',Weak:'t-crit',Queenless:'t-crit'}[hive.status]||'t-ok';
        var needsInstallConfirm = hive.install_date && !hive.install_confirmed;
        var installMeta = hive.install_date
          ? '<div class="hmeta" style="color:var(--amber);font-weight:600">📦 Installed: '+fmtDate(hive.install_date)+'</div>'
          : '';
        return '<div class="hrow card" style="flex-wrap:wrap" onclick="openHiveHistory(\''+hive.id+'\')" oncontextmenu="openHiveModal(DATA.hives.find(function(h){return h.id===\''+hive.id+'\';}));return false">'+
          hiveThumb(hive)+
          '<div class="hinfo" style="flex:1;min-width:0">'+
            '<div class="hname">'+esc(hive.name)+'</div>'+
            '<div class="hmeta">'+(hive.location?esc(hive.location)+' · ':'')+esc(hive.species||'')+(hive.boxes?' · '+hive.boxes+' boxes':'')+'</div>'+
            '<div class="hmeta">'+(lastInsp?'Last: '+fmtDate(lastInsp.date):'No inspections yet')+'</div>'+
            installMeta+
          '</div>'+
          '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0">'+
            '<span class="tag '+statusCls+'">'+esc(hive.status||'Healthy')+'</span>'+
            '<button class="use-btn" onclick="event.stopPropagation();openInspChoice(\''+hive.id+'\')">'+SVG.inspect+' Inspect</button>'+
            '<button class="icon-btn-sm" onclick="event.stopPropagation();openHiveModal(DATA.hives.find(function(h){return h.id===\''+hive.id+'\';}))">'+SVG.edit+'</button>'+
          '</div>'+
          '<div class="row-actions" style="width:100%;margin-top:6px;padding-top:8px;border-top:1px solid var(--border)">'+
            (needsInstallConfirm?'<button class="action-btn" style="color:#2a7a2a;font-weight:700" onclick="event.stopPropagation();promptInstallReminders(DATA.hives.find(function(h){return h.id===\''+hive.id+'\';}))">📦 Confirm Install</button>':'')+
            '<button class="action-btn" onclick="event.stopPropagation();openSplitModal(\''+hive.id+'\')">✂️ Split</button>'+
            '<button class="action-btn" onclick="event.stopPropagation();openRequeenModal(\''+hive.id+'\')">👑 Requeen</button>'+
          '</div>'+
        '</div>';
      }).join('')
    : '<div class="empty"><div class="ei">'+icon('hive')+'</div><div class="et">No hives yet</div><div class="es">Tap + to add your first hive</div></div>';

  // ── INSPECTIONS ──
  var ib=document.getElementById('b-insp'); if(ib) ib.textContent=DATA.inspections.length;
  // Export toolbar
  var iexp=document.getElementById('insp-export-bar');
  if (iexp) {
    var hiveOpts='<option value="">All Hives</option>'+DATA.hives.map(function(h){return '<option value="'+h.id+'">'+esc(h.name)+'</option>';}).join('');
    iexp.innerHTML='<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px">'+
      '<select id="insp-export-hive" style="flex:1;min-width:0;padding:8px 10px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--txt);font-family:\'Source Serif 4\',serif;font-size:13px">'+hiveOpts+'</select>'+
      '<button onclick="exportInspectionsPDF(document.getElementById(\'insp-export-hive\').value||null)" style="display:flex;align-items:center;gap:6px;padding:8px 14px;background:linear-gradient(135deg,var(--forest),var(--moss));border:none;border-radius:10px;color:#fff;font-size:13px;font-weight:700;font-family:\'Source Serif 4\',serif;cursor:pointer;white-space:nowrap">'+
      SVG.download+' PDF</button>'+
      '<button onclick="exportInspectionsCSV(document.getElementById(\'insp-export-hive\').value||null)" style="display:flex;align-items:center;gap:6px;padding:8px 14px;background:linear-gradient(135deg,var(--blu),#1a3a7a);border:none;border-radius:10px;color:#fff;font-size:13px;font-weight:700;font-family:\'Source Serif 4\',serif;cursor:pointer;white-space:nowrap">'+
      SVG.download+' CSV</button>'+
      '<button onclick="openInspCompare()" style="display:flex;align-items:center;gap:6px;padding:8px 14px;background:linear-gradient(135deg,var(--amber),var(--honey));border:none;border-radius:10px;color:#fff;font-size:13px;font-weight:700;font-family:\'Source Serif 4\',serif;cursor:pointer;white-space:nowrap">⚖️ Compare</button>'+
    '</div>';
  }
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
          (i.feed_type||i.feedType?'<div class="irow-note">🍯 <strong>Fed:</strong> '+esc(i.feed_type||i.feedType)+(i.feed_qty||i.feedQty?' · '+esc(i.feed_qty||i.feedQty):'')+(i.feed_notes||i.feedNotes?' · '+esc(i.feed_notes||i.feedNotes):'')+'</div>':'')+
          (i.notes?'<div class="irow-note">'+esc(i.notes)+'</div>':'')+
          (photos.length?'<div class="photo-strip">'+photos.map(function(p,idx){return '<img src="'+p.dataUrl+'" data-ctx="'+i.id+'" data-idx="'+idx+'" onclick="openLbox(this.dataset.ctx,+this.dataset.idx)">';}).join('')+'</div>':'')+
          '<div class="row-actions">'+
            '<button class="action-btn" onclick="openInspModal(DATA.inspections.find(function(x){return x.id===\''+i.id+'\';}))">'+SVG.edit+' Edit</button>'+
            '<button class="action-btn action-btn-del" onclick="deleteInsp(\''+i.id+'\')">'+SVG.trash+'</button>'+
          '</div>'+
        '</div>';
      }).join('')
    : '<div class="empty"><div class="ei">'+icon('inspect')+'</div><div class="et">No inspections yet</div><div class="es">Tap + to log your first inspection</div></div>';

  // ── FEEDINGS ──
  var feedings = DATA.feedings || [];
  var fb = document.getElementById('b-feed'); if(fb) fb.textContent = feedings.length;
  var fl = document.getElementById('feed-list');
  if (fl) {
    if (!feedings.length) {
      fl.innerHTML = '<div class="empty"><div class="ei">🍯</div><div class="et">No feeding logs yet</div><div class="es">Tap + to log a feeding</div></div>';
    } else {
      var sortedFeeds = feedings.slice().sort(function(a,b){ return b.date.localeCompare(a.date); });
      fl.innerHTML = sortedFeeds.map(function(f){
        var hive = DATA.hives.find(function(h){ return h.id === f.hive_id; });
        var entries = f.entries || [];
        var summary = entries.map(function(e){
          var supp = e.supplement ? ' + '+e.supplement+(e.suppDose?' ('+e.suppDose+')':'') : '';
          if (e.feed_type === 'Syrup') return (e.quarts ? e.quarts+'qt ' : '') + 'Syrup' + (e.ratio ? ' ('+e.ratio+')' : '') + supp;
          if (e.feed_type === 'Patty') {
            var q = parseFloat(e.qty||1);
            var label = q === 0.5 ? '½' : q === 1.5 ? '1½' : String(q);
            return label + ' Patty' + (q !== 1 && q !== 0.5 ? 's' : '') + supp;
          }
          return (e.lbs ? e.lbs+'lb ' : '') + (e.feed_type || 'Feed') + supp;
        }).join(' + ');
        return '<div class="card" style="margin-bottom:8px;padding:13px;cursor:pointer" onclick="openFeedingModal(DATA.feedings.find(function(x){return x.id===\''+f.id+'\';}))">'+
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">'+
            '<div style="font-size:14px;font-weight:700;color:var(--txt)">🍯 '+(hive?esc(hive.name):'All Hives')+'</div>'+
            '<div style="font-size:12px;color:var(--txt2)">'+fmtDate(f.date)+'</div>'+
          '</div>'+
          '<div style="font-size:13px;color:var(--amber);font-weight:600;margin-bottom:'+(f.notes?'4':'0')+'px">'+esc(summary)+'</div>'+
          (f.notes ? '<div style="font-size:12px;color:var(--txt2);line-height:1.5">'+esc(f.notes)+'</div>' : '')+
        '</div>';
      }).join('');
    }
  }

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
    var rHtml='';
    var completed=DATA.reminders.filter(function(r){return r.completed;}).slice(-5).reverse();
    remSorted.forEach(function(r){
      var hive=DATA.hives.find(function(h){return h.id===r.hiveId;});
      var days=Math.ceil((new Date(r.nextDate)-new Date(today+'T00:00:00'))/864e5);
      var cls=days<0?'remind-overdue':days<=7?'remind-soon':'remind-ok';
      var color=days<0?'var(--red)':days<=7?'var(--amber)':'var(--moss)';
      var dayLabel=days<0?Math.abs(days)+'d overdue':days===0?'Today':days+'d';
      var rid = r.id;
      rHtml+=
        '<div class="card remind-card '+cls+'" style="margin-bottom:10px;padding:0;overflow:hidden">'+
          '<div style="display:flex;align-items:flex-start;gap:12px;padding:13px">'+
            '<div class="remind-type-ico" style="color:'+color+';flex-shrink:0;margin-top:2px">'+remTypeIcon(r.remType)+'</div>'+
            '<div style="flex:1;min-width:0">'+
              '<div style="font-size:14px;font-weight:700;color:var(--txt);line-height:1.4;margin-bottom:4px">'+esc(r.notes||r.itemName||r.remType)+'</div>'+
              '<div class="hmeta">'+(hive?esc(hive.name)+' &middot; ':'')+fmtDate(r.nextDate)+(r.itemCost?' &middot; '+cur+parseFloat(r.itemCost).toFixed(2):'')+'</div>'+
              '<div style="margin-top:6px">'+
                '<span class="rem-type-tag rt-'+r.remType.toLowerCase().split(' ')[0]+'">'+esc(r.remType)+'</span>'+
                '<span class="due-chip" style="color:'+color+';background:'+color+'1a;margin-left:6px">'+dayLabel+'</span>'+
              '</div>'+
            '</div>'+
          '</div>'+
          '<div style="display:flex;border-top:1px solid var(--border)">'+
            '<button onclick="event.stopPropagation();completeReminder(\''+rid+'\')\" style="flex:1;padding:11px 4px;border:none;border-right:1px solid var(--border);background:none;color:var(--moss);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">'+
              '&#x2705; Complete</button>'+
            '<button onclick="event.stopPropagation();openReminderModal(DATA.reminders.find(function(x){return x.id===\''+rid+'\'}))" style="flex:1;padding:11px 4px;border:none;border-right:1px solid var(--border);background:none;color:var(--amber);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">'+
              '&#x270F;&#xFE0F; Edit</button>'+
            '<button onclick="event.stopPropagation();deleteReminder(\''+rid+'\')\" style="flex:1;padding:11px 4px;border:none;background:none;color:var(--red);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">'+
              '&#x1F5D1; Delete</button>'+
          '</div>'+
        '</div>';
    });
    if (completed.length) {
      rHtml+='<div class="section-divider">'+SVG.check+' Recently Completed</div>';
      completed.forEach(function(r){
        var hive=DATA.hives.find(function(h){return h.id===r.hiveId;});
        var rid=r.id;
        rHtml+=
          '<div class="card" style="margin-bottom:8px;padding:12px;opacity:.6;display:flex;align-items:center;gap:12px">'+
            '<div style="color:var(--moss);flex-shrink:0">'+SVG.check+'</div>'+
            '<div style="flex:1;min-width:0">'+
              '<div style="font-size:13px;color:var(--txt);text-decoration:line-through">'+esc(r.notes||r.itemName||r.remType)+'</div>'+
              '<div class="hmeta">'+(hive?esc(hive.name)+' &middot; ':'')+fmtDate(r.nextDate)+'</div>'+
            '</div>'+
            '<button onclick="openReminderModal(DATA.reminders.find(function(x){return x.id===\''+rid+'\'}))" style="border:none;background:none;color:var(--txt2);font-size:11px;cursor:pointer;font-family:inherit;white-space:nowrap">&#x270F;&#xFE0F; Edit</button>'+
          '</div>';
      });
    }
    if (!remSorted.length && !completed.length) {
      rHtml='<div class="empty"><div class="ei">'+icon('remind')+'</div><div class="et">No reminders yet</div><div class="es">Tap + to add a reminder or task</div></div>';
    }
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
    el.innerHTML = '<div style="color:var(--txt2);font-size:13px;padding:20px;text-align:center">Treatment data loading...</div>';
    return;
  }

  function secHeader(id, label) {
    return '<div id="' + id + '" class="lib-section-header">' + label + '</div>';
  }

  function trefCard(t) {
    var tc = t.type || 'organic';
    return '<div class="tref-card">' +
      '<div class="tref-header" onclick="this.nextElementSibling.classList.toggle(\'open\');this.querySelector(\'.tref-chevron\').classList.toggle(\'open\')">' +
        '<div class="tref-ico ' + tc + '">' + SVG.treatment + '</div>' +
        '<div style="flex:1;min-width:0">' +
          '<div class="tref-name">' + esc(t.name) + '</div>' +
          '<div class="tref-tags">' +
            '<span class="tref-tag ' + tc + '">' + esc(t.type || 'organic') + '</span>' +
            (t.supersOk ? '<span class="tref-tag supers-ok">Supers OK</span>' : '<span class="tref-tag supers-off">No Supers</span>') +
            (t.broodlessOnly ? '<span class="tref-tag broodless">Broodless only</span>' : '') +
            (t.resistanceRisk ? '<span class="tref-tag resistance">Resistance risk</span>' : '') +
          '</div>' +
        '</div>' +
        '<span class="tref-chevron">&#9662;</span>' +
      '</div>' +
      '<div class="tref-body">' +
        (t.activeIngredient ? '<div class="tref-section"><div class="tref-section-title">Active Ingredient</div><div class="tref-row"><div>' + esc(t.activeIngredient) + '</div></div></div>' : '') +
        (t.application ? '<div class="tref-section"><div class="tref-section-title">Application</div>' + t.application.map(function(a) { return '<div class="tref-row"><div class="tref-row-ico">&bull;</div><div>' + esc(a) + '</div></div>'; }).join('') + '</div>' : '') +
        (t.thresholds ? '<div class="tref-section"><div class="tref-section-title">AUBEE Thresholds</div><div class="tref-threshold">' +
          '<div class="tref-thresh-pill tp-green">' + esc(t.thresholds.low || '') + '<br><span style="font-weight:400;opacity:.7">Low risk</span></div>' +
          '<div class="tref-thresh-pill tp-yellow">' + esc(t.thresholds.med || '') + '<br><span style="font-weight:400;opacity:.7">Treat</span></div>' +
          '<div class="tref-thresh-pill tp-red">' + esc(t.thresholds.high || '') + '<br><span style="font-weight:400;opacity:.7">Urgent</span></div>' +
        '</div></div>' : '') +
        (t.warnings && t.warnings.length ? '<div class="tref-warn">' + t.warnings.map(function(w) { return esc(w); }).join('<br>') + '</div>' : '') +
        (t.notes ? '<div class="tref-note">' + esc(t.notes) + '</div>' : '') +
        '<button class="use-btn" style="margin-top:10px" onclick="openTreatmentModal(null)">+ Log Treatment</button>' +
      '</div>' +
    '</div>';
  }

  var html = '';

  // Varroa Mite Treatments
  html += secHeader('lib-sec-mite', '&#128202; Varroa Mite Treatments (AUBEE)');
  html += VARROA_TREATMENTS.map(function(t) { return trefCard(t); }).join('');

  // Non-Chemical Controls
  html += secHeader('lib-sec-nonchemical', '&#127807; Non-Chemical Controls');
  if (typeof NONCHEMICAL_CONTROLS !== 'undefined') {
    html += NONCHEMICAL_CONTROLS.map(function(c) {
      return '<div class="tref-card">' +
        '<div class="tref-header" onclick="this.nextElementSibling.classList.toggle(\'open\');this.querySelector(\'.tref-chevron\').classList.toggle(\'open\')">' +
          '<div class="tref-ico organic" style="font-size:18px">' + (c.icon || '&#127807;') + '</div>' +
          '<div style="flex:1;min-width:0"><div class="tref-name">' + esc(c.name) + '</div>' +
          '<div class="tref-tags"><span class="tref-tag organic">Non-Chemical</span></div></div>' +
          '<span class="tref-chevron">&#9662;</span>' +
        '</div>' +
        '<div class="tref-body">' +
          (c.desc ? '<div class="tref-note">' + esc(c.desc) + '</div>' : '') +
          (c.steps && c.steps.length ? '<div class="tref-section"><div class="tref-section-title">Steps</div>' +
            c.steps.map(function(s) { return '<div class="tref-row"><div class="tref-row-ico">&bull;</div><div>' + esc(s) + '</div></div>'; }).join('') + '</div>' : '') +
          (c.note ? '<div class="tref-warn">' + esc(c.note) + '</div>' : '') +
        '</div>' +
      '</div>';
    }).join('');
  }

  // Pests & Diseases
  html += secHeader('lib-sec-pests', '&#129458; Pests & Diseases');
  if (typeof PEST_CATEGORIES !== 'undefined') {
    Object.keys(PEST_CATEGORIES).forEach(function(key) {
      var p = PEST_CATEGORIES[key];
      html += '<div class="tref-card">' +
        '<div class="tref-header" onclick="this.nextElementSibling.classList.toggle(\'open\');this.querySelector(\'.tref-chevron\').classList.toggle(\'open\')">' +
          '<div class="tref-ico" style="background:rgba(180,60,60,.1);color:#b43c3c;font-size:18px">' + (p.icon || '&#129458;') + '</div>' +
          '<div style="flex:1;min-width:0"><div class="tref-name">' + esc(p.name || key) + '</div>' +
          '<div class="tref-tags"><span class="tref-tag" style="background:rgba(180,60,60,.1);color:#b43c3c">' + esc(p.type || 'pest') + '</span>' +
          (p.notifiable ? '<span class="tref-tag resistance">Reportable</span>' : '') + '</div></div>' +
          '<span class="tref-chevron">&#9662;</span>' +
        '</div>' +
        '<div class="tref-body">' +
          (p.symptoms ? '<div class="tref-section"><div class="tref-section-title">Symptoms</div><div class="tref-note">' + esc(p.symptoms) + '</div></div>' : '') +
          (p.controls && p.controls.length ? '<div class="tref-section"><div class="tref-section-title">Controls</div>' +
            p.controls.map(function(c) {
              return '<div class="tref-row"><div class="tref-row-ico">&bull;</div><div><strong>' + esc(c.name) + '</strong>' +
                (c.note ? ' &mdash; ' + esc(c.note) : '') +
                (c.warn ? '<br><span style="color:#b43c3c;font-size:11px">' + esc(c.warn) + '</span>' : '') +
              '</div></div>';
            }).join('') + '</div>' : '') +
        '</div>' +
      '</div>';
    });
  }

  // Pests & Diseases — full rework with SVG illustrations
  html += secHeader('lib-sec-pests', '&#129458; Pests &amp; Diseases');

  var PEST_ILLUS = {
    'Varroa Mites': '<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg" style="width:80px;height:50px;display:block"><ellipse cx="40" cy="28" rx="22" ry="12" fill="#F5A623" stroke="#C47200" stroke-width="1.2"/><line x1="24" y1="24" x2="56" y2="24" stroke="#C47200" stroke-width="1"/><line x1="21" y1="30" x2="59" y2="30" stroke="#C47200" stroke-width="1"/><ellipse cx="48" cy="22" rx="8" ry="5.5" fill="#8B2A0A" stroke="#5C1A05" stroke-width="1"/><line x1="40" y1="20" x2="33" y2="16" stroke="#5C1A05" stroke-width="1" stroke-linecap="round"/><line x1="40" y1="22" x2="33" y2="20" stroke="#5C1A05" stroke-width="1" stroke-linecap="round"/><line x1="40" y1="24" x2="33" y2="26" stroke="#5C1A05" stroke-width="1" stroke-linecap="round"/><line x1="41" y1="25" x2="34" y2="30" stroke="#5C1A05" stroke-width="1" stroke-linecap="round"/><line x1="56" y1="20" x2="63" y2="16" stroke="#5C1A05" stroke-width="1" stroke-linecap="round"/><line x1="56" y1="22" x2="63" y2="20" stroke="#5C1A05" stroke-width="1" stroke-linecap="round"/><line x1="56" y1="24" x2="63" y2="26" stroke="#5C1A05" stroke-width="1" stroke-linecap="round"/><line x1="55" y1="25" x2="62" y2="30" stroke="#5C1A05" stroke-width="1" stroke-linecap="round"/><text x="48" y="44" text-anchor="middle" font-size="7" fill="#888">~1.5mm wide</text></svg>',
    'Small Hive Beetles': '<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg" style="width:80px;height:50px;display:block"><ellipse cx="38" cy="25" rx="18" ry="10" fill="#2A1A08" stroke="#000" stroke-width="1"/><line x1="38" y1="15" x2="38" y2="35" stroke="#4A3020" stroke-width="1"/><ellipse cx="54" cy="25" rx="4" ry="8" fill="#2A1A08" stroke="#000" stroke-width="1"/><ellipse cx="23" cy="25" rx="5" ry="6" fill="#1A0A04" stroke="#000" stroke-width="1"/><path d="M21 20 Q13 14 11 11" stroke="#2A1A08" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="10" cy="10" r="2" fill="#2A1A08"/><path d="M23 19 Q15 12 13 9" stroke="#2A1A08" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="12" cy="8" r="2" fill="#2A1A08"/><line x1="30" y1="33" x2="26" y2="40" stroke="#1A0A04" stroke-width="1" stroke-linecap="round"/><line x1="38" y1="34" x2="36" y2="42" stroke="#1A0A04" stroke-width="1" stroke-linecap="round"/><line x1="46" y1="33" x2="48" y2="40" stroke="#1A0A04" stroke-width="1" stroke-linecap="round"/><line x1="30" y1="17" x2="26" y2="10" stroke="#1A0A04" stroke-width="1" stroke-linecap="round"/><line x1="38" y1="16" x2="36" y2="9" stroke="#1A0A04" stroke-width="1" stroke-linecap="round"/><line x1="46" y1="17" x2="48" y2="10" stroke="#1A0A04" stroke-width="1" stroke-linecap="round"/><text x="40" y="48" text-anchor="middle" font-size="7" fill="#888">~6mm dark brown</text></svg>',
    'Wax Moths': '<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg" style="width:80px;height:50px;display:block"><rect x="5" y="10" width="10" height="12" rx="2" fill="none" stroke="#C8A040" stroke-width="1.2"/><rect x="16" y="10" width="10" height="12" rx="2" fill="none" stroke="#C8A040" stroke-width="1.2"/><rect x="27" y="10" width="10" height="12" rx="2" fill="none" stroke="#C8A040" stroke-width="1.2"/><path d="M5 10 Q20 5 37 10" stroke="#D4C090" stroke-width="0.8" fill="none" stroke-dasharray="2,1"/><path d="M5 16 Q20 12 37 16" stroke="#D4C090" stroke-width="0.8" fill="none" stroke-dasharray="2,1"/><ellipse cx="58" cy="28" rx="16" ry="6" fill="#F5EBCC" stroke="#C8A040" stroke-width="1"/><ellipse cx="44" cy="28" rx="4" ry="5" fill="#8B6020" stroke="#5C3A10" stroke-width="1"/><line x1="50" y1="33" x2="50" y2="38" stroke="#C8A040" stroke-width="1" stroke-linecap="round"/><line x1="56" y1="34" x2="56" y2="39" stroke="#C8A040" stroke-width="1" stroke-linecap="round"/><line x1="62" y1="34" x2="62" y2="39" stroke="#C8A040" stroke-width="1" stroke-linecap="round"/><text x="40" y="48" text-anchor="middle" font-size="7" fill="#888">Larva ~25mm with webbing</text></svg>',
    'American Foulbrood': '<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg" style="width:80px;height:50px;display:block"><rect x="4" y="8" width="14" height="16" rx="2" fill="#F5DCA0" stroke="#C8A040" stroke-width="1.2"/><rect x="20" y="8" width="14" height="16" rx="2" fill="#F5DCA0" stroke="#C8A040" stroke-width="1.2"/><rect x="36" y="8" width="14" height="16" rx="2" fill="#8B5010" stroke="#5C3000" stroke-width="1.2"/><circle cx="43" cy="16" r="3" fill="#5C2000"/><rect x="52" y="8" width="14" height="16" rx="2" fill="#6B3010" stroke="#5C3000" stroke-width="1.2"/><text x="11" y="32" font-size="6" fill="#2D6A4F">OK</text><text x="27" y="32" font-size="6" fill="#2D6A4F">OK</text><text x="37" y="32" font-size="6" fill="#8B3010">Sunken</text><text x="53" y="32" font-size="6" fill="#8B3010">Ropy</text><text x="40" y="44" text-anchor="middle" font-size="7" fill="#888">Sunken cappings, ropy larvae</text></svg>',
    'Deformed Wing Virus': '<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg" style="width:80px;height:50px;display:block"><ellipse cx="35" cy="28" rx="16" ry="9" fill="#F5A623" stroke="#C47200" stroke-width="1.2"/><ellipse cx="22" cy="26" rx="8" ry="8" fill="#4A3010" stroke="#2A1A00" stroke-width="1"/><circle cx="12" cy="25" r="5" fill="#2A1A00" stroke="#000" stroke-width="1"/><path d="M24 18 Q35 8 52 14" stroke="#AAA" stroke-width="1" stroke-dasharray="3,2" fill="none"/><path d="M24 18 Q26 14 22 10 Q28 12 30 16 Q28 18 26 16" fill="#B0C0E0" stroke="#7080A0" stroke-width="1"/><path d="M24 19 Q27 17 24 15" fill="#8090B0" stroke="#5060A0" stroke-width="1"/><text x="40" y="44" text-anchor="middle" font-size="7" fill="#888">Crumpled wings, shortened abdomen</text></svg>',
    'Chalkbrood': '<svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg" style="width:80px;height:50px;display:block"><rect x="4" y="8" width="14" height="16" rx="2" fill="#F5DCA0" stroke="#C8A040" stroke-width="1.2"/><ellipse cx="11" cy="16" rx="5" ry="6" fill="#FFFFF0" stroke="#CCC" stroke-width="1"/><rect x="20" y="8" width="14" height="16" rx="2" fill="#F5DCA0" stroke="#C8A040" stroke-width="1.2"/><ellipse cx="27" cy="16" rx="5" ry="6" fill="#D0D0D0" stroke="#999" stroke-width="1"/><circle cx="25" cy="14" r="1.5" fill="#444"/><circle cx="29" cy="17" r="1.5" fill="#444"/><text x="10" y="32" font-size="6" fill="#888">White</text><text x="22" y="32" font-size="6" fill="#888">Dark</text><text x="40" y="44" text-anchor="middle" font-size="7" fill="#888">Chalk-hard mummies in cells</text></svg>'
  };

  var PEST_DESCRIPTIONS = {
    'Varroa Mites': {
      desc: 'Varroa destructor — a reddish-brown external mite ~1/16" wide, wider than long, crab-shaped. Visible to the naked eye on adult bees. Feeds on bee fat body tissue, weakens bees, and vectors viruses including Deformed Wing Virus. The #1 threat to managed beekeeping worldwide.',
      detect: ['Alcohol wash (most accurate) — 300 bees in jar with 70% isopropyl, shake 60 sec, count mites. Divide by bee count for % infestation.', 'Screened bottom board — count mite drop over 24 hours. 8-10+ per day suggests treatment needed.', 'Visual — look for reddish-brown dots on bee thorax during inspection.'],
      threshold: 'Action threshold: 2 mites per 100 bees (2%) in summer. 1% in fall (Aug-Sep) before winter bees are raised.'
    },
    'Small Hive Beetles': {
      desc: 'Aethina tumida — 5-7mm, flattened, dark brown to black with clubbed antennae. Larvae are whitish grubs with body spines. Larvae tunnel through comb and contaminate honey causing fermentation with a rotten-orange odor. Strong colonies in full sun manage beetles well.',
      detect: ['Look in dark hive corners — under the cover, bottom board edges, propolis crevices.', 'Slimy, fermented honey with rotten-orange smell indicates larval infestation.', 'Check bottom board for beetle larvae exiting to pupate in soil.'],
      threshold: 'Strong colonies defend themselves. Any beetles in a weak colony need action. 2-3+ beetles visible per inspection in a weak colony warrants traps.'
    },
    'Wax Moths': {
      desc: 'Greater wax moth (Galleria mellonella) larvae are cream caterpillars up to 1" long that tunnel through comb, spinning silky webbing. Cannot successfully infest a strong healthy colony — wax moth damage is a symptom of weakness, not the cause.',
      detect: ['Webbing and silk tunnels across comb surfaces.', 'Larvae tunneling through comb or cocoons on frame wood.', 'Groove damage carved into wooden frame bars for pupation.'],
      threshold: 'Presence in an active hive indicates weakness. Remove and freeze affected frames (48 hrs at 20F). Focus on strengthening the colony.'
    },
    'American Foulbrood': {
      desc: 'Most serious bacterial brood disease. Caused by Paenibacillus larvae — spores survive 50+ years in equipment. Larvae turn coffee-brown and produce a foul glue-like rope when a toothpick is slowly withdrawn from a sunken cell. Cappings become sunken and perforated. HIGHLY CONTAGIOUS. NOTIFIABLE DISEASE.',
      detect: ['Sunken, darkened cappings with pinhole perforations.', 'Ropy test — toothpick in sunken cell, withdraw slowly: infected larvae string 1-3 inches before breaking.', 'Distinctive foul smell — like rotting gym shoes or glue.', 'Scattered sunken cells mixed with healthy brood.'],
      threshold: 'ANY suspected AFB: contact your state apiary inspector immediately. Do not treat, move, or destroy equipment without authorization.'
    },
    'European Foulbrood': {
      desc: 'Bacterial brood disease (Melissococcus plutonius). Affects young unsealed larvae which twist and turn yellow-brown. No ropy string — larvae break cleanly. Sour or vinegary smell. Often triggered by nutritional stress.',
      detect: ['Twisted, discolored larvae in unsealed cells — yellow to brown.', 'Sour or vinegary smell (not the glue-like AFB smell).', 'Spotty brood with discolored larvae.'],
      threshold: 'Mild cases may resolve with better nutrition and a strong queen. Moderate-severe cases may need oxytetracycline and requeening.'
    },
    'Chalkbrood': {
      desc: 'Fungal disease (Ascosphaera apis). Larvae mummify into chalk-hard white masses, turning grey-black as spores develop. Mummies found on bottom board and landing board. Most common in cool damp conditions with poor ventilation. Usually self-limiting in strong colonies.',
      detect: ['White or grey-black hard mummies in cells or on the bottom/landing board.', 'Spotty brood with mummified larvae.', 'No foul smell — dry, chalky texture distinguishes it from foulbrood.'],
      threshold: 'Low levels usually self-resolve. Persistent chalkbrood indicates ventilation problems or a non-hygienic queen — requeen with VSH stock.'
    },
    'Sacbrood': {
      desc: 'Viral disease (Sacbrood virus). Infected larvae fail to pupate and die in a fluid-filled sac under the old larval skin. Head end turns upward. Color changes yellow to dark brown. Usually mild and self-limiting.',
      detect: ['Uncapped cells with larvae showing a fluid-filled sac and upturned head ("Chinese slipper" shape).', 'Yellow to dark brown discoloration.', 'Scattered affected cells among healthy brood.'],
      threshold: 'Typically self-limiting. Requeening with hygienic stock is most effective response to persistent sacbrood.'
    },
    'Nosema': {
      desc: 'Microsporidian gut parasite. Nosema ceranae (most common now) and N. apis. Infects midgut lining, shortens bee lifespan, impairs royal jelly production. N. apis causes dysentery (brown streaks on hive). Confirmed by microscopic examination.',
      detect: ['Brown dysentery streaks on hive front or landing board (more common N. apis).', 'Unexplained spring dwindling or high winter losses.', 'Crawling bees near entrance unable to fly.', 'Confirmed by microscopic gut exam — send sample to state lab.'],
      threshold: 'Managed with improved ventilation, spring reversal, and nutrition. Fumagilin-B (where legal) is the primary chemical option.'
    },
    'Deformed Wing Virus': {
      desc: 'Most common and damaging honey bee virus, transmitted by Varroa mites. Causes crumpled, useless wings and shortened abdomens. Affected bees cannot fly and are ejected from the hive. DWV severity tracks directly with Varroa load — controlling Varroa controls DWV.',
      detect: ['Bees emerging with crumpled, shriveled wings that cannot open.', 'Shortened stubby abdomens on newly emerged bees.', 'Crawling bees at hive entrance unable to fly.'],
      threshold: 'Any visible DWV symptoms indicate serious Varroa infestation requiring immediate treatment. Treat the Varroa — the virus resolves with mite control.'
    },
    'Tracheal Mites': {
      desc: 'Acarapis woodi — microscopic mite living inside bee breathing tubes (tracheae). Cannot be seen without a microscope. May cause K-wing (forewing held at angle). Less economically significant than Varroa today.',
      detect: ['K-wing — forewings held at a distinct angle from hindwings when viewed from above.', 'Crawling bees unable to fly, especially late winter/early spring.', 'Confirmed by microscopic dissection — send sample to state lab.'],
      threshold: 'Rarely requires standalone treatment. Grease patties and menthol are standard management.'
    },
    'Ants': {
      desc: 'Various ant species invade hives, especially weak colonies. Fire ants (common in Alabama) are more aggressive and can cause real damage to weakened colonies.',
      detect: ['Ant trails on hive stands or boxes.', 'Ant nests in and around bottom boards.'],
      threshold: 'Physical barriers first — petroleum jelly or motor oil on stand legs. Chemical treatment around stands only, never inside hive.'
    },
    'Rodents (Mice/Voles)': {
      desc: 'Mice enter hives in fall seeking warmth. They destroy comb and disturb the winter cluster. Most damage occurs through winter when bees cannot defend the entrance.',
      detect: ['Mouse droppings inside hive.', 'Destroyed comb with nesting material.', 'Gnawed frames or wooden ware.'],
      threshold: 'Install mouse guards before first frost (September-October in Alabama). Entrance reducer to 3/8" gap is sufficient.'
    }
  };

  if (typeof PEST_CATEGORIES !== 'undefined') {
    Object.keys(PEST_CATEGORIES).forEach(function(key) {
      var p = PEST_CATEGORIES[key];
      var desc = PEST_DESCRIPTIONS[key] || {};
      var illus = PEST_ILLUS[key] || '';
      var id = 'pest-' + key.replace(/[^a-zA-Z]/g, '');

      html += '<div class="tref-card" id="' + id + '">';
      html += '<div class="tref-header" onclick="this.nextElementSibling.classList.toggle(\'open\');this.querySelector(\'.tref-chevron\').classList.toggle(\'open\')">'+
        '<div class="tref-ico" style="background:rgba(180,60,60,.1);color:#b43c3c;font-size:18px">' + (p.icon || '&#129458;') + '</div>'+
        '<div style="flex:1;min-width:0"><div class="tref-name">' + esc(key) + '</div>'+
        '<div class="tref-tags"><span class="tref-tag" style="background:rgba(180,60,60,.1);color:#b43c3c">' + esc(p.type || 'pest') + '</span>'+
        (p.notifiable ? '<span class="tref-tag resistance">Reportable</span>' : '') + '</div></div>'+
        '<span class="tref-chevron">&#9662;</span></div>';

      html += '<div class="tref-body">';

      if (illus || desc.desc) {
        html += '<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;padding:12px;background:#fafafa;border-radius:10px;border:1px solid #e4ede4">';
        if (illus) html += '<div style="flex-shrink:0;background:#fff;border-radius:8px;padding:6px;border:1px solid #e4ede4">' + illus + '</div>';
        if (desc.desc) html += '<div style="font-size:12px;color:var(--txt2);line-height:1.6">' + esc(desc.desc) + '</div>';
        html += '</div>';
      }

      if (desc.detect && desc.detect.length) {
        html += '<div class="tref-section"><div class="tref-section-title">How to Detect</div>';
        desc.detect.forEach(function(d) {
          html += '<div class="tref-row"><div class="tref-row-ico">&#x1F50D;</div><div style="font-size:12px;color:var(--txt2)">' + esc(d) + '</div></div>';
        });
        html += '</div>';
      }

      if (desc.threshold) {
        html += '<div class="tref-warn" style="border-color:rgba(212,132,10,.4);color:var(--warn)">' + esc(desc.threshold) + '</div>';
      }

      if (p.recommendations && p.recommendations.length) {
        html += '<div class="tref-section"><div class="tref-section-title">Recommended Treatments</div>';
        p.recommendations.forEach(function(r) {
          var treatId = id + '-' + r.name.replace(/[^a-zA-Z0-9]/g,'');
          var fullTreat = typeof VARROA_TREATMENTS !== 'undefined' ? VARROA_TREATMENTS.find(function(t){ return t.name === r.name; }) : null;
          html += '<div style="background:#fff;border:1px solid #e4ede4;border-radius:10px;margin-bottom:6px;overflow:hidden">';
          html += '<div onclick="var bd=document.getElementById(\''+treatId+'\');bd.style.display=bd.style.display===\'none\'?\'\':\'none\'" style="display:flex;align-items:flex-start;gap:10px;padding:10px;cursor:pointer">';
          html += '<div style="flex:1"><div style="font-size:13px;font-weight:700;color:var(--deep)">' + esc(r.name) + '</div>';
          html += '<div style="font-size:11px;color:var(--txt2);margin-top:2px">' + esc(r.note) + '</div>';
          if (r.warn) html += '<div style="font-size:11px;color:var(--warn);margin-top:3px">' + esc(r.warn) + '</div>';
          html += '</div><span style="color:var(--txt3);font-size:12px;flex-shrink:0">More &#9662;</span></div>';
          html += '<div id="' + treatId + '" style="display:none;padding:0 10px 10px;border-top:1px solid #e4ede4">';
          if (fullTreat) {
            html += '<div style="font-size:11px;color:var(--txt2);margin-top:8px"><strong>Duration:</strong> ' + esc(fullTreat.duration) + '</div>';
            html += '<div style="font-size:11px;color:var(--txt2);margin-top:4px"><strong>Temperature:</strong> ' + esc(fullTreat.temperature) + '</div>';
            if (fullTreat.warnings && fullTreat.warnings.length) {
              fullTreat.warnings.slice(0,3).forEach(function(w){ html += '<div style="font-size:11px;color:var(--warn);margin-top:3px">' + esc(w) + '</div>'; });
            }
          }
          html += '<button class="use-btn" style="margin-top:10px" onclick="openTreatmentModal(null)">+ Log Treatment</button>';
          html += '</div></div>';
        });
        html += '</div>';
      }

      html += '</div></div>';
    });
  }

  // Feeding Guide
  html += secHeader('lib-sec-feeding', '&#127855; Feeding Guide');
  if (typeof ALABAMA_FEEDING_CALENDAR !== 'undefined') {
    html += ALABAMA_FEEDING_CALENDAR.map(function(s) {
      return '<div class="tref-card">' +
        '<div class="tref-header" onclick="this.nextElementSibling.classList.toggle(\'open\');this.querySelector(\'.tref-chevron\').classList.toggle(\'open\')">' +
          '<div class="tref-ico organic" style="font-size:18px">&#128467;</div>' +
          '<div style="flex:1;min-width:0"><div class="tref-name">' + esc(s.season || s.months) + '</div>' +
          '<div class="tref-tags"><span class="tref-tag organic">' + esc(s.months || '') + '</span></div></div>' +
          '<span class="tref-chevron">&#9662;</span>' +
        '</div>' +
        '<div class="tref-body">' +
          (s.situation ? '<div class="tref-section"><div class="tref-section-title">Situation</div><div class="tref-note">' + esc(s.situation) + '</div></div>' : '') +
          (s.syrup ? '<div class="tref-section"><div class="tref-section-title">Syrup</div><div class="tref-note">' + esc(s.syrup) + '</div></div>' : '') +
          (s.patties ? '<div class="tref-section"><div class="tref-section-title">Protein Patties</div><div class="tref-note">' + esc(s.patties) + '</div></div>' : '') +
          (s.notes ? '<div class="tref-note" style="margin-top:8px">' + esc(s.notes) + '</div>' : '') +
        '</div>' +
      '</div>';
    }).join('');
  }

  // Feeding Supplements
  html += secHeader('lib-sec-supplements', '&#129514; Feeding Supplements');
  if (typeof FEEDING_SUPPLEMENTS !== 'undefined') {
    html += FEEDING_SUPPLEMENTS.map(function(s) {
      return '<div class="tref-card">' +
        '<div class="tref-header" onclick="this.nextElementSibling.classList.toggle(\'open\');this.querySelector(\'.tref-chevron\').classList.toggle(\'open\')">' +
          '<div class="tref-ico organic" style="font-size:18px">&#129514;</div>' +
          '<div style="flex:1;min-width:0"><div class="tref-name">' + esc(s.name) + '</div>' +
          '<div class="tref-tags"><span class="tref-tag organic">Supplement</span></div></div>' +
          '<span class="tref-chevron">&#9662;</span>' +
        '</div>' +
        '<div class="tref-body">' +
          (s.summary ? '<div class="tref-note">' + esc(s.summary) + '</div>' : '') +
          (s.whatItIs ? '<div class="tref-section"><div class="tref-section-title">What It Is</div><div class="tref-note">' + esc(s.whatItIs) + '</div></div>' : '') +
          (s.warnings && s.warnings.length ? '<div class="tref-warn">' + s.warnings.map(function(w) { return esc(w); }).join('<br>') + '</div>' : '') +
          (s.notes ? '<div class="tref-note">' + esc(s.notes) + '</div>' : '') +
        '</div>' +
      '</div>';
    }).join('');
  }

  // Syrup Mixing Guide — inline data (Dadant recommendations)
  html += secHeader('lib-sec-syrup', '&#127802; Syrup Mixing Guide');
  var SYRUP_DATA = [
    { name:'1:1 Sugar Syrup (Spring/Summer)', ratio:'1 lb sugar : 1 pt water', use:'Stimulates brood rearing and comb building. Use in spring to stimulate buildup and for new packages/splits. Do not use during honey flow.', temp:'Feed when temps are above 50°F.', note:'Per Dadant: Add Honey-B-Healthy at 1 tsp/qt to stimulate feeding and inhibit fermentation.' },
    { name:'2:1 Sugar Syrup (Fall/Winter)', ratio:'2 lbs sugar : 1 pt water', use:'Winter stores — heavier syrup converts to honey faster with less moisture. Feed in fall to ensure adequate winter stores. Stop feeding when temps drop below 50°F consistently.', temp:'Feed before temps drop below 50°F.', note:'Per Dadant: Feed until bees stop taking it. A light hive in November needs emergency feeding — switch to candy board below 50°F.' },
    { name:'Candy Board (Winter Emergency)', ratio:'10 lbs sugar : 1/2 cup water', use:'Emergency winter feed when temps are too cold for syrup. Bees consume as needed. Place directly above cluster.', temp:'Use when temps consistently below 50°F.', note:'Mix sugar and water to stiff dough, press into mold or rimmed board. Let dry 24 hours. Place rim-side down over cluster.' },
    { name:'Fondant / Sugar Brick', ratio:'4 lbs sugar : 1/4 cup water', use:'Similar to candy board — emergency winter or early spring feed. Easy to make in bulk.', temp:'Any temperature — solid feed.', note:'Boil to soft ball stage (235-240°F), cool to 110°F, beat until creamy white, pour into molds.' }
  ];
  html += SYRUP_DATA.map(function(s) {
    return '<div class="tref-card">' +
      '<div class="tref-header" onclick="this.nextElementSibling.classList.toggle(\'open\');this.querySelector(\'.tref-chevron\').classList.toggle(\'open\')">' +
        '<div class="tref-ico organic" style="font-size:18px">&#127855;</div>' +
        '<div style="flex:1;min-width:0"><div class="tref-name">' + esc(s.name) + '</div>' +
        '<div class="tref-tags"><span class="tref-tag organic">' + esc(s.ratio) + '</span></div></div>' +
        '<span class="tref-chevron">&#9662;</span>' +
      '</div>' +
      '<div class="tref-body">' +
        '<div class="tref-section"><div class="tref-section-title">Ratio</div><div class="tref-note">' + esc(s.ratio) + '</div></div>' +
        '<div class="tref-section"><div class="tref-section-title">When to Use</div><div class="tref-note">' + esc(s.use) + '</div></div>' +
        '<div class="tref-section"><div class="tref-section-title">Temperature</div><div class="tref-note">' + esc(s.temp) + '</div></div>' +
        (s.note ? '<div class="tref-warn">' + esc(s.note) + '</div>' : '') +
      '</div>' +
    '</div>';
  }).join('');

  el.innerHTML = html;
}

function jumpToLibSection(id) {
  if (!id) return;
  var target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  var sel = document.getElementById('lib-jump-select');
  if (sel) setTimeout(function() { sel.value = ''; }, 800);
}
