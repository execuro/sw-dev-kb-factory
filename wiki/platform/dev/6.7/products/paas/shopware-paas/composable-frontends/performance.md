---
id: platform/dev/6.7/products/paas/shopware-paas/composable-frontends/performance.md
title: Composable-Frontends Performance
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/composable-frontends/performance.html
sourceHash: a1b945e041292bc060198ff8d9d29fd042ae538d
codeCheckedAgainst: "6.7.15.1"
keywords: ["fastly", "SwagStoreApiCache", "SwagStoreAPICache.config.additionalCacheableRoutes", "store-api", "nuxt.config.ts", "routeRules", "isr", "s-maxage", "stale-while-revalidate", "sw-cache-hash", "cors", "options preflight", "vcl", "cache hit ratio"]
summary: Caching store-api POST requests, Nuxt ISR cache headers, CORS preflight removal and sw-cache-hash VCL tuning for Composable Frontends behind Fastly.
lastBuilt: 2026-10-21
---
## What it is

Performance guidance for running Composable Frontends with a Shopware backend on Shopware PaaS behind Fastly: caching `/store-api/` requests on the backend, caching frontend pages, removing CORS preflight requests, and raising the backend cache hit ratio.

## When to use

When a Composable Frontend (Nuxt) shows slow responses or low cache hit rates on Fastly, or the browser sends many `OPTIONS` requests to the Shopware backend.

## Key steps / config

**Backend (`/store-api/`) caching**

- Current Shopware versions use `POST` for many `/store-api/` requests; Fastly passes `POST` to the backend without caching.
- The temporary `SwagStoreApiCache` plugin (shopwareLabs) makes some `/store-api/` `POST` routes cacheable. It ships its own Fastly snippets that must replace the usual ones. Add more routes via the admin config `SwagStoreAPICache.config.additionalCacheableRoutes`.
- Keep Fastly soft purges enabled.

**Frontend caching**

1. Put a Fastly service in front of each frontend (one service per frontend, or one service with several domains/hosts).
2. In `nuxt.config.ts` route rules, combine Incremental Static Regeneration (`isr`) with cache headers:

```ts
'/**': {
  isr: 60 * 60 * 24,
  headers: {
    'cache-control': 'public, s-maxage=3600, stale-while-revalidate=1800'
  }
},
```

`s-maxage` is how long (seconds) Fastly caches the content; `stale-while-revalidate` is how long an expired page may still be served while it is refreshed in the background. The source applies the same rule to `'/'`.

**Remove CORS preflights**

Serve backend requests from the frontend's domain, so the browser sees one origin. In the frontend Fastly service:

```vcl
if (req.url.path ~ "^/store-api/") {
  set req.http.host = "backend.mydomain.com";
  set req.backend = F_Backend__Shopware_instance_;
  return (pass);
}
```

`return (pass)` is required: the frontend service must not cache these; the backend Fastly service stays responsible for caching. (The alternative, an `Access-Control-Max-Age` header on `OPTIONS` responses, only extends the browser's default 5-second preflight cache.)

**Backend hit ratio**

After an item is added to the cart, Shopware sends the `sw-cache-hash` cookie, which the default VCL hash snippet adds to the cache key. If rule-based pricing is not used, comment out the cookie block of the VCL hash snippet (shown in Gotchas).

**Verify** with browser developer tools: check the `Age` response header.

## Essential identifiers

- `SwagStoreApiCache`, `SwagStoreAPICache.config.additionalCacheableRoutes`
- `nuxt.config.ts`, `isr`, `s-maxage`, `stale-while-revalidate`
- `sw-cache-hash` cookie, `return (pass)`, `Access-Control-Max-Age`, `Age`

## Gotchas

- Cache invalidation happens only on the backend Fastly service. Shopware is not aware of the frontend instance and cannot purge it; frontend items stay cached for the `s-maxage` duration.
- The block to comment out in the VCL hash snippet also has a fallback on the `sw-currency` cookie, which is deprecated in core for v6.8.0:

```vcl
# Consider Shopware http cache cookies
#if (req.http.cookie:sw-cache-hash) {
#	set req.hash += req.http.cookie:sw-cache-hash;
#} elseif (req.http.cookie:sw-currency) {
#	set req.hash += req.http.cookie:sw-currency;
#}
```

## Version notes

Shopware is moving `store-api` requests from `POST` to `GET` so they become cacheable; the `SwagStoreApiCache` plugin will then no longer be required.

## Code check (6.7.15.1)
- confirmed `HttpCacheKeyGenerator::CONTEXT_CACHE_COOKIE` — constant for the sw-cache-hash cookie, removed when no cache hash is required — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheHeadersService.php:58
- deprecated `sw-currency` — HttpCacheKeyGenerator::CURRENCY_COOKIE, removal planned for v6.8.0 — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:26
- confirmed `shopware.http_cache.stale_while_revalidate` — core config node, default null — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1342
- confirmed `shopware.http_cache.soft_purge` — core config node, default false — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1344
- unverified `SwagStoreApiCache` — separate shopwareLabs plugin, not in vendor/shopware
- unverified `SwagStoreAPICache.config.additionalCacheableRoutes` — plugin config key, out of scope
- unverified `nuxt.config.ts` — Composable Frontends/Nuxt, out of scope
