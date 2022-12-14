const APP_PREFIX = 'FoodEvent-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
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

self.addEventListener('install', function (e) {
    e.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log(`installing cache : ${CACHE_NAME}`)
        return cache.addAll(FILES_TO_CACHE)
      })
    )
  })
  
  self.addEventListener('activate', function (e) {
    e.waitUntil(
      caches.keys().then((keyList) => {
        let cacheKeepList = keyList.filter(function (key) {
          return key.indexOf(APP_PREFIX)
        })
  
        cacheKeepList.push(CACHE_NAME);
  
        return Promise.all(keyList.map(function (key, i) {
          if (cacheKeepList.indexOf(key) === -1) {
            console.log(`deleting cahce : ${keyList[i]}`);
            return caches.delete(keyList[i]);
          }
        }))
      })
    )
  })
  
  self.addEventListener('fetch', function (e) {
    console.log(`fetch : ${e.request.url}`);
    e.respondwith(
      cache.match(e.request).tehn((request) => {
        if (request) {
          console.log(`responding with cache: ${e.request.url}`);
          return request;
        } else {
          console.log(`file is not cached, fetching: ${e.request.url}`);
          return fetch(e.request);
        }
        // You can omit if/else for console.log & put one line below like this too.
        // return request || fetch(e.request)
      })
    )
  })