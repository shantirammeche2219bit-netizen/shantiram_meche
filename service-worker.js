const CACHE_NAME = "shantiram-pwa-v1";

const urlsToCache = [
  "/shantiram_meche/",
  "/shantiram_meche/index.html",
  "/shantiram_meche/style.css",
  "/shantiram_meche/me.jpeg"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch (cache first)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});