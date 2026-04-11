// ═══════════════════════════════════════════════════════
// APIARY HQ — ZONE DATA
// USDA hardiness zone groups derived from latitude
// Used by pollen.js for seasonal forecasts
// 4 zone groups: A(3-4) B(5-6) C(7-8) D(9-10)
// ═══════════════════════════════════════════════════════

function getZoneGroup(lat) {
  if (lat < 31) return 'D';
  if (lat < 39) return 'C';
  if (lat < 45) return 'B';
  return 'A';
}

var ZONE_LABELS = {
  A: 'Zone 3-4 (Northern US)',
  B: 'Zone 5-6 (Mid US)',
  C: 'Zone 7-8 (Southeast)',
  D: 'Zone 9-10 (Deep South / SW)'
};

// Monthly pollen [tree, grass, weed] 0-5, index 0=Jan
var ZONE_POLLEN = {
  A: [
    [0,0,0],[0,0,0],[1,0,0],[2,0,0],[4,1,0],[4,3,0],
    [2,4,1],[0,3,2],[0,2,4],[0,1,3],[0,0,1],[0,0,0]
  ],
  B: [
    [0,0,0],[1,0,0],[3,0,0],[4,1,0],[5,3,1],[3,5,2],
    [1,4,2],[0,3,3],[0,2,5],[1,1,3],[1,0,1],[0,0,0]
  ],
  C: [
    [1,0,0],[2,0,0],[4,1,0],[5,2,1],[3,4,1],[1,5,2],
    [0,3,2],[0,3,2],[0,2,4],[1,1,5],[1,0,2],[0,0,0]
  ],
  D: [
    [3,1,0],[4,2,0],[4,3,1],[3,4,2],[2,5,2],[1,4,3],
    [0,3,3],[0,3,3],[0,2,4],[1,2,5],[2,1,3],[2,0,1]
  ]
};

// Forage tips by zone and month (1-indexed)
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

// Main lookup called by pollen.js
function getZoneData(lat) {
  var zone = getZoneGroup(lat);
  var data = ZONE_POLLEN[zone];
  var tips = ZONE_TIPS[zone];
  var days = [];
  for (var i = 0; i < 5; i++) {
    var d = new Date();
    d.setDate(d.getDate() + i);
    var mo = d.getMonth();
    var row = data[mo];
    days.push({ date: d, tree: row[0], grass: row[1], weed: row[2] });
  }
  var mo1 = new Date().getMonth() + 1;
  return {
    days: days,
    zone: zone,
    zoneLabel: ZONE_LABELS[zone] || 'Seasonal',
    tip: tips[mo1] || null
  };
}
