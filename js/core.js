// ═══════════════════════════════════════════════════════
// COPY AUTH LOGO INTO NAV HOME PILL
// ═══════════════════════════════════════════════════════
(function() {
  var authLogo = document.getElementById('auth-logo-img');
  var navLogo  = document.getElementById('nav-logo-img');
  if (authLogo && navLogo) navLogo.src = authLogo.src;
})();
// ═══════════════════════════════════════════════════════
// SUPABASE INIT
// ═══════════════════════════════════════════════════════
var SUPA_URL = 'https://czejecgdyxklfulndhpp.supabase.co';
var SUPA_KEY = 'sb_publishable_fSgnLCL_vpHTuMBzCHvhDA_EhGKVUg2';
var sb = supabase.createClient(SUPA_URL, SUPA_KEY, {
  auth: { persistSession: true, detectSessionInUrl: true, autoRefreshToken: true }
});
var _currentUser = null;
var _prefs = { units: 'lbs', currency: '$' };

// ═══════════════════════════════════════════════════════
// DATA STORE
// ═══════════════════════════════════════════════════════
var DATA = {
  hives:[], inspections:[], transactions:[], docs:[], assets:[],
  harvests:[], treatments:[], feedings:[], reminders:[], contacts:[], photos:[]
};
var PHOTOS = {};

// ═══════════════════════════════════════════════════════
// DB HELPERS
// ═══════════════════════════════════════════════════════
async function dbInsert(table, obj) {
  var {data,error} = await sb.from(table).insert({...obj, user_id:_currentUser.id}).select().single();
  if (error) { console.error(table, error); return null; }
  return data;
}
async function dbUpdate(table, id, obj) {
  var {error} = await sb.from(table).update(obj).eq('id',id).eq('user_id',_currentUser.id);
  if (error) console.error(table, error);
}
async function dbDelete(table, id) {
  var {error} = await sb.from(table).delete().eq('id',id).eq('user_id',_currentUser.id);
  if (error) console.error(table, error);
}
async function dbSelect(table, extra) {
  var q = sb.from(table).select('*').eq('user_id',_currentUser.id);
  if (extra) q = extra(q);
  var {data,error} = await q;
  if (error) { console.error(table, error); return []; }
  return data || [];
}

async function loadAllData() {
  var results = await Promise.allSettled([
    dbSelect('hives'),
    dbSelect('inspections'),
    dbSelect('transactions'),
    dbSelect('docs'),
    dbSelect('assets'),
    dbSelect('harvests'),
    dbSelect('treatments'),
    dbSelect('feedings'),
    dbSelect('reminders'),
    dbSelect('contacts'),
    dbSelect('photos')
  ]);
  var [hives,insp,txn,docs,assets,harv,treat,feed,rem,contacts,photos] = results.map(function(r){ return r.status==='fulfilled'?r.value:[]; });
  DATA.hives = hives;
  DATA.inspections = insp.map(function(i){return{...i,hiveId:i.hive_id,queenSeen:i.queen_seen,weatherSnap:i.weather_snap};});
  DATA.transactions = txn.map(function(t){return{...t,desc:t.description};});
  DATA.docs = docs.map(function(d){return{...d,dataUrl:d.data_url};});
  DATA.assets = assets || [];
  DATA.harvests = harv.map(function(v){return{...v,hiveId:v.hive_id};});
  DATA.treatments = treat.map(function(t){return{...t,hiveId:t.hive_id,pestType:t.pest_type,diseaseType:t.disease_type};});
  DATA.feedings = feed.map(function(f){return{...f,hiveId:f.hive_id,feedType:f.feed_type,feedOther:f.feed_other,supplementOther:f.supplement_other};});
  DATA.reminders = rem.map(function(r){return{...r,hiveId:r.hive_id,nextDate:r.next_date,remType:r.rem_type,itemName:r.item_name,itemCost:r.item_cost,itemQty:r.item_qty,supplierId:r.supplier_id,addedToFinance:r.added_to_finance};});
  DATA.contacts = contacts || [];
  PHOTOS = {};
  photos.forEach(function(p){
    if (!PHOTOS[p.context_id]) PHOTOS[p.context_id] = [];
    PHOTOS[p.context_id].push({id:p.id, dataUrl:p.data_url});
  });
}

