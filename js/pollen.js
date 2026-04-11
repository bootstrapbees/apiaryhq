// ═══════════════════════════════════════════════════════
// APIARY HQ — POLLEN & FORAGING FORECAST
// Zone data lives in zones.js — loaded before this file
// ═══════════════════════════════════════════════════════

var POLLEN_SVG = {
  tree:   '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><path d="M10 2l5 7H5l5-7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="currentColor" opacity=".2"/><path d="M10 7l5 7.5H5L10 7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="currentColor" opacity=".2"/><line x1="10" y1="14.5" x2="10" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  grass:  '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><path d="M10 18V9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10 11C8 8 5 7 5 7s.5 5 5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" opacity=".15"/><path d="M10 14c2-4 5-4 5-4s-.5 5-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" opacity=".15"/></svg>',
  flower: '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2.5" fill="currentColor" opacity=".35" stroke="currentColor" stroke-width="1.3"/><ellipse cx="10" cy="5" rx="2" ry="3" stroke="currentColor" stroke-width="1.2" opacity=".7"/><ellipse cx="10" cy="15" rx="2" ry="3" stroke="currentColor" stroke-width="1.2" opacity=".7"/><ellipse cx="5" cy="10" rx="3" ry="2" stroke="currentColor" stroke-width="1.2" opacity=".7"/><ellipse cx="15" cy="10" rx="3" ry="2" stroke="currentColor" stroke-width="1.2" opacity=".7"/></svg>',
  low:    '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" opacity=".4"/><circle cx="10" cy="10" r="3" fill="currentColor" opacity=".3"/></svg>',
  bee:    '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="12" rx="4" ry="5" stroke="currentColor" stroke-width="1.5"/><ellipse cx="7.5" cy="8" rx="3" ry="1.5" transform="rotate(-25 7.5 8)" stroke="currentColor" stroke-width="1.3" opacity=".6"/><ellipse cx="12.5" cy="8" rx="3" ry="1.5" transform="rotate(25 12.5 8)" stroke="currentColor" stroke-width="1.3" opacity=".6"/><circle cx="10" cy="6" r="1.8" stroke="currentColor" stroke-width="1.3"/><line x1="8" y1="12" x2="12" y2="12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="8" y1="14.5" x2="12" y2="14.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  cal:    '<svg viewBox="0 0 20 20" fill="none" style="width:12px;height:12px;display:inline-block;vertical-align:-2px" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><line x1="6" y1="2" x2="6" y2="6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="14" y1="2" x2="14" y2="6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="2" y1="9" x2="18" y2="9" stroke="currentColor" stroke-width="1.3"/></svg>',
};

function pollenLevel(v) {
  if (v === 0) return { label:'None',   cls:'pl-none',  fill:'#9CA3AF', bar:0   };
  if (v === 1) return { label:'V. Low', cls:'pl-vlow',  fill:'#4ADE80', bar:20  };
  if (v === 2) return { label:'Low',    cls:'pl-low',   fill:'#86EFAC', bar:40  };
  if (v === 3) return { label:'Med',    cls:'pl-med',   fill:'#FCD34D', bar:60  };
  if (v === 4) return { label:'High',   cls:'pl-high',  fill:'#F97316', bar:80  };
  return             { label:'V.High',  cls:'pl-vhigh', fill:'#EF4444', bar:100 };
}

function pollenDayIcon(tree, grass, weed) {
  var max = Math.max(tree, grass, weed);
  if (max <= 1) return POLLEN_SVG.low;
  if (tree >= grass && tree >= weed) return POLLEN_SVG.tree;
  if (weed >= grass) return POLLEN_SVG.flower;
  return POLLEN_SVG.grass;
}

function loadPollenForecast() {
  var el = document.getElementById('dash-pollen');
  if (!el) return;

  var lat = parseFloat(localStorage.getItem('apiaryhq_lat'));
  var lng = parseFloat(localStorage.getItem('apiaryhq_lng'));

  if (!lat || !lng) {
    el.innerHTML = '<div style="font-size:12px;color:var(--txt2);font-style:italic;text-align:center;padding:8px 0">Set your ZIP code above to see foraging conditions.</div>';
    return;
  }

  if (window._pollenData) {
    renderPollenWidget(el, window._pollenData);
    return;
  }

  // getZoneData() is defined in zones.js
  var result = getZoneData(lat);
  window._pollenData = result;
  renderPollenWidget(el, result);
}

function renderPollenWidget(el, result) {
  var days = result.days;
  var forageTip = result.tip;
  var zoneLabel = result.zoneLabel || 'Seasonal';
  var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  var html = '<div style="display:flex;gap:5px;margin-bottom:10px">';
  days.forEach(function(d, i) {
    var maxVal = Math.max(d.tree, d.grass, d.weed);
    var maxLev = pollenLevel(maxVal);
    var ico = pollenDayIcon(d.tree, d.grass, d.weed);
    var label = i===0 ? 'Today' : i===1 ? 'Tmrw' : dayNames[d.date.getDay()];
    html += '<div class="pollen-day" style="color:'+maxLev.fill+'">'+
      '<div class="pollen-date" style="color:var(--txt2)">'+label+'</div>'+
      '<div class="pollen-icon">'+ico+'</div>'+
      '<div class="pollen-bar"><div class="pollen-fill" style="width:'+maxLev.bar+'%;background:'+maxLev.fill+'"></div></div>'+
      '<div class="pollen-label '+maxLev.cls+'">'+maxLev.label+'</div>'+
    '</div>';
  });
  html += '</div>';

  if (days.length) {
    var t = days[0];
    html += '<div class="pollen-breakdown"><div class="pollen-source-row">';
    html += '<div style="flex:1;text-align:center">'+POLLEN_SVG.tree+'<div style="color:var(--txt2);font-size:10px;margin:2px 0">Trees</div><div class="'+pollenLevel(t.tree).cls+'" style="font-weight:700;font-size:11px">'+pollenLevel(t.tree).label+'</div></div>';
    html += '<div style="flex:1;text-align:center">'+POLLEN_SVG.grass+'<div style="color:var(--txt2);font-size:10px;margin:2px 0">Grass</div><div class="'+pollenLevel(t.grass).cls+'" style="font-weight:700;font-size:11px">'+pollenLevel(t.grass).label+'</div></div>';
    html += '<div style="flex:1;text-align:center">'+POLLEN_SVG.flower+'<div style="color:var(--txt2);font-size:10px;margin:2px 0">Weeds</div><div class="'+pollenLevel(t.weed).cls+'" style="font-weight:700;font-size:11px">'+pollenLevel(t.weed).label+'</div></div>';
    html += '</div></div>';
  }

  if (forageTip) {
    html += '<div class="pollen-bee-tip">'+POLLEN_SVG.bee+'<span style="flex:1"><strong>Foraging:</strong> '+forageTip+'</span></div>';
  }

  html += '<div class="pollen-source">'+POLLEN_SVG.cal+' '+zoneLabel+'</div>';
  el.innerHTML = html;
}
