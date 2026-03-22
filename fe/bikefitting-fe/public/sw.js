const CACHE_NAME = "bike-fitting-app-v2";

// Cache only essential static assets (app shell)
const urlsToCache = [
	"/",
	"/manifest.json",
	"/s.svg",
	"/s192.png",
	"/s512.png",
];

// Install service worker - cache only essential assets
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(urlsToCache);
		}),
	);
	self.skipWaiting();
});

// Fetch event — network first; never intercept or cache API calls
self.addEventListener("fetch", (event) => {
	if (event.request.method !== "GET") {
		return;
	}

	const url = new URL(event.request.url);

	// Same-origin API: always use the network (no caching / SW handling)
	if (url.pathname.startsWith("/api/")) {
		return;
	}

	event.respondWith(
		fetch(event.request)
			.then((response) => {
				const responseClone = response.clone();

				if (
					response.status === 200 &&
					urlsToCache.includes(new URL(event.request.url).pathname)
				) {
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseClone);
					});
				}

				return response;
			})
			.catch(() => {
				return caches.match(event.request);
			}),
	);
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						return caches.delete(cacheName);
					}
				}),
			);
		}),
	);
	self.clients.claim();
});
