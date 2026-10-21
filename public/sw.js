/*
 * TANTY service worker: one job, the offline page. It keeps public/offline.html
 * (and the logo it shows) ready, and when a page cannot be loaded because the
 * visitor has no connection, it answers with that page instead of the
 * browser's error. Everything else goes to the network as usual: no caching
 * of the site itself, so nothing can go stale. Registered by OfflineSupport.
 */
const CACHE = "tanty-offline-v1";
const OFFLINE = "/offline.html";
const KEEP = [OFFLINE, "/brand/logo/tanty-logo.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(KEEP)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  // A page: the network first, the offline page when there is none.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE)));
    return;
  }
  // The offline page's own logo, from the cache when the network is gone.
  const path = new URL(request.url).pathname;
  if (KEEP.includes(path)) {
    event.respondWith(fetch(request).catch(() => caches.match(path)));
  }
});
