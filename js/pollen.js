// ═══════════════════════════════════════════════════════
// POLLEN & FORAGING FORECAST - REWRITTEN & ROBUST
// ═══════════════════════════════════════════════════════

var TOMORROW_IO_API_KEY = '1XMXbgs6ICD5QY9ws7VwbvDHjOMYevwy';

var POLLEN_SVG = {
  tree:   '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><path d="M10 2l5 7H5l5-7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="currentColor" opacity=".2"/><path d="M10 7l5 7.5H5L10 7z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="currentColor" opacity=".2"/><line x1="10" y1="14.5" x2="10" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  grass:  '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><path d="M10 18V9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10 11C8 8 5 7 5 7s.5 5 5 5" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="currentColor" opacity=".15"/><path d="M10 14c2-4 5-4 5-4s-.5 5-5 5" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="currentColor" opacity=".15"/></svg>',
  flower: '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2.5" fill="currentColor" opacity=".35" stroke="currentColor" stroke-width="1.3"/><ellipse cx="10" cy="5" rx="2" ry="3" stroke="currentColor" stroke-width="1.2" opacity=".7"/><ellipse cx="10" cy="15" rx="2" ry="3" stroke="currentColor" stroke-width="1.2" opacity=".7"/><ellipse cx="5" cy="10" rx="3" ry="2" stroke="currentColor" stroke-width="1.2" opacity=".7"/><ellipse cx="15" cy="10" rx="3" ry="2" stroke="currentColor" stroke-width="1.2" opacity=".7"/></svg>',
  low:    '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" opacity=".4"/><circle cx="10" cy="10" r="3" fill="currentColor" opacity=".3"/></svg>',
  bee:    '<svg viewBox="0 0 20 20" fill="none" style="width:18px;height:18px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="12" rx="4" ry="5" stroke="currentColor" stroke-width="1.5"/><ellipse cx="7.5" cy="8" rx="3" ry="1.5" transform="rotate(-25 7.5 8)" stroke="currentColor" stroke-width="1.3" opacity=".6"/><ellipse cx="12.5" cy="8" rx="3" ry="1.5" transform="rotate(25 12.5 8)" stroke="currentColor" stroke-width="1.3" opacity=".6"/><circle cx="10" cy="6" r="1.8" stroke="currentColor" stroke-width="1.3"/><line x1="8" y1="12" x2="12" y2="12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="8" y1="14.5" x2="12" y2="14.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  sat:    '<svg viewBox="0 0 20 20" fill="none" style="width:12px;height:12px;display:inline-block;vertical-align:-2px" xmlns="http://www.w3.org/2000/svg"><path d="M3 10a7 7 0 0114 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M6 10a4 4 0 018 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/><line x1="10" y1="11.5" x2="10" y2="15" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  cal:    '<svg viewBox="0 0 20 20" fill="none" style="width:12px;height:12px;display:inline-block;vertical-align:-2px" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.4"/><line x1="6" y1="2" x2="6" y2="6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="14" y1="2" x2="14" y2="6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="2" y1="9" x2="18" y2="9" stroke="currentColor" stroke-width="1.3"/></svg>',
};

function pollenLevel(v) {
  if (!v || v === 0) return { label:'None',   cls:'pl-none',  fill:'#9CA3AF', bar:0   };
  if (v <= 1)        return { label:'V. Low', cls:'pl-vlow',  fill:'#4ADE80', bar:20  };
  if (v <= 2)        return { label:'Low',    cls:'pl-low',   fill:'#86EFAC', bar:40  };
  if (v <= 3)        return { label:'Med',    cls:'pl-med',   fill:'#FCD34D', bar:60  };
  if (v <= 4)        return { label:'High',   cls:'pl-high',  fill:'#F97316', bar:80  };
  return                  { label:'V.High',  cls:'pl-vhigh', fill:'#EF4444', bar:100 };
}

function getAlabamaPollFallback() {
  var days = [];
  for (var i = 0; i < 5; i++) {
    var d = new Date(); d.setDate(d.getDate() + i);
    var mo = d.getMonth() + 1;
    var tree=0, grass=0, weed=0;
    if (mo === 1 || mo === 2)      { tree=1; }
    else if (mo === 3)             { tree=4; grass=1; }
    else if (mo === 4)             { tree=5; grass=2; weed=1; }
    else if (mo === 5)             { tree=3; grass=4; weed=1; }
    else if (mo === 6)             { tree=1; grass=5; weed=2; }
    else if (mo === 7 || mo === 8) { grass=3; weed=2; }
    else if (mo === 9)             { grass=2; weed=4; }
    else if (mo === 10)            { tree=1; grass=1; weed=5; }
    else if (mo === 11)            { tree=1; weed=2; }
    days.push({ date:d, tree:tree, grass:grass, weed:weed, source:'seasonal' });
  }
  return days;
}

