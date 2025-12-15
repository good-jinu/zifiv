const _CACHE_NAME = "zifiv-v1";
const STATIC_CACHE = "zifiv-static-v1";
const DYNAMIC_CACHE = "zifiv-dynamic-v1";

const staticAssets = [
	"/",
	"/manifest.json",
	"/icon-192x192.png",
	"/icon-512x512.png",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(STATIC_CACHE)
			.then((cache) => cache.addAll(staticAssets))
			.then(() => self.skipWaiting()),
	);
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
							return caches.delete(cacheName);
						}
						return Promise.resolve();
					}),
				);
			})
			.then(() => self.clients.claim()),
	);
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
	if (event.request.method !== "GET") return;

	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			if (cachedResponse) {
				return cachedResponse;
			}

			return fetch(event.request)
				.then((response) => {
					// Don't cache non-successful responses
					if (
						!response ||
						response.status !== 200 ||
						response.type !== "basic"
					) {
						return response;
					}

					// Clone the response
					const responseToCache = response.clone();

					// Cache dynamic content
					caches.open(DYNAMIC_CACHE).then((cache) => {
						cache.put(event.request, responseToCache);
					});

					return response;
				})
				.catch(() => {
					// Return offline page for navigation requests
					if (event.request.destination === "document") {
						return caches.match("/");
					}
				});
		}),
	);
});
