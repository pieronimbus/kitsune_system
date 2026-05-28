// ══════════════════════════════════════════════════════
// KITSUNE FINANCE — Service Worker v2.1
// Estrategia: Cache-first para assets estáticos
// ══════════════════════════════════════════════════════

const CACHE_NAME = 'kitsune-v3';
const CACHE_STATIC = 'kitsune-static-v3';

const PRECACHE_URLS = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== CACHE_STATIC)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const cloned = response.clone();
        caches.open(CACHE_STATIC).then(cache => cache.put(event.request, cloned));
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

self.addEventListener('push', event => {
  let data = {
    title: '🦊 Kitsune Finance',
    body: 'Tienes una alerta financiera',
    icon: './icon-192.png',
    badge: './icon-192.png'
  };
  if (event.data) {
    try { data = { ...data, ...event.data.json() }; }
    catch (e) { data.body = event.data.text(); }
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag || 'kitsune-alert',
      renotify: true,
      requireInteraction: data.requireInteraction || false,
      data: data.url ? { url: data.url } : {},
      actions: data.actions || []
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || './index.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, delay, tag, url } = event.data;
    setTimeout(() => {
      self.registration.showNotification(title || '🦊 Kitsune', {
        body: body || '',
        icon: './icon-192.png',
        badge: './icon-192.png',
        tag: tag || 'kitsune-scheduled',
        data: { url: url || './index.html' }
      });
    }, delay || 0);
  }
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
