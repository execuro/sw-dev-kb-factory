---
id: platform/dev/6.7/guides/hosting/performance/increment.md
title: Increment Storage
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/increment.html
sourceHash: 15730d0c77a80d41e0626ab5020283b9b8802661
codeCheckedAgainst: "6.7.15.1"
keywords: ["increment storage", "shopware.increment", "user_activity", "message_queue", "increment table", "redis increment", "RedisIncrementer", "ArrayIncrementer", "IncrementGatewayRegistry", "shopware.redis.connections", "queue notification", "module usage overview"]
summary: Configure the Shopware increment storage (user_activity, message_queue pools) to use Redis instead of the increment table, or disable it with type array.
lastBuilt: 2026-10-21
---
## What it is

The increment storage keeps counters shown in the Administration, such as message queue status and the last used modules of Administration users. It increments/decrements keys transaction-safely, which locks the storage. By default it uses the `increment` table (type `mysql`); with many message consumers this table is locked often and slows workers, so another backend can be configured per pool.

## When to use

- Multiple message consumers contend on the `increment` table.
- You do not need Queue Notification / Module Usage Overview and want to switch the storage off.

## Key steps / config

Use Redis via a named connection in `config/packages/shopware.yml`:

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
        message_queue:
            type: 'redis'
            config:
                connection: 'persistent'
```

Each pool under `shopware.increment` takes a `type` and an optional `config`. Built-in types: `mysql` (default for both pools), `redis`, `array`. A custom gateway can be registered as service `shopware.increment.<pool>.gateway.<type>`; it must extend `AbstractIncrementer`.

Redis instance: data is durable, so enable RDB snapshots and/or AOF, and use eviction policy `volatile-lru` (only evicts keys with a TTL) to avoid losing data.

Disable the storage by setting both pools to `type: 'array'`:

```yaml
shopware:
    increment:
        user_activity:
            type: 'array'
        message_queue:
            type: 'array'
```

With `array`, Queue Notification and Module Usage Overview no longer work in the Administration.

## Essential identifiers

- `shopware.increment.user_activity`, `shopware.increment.message_queue`
- `type` (`mysql` / `redis` / `array`), `config.connection`
- `shopware.redis.connections.<name>.dsn`
- `Shopware\Core\Framework\Increment\RedisIncrementer`, `ArrayIncrementer`, `AbstractIncrementer`, `IncrementGatewayRegistry`

## Gotchas

- For `type: 'redis'`, the built-in resolution only wires a Redis adapter when `config.connection` is set; without it (e.g. the old `config.url` form) no gateway service is created and the container build fails with "gateway service not found".
- The increment-based message queue statistics are deprecated for 6.8.0 (`IncrementGatewayRegistry::MESSAGE_QUEUE_POOL` is marked for removal).

## Version notes

- Before 6.6.8.0 each pool took `config.url: 'redis://host:port/dbindex'` directly; since 6.6.8.0 pools reference a named connection from `shopware.redis.connections`.

## Code check (6.7.15.1)
- confirmed `shopware.increment` — pools keyed by name with type and config — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1133
- confirmed `user_activity` — default type mysql — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:221
- confirmed `message_queue` — default type mysql — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:231
- corrected `config.connection` — docs (before 6.6.8.0 tab): config.url; only connection is read for redis — vendor/shopware/core/Framework/Increment/IncrementerGatewayCompilerPass.php:88
- confirmed `RedisIncrementer` — gateway class wired for type redis — vendor/shopware/core/Framework/Increment/IncrementerGatewayCompilerPass.php:98
- confirmed `array` — built-in type resolved from shopware.increment.gateway.array — vendor/shopware/core/Framework/Increment/IncrementerGatewayCompilerPass.php:74
- confirmed `ArrayIncrementer` — service shopware.increment.gateway.array — vendor/shopware/core/Framework/DependencyInjection/increment.php:31
- confirmed `AbstractIncrementer` — required base class of every gateway — vendor/shopware/core/Framework/Increment/IncrementerGatewayCompilerPass.php:54
- deprecated `IncrementGatewayRegistry::MESSAGE_QUEUE_POOL` — removed in v6.8.0, message queue stats deprecated — vendor/shopware/core/Framework/Increment/IncrementGatewayRegistry.php:16
- confirmed `shopware.redis.connections` — dsn required per connection — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1633
