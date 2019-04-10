console.log('In service worker');

self.addEventListener('install', function(event) {
  event.waitUntil(
      caches.open('v1').then(cache => {
        cache.addAll([
          '/',
          'index.html',
          '/js/app.js',
          '/js/components/card/card.js',
          '/js/components/card/card.css',
        ]);
      }),
  );
});