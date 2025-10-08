const CACHE_NAME = 'hayvoc-cache-v1';
const urlsToCache = [
'/HayVoc/',
'/HayVoc/index.html',
'/HayVoc/manifest.json',
'/HayVoc/firebase.js'
];

self.addEventListener('install', event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
);
});

self.addEventListener('fetch', event => {
event.respondWith(
caches.match(event.request).then(resp => resp || fetch(event.request))
);
});