function getPhotos(id) { return PHOTOS[id] || []; }
function saveData() {}
function savePhotos() {}

// ═══════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════
function gv(id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; }
function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtDate(d) { return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {day:'numeric',month:'short',year:'numeric'}); }
function pad2(n) { return String(n).padStart(2,'0'); }
function starsHTML(n) { var s=''; for(var i=0;i<5;i++) s+=(i<n?'⭐':'☆'); return s; }
function initials(name) { return (name||'?').split(' ').map(function(w){return w[0];}).slice(0,2).join('').toUpperCase(); }

// ═══════════════════════════════════════════════════════
// SEASON / DATE
// ═══════════════════════════════════════════════════════
var _now = new Date();
document.getElementById('szn-lbl').textContent = _now.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});

// ═══════════════════════════════════════════════════════
// DARK MODE
// ═══════════════════════════════════════════════════════
var _dark = localStorage.getItem('hkpro_dark') === '1';
if (_dark) { document.body.classList.add('dark'); }
function toggleDarkMode() {
  _dark = !_dark;
  document.body.classList.toggle('dark', _dark);
  document.getElementById('dm-btn').textContent = _dark ? '☀️' : '🌙';
  localStorage.setItem('hkpro_dark', _dark ? '1' : '0');
  var dt = document.getElementById('dark-toggle');
  if (dt) dt.classList.toggle('on', _dark);
}
if (_dark) { document.getElementById('dm-btn').textContent = '☀️'; }

// ═══════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════
function showAuthTab(tab) {
  var isLogin = tab === 'login';
  document.getElementById('tab-login').classList.toggle('active', isLogin);
  document.getElementById('tab-signup').classList.toggle('active', !isLogin);
  document.getElementById('auth-submit-btn').textContent = isLogin ? 'Sign In' : 'Create Account';
  document.getElementById('apiary-name-field').style.display = isLogin ? 'none' : '';
  document.getElementById('auth-footer').innerHTML = isLogin
    ? 'Don\'t have an account? <a href="#" onclick="showAuthTab(\'signup\');return false;" style="color:var(--amber)">Sign up free</a><br><a href="#" onclick="showForgotPassword();return false;" style="color:var(--txt2);font-size:12px">Forgot password?</a>'
    : 'Already have an account? <a href="#" onclick="showAuthTab(\'login\');return false;" style="color:var(--amber)">Sign in</a>';
  document.getElementById('auth-msg').className = 'auth-msg';
}
function setAuthMsg(msg, isErr) {
  var el = document.getElementById('auth-msg');
  el.textContent = msg; el.className = 'auth-msg ' + (isErr ? 'err' : 'ok');
}
async function authSubmit() {
  var email = document.getElementById('auth-email').value.trim();
  var pass = document.getElementById('auth-pass').value;
  var isLogin = document.getElementById('tab-login').classList.contains('active');
  if (!email || !pass) { setAuthMsg('Please enter email and password', true); return; }
  var btn = document.getElementById('auth-submit-btn');
  btn.textContent = '…'; btn.disabled = true;
  try {
    if (isLogin) {
      var res = await sb.auth.signInWithPassword({email, password:pass});
      if (res.error) throw res.error;
      btn.disabled = false; btn.textContent = 'Sign In';
      localStorage.setItem('hkpro_creds', JSON.stringify({email,password:pass}));
      await showApp(res.data.user);
    } else {
      var apiaryName = document.getElementById('auth-apiary').value.trim() || 'My Apiary';
      var result = await sb.auth.signUp({email, password:pass, options:{data:{apiary_name:apiaryName}}});
      btn.disabled = false; btn.textContent = 'Create Account';
      if (result.error) { setAuthMsg(result.error.message, true); return; }
      setAuthMsg('Check your email to confirm your account!', false);
    }
  } catch(e) {
    btn.disabled = false; btn.textContent = isLogin ? 'Sign In' : 'Create Account';
    setAuthMsg(e.message || 'Sign in failed', true);
  }
}
async function signOut() {
  localStorage.removeItem('hkpro_creds');
  await sb.auth.signOut();
  _currentUser = null;
  DATA = {hives:[],inspections:[],transactions:[],docs:[],assets:[],harvests:[],treatments:[],feedings:[],reminders:[],contacts:[]};
  PHOTOS = {};
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('main-header').style.display = 'none';
  document.getElementById('main-nav').style.display = 'none';
  document.querySelectorAll('.page').forEach(function(p){p.style.display='none';});
  document.getElementById('fab-btn').style.display = 'none';
}

