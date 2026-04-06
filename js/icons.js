// ═══════════════════════════════════════════════════════
// SVG ICON LIBRARY — Apiary HQ Custom Icons
// ═══════════════════════════════════════════════════════
var ICONS = {
  inspect: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="3" width="18" height="22" rx="3" stroke="currentColor" stroke-width="2"/><line x1="9" y1="9" x2="19" y2="9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="9" y1="13" x2="19" y2="13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="9" y1="17" x2="15" y2="17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="19" cy="20" r="4" fill="currentColor" opacity=".25"/><path d="M17 20l1.5 1.5L21 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  
  hive: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 3L21 7.5V16.5L14 21L7 16.5V7.5L14 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 9L17.5 11V15L14 17L10.5 15V11L14 9Z" fill="currentColor" opacity=".3"/><line x1="14" y1="3" x2="14" y2="9" stroke="currentColor" stroke-width="1.5"/><line x1="21" y1="7.5" x2="17.5" y2="11" stroke="currentColor" stroke-width="1.5"/><line x1="7" y1="7.5" x2="10.5" y2="11" stroke="currentColor" stroke-width="1.5"/><line x1="14" y1="17" x2="14" y2="21" stroke="currentColor" stroke-width="1.5"/></svg>',
  
  finance: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="6" width="22" height="16" rx="3" stroke="currentColor" stroke-width="2"/><path d="M3 11h22" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="17" r="2" fill="currentColor" opacity=".5"/><rect x="14" y="15.5" width="7" height="3" rx="1.5" fill="currentColor" opacity=".5"/></svg>',
  
  remind: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 4a7 7 0 017 7v4l2 2H5l2-2v-4a7 7 0 017-7z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 22a2 2 0 004 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="14" cy="4" r="1.5" fill="currentColor"/></svg>',
  
  docs: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 4h10l4 4v16H7V4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M17 4v4h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="10" y1="13" x2="18" y2="13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="10" y1="17" x2="18" y2="17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  
  contacts: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="10" r="4" stroke="currentColor" stroke-width="2"/><path d="M4 22c0-4 3.1-7 7-7h.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="20" cy="19" r="5" stroke="currentColor" stroke-width="1.8"/><path d="M20 17v2l1.5 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  
  library: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="5" width="5" height="18" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="11" y="5" width="5" height="18" rx="1.5" stroke="currentColor" stroke-width="1.8"/><path d="M18 5.5l4.5 1.2-4 15-4.5-1.2 4-15z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  
  settings: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="3.5" stroke="currentColor" stroke-width="2"/><path d="M14 4v2M14 22v2M4 14H2m22 0h-2M6.34 6.34l1.41 1.41M20.25 20.25l1.41 1.41M6.34 21.66l1.41-1.41M20.25 7.75l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  
  more: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="8" r="2" fill="currentColor"/><circle cx="14" cy="14" r="2" fill="currentColor"/><circle cx="14" cy="20" r="2" fill="currentColor"/></svg>',
  
  pollen: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="5" stroke="currentColor" stroke-width="2"/><path d="M14 4v4M14 20v4M4 14H8M20 14h4M7 7l2.8 2.8M18.2 18.2L21 21M7 21l2.8-2.8M18.2 9.8L21 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  
  harvest: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 4s-3 6 0 9 8 0 8 0-3 6 0 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 10c2 0 5.5-1.5 6-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 19c-2 0-5-1.5-5.5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',

  feeding: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 6c-3.5 0-6 2.8-6 6.2 0 3.5 2.6 6.8 6 11.2 3.4-4.4 6-7.7 6-11.2C20 8.8 17.5 6 14 6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 12v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  
  treatment: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="11" y="4" width="6" height="8" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 10h12l2 14H6L8 10z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><line x1="14" y1="15" x2="14" y2="20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="11.5" y1="17.5" x2="16.5" y2="17.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  
  camera: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9a2 2 0 012-2h2.5L9 5h10l1.5 2H23a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" stroke-width="1.8"/><circle cx="14" cy="15" r="4" stroke="currentColor" stroke-width="1.8"/></svg>',
  
  plus: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="14" y1="6" x2="14" y2="22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="6" y1="14" x2="22" y2="14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  
  varroa: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="14" cy="14" rx="7" ry="5" stroke="currentColor" stroke-width="1.8"/><line x1="8" y1="10" x2="4" y2="6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="11" y1="9" x2="9" y2="5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="17" y1="9" x2="19" y2="5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="20" y1="10" x2="24" y2="6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="8" y1="18" x2="4" y2="22" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="20" y1="18" x2="24" y2="22" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  
  alert: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 4L25 22H3L14 4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><line x1="14" y1="11" x2="14" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="14" cy="19" r="1" fill="currentColor"/></svg>',
  
  check: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="10" stroke="currentColor" stroke-width="2"/><path d="M9 14l4 4 6-7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  
  clock: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="10" stroke="currentColor" stroke-width="2"/><path d="M14 8v6l4 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',

  bee: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="14" cy="16" rx="5" ry="7" stroke="currentColor" stroke-width="2"/><ellipse cx="11" cy="11" rx="3.5" ry="2" transform="rotate(-30 11 11)" stroke="currentColor" stroke-width="1.6" opacity=".7"/><ellipse cx="17" cy="11" rx="3.5" ry="2" transform="rotate(30 17 11)" stroke="currentColor" stroke-width="1.6" opacity=".7"/><circle cx="14" cy="8" r="2" stroke="currentColor" stroke-width="1.6"/><line x1="11" y1="16" x2="17" y2="16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="11" y1="19" x2="17" y2="19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  
  document: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4h12l4 4v16H6V4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M18 4v4h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><line x1="10" y1="13" x2="18" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="10" y1="17" x2="18" y2="17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  
  pdf: '<svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4h10l6 6v14H6V4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 4v6h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 16h2a1.5 1.5 0 000-3h-2v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 13h1.5a1.5 1.5 0 010 3H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 13v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M20 16h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
};

function icon(name, cls) {
  cls = cls || '';
  var svg = ICONS[name] || ICONS.bee;
  return '<span class="ahq-icon ' + cls + '">' + svg + '</span>';
}
