---
id: platform/dev/6.7/guides/hosting/performance/increment.md
title: Increment Storage
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/increment.html
sourceHash: 818bb8d4663ebd4c80fab57f0bd5258f699a2aee
codeCheckedAgainst: "6.7.13.0"
keywords: ["increment storage", "shopware.increment", "user_activity", "message_queue", "redis", "array", "mysql", "increment table", "shopware.redis.connections", "RedisIncrementer", "module usage overview", "queue notification", "volatile-lru", "performance"]
summary: Configure the shopware.increment pools (user_activity, message_queue) to use Redis via a named connection, or disable them with type array.
lastBuilt: 2026-09-15
---
## What it is

The increment storage holds counters shown in the Administration (message queue status, last used Administration modules per user). It increments/decrements keys in a transaction-safe way, which locks the storage. By default Shopware uses the `increment` database table (`type: 'mysql'`); with many message consumers this table is locked often and slows workers.

## When to use

- Several message consumers run in parallel and `increment` table locks hurt worker throughput: move the storage to Redis.
- You do not need Queue Notification or Module Usage Overview in the Administration: disable the storage.

## Key steps / config

Use Redis through a named connection in `config/packages/shopware.yml`. The installed code only builds a Redis gateway when `config.connection` is set; the connection name must be declared under `shopware.redis.connections` with a required `dsn`:

```yaml
shopware:
    redis:
        connections:
            persistent:
                dsn: 'redis://host:port/dbindex'
    increment:
        user_activity:
            type: 'redis'
            config:
                connection: 'persistent'
```

Disable the storage by setting the pool type to `array` (in-memory, nothing persisted):

```yaml
shopware:
    increment:
        user_activity:
            type: 'array'
```

Redis instance recommendations from the docs:
- Enable persistence (RDB snapshots and/or AOF), because the data is durable state.
- Use key eviction policy `volatile-lru` so only expiring keys are evicted.

## Essential identifiers

- `shopware.increment` (pool map; each pool has `type` and `config`)
- `user_activity` pool
- Types: `mysql` (default), `redis`, `array`
- `config.connection`, `shopware.redis.connections.<name>.dsn`
- `Shopware\Core\Framework\Increment\RedisIncrementer`
- Database table `increment`

## Gotchas

- With `type: 'array'`, Queue Notification and Module Usage Overview stop working in the Administration.
- The pre-6.6.8.0 form `config: { url: 'redis://host:port/dbindex' }` is not handled by the 6.7 compiler pass: without a `connection` key no Redis gateway definition is created and container build fails with a gateway-not-found error.
- The `message_queue` pool shown in the docs is deprecated for 6.8.0 (the increment-based message queue statistics are being removed; `shopware.messenger.stats.enabled` is the named alternative). It still accepts the same `type`/`config` shape as `user_activity` in 6.7.

## Version notes

- Before 6.6.8.0 each pool took `config.url` directly; since 6.6.8.0 pools reference a connection from `shopware.redis.connections`.
- 6.7 ships `type: 'mysql'` as default for both `user_activity` and `message_queue`; `message_queue` is marked `@deprecated tag:v6.8.0`.

## Code check (6.7.13.0)
- confirmed `shopware.increment` — prototype pools with `type` scalar and `config` variable node — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1097
- confirmed `increment.user_activity` — default `type: 'mysql'` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:209
- deprecated `IncrementGatewayRegistry::MESSAGE_QUEUE_POOL` — `message_queue` pool deprecated for v6.8.0 — vendor/shopware/core/Framework/Increment/IncrementGatewayRegistry.php:16
- confirmed `IncrementGatewayRegistry::USER_ACTIVITY_POOL` — pool name `user_activity` — vendor/shopware/core/Framework/Increment/IncrementGatewayRegistry.php:18
- corrected `config.connection` — docs (before 6.6.8.0): `config.url`; Redis gateway only built when `connection` is present — vendor/shopware/core/Framework/Increment/IncrementerGatewayCompilerPass.php:88
- confirmed `RedisIncrementer` — gateway class for `type: 'redis'` — vendor/shopware/core/Framework/Increment/IncrementerGatewayCompilerPass.php:98
- confirmed `shopware.increment.gateway` — fallback gateway reused for `array`/`mysql` types — vendor/shopware/core/Framework/Increment/IncrementerGatewayCompilerPass.php:69
- confirmed `dsn` — required per entry of `shopware.redis.connections` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1592
- unverified `volatile-lru` — Redis server setting, outside vendor/shopware
