var cacheStorageKey = 'sw-demo-cache-v1';
// 注册成功后要立即缓存的资源列表
var cacheList = [
    "/imgs/timg.jpeg",
    // "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586842161012&di=a72fe6aedcb76c12e1a891fa0fbaa149&imgtype=0&src=http%3A%2F%2Fbbs.jooyoo.net%2Fattachment%2FMon_0905%2F24_65548_2835f8eaa933ff6.jpg"
]

// 当浏览器解析完 SW 文件时触发 install 事件
// 在 install 回调的内部，我们需要执行以下步骤：
// 1.打开缓存。
// 2.缓存文件。
// 3.确认所有需要的资产是否已缓存。
self.addEventListener('install', function (e) {
    // install 事件中一般会将 cacheList 中要缓存的内容通过 addAll 方法，请求一遍放入 caches 中
    e.waitUntil(
        caches.open(cacheStorageKey).then(function (cache) {
            console.log('Opened cache');
            return cache.addAll(cacheList)
        })
    );
});

// 激活时触发 activate 事件
self.addEventListener('activate', function (e) {
    // active 事件中通常做一些过期资源释放的工作，匹配到就从 caches 中删除
    var cacheDeletePromises = caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(name => {
            if (name !== cacheStorageKey) {
                return caches.delete(name);
            } else {
                return Promise.resolve();
            }
        }));
    });

    e.waitUntil(
        Promise.all([cacheDeletePromises])
    );
});

// 在安装 Service Worker 且用户转至其他页面或刷新当前页面后，Service Worker 将开始接收 fetch 事件。
// 在此编写缓存策略
self.addEventListener('fetch', function (e) {
    e.respondWith(
        // 如果发现匹配的响应，则返回缓存的值，否则，将调用 fetch 以发出网络请求，并将从网络检索到的任何数据作为结果返回
        caches.match(e.request).then((res) => {
            // Cache hit - return response
            if (response) {
                return response;
            }
            // Else - fetch the source 
            return fetch(e.request);
        }),
        // // 也可以从远端拉取
        // fetch(e.request.url),
        // 也可以自己造
        // new Response('自己造')
        // 也可以通过吧 fetch 拿到的响应通过 caches.put 方法放进 caches
    );
});