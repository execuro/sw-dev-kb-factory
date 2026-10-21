---
id: platform/dev/6.7/guides/hosting/infrastructure/redis.md
title: Redis
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/redis.html
sourceHash: 7f21b6751a4b9261833339f7ed51cef697147911
codeCheckedAgainst: "6.7.15.1"
keywords: ["redis", "shopware.redis.connections", "dsn", "volatile-lru", "allkeys-lru", "eviction policy", "persistent connection", "connection pooling", "ephemeral data", "session storage", "cache", "RDB", "AOF", "REDIS_EPHEMERAL"]
summary: Splitting Shopware Redis usage into ephemeral, aging and critical instances with eviction policies, and defining shopware.redis.connections DSNs.
lastBuilt: 2026-10-21
---
## What it is

Guidance on using Redis with Shopware: which data classes to put on separate Redis instances, which eviction and persistence settings each needs, and how to declare reusable named Redis connections in `config/packages/shopware.yaml`.

## When to use

- Offloading caches, sessions, carts, number ranges, locks or increments from the database to Redis.
- Planning Redis topology for a high-traffic shop.
- Wiring Shopware subsystems to a named Redis connection.

## Key steps / config

Use separate Redis instances per data class, because Redis cannot apply different eviction policies to different databases of one instance:

| Data class | Examples | Persistence | Eviction |
|---|---|---|---|
| Ephemeral | HTTP cache, object cache | memory only | `volatile-lru` |
| Durable, "aging" | sessions | RDB snapshots and/or AOF | `allkeys-lru` |
| Durable, critical | cart, number range, lock store, increment | RDB and/or AOF | `volatile-lru` (never evicts keys without TTL) |

Declare named connections under `shopware.redis.connections`; each entry needs a `dsn`:

```yaml
shopware:
    redis:
        connections:
            ephemeral:
                dsn: 'redis://host1:port/dbindex'
            persistent:
                dsn: 'redis://host2:port/dbindex?persistent=1'
```

- Env vars are allowed in the DSN, e.g. `dsn: '%env(REDIS_EPHEMERAL)%/1'` for database 1.
- `?persistent=1` enables persistent connections (connection pooling) to avoid per-request connect overhead; it does not affect data persistence.
- Subsystems then reference a connection by its name. Names become part of container service ids (`shopware.redis.connection.<name>`), so they must be unique and follow service naming conventions.

## Essential identifiers

- `shopware.redis.connections` (`<name>.dsn`)
- `shopware.redis.connection.<name>` (generated service id)
- `volatile-lru`, `allkeys-lru`
- `persistent=1` DSN flag

## Gotchas

- A cache Redis hitting its memory limit is normal; the risk is too many keys without a TTL, which `volatile-lru` cannot evict. Symfony's tag-aware cache adapter stores tag-index sets without TTL that accumulate orphans; prune them or Redis runs out of memory.
- On the critical-data instance `volatile-lru` still evicts least-recently-used keys that have a TTL.
- Referencing a connection name that is not configured raises an error pointing to `shopware.redis.connections`.

## Version notes

- Named `shopware.redis.connections` exist since 6.6.8.0.

## Code check (6.7.15.1)
- confirmed `redis.connections` — named map of connections — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1633
- confirmed `redis.connections.dsn` — required scalar per connection — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1637
- confirmed `shopware.redis.connection.` — service id prefix per connection name — vendor/shopware/core/Framework/Adapter/Redis/RedisConnectionsCompilerPass.php:50
- confirmed `shopware.redis.connection.` — provider resolves connection service by name — vendor/shopware/core/Framework/Adapter/Redis/RedisConnectionProvider.php:44
- confirmed `shopware.redis.connections` — error for unknown connection name — vendor/shopware/core/Framework/Adapter/AdapterException.php:146
- unverified `volatile-lru` — Redis server setting, outside the code roots
- unverified `persistent=1` — DSN option interpreted by the Redis client, outside the code roots
