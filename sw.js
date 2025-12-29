const CACHE_NAME = 'trolcc-ai-spiritual-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/advanced-animations.css',
  '/performance-optimizer.js',
  '/assets/images/trolcc_logo1.png'
];

// 安装Service Worker
self.addEventListener('install', event => {
  console.log('🚀 Service Worker 安装中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ 缓存文件列表:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ 所有资源缓存完成');
        return self.skipWaiting();
      })
  );
});

// 激活Service Worker
self.addEventListener('activate', event => {
  console.log('🔥 Service Worker 激活中...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker 激活完成');
      return self.clients.claim();
    })
  );
});

// 拦截请求
self.addEventListener('fetch', event => {
  // 只缓存同源请求
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 返回缓存或网络请求
        if (response) {
          return response;
        }

        return fetch(event.request).then(response => {
          // 检查是否有效响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 克隆响应
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // 网络请求失败时的回退
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// 后台同步示例
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('🔄 后台同步触发');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // 这里可以实现后台数据同步
  console.log('执行后台同步任务...');
}
