---
id: platform/dev/6.7/guides/hosting/performance/caches.md
title: Cache
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/caches.html
sourceHash: 4b49e47364927414d57176bda86b01171a946779
codeCheckedAgainst: "6.7.15.1"
keywords: ["http cache", "SHOPWARE_HTTP_CACHE_ENABLED", "CACHE_REWORK", "shopware.http_cache.policies", "default_policies", "route_policies", "cache_control", "cache.adapter.redis_tag_aware", "redis", "volatile-lru", "cache tags", "orphaned tags", "frosh:redis-tag:cleanup", "app cache"]
summary: Configure the Shopware HTTP cache, experimental HTTP caching policies, Redis as cache pool, and prune orphaned Redis tag sets that cause OOM errors.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md"]
---
## What it is

Overview of Shopware's caches for hosting: enabling the HTTP cache, defining HTTP caching policies (experimental), swapping the cache storage (filesystem to Redis), and diagnosing Redis OOM errors caused by cache-tag index keys that never expire.

## When to use

- Setting up a production system (the HTTP cache is a must-have).
- Controlling `Cache-Control` per area or per route.
- Running multiple app servers / a load balancer, where a shared cache like Redis replaces the default file cache.
- A Redis cache instance throws OOM errors although eviction is configured.

## Key steps / config

**Enable the HTTP cache** in `.env.local` with `SHOPWARE_HTTP_CACHE_ENABLED`. HTTP cache storage is always the App Cache; to move it out of the application, use a reverse proxy (Varnish, Fastly), see [Reverse HTTP cache](platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md).

**HTTP caching policies** (experimental, enable feature flag `CACHE_REWORK`; default in 6.8.0.0). Shipped policies: `storefront.cacheable`, `store_api.cacheable`, `no_cache_private`. Define your own in `config/packages/shopware.yaml`:

```yaml
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

Supported `cache_control` directives: `public`, `private`, `no_cache`, `no_store`, `no_transform`, `must_revalidate`, `proxy_revalidate`, `immutable`, `max_age`, `s_maxage`, `stale_while_revalidate`, `stale_if_error`. Only the `cache_control` header (plus `no_vary_search` in 6.7.15.1) is configurable. Redefining a policy replaces it completely (no merge).

Precedence (high to low): `route_policies[route#hook]` (script endpoints, normalized hook name) > `route_policies[route]` > `default_policies[area].{cacheable|uncacheable}`; TTLs (`max-age`, `s-maxage`) of area defaults can be overridden by request attribute or app script configuration (see [custom endpoints](platform/dev/6.7/guides/plugins/apps/app-scripts/custom-endpoints.md)).

**Cache storage**: default is `adapter.filesystem` in `var/cache`. It is a Symfony cache pool, so any FrameworkBundle adapter works. Redis (requires the PHP Redis extension):

```yaml
# config/packages/cache.yaml
framework:
  cache:
    app: cache.adapter.redis_tag_aware
    system: cache.adapter.redis_tag_aware
    default_redis_provider: redis://localhost
```

`cache.adapter.redis_tag_aware` needs Shopware 6.5.8.3+, else `cache.adapter.redis`. Redis URL forms include `redis://localhost:6379`, `redis://auth@localhost:6379`, `redis://localhost:6379/1`, `redis://localhost:6379?timeout=1`, `redis:///var/run/redis.sock`, `redis://auth@/var/run/redis.sock`. Use eviction policy `volatile-lru`; persistence can be disabled for the cache.

**Orphaned cache tags**: the tag index (Redis sets whose key contains `\x01tags\x01`) has no TTL; when cached items expire their entries stay in the sets, and `volatile-lru` can never evict them. Diagnose with `redis-cli INFO keyspace` (`keys` minus `expires` = persistent keys). Prune on a schedule (e.g. nightly cron), using FroshTools' `frosh:redis-tag:cleanup` or the standalone `shopware-redis-cli-helper`:

```bash
shopware-redis-cli-helper --url redis://127.0.0.1:6379/0 insights
shopware-redis-cli-helper --url redis://127.0.0.1:6379/0 cleanup          # dry run
shopware-redis-cli-helper --url redis://127.0.0.1:6379/0 cleanup --apply
```

## Essential identifiers

- `SHOPWARE_HTTP_CACHE_ENABLED`, feature flag `CACHE_REWORK`
- `shopware.http_cache.policies`, `shopware.http_cache.default_policies`, `shopware.http_cache.route_policies`, `headers.cache_control`
- Policies `storefront.cacheable`, `store_api.cacheable`, `no_cache_private`
- `cache.adapter.redis_tag_aware`, `cache.adapter.redis`, `default_redis_provider`
- `frosh:redis-tag:cleanup`, `shopware-redis-cli-helper`

## Gotchas

- `SHOPWARE_HTTP_DEFAULT_TTL` (default cache time) is deprecated and removed in 6.8.0.0; use caching policies instead.
- Every policy name referenced in `default_policies` or `route_policies` must be defined under `shopware.http_cache.policies`, otherwise container config validation fails ("references unknown cache policies").
- `default_policies` only accepts the areas `storefront` and `store_api`.
- A full cache Redis at `maxmemory` is healthy; OOM (`OOM command not allowed when used memory > 'maxmemory'`) with `volatile-lru` points at too many no-TTL tag keys. Do not just raise `maxmemory`; a one-off cleanup only postpones the problem.
- Cache invalidation via tags requires the `redis_tag_aware` adapter.

## Version notes

- Caching policies become the default behavior in 6.8.0.0; in 6.7 they require `CACHE_REWORK`.
- `cache.adapter.redis_tag_aware` requires at least 6.5.8.3.

## Code check (6.7.15.1)
- deprecated `SHOPWARE_HTTP_DEFAULT_TTL` — setup option marked deprecated, removed in v6.8.0.0 — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:73
- confirmed `SHOPWARE_HTTP_CACHE_ENABLED` — env var feeding shopware.http.cache.enabled — vendor/shopware/core/Framework/DependencyInjection/services.php:189
- confirmed `CACHE_REWORK` — toggleable feature flag, default false, read via Feature::isActive — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:64
- confirmed `shopware.http_cache.policies` — no deep merging, so redefinition replaces — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1345
- confirmed `cache_control` — exactly the 12 documented directives — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1353
- confirmed `default_policies` — only storefront and store_api areas allowed — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1383
- confirmed `route_policies` — referenced policies must be defined — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1488
- confirmed `store_api.cacheable` — shipped default policy alongside storefront.cacheable and no_cache_private — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:150
- confirmed `frontend.script_endpoint` — storefront script endpoint route with hook parameter — vendor/shopware/storefront/Controller/ScriptController.php:34
- unverified `cache.adapter.redis_tag_aware` — Symfony FrameworkBundle adapter, out of scope
