const CACHE_NAME = "shantiram-meche-pwa-v2";

const urlsToCache = [
  "/shantiram_meche/",
  "/shantiram_meche/index.html",
  "/shantiram_meche/style.css",
  "/shantiram_meche/me.jpeg",
  "/shantiram_meche/manifest.json"
];

// Install
self.addEventListener("install", event => {
  console.log("Service Worker installing...");
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Cache opened:", CACHE_NAME);
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate
self.addEventListener("activate", event => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log("Cache hit for:", event.request.url);
        return response;
      }
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        console.log("Fetch failed, returning cache:", event.request.url);
        return caches.match("/shantiram_meche/index.html");
      });
    })
  );
});