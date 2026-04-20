// ═══════════════════════════════════════════════════════
// APIARY HQ — Service Worker v5.4.2
// Bump CACHE_VERSION on every deployment
// ═══════════════════════════════════════════════════════
var CACHE_VERSION = 'apiaryhq-v5.5.9';

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
  '/js/zones.js',
  '/js/weather.js'
];

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

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  // Always go to network for API calls — never serve stale cached API responses
  if ((url.includes('supabase.co') && !url.includes('supabase-js')) ||
      url.includes('open-meteo.com') ||
      url.includes('nominatim.openstreetmap.org') ||
      url.includes('wttr.in')) {
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
  // Cache-first for all static app files
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        var toCache = response.clone();
        caches.open(CACHE_VERSION).then(function(cache) { cache.put(e.request, toCache); });
        return response;
      });
    })
  );
});
