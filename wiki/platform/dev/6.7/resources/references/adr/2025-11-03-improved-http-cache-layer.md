---
id: platform/dev/6.7/resources/references/adr/2025-11-03-improved-http-cache-layer.md
title: Improved HTTP Cache Layer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-11-03-improved-http-cache-layer.html
sourceHash: c8d1e85c3fb40fcc7ccd21a3a3e8efbdd9fc6109
codeCheckedAgainst: "6.7.15.1"
keywords: ["http cache", "CACHE_REWORK", "sw-cache-hash", "cache policies", "shopware.http_cache.policies", "default_policies", "route_policies", "rule areas", "ResolveCacheRelevantRuleIdsExtension", "vary header", "reverse proxy", "store api cache", "cache-control", "varnish"]
summary: "ADR: HTTP cache rework behind CACHE_REWORK: product-area rule ids in cache hash, configurable cache-control policies, sw-cache-hash only, Store API caching."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2025-11-03) reworking Shopware's HTTP cache layer: fewer cache permutations, cache-control policies moved into configuration, a reverse-proxy contract reduced to a single `sw-cache-hash` value, and HTTP caching for the Store API. All changes are opt-in via the `CACHE_REWORK` feature flag.

## When to use

- You configure Varnish/Fastly or another reverse proxy in front of Shopware.
- You tune `Cache-Control` headers per area or per route.
- Your customisation depends on caching being off for logged-in customers, filled carts or Store API routes — this rework changes that.

## Key steps / config

1. **Enable**: activate the `CACHE_REWORK` feature flag (toggleable, default `false`; always on with `v6.8.0.0`).
2. **Cache-relevant rule ids only** — the cache hash includes only rule ids used in specific rule areas; the default is the product area (`RuleAreas::PRODUCT_AREA`). Extend the list through the `ResolveCacheRelevantRuleIdsExtension` extension point (name `cache-response.resolve-rule-areas`, public `$ruleAreas` property).
3. **Configurable policies** under `shopware.http_cache` — named policies, per-area defaults (`storefront`, `store_api`) for cacheable/uncacheable responses, and route-level overrides:

```yaml
shopware:
  http_cache:
    policies:
      storefront.cacheable:
        headers:
          cache_control: { public: true, max_age: 0, must_revalidate: true, s_maxage: 7200 }
    default_policies:
      storefront: { cacheable: storefront.cacheable, uncacheable: no_cache_private }
      store_api: { cacheable: store_api.cacheable, uncacheable: no_cache_private }
    route_policies:
      <route.name>: <policy name>
```

Policy resolution order: route with modifier (`route#modifier`, for script hooks) -> route-level policy -> area default; `_httpCache` attribute values (max-age, s-maxage) override only area defaults.

4. **Reverse proxy contract** — responses carry the hash as header, cookie and `Vary` entry:

```
sw-cache-hash: theHash
vary: sw-cache-hash
set-cookie: sw-cache-hash=theHash;
```

The only Shopware-specific proxy rule: copy the `sw-cache-hash` cookie into the `sw-cache-hash` request header.

5. **Store API** — cached with the same patterns and configuration as the Storefront; routes gain `GET` support where it makes sense, and clients should prefer `GET` (see the separate Store API caching ADR).

## Essential identifiers

- `CACHE_REWORK`
- `sw-cache-hash` (`HttpCacheKeyGenerator::CONTEXT_CACHE_COOKIE`)
- `shopware.http_cache.policies`, `shopware.http_cache.default_policies`, `shopware.http_cache.route_policies`
- `storefront.cacheable`, `store_api.cacheable`, `no_cache_private`
- `ResolveCacheRelevantRuleIdsExtension`, `RuleAreas::PRODUCT_AREA`
- `CacheResponseSubscriber`, `CachePolicyProvider`

## Gotchas

- Breaking: removing the state header means Storefront pages for logged-in customers and filled carts are cached by default. Customer-specific template content must move to async calls to uncached routes.
- Breaking: rules outside the configured rule areas no longer influence the cache hash.
- Breaking: Store API routes are cached by default; clients must pass the cache hash header or cookie, otherwise wrong cached data can be returned. The installed code bypasses the cache when the client hash does not match the expected one.
- The ADR announces "a new event" for modifying rule areas; in 6.7.15.1 it is the extension point `ResolveCacheRelevantRuleIdsExtension`.
- Previous limitations: only Storefront cached, all rule ids in the hash, complex proxy configs (only Fastly and Varnish supported), hard-coded cache-control values.

## Version notes

- 6.7: opt in with `CACHE_REWORK`. The checks treat `v6.8.0.0` as enabling the same behaviour.

## Code check (6.7.15.1)
- confirmed `CACHE_REWORK` — read via `Feature::isActive('CACHE_REWORK')` to enable Store API caching — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheResponseSubscriber.php:125
- confirmed `sw-cache-hash` — variant header, cookie/header transport — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheVariantHeaders.php:23
- confirmed `HttpCacheKeyGenerator::CONTEXT_CACHE_COOKIE` — set as response header — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheHeadersService.php:76
- confirmed `HttpCacheVariantHeaders::HEADERS` — merged into `Vary` — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheHeadersService.php:43
- corrected `ResolveCacheRelevantRuleIdsExtension` — docs: new event; code: extension `cache-response.resolve-rule-areas` — vendor/shopware/core/Framework/Adapter/Cache/Http/Extension/ResolveCacheRelevantRuleIdsExtension.php:18
- confirmed `RuleAreas::PRODUCT_AREA` — default cache-relevant rule area — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheRelevantRulesResolver.php:31
- confirmed `shopware.http_cache.policies` — policy definitions — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:141
- confirmed `default_policies` — per-area defaults, only storefront/store_api — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1383
- confirmed `route_policies` — route-level overrides — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1408
- confirmed `CachePolicyProvider::getPolicy()` — route#modifier, route, area-default priority — vendor/shopware/core/Framework/Adapter/Cache/Http/CachePolicyProvider.php:42
