---
id: platform/dev/6.7/resources/references/adr/2025-11-03-improved-http-cache-layer.md
title: Improved HTTP Cache Layer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-11-03-improved-http-cache-layer.html
sourceHash: c8d1e85c3fb40fcc7ccd21a3a3e8efbdd9fc6109
codeCheckedAgainst: "6.7.13.0"
keywords: ["CACHE_REWORK", "sw-cache-hash", "http_cache.policies", "default_policies", "route_policies", "ResolveCacheRelevantRuleIdsExtension", "RuleAreas::PRODUCT_AREA", "vary header", "http cache", "reverse proxy", "store-api caching", "cache-control", "varnish", "fastly"]
summary: "ADR (2025-11-03): HTTP cache rework behind CACHE_REWORK - product-area rules in sw-cache-hash, configurable cache-control policies, Store-API caching."
lastBuilt: 2026-09-15
---
## What it is

Core ADR reworking the HTTP cache layer. Previously only storefront requests were cached, all matched rule ids went into the cache hash (low hit rate; caching disabled once the cart was filled or a customer logged in), reverse proxy configuration was complex, and `cache-control` values were hard-coded. The rework is opt-in via the `CACHE_REWORK` feature flag.

## When to use

- Setting up or debugging HTTP caching for storefront or headless (Store-API) projects on 6.7 with `CACHE_REWORK` enabled.
- Configuring a reverse proxy (Varnish, Fastly or others) for the reworked cache.

## Key steps / config

1. Enable the `CACHE_REWORK` feature flag (default `false`, toggleable, experimental).
2. Only cache-relevant rule ids enter the hash: by default rules used in the `product` rule area (`RuleAreas::PRODUCT_AREA`). Extend the area list via the extension point `ResolveCacheRelevantRuleIdsExtension` (name `cache-response.resolve-rule-areas`, public property `ruleAreas`).
3. Configure cache policies instead of hard-coded headers:

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

   `default_policies` accepts only the areas `storefront` and `store_api`; `route_policies` (route name to policy name) overrides the default per route.
4. Reverse proxy: the only application state to respect is `sw-cache-hash`, sent as header, cookie and in `Vary`:

```
sw-cache-hash: theHash
vary: sw-cache-hash
set-cookie: sw-cache-hash=theHash;
```

   The only Shopware-specific proxy rule: set the `sw-cache-hash` request header from the `sw-cache-hash` cookie.
5. Store-API: cached with the same patterns and configuration as the storefront; routes support `GET` where sensible and clients should prefer `GET` and pass the hash as header or cookie.

## Essential identifiers

- `CACHE_REWORK` (feature flag)
- `sw-cache-hash` (`HttpCacheKeyGenerator::CONTEXT_CACHE_COOKIE`)
- `shopware.http_cache.policies`, `shopware.http_cache.default_policies`, `shopware.http_cache.route_policies`
- `ResolveCacheRelevantRuleIdsExtension` / `cache-response.resolve-rule-areas`
- `RuleAreas::PRODUCT_AREA`

## Gotchas

- Breaking: storefront pages for logged-in customers and filled carts are cached; load user-specific content asynchronously from uncached routes.
- Breaking: rules outside the cache-relevant rule areas no longer influence the cache hash.
- Breaking: Store-API routes are cached by default; clients not sending the hash may get wrong cached data.
- The ADR speaks of "a new event" for rule areas; the installed code uses an extension point (see Code check).

## Version notes

- 6.7: opt-in via `CACHE_REWORK`; in code the new paths also activate with the `v6.8.0.0` flag.

## Code check (6.7.13.0)
- confirmed `CACHE_REWORK` — feature flag, default false, toggleable, read via Feature::isActive — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:64
- confirmed `HttpCacheKeyGenerator::CONTEXT_CACHE_COOKIE` — value `sw-cache-hash` — vendor/shopware/core/Framework/Adapter/Cache/Http/HttpCacheKeyGenerator.php:27
- confirmed `CacheHeadersService::applyCacheHash()` — sets sw-cache-hash cookie and response header — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheHeadersService.php:54
- confirmed `CONTEXT_CACHE_COOKIE` — added to the response Vary list — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheHeadersService.php:47
- corrected `ResolveCacheRelevantRuleIdsExtension` — docs: a new event modifies relevant rule areas — vendor/shopware/core/Framework/Adapter/Cache/Http/Extension/ResolveCacheRelevantRuleIdsExtension.php:16
- confirmed `RuleAreas::PRODUCT_AREA` — default cache-relevant rule area — vendor/shopware/core/Framework/Adapter/Cache/Http/CacheRelevantRulesResolver.php:31
- confirmed `policies` — http_cache policies with cache_control options — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1309
- confirmed `default_policies` — only storefront and store_api areas allowed — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1338
- confirmed `route_policies` — route name to policy name map — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1363
- confirmed `store_api.cacheable` — shipped default policy, s_maxage 1800 — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:149
