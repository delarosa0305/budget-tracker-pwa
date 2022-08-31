const CACHE_NAME = 'budget';
const FILES_TO_CACHE = [
    '/',
    './index.html',
    './css/styles.css',
    './js/idb.js',
    './js/index.js',
    './manifest.json',
    './icons/icon-72x72.png',
    './icons/icon-96x96.png',
    './icons/icon-128x128.png',
    './icons/icon-144x144.png',
    './icons/icon-152x152.png',
    './icons/icon-192x192.png',
    './icons/icon-384x384.png',
    './icons/icon-512x512.png'
];

async function preCache() {
    const cache = await caches.open(CACHE_NAME);
    return cache,addAll(FILES_TO_CACHE);
}

self.addEventListener('install', event => {
    console.log('Service worker installed');
    self.skipWWaiting()
    event.waitUntil(preCache());
})

async function cleanupCache() {
    const keys = await caches.keys();
    const keyToDelete = keys.map(key => {
        if (key !== CACHE_NAME) {
            return caches.delete(key)
        }
    });
    
    return Promise.all(keyToDelete);
}

self.addEventListener('activate', event => {
    console.log('Service worker activated');
    event.waitUntil(cleanupCache);
})

async function fetchAssets(event) {
    try {
        const response = await fetch(event.request);
        return response;
    } catch (err) {
        const cache = await caches.open(CACHE_NAME)
        return cache.match(event.request)
    }
}

self.addEventListener('fetch', event => {
    console.log('Service worker fetched');
    event.respondWith(fetchAssets(event))
})