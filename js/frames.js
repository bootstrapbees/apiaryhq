// ═══════════════════════════════════════════════════════
// FRAME LOGGING — per-box, per-frame inspection data
// ═══════════════════════════════════════════════════════

// Working state while modal is open
var _frameBoxes = [];   // array of box objects: { label, frames[] }
var _paintMode  = null; // current drag-paint content type
var _paintBox   = null; // which box index we're painting

// ── CONTENT TYPES ───────────────────────────────────────
var FRAME_CONTENTS = [
  { id:'undrawn',      label:'Undrawn',       color:'#E8EDE8', textColor:'#8FAA8F' },
  { id:'drawing',      label:'Drawing',       color:'#FFF8DC', textColor:'#B7870A' },
  { id:'empty_drawn',  label:'Empty Drawn',   color:'#FFFACD', textColor:'#9A8A2A' },
  { id:'brood_worker', label:'Worker Brood',  color:'#C8860A', textColor:'#fff'    },
  { id:'brood_drone',  label:'Drone Brood',   color:'#8B5E0A', textColor:'#fff'    },
  { id:'eggs',         label:'Eggs',          color:'#D4F0D4', textColor:'#1B6B3A' },
  { id:'larvae',       label:'Larvae',        color:'#A8DBA8', textColor:'#1B5A2A' },
  { id:'honey_capped', label:'Capped Honey',  color:'#F5A623', textColor:'#fff'    },
  { id:'honey_uncap',  label:'Uncapped Honey',color:'#FFD080', textColor:'#7A4A00' },
  { id:'pollen',       label:'Pollen',        color:'#E8A020', textColor:'#fff'    },
];

var PATTERN_OPTIONS  = ['Solid','Spotty','Scattered'];
var COVERAGE_OPTIONS = ['25%','50%','75%','100%'];
var QUEEN_CELL_OPTS  = ['None','Swarm','Supercedure','Emergency'];

// ── SMART DEFAULTS ──────────────────────────────────────
// Position-based pre-fill: outer = honey/pollen, inner = brood
function defaultFrameContent(frameIdx) {
  if (frameIdx === 0 || frameIdx === 9) return 'honey_capped';
  if (frameIdx === 1 || frameIdx === 8) return 'pollen';
  if (frameIdx === 2 || frameIdx === 7) return 'drawing';
  return 'brood_worker';
}

function makeDefaultFrame(frameIdx) {
  var content = defaultFrameContent(frameIdx);
  var isDrawing = (content === 'drawing' || content === 'undrawn');
  return {
    contents:  [content],
    pattern:   isDrawing ? '' : 'Solid',
    coverage:  isDrawing ? '' : '75%',
    queenCell: 'None',
    notes:     ''
  };
}

function makeDefaultBox(label) {
  var frames = [];
  for (var i = 0; i < 10; i++) frames.push(makeDefaultFrame(i));
  return { label: label, frames: frames };
}

// ── INIT ─────────────────────────────────────────────────
function initFrameBoxes(existingBoxData) {
  if (existingBoxData && existingBoxData.length) {
    _frameBoxes = existingBoxData;
  } else {
    _frameBoxes = [makeDefaultBox('Brood Box 1')];
  }
}

// ── ADD BOX ──────────────────────────────────────────────
function addFrameBox() {
  var label = 'Brood Box ' + (_frameBoxes.length + 1);
  _frameBoxes.push(makeDefaultBox(label));
  renderFrameSection();
}

// ── CONTENT HELPERS ──────────────────────────────────────
function frameContentColor(cid) {
  var c = FRAME_CONTENTS.find(function(x){ return x.id === cid; });
  return c ? c.color : '#E8EDE8';
}
function frameContentTextColor(cid) {
  var c = FRAME_CONTENTS.find(function(x){ return x.id === cid; });
  return c ? c.textColor : '#555';
}
function frameContentLabel(cid) {
  var c = FRAME_CONTENTS.find(function(x){ return x.id === cid; });
  return c ? c.label : cid;
}

// ── PAINT PALETTE ─────────────────────────────────────────
function renderPalette(boxIdx) {
  var h = '<div class="frame-palette" id="palette-'+boxIdx+'">';
  h += '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--txt2);margin-bottom:7px">Tap type then drag across frames to paint</div>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:5px">';
  FRAME_CONTENTS.forEach(function(ct) {
    h += '<button type="button" id="pal-'+boxIdx+'-'+ct.id+'"'+
      ' style="padding:5px 9px;border-radius:8px;border:2px solid transparent;background:'+ct.color+';color:'+ct.textColor+';font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap"'+
      ' onclick="selectPaintType('+boxIdx+',\''+ct.id+'\')">'+ct.label+'</button>';
  });
  h += '</div></div>';
  return h;
}

