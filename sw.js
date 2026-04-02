const CACHE_NAME = "shantiram-site-v1";

const urlsToCache = [
  "/shantiram_meche/",
  "/shantiram_meche/index.html",
  "/shantiram_meche/style.css",
  "/shantiram_meche/me.jpeg",
  "/shantiram_meche/portfolio.html",
  "/shantiram_meche/about.html"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Fetch (offline support)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});