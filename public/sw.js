// ─── Dua Finder Service Worker ───────────────────────────────────────────────
// Strategy:
//   • _next/static/  → cache-first  (content-hashed, safe forever)
//   • fonts/images   → cache-first
//   • Pages (HTML)   → network-first, fall back to cache
//   • /api/*         → network-only (never intercept - fail gracefully)

const STATIC_CACHE = 'dua-static-v2';
const PAGES_CACHE  = 'dua-pages-v2';
const ALL_CACHES   = [STATIC_CACHE, PAGES_CACHE];

// Pages to warm-cache immediately so they're available offline after install
const PRECACHE_PAGES = [
    '/',
    '/saved',
    '/guides',
    '/guides/how-to-make-dua',
    '/guides/dua-etiquette',
    '/guides/opening-supplications',
    '/guides/best-times-for-dua',
    '/guides/things-to-avoid',
];

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(PAGES_CACHE).then((cache) =>
            // allSettled - a failed page fetch won't abort the whole install
            Promise.allSettled(PRECACHE_PAGES.map((url) => cache.add(url)))
        )
    );
});

// ─── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((k) => !ALL_CACHES.includes(k))
                        .map((k) => caches.delete(k))
                )
            )
            .then(() => self.clients.claim())
    );
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Only intercept GET requests from our own origin
    if (request.method !== 'GET' || url.origin !== self.location.origin) return;

    // Never intercept API routes - let them fail naturally when offline
    if (url.pathname.startsWith('/api/')) return;

    // _next/static assets are content-hashed → cache-first, keep forever
    if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
        event.respondWith(cacheFirst(STATIC_CACHE, request));
        return;
    }

    // Everything else (pages, fonts, images) → network-first, cache on success
    event.respondWith(networkFirst(PAGES_CACHE, request));
});

// ─── Strategies ───────────────────────────────────────────────────────────────

async function cacheFirst(cacheName, request) {
    const cache  = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
    } catch {
        return new Response('Asset unavailable offline', { status: 503 });
    }
}

async function networkFirst(cacheName, request) {
    const cache = await caches.open(cacheName);
    try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
    } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        // For navigation requests fall back to the cached home page shell
        if (request.mode === 'navigate') {
            const home = await cache.match('/');
            if (home) return home;
        }
        return new Response('You are offline', { status: 503 });
    }
}
