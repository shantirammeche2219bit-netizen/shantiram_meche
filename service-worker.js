const CACHE_NAME = "shantiram-pwa-v2";

const urlsToCache = [
  "/Shantiram-Meche/",
  "/Shantiram-Meche/index.html",
  "/Shantiram-Meche/style.css",
  "/Shantiram-Meche/me.jpeg",
  "/Shantiram-Meche/icons/icon-192.png",
  "/Shantiram-Meche/icons/icon-512.png"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (cached) => cached || fetch(event.request)
    )
  );
});