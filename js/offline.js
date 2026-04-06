// ═══════════════════════════════════════════════════════
// OFFLINE-FIRST — IndexedDB queue + auto-sync
// ═══════════════════════════════════════════════════════

var _offlineDB = null;
var _pendingCount = 0;
var _isOnline = navigator.onLine;

// ── Open IndexedDB ───────────────────────────────────────
function openOfflineDB() {
  return new Promise(function(resolve, reject) {
    if (_offlineDB) { resolve(_offlineDB); return; }
    var req = indexedDB.open('apiaryhq_offline', 1);
    req.onupgradeneeded = function(e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains('queue')) {
        var store = db.createObjectStore('queue', { keyPath: 'localId', autoIncrement: true });
        store.createIndex('table', 'table', { unique: false });
      }
    };
    req.onsuccess = function(e) { _offlineDB = e.target.result; resolve(_offlineDB); };
    req.onerror = function(e) { console.error('IDB open error', e); reject(e); };
  });
}

// ── Queue a pending write ────────────────────────────────
async function queueOfflineWrite(action, table, id, payload) {
  try {
    var db = await openOfflineDB();
    return new Promise(function(resolve, reject) {
      var tx = db.transaction('queue', 'readwrite');
      var store = tx.objectStore('queue');
      var entry = { action:action, table:table, id:id, payload:payload, ts:Date.now() };
      var req = store.add(entry);
      req.onsuccess = function() { resolve(req.result); };
      req.onerror = reject;
    });
  } catch(e) {
    console.warn('queueOfflineWrite failed:', e);
  }
}

// ── Count pending ────────────────────────────────────────
async function getPendingCount() {
  try {
    var db = await openOfflineDB();
    return new Promise(function(resolve) {
      var tx = db.transaction('queue', 'readonly');
      var req = tx.objectStore('queue').count();
      req.onsuccess = function() { resolve(req.result); };
      req.onerror = function() { resolve(0); };
    });
  } catch(e) { return 0; }
}

// ── Badge ────────────────────────────────────────────────
async function updatePendingBadge() {
  _pendingCount = await getPendingCount();
  var badge = document.getElementById('offline-badge');
  if (!badge) return;
  var textEl = document.getElementById('offline-badge-text');
  if (_pendingCount > 0) {
    if (textEl) textEl.textContent = _pendingCount + ' pending sync';
    badge.style.cssText = 'display:flex;position:fixed;top:64px;left:50%;transform:translateX(-50%);background:rgba(180,100,10,.92);color:#fff;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;z-index:9998;align-items:center;gap:6px;box-shadow:0 2px 12px rgba(0,0,0,.25);white-space:nowrap;';
  } else {
    badge.style.display = 'none';
  }
}

