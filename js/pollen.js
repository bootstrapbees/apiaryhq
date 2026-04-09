// ═══════════════════════════════════════════════════════
// APIARY HQ — POLLEN & FORAGING FORECAST
// Open-Meteo pollen API (free, no key)
// Falls back to zone-based seasonal estimate
// ═══════════════════════════════════════════════════════

var POLLEN_SVG = {
  tree:   '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><path d="M10 2l5 7H5l5-7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="currentColor" opacity=".2"/><path d="M10 7l5 7.5H5L10 7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="currentColor" opacity=".2"/><line x1="10" y1="14.5" x2="10" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  grass:  '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><path d="M10 18V9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10 11C8 8 5 7 5 7s.5 5 5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" opacity=".15"/><path d="M10 14c2-4 5-4 5-4s-.5 5-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" opacity=".15"/></svg>',
  flower: '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2.5" fill="currentColor" opacity=".35" stroke="currentColor" stroke-width="1.3"/><ellipse cx="10" cy="5" rx="2" ry="3" stroke="currentColor" stroke-width="1.2" opacity=".7"/><ellipse cx="10" cy="15" rx="2" ry="3" stroke="currentColor" stroke-width="1.2" opacity=".7"/><ellipse cx="5" cy="10" rx="3" ry="2" stroke="currentColor" stroke-width="1.2" opacity=".7"/><ellipse cx="15" cy="10" rx="3" ry="2" stroke="currentColor" stroke-width="1.2" opacity=".7"/></svg>',
  low:    '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" opacity=".4"/><circle cx="10" cy="10" r="3" fill="currentColor" opacity=".3"/></svg>',
  bee:    '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="12" rx="4" ry="5" stroke="currentColor" stroke-width="1.5"/><ellipse cx="7.5" cy="8" rx="3" ry="1.5" transform="rotate(-25 7.5 8)" stroke="currentColor" stroke-width="1.3" opacity=".6"/><ellipse cx="12.5" cy="8" rx="3" ry="1.5" transform="rotate(25 12.5 8)" stroke="currentColor" stroke-width="1.3" opacity=".6"/><circle cx="10" cy="6" r="1.8" stroke="currentColor" stroke-width="1.3"/><line x1="8" y1="12" x2="12" y2="12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="8" y1="14.5" x2="12" y2="14.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  cal:    '<svg viewBox="0 0 20 20" fill="none" style="width:12px;height:12px;display:inline-block;vertical-align:-2px" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><line x1="6" y1="2" x2="6" y2="6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="14" y1="2" x2="14" y2="6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="2" y1="9" x2="18" y2="9" stroke="currentColor" stroke-width="1.3"/></svg>',
  live:   '<svg viewBox="0 0 20 20" fill="none" style="width:12px;height:12px;display:inline-block;vertical-align:-2px" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="3" fill="currentColor" opacity=".8"/><circle cx="10" cy="10" r="6" stroke="currentColor" stroke-width="1.3" opacity=".5"/><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1" opacity=".2"/></svg>',
};

// ── Seasonal fallback data (Zone 7b / general southeast) ──
function getSeasonalFallback() {
  var days = [];
  for (var i = 0; i < 5; i++) {
    var d = new Date(); d.setDate(d.getDate() + i);
    var mo = d.getMonth() + 1;
    var tree, grass, weed;
    if (mo <= 2)           { tree=1; grass=0; weed=0; }
    else if (mo === 3)     { tree=4; grass=1; weed=0; }
    else if (mo === 4)     { tree=5; grass=2; weed=1; }
    else if (mo === 5)     { tree=3; grass=4; weed=1; }
    else if (mo === 6)     { tree=1; grass=5; weed=2; }
    else if (mo <= 8)      { tree=0; grass=3; weed=2; }
    else if (mo === 9)     { tree=0; grass=2; weed=4; }
    else if (mo === 10)    { tree=1; grass=1; weed=5; }
    else if (mo === 11)    { tree=1; grass=0; weed=2; }
    else                   { tree=0; grass=0; weed=0; }
    days.push({ date:d, tree:tree, grass:grass, weed:weed });
  }
  return days;
}

// ── Convert Open-Meteo pollen index (0–5 scale) to our 0–5 scale ──
function omPollenToLevel(v) {
  if (v == null) return 0;
  // Open-Meteo returns 0,1,2,3,4,5 — maps directly
  return Math.min(5, Math.max(0, Math.round(v)));
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

  if (max === 0) return { tip: 'No pollen detected. Dearth conditions — monitor stores and consider feeding. Watch for robbing at entrances.' };
  if (max === 1) return { tip: 'Very low pollen. Light foraging expected. Check stores — supplemental feeding may help.' };
  if (dominant === 'tree' && tree >= 3) {
    var plants = (m>=3&&m<=4) ? 'Tulip poplar, red maple, and black locust likely active'
               : (m>=4&&m<=5) ? 'Black locust and sourwood building up'
               : 'Tree species active';
    return { tip: 'Good tree pollen. ' + plants + '. Check super space and ensure room for incoming nectar.' };
  }
  if (dominant === 'weed' && weed >= 3) {
    var wp = (m>=9&&m<=10) ? 'Goldenrod and aster likely in bloom — prime fall flow. Hold off on feeding syrup.'
           : (m>=7&&m<=8)  ? 'Summer weeds active. Moderate forage value.'
           : 'Weed pollen active';
    return { tip: wp + (weed >= 4 ? ' Consider adding supers if not already on.' : '') };
  }
  if (dominant === 'grass' && grass >= 3) {
    return { tip: 'Grass pollen elevated — limited direct value since grasses are wind-pollinated. Monitor nectar stores.' };
  }
  return { tip: 'Moderate mixed pollen. Decent foraging conditions — watch entrance traffic to gauge activity.' };
}

