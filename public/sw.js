const CACHE_NAME = 'ore-plus-v2';
const STATIC_CACHE = 'ore-plus-static-v2';
const DYNAMIC_CACHE = 'ore-plus-dynamic-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-logo.png',
  '/src/assets/pwa-logo.png',
  '/src/assets/praying-hands-cross.jpg',
  '/src/assets/spiritual-background.jpg'
];

const CSS_JS_ASSETS = [
  '/src/main.tsx',
  '/src/index.css',
  '/src/App.css'
];

// Instalação do service worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('Service Worker: Caching CSS/JS assets');
        return cache.addAll(CSS_JS_ASSETS);
      })
    ])
  );
  self.skipWaiting();
});

// Ativação do service worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Estratégia para recursos estáticos (cache-first)
  if (STATIC_ASSETS.includes(url.pathname) || CSS_JS_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request).then(response => {
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE).then(cache => {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
        })
    );
  }
  
  // Estratégia para API calls (network-first)
  else if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
  
  // Estratégia padrão (cache-first com fallback)
  else {
    event.respondWith(
      caches.match(request)
        .then(response => {
          return response || fetch(request);
        })
    );
  }
});

// Sincronização em background
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Aqui você pode adicionar lógica de sincronização
    console.log('Service Worker: Background sync completed');
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}