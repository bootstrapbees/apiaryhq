// ═══════════════════════════════════════════════════════
// FRAME LOGGING — simple collapsible per-frame input
// ═══════════════════════════════════════════════════════

var _frameBoxes = [];  // [{ label, frames[] }]

// ── CONSTANTS ─────────────────────────────────────────
var FRAME_FOUNDATION = ['Plastic','Wax','Foundationless','Drawn Comb'];

var FRAME_CONTENTS = [
  { id:'undrawn',      label:'Undrawn'       },
  { id:'drawing',      label:'Drawing'       },
  { id:'empty_drawn',  label:'Empty Drawn'   },
  { id:'brood_worker', label:'Worker Brood'  },
  { id:'brood_drone',  label:'Drone Brood'   },
  { id:'eggs',         label:'Eggs'          },
  { id:'larvae',       label:'Larvae'        },
  { id:'honey_capped', label:'Capped Honey'  },
  { id:'honey_uncap',  label:'Uncapped Honey'},
  { id:'pollen',       label:'Pollen'        },
];

var FRAME_COLORS = {
  undrawn:      '#E8EDE8',
  drawing:      '#FFF8DC',
  empty_drawn:  '#FFFACD',
  brood_worker: '#C8860A',
  brood_drone:  '#8B5E0A',
  eggs:         '#D4F0D4',
  larvae:       '#A8DBA8',
  honey_capped: '#F5A623',
  honey_uncap:  '#FFD080',
  pollen:       '#E8A020',
};

var FRAME_TEXT_COLORS = {
  undrawn:'#8FAA8F', drawing:'#B7870A', empty_drawn:'#9A8A2A',
  brood_worker:'#fff', brood_drone:'#fff', eggs:'#1B6B3A',
  larvae:'#1B5A2A', honey_capped:'#fff', honey_uncap:'#7A4A00', pollen:'#fff',
};

var FRAME_PATTERN  = ['Solid','Spotty','Scattered'];
var FRAME_QC       = ['None','Swarm','Supercedure','Emergency'];

// ── INIT ──────────────────────────────────────────────
function initFrameBoxes(existingBoxData) {
  if (existingBoxData && existingBoxData.length) {
    _frameBoxes = existingBoxData;
  } else {
    _frameBoxes = [makeEmptyBox('Brood Box 1')];
  }
}

function makeEmptyFrame() {
  return { foundation:'', contents:[], pattern:'', queenCell:'None', notes:'' };
}

function makeEmptyBox(label) {
  var frames = [];
  for (var i = 0; i < 10; i++) frames.push(makeEmptyFrame());
  return { label:label, frames:frames };
}

// ── ADD BOX ────────────────────────────────────────────
function addFrameBox() {
  var label = 'Brood Box ' + (_frameBoxes.length + 1);
  _frameBoxes.push(makeEmptyBox(label));
  renderFrameSection();
}

// ── TOGGLE FRAME OPEN/CLOSED ───────────────────────────
function toggleFrameRow(boxIdx, frameIdx) {
  var detail = document.getElementById('fdetail-'+boxIdx+'-'+frameIdx);
  var arrow  = document.getElementById('farrow-'+boxIdx+'-'+frameIdx);
  if (!detail) return;
  var isOpen = detail.style.display !== 'none';
  detail.style.display = isOpen ? 'none' : '';
  if (arrow) arrow.textContent = isOpen ? '▶' : '▼';
  // Save any open state so we can read values later
}

// ── TOGGLE CONTENT CHIP ────────────────────────────────
function toggleFrameChip(boxIdx, frameIdx, contentId) {
  var fr = _frameBoxes[boxIdx].frames[frameIdx];
  var idx = fr.contents.indexOf(contentId);
  if (idx >= 0) {
    fr.contents.splice(idx, 1);
  } else {
    fr.contents.push(contentId);
  }
  var btn = document.getElementById('fchip-'+boxIdx+'-'+frameIdx+'-'+contentId);
  if (btn) {
    var active = fr.contents.indexOf(contentId) >= 0;
    btn.style.background  = active ? FRAME_COLORS[contentId]  : '#F0F4F0';
    btn.style.color       = active ? FRAME_TEXT_COLORS[contentId] : 'var(--txt2)';
    btn.style.border      = active ? '2px solid rgba(0,0,0,.25)' : '2px solid transparent';
    btn.style.fontWeight  = active ? '700' : '500';
  }
  updateFrameSummary(boxIdx, frameIdx);
}

// ── SET FOUNDATION ─────────────────────────────────────
function setFrameFoundation(boxIdx, frameIdx, val) {
  _frameBoxes[boxIdx].frames[frameIdx].foundation = val;
  updateFrameSummary(boxIdx, frameIdx);
}

