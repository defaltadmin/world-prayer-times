const CACHE = 'prayer-times-v4';
const ASSETS = ['/', '/manifest.json'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(ks =>
        Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ));
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    // API and font requests: network only
    if (url.hostname === 'api.aladhan.com' || url.hostname === 'fonts.googleapis.com') {
        e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
        return;
    }
    // HTML requests: network-first (prevents stale index.html)
    if (url.pathname.endsWith('.html') || url.pathname === '/') {
        e.respondWith(
            fetch(e.request).then(res => {
                const clone = res.clone();
                caches.open(CACHE).then(c => c.put(e.request, clone));
                return res;
            }).catch(() => caches.match(e.request))
        );
        return;
    }
    // Other assets: cache-first
    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached;
            return fetch(e.request).then(res => {
                if (res.ok && url.hostname === self.location.hostname) {
                    const clone = res.clone();
                    caches.open(CACHE).then(c => c.put(e.request, clone));
                }
                return res;
            }).catch(() => caches.match('/index.html'));
        })
    );
});
