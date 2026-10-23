/* Prince Jahknow Crown Interior Services service worker — offline shell + runtime caching.
 *
 * Strategy per request type:
 *   - Navigations  → network-first, fall back to a cached page, then /offline
 *   - Next assets  → stale-while-revalidate (immutable, hashed filenames)
 *   - Static media → stale-while-revalidate
 *   - Everything else (RSC payloads, /api, cross-origin, non-GET) → untouched
 *
 * Bump VERSION to invalidate every cache on the next deploy.
 */

const VERSION = "v3";
const PRECACHE = `pjc-precache-${VERSION}`;
const RUNTIME = `pjc-runtime-${VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/offline",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      await Promise.allSettled(
        PRECACHE_URLS.map((url) => cache.add(new Request(url, { cache: "reload" })))
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== PRECACHE && key !== RUNTIME)
          .map((key) => caches.delete(key))
      );
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.disable();
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

function isCacheableAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    /\.(?:css|js|mjs|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf)$/i.test(url.pathname)
  );
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.status === 200 && response.type === "basic") {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);
  return cached || (await network) || Response.error();
}

async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    const url = new URL(request.url);

    // Cache only useful, successful pages — a 404/500 body or a redirect must
    // never become the offline fallback for that URL. Admin pages stay
    // uncached: a stale dashboard served offline is worse than the
    // browser's own offline error.
    if (
      response.ok &&
      response.type === "basic" &&
      !url.pathname.startsWith("/admin")
    ) {
      const cache = await caches.open(RUNTIME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cache = await caches.open(RUNTIME);
    return (
      (await cache.match(request)) ||
      (await caches.match("/")) ||
      (await caches.match("/offline")) ||
      new Response("You are offline.", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      })
    );
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never intercept server data, route handlers or dev HMR traffic.
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.includes("hmr") ||
    url.searchParams.has("_rsc") ||
    request.headers.get("RSC") === "1" ||
    request.headers.get("Next-Router-Prefetch") === "1"
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (isCacheableAsset(url)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