var _CRED_KEY = 'hkpro_creds';

async function showApp(user) {
  _currentUser = user;
  document.getElementById('app-loading').classList.remove('hidden');
  document.getElementById('auth-screen').classList.add('hidden');
  await loadAllData();
  var meta = user.user_metadata || {};
  var apiaryName = meta.apiary_name || 'My Apiary';
  document.getElementById('hdr-apiary-name').textContent = apiaryName;
  document.getElementById('settings-apiary-name').textContent = apiaryName;
  document.getElementById('settings-email').textContent = user.email || '';
  // Load preferences
  _prefs.units = localStorage.getItem('hkpro_units') || 'lbs';
  _prefs.currency = localStorage.getItem('hkpro_currency') || '$';
  updatePrefLabels();
  // Render dark toggle
  var dt = document.getElementById('dark-toggle');
  if (dt) dt.classList.toggle('on', _dark);
  // Load logo
  renderHeaderLogo(meta.logo_url);
  // Sync ZIP from Supabase user metadata — always use Supabase as source of truth
  // This ensures ZIP stays in sync across all devices automatically
  if (meta.zip && meta.lat && meta.lng) {
    localStorage.setItem('apiaryhq_zip', meta.zip);
    localStorage.setItem('apiaryhq_lat', meta.lat);
    localStorage.setItem('apiaryhq_lng', meta.lng);
    if (meta.location_name) localStorage.setItem('apiaryhq_location_name', meta.location_name);
  }
  document.getElementById('app-loading').classList.add('hidden');
  document.getElementById('main-header').style.display = '';
  document.getElementById('main-nav').style.display = '';
  showTab('dash');
}

// ── Password Reset Helpers ───────────────────────────────

async function showForgotPassword() {
  var email = document.getElementById('auth-email').value.trim();
  var msgEl = document.getElementById('auth-msg');
  if (!email) {
    msgEl.textContent = 'Enter your email address above, then click Forgot password.';
    msgEl.className = 'auth-msg err';
    document.getElementById('auth-email').focus();
    return;
  }
  msgEl.textContent = 'Sending reset link…';
  msgEl.className = 'auth-msg ok';
  var { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname
  });
  if (error) {
    msgEl.textContent = error.message || 'Could not send reset email.';
    msgEl.className = 'auth-msg err';
  } else {
    msgEl.textContent = '✅ Reset link sent! Check your email.';
    msgEl.className = 'auth-msg ok';
  }
}

function showResetPanel() {
  document.getElementById('login-panel').style.display = 'none';
  document.getElementById('reset-panel').style.display = '';
  document.getElementById('auth-screen').classList.remove('hidden');
}

