---
id: platform/dev/6.7/guides/hosting/performance/caches.md
title: Cache
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/caches.html
sourceHash: ecf1b78ea4cbea0f6cfd600df11b5838b10c8824
codeCheckedAgainst: "6.7.13.0"
keywords: ["SHOPWARE_HTTP_CACHE_ENABLED", "CACHE_REWORK", "http_cache", "policies", "default_policies", "route_policies", "cache_control", "cache.adapter.redis_tag_aware", "volatile-lru", "http cache", "caching policy", "redis cache", "cache tags", "orphaned tags", "OOM"]
summary: "Shopware HTTP cache env vars, CACHE_REWORK caching policies (policies/default_policies/route_policies), Redis cache pools and pruning orphaned cache tags."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md"]
---
## What it is

Overview of Shopware's caches for hosting: enabling the HTTP cache, configuring HTTP caching policies, swapping the cache storage (filesystem to Redis), and diagnosing Redis OOM errors caused by cache tag index keys without a TTL.

## When to use

Setting up a production system (the HTTP cache is a must-have), tuning `Cache-Control` per area or route, moving the app cache to Redis for multi-server setups, or investigating a cache Redis that throws OOM errors despite `volatile-lru`.

## Key steps / config

**Enable the HTTP cache** in `.env.local`: `SHOPWARE_HTTP_CACHE_ENABLED=1`. HTTP cache storage is always the app cache pool; to move it out, use a reverse proxy such as Varnish or Fastly (see [reverse HTTP cache](platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md)).

**HTTP caching policies** (experimental; enable feature flag `CACHE_REWORK`; default in 6.8). Shipped policies: `storefront.cacheable`, `store_api.cacheable`, `no_cache_private`; shipped defaults map `storefront`/`store_api` `cacheable` to their `*.cacheable` policy and `uncacheable` to `no_cache_private`.

```yaml
# config/packages/shopware.yaml
shopware:
  http_cache:
    policies:
      custom_policy:
        headers:
          cache_control: { public: true, max_age: 600, s_maxage: 3600 }
    default_policies:
      store_api: { cacheable: custom_policy }   # areas: storefront, store_api
    route_policies:
      store-api.product.search: custom_policy
      frontend.script_endpoint#storefront-acme-feature: custom_policy
```

- `cache_control` directives: `public`, `private`, `no_cache`, `no_store`, `no_transform`, `must_revalidate`, `proxy_revalidate`, `immutable`, `max_age`, `s_maxage`, `stale_while_revalidate`, `stale_if_error`. Only the `cache_control` header is configurable.
- Redefining a policy replaces it entirely (no merging).
- `route#hook` keys target script endpoints by normalized hook name; app scripts can also override TTLs of default policies (see [custom endpoints](platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md)).
- Precedence: `route_policies[route#hook]` > `route_policies[route]` > `default_policies[area].{cacheable|uncacheable}`; TTL overrides from the request attribute/script config apply only at the area-default stage.

**Cache storage**: default app pool is `cache.adapter.filesystem` (`var/cache`), a Symfony cache pool, so any FrameworkBundle adapter works. For Redis (requires the PHP Redis extension; `cache.adapter.redis_tag_aware` needs 6.5.8.3+, otherwise `cache.adapter.redis`):

```yaml
# config/packages/cache.yaml
framework:
  cache:
    app: cache.adapter.redis_tag_aware
    system: cache.adapter.redis_tag_aware
    default_redis_provider: redis://localhost
```

DSN forms: `redis://localhost:6379`, `redis://auth@localhost:6379`, `redis://localhost:6379/1`, `redis://localhost:6379?timeout=1`, `redis:///var/run/redis.sock`, `redis://auth@/var/run/redis.sock`. No persistence needed; eviction policy `volatile-lru`.

**Orphaned cache tags**: Symfony's tag index keeps a Redis set per tag (key names contain `\x01tags\x01`) with no TTL; expired items leave orphaned members. Diagnose with `redis-cli INFO keyspace` (`keys` minus `expires` = persistent keys). Prune on a schedule (e.g. nightly cron) with FroshTools `frosh:redis-tag:cleanup`, or `shopware-redis-cli-helper --url <dsn> insights`, `... cleanup` (dry run), `... cleanup --apply`.

## Essential identifiers

- `SHOPWARE_HTTP_CACHE_ENABLED`, feature flag `CACHE_REWORK`
- `shopware.http_cache.policies`, `shopware.http_cache.default_policies`, `shopware.http_cache.route_policies`
- `storefront.cacheable`, `store_api.cacheable`, `no_cache_private`
- `cache.adapter.filesystem`, `cache.adapter.redis_tag_aware`, `cache.adapter.redis`, `framework.cache.default_redis_provider`
- `frosh:redis-tag:cleanup`, `shopware-redis-cli-helper`

## Gotchas

- Every policy name referenced in `default_policies` or `route_policies` must be defined under `shopware.http_cache.policies`, or container config validation fails; `default_policies` accepts only `storefront` and `store_api`.
- A full cache Redis is healthy; OOM errors (`OOM command not allowed when used memory > 'maxmemory'`) under `volatile-lru` mean too many no-TTL keys. Raising `maxmemory` only postpones it; a one-off cleanup does not stay fixed.

## Version notes

- `SHOPWARE_HTTP_DEFAULT_TTL` (default TTL env var) is deprecated and removed in 6.8.0.0; use caching policies instead.
- Caching policies become default behaviour in 6.8.0.0.

## Code check (6.7.13.0)
- confirmed `SHOPWARE_HTTP_CACHE_ENABLED` — bound to parameter `shopware.http.cache.enabled` — vendor/shopware/core/Framework/DependencyInjection/services.xml:38
- deprecated `SHOPWARE_HTTP_DEFAULT_TTL` — setup option text: deprecated, removed in v6.8.0.0, use cache policies — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:73
- confirmed `CACHE_REWORK` — toggleable experimental flag, default false, read via Feature::isActive — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:64
- confirmed `cache_control` — policy header node with the 12 listed directives — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1317
- confirmed `default_policies` — only storefront/store_api areas allowed — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1338
- confirmed `route_policies` — referenced policy names must exist in policies — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1443
- confirmed `storefront.cacheable` — shipped policy with store_api.cacheable and no_cache_private — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:158
- confirmed `CachePolicyProvider::getPolicy()` — precedence route#modifier, route, area default — vendor/shopware/core/Framework/Adapter/Cache/Http/CachePolicyProvider.php:42
- confirmed `cache.adapter.filesystem` — default app cache pool — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:43
- unverified `cache.adapter.redis_tag_aware` — Symfony cache adapter, out of scope
