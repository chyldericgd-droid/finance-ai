// Finance AI OS — Service Worker v9
// Gère : cache offline, notifications sonores, push, click notif
'use strict';

const CACHE = 'finos-v9';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-96.png',
  './icon-192.png',
  './icon-512.png'
];

// ── INSTALL : mettre en cache le shell ──
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('Cache partiel:', err))
  );
});

// ── ACTIVATE : nettoyer les vieux caches ──
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// ── MESSAGES depuis l'app ──
self.addEventListener('message', e => {
  if (!e.data) return;
  if (e.data.type === 'SKIP_WAITING') self.skipWaiting();
  // L'app peut demander au SW d'envoyer une notif (utile en arrière-plan)
  if (e.data.type === 'SHOW_NOTIF') {
    const { title, body, tag } = e.data;
    self.registration.showNotification(title, {
      body,
      tag: tag || 'finos',
      icon: './icon-192.png',
      badge: './icon-96.png',
      vibrate: [200, 100, 200, 100, 300],
      requireInteraction: false,
      data: { url: './' }
    });
  }
});

// ── CLIC SUR UNE NOTIFICATION ──
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // Si une fenêtre est déjà ouverte → la ramener au premier plan
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      // Sinon ouvrir l'app
      return clients.openWindow('./index.html');
    })
  );
  // Informer l'app qu'on a cliqué
  clients.matchAll({ type: 'window' }).then(list =>
    list.forEach(c => c.postMessage({ type: 'NOTIF_CLICK' }))
  );
});

// ── PUSH (optionnel — si tu veux des notifs serveur plus tard) ──
self.addEventListener('push', e => {
  let data = { title: 'Finance AI OS', body: 'Nouvelle alerte.' };
  try { data = e.data.json(); } catch (err) {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icon-192.png',
      badge: './icon-96.png',
      vibrate: [200, 100, 200, 100, 300],
      data: { url: './' }
    })
  );
});

// ── FETCH : cache-first pour le shell, réseau pour le reste ──
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Laisser passer les appels API (Groq, Fonts)
  if (
    url.hostname.includes('groq.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com')
  ) return;

  // Navigation → réseau d'abord, fallback cache
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(r => {
          if (r && r.ok) {
            const copy = r.clone();
            caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(() => {});
          }
          return r;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Assets (icônes, manifest) → cache d'abord
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(r => {
        if (r && r.ok) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return r;
      }).catch(() => cached || new Response('', { status: 404 }));
    })
  );
});
