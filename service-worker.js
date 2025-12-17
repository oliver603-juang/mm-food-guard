const CACHE_NAME = 'mm-food-guard-v2'; // 更新版本號以確保快取更新
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js',
  'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js',
  'https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'
  // 已移除 Lucide Icons 連結，避免快取錯誤
];

// 安裝 Service Worker 並快取資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // 強制讓新的 SW 立即接管
});

// 攔截網路請求：優先使用快取，失敗則連線網路 (Cache First, falling back to Network)
self.addEventListener('fetch', (event) => {
  // 排除 API 請求 (API 需要即時數據，不走快取)
  if (event.request.url.includes('googleapis.com') || event.request.url.includes('emailjs.com')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// 更新 Service Worker 時清除舊快取
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
  self.clients.claim(); // 立即取得控制權
});
