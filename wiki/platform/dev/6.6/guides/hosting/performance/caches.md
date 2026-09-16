---
docType: developer
id: platform/dev/6.6/guides/hosting/performance/caches.md
sourceHash: a60a309a41e892936ed6f76d33766e340d459d34
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/performance/caches.html
title: Cache
version: "6.6"
versions: ["6.6"]
keywords: ["cache", "HTTP cache", "SHOPWARE_HTTP_CACHE_ENABLED", "SHOPWARE_HTTP_DEFAULT_TTL", "app cache", "cache.adapter.filesystem", "cache.adapter.redis", "cache.adapter.redis_tag_aware", "Redis", "Varnish", "Fastly", "reverse proxy cache", "volatile-lru"]
summary: "Overview of Shopware's caches: configuring the HTTP cache via env vars and swapping the cache storage adapter, e.g. to Redis."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/guides/hosting/infrastructure/reverse-http-cache.md"]
---
## What it is

This page gives an overview of Shopware's caches and how to configure them, focusing on the HTTP cache and swapping the underlying cache storage adapter.

## When to use

Use it when enabling/tuning the HTTP cache for production, or when moving cache storage off the default filesystem adapter to a shared store like Redis for load-balanced/multi-server setups.

## Key steps / config

Configure the HTTP cache in `.env.local`:

- `SHOPWARE_HTTP_CACHE_ENABLED` - enables the HTTP cache
- `SHOPWARE_HTTP_DEFAULT_TTL` - defines the default cache time

The HTTP cache storage is always the App Cache. For moving HTTP caching out of the application entirely, use an external reverse proxy like Varnish or Fastly.

The default App Cache uses `adapter.filesystem`, storing cache in `var/cache`. This is a standard Symfony cache pool configuration, so any Symfony FrameworkBundle adapter is supported. To use Redis:

```yaml
# config/packages/cache.yaml
framework:
  cache:
    app: cache.adapter.redis_tag_aware
    system: cache.adapter.redis_tag_aware
    default_redis_provider: redis://localhost
```

`cache.adapter.redis_tag_aware` requires Shopware 6.5.8.3 or higher; otherwise use `cache.adapter.redis`. The PHP Redis extension must be installed.

Valid Redis URL formats include `redis://localhost:6379`, `redis://auth@localhost:6379`, `redis://localhost:6379/1`, `redis://localhost:6379?timeout=1`, `redis:///var/run/redis.sock`, and `redis://auth@/var/run/redis.sock`.

## Essential identifiers

- `SHOPWARE_HTTP_CACHE_ENABLED`, `SHOPWARE_HTTP_DEFAULT_TTL`
- `cache.adapter.filesystem`
- `cache.adapter.redis`, `cache.adapter.redis_tag_aware`
- `config/packages/cache.yaml`

## Gotchas

Recommended Redis key eviction policy is `volatile-lru`, since the application explicitly manages TTL per cache item; persistence to disk is not necessary for this ephemeral cache data.

## Version notes

`cache.adapter.redis_tag_aware` requires Shopware 6.5.8.3 or higher.
