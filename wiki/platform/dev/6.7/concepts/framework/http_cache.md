---
id: platform/dev/6.7/concepts/framework/http_cache.md
title: HTTP Cache
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/http_cache.html
sourceHash: 8921442921cf10a88c1edd02d1b794726daf1c05
codeCheckedAgainst: "6.7.13.0"
keywords: ["http cache", "reverse proxy", "varnish", "_httpCache", "sw-cache-hash", "sw-currency", "sw-states", "CacheResponseSubscriber", "tag_invalidation_log_enabled", "CACHE_REWORK", "sw-dynamic-cache-bypass", "cache invalidation", "cache tags", "caching policy"]
summary: Shopware HTTP cache - _httpCache route default, sw-cache-hash cache key, deprecated cookies, tag invalidation, CACHE_REWORK response flow.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md", "platform/dev/6.7/guides/hosting/performance/caches.md"]
---
## What it is

Concept page for Shopware's HTTP (full-page) cache: a reverse proxy layer (Symfony HTTP cache, Varnish, Fastly) between user and application that stores responses, how Shopware decides whether a response is cacheable, how the cache key reflects customer state via the `sw-cache-hash` cookie, and how entries are invalidated through cache tags.

## When to use

- Marking your own Storefront or Store API route as cacheable.
- Debugging why a page is served stale, not cached, or cached for the wrong customer state.
- Configuring a reverse proxy that must honour Shopware's cache key.
- Deciding how listing routes are invalidated (TTL vs. tags). Plugin-side control of the hash is in `platform/dev/6.7/guides/plugins/plugins/framework/caching/_index.md`; TTL policies in `platform/dev/6.7/guides/hosting/performance/caches.md`.

## Key steps / config

**Make a route cacheable** — set route default `_httpCache` (constant `PlatformRequest::ATTRIBUTE_HTTP_CACHE`) to `true`. Only `GET` requests are cached. Core example in the Storefront `ProductController`:

```php
#[Route(
    path: '/detail/{productId}',
    name: 'frontend.detail.page',
    defaults: [PlatformRequest::ATTRIBUTE_HTTP_CACHE => true],
    methods: [Request::METHOD_GET]
)]
public function index(SalesChannelContext $context, Request $request): Response
```

**Cache key** — Shopware computes a hash of cache-relevant state (logged-in, tax state, currency, matched cache-relevant rules) and sends it as the `sw-cache-hash` cookie (and response header). It is set once state differs from the default (no customer, default currency, empty cart). Clients must send the latest value on every request, because the cache is resolved before Shopware handles the request; proxies include it in their cache key. Keep permutations low to maximise hits.

**Invalidation logging** (since 6.7.7.0, default off):

```yaml
# <shopware-root>/config/packages/shopware.yaml
shopware:
  cache:
    invalidation:
      tag_invalidation_log_enabled: false
```

**Invalidation model** — cached responses are tagged with all cache tags generated or loaded during the request; Storefront pages inherit tags from the Store API routes they call, so Store API invalidation drives Storefront invalidation. List-type routes (product listing/search, category listing, SEO URL listing) are not tagged with every returned entity; they expire by the TTL of the active HTTP caching policy — configure a custom policy if defaults do not fit.

**Response workflow with `CACHE_REWORK` or v6.8** — `CacheResponseSubscriber` in 6.7.13.0:

1. `CacheHeadersService` sets `sw-language-id` and `sw-currency-id` response headers and extends `Vary` with `sw-access-key`, `sw-language-id`, `sw-currency-id` and `sw-cache-hash`.
2. Early exits (HTTP cache disabled, maintenance, 404 → no-cache).
3. Computes and applies the cache hash for every request, including POST, so the client's cookie stays current; extensions can add parameters.
4. Non-`GET` or no `_httpCache` attribute → no-cache policy.
5. If dynamic calculation says not cacheable → sets `sw-dynamic-cache-bypass: 1` and no-cache.
6. Compares the client hash (header `sw-cache-hash`, else cookie) with the server hash; on mismatch sets `sw-dynamic-cache-bypass` and applies no-cache, preventing cache poisoning.
7. Resolves the caching policy for the route and sets `Cache-Control`.

