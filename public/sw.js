// MODO service worker — minimal, conservative offline support.
//
// We deliberately do NOT cache pages/data: the app is auth-gated and highly
// dynamic, so caching responses risks serving another user's or stale gated
// content. Instead we precache a single branded /offline fallback and show it
// only when a navigation fails because the network is down.

const CACHE = "modo-v3"
const OFFLINE_URL = "/offline"

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.add(OFFLINE_URL)))
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  // Only intercept top-level navigations; everything else hits the network as
  // normal. If the navigation fails (offline), serve the cached offline page.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)))
  }
})
