const CACHE_STATIC_NAME = 'static';
const CACHE_DYNAMIC_NAME = 'dynamic';

this.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker');

  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then((cache) => {
      cache.addAll([
        '/'
      ])
    })
  )
});

this.addEventListener('activate', function (event) {
  return this.clients.claim();
});

this.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      if (res) { return res; }

      return fetch(event.request).then((response) => {
        return caches.open(CACHE_DYNAMIC_NAME)
          .then((cache) => {
            cache.put(event.request.url, response.clone());

            return response;
          })
      })
    })
  )
})