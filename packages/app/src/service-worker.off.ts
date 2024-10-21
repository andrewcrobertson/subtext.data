/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

declare let self: ServiceWorkerGlobalScope;

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
  const addFilesToCache = async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  };

  event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
  const deleteOldCaches = async () => {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  };

  event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const respond = async () => {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    if (ASSETS.includes(url.pathname)) {
      const response = await cache.match(url.pathname);
      if (response) return response;
    }

    try {
      const response = await fetch(event.request);
      if (!(response instanceof Response)) throw new Error('invalid response from fetch');
      if (response.status === 200) cache.put(event.request, response.clone());
      return response;
    } catch (err) {
      const response = await cache.match(event.request);
      if (response) return response;
      throw err;
    }
  };

  event.respondWith(respond());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
