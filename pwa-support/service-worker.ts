import { AppVersion } from "../src/Services/AppVersion"

const a = {
    v: AppVersion
}

const staticResources = [
    './build.js',
    './index.html',
    '.'
]

const oldAppCaches = [
    'offlineAppCache'
]
const newAppCache = 'offlineAppCache2'

self.addEventListener('install', function(event: any) {
    console.log(a.v)
    event.waitUntil(
        caches.open(newAppCache)
            .then((cache) => {
                return cache.addAll(staticResources)
            })
    )
})

self.addEventListener('fetch', function(event: any) {
    event.respondWith(
        caches.open(newAppCache)
            .then((cache) => {
                return cache.match(event.request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        return fetch(event.request);
                    })
            })
    )
})
