const a = {
    v: '0.7.1' as string|undefined
}

const staticResources = [
    './build.js',
    'index.html',
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