## Essential identifiers

- `_httpCache` / `PlatformRequest::ATTRIBUTE_HTTP_CACHE`
- `sw-cache-hash` / `HttpCacheKeyGenerator::CONTEXT_CACHE_COOKIE`
- `sw-language-id`, `sw-currency-id` response headers
- `sw-dynamic-cache-bypass` / `HttpCacheKeyGenerator::HEADER_DYNAMIC_CACHE_BYPASS`
- `CacheResponseSubscriber`, `CacheHeadersService`
- `shopware.cache.invalidation.tag_invalidation_log_enabled`
- Feature flag `CACHE_REWORK`

## Gotchas

- The docs call the compared/`Vary` value `sw-context-hash`; in 6.7.13.0 the HTTP cache code uses `sw-cache-hash` for both the `Vary` entry and the hash comparison. `PlatformRequest::HEADER_CONTEXT_HASH` (`sw-context-hash`) exists but is not what `CacheResponseSubscriber` checks.
- Cookie `sw-currency` is deprecated (removed in 6.8.0.0); currency is already part of `sw-cache-hash`. It was set when a guest with empty cart changed currency.
- Cookie `sw-states` and header `sw-invalidation-states` are deprecated (removed in 6.8.0.0). Old behaviour: session tags like `cart-filled`/`logged-in` matching the response's invalidation states skip the cache. With `CACHE_REWORK`/`PERFORMANCE_TWEAKS`/v6.8 states are always empty.
- Without `CACHE_REWORK`/v6.8, Store API routes marked `_httpCache` still get no-cache headers.
- Listing pages accept some staleness: no strict immediate consistency.
- `hit-for-pass` handling based on `sw-dynamic-cache-bypass` needs custom proxy configuration.

## Version notes

- `CACHE_REWORK` (default `false`, "Experimental!") enables the workflow above and caching policies; per docs available since 6.7.6.0 and default from 6.8.0.0. It also removes cache states and caches pages for logged-in customers/filled carts by default.
- `tag_invalidation_log_enabled` since 6.7.7.0.
- `sw-currency`, `sw-states`, `sw-invalidation-states` removed in 6.8.0.0.

## Code check (6.7.13.0)
- confirmed `PlatformRequest::ATTRIBUTE_HTTP_CACHE` — value `_httpCache` — vendor/shopware/core/PlatformRequest.php:80
- confirmed `frontend.detail.page` — route default uses ATTRIBUTE_HTTP_CACHE, GET only — vendor/shopware/storefront/Controller/ProductController.php:57
- corrected `HttpCacheKeyGenerator::CONTEXT_CACHE_COOKIE` — docs: client `sw-context-hash` is compared; code compares `sw-cache-hash` header/cookie — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:174
- corrected `PlatformRequest::HEADER_CURRENCY_ID` — docs: Vary gets `sw-context-hash`; code adds access key, language, currency ids and `sw-cache-hash` — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheHeadersService.php:46
- deprecated `HttpCacheKeyGenerator::CURRENCY_COOKIE` — `sw-currency`, removed in v6.8.0 — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:26
- deprecated `HttpCacheKeyGenerator::SYSTEM_STATE_COOKIE` — `sw-states`, removed in v6.8.0 — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:31
- deprecated `HttpCacheKeyGenerator::INVALIDATION_STATES_HEADER` — `sw-invalidation-states`, removed in v6.8.0 — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:35
- confirmed `HttpCacheKeyGenerator::HEADER_DYNAMIC_CACHE_BYPASS` — value `sw-dynamic-cache-bypass` — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:41
- confirmed `tag_invalidation_log_enabled` — boolean, default false — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:759
- confirmed `CACHE_REWORK` — toggleable flag, default false, read by cache subscribers — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:64
