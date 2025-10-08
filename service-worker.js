const CACHE_NAME = 'armenian-dict-cache-v1';
const OFFLINE_URL = '/';

const PRECACHE = [
'/',
'/index.html',
'/manifest.json',
// Google Fonts (will be cached on first request)
'https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap'
];

self.addEventListener('install', (evt) => {
evt.waitUntil(
caches.open(CACHE_NAME).then(cache => {
return cache.addAll(PRECACHE);
})
);
self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
evt.waitUntil(
caches.keys().then(keys => Promise.all(
keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
))
);
self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
const req = evt.request;
// Try cache first, then network, then fallback to cache (offline).
evt.respondWith(
caches.match(req).then(cached => {
if(cached) return cached;
return fetch(req).then(response => {
// Put a copy in cache (only for GET)
if(req.method === 'GET' && response && response.status === 200 && response.type !== 'opaque'){
caches.open(CACHE_NAME).then(cache => cache.put(req, response.clone()));
}
return response;
}).catch(() => {
// If request fails (offline) and it's a navigation, return cached index.html
if(req.mode === 'navigate' || (req.headers && req.headers.get('accept') && req.headers.get('accept').includes('text/html'))){
return caches.match('/index.html');
}
});
})
);
});