// ── SET PATTERN ────────────────────────────────────────
function setFramePattern(boxIdx, frameIdx, val) {
  _frameBoxes[boxIdx].frames[frameIdx].pattern = val;
  // Update pill highlight
  FRAME_PATTERN.forEach(function(p) {
    var el = document.getElementById('fpat-'+boxIdx+'-'+frameIdx+'-'+p);
    if (el) {
      el.style.background = (p === val) ? 'var(--forest)' : '#F0F4F0';
      el.style.color      = (p === val) ? '#fff' : 'var(--txt2)';
      el.style.border     = (p === val) ? '2px solid var(--forest)' : '2px solid transparent';
    }
  });
}

// ── SET QUEEN CELL ─────────────────────────────────────
function setFrameQC(boxIdx, frameIdx, val) {
  _frameBoxes[boxIdx].frames[frameIdx].queenCell = val;
  FRAME_QC.forEach(function(q) {
    var el = document.getElementById('fqc-'+boxIdx+'-'+frameIdx+'-'+q);
    if (el) {
      var isNone = (q === 'None');
      var activeColor = isNone ? 'var(--moss)' : 'var(--red)';
      el.style.background = (q === val) ? activeColor : '#F0F4F0';
      el.style.color      = (q === val) ? '#fff' : 'var(--txt2)';
      el.style.border     = (q === val) ? '2px solid '+activeColor : '2px solid transparent';
    }
  });
  updateFrameSummary(boxIdx, frameIdx);
}

// ── SET NOTES ──────────────────────────────────────────
function setFrameNotes(boxIdx, frameIdx, val) {
  _frameBoxes[boxIdx].frames[frameIdx].notes = val;
}

// ── SUMMARY LINE (shown when collapsed) ───────────────
function frameSummaryText(fr) {
  var parts = [];
  if (fr.foundation) parts.push(fr.foundation);
  if (fr.contents.length) {
    parts.push(fr.contents.map(function(c){
      var fc = FRAME_CONTENTS.find(function(x){return x.id===c;});
      return fc ? fc.label : c;
    }).join(', '));
  }
  if (fr.pattern) parts.push(fr.pattern);
  if (fr.queenCell && fr.queenCell !== 'None') parts.push('⚠️ '+fr.queenCell+' cell');
  return parts.length ? parts.join(' · ') : 'Tap to fill in';
}

function updateFrameSummary(boxIdx, frameIdx) {
  var fr  = _frameBoxes[boxIdx].frames[frameIdx];
  var el  = document.getElementById('fsummary-'+boxIdx+'-'+frameIdx);
  if (el) el.textContent = frameSummaryText(fr);
}

