/* Above The Puck - offline cache.
   Bump CACHE when you change any file, otherwise browsers keep serving the old one. */
const CACHE = 'hockey-iq-v157';
const ASSETS = [
  './',
  './index.html',
  './situations.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* The Settings build receipt asks the ACTIVE worker which cache it is serving from.
   Answering here is the only way the page can compare what it expects against what is
   actually running - index.html cannot see this constant. */
self.addEventListener('message', e => {
  if (!e.data || e.data.q !== 'hiq-cache') return;
  const reply = { hiqCache: CACHE };
  if (e.ports && e.ports[0]) e.ports[0].postMessage(reply);
  else if (e.source) e.source.postMessage(reply);
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // YouTube and anything else off-origin: straight to the network, never cached
  if (url.origin !== self.location.origin) return;

  // navigations: network first so a redeploy is picked up, cache as the fallback
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        caches.open(CACHE).then(c => c.put('./index.html', res.clone()));
        return res;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // everything else: cache first, fill the cache on a miss. A miss with no network is
  // left to reject, so the browser reports its own network error. Do not "fall back" to
  // the miss value - it is always undefined, and respondWith(undefined) throws.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.status === 200) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
