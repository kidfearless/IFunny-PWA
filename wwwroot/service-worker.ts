// Caution! Be sure you understand the caveats before publishing an application with
// offline support. See https://aka.ms/blazor-offline-considerations

interface ExtendableEvent extends Event
{
	waitUntil(condition: Promise<any>): undefined;
}


interface FetchEvent extends ExtendableEvent
{
	readonly request: Request;
	readonly preloadResponse: Promise<any>;
	readonly clientId: string;
	readonly resultingClientId: string;
	readonly replacesClientId: string;
	readonly handled: Promise<undefined>;

	respondWith(r: Promise<Response>): undefined;
};



// @ts-ignore
self.addEventListener('install', (event: ExtendableEvent) => event.waitUntil(OnInstall(event)));
// @ts-ignore

self.addEventListener('activate', (event: ExtendableEvent) => event.waitUntil(OnActivate(event)));
// @ts-ignore
// self.addEventListener('fetch', (event: FetchEvent) => event.respondWith(OnFetch(event)));
// @ts-ignore
const cacheNamePrefix = 'offline-cache-';
// @ts-ignore
const cacheName = `${cacheNamePrefix}debugv1`;

async function OnInstall(event: ExtendableEvent)
{
	console.info('Service worker: Install');
}

async function OnActivate(event: ExtendableEvent)
{
	console.info('Service worker: Activate');

	// // Delete all caches except current cache
	// const cacheKeys = await caches.keys();
	// await Promise.all(
	// 	cacheKeys
	// 		.filter(key => key.startsWith(cacheNamePrefix) && key !== cacheName)
	// 		.map(key => caches.delete(key))
	// );
}



async function OnFetch(event: FetchEvent)
{
	// console.log(`handling fetch for: ${event.request.url}`, event);

	if (event.request.url.includes("/js/") && !event.request.url.endsWith(".js"))
	{
		console.log("adding .js to url");
		return fetch(new Request(event.request.url + ".js",
			{
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

	if (event.request.url.includes("browserlink") || event.request.url.includes("_framework/aspnetcore-browser-refresh.js"))
	{
		return;
	}

	// const cache = await caches.open(cacheName);

	// if (event.request.method === 'GET' && event.request.mode === 'navigate')
	// {

	// 		const cachedResponse = await cache.match('index.html');
	// 		if (cachedResponse)
	// 		{
	// 			return cachedResponse;
	// 		}
	// }

	// const response = await cache.match(event.request);
	// if (response)
	// {
	// 	return response;
	// }

	return fetch(event.request);
}
