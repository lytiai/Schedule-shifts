const CACHE_NAME = "shifts-app-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./download.html",
  "./styles.css",
  "./scripts.js",
  "./sync.js",
  "./sw.js",
  "./manifest.json",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});
// Устанавливаем Service Worker и кешируем файлы

// Загружаем из кеша при отсутствии интернета
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        return caches.match("./index.html"); // Загружаем PWA даже без интернета
      });
    })
  );
});

self.addEventListener("push", event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: "https://cdn-icons-png.flaticon.com/512/846/846551.png"
  });
});

// Обновляем кеш при изменении версии
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});