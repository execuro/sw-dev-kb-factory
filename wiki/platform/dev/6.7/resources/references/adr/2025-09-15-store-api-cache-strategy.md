---
id: platform/dev/6.7/resources/references/adr/2025-09-15-store-api-cache-strategy.md
title: Caching Strategy for Store API
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-09-15-store-api-cache-strategy.html
sourceHash: 8556e03fbc732190e51fa54482d144eee066db3d
codeCheckedAgainst: "6.7.15.1"
keywords: ["store api cache", "http cache", "_criteria", "_httpCache", "CacheResponseSubscriber", "RequestCriteriaBuilder", "CompressedCriteriaDecoder", "sw-currency-id", "sw-language-id", "sw-cache-hash", "vary header", "cache-control", "headless caching", "reverse proxy"]
summary: "ADR: Store API HTTP caching via GET routes, gzip+base64url _criteria param, context headers + Vary, _httpCache route flag and cache tags."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2025-09-15) defining how Store API responses become cacheable by reverse proxies and CDNs, reusing the Storefront HTTP cache approach (route flag, `Cache-Control`, cache-tag invalidation) but differentiating contexts by request headers instead of cookies.

## When to use

- You build a headless client and want Store API responses served from Varnish/a CDN.
- You write a custom Store API route and want it to opt into HTTP caching.
- You need to send a Criteria object on a `GET` request.

## Key steps / config

1. **HTTP methods** — prefer `GET` for non-mutating endpoints returning non-sensitive data; endpoints that use `POST` only for large Criteria payloads get `GET` support added. `POST` responses are never cached (`CacheResponseSubscriber` applies the uncacheable policy to any non-`GET` request).
2. **`_criteria` query parameter** — the whole Criteria as one parameter, encoded JSON -> gzip -> base64url. Decoded by `RequestCriteriaBuilder` and, for product listings, `CompressedCriteriaListingProcessor`. The decoder caps the compressed string at 128 KB and the decompressed payload at 20x that. SDKs should canonicalise (stable key order, normalised arrays) to raise the hit ratio. Separate parameters (`filter`, `grouping`, `fields`, `page`, `limit`) get a phase-out plan.
3. **Context headers** — `sw-currency-id` and `sw-language-id` switch currency/language for the request; the remaining context (customer, active rules) is carried by the cache hash, `sw-cache-hash` in the installed code. Clients resend the values returned in responses to hit the cache.
4. **Mark cacheable routes** — set the `_httpCache` route default (`PlatformRequest::ATTRIBUTE_HTTP_CACHE`). Extensions use the same flag for custom Store API routes.
5. **Cache-Control** — in the installed code, the policy comes from `shopware.http_cache.default_policies.store_api`:

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

6. **Invalidation** — existing cache tags (Varnish `x-tag`) are reused.

## Essential identifiers

- `_criteria`, `_httpCache` (`PlatformRequest::ATTRIBUTE_HTTP_CACHE`)
- `CacheResponseSubscriber`, `RequestCriteriaBuilder`, `CompressedCriteriaDecoder`
- `sw-currency-id` (`PlatformRequest::HEADER_CURRENCY_ID`), `sw-language-id` (`PlatformRequest::HEADER_LANGUAGE_ID`), `sw-cache-hash`
- `store_api.cacheable`, `no_cache_private`
- `Cache-Control: public, max-age=0, s-maxage=1800, stale-while-revalidate=86400, stale-if-error=7200` (cacheable), `no-cache, private` (non-cacheable)

## Gotchas

- The ADR names `sw-context-hash` for the non-currency/language context; in 6.7.15.1 `PlatformRequest::HEADER_CONTEXT_HASH` is deprecated for v6.8.0 in favour of `HttpCacheKeyGenerator::CONTEXT_CACHE_COOKIE` (`sw-cache-hash`).
- The ADR says `Vary` lists three headers; the installed `HttpCacheVariantHeaders::HEADERS` emits `sw-access-key`, `sw-language-id`, `sw-currency-id`, `sw-include-seo-urls` and `sw-cache-hash`.
- Store API caching is applied only when the `CACHE_REWORK` feature flag (or `v6.8.0.0`) is active; otherwise Store API responses stay uncached even on `_httpCache` routes.
- `sw-currency-id`/`sw-language-id` change the response currency and language — clients must expect that.
- Compressed `_criteria` is harder to read in logs; without canonicalisation the cache hit ratio drops. Operators may need minor reverse-proxy adjustments.
- Rejected alternatives: cookies for context, caching `POST`, a POST-hash-then-GET flow, plain structured query parameters.

## Version notes

- Update 2026-09-29: `_criteria` is a compressed form of the full query string on every Store API `GET` route. It may hold any route query parameter, and a field inside it wins over a plain query parameter of the same name, so a `GET` reads the same fields as the equivalent `POST` body. Exception: fields a route reads only from the `POST` body (e.g. listing filter flags).

## Code check (6.7.15.1)
- confirmed `_httpCache` — route attribute constant `ATTRIBUTE_HTTP_CACHE` — vendor/shopware/core/PlatformRequest.php:82
- confirmed `sw-currency-id` — `HEADER_CURRENCY_ID` — vendor/shopware/core/PlatformRequest.php:21
- confirmed `sw-language-id` — `HEADER_LANGUAGE_ID` — vendor/shopware/core/PlatformRequest.php:20
- deprecated `sw-context-hash` — `HEADER_CONTEXT_HASH`, deprecated tag:v6.8.0, use `CONTEXT_CACHE_COOKIE` — vendor/shopware/core/PlatformRequest.php:65
- corrected `HttpCacheVariantHeaders::HEADERS` — docs: Vary holds the three context headers; code lists five incl. `sw-cache-hash` — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheVariantHeaders.php:25
- confirmed `_criteria` — read by `RequestCriteriaBuilder` from the query — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:80
- confirmed `CompressedCriteriaDecoder::decode()` — json_encode -> gzip -> base64url, 128 KB limit — vendor/shopware/core/Framework/DataAbstractionLayer/Search/CompressedCriteriaDecoder.php:49
- confirmed `CacheResponseSubscriber` — Store API area uncached unless `CACHE_REWORK`/v6.8.0.0 active — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:31
- confirmed `store_api.cacheable` — public, max_age 0, s_maxage 1800, swr 86400, sie 7200 as the ADR specifies — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:150
- confirmed `no_cache_private` — uncacheable Store API default — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:183
