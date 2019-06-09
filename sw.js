/* global caches, Config */

importScripts('config.js'); // load config
importScripts('js/vendor/cache-polyfill.js'); // polyfill

// register service worker
this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(Config.cacheName).then(function(cache) {
            var items = [
                "index.html",
                "config.js",
                "css/main.css",
                "css/normalize.css",
                "js/helper.js",
                "js/main.js",
                "js/modules/api.js",
                "js/modules/dialog.js",
                "js/modules/events-list.js",
                "js/modules/hint.js",
                "js/modules/location-list.js",
                "js/modules/map.js",
                "js/vendor/addtohomescreen/addtohomescreen.css",
                "js/vendor/addtohomescreen/addtohomescreen.js",
                "js/vendor/fetch.umd.js",
                "js/vendor/jq.gettext.js",
                "js/vendor/jquery-2.1.0.min.js",
                "js/vendor/leaflet/L.TileLayer.PouchDBCached.js",
                "js/vendor/leaflet/leaflet-src.js",
                "js/vendor/leaflet/leaflet.css",
                "js/vendor/localforage.min.js",
                "js/vendor/modernizr-2.7.1.min.js",
                "js/vendor/moment-with-locales.js",
                "js/vendor/polyfill.min.js",
                "js/vendor/pouchdb-7.0.0.min.js",
                "lang/de_DE/LC_MESSAGES/standard.json"
            ];
            return cache.addAll(items);
        })
    );
});

// get from cache (if possible) & update cache every time
this.addEventListener('fetch', function(event) {
    // only gets can be cached
    if(event.request.method != "GET") return;
    
    // don't cache map tiles (that is done in the L.TileLayer.PouchDBCached)
    // we do it this way too, to have a fallback
    //if(event.request.url.indexOf("openstreetmap") > -1) return;
    
    // don't cache Eventkrake data, because we save it with localforage
    if(event.request.url.indexOf("api.eventkrake.de") > -1) return;
    
    event.respondWith(
        caches.open(Config.cacheName).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                var fetchPromise = fetch(event.request).then(function(networkResponse) {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
                return response || fetchPromise;
            });
        })
    );
});

// clear old caches
this.addEventListener('activate', function(event) {
    Config.oldCaches.forEach(function(cache, index) {
        caches.delete(cache);
    });
});