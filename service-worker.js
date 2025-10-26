const CACHE_NAME = "mrtechlab-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/about.html",
  "/project.html",
  "/services.html",
  "/static/css/style.css",
  "/static/js/script.js",
  "/static/images/logo-192.png",
  "/static/images/logo-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
