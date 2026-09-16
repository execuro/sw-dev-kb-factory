---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/products/paas/shopware-paas/composable-frontends/performance.md
sourceHash: a1b945e041292bc060198ff8d9d29fd042ae538d
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/composable-frontends/performance.html
title: Composable-Frontends Performance
version: "6.7"
versions:
  - "6.7"
keywords: ["composable frontends", "fastly", "store-api caching", "SwagStoreApiCache", "SwagStoreAPICache.config.additionalCacheableRoutes", "routesRules", "isr", "s-maxage", "stale-while-revalidate", "cors preflight", "sw-cache-hash", "vcl", "soft purge", "http cache"]
summary: "Composable Frontends: Fastly caching of store-api via SwagStoreApiCache, Nuxt ISR cache headers, same-domain store-api routing to skip CORS preflight."
lastBuilt: 2026-09-15
---
## What it is

Performance guidance for Composable Frontends (Nuxt) in front of a Shopware backend on PaaS with Fastly: caching `/store-api/` requests, caching the frontend itself, removing CORS preflight requests, and improving the backend Fastly hit ratio.

## When to use

A Composable Frontend on Shopware PaaS is slow or has a low Fastly cache hit ratio, or browsers send many `OPTIONS` requests to the backend.

## Key steps / config

**Backend (store-api) caching**

- `POST` requests are not cacheable, and Fastly passes them to the backend. The temporary plugin `SwagStoreApiCache` (shopwareLabs) makes a set of `/store-api/` `POST` routes cacheable; it ships its own Fastly snippets that replace the usual ones.
- Add further cacheable routes via admin config `SwagStoreAPICache.config.additionalCacheableRoutes`.
- Keep Fastly soft purges enabled (core config `shopware.http_cache.reverse_proxy.fastly.soft_purge`, default `'0'`).

**Frontend caching**

1. Put a Fastly service in front of each frontend (one per frontend, or one service with multiple domains/hosts).
2. In `nuxt.config.ts`, give `routesRules` ISR plus cache headers:

```ts
'/': { isr: 60 * 60 * 24, headers: { 'cache-control': 'public, s-maxage=3600, stale-while-revalidate=1800' } },
'/**': { isr: 60 * 60 * 24, headers: { 'cache-control': 'public, s-maxage=3600, stale-while-revalidate=1800' } },
```

`s-maxage` = seconds cached on Fastly; `stale-while-revalidate` = how long an expired page may be served while a background refresh runs.

**Remove CORS preflight**: serve backend requests on the frontend domain. In the frontend Fastly service:

```vcl
if (req.url.path ~ "^/store-api/") {
  set req.http.host = "backend.mydomain.com";
  set req.backend = F_Backend__Shopware_instance_;
  return (pass);
}
```

(Alternative: an `Access-Control-Max-Age` header on `OPTIONS` responses to extend the browser's default 5-second preflight cache.)

**Backend hit ratio**: after an item is added to the cart, the `sw-cache-hash` cookie is set and the default VCL hash snippet adds it to the cache key. If rule-based pricing is not used, comment out the "Consider Shopware http cache cookies" block (`if (req.http.cookie:sw-cache-hash) { set req.hash += ...; }`) in the VCL hash snippet.

**Verify**: check the `Age` response header in browser developer tools.

## Essential identifiers

- `SwagStoreApiCache`, `SwagStoreAPICache.config.additionalCacheableRoutes`
- `nuxt.config.ts`, `routesRules`, `isr`, `s-maxage`, `stale-while-revalidate`
- `sw-cache-hash`, `return (pass)`, `Age` header

## Gotchas

- `return (pass)` is required: the frontend Fastly service must not cache store-api responses, otherwise invalidation breaks; the backend Fastly service stays responsible for caching.
- Frontend cache invalidation happens only on Fastly; Shopware cannot invalidate frontend pages, so they stay cached for the `s-maxage` duration.
- The source's commented VCL block also contains an `elseif` branch for the `sw-currency` cookie. In 6.7 core that cookie is deprecated for 6.8 and only used in the cache key when no `sw-cache-hash` cookie exists and the `v6.8.0.0`/`PERFORMANCE_TWEAKS`/`CACHE_REWORK` flags are inactive.

## Version notes

- Shopware is moving store-api requests from `POST` to `GET` so the plugin becomes unnecessary. In 6.7.13.0, e.g. `store-api.product.listing` already accepts both `POST` and `GET` and is marked HTTP-cacheable.

## Code check (6.7.13.0)
- confirmed `sw-cache-hash` — `HttpCacheKeyGenerator::CONTEXT_CACHE_COOKIE`, added to the HTTP cache key — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:27
- deprecated `sw-currency` — `CURRENCY_COOKIE` tagged for removal in v6.8.0; fallback only — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:26
- confirmed `store-api.product.listing` — route accepts POST and GET with HTTP cache attribute — vendor/shopware/core/Content/Product/SalesChannel/Listing/ProductListingRoute.php:59
- confirmed `shopware.http_cache.reverse_proxy.fastly.soft_purge` — Fastly soft purge parameter, default '0' — vendor/shopware/core/Framework/DependencyInjection/cache.xml:244
- unverified `SwagStoreAPICache.config.additionalCacheableRoutes` — separate shopwareLabs plugin, not in vendor/shopware
- unverified `routesRules` — Nuxt config key, outside vendor/shopware
- unverified `Access-Control-Max-Age` — not set by vendor/shopware/core; infrastructure-level header
