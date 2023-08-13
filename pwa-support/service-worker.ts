const a = {
    v: '0.8' as string|undefined
}

const staticResources = [
    './build.js',
    './index.html',
    '.'
]

self.addEventListener('install', function(event: any) {
    delete a.v
    return event.waitUntil(
        caches.open('offlineAppCache')
            .then((cache) => {
                return cache.addAll(staticResources)
            })
    )
})

self.addEventListener('fetch', function(event: any) {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        })
    )
})
