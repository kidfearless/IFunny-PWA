"use strict";
;
self.addEventListener('install', (event) => event.waitUntil(OnInstall(event)));
self.addEventListener('activate', (event) => event.waitUntil(OnActivate(event)));
const cacheNamePrefix = 'offline-cache-';
const cacheName = `${cacheNamePrefix}debugv1`;
async function OnInstall(event) {
    console.info('Service worker: Install');
}
async function OnActivate(event) {
    console.info('Service worker: Activate');
}
async function OnFetch(event) {
    if (event.request.url.includes("/js/") && !event.request.url.endsWith(".js")) {
        console.log("adding .js to url");
        return fetch(new Request(event.request.url + ".js", {
            cache: event.request.cache,
            mode: event.request.mode,
            credentials: event.request.credentials,
            redirect: event.request.redirect,
            integrity: event.request.integrity,
            keepalive: event.request.keepalive,
            method: event.request.method,
            headers: event.request.headers,
            referrer: event.request.referrer,
            referrerPolicy: event.request.referrerPolicy,
            body: event.request.body,
            signal: event.request.signal
        }));
    }
    if (event.request.url.includes("browserlink") || event.request.url.includes("_framework/aspnetcore-browser-refresh.js")) {
        return;
    }
    return fetch(event.request);
}
//# sourceMappingURL=service-worker.js.map