// ── RENDER ONE FRAME ROW ───────────────────────────────
function renderFrameRow(boxIdx, frameIdx) {
  var fr = _frameBoxes[boxIdx].frames[frameIdx];
  var summary = frameSummaryText(fr);
  var hasData = fr.contents.length > 0 || fr.foundation || fr.pattern || (fr.queenCell && fr.queenCell !== 'None');
  var headerBg = hasData ? 'var(--ok-bg)' : '#F7FAF7';
  var h = '';

  // Collapsed header row
  h += '<div style="background:'+headerBg+';border:1px solid #E4EDE4;border-radius:10px;margin-bottom:6px;overflow:hidden">';
  h += '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer" onclick="toggleFrameRow('+boxIdx+','+frameIdx+')">';
  h += '<div style="width:26px;height:26px;border-radius:8px;background:var(--deep);color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">'+(frameIdx+1)+'</div>';
  h += '<div style="flex:1;min-width:0"><div id="fsummary-'+boxIdx+'-'+frameIdx+'" style="font-size:12px;color:var(--txt2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(summary)+'</div></div>';
  h += '<span id="farrow-'+boxIdx+'-'+frameIdx+'" style="font-size:10px;color:var(--txt3);flex-shrink:0">▶</span>';
  h += '</div>';

  // Expanded detail — hidden by default
  h += '<div id="fdetail-'+boxIdx+'-'+frameIdx+'" style="display:none;padding:10px 12px 14px;border-top:1px solid #E4EDE4">';

  // Foundation type
  h += '<div style="margin-bottom:10px">';
  h += '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--txt2);margin-bottom:6px">Foundation</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:5px">';
  FRAME_FOUNDATION.forEach(function(f) {
    var active = fr.foundation === f;
    h += '<button type="button" '+
      'style="padding:5px 10px;border-radius:8px;border:2px solid '+(active?'var(--forest)':'transparent')+';background:'+(active?'var(--forest)':'#F0F4F0')+';color:'+(active?'#fff':'var(--txt2)')+';font-size:11px;font-weight:'+(active?'700':'500')+';cursor:pointer" '+
      'onclick="setFrameFoundation('+boxIdx+','+frameIdx+',\''+f+'\')">'+f+'</button>';
  });
  h += '</div></div>';

  // Contents
  h += '<div style="margin-bottom:10px">';
  h += '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--txt2);margin-bottom:6px">Contents</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:5px">';
  FRAME_CONTENTS.forEach(function(ct) {
    var active = fr.contents.indexOf(ct.id) >= 0;
    h += '<button type="button" id="fchip-'+boxIdx+'-'+frameIdx+'-'+ct.id+'" '+
      'style="padding:5px 10px;border-radius:8px;border:2px solid '+(active?'rgba(0,0,0,.25)':'transparent')+';background:'+(active?FRAME_COLORS[ct.id]:'#F0F4F0')+';color:'+(active?FRAME_TEXT_COLORS[ct.id]:'var(--txt2)')+';font-size:11px;font-weight:'+(active?'700':'500')+';cursor:pointer" '+
      'onclick="toggleFrameChip('+boxIdx+','+frameIdx+',\''+ct.id+'\')">'+ct.label+'</button>';
  });
  h += '</div></div>';

  // Pattern
  h += '<div style="margin-bottom:10px">';
  h += '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--txt2);margin-bottom:6px">Brood Pattern</div>';
  h += '<div style="display:flex;gap:5px">';
  FRAME_PATTERN.forEach(function(p) {
    var active = fr.pattern === p;
    h += '<button type="button" id="fpat-'+boxIdx+'-'+frameIdx+'-'+p+'" '+
      'style="padding:5px 12px;border-radius:8px;border:2px solid '+(active?'var(--forest)':'transparent')+';background:'+(active?'var(--forest)':'#F0F4F0')+';color:'+(active?'#fff':'var(--txt2)')+';font-size:11px;font-weight:'+(active?'700':'500')+';cursor:pointer;flex:1" '+
      'onclick="setFramePattern('+boxIdx+','+frameIdx+',\''+p+'\')">'+p+'</button>';
  });
  h += '</div></div>';

  // Queen Cell
  h += '<div style="margin-bottom:10px">';
  h += '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--txt2);margin-bottom:6px">Queen Cell</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:5px">';
  FRAME_QC.forEach(function(q) {
    var active = (fr.queenCell||'None') === q;
    var isNone = q === 'None';
    var activeColor = isNone ? 'var(--moss)' : 'var(--red)';
    h += '<button type="button" id="fqc-'+boxIdx+'-'+frameIdx+'-'+q+'" '+
      'style="padding:5px 12px;border-radius:8px;border:2px solid '+(active?activeColor:'transparent')+';background:'+(active?activeColor:'#F0F4F0')+';color:'+(active?'#fff':'var(--txt2)')+';font-size:11px;font-weight:'+(active?'700':'500')+';cursor:pointer" '+
      'onclick="setFrameQC('+boxIdx+','+frameIdx+',\''+q+'\')">'+q+'</button>';
  });
  h += '</div></div>';

  // Notes
  h += '<div>';
  h += '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--txt2);margin-bottom:6px">Notes</div>';
  h += '<input style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid #D0D8D0;background:#fff;font-family:\'Source Serif 4\',serif;font-size:13px;color:var(--txt)" '+
    'placeholder="e.g. Queen spotted here, SHB seen" '+
    'value="'+esc(fr.notes||'')+'" '+
    'oninput="setFrameNotes('+boxIdx+','+frameIdx+',this.value)">';
  h += '</div>';

  h += '</div>'; // end detail
  h += '</div>'; // end frame row
  return h;
}

// ── RENDER FULL SECTION ────────────────────────────────
function renderFrameSection() {
  var container = document.getElementById('frame-section-wrap');
  if (!container) return;
  var h = '';
  _frameBoxes.forEach(function(box, bi) {
    h += '<div style="margin-bottom:12px">';
    h += '<div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--deep);margin-bottom:8px">'+esc(box.label)+'</div>';
    box.frames.forEach(function(fr, fi) {
      h += renderFrameRow(bi, fi);
    });
    h += '</div>';
  });
  if (_frameBoxes.length < 3) {
    h += '<button type="button" onclick="addFrameBox()" '+
      'style="width:100%;padding:11px;border:2px dashed rgba(45,106,79,.35);border-radius:12px;background:var(--ok-bg);color:var(--forest);font-size:13px;font-weight:700;cursor:pointer">+ Add Brood Box</button>';
  }
  container.innerHTML = h;
}

// ── SERIALIZE / DESERIALIZE ────────────────────────────
function serializeFrameBoxes() {
  return JSON.stringify(_frameBoxes);
}
function deserializeFrameBoxes(jsonStr) {
  try { return JSON.parse(jsonStr); } catch(e) { return null; }
}
