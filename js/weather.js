
// ═══════════════════════════════════════════════════════
// WEATHER
// ═══════════════════════════════════════════════════════

var WX_SVG = {
  sun:    '<svg viewBox="0 0 36 36" fill="none" style="width:44px;height:44px;flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><circle cx="18" cy="18" r="8" fill="rgba(255,255,255,.9)" stroke="rgba(255,255,255,.4)" stroke-width="1"/><line x1="18" y1="4" x2="18" y2="8" stroke="rgba(255,255,255,.7)" stroke-width="2" stroke-linecap="round"/><line x1="18" y1="28" x2="18" y2="32" stroke="rgba(255,255,255,.7)" stroke-width="2" stroke-linecap="round"/><line x1="4" y1="18" x2="8" y2="18" stroke="rgba(255,255,255,.7)" stroke-width="2" stroke-linecap="round"/><line x1="28" y1="18" x2="32" y2="18" stroke="rgba(255,255,255,.7)" stroke-width="2" stroke-linecap="round"/><line x1="8.1" y1="8.1" x2="11" y2="11" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linecap="round"/><line x1="25" y1="25" x2="27.9" y2="27.9" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linecap="round"/><line x1="27.9" y1="8.1" x2="25" y2="11" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linecap="round"/><line x1="11" y1="25" x2="8.1" y2="27.9" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linecap="round"/></svg>',
  cloud:  '<svg viewBox="0 0 36 36" fill="none" style="width:44px;height:44px;flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><path d="M8 24a6 6 0 010-12 9 9 0 0117.5 2A5 5 0 0128 24H8z" fill="rgba(255,255,255,.85)" stroke="rgba(255,255,255,.3)" stroke-width="1"/></svg>',
  pcloud: '<svg viewBox="0 0 36 36" fill="none" style="width:44px;height:44px;flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="14" r="6" fill="rgba(255,255,255,.7)"/><line x1="13" y1="4" x2="13" y2="7" stroke="rgba(255,255,255,.5)" stroke-width="1.5" stroke-linecap="round"/><line x1="5" y1="14" x2="8" y2="14" stroke="rgba(255,255,255,.5)" stroke-width="1.5" stroke-linecap="round"/><path d="M14 26a5 5 0 010-10 8 8 0 0115 2A4 4 0 0130 26H14z" fill="rgba(255,255,255,.9)" stroke="rgba(255,255,255,.3)" stroke-width="1"/></svg>',
  rain:   '<svg viewBox="0 0 36 36" fill="none" style="width:44px;height:44px;flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><path d="M6 18a6 6 0 010-12A9 9 0 0124 8a5 5 0 010 10H6z" fill="rgba(255,255,255,.8)"/><line x1="10" y1="24" x2="8" y2="30" stroke="rgba(255,255,255,.7)" stroke-width="1.8" stroke-linecap="round"/><line x1="17" y1="24" x2="15" y2="30" stroke="rgba(255,255,255,.7)" stroke-width="1.8" stroke-linecap="round"/><line x1="24" y1="24" x2="22" y2="30" stroke="rgba(255,255,255,.7)" stroke-width="1.8" stroke-linecap="round"/></svg>',
  snow:   '<svg viewBox="0 0 36 36" fill="none" style="width:44px;height:44px;flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><path d="M6 18a6 6 0 010-12A9 9 0 0124 8a5 5 0 010 10H6z" fill="rgba(255,255,255,.8)"/><circle cx="10" cy="26" r="2" fill="rgba(255,255,255,.7)"/><circle cx="18" cy="26" r="2" fill="rgba(255,255,255,.7)"/><circle cx="26" cy="26" r="2" fill="rgba(255,255,255,.7)"/></svg>',
  storm:  '<svg viewBox="0 0 36 36" fill="none" style="width:44px;height:44px;flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><path d="M6 17a6 6 0 010-12A9 9 0 0124 7a5 5 0 010 10H6z" fill="rgba(255,255,255,.75)"/><path d="M16 22l-4 8h5l-3 6" stroke="rgba(255,255,100,.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  fog:    '<svg viewBox="0 0 36 36" fill="none" style="width:44px;height:44px;flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><line x1="4" y1="12" x2="32" y2="12" stroke="rgba(255,255,255,.6)" stroke-width="2.5" stroke-linecap="round"/><line x1="6" y1="18" x2="30" y2="18" stroke="rgba(255,255,255,.5)" stroke-width="2.5" stroke-linecap="round"/><line x1="8" y1="24" x2="28" y2="24" stroke="rgba(255,255,255,.4)" stroke-width="2.5" stroke-linecap="round"/></svg>',
  humid:  '<svg viewBox="0 0 18 18" fill="none" style="width:16px;height:16px;display:block;margin:0 auto 2px" xmlns="http://www.w3.org/2000/svg"><path d="M9 3C9 3 4 9 4 12a5 5 0 0010 0c0-3-5-9-5-9z" fill="rgba(255,255,255,.3)" stroke="rgba(255,255,255,.8)" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  wind:   '<svg viewBox="0 0 18 18" fill="none" style="width:16px;height:16px;display:block;margin:0 auto 2px" xmlns="http://www.w3.org/2000/svg"><path d="M2 7c3 0 6-2 9-2a3 3 0 010 6H4" stroke="rgba(255,255,255,.8)" stroke-width="1.4" stroke-linecap="round"/><path d="M2 11c2 0 4-1 6-1a2 2 0 010 4H5" stroke="rgba(255,255,255,.6)" stroke-width="1.3" stroke-linecap="round"/></svg>',
  pin:    '<svg viewBox="0 0 16 16" fill="none" style="width:11px;height:11px;display:inline-block;vertical-align:-1px;opacity:.6" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="6" r="2.5" stroke="white" stroke-width="1.3"/><path d="M8 8.5S3.5 12 3.5 15h9c0-3-4.5-6.5-4.5-6.5z" stroke="white" stroke-width="1.2" stroke-linejoin="round"/></svg>',
};

