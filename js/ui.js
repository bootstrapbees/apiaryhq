// ═══════════════════════════════════════════════════════
// NAV / TAB SYSTEM
// ═══════════════════════════════════════════════════════
var currentTab = 'dash';
var currentInspTab = 'insp';
var currentDocsTab = 'docs';

function showTab(page) {
  closeMoreTray();
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');p.style.display='none';});
  var pg = document.getElementById('pg-' + page);
  if (pg) { pg.style.display=''; pg.classList.add('active'); }
  document.querySelectorAll('.nav button').forEach(function(b){b.classList.remove('active');});
  var nb = document.querySelector('.nav button[data-tab="'+page+'"]');
  if (nb) {
    nb.classList.add('active');
  } else if (_moreTabs && _moreTabs.indexOf(page) >= 0) {
    var mb = document.getElementById('more-tab-btn');
    if (mb) mb.classList.add('active');
    document.querySelectorAll('.more-tray button').forEach(function(b){
      b.classList.toggle('active', b.dataset.moreTab === page);
    });
  }
  // Special handling for center home button
  var homeBtn = document.getElementById('nav-home-btn');
  if (homeBtn) homeBtn.classList.toggle('active', page === 'dash');
  currentTab = page;
  renderAll();
  if (page === 'dash') { loadWeather(); loadPollenForecast(); }
  if (page === 'notes') initLibTab();
  if (page === 'settings') {
    var savedZip = localStorage.getItem('apiaryhq_zip');
    var savedZone = localStorage.getItem('apiaryhq_zone');
    var zi = document.getElementById('settings-zip');
    var zs = document.getElementById('zip-status');
    if (zi && savedZip) zi.value = savedZip;
    if (zs && savedZone) { zs.textContent = '✅ Zone ' + savedZone + ' active'; zs.style.color = 'var(--ok)'; }
  }
}

var _moreTrayOpen = false;
var _moreTabs = ['hives','fin','remind','docs','contacts','notes','settings'];

function toggleMoreTray() {
  _moreTrayOpen ? closeMoreTray() : openMoreTray();
}
function openMoreTray() {
  _moreTrayOpen = true;
  document.getElementById('more-tray-backdrop').classList.add('open');
  document.getElementById('more-tab-btn').classList.add('active');
  var fab = document.getElementById('fab-btn');
  if (fab) fab.style.display = 'none';
}
function closeMoreTray() {
  _moreTrayOpen = false;
  document.getElementById('more-tray-backdrop').classList.remove('open');
  var btn = document.getElementById('more-tab-btn');
  if (btn) btn.classList.toggle('active', _moreTabs.indexOf(currentTab) >= 0);
  var fab = document.getElementById('fab-btn');
  if (fab) fab.style.display = '';
}
function showTabFromMore(page) {
  closeMoreTray();
  showTab(page);
  var btn = document.getElementById('more-tab-btn');
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.more-tray button').forEach(function(b){
    b.classList.toggle('active', b.dataset.moreTab === page);
  });
}

function showInspTab(tab) {
  currentInspTab = tab;  // FIX: track current sub-tab so FAB opens the right modal
  ['insp','feed','treat','harvest'].forEach(function(t){
    var el = document.getElementById('insp-sub-'+t);
    var btn = document.getElementById('st-'+t);
    if (el) el.style.display = t === tab ? '' : 'none';
    if (btn) btn.classList.toggle('active', t === tab);
  });
  updateFabForTab();
}

function showDocsTab(tab) {
  currentDocsTab = tab;
  ['docs','assets'].forEach(function(t){
    var el = document.getElementById('docs-sub-'+t);
    var btn = document.getElementById('st-'+t);
    if (el) el.style.display = t === tab ? '' : 'none';
    if (btn) btn.classList.toggle('active', t === tab);
  });
  updateFabForTab();
}

function updateFabForTab() {
  // FAB is always visible when logged in
}

