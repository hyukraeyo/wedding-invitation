const CACHE_NAME = 'wedding-invitation-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/builder',
  '/login',
  '/manifest.json',
  '/favicon.ico',
  '/icon.png',
  '/og-image.jpg',
];

const API_CACHE_NAME = 'wedding-invitation-api-v1';
const API_CACHE_ROUTES = [
  '/api/invitations',
  '/api/guests',
  '/api/auth',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (API_CACHE_ROUTES.some((route) => url.pathname.startsWith(route))) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cached) => {
          if (cached) {
            return cached;
          }

          return fetch(event.request).then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then((response) => {
        if (
          response.ok &&
          (event.request.method === 'GET' ||
            url.pathname.startsWith('/_next/static') ||
            url.pathname.startsWith('/static'))
        ) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
          });
        }
        return response;
      });
    })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-invitations') {
    event.waitUntil(syncInvitations());
  }
});

async function syncInvitations() {
  await caches.open(API_CACHE_NAME);
}
