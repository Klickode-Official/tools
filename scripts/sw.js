// Service worker: keeps a copy of the site so the tools open without a connection.
// The build fills in VERSION (a hash of every file) and FILES, so each deploy gets a fresh cache.
// It only ever caches this site's own files; nothing you put into a tool passes through here.
const VERSION = '__VERSION__';
const FILES = __FILES__;
const CACHE = `klickode-tools-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(FILES))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('klickode-tools-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  // Pages: try the network first so people see the latest version, fall back to the copy.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(async () => (await caches.match(request, { ignoreSearch: true })) || (await caches.match(url.pathname.replace(/\/?$/, '/'))) || (await caches.match('/'))),
    );
    return;
  }

  // Files: serve the copy straight away. A new deploy replaces the whole cache anyway.
  // Optional parts that aren't in the list (like the HEIC decoder) are kept once they've loaded.
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(
      (hit) =>
        hit ||
        fetch(request).then((res) => {
          if (res.ok && url.pathname.startsWith('/assets/vendor/')) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        }),
    ),
  );
});
