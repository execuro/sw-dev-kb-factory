---
id: platform/dev/6.7/resources/references/adr/2025-09-15-store-api-cache-strategy.md
title: Caching Strategy for Store API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-09-15-store-api-cache-strategy.html
sourceHash: b8b39193370c295a0b6615657356b2d49b0c734c
codeCheckedAgainst: "6.7.13.0"
keywords: ["store api cache", "http cache", "_criteria", "_httpCache", "sw-currency-id", "sw-language-id", "sw-cache-hash", "CacheResponseSubscriber", "RequestCriteriaBuilder", "store_api.cacheable", "CACHE_REWORK", "vary header", "reverse proxy", "headless"]
summary: "ADR: Store API caching via GET, gzip+base64url _criteria param, context headers + Vary, _httpCache routes; code gates it behind CACHE_REWORK."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2025-09-15) defining how Store API responses become cacheable by reverse proxies/CDNs for headless setups, reusing the Storefront HTTP cache approach (route flag, cache tags) but differentiating contexts with request/response headers instead of cookies.

## When to use

- Building a headless client or SDK that should hit a reverse-proxy cache for Store API reads.
- Making a custom Store API route cacheable.
- Configuring Varnish/CDN rules for Store API responses.

## Key steps / config

1. **HTTP methods**: prefer `GET` for non-mutating endpoints returning non-sensitive data; add `GET` to such endpoints that only support `POST`. Only `GET` responses get cache headers.
2. **Criteria as one query parameter**: `_criteria` = base64url(gzip(JSON Criteria)). `RequestCriteriaBuilder` checks `_criteria` before separate params (`filter`, `grouping`, `fields`, `page`, `limit`), which are to be phased out. The decoder rejects strings over 128 KB. SDKs should canonicalize (stable key order, normalized arrays) and fall back to `POST` when the URL gets too long.
3. **Context headers**: responses carry `sw-language-id` and `sw-currency-id`; sending them back switches language/currency of the response. The context hash is returned as `sw-cache-hash` (header and cookie); a client hash that does not match the expected one bypasses the cache. `Vary` is extended with the access key header, `sw-language-id`, `sw-currency-id` and `sw-cache-hash`.
4. **Mark cacheable routes** with the `_httpCache` route default (`PlatformRequest::ATTRIBUTE_HTTP_CACHE => true`), as core product listing/search/detail routes do. Extensions opt in the same way.
5. **Cache-Control policies** (`shopware.yaml`):

```yaml
shopware:
    http_cache:
        policies:
            store_api.cacheable:
                headers:
                    cache_control: { public: true, max_age: 0, s_maxage: 1800, stale_while_revalidate: 86400, stale_if_error: 7200 }
        default_policies:
            store_api: { cacheable: store_api.cacheable, uncacheable: no_cache_private }
```

6. **Invalidation** reuses existing cache tags.

## Essential identifiers

- `_criteria`, `_httpCache`
- `sw-language-id`, `sw-currency-id`, `sw-cache-hash`
- `Shopware\Core\Framework\Adapter\Cache\Http\CacheResponseSubscriber`
- `Shopware\Core\Framework\Adapter\Cache\Http\CacheHeadersService`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\RequestCriteriaBuilder`
- `store_api.cacheable`, `no_cache_private`
- `CACHE_REWORK` (feature flag)

## Gotchas

- In 6.7.13.0 Store API cache headers are applied only when feature flag `CACHE_REWORK` (default `false`) or `v6.8.0.0` is active; otherwise Store API responses stay no-cache.
- The ADR names the context header `sw-context-hash`; that constant is deprecated for 6.8.0 in code, which uses `sw-cache-hash` instead.
- Compressed `_criteria` is hard to read in logs; without canonicalization cache hit ratio drops.
- Clients must expect `sw-currency-id`/`sw-language-id` to change response currency/language.
- Storefront keeps `Cache-Control: no-cache, private` client-side; `public` directives target the reverse proxy.

## Version notes

- Rejected alternatives: cookie-based context (as in Storefront), caching `POST`, a two-step POST-hash/GET flow, and plain structured query params.

## Code check (6.7.13.0)
- confirmed `_criteria` — parsed before separate criteria params — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:80
- confirmed `CompressedCriteriaDecoder::decode()` — base64url, gzip, JSON; 128 KB limit — vendor/shopware/core/Framework/DataAbstractionLayer/Search/CompressedCriteriaDecoder.php:49
- confirmed `sw-language-id` — response header and Vary entry — vendor/shopware/core/PlatformRequest.php:20
- confirmed `sw-currency-id` — response header and Vary entry — vendor/shopware/core/PlatformRequest.php:21
- deprecated `sw-context-hash` — HEADER_CONTEXT_HASH deprecated tag:v6.8.0 — vendor/shopware/core/PlatformRequest.php:65
- corrected `sw-cache-hash` — docs: context hash header `sw-context-hash` — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:27
- confirmed `CacheHeadersService::applyCacheHeaders()` — sets language/currency headers and Vary — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheHeadersService.php:38
- confirmed `_httpCache` — route default attribute name — vendor/shopware/core/PlatformRequest.php:80
- confirmed `store_api.cacheable` — s_maxage 1800, stale_while_revalidate 86400, stale_if_error 7200 — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:149
- confirmed `CACHE_REWORK` — Store API caching skipped unless flag or v6.8.0.0 active — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:119
