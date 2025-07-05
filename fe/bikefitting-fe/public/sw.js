const CACHE_NAME = 'bike-fitting-app-v1';

// Cache only essential static assets (app shell)
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/bike-icon.svg',
  '/bike-192.png',
  '/bike-512.png',
];

// Install service worker - cache only essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Fetch event - network first strategy (since app needs backend)
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    // Try network first, fallback to cache only for essential assets
    fetch(event.request)
      .then((response) => {
        // Clone the response before caching
        const responseClone = response.clone();
        
        // Cache only if it's a successful response for essential assets
        if (response.status === 200 && urlsToCache.includes(new URL(event.request.url).pathname)) {
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        
        return response;
      })
      .catch(() => {
        // Only serve from cache for essential assets when network fails
        return caches.match(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim clients immediately
  self.clients.claim();
}); 