var WMO_WX = {
  0:'sun',1:'pcloud',2:'pcloud',3:'cloud',45:'fog',48:'fog',
  51:'rain',53:'rain',55:'rain',61:'rain',63:'rain',65:'rain',
  71:'snow',73:'snow',75:'snow',80:'rain',81:'rain',82:'storm',
  95:'storm',96:'storm',99:'storm'
};
var WMO_DESC = {
  0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Foggy',48:'Icy fog',
  51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',
  71:'Light snow',73:'Snow',75:'Heavy snow',80:'Rain showers',81:'Heavy showers',82:'Violent showers',
  95:'Thunderstorm',96:'Thunderstorm',99:'Thunderstorm'
};

function wmoDesc(c) { return WMO_DESC[c] || 'Unknown'; }
function wmoWxSvg(c) { return WX_SVG[WMO_WX[c] || 'sun']; }

function beeAdv(t, w, code) {
  if (t < 50)  return { ok:false, m:'Too cold — bees are clustered. No inspections.' };
  if (t < 55)  return { ok:false, m:'Marginal — bees may be sluggish. Inspect briefly only.' };
  if (t > 95)  return { ok:false, m:'Very hot — keep inspections short and early morning.' };
  if (w > 20)  return { ok:false, m:'Too windy — avoid inspections over 15 mph.' };
  if ([61,63,65,80,81,82,95,96,99].indexOf(code) >= 0) return { ok:false, m:'Rain or storms — postpone inspections.' };
  return { ok:true, m:'Good conditions for inspections.' };
}

function beeScore(t, w, h, c) {
  var s = 100;
  if (t < 50) s-=60; else if (t<55) s-=30; else if (t>95) s-=40; else if (t>88) s-=15;
  if (w > 25) s-=40; else if (w>15) s-=20; else if (w>10) s-=8;
  if ([61,63,65,80,81,82,95,96,99].indexOf(c) >= 0) s-=50;
  else if ([51,53,55].indexOf(c) >= 0) s-=30;
  if (h > 90) s-=10;
  return Math.max(0, Math.min(100, s));
}

function scoreColor(s) {
  if (s >= 75) return '#ffffff';
  if (s >= 50) return '#FFE082';
  if (s >= 25) return '#FFB74D';
  return '#EF9A9A';
}