function loadPollenForecast() {
  var el = document.getElementById('dash-pollen');
  if (!el) return;

  var lat = parseFloat(localStorage.getItem('apiaryhq_lat'));
  var lng = parseFloat(localStorage.getItem('apiaryhq_lng'));

  // No ZIP set yet — show nothing, weather widget handles the prompt
  if (!lat || !lng) {
    el.innerHTML = '<div style="font-size:12px;color:var(--txt2);font-style:italic;text-align:center;padding:8px 0">Set your ZIP code above to get pollen forecasts.</div>';
    return;
  }

  if (window._pollenData) {
    renderPollenWidget(el, window._pollenData.days, window._pollenData.source);
    return;
  }

  el.innerHTML = '<div style="font-size:12px;color:var(--txt2)">Loading pollen forecast...</div>';

  // Open-Meteo free pollen API
  var url = 'https://air-quality-api.open-meteo.com/v1/air-quality' +
    '?latitude=' + lat + '&longitude=' + lng +
    '&hourly=grass_pollen,birch_pollen,alder_pollen,mugwort_pollen,olive_pollen,ragweed_pollen' +
    '&timezone=auto&forecast_days=5';

  fetch(url)
    .then(function(r) { return r.json(); })
    .then(function(j) {
      if (!j.hourly || !j.hourly.time) {
        renderPollenWidget(el, getSeasonalFallback(), 'seasonal');
        return;
      }
      // Average daily values from hourly data (noon = index 12 for each day)
      var days = [];
      var times = j.hourly.time;
      var grasses = j.hourly.grass_pollen || [];
      var trees1  = j.hourly.birch_pollen || [];
      var trees2  = j.hourly.alder_pollen || [];
      var weeds1  = j.hourly.mugwort_pollen || [];
      var weeds2  = j.hourly.ragweed_pollen || [];

      // Group by day — take the max value for the day
      var dayMap = {};
      for (var i = 0; i < times.length; i++) {
        var dayKey = times[i].slice(0,10);
        if (!dayMap[dayKey]) dayMap[dayKey] = { grass:[], tree:[], weed:[] };
        if (grasses[i] != null) dayMap[dayKey].grass.push(grasses[i]);
        var treeVal = Math.max(trees1[i] || 0, trees2[i] || 0);
        if (treeVal > 0) dayMap[dayKey].tree.push(treeVal);
        var weedVal = Math.max(weeds1[i] || 0, weeds2[i] || 0);
        if (weedVal > 0) dayMap[dayKey].weed.push(weedVal);
      }

      // Pollen grain/m3 thresholds → 0-5 scale
      function grainToLevel(arr, highThreshold) {
        if (!arr || !arr.length) return 0;
        var max = Math.max.apply(null, arr);
        if (max <= 0)                   return 0;
        if (max < highThreshold * 0.05) return 1;
        if (max < highThreshold * 0.15) return 2;
        if (max < highThreshold * 0.40) return 3;
        if (max < highThreshold * 0.75) return 4;
        return 5;
      }

      var dayKeys = Object.keys(dayMap).sort().slice(0,5);
      dayKeys.forEach(function(key) {
        var dm = dayMap[key];
        days.push({
          date: new Date(key + 'T12:00:00'),
          tree:  grainToLevel(dm.tree,  200),
          grass: grainToLevel(dm.grass, 100),
          weed:  grainToLevel(dm.weed,  50)
        });
      });

      if (!days.length) {
        renderPollenWidget(el, getSeasonalFallback(), 'seasonal');
        return;
      }

      window._pollenData = { days: days, source: 'open-meteo' };
      renderPollenWidget(el, days, 'open-meteo');
    })
    .catch(function() {
      renderPollenWidget(el, getSeasonalFallback(), 'seasonal');
    });
}

function renderPollenWidget(el, days, source) {
  var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var tip = pollenBeeTip(days);

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
    html += '<div class="pollen-breakdown">';
    html += '<div class="pollen-source-row">';
    html += '<div style="flex:1;text-align:center">'+POLLEN_SVG.tree+'<div style="color:var(--txt2);font-size:10px;margin:2px 0">Trees</div><div class="'+pollenLevel(t.tree).cls+'" style="font-weight:700;font-size:11px">'+pollenLevel(t.tree).label+'</div></div>';
    html += '<div style="flex:1;text-align:center">'+POLLEN_SVG.grass+'<div style="color:var(--txt2);font-size:10px;margin:2px 0">Grass</div><div class="'+pollenLevel(t.grass).cls+'" style="font-weight:700;font-size:11px">'+pollenLevel(t.grass).label+'</div></div>';
    html += '<div style="flex:1;text-align:center">'+POLLEN_SVG.flower+'<div style="color:var(--txt2);font-size:10px;margin:2px 0">Weeds</div><div class="'+pollenLevel(t.weed).cls+'" style="font-weight:700;font-size:11px">'+pollenLevel(t.weed).label+'</div></div>';
    html += '</div></div>';
  }

  if (tip) {
    html += '<div class="pollen-bee-tip">'+POLLEN_SVG.bee+'<span style="flex:1"><strong>Foraging:</strong> '+tip.tip+'</span></div>';
  }

  var sourceLabel = source === 'open-meteo'
    ? POLLEN_SVG.live + ' Open-Meteo live pollen data'
    : POLLEN_SVG.cal  + ' Seasonal estimate (zone-based)';
  html += '<div class="pollen-source">'+sourceLabel+'</div>';

  el.innerHTML = html;
}
