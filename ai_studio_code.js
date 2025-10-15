// कैश का नाम और वर्जन
const CACHE_NAME = 'ran-image-gen-v2';
// वे फाइलें जिन्हें ऑफलाइन चलाने के लिए कैश करना है
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'icon-192x192.png',
  'icon-512x512.png'
];

// 'install' इवेंट: सर्विस वर्कर इंस्टॉल होने पर चलता है
self.addEventListener('install', event => {
  // इंस्टॉलेशन तब तक पूरा नहीं होता जब तक फाइलें कैश न हो जाएं
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 'fetch' इवेंट: जब भी ऐप कोई फाइल मांगता है
self.addEventListener('fetch', event => {
  event.respondWith(
    // पहले कैश में ढूंढो
    caches.match(event.request)
      .then(response => {
        // अगर कैश में मिल गया तो उसे लौटा दो, नहीं तो नेटवर्क से fetch करो
        return response || fetch(event.request);
      })
  );
});

// 'activate' इवेंट: पुराने कैश को हटाने के लिए
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});