function loadWeather() {
  var el = document.getElementById('wx-el'); if (!el) return;
  if (window._wx) { renderWeather(el); return; }
  el.className = 'wx-load'; el.textContent = 'Loading weather for Centre, Alabama…';
  fetch('https://api.open-meteo.com/v1/forecast?latitude=34.1512&longitude=-85.6762&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago')
    .then(function(r) { return r.json(); })
    .then(function(j) {
      var c=j.current, t=Math.round(c.temperature_2m), f=Math.round(c.apparent_temperature);
      var w=Math.round(c.wind_speed_10m), h=Math.round(c.relative_humidity_2m), code=c.weather_code;
      window._wx = { temp:t, feels:f, wind:w, humidity:h, desc:wmoDesc(code), wxSvg:wmoWxSvg(code), score:beeScore(t,w,h,code), col:scoreColor(beeScore(t,w,h,code)), adv:beeAdv(t,w,code) };
      renderWeather(el);
    })
    .catch(function() { el.className='wx-load'; el.textContent='Weather unavailable.'; });
}

function renderWeather(el) {
  var wx = window._wx; if (!wx) return;
  el.className = 'wx-card';
  el.innerHTML =
    '<div style="display:flex;align-items:center;gap:14px">'+
      wx.wxSvg+
      '<div style="flex:1">'+
        '<div style="font-family:\'Playfair Display\',serif;font-size:36px;color:#fff;line-height:1">'+wx.temp+'°F</div>'+
        '<div style="font-size:13px;color:rgba(255,255,255,.85);margin-top:2px">'+wx.desc+' · Feels '+wx.feels+'°F</div>'+
        '<div style="font-size:11px;color:rgba(255,255,255,.55);margin-top:3px">'+WX_SVG.pin+' Centre, Alabama</div>'+
      '</div>'+
      '<div style="text-align:center;background:rgba(255,255,255,.15);border-radius:14px;padding:10px 14px;min-width:58px">'+
        '<div style="font-size:22px;font-weight:700;color:'+wx.col+'">'+wx.score+'</div>'+
        '<div style="font-size:9px;color:rgba(255,255,255,.65);text-transform:uppercase;letter-spacing:1px;margin-top:2px">Fly Score</div>'+
      '</div>'+
    '</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px">'+
      '<div style="background:rgba(255,255,255,.12);border-radius:10px;padding:9px;text-align:center">'+WX_SVG.humid+'<div style="font-size:15px;font-weight:700;color:#fff">'+wx.humidity+'%</div><div style="font-size:10px;color:rgba(255,255,255,.6)">Humidity</div></div>'+
      '<div style="background:rgba(255,255,255,.12);border-radius:10px;padding:9px;text-align:center">'+WX_SVG.wind+'<div style="font-size:15px;font-weight:700;color:#fff">'+wx.wind+' mph</div><div style="font-size:10px;color:rgba(255,255,255,.6)">Wind</div></div>'+
    '</div>'+
    '<div class="wx-adv" style="'+(wx.adv.ok?'background:rgba(255,255,255,.12)':'background:rgba(255,100,80,.2)')+'">'+
      (wx.adv.ok
        ? '<svg viewBox="0 0 16 16" fill="none" style="width:13px;height:13px;display:inline-block;vertical-align:-2px;margin-right:5px" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,.8)" stroke-width="1.4"/><path d="M5 8l2 2 4-4" stroke="rgba(255,255,255,.9)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : '<svg viewBox="0 0 16 16" fill="none" style="width:13px;height:13px;display:inline-block;vertical-align:-2px;margin-right:5px" xmlns="http://www.w3.org/2000/svg"><path d="M8 2L14 13H2L8 2z" stroke="rgba(255,200,100,.9)" stroke-width="1.4" stroke-linejoin="round"/><line x1="8" y1="7" x2="8" y2="10" stroke="rgba(255,200,100,.9)" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="11.5" r=".8" fill="rgba(255,200,100,.9)"/></svg>')+
      wx.adv.m+
    '</div>';
}
