// ═══════════════════════════════════════════════════════
// APIARY HQ — Service Worker v5.4.2
// Bump CACHE_VERSION on every deployment
// ═══════════════════════════════════════════════════════
var CACHE_VERSION = 'apiaryhq-v5.5.9';

var EXTERNAL_URLS = [
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

var CACHE_FILES = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './js/icons.js',
  './js/offline.js',
  './js/core.js',
  './js/ui.js',
  './js/frames.js',
  './js/hives.js',
  './js/inspections.js',
  './js/treatments.js',
  './js/harvest.js',
  './js/feeding.js',
  './js/finance.js',
  './js/reminders.js',
  './js/render.js',
  './js/pdf_export.js',
  './js/pollen.js',
  './js/weather.js',
  './js/guided_inspection.js',
  './js/docs.js',
  './js/notes.js',
  './js/contacts.js',
  './js/hive_history.js',
  './js/zones.js'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache) {
      return Promise.allSettled(
        CACHE_FILES.map(function(url) {
          return cache.add(url).catch(function(err) {
            console.warn('SW: Failed to cache', url, err);
          });
        })
      );
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

  // Always go network-first for Supabase API calls
  if (url.includes('supabase.co')) {
    e.respondWith(
      fetch(e.request).catch(function() {
        return new Response(JSON.stringify({error: 'offline'}), {
          headers: {'Content-Type': 'application/json'}
        });
      })
    );
    return;
  }

  // Network-first for external CDN resources
  if (EXTERNAL_URLS.some(function(u) { return url.startsWith(u); })) {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          var toCache = response.clone();
          caches.open(CACHE_VERSION).then(function(cache) { cache.put(e.request, toCache); });
          return response;
        })
        .catch(function() { return caches.match(e.request); })
    );
    return;
  }

  // Cache-first for app shell
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        var toCache = response.clone();
        caches.open(CACHE_VERSION).then(function(cache) { cache.put(e.request, toCache); });
        return response;
      });
    })
  );
});
