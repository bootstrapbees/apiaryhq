// ═══════════════════════════════════════════════════════
// APIARY HQ — Service Worker
// Bump CACHE_VERSION any time you deploy updated files
// ═══════════════════════════════════════════════════════
var CACHE_VERSION = 'apiaryhq-v5.3.6';

var EXTERNAL_URLS = [
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

var STATIC_FILES = [
  '/',
  '/index.html',
  '/styles.css',
  '/manifest.json',
  '/ApiaryHQ.jpg',
  '/js/icons.js',
  '/js/offline.js',
  '/js/core.js',
  '/js/ui.js',
  '/js/hives.js',
  '/js/inspections.js',
  '/js/treatments.js',
  '/js/harvest.js',
  '/js/feeding.js',
  '/js/finance.js',
  '/js/reminders.js',
  '/js/docs.js',
  '/js/contacts.js',
  '/js/render.js',
  '/js/notes.js',
  '/js/guided_inspection.js',
  '/js/hive_history.js',
  '/js/pdf_export.js',
  '/js/pollen.js',
  '/js/weather.js'
];

// ── Install: cache all static files ─────────────────────
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache) {
      return cache.addAll(STATIC_FILES).then(function() {
        return Promise.allSettled(
          EXTERNAL_URLS.map(function(url) {
            return fetch(url).then(function(response) {
              if (response.ok) return cache.put(url, response);
            }).catch(function(e) {
              console.warn('Could not cache external URL:', url, e);
            });
          })
        );
      });
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// ── Activate: delete old caches ──────────────────────────
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_VERSION; })
            .map(function(key) { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ── Fetch: cache-first for static, network-first for API ─
self.addEventListener('fetch', function(e) {
  var url = e.request.url;

  if ((url.includes('supabase.co') && !url.includes('supabase-js')) || url.includes('tomorrow.io')) {
    e.respondWith(
      fetch(e.request).catch(function() {
        return new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        var toCache = response.clone();
        caches.open(CACHE_VERSION).then(function(cache) {
          cache.put(e.request, toCache);
        });
        return response;
      });
    })
  );
});