function loadPollenForecast() {
  var el = document.getElementById('dash-pollen');
  if (!el) return;
  
  el.innerHTML = '<div style="font-size:12px;color:var(--txt2);padding:20px;text-align:center">Fetching forecast...</div>';

  var url = 'https://api.tomorrow.io/v4/weather/forecast?location=33.6954,-85.7732&fields=treeIndex,grassIndex,weedIndex&timesteps=1d&apikey=' + TOMORROW_IO_API_KEY;

  fetch(url)
    .then(function(r) {
      if (!r.ok) throw new Error('API_REJECTED');
      return r.json();
    })
    .then(function(j) {
      var timeline = j.timelines && j.timelines.daily;

      if (!timeline || !timeline.length) {
        throw new Error('DATA_EMPTY');
      }

      var days = timeline.slice(0, 5).map(function(item) {
        var v = item.values || {};
        return {
          date: new Date(item.time),
          tree: v.treeIndex || 0,
          grass: v.grassIndex || 0,
          weed: v.weedIndex || 0,
          source: 'tomorrow'
        };
      });

      renderPollenWidget(el, days, 'tomorrow');
    })
    .catch(function(err) {
      console.warn('Pollen API issue, using Alabama fallback:', err.message);
      renderPollenWidget(el, getAlabamaPollFallback(), 'seasonal');
    });
}

function renderPollenWidget(el, days, source) {
  var names = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var today = days[0];
  var tip = '';

  if (Math.max(today.tree, today.grass, today.weed) === 0) {
    tip = 'No pollen detected. Dearth conditions — monitor stores and consider feeding.';
  } else {
    tip = 'Active foraging conditions — observe entrance traffic.';
  }

  var html = '<div style="display:flex;gap:8px;margin-bottom:15px;justify-content:space-between">';
  days.forEach(function(d, i) {
    var max = Math.max(d.tree, d.grass, d.weed);
    var lev = pollenLevel(max);
    var label = i===0?'Today':i===1?'Tmrw':names[d.date.getDay()];
    var icon = max <= 1 ? POLLEN_SVG.low : (d.tree >= d.grass && d.tree >= d.weed ? POLLEN_SVG.tree : (d.weed >= d.grass ? POLLEN_SVG.flower : POLLEN_SVG.grass));
    
    html += '<div style="flex:1;text-align:center;min-width:0">' +
      '<div style="font-size:10px;color:var(--txt2);margin-bottom:4px">' + label + '</div>' +
      '<div style="color:' + lev.fill + '">' + icon + '</div>' +
      '<div style="height:4px;background:rgba(0,0,0,0.05);border-radius:2px;margin:6px 4px;overflow:hidden">' +
        '<div style="height:100%;width:' + lev.bar + '%;background:' + lev.fill + '"></div>' +
      '</div>' +
      '<div style="font-size:9px;font-weight:600;color:' + lev.fill + '">' + lev.label + '</div>' +
    '</div>';
  });
  html += '</div>';

  html += '<div style="background:rgba(0,0,0,0.02);border-radius:8px;padding:10px">' +
    '<div style="display:flex;margin-bottom:10px;border-bottom:1px solid rgba(0,0,0,0.05);padding-bottom:10px">' +
      '<div style="flex:1;text-align:center">' + POLLEN_SVG.tree + '<div style="font-size:9px;color:var(--txt2)">Trees</div><div style="font-size:10px;font-weight:600;color:' + pollenLevel(today.tree).fill + '">' + pollenLevel(today.tree).label + '</div></div>' +
      '<div style="flex:1;text-align:center">' + POLLEN_SVG.grass + '<div style="font-size:9px;color:var(--txt2)">Grass</div><div style="font-size:10px;font-weight:600;color:' + pollenLevel(today.grass).fill + '">' + pollenLevel(today.grass).label + '</div></div>' +
      '<div style="flex:1;text-align:center">' + POLLEN_SVG.flower + '<div style="font-size:9px;color:var(--txt2)">Weeds</div><div style="font-size:10px;font-weight:600;color:' + pollenLevel(today.weed).fill + '">' + pollenLevel(today.weed).label + '</div></div>' +
    '</div>' +
    '<div style="display:flex;gap:8px;align-items:start;font-size:11px;line-height:1.4">' +
      '<span>' + POLLEN_SVG.bee + '</span>' +
      '<span><strong>Foraging:</strong> ' + tip + '</span>' +
    '</div>' +
  '</div>';

  html += '<div style="margin-top:10px;font-size:9px;color:var(--txt3);text-align:right">' + 
    (source==='tomorrow' ? POLLEN_SVG.sat + ' Tomorrow.io Live' : POLLEN_SVG.cal + ' Seasonal Estimate') + 
  '</div>';

  el.innerHTML = html;
}

loadPollenForecast();