async function submitPasswordReset() {
  var pass  = document.getElementById('reset-pass').value;
  var pass2 = document.getElementById('reset-pass2').value;
  var msgEl = document.getElementById('reset-msg');
  var btn   = document.getElementById('reset-submit-btn');
  msgEl.className = 'auth-msg';
  if (!pass || pass.length < 6) {
    msgEl.textContent = 'Password must be at least 6 characters.';
    msgEl.className = 'auth-msg err'; return;
  }
  if (pass !== pass2) {
    msgEl.textContent = 'Passwords do not match.';
    msgEl.className = 'auth-msg err'; return;
  }
  btn.disabled = true; btn.textContent = 'Updating\u2026';
  var { error } = await sb.auth.updateUser({ password: pass });
  if (error) {
    msgEl.textContent = error.message || 'Could not update password.';
    msgEl.className = 'auth-msg err';
    btn.disabled = false; btn.textContent = 'Update Password';
  } else {
    msgEl.textContent = '\u2705 Password updated! Signing you in\u2026';
    msgEl.className = 'auth-msg ok';
    setTimeout(async function() {
      var { data } = await sb.auth.getSession();
      if (data && data.session && data.session.user) {
        history.replaceState(null, '', window.location.pathname);
        await showApp(data.session.user);
      } else {
        document.getElementById('reset-panel').style.display = 'none';
        document.getElementById('login-panel').style.display = '';
      }
    }, 1200);
  }
}

// Init: check for saved session
(async function() {
  document.querySelectorAll('.page').forEach(function(p){p.style.display='none';});
  document.getElementById('fab-btn').style.display = 'none';

  // Detect Supabase password-recovery redirect (#type=recovery in hash)
  if (window.location.hash && window.location.hash.includes('type=recovery')) {
    await sb.auth.getSession(); // Let SDK parse the token
    showResetPanel();
    return;
  }

  var {data} = await sb.auth.getSession();
  if (data && data.session && data.session.user) {
    await showApp(data.session.user);
    return;
  }
  var saved = localStorage.getItem(_CRED_KEY);
  if (saved) {
    try {
      var creds = JSON.parse(saved);
      var res = await sb.auth.signInWithPassword({email:creds.email, password:creds.password});
      if (!res.error && res.data.user) { await showApp(res.data.user); return; }
    } catch(e) {}
    localStorage.removeItem(_CRED_KEY);
  }
})();

// ═══════════════════════════════════════════════════════
// LOGO
// ═══════════════════════════════════════════════════════
function renderHeaderLogo(url) {
  var wrap = document.getElementById('hdr-logo-wrap');
  var sArea = document.getElementById('settings-logo-area');
  if (url) {
    wrap.innerHTML = '<img class="hdr-logo" src="'+esc(url)+'" alt="Logo">';
    if (sArea) sArea.innerHTML = '<img class="logo-preview" src="'+esc(url)+'" alt="Logo" onclick="triggerLogoUpload()">';
  } else {
    wrap.innerHTML = '<div class="hdr-logo-placeholder" title="Upload logo in Settings">🐝</div>';
    if (sArea) sArea.innerHTML = '<div class="logo-upload-area"><span style="font-size:28px">🐝</span><span>Upload Logo</span></div>';
  }
}
function triggerLogoUpload() { document.getElementById('logo-file').click(); }
document.getElementById('logo-file').addEventListener('change', async function() {
  if (!this.files.length || !_currentUser) return;
  var f = this.files[0];
  var ext = f.name.split('.').pop();
  var path = 'logo/' + _currentUser.id + '/apiary-logo.' + ext;
  var {error} = await sb.storage.from('docs').upload(path, f, {upsert:true});
  if (error) { alert('Upload failed: '+error.message); return; }
  var {data} = sb.storage.from('docs').getPublicUrl(path);
  var url = data.publicUrl + '?t=' + Date.now();
  await sb.auth.updateUser({data:{logo_url:url}});
  if (_currentUser.user_metadata) _currentUser.user_metadata.logo_url = url;
  renderHeaderLogo(url);
  this.value = '';
});