// ── SELECT PAINT TYPE ─────────────────────────────────────
function selectPaintType(boxIdx, contentId) {
  _paintMode = contentId;
  _paintBox  = boxIdx;
  document.querySelectorAll('#palette-'+boxIdx+' button').forEach(function(b){
    b.style.border = '2px solid transparent';
    b.style.boxShadow = '';
  });
  var sel = document.getElementById('pal-'+boxIdx+'-'+contentId);
  if (sel) { sel.style.border = '2px solid #333'; sel.style.boxShadow = '0 0 0 2px rgba(0,0,0,.2)'; }
}

// ── PAINT FRAME ───────────────────────────────────────────
function paintFrame(boxIdx, frameIdx) {
  if (_paintMode === null || _paintBox !== boxIdx) return;
  _frameBoxes[boxIdx].frames[frameIdx].contents = [_paintMode];
  var cell = document.getElementById('fcell-'+boxIdx+'-'+frameIdx);
  if (cell) {
    cell.style.background = frameContentColor(_paintMode);
    var lbl = cell.querySelector('.fcell-label');
    if (lbl) { lbl.textContent = frameContentLabel(_paintMode); lbl.style.color = frameContentTextColor(_paintMode); }
  }
}

// ── TOUCH / MOUSE DRAG ────────────────────────────────────
function startPaint(boxIdx, frameIdx) {
  _paintBox = boxIdx;
  paintFrame(boxIdx, frameIdx);
}
function stopPaint() { /* keep paint mode active */ }
function handleTouchMove(e, boxIdx) {
  if (_paintMode === null || _paintBox !== boxIdx) return;
  e.preventDefault();
  var touch = e.touches[0];
  var el = document.elementFromPoint(touch.clientX, touch.clientY);
  if (el) {
    var cell = el.closest ? el.closest('[id^="fcell-'+boxIdx+'-"]') : null;
    if (cell) { var fi = parseInt(cell.id.split('-')[2]); if (!isNaN(fi)) paintFrame(boxIdx, fi); }
  }
}

// ── FRAME MAP ─────────────────────────────────────────────
function renderFrameMap(boxIdx) {
  var box = _frameBoxes[boxIdx];
  var h = '<div class="frame-map" id="fmap-'+boxIdx+'">';
  h += '<div style="font-size:10px;color:var(--txt2);margin-bottom:5px;font-style:italic">Frame 1 (left) → Frame 10 (right)</div>';
  h += '<div style="display:flex;gap:3px;align-items:stretch;touch-action:none" id="frow-'+boxIdx+'">';
  box.frames.forEach(function(fr, fi) {
    var primary = fr.contents[0] || 'undrawn';
    var bg = frameContentColor(primary);
    var tc = frameContentTextColor(primary);
    var qcDot = (fr.queenCell && fr.queenCell !== 'None')
      ? '<div style="width:8px;height:8px;border-radius:50%;background:red;position:absolute;top:3px;right:3px"></div>' : '';
    h += '<div id="fcell-'+boxIdx+'-'+fi+'"'+
      ' style="flex:1;min-width:0;height:64px;border-radius:6px;background:'+bg+';display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;position:relative;border:1px solid rgba(0,0,0,.1);user-select:none;-webkit-user-select:none"'+
      ' ontouchstart="startPaint('+boxIdx+','+fi+')"'+
      ' ontouchmove="handleTouchMove(event,'+boxIdx+')"'+
      ' ontouchend="stopPaint()"'+
      ' onmousedown="startPaint('+boxIdx+','+fi+')"'+
      ' onmouseover="paintFrame('+boxIdx+','+fi+')"'+
      ' onmouseup="stopPaint()"'+
      ' onclick="openFrameDetail('+boxIdx+','+fi+')">'
      + qcDot
      + '<div style="font-size:9px;font-weight:800;color:rgba(0,0,0,.4);margin-bottom:2px">'+(fi+1)+'</div>'
      + '<div class="fcell-label" style="font-size:9px;font-weight:700;color:'+tc+';text-align:center;line-height:1.2;padding:0 2px">'+frameContentLabel(primary)+'</div>'
      + '</div>';
  });
  h += '</div></div>';
  return h;
}

