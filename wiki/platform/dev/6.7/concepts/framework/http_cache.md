---
id: platform/dev/6.7/concepts/framework/http_cache.md
title: HTTP Cache
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/http_cache.html
sourceHash: 8921442921cf10a88c1edd02d1b794726daf1c05
codeCheckedAgainst: "6.7.15.1"
keywords: ["http cache", "_httpCache", "sw-cache-hash", "sw-currency", "sw-states", "CacheResponseSubscriber", "CACHE_REWORK", "tag_invalidation_log_enabled", "sw-dynamic-cache-bypass", "reverse proxy", "varnish", "cache invalidation", "cache tags", "caching policies"]
summary: "HTTP cache: _httpCache route default, sw-cache-hash cookie, Store API cache tags, list-route TTLs, CACHE_REWORK response workflow."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md", "platform/dev/6.7/guides/hosting/performance/caches.md"]
---
## What it is

The HTTP cache stores complete responses of the shop so a repeated identical request can be answered without running the application. It works both with Shopware's internal (Symfony) HTTP cache and with an external reverse proxy (e.g. Varnish, Fastly) placed between the user and the web application. The cache key is derived from the request plus a `cache-hash` that encodes the customer's application state.

## When to use

- Making a custom Storefront/Store API route cacheable.
- Understanding why a page is or is not served from cache, or why two customers get different cache entries.
- Configuring a reverse proxy to vary on the right cookies/headers.
- Deciding how invalidation reaches a controller route (via Store API cache tags) and why listing routes depend on TTL.

## Key steps / config

**Mark a route cacheable** — set the route default `_httpCache` (`PlatformRequest::ATTRIBUTE_HTTP_CACHE`) to `true`. Only `GET` requests are cached; any other method gets a no-cache response.

```php
#[Route(
    path: '/detail/{productId}',
    name: ProductPageSeoUrlRoute::ROUTE_NAME, // 'frontend.detail.page'
    defaults: [PlatformRequest::ATTRIBUTE_HTTP_CACHE => true],
    methods: [Request::METHOD_GET]
)]
public function index(SalesChannelContext $context, Request $request): Response
```

**Cache key / `cache-hash`** — Shopware computes a hash over cache-relevant context (matched rules, currency, tax state, logged-in state) and transports it as the `sw-cache-hash` cookie and header. The cookie is only set once the state differs from the default (no logged-in customer, default currency, empty cart). Clients must send the latest value on every request because the cache is resolved before Shopware handles the request. Plugins can influence the hash (see `platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md`).

**Vary** — every sales-channel response gets `sw-language-id` and `sw-currency-id` headers, and `Vary` is extended with the access key, language id, currency id, include-SEO-URLs header and `sw-cache-hash`.

**TTL / Cache-Control** — resolved by HTTP caching policies (`platform/dev/6.7/guides/hosting/performance/caches.md`); experimental in 6.7, default from 6.8.0.0.

**Invalidation logging** (since 6.7.7.0, default off):

```yaml
# config/packages/shopware.yaml
shopware:
  cache:
    invalidation:
      tag_invalidation_log_enabled: false
```

**Response workflow** (6.8.0.0, or 6.7.6.0+ with `CACHE_REWORK` enabled) in `CacheResponseSubscriber`:

1. Apply `sw-language-id`/`sw-currency-id` headers and extend `Vary`.
2. Early exits: HTTP cache disabled, maintenance mode, 404 responses.
3. Calculate the cache hash (also for POST, so the client gets the updated hash).
4. Non-`GET` request or no `_httpCache` attribute: no-cache policy.
5. If dynamic calculation says not cacheable, or the client's `sw-cache-hash` (header or cookie) does not match the server hash: `sw-dynamic-cache-bypass: 1` plus no-cache policy. This prevents cache poisoning and lets proxies use short "hit-for-pass" TTLs (custom proxy config required).
6. Resolve the caching policy for the route/area and set `Cache-Control`.

## Essential identifiers

- `_httpCache` / `PlatformRequest::ATTRIBUTE_HTTP_CACHE`
- `sw-cache-hash` / `HttpCacheKeyGenerator::CONTEXT_CACHE_COOKIE`
- `sw-dynamic-cache-bypass` / `HttpCacheKeyGenerator::HEADER_DYNAMIC_CACHE_BYPASS`
- `CacheResponseSubscriber` (`Shopware\Core\Framework\Adapter\Cache\Http`)
- `CACHE_REWORK` feature flag
- `shopware.cache.invalidation.tag_invalidation_log_enabled`

## Gotchas

- Storefront controller routes are invalidated through the cache tags of the Store API routes they call; an HTTP cache entry carries the sum of all Store API tags collected during the request.
- List-type routes (product listings, search, category listings, SEO URL listings) are not tagged with every returned entity; they rely on the policy TTL and can be briefly stale. Configure a custom caching policy if the default TTL does not fit.
- Keep the number of `cache-hash` permutations low to keep hit rates high.
- Without `CACHE_REWORK`/6.8, Store API routes marked `_httpCache` still receive no-cache headers.

## Version notes

- `sw-currency` cookie: deprecated, removed in 6.8.0.0 (currency is part of `sw-cache-hash`).
- `sw-states` cookie and the `sw-invalidation-states` response header (tags like `logged-in`, `cart-filled` that skip the cache): deprecated, removed in 6.8.0.0. With `CACHE_REWORK` states are always empty, so pages are cached for logged-in customers and filled carts too.
- The docs' workflow names `sw-context-hash` as the compared/varied hash; in 6.7.15.1 that header constant is deprecated and the code compares and varies on `sw-cache-hash`.

## Code check (6.7.15.1)
- confirmed `_httpCache` — value of `ATTRIBUTE_HTTP_CACHE` — vendor/shopware/core/PlatformRequest.php:82
- confirmed `PlatformRequest::ATTRIBUTE_HTTP_CACHE` — route default on the product detail route — vendor/shopware/storefront/Controller/ProductController.php:59
- confirmed `sw-cache-hash` — transported as cookie/header, part of Vary — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheVariantHeaders.php:23
- deprecated `sw-currency` — `CURRENCY_COOKIE` tagged v6.8.0 removal — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:26
- deprecated `sw-states` — `SYSTEM_STATE_COOKIE` tagged v6.8.0 removal — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:31
- deprecated `sw-invalidation-states` — `INVALIDATION_STATES_HEADER` tagged v6.8.0 removal — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:35
- deprecated `sw-context-hash` — docs present it as the compared hash; code compares `sw-cache-hash` — vendor/shopware/core/PlatformRequest.php:65
- confirmed `sw-dynamic-cache-bypass` — hint header for hit-for-pass objects — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:41
- confirmed `CACHE_REWORK` — gates the client/server hash comparison — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:179
- confirmed `tag_invalidation_log_enabled` — default false — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:677
