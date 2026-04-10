// ═══════════════════════════════════════════════════════
// APIARY HQ — POLLEN & FORAGING FORECAST
// Pure zone-based seasonal estimates — no external API
// Zone derived from USDA hardiness zone via lat/lng
// 4 zone groups: A(3-4) B(5-6) C(7-8) D(9-10)
// ═══════════════════════════════════════════════════════

var POLLEN_SVG = {
  tree:   '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><path d="M10 2l5 7H5l5-7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="currentColor" opacity=".2"/><path d="M10 7l5 7.5H5L10 7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="currentColor" opacity=".2"/><line x1="10" y1="14.5" x2="10" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  grass:  '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><path d="M10 18V9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10 11C8 8 5 7 5 7s.5 5 5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" opacity=".15"/><path d="M10 14c2-4 5-4 5-4s-.5 5-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" opacity=".15"/></svg>',
  flower: '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2.5" fill="currentColor" opacity=".35" stroke="currentColor" stroke-width="1.3"/><ellipse cx="10" cy="5" rx="2" ry="3" stroke="currentColor" stroke-width="1.2" opacity=".7"/><ellipse cx="10" cy="15" rx="2" ry="3" stroke="currentColor" stroke-width="1.2" opacity=".7"/><ellipse cx="5" cy="10" rx="3" ry="2" stroke="currentColor" stroke-width="1.2" opacity=".7"/><ellipse cx="15" cy="10" rx="3" ry="2" stroke="currentColor" stroke-width="1.2" opacity=".7"/></svg>',
  low:    '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" opacity=".4"/><circle cx="10" cy="10" r="3" fill="currentColor" opacity=".3"/></svg>',
  bee:    '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="12" rx="4" ry="5" stroke="currentColor" stroke-width="1.5"/><ellipse cx="7.5" cy="8" rx="3" ry="1.5" transform="rotate(-25 7.5 8)" stroke="currentColor" stroke-width="1.3" opacity=".6"/><ellipse cx="12.5" cy="8" rx="3" ry="1.5" transform="rotate(25 12.5 8)" stroke="currentColor" stroke-width="1.3" opacity=".6"/><circle cx="10" cy="6" r="1.8" stroke="currentColor" stroke-width="1.3"/><line x1="8" y1="12" x2="12" y2="12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="8" y1="14.5" x2="12" y2="14.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  cal:    '<svg viewBox="0 0 20 20" fill="none" style="width:12px;height:12px;display:inline-block;vertical-align:-2px" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><line x1="6" y1="2" x2="6" y2="6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="14" y1="2" x2="14" y2="6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="2" y1="9" x2="18" y2="9" stroke="currentColor" stroke-width="1.3"/></svg>',
};

// ── Determine zone group from latitude ───────────────
// Simplified lat-based zone approximation for US:
// Zone D (9-10): lat < 31  — Deep South / SW desert
// Zone C (7-8):  lat 31-39 — Southeast / Mid-Atlantic / Pacific NW coast
// Zone B (5-6):  lat 39-45 — Midwest / Northern Mid-Atlantic
// Zone A (3-4):  lat > 45  — Northern tier / Upper Midwest
function getZoneGroup(lat) {
  if (lat < 31)  return 'D';
  if (lat < 39)  return 'C';
  if (lat < 45)  return 'B';
  return 'A';
}

// ── Zone-based monthly pollen data ──────────────────
// [tree, grass, weed] levels 0-5 per month Jan-Dec
var ZONE_POLLEN = {
  // Zone A: Zones 3-4 — Northern US (MN, WI, ND, northern MI etc.)
  // Short season, trees peak May-June, weeds Aug-Sept
  A: [
    [0,0,0],[0,0,0],[1,0,0],[2,0,0],[4,1,0],[4,3,0],
    [2,4,1],[0,3,2],[0,2,4],[0,1,3],[0,0,1],[0,0,0]
  ],
  // Zone B: Zones 5-6 — Mid US (OH, IN, IL, MO, KS, PA, NJ etc.)
  // Trees peak Apr-May, grass June, weeds Sept
  B: [
    [0,0,0],[1,0,0],[3,0,0],[4,1,0],[5,3,1],[3,5,2],
    [1,4,2],[0,3,3],[0,2,5],[1,1,3],[1,0,1],[0,0,0]
  ],
  // Zone C: Zones 7-8 — Southeast / Mid-Atlantic (AL, GA, TN, VA, NC etc.)
  // Early trees Mar-Apr, grass May-June, goldenrod/aster Oct
  C: [
    [1,0,0],[2,0,0],[4,1,0],[5,2,1],[3,4,1],[1,5,2],
    [0,3,2],[0,3,2],[0,2,4],[1,1,5],[1,0,2],[0,0,0]
  ],
  // Zone D: Zones 9-10 — Deep South / SW (FL, LA, TX, AZ, CA etc.)
  // Near year-round activity, trees Jan-Mar, grass spring-fall
  D: [
    [3,1,0],[4,2,0],[4,3,1],[3,4,2],[2,5,2],[1,4,3],
    [0,3,3],[0,3,3],[0,2,4],[1,2,5],[2,1,3],[2,0,1]
  ]
};

