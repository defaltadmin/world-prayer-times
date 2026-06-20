const CACHE_NAME = 'prayer-times-v1';
const PRECACHE = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    // Network-first for API calls and geocoding
    if (url.hostname === 'api.aladhan.com' || url.hostname === 'nominatim.openstreetmap.org') {
        e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
        return;
    }
    // Cache-first for everything else (static assets)
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
        if (res.ok && e.request.method === 'GET') {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
    })));
});
