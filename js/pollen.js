// ═══════════════════════════════════════════════════════
// POLLEN & FORAGING FORECAST (CLEAN VERSION)
// ═══════════════════════════════════════════════════════

// Tomorrow.io — restrict this key by domain/referrer in their dashboard.
var TOMORROW_IO_API_KEY = '1XMXbgs6ICD5QY9ws7VwbvDHjOMYevwy';

function getTomorrowIoApiKey() {
  var embedded = (TOMORROW_IO_API_KEY && String(TOMORROW_IO_API_KEY).trim()) || '';
  if (embedded) return embedded;
  var cfg = (typeof window !== 'undefined' && window.APIARY_LOCAL) || {};
  var k = (cfg.TOMORROW_IO_API_KEY && String(cfg.TOMORROW_IO_API_KEY).trim()) || '';
  if (k) return k;
  try {
    return localStorage.getItem('hkpro_tomorrow_key') || '';
  } catch (e) {
    return '';
  }
}

var POLLEN_SVG = {
  tree:   '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><path d="M10 2l5 7H5l5-7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="currentColor" opacity=".2"/><path d="M10 7l5 7.5H5L10 7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="currentColor" opacity=".2"/><line x1="10" y1="14.5" x2="10" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  grass:  '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><path d="M10 18V9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10 11C8 8 5 7 5 7s.5 5 5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" opacity=".15"/><path d="M10 14c2-4 5-4 5-4s-.5 5-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" opacity=".15"/></svg>',
  flower: '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2.5" fill="currentColor" opacity=".35" stroke="currentColor" stroke-width="1.3"/><ellipse cx="10" cy="5" rx="2" ry="3" stroke="currentColor" stroke-width="1.2" opacity=".7"/><ellipse cx="10" cy="15" rx="2" ry="3" stroke="currentColor" stroke-width="1.2" opacity=".7"/><ellipse cx="5" cy="10" rx="3" ry="2" stroke="currentColor" stroke-width="1.2" opacity=".7"/><ellipse cx="15" cy="10" rx="3" ry="2" stroke="currentColor" stroke-width="1.2" opacity=".7"/></svg>',
  low:    '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" opacity=".4"/><circle cx="10" cy="10" r="3" fill="currentColor" opacity=".3"/></svg>',
  bee:    '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="12" rx="4" ry="5" stroke="currentColor" stroke-width="1.5"/><ellipse cx="7.5" cy="8" rx="3" ry="1.5" transform="rotate(-25 7.5 8)" stroke="currentColor" stroke-width="1.3" opacity=".6"/><ellipse cx="12.5" cy="8" rx="3" ry="1.5" transform="rotate(25 12.5 8)" stroke="currentColor" stroke-width="1.3" opacity=".6"/><circle cx="10" cy="6" r="1.8" stroke="currentColor" stroke-width="1.3"/><line x1="8" y1="12" x2="12" y2="12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="8" y1="14.5" x2="12" y2="14.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  sat:    '<svg viewBox="0 0 20 20" fill="none" style="width:12px;height:12px;display:inline-block;vertical-align:-2px" xmlns="http://www.w3.org/2000/svg"><path d="M3 10a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M6 10a4 4 0 018 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/><line x1="10" y1="11.5" x2="10" y2="15" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  cal:    '<svg viewBox="0 0 20 20" fill="none" style="width:12px;height:12px;display:inline-block;vertical-align:-2px" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><line x1="6" y1="2" x2="6" y2="6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="14" y1="2" x2="14" y2="6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="2" y1="9" x2="18" y2="9" stroke="currentColor" stroke-width="1.3"/></svg>',
};

function getAlabamaPollFallback() {
  var days = [];
  for (var i = 0; i < 5; i++) {
    var d = new Date(); d.setDate(d.getDate() + i);
    var mo = d.getMonth() + 1;
    var tree, grass, weed;
    if (mo === 1 || mo === 2)      { tree=1; grass=0; weed=0; }
    else if (mo === 3)             { tree=4; grass=1; weed=0; }
    else if (mo === 4)             { tree=5; grass=2; weed=1; }
    else if (mo === 5)             { tree=3; grass=4; weed=1; }
    else if (mo === 6)             { tree=1; grass=5; weed=2; }
    else if (mo === 7 || mo === 8) { tree=0; grass=3; weed=2; }
    else if (mo === 9)             { tree=0; grass=2; weed=4; }
    else if (mo === 10)            { tree=1; grass=1; weed=5; }
    else if (mo === 11)            { tree=1; grass=0; weed=2; }
    else                           { tree=0; grass=0; weed=0; }
    days.push({ date:d, tree:tree, grass:grass, weed:weed, source:'seasonal' });
  }
  return days;
}

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

