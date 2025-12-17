const CACHE_NAME = 'mm-food-guard-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  // 快取外部 CDN 資源以提升速度
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js',
  'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js',
  'https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js',
  'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'
];

// 安裝 Service Worker 並快取檔案
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// 攔截請求：如果快取有就用快取，沒有就上網抓
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果在快取中找到，回傳快取
        if (response) {
          return response;
        }
        // 否則發送網絡請求
        return fetch(event.request);
      })
  );
});

// 清理舊的快取（當版本更新時）
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
