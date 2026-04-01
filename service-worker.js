// Version name (change when you update files)
const CACHE_NAME = "pwa-cache-v9";

// Files to cache
const ASSETS_TO_CACHE = [
  "/shantiram_meche/",
  "/shantiram_meche/index.html",
  "/shantiram_meche/about.html",
  "/shantiram_meche/services.html",
  "/shantiram_meche/portfolio.html",
  "/shantiram_meche/photo.html",
  "/shantiram_meche/manifest.json",
  "/shantiram_meche/me.jpeg",
  "/shantiram_meche/pro2.png"
];

// 🔹 Install event – cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 🔹 Activate event – clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 🔹 Fetch event – network first for navigation, cache first for assets
self.addEventListener("fetch", (event) => {
  // For navigation requests, try network first, fall back to cache
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the latest version
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match("/shantiram_meche/index.html");
          });
        })
    );
    return;
  }

  // For all other requests (CSS, JS, images, fonts), cache first, network as fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (!response || response.status !== 200 || (response.type !== "basic" && response.type !== "cors")) {
            // If we have it in cache, return it anyway even if network fetch isn't 200
            return caches.match(event.request).then((cached) => {
                if (cached) return cached;
                // Otherwise, if it's an image, we could return a placeholder here
                // For now, return the original response
                return response;
            });
          }

          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return response;
        })
        .catch(() => {
          // Return empty response for failed requests
          return new Response("", { status: 408, statusText: "Offline" });
        });
    })
  );
});