
const staticResources = [
    './build.js',
    'index.html',
    '.'
]

self.addEventListener('install', function(event: any) {
    return event.waitUntil(
        caches.open('offlineAppCache')
            .then((cache) => {
                return cache.addAll(staticResources)
            })
    )
})
