// ══════════════════════════════════════════════════════
// KITSUNE FINANCE — Service Worker
// Versión: 1.0.0
// Estrategia: Cache-first para assets, network-first para datos
// ══════════════════════════════════════════════════════

const CACHE_NAME = 'kitsune-v2';
const CACHE_STATIC = 'kitsune-static-v2';

// Assets que se cachean en el install
const PRECACHE_URLS = [
  './index.html',
  './manifest.json'
];

// ── INSTALL: precachear archivos estáticos ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: limpiar caches viejos ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== CACHE_STATIC)
          .map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// ── FETCH: cache-first para el HTML principal ──
self.addEventListener('fetch', event => {
  // Solo interceptar requests del mismo origen
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // Solo cachear respuestas válidas
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const cloned = response.clone();
        caches.open(CACHE_STATIC).then(cache => cache.put(event.request, cloned));
        return response;
      }).catch(() => {
        // Offline fallback: devolver index.html para navegación
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// ══════════════════════════════════════════════════════
// PUSH NOTIFICATIONS
// ══════════════════════════════════════════════════════

// Recibe un push del servidor (o de la propia app via postMessage)
self.addEventListener('push', event => {
  let data = { title: '🦊 Kitsune Finance', body: 'Tienes una alerta financiera', icon: './icon-192.png', badge: './icon-192.png' };

  if (event.data) {
    try { data = { ...data, ...event.data.json() }; }
    catch (e) { data.body = event.data.text(); }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag || 'kitsune-alert',
    renotify: true,
    requireInteraction: data.requireInteraction || false,
    data: data.url ? { url: data.url } : {},
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Click en notificación → abrir/enfocar la app
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || './index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Si ya hay una ventana abierta, enfocarla
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abrir una nueva
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

// ── Recibe mensajes internos desde la app (para notifs locales sin servidor) ──
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