// ── Toast ────────────────────────────────────────────────
function showOfflineToast(msg, isWarn) {
  var toast = document.getElementById('sync-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.cssText = 'display:flex;position:fixed;bottom:100px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:20px;font-size:13px;font-weight:700;z-index:9998;box-shadow:0 4px 20px rgba(0,0,0,.25);pointer-events:none;white-space:nowrap;opacity:1;transition:opacity .3s;color:#fff;background:' + (isWarn ? '#b45309' : '#1A3A2A') + ';';
  clearTimeout(toast._t);
  toast._t = setTimeout(function() {
    toast.style.opacity = '0';
    setTimeout(function() { toast.style.display = 'none'; }, 400);
  }, 3500);
}

// ── Drain queue → Supabase ───────────────────────────────
async function syncOfflineQueue() {
  if (!_currentUser) return;
  try {
    var db = await openOfflineDB();
    // Use cursor so we always have the correct primary key (getAll() items may omit keyPath on some browsers).
    var all = await new Promise(function(resolve) {
      var list = [];
      var tx = db.transaction('queue', 'readonly');
      var req = tx.objectStore('queue').openCursor();
      req.onsuccess = function(e) {
        var c = e.target.result;
        if (c) {
          list.push({ key: c.primaryKey, item: c.value });
          c.continue();
        } else resolve(list);
      };
      req.onerror = function() { resolve([]); };
    });

    if (!all.length) { updatePendingBadge(); return; }

    var synced = 0, failed = 0;
    for (var w of all) {
      var item = w.item;
      var qkey = w.key;
      try {
        var err = null;
        if (item.action === 'insert') {
          var res = await sb.from(item.table).insert({...item.payload, user_id:_currentUser.id});
          err = res.error;
        } else if (item.action === 'update') {
          var res = await sb.from(item.table).update(item.payload).eq('id',item.id).eq('user_id',_currentUser.id);
          err = res.error;
        } else if (item.action === 'delete') {
          var res = await sb.from(item.table).delete().eq('id',item.id).eq('user_id',_currentUser.id);
          err = res.error;
        }
        if (err) throw err;
        await _removeQueueItem(qkey);
        synced++;
      } catch(e) {
        console.warn('Sync failed for item', qkey, e.message);
        failed++;
      }
    }

    updatePendingBadge();
    if (synced > 0) {
      showOfflineToast(synced + ' record' + (synced !== 1 ? 's' : '') + ' synced ✓');
      await loadAllData();
      renderAll();
    }
    if (failed > 0) showOfflineToast(failed + ' failed to sync ⚠️', true);
  } catch(e) {
    console.warn('syncOfflineQueue error:', e);
  }
}

async function _removeQueueItem(localId) {
  var db = await openOfflineDB();
  return new Promise(function(resolve, reject) {
    var tx = db.transaction('queue', 'readwrite');
    var req = tx.objectStore('queue').delete(localId);
    req.onsuccess = resolve;
    req.onerror = reject;
  });
}

// ── Online/offline listeners ─────────────────────────────
window.addEventListener('online', function() {
  _isOnline = true;
  showOfflineToast('Back online — syncing…');
  setTimeout(syncOfflineQueue, 1000);
});
window.addEventListener('offline', function() {
  _isOnline = false;
  updatePendingBadge();
  showOfflineToast('You are offline — changes will sync when reconnected', true);
});

// ── Offline-safe wrappers ────────────────────────────────
// KEY FIX: Don't trust navigator.onLine alone.
// Try Supabase — if it fails for any reason (offline, timeout, network error)
// queue the write locally and return a temp row so the UI updates immediately.

async function dbInsertSafe(table, obj) {
  // Try live insert first
  try {
    var result = await Promise.race([
      sb.from(table).insert({...obj, user_id:_currentUser.id}).select().single(),
      new Promise(function(_, reject){ setTimeout(function(){ reject(new Error('timeout')); }, 5000); })
    ]);
    if (result.error) throw result.error;
    _isOnline = true;
    return result.data;
  } catch(e) {
    // Network failed or timed out — queue it
    _isOnline = false;
    var tempId = 'local_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
    await queueOfflineWrite('insert', table, null, obj);
    updatePendingBadge();
    showOfflineToast('Saved offline — will sync when reconnected', true);
    return { ...obj, id: tempId, user_id: (_currentUser && _currentUser.id) || 'local', _isLocal: true };
  }
}

async function dbUpdateSafe(table, id, obj) {
  try {
    var result = await Promise.race([
      sb.from(table).update(obj).eq('id',id).eq('user_id',_currentUser.id),
      new Promise(function(_, reject){ setTimeout(function(){ reject(new Error('timeout')); }, 5000); })
    ]);
    if (result.error) throw result.error;
    _isOnline = true;
  } catch(e) {
    _isOnline = false;
    if (!String(id).startsWith('local_')) {
      await queueOfflineWrite('update', table, id, obj);
      updatePendingBadge();
      showOfflineToast('Saved offline — will sync when reconnected', true);
    }
  }
}

async function dbDeleteSafe(table, id) {
  try {
    var result = await Promise.race([
      sb.from(table).delete().eq('id',id).eq('user_id',_currentUser.id),
      new Promise(function(_, reject){ setTimeout(function(){ reject(new Error('timeout')); }, 5000); })
    ]);
    if (result.error) throw result.error;
    _isOnline = true;
  } catch(e) {
    _isOnline = false;
    if (!String(id).startsWith('local_')) {
      await queueOfflineWrite('delete', table, id, null);
      updatePendingBadge();
    }
  }
}

// ── Init ─────────────────────────────────────────────────
async function initOffline() {
  await openOfflineDB();
  updatePendingBadge();
  if (navigator.onLine && _currentUser) {
    var count = await getPendingCount();
    if (count > 0) setTimeout(syncOfflineQueue, 2000);
  }
}
