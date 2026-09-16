---
id: platform/dev/6.6/guides/hosting/infrastructure/redis.md
title: Redis
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/infrastructure/redis.html
sourceHash: e7a088ea5986084e27002754c218c60c307e5135
keywords: ["redis", "shopware.redis.connections", "volatile-lru", "allkeys-lru", "eviction policy", "persistent connection", "cache storage", "session storage", "cart storage", "number ranges", "lock store", "increment storage"]
summary: "Explains ephemeral/durable Redis data categories, eviction policies, and shopware.redis.connections config since Shopware 6.6.8.0."
lastBuilt: 2026-09-15
---
## What it is
Describes recommended Redis usage patterns in Shopware — categorizing cached, session, and critical data — and how to configure named Redis connections since Shopware 6.6.8.0.

## When to use
Use it when offloading cache, session, cart, number-range, lock-store, or increment data from MySQL to Redis, and deciding how many Redis instances and eviction policies to use.

## Key steps / config
Three data categories, each suited to a different Redis instance and eviction policy:
- Ephemeral (HTTP cache, object cache): no persistence needed; use `volatile-lru` eviction.
- Durable "aging" data (sessions): persist via RDB/AOF snapshots; use `allkeys-lru` eviction.
- Durable and critical data (carts, number ranges, lock store, increment): must be persisted; use `volatile-lru` eviction since it won't delete unexpired keys.

Since Shopware 6.6.8.0, named Redis connections are configured under `shopware.redis.connections` in `config/packages/shopware.yaml`:

```yaml
shopware:
    redis:
        connections:
            ephemeral:
                dsn: 'redis://host1:port/dbindex'
            persistent:
                dsn: 'redis://host2:port/dbindex'
```

DSNs can reference environment variables, e.g. `dsn: '%env(REDIS_EPHEMERAL)%/1'`. For connection pooling in high-load setups, append `?persistent=1` to the DSN.

## Essential identifiers
- `shopware.redis.connections`
- `volatile-lru`, `allkeys-lru` eviction policies
- `%env(REDIS_EPHEMERAL)%`
- `persistent=1` DSN flag

## Gotchas
A single Redis instance cannot use different eviction policies per database, so separate Redis instances are recommended for different data categories. The `persistent` DSN flag affects connection pooling only, not data persistence.

## Version notes
Named, reusable Redis connections (`shopware.redis.connections`) are available starting with Shopware 6.6.8.0.
