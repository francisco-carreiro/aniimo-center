/* Aniimo Wildbook v2.0: application shell only. Never cache personal saves or external images. */
const RELEASE = 'wildbook-v2.0.0';
const SHELL = `${RELEASE}-shell`;
const APP_FILES = [
  '/', '/index.html', '/manifest.webmanifest', '/assets/mark.svg',
  '/assets/icon-192.png','/assets/icon-512.png','/assets/icon-maskable-512.png',
  '/assets/style.min.css','/assets/app.js', '/assets/data.js',
  '/assets/live-data.js','/assets/wildbook-core.js','/assets/battle-data.js',
  '/assets/battle-core.js','/assets/explorer-core.js'
];
const required = new Set(APP_FILES);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL).then(cache => cache.addAll(APP_FILES)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('wildbook-v') && key !== SHELL).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // never intercept the public catalog or CDN artwork
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3500);
        try {
          const live = await fetch(event.request, {signal: controller.signal});
          if (live.ok && live.type === 'basic' && (url.pathname === '/' || url.pathname === '/index.html')) {
            const cache = await caches.open(SHELL);
            await cache.put('/index.html', live.clone());
          }
          return live;
        } finally {clearTimeout(timer)}
      } catch {
        return await caches.match('/index.html') || Response.error();
      }
    })());
    return;
  }
  if (!required.has(url.pathname)) return;
  event.respondWith((async () => {
    const cached = await caches.match(url.pathname);
    if (cached) return cached;
    return await fetch(event.request); // cache is repopulated on the next service-worker install
  })());
});