function pollenBeeTip(days) {
  if (!days || !days.length) return null;
  var today = days[0];
  var tree = today.tree, grass = today.grass, weed = today.weed;
  var max = Math.max(tree, grass, weed);
  var m = new Date().getMonth() + 1;
  var dominant = tree >= grass && tree >= weed ? 'tree' : weed >= grass ? 'weed' : 'grass';

  if (max === 0) return { tip:'No pollen detected. Dearth conditions — monitor stores and consider feeding.' };
  if (max === 1) return { tip:'Very low pollen activity. Light foraging expected. Check stores.' };
  if (dominant === 'tree' && tree >= 3) {
    var plants = (m>=3&&m<=4)?'Tulip poplar and maple likely active':'Trees active';
    return { tip:'Good tree pollen conditions. '+plants+'.' };
  }
  if (dominant === 'weed' && weed >= 3) {
    var wp = (m>=9&&m<=10)?'Goldenrod and aster prime flow.':'Weed pollen active.';
    return { tip:wp };
  }
  return { tip:'Moderate foraging conditions — observe entrance traffic.' };
}

function loadPollenForecast() {
  var el = document.getElementById('dash-pollen');
  if (!el) return;
  var apiKey = getTomorrowIoApiKey();
  if (!apiKey) { renderPollenWidget(el, getAlabamaPollFallback(), 'alabama-seasonal'); return; }
  if (window._pollenData) { renderPollenWidget(el, window._pollenData.days, window._pollenData.source); return; }
  
  el.innerHTML = '<div style="font-size:12px;color:var(--txt2)">Loading forecast…</div>';

  fetch('https://api.tomorrow.io/v4/weather/forecast?location=33.6954,-85.7732&fields=treeIndex,grassIndex,weedIndex&timesteps=1d&apikey=' + apiKey)
    .then(function(r) { return r.json(); })
    .then(function(j) {
      if (j.code || !j.timelines || !j.timelines.daily) { 
        renderPollenWidget(el, getAlabamaPollFallback(), 'alabama-seasonal'); 
        return; 
      }
      var days = j.timelines.daily.slice(0, 5).map(function(iv) {
        var v = iv.values;
        return {
          date: new Date(iv.time),
          tree: v.treeIndex || 0,
          grass: v.grassIndex || 0,
          weed: v.weedIndex || 0,
          source: 'tomorrow'
        };
      });
      window._pollenData = { days: days, source: 'tomorrow' };
      renderPollenWidget(el, days, 'tomorrow');
    })
    .catch(function() { 
      renderPollenWidget(el, getAlabamaPollFallback(), 'alabama-seasonal'); 
    });
}

function renderPollenWidget(el, days, source) {
  var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var tip = pollenBeeTip(days);
  var html = '<div style="display:flex;gap:5px;margin-bottom:10px">';
  days.forEach(function(d, i) {
    var maxVal = Math.max(d.tree, d.grass, d.weed);
    var maxLev = pollenLevel(maxVal);
    var label = i===0?'Today':i===1?'Tmrw':dayNames[d.date.getDay()];
    html += '<div class="pollen-day" style="color:'+maxLev.fill+'">'+
      '<div class="pollen-date" style="color:var(--txt2)">'+label+'</div>'+
      '<div class="pollen-icon">'+pollenDayIcon(d.tree, d.grass, d.weed)+'</div>'+
      '<div class="pollen-bar"><div class="pollen-fill" style="width:'+maxLev.bar+'%;background:'+maxLev.fill+'"></div></div>'+
      '<div class="pollen-label '+maxLev.cls+'">'+maxLev.label+'</div>'+
    '</div>';
  });
  html += '</div>';

  if (days.length) {
    var t = days[0];
    html += '<div class="pollen-breakdown"><div class="pollen-source-row">';
    html += '<div style="flex:1;text-align:center">'+POLLEN_SVG.tree+'<div style="color:var(--txt2);font-size:10px">Trees</div><div class="'+pollenLevel(t.tree).cls+'">'+pollenLevel(t.tree).label+'</div></div>';
    html += '<div style="flex:1;text-align:center">'+POLLEN_SVG.grass+'<div style="color:var(--txt2);font-size:10px">Grass</div><div class="'+pollenLevel(t.grass).cls+'">'+pollenLevel(t.grass).label+'</div></div>';
    html += '<div style="flex:1;text-align:center">'+POLLEN_SVG.flower+'<div style="color:var(--txt2);font-size:10px">Weeds</div><div class="'+pollenLevel(t.weed).cls+'">'+pollenLevel(t.weed).label+'</div></div>';
    html += '</div></div>';
  }

  if (tip) html += '<div class="pollen-bee-tip">'+POLLEN_SVG.bee+'<span style="flex:1"><strong>Foraging:</strong> '+tip.tip+'</span></div>';
  html += '<div class="pollen-source">'+(source==='tomorrow'?POLLEN_SVG.sat+' Tomorrow.io live data':POLLEN_SVG.cal+' Alabama seasonal estimate')+'</div>';
  el.innerHTML = html;
}