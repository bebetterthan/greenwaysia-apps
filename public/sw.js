const CACHE_VERSION = 'greenesia-v1.0.0';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;
const CACHE_TILES = `${CACHE_VERSION}-tiles`;
const CACHE_API = `${CACHE_VERSION}-api`;

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/maps.html',
    '/news.html',
    '/about.html',
    '/contact.html',
    '/impacts.html',
    '/css/style.css',
    '/js/main.js',
    '/js/geolocation.js',
    '/js/saved-locations.js',
    '/js/toast.js',
    '/js/language.js',
    '/img/logo.png',
    '/manifest.json',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

const MAX_DYNAMIC_CACHE = 50;
const MAX_TILE_CACHE = 200;
const MAX_API_CACHE = 30;

self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((error) => {
                console.error('[SW] Install error:', error);
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (!cacheName.includes(CACHE_VERSION)) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET') {
        return;
    }

    if (url.hostname.includes('tile.openstreetmap.org') || url.hostname.includes('tiles')) {
        event.respondWith(handleMapTiles(request));
    } else if (url.pathname.includes('/api/')) {
        event.respondWith(handleApiRequest(request));
    } else if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
        event.respondWith(handleStaticAssets(request));
    } else {
        event.respondWith(handleDynamicContent(request));
    }
});

async function handleMapTiles(request) {
    try {
        const cache = await caches.open(CACHE_TILES);
        const cached = await cache.match(request);

        if (cached) {
            console.log('[SW] Serving tile from cache:', request.url);
            return cached;
        }

        const response = await fetch(request);

        if (response.ok) {
            const responseClone = response.clone();
            cache.put(request, responseClone);
            limitCacheSize(CACHE_TILES, MAX_TILE_CACHE);
        }

        return response;
    } catch (error) {
        console.error('[SW] Tile fetch error:', error);
        return new Response('Offline - tile not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

async function handleApiRequest(request) {
    try {
        const response = await fetch(request);

        if (response.ok) {
            const cache = await caches.open(CACHE_API);
            cache.put(request, response.clone());
            limitCacheSize(CACHE_API, MAX_API_CACHE);
        }

        return response;
    } catch (error) {
        console.log('[SW] Network failed, checking cache for:', request.url);
        const cache = await caches.open(CACHE_API);
        const cached = await cache.match(request);

        if (cached) {
            console.log('[SW] Serving API from cache');
            return cached;
        }

        return new Response(JSON.stringify({
            error: 'Offline',
            message: 'You are currently offline. Please check your connection.'
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleStaticAssets(request) {
    try {
        const cache = await caches.open(CACHE_STATIC);
        const cached = await cache.match(request);

        if (cached) {
            return cached;
        }

        const response = await fetch(request);

        if (response.ok) {
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.error('[SW] Static asset error:', error);
        return caches.match('/offline.html') || new Response('Offline', { status: 503 });
    }
}

async function handleDynamicContent(request) {
    try {
        const response = await fetch(request);

        if (response.ok) {
            const cache = await caches.open(CACHE_DYNAMIC);
            cache.put(request, response.clone());
            limitCacheSize(CACHE_DYNAMIC, MAX_DYNAMIC_CACHE);
        }

        return response;
    } catch (error) {
        const cache = await caches.open(CACHE_DYNAMIC);
        const cached = await cache.match(request);

        if (cached) {
            return cached;
        }

        return new Response('Offline', { status: 503 });
    }
}

async function limitCacheSize(cacheName, maxSize) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    if (keys.length > maxSize) {
        const deleteCount = keys.length - maxSize;
        console.log(`[SW] Limiting ${cacheName}: deleting ${deleteCount} items`);

        for (let i = 0; i < deleteCount; i++) {
            await cache.delete(keys[i]);
        }
    }
}

self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    console.log('[SW] Syncing data...');
}

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Greenesia';
    const options = {
        body: data.body || 'New update available',
        icon: '/img/icon-192x192.png',
        badge: '/img/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: data.url || '/',
        actions: [
            {
                action: 'open',
                title: 'Open'
            },
            {
                action: 'close',
                title: 'Close'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open') {
        const url = event.notification.data || '/';
        event.waitUntil(
            clients.openWindow(url)
        );
    }
});

self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }

    if (event.data.action === 'clearCache') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});
