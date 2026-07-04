const CACHE_NAME = 'prayer-times-v2';
const PRECACHE = ['/', '/index.html', '/manifest.json', '/icon-192.png'];

let notificationTimers = [];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data?.type !== 'SCHEDULE_PRAYER_NOTIFICATIONS') return;

  notificationTimers.forEach(clearTimeout);
  notificationTimers = [];

  const events = Array.isArray(e.data.events) ? e.data.events : [];
  const now = Date.now();

  for (const ev of events) {
    if (!ev || typeof ev.fireAt !== 'number' || typeof ev.name !== 'string') continue;

    const delay = ev.fireAt - now;
    if (delay <= 0 || delay > 24 * 60 * 60 * 1000) continue;

    const timer = setTimeout(() => {
      if (!self.registration || typeof self.registration.showNotification !== 'function') return;

      self.registration.showNotification('Prayer reminder', {
        body: `${ev.name} in 5 minutes`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: `prayer-${ev.name}`,
        renotify: true,
        data: { url: '/' },
      });
    }, delay);

    notificationTimers.push(timer);
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windows => {
      for (const win of windows) {
        if ('focus' in win) return win.focus();
      }
      return clients.openWindow('/');
    })
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }

  if (url.hostname === 'api.aladhan.com' || url.hostname === 'nominatim.openstreetmap.org') {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }

  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok && e.request.method === 'GET') {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});
