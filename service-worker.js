const CACHE_NAME = "ecommerce-pwa-cache-v2";
const urlsToCache = [
    "./", 
    "./index.html",
    "./manifest.json",
    "./readme-images/project-logo.png",
    "./readme-images/desktop.png",
    "./assets/css/style.css",
    "./assets/js/script.js",
    "./assets/images/logo_tourly_192.png",
    "./assets/images/gallery-1.jpg",
    "./assets/images/gallery-2.jpg",
    "./assets/images/gallery-3.jpg",
    "./assets/images/gallery-4.jpg",
    "./assets/images/gallery-5.jpg",
    "./assets/images/hero-banner.jpg",

];

// ✅ Install Service Worker & Cache Assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching assets...");
            return cache.addAll(urlsToCache);
        }).catch((error) => {
            console.error("Failed to cache assets:", error);
        })
    );
});

// ✅ Activate Service Worker & Remove Old Caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Clearing old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// ✅ Fetch Request Handling with Google Fonts Caching
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                console.log("Serving from cache:", event.request.url);
                return response;
            }

            console.log("Fetching from network:", event.request.url);
            return fetch(event.request)
                .then((networkResponse) => {
                    // ✅ Cache Google Fonts and other external resources
                    if (event.request.url.includes("fonts.googleapis.com") ||
                        event.request.url.includes("fonts.gstatic.com")) {
                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse.clone());
                            return networkResponse;
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    console.warn("Network request failed:", event.request.url);
                    // Optionally, return a fallback page if needed
                });
        })
    );
});
