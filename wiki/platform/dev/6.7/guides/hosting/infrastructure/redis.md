---
id: platform/dev/6.7/guides/hosting/infrastructure/redis.md
title: Redis
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/redis.html
sourceHash: 3b1e7f4ac802f06a547c40ec214d321e66e5e2b8
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware.redis.connections", "dsn", "shopware.redis.connection", "RedisConnectionProvider", "volatile-lru", "allkeys-lru", "persistent=1", "redis", "eviction policy", "cache", "sessions", "cart storage", "number ranges", "connection pooling"]
summary: How to split Shopware Redis usage into ephemeral, aging and critical instances with eviction policies, and define named shopware.redis.connections (6.6.8.0+).
lastBuilt: 2026-09-15
---
## What it is

Guidance on running Redis for Shopware: which data goes into which Redis instance, which eviction and persistence settings to use, and how to declare reusable named Redis connections under `shopware.redis.connections` that subsystems reference by name.

## When to use

Planning Redis for a production or high-throughput shop — caches, sessions, cart, number ranges, lock store, increment storage — or wiring a subsystem to a specific Redis connection.

## Key steps / config

1. Classify data and use separate Redis instances (one instance cannot use different eviction policies per database):

| Category | Examples | Persistence | Eviction policy |
|---|---|---|---|
| Ephemeral | HTTP cache, object cache | memory only | `volatile-lru` |
| Durable, aging | sessions | RDB snapshots and/or AOF | `allkeys-lru` |
| Durable, critical | cart, number range, lock store, increment | persisted | `volatile-lru` |

2. Define named connections in `config/packages/shopware.yaml` (since 6.6.8.0); `dsn` is the only (required) key per connection:

```yaml
shopware:
    redis:
        connections:
            ephemeral:
                dsn: 'redis://host1:port/dbindex'
            persistent:
                dsn: 'redis://host2:port/dbindex?persistent=1'
            ephemeral_2:
                dsn: '%env(REDIS_EPHEMERAL)%/2'
```

   Each connection becomes a container service `shopware.redis.connection.<name>`, so names must be unique and follow service-naming conventions. Env vars can be used inside the DSN.

3. Reference connections by name from subsystem config — e.g. the number range section accepts `increment_storage: redis` plus `config.connection: <name>` (a connection is mandatory when storage is `redis`).

4. For high load, add `?persistent=1` to the DSN to reuse connections (connection pooling — not data persistence).

## Essential identifiers

- `shopware.redis.connections.<name>.dsn`
- service id `shopware.redis.connection.<name>`
- `Shopware\Core\Framework\Adapter\Redis\RedisConnectionProvider`
- `volatile-lru`, `allkeys-lru`, `persistent=1`

## Gotchas

- A cache Redis hitting its memory limit is normal; the real problem is keys without TTL. `volatile-lru` only evicts keys with a TTL, and Symfony's tag-aware cache adapter stores tag-index sets without a TTL that accumulate orphaned entries — prune them or Redis runs out of memory.
- A non-string `dsn` fails container compilation.

## Version notes

- Named reusable connections under `shopware.redis.connections` are available from 6.6.8.0.

## Code check (6.7.13.0)
- confirmed `connections` — config node under redis, keyed by name — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1588
- confirmed `dsn` — required scalar per connection — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1592
- confirmed `shopware.redis.connection.` — service id prefix per connection — vendor/shopware/core/Framework/Adapter/Redis/RedisConnectionsCompilerPass.php:50
- confirmed `shopware.redis.connections` — parameter read; non-string dsn throws — vendor/shopware/core/Framework/Adapter/Redis/RedisConnectionsCompilerPass.php:40
- confirmed `RedisConnectionProvider::getConnection()` — resolves a connection by name — vendor/shopware/core/Framework/Adapter/Redis/RedisConnectionProvider.php:28
- confirmed `increment_storage` — number range mysql or redis, default mysql — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:937
- confirmed `connection` — number range config.connection, required when increment_storage is redis — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:944
- unverified `volatile-lru` — Redis server setting, outside the installed Shopware code
- unverified `persistent=1` — DSN flag parsed by Symfony cache adapter, vendor/symfony out of scope
