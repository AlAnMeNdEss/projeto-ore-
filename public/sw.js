const CACHE_NAME = 'ore-plus-v5';
const STATIC_CACHE = 'ore-plus-static-v5';
const DYNAMIC_CACHE = 'ore-plus-dynamic-v5';
const BIBLIA_CACHE = 'ore-plus-biblia-v5';

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
      }),
      caches.open(BIBLIA_CACHE).then(cache => {
        console.log('Service Worker: Bible cache ready');
        return cache;
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
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== BIBLIA_CACHE) {
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
  
  // Estratégia para dados da Bíblia (cache-first com sincronização)
  else if (url.hostname.includes('supabase') && url.pathname.includes('versiculos_biblia')) {
    event.respondWith(
      caches.open(BIBLIA_CACHE).then(cache => {
        return cache.match(request).then(cachedResponse => {
          // Se temos dados em cache, retornamos imediatamente
          if (cachedResponse) {
            console.log('Service Worker: Serving Bible data from cache');
            return cachedResponse;
          }
          
          // Se não temos cache, buscamos da rede e salvamos
          return fetch(request).then(networkResponse => {
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              cache.put(request, responseClone);
              console.log('Service Worker: Cached Bible data');
            }
            return networkResponse;
          }).catch(error => {
            console.log('Service Worker: Network failed, no cached Bible data');
            return new Response(JSON.stringify({ error: 'No cached data available' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          });
        });
      })
    );
  }
  
  // Estratégia para outras API calls (network-first)
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

// Sincronização de dados da Bíblia
self.addEventListener('sync', event => {
  if (event.tag === 'biblia-sync') {
    console.log('Service Worker: Bible sync triggered');
    event.waitUntil(syncBibliaData());
  }
});

// Push notifications (para futuras funcionalidades)
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nova notificação do Ore+',
      icon: '/pwa-logo.png',
      badge: '/pwa-logo.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Ver',
          icon: '/pwa-logo.png'
        },
        {
          action: 'close',
          title: 'Fechar',
          icon: '/pwa-logo.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification('Ore+', options)
    );
  }
});

// Clique em notificação
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

async function doBackgroundSync() {
  try {
    // Aqui você pode adicionar lógica de sincronização geral
    console.log('Service Worker: Background sync completed');
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

async function syncBibliaData() {
  try {
    // Sincronizar dados da Bíblia quando houver conexão
    const cache = await caches.open(BIBLIA_CACHE);
    console.log('Service Worker: Bible data sync completed');
  } catch (error) {
    console.error('Service Worker: Bible sync failed', error);
  }
}