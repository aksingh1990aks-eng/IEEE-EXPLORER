const CACHE_NAME = 'rf-explorer-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/cards.html',
  '/component.html',
  '/about.html',
  '/style.css',
  '/main.js',
  '/animations.js',
  '/api.js'
];

// Install Event: Cache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch Event: Serve from network, fallback to cache if offline
self.addEventListener('fetch', event => {
  // Only intercept GET requests, ignore Supabase POST/PATCH requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});