// ═══════════════════════════════════════════════════════
// FAB
// ═══════════════════════════════════════════════════════
document.getElementById('fab-btn').addEventListener('click', function() {
  if (currentTab === 'dash' || currentTab === 'hives') openHiveModal(null);
  else if (currentTab === 'insp') {
    if (currentInspTab === 'feed') openFeedingModal(null);
    else if (currentInspTab === 'treat') openTreatmentModal(null);
    else if (currentInspTab === 'harvest') openHarvestModal(null);
    else openInspChoice(null);
  }
  else if (currentTab === 'fin') openTxnModal(null);
  else if (currentTab === 'docs') {
    if (currentDocsTab === 'docs') openDocModal(null);
    else openAssetModal(null);
  }
  else if (currentTab === 'remind') openReminderModal(null);
  else if (currentTab === 'contacts') openContactModal(null);
  else if (currentTab === 'notes') {
    if (window._libTab === 'notes') openNoteModal(null);
  }
  else if (currentTab === 'settings') openApiaryRename();
});

// ═══════════════════════════════════════════════════════
// MODAL HELPERS
// ═══════════════════════════════════════════════════════
function openModal(html) {
  var el = document.getElementById('modal-inner');
  el.innerHTML = '<div class="modal-handle"></div>' + html;
  document.getElementById('overlay').classList.add('open');
  setTimeout(function(){ el.scrollTop = 0; }, 0);
}
function closeModal() { document.getElementById('overlay').classList.remove('open'); }
document.getElementById('overlay').addEventListener('click', function(e){ if(e.target===this) closeModal(); });