// ═══════════════════════════════════════════════════════
// APIARY RENAME
// ═══════════════════════════════════════════════════════
function openApiaryRename() {
  var current = document.getElementById('hdr-apiary-name').textContent;
  var h = '<div class="modal-title">Rename Apiary</div>';
  h += '<div class="fg"><label>Apiary Name</label><input id="f-apiary-name" value="'+esc(current)+'" placeholder="e.g. Sunny Hollow Apiary"></div>';
  h += '<button class="btn btn-p" onclick="saveApiaryName()">Save Name</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}
async function saveApiaryName() {
  var name = document.getElementById('f-apiary-name').value.trim();
  if (!name) return;
  await sb.auth.updateUser({data:{apiary_name:name}});
  document.getElementById('hdr-apiary-name').textContent = name;
  document.getElementById('settings-apiary-name').textContent = name;
  if (_currentUser && _currentUser.user_metadata) _currentUser.user_metadata.apiary_name = name;
  closeModal();
}

// ═══════════════════════════════════════════════════════
// PREFERENCES
// ═══════════════════════════════════════════════════════
function updatePrefLabels() {
  var ul = document.getElementById('pref-units-lbl');
  var cl = document.getElementById('pref-currency-lbl');
  if (ul) ul.textContent = _prefs.units;
  if (cl) cl.textContent = _prefs.currency;
}
function openUnitsPref() {
  var h = '<div class="modal-title">Harvest Units</div>';
  h += '<div class="fg"><label>Default Unit</label>'+makePills('units-pref',['lbs','kg','jars','frames'],_prefs.units)+'</div>';
  h += '<button class="btn btn-p" onclick="saveUnitsPref()">Save</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}
function saveUnitsPref() {
  _prefs.units = getPill('units-pref') || _prefs.units;
  localStorage.setItem('hkpro_units', _prefs.units);
  updatePrefLabels(); closeModal();
}
function openCurrencyPref() {
  var h = '<div class="modal-title">Currency Symbol</div>';
  h += '<div class="fg"><label>Symbol</label>'+makePills('cur-pref',['$','€','£','CAD$','AUD$'],_prefs.currency)+'</div>';
  h += '<button class="btn btn-p" onclick="saveCurrencyPref()">Save</button>';
  h += '<button class="btn btn-c" onclick="closeModal()">Cancel</button>';
  openModal(h);
}
function saveCurrencyPref() {
  _prefs.currency = getPill('cur-pref') || _prefs.currency;
  localStorage.setItem('hkpro_currency', _prefs.currency);
  updatePrefLabels(); closeModal();
}
// ══════════════════════════════════════════════════════════════════════════════
// LEGAL MODALS
// ══════════════════════════════════════════════════════════════════════════════

function openPrivacyModal() {
    var h = '<div class="modal-title">Privacy Statement</div>';
    h += '<div style="font-size:14px; color:var(--txt2); line-height:1.5; max-height:300px; overflow-y:auto; margin-bottom:20px; text-align:left;">';
    h += '<b>Data Ownership:</b> All records and uploaded documents remain your private property. We do not sell or share your apiary data.<br><br>';
    h += '<b>Security:</b> Data is stored securely via Supabase with industry-standard encryption.<br><br>';
    h += '<b>Media:</b> Photos and files are kept in private storage for your records only.';
    h += '</div>';
    h += '<button class="btn btn-p" onclick="closeModal()">Close</button>';
    openModal(h);
}

function openCopyrightModal() {
    var h = '<div class="modal-title">Copyright Statement</div>';
    h += '<div style="font-size:14px; color:var(--txt2); line-height:1.5; margin-bottom:20px; text-align:left;">';
    h += '&copy; ' + new Date().getFullYear() + ' Bootstrap Beekeeping. All rights reserved.<br><br>';
    h += 'ApiaryHQ and its associated logos are trademarks of Bootstrap Beekeeping.';
    h += '</div>';
    h += '<button class="btn btn-p" onclick="closeModal()">Close</button>';
    openModal(h);
}