// ── Forage plant tips by zone and month ─────────────
var ZONE_TIPS = {
  A: {
    3:'Maple and willow starting — first pollen of the season.',
    4:'Dandelion and fruit trees blooming.',
    5:'Apple, cherry, and early wildflowers. Strong buildup period.',
    6:'Clover and alfalfa in bloom — major nectar flow.',
    7:'Clover and basswood. Peak season.',
    8:'Late summer weeds. Monitor stores heading toward fall.',
    9:'Goldenrod and aster — important fall flow for winter stores.',
    10:'Late goldenrod. Prepare for winter — check stores now.'
  },
  B: {
    2:'Red maple starting — first forage of the season.',
    3:'Maple and early shrubs. Bees becoming active.',
    4:'Fruit trees, redbud, and dandelion in bloom.',
    5:'Black locust and clover building up — good nectar flow.',
    6:'Clover and wildflowers. Peak season for many areas.',
    7:'Summer dearth possible — monitor stores and entrance traffic.',
    8:'Late summer weeds. Watch for robbing behavior.',
    9:'Goldenrod and aster — prime fall flow for winter stores.',
    10:'Goldenrod fading. Ensure adequate winter stores now.'
  },
  C: {
    1:'Red maple and early shrubs possible in warm spells.',
    2:'Red maple, henbit, and early spring foragers active.',
    3:'Tulip poplar, red maple, and black locust building up.',
    4:'Peak tulip poplar season — major spring nectar flow.',
    5:'Black locust and sourwood building. Check super space.',
    6:'Sourwood peak in mountains. Summer dearth beginning in lowlands.',
    7:'Summer dearth — monitor stores, consider feeding.',
    8:'Late summer dearth. Watch entrance traffic carefully.',
    9:'Goldenrod and aster starting — important fall flow.',
    10:'Prime goldenrod and aster season — hold off on syrup feeding.',
    11:'Fall flow tapering. Ensure 40-50 lbs stores for winter.'
  },
  D: {
    1:'Citrus, eucalyptus, and winter bloomers active.',
    2:'Early spring bloomers. Good buildup period.',
    3:'Strong tree pollen. Spring buildup well underway.',
    4:'Peak spring flow — check super space.',
    5:'Clover and summer wildflowers. Good nectar flow.',
    6:'Summer heat — possible dearth. Monitor stores.',
    7:'Hot season — minimal forage in many areas. Feed if needed.',
    8:'Late summer. Watch stores carefully.',
    9:'Fall wildflowers starting — good late season flow.',
    10:'Goldenrod and fall bloomers. Strong flow in many areas.',
    11:'Late fall bloomers still active in warmer zones.',
    12:'Citrus and winter bloomers in zones 9-10.'
  }
};

function getZoneData(lat) {
  var zone = getZoneGroup(lat);
  var data = ZONE_POLLEN[zone];
  var tips = ZONE_TIPS[zone];
  var days = [];
  for (var i = 0; i < 5; i++) {
    var d = new Date(); d.setDate(d.getDate() + i);
    var mo = d.getMonth(); // 0-indexed
    var row = data[mo];
    days.push({ date: d, tree: row[0], grass: row[1], weed: row[2] });
  }
  var mo1 = new Date().getMonth() + 1; // 1-indexed for tips
  var tip = tips[mo1] || null;
  return { days: days, zone: zone, tip: tip };
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

  var result = getZoneData(lat);
  window._pollenData = result;
  renderPollenWidget(el, result);
}

function renderPollenWidget(el, result) {
  var days = result.days;
  var zone = result.zone;
  var forageTip = result.tip;
  var dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  // Zone label
  var zoneLabels = { A:'Zone 3-4', B:'Zone 5-6', C:'Zone 7-8', D:'Zone 9-10' };
  var zoneLabel = zoneLabels[zone] || 'Seasonal';

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

  html += '<div class="pollen-source">'+POLLEN_SVG.cal+' '+zoneLabel+' seasonal forecast</div>';
  el.innerHTML = html;
}