function makePills(gid, options, selected) {
  var html = '<div class="pill-row" id="pill-' + gid + '">';
  options.forEach(function(o) {
    html += '<button type="button" class="pill'+(o===selected?' active':'\')+'" onclick="selectPill(\''+gid+'\',this)">'+esc(o)+'</button>';
  });
  return html + '</div>';
}
function selectPill(gid, btn) {
  document.querySelectorAll('#pill-'+gid+' .pill').forEach(function(p){p.classList.remove('active');});
  btn.classList.add('active');
}
function getPill(gid) { var el=document.querySelector('#pill-'+gid+' .pill.active'); return el?el.textContent:''; }
function makeStars(sid, val) {
  val = val || 3;
  var html = '<div class="star-pick" id="sp-'+sid+'" data-val="'+val+'">';
  for (var i=1;i<=5;i++) html += '<span class="'+(i<=val?'on':'')+'" onclick="pickStar(\''+sid+'\','+i+')">⭐</span>';
  return html + '</div>';
}
function pickStar(sid, val) {
  var el = document.getElementById('sp-'+sid); el.dataset.val = val;
  el.querySelectorAll('span').forEach(function(s,i){s.classList.toggle('on',i<val);});
}
function getStar(sid) { return parseInt(document.getElementById('sp-'+sid).dataset.val||3); }

var _pendingDeleteFn = null;
function confirmDelete(message, onConfirm) {
  _pendingDeleteFn = onConfirm;
  var h = '<div class="modal-title">Confirm Delete</div>';
  h += '<div style="font-size:15px;color:var(--txt2);margin-bottom:20px;line-height:1.6">'+message+'</div>';
  h += '<button class="btn btn-d" onclick="runDelete()">Yes, Delete</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}
function runDelete() { if(_pendingDeleteFn){_pendingDeleteFn();_pendingDeleteFn=null;} closeModal(); }

// ═══════════════════════════════════════════════════════
// CAMERA SOURCE PICKER
// ═══════════════════════════════════════════════════════
var _camCtx = null, _camTarget = 'photo';
function showPhotoSourcePicker(tid, target) {
  _camCtx = tid;
  _camTarget = target || 'photo';
  document.getElementById('cam-sheet').style.display = '';
}
function closeCamSheet() {
  document.getElementById('cam-sheet').style.display = 'none';
}
function camSheetAction(source) {
  closeCamSheet();
  var inputId;
  if (_camTarget === 'photo') {
    inputId = source === 'camera' ? 'photo-camera' : 'photo-file';
    document.getElementById(inputId).dataset.ctx = _camCtx;
  } else if (_camTarget === 'doc') {
    inputId = source === 'camera' ? 'doc-camera' : 'doc-file';
  } else if (_camTarget === 'asset') {
    inputId = source === 'camera' ? 'asset-camera' : 'asset-file';
  }
  document.getElementById(inputId).click();
}

// Wire camera inputs to the same handlers as their gallery counterparts
document.getElementById('photo-camera').addEventListener('change', function() {
  document.getElementById('photo-file').dataset.ctx = this.dataset.ctx || _camCtx;
  handlePhotoFiles(this.files, this.dataset.ctx || _camCtx);
  this.value = '';
});
document.getElementById('doc-camera').addEventListener('change', function() {
  if (this.files[0]) { _docFile = this.files[0]; var pv=document.getElementById('doc-preview'); if(pv) pv.innerHTML='<img src="'+URL.createObjectURL(this.files[0])+'" style="width:100%;border-radius:12px;margin-top:10px">'; }
  this.value = '';
});
document.getElementById('asset-camera').addEventListener('change', function() {
  if (this.files[0]) { _assetFile = this.files[0]; var pv=document.getElementById('asset-preview'); if(pv) pv.innerHTML='<img src="'+URL.createObjectURL(this.files[0])+'" style="width:100%;border-radius:12px;margin-top:10px;max-height:180px;object-fit:contain">'; }
  this.value = '';
});

// ═══════════════════════════════════════════════════════
// PHOTO GALLERY (MODAL)
// ═══════════════════════════════════════════════════════
var _lboxCtx = null, _lboxIdx = null;
function buildGallery(tid) {
  var photos = getPhotos(tid);
  var html = photos.map(function(p,i){
    return '<img src="'+p.dataUrl+'" data-ctx="'+tid+'" data-idx="'+i+'" onclick="openLbox(this.dataset.ctx,+this.dataset.idx)">';
  }).join('');
  html += '<div class="pgal-add" data-tid="'+tid+'" onclick="showPhotoSourcePicker(this.dataset.tid,\'photo\')"><span>+</span><span>Photo</span></div>';
  return html;
}
function refreshGallery(tid) {
  var g = document.getElementById('pgal-h');
  if (g) g.innerHTML = buildGallery(tid);
}
async function handlePhotoFiles(files, tid) {
  if (!tid) tid = 'tmp';
  if (!PHOTOS[tid]) PHOTOS[tid] = [];
  for (var i=0; i<files.length; i++) {
    var f = files[i];
    var ext = (f.name||'jpg').split('.').pop();
    var path = 'photos/'+_currentUser.id+'/'+tid+'-'+Date.now()+'.'+ext;
    var {data:upData, error:upErr} = await sb.storage.from('docs').upload(path, f, {upsert:true});
    var dataUrl = '';
    if (!upErr) {
      var {data:urlData} = sb.storage.from('docs').getPublicUrl(path);
      dataUrl = urlData.publicUrl;
    } else {
      dataUrl = await new Promise(function(res){ var r=new FileReader(); r.onload=function(e){res(e.target.result);}; r.readAsDataURL(f); });
    }
    if (/^p/.test(String(tid))) {
      PHOTOS[tid].push({id:'p'+Date.now()+i, dataUrl:dataUrl});
    } else {
      var saved = await dbInsert('photos', {context_id:tid, data_url:dataUrl});
      if (saved) PHOTOS[tid].push({id:saved.id, dataUrl:dataUrl});
    }
  }
  refreshGallery(tid);
}
document.getElementById('photo-file').addEventListener('change', async function() {
  var tid = this.dataset.ctx || _camCtx || 'tmp';
  await handlePhotoFiles(this.files, tid);
  this.value = '';
});
function openLbox(ctx, idx) {
  _lboxCtx = ctx; _lboxIdx = idx;
  var photos = getPhotos(ctx);
  if (!photos[idx]) return;
  document.getElementById('lbox-img').src = photos[idx].dataUrl;
  document.getElementById('lbox').classList.add('open');
}
document.getElementById('lbox-close').onclick = function(){ document.getElementById('lbox').classList.remove('open'); };
document.getElementById('lbox-del').onclick = async function() {
  var photos = getPhotos(_lboxCtx);
  if (!photos[_lboxIdx]) return;
  var pid = photos[_lboxIdx].id;
  if (!/^p/.test(String(pid))) await dbDelete('photos', pid);
  PHOTOS[_lboxCtx].splice(_lboxIdx, 1);
  document.getElementById('lbox').classList.remove('open');
  renderAll();
};
function hiveThumb(hive) {
  var photos = getPhotos(hive.id);
  if (photos.length) return '<img class="hpic" src="'+photos[0].dataUrl+'" alt="">';
  return '<div class="hico"><svg viewBox="0 0 28 28" fill="none" style="width:22px;height:22px;color:#fff" xmlns="http://www.w3.org/2000/svg"><path d="M14 3L21 7.5V16.5L14 21L7 16.5V7.5L14 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 9L17.5 11V15L14 17L10.5 15V11L14 9Z" fill="currentColor" opacity=".5"/></svg></div>';
}