// ── FRAME DETAIL ──────────────────────────────────────────
function openFrameDetail(boxIdx, frameIdx) {
  var fr = _frameBoxes[boxIdx].frames[frameIdx];
  var boxLabel = _frameBoxes[boxIdx].label;
  var h = '<div class="modal-title" style="font-size:17px">'+esc(boxLabel)+' — Frame '+(frameIdx+1)+'</div>';
  h += '<div class="fg"><label>Contents (tap to toggle)</label>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:4px">';
  FRAME_CONTENTS.forEach(function(ct) {
    var active = fr.contents.indexOf(ct.id) >= 0;
    h += '<button type="button" id="fdc-'+ct.id+'"'+
      ' style="padding:5px 10px;border-radius:8px;border:2px solid '+(active?'#333':'transparent')+';background:'+ct.color+';color:'+ct.textColor+';font-size:11px;font-weight:700;cursor:pointer"'+
      ' onclick="toggleFrameContent('+boxIdx+','+frameIdx+',\''+ct.id+'\')">'+ct.label+'</button>';
  });
  h += '</div></div>';
  h += '<div class="fg"><label>Brood Pattern</label>'+makePills('fdpat',PATTERN_OPTIONS,fr.pattern||'Solid')+'</div>';
  h += '<div class="fg"><label>Coverage</label>'+makePills('fdcov',COVERAGE_OPTIONS,fr.coverage||'75%')+'</div>';
  h += '<div class="fg"><label>Queen Cell</label>'+makePills('fdqc',QUEEN_CELL_OPTS,fr.queenCell||'None')+'</div>';
  h += '<div class="fg"><label>Frame Notes</label><input id="fd-fnotes" value="'+esc(fr.notes||'')+'" placeholder="e.g. Queen spotted on this frame, SHB seen"></div>';
  h += '<button class="btn btn-p" onclick="saveFrameDetail('+boxIdx+','+frameIdx+')">Save Frame</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}

function toggleFrameContent(boxIdx, frameIdx, contentId) {
  var fr = _frameBoxes[boxIdx].frames[frameIdx];
  var idx = fr.contents.indexOf(contentId);
  if (idx >= 0) { if (fr.contents.length > 1) fr.contents.splice(idx, 1); }
  else { fr.contents.push(contentId); }
  var btn = document.getElementById('fdc-'+contentId);
  if (btn) btn.style.border = (fr.contents.indexOf(contentId) >= 0) ? '2px solid #333' : '2px solid transparent';
}

function saveFrameDetail(boxIdx, frameIdx) {
  var fr = _frameBoxes[boxIdx].frames[frameIdx];
  fr.pattern   = getPill('fdpat')  || '';
  fr.coverage  = getPill('fdcov')  || '';
  fr.queenCell = getPill('fdqc')   || 'None';
  var notesEl  = document.getElementById('fd-fnotes');
  fr.notes     = notesEl ? notesEl.value : '';
  closeModal();
  // Update the map cell in place
  var cell = document.getElementById('fcell-'+boxIdx+'-'+frameIdx);
  if (cell) {
    var primary = fr.contents[0] || 'undrawn';
    cell.style.background = frameContentColor(primary);
    var lbl = cell.querySelector('.fcell-label');
    if (lbl) { lbl.textContent = frameContentLabel(primary); lbl.style.color = frameContentTextColor(primary); }
    var dot = cell.querySelector('div[style*="border-radius:50%"]');
    if (dot) dot.remove();
    if (fr.queenCell && fr.queenCell !== 'None') {
      var d = document.createElement('div');
      d.style.cssText = 'width:8px;height:8px;border-radius:50%;background:red;position:absolute;top:3px;right:3px';
      cell.appendChild(d);
    }
  }
}

// ── RENDER FULL SECTION ───────────────────────────────────
function renderFrameSection() {
  var container = document.getElementById('frame-section-wrap');
  if (!container) return;
  var h = '';
  _frameBoxes.forEach(function(box, bi) {
    h += '<div style="background:var(--surface2);border:1px solid #E4EDE4;border-radius:12px;padding:12px;margin-bottom:10px">';
    h += '<div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--deep);margin-bottom:8px">🖼️ '+esc(box.label)+'</div>';
    h += renderPalette(bi);
    h += renderFrameMap(bi);
    h += '<div style="font-size:10px;color:var(--txt2);margin-top:6px;font-style:italic">Tap any frame cell to add detail — pattern, coverage, queen cell &amp; notes.</div>';
    h += '</div>';
  });
  if (_frameBoxes.length < 3) {
    h += '<button type="button" onclick="addFrameBox()" style="width:100%;padding:11px;border:2px dashed rgba(45,106,79,.35);border-radius:12px;background:var(--ok-bg);color:var(--forest);font-size:13px;font-weight:700;cursor:pointer;margin-bottom:4px">+ Add Brood Box</button>';
  }
  container.innerHTML = h;
}

// ── SERIALIZE / DESERIALIZE ───────────────────────────────
function serializeFrameBoxes() {
  return JSON.stringify(_frameBoxes);
}
function deserializeFrameBoxes(jsonStr) {
  try { return JSON.parse(jsonStr); } catch(e) { return null; }
}
