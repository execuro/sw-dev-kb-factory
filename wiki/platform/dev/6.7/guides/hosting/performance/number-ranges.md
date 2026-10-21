---
id: platform/dev/6.7/guides/hosting/performance/number-ranges.md
title: Number Ranges
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/number-ranges.html
sourceHash: 04d5221309d559d52eefcc4da0141157df24849d
codeCheckedAgainst: "6.7.15.1"
keywords: ["number range", "number_range", "increment_storage", "config.connection", "shopware.redis.connections", "number-range:migrate", "redis", "mysql", "order number", "invoice number", "volatile-lru", "IncrementRedisStorage"]
summary: "Store Shopware number range states in Redis (number_range.increment_storage + config.connection) and migrate states with number-range:migrate."
lastBuilt: 2026-10-21
---
## What it is

Number ranges generate consecutive sequences for order numbers, invoice numbers, etc. Generation is atomic, so numbers are consecutive and never issued twice. By default the state is stored in the database (`mysql` storage); Redis handles atomic increments better and can be used instead.

## When to use

High-throughput shops (e.g. thousands of orders per minute) where the database becomes a bottleneck because of the atomicity requirement.

## Key steps / config

1. Define a Redis connection and point the number range storage at it in `config/packages/shopware.yml`:
   ```yaml
   shopware:
       redis:
           connections:
               persistent:
                   dsn: 'redis://host:port/dbindex'
       number_range:
           increment_storage: 'redis'
           config:
               connection: 'persistent'
   ```
   `increment_storage` accepts only `mysql` (default) or `redis`. With `redis`, `config.connection` is mandatory — the config fails validation otherwise. The connection name must exist under `shopware.redis.connections` (each entry requires `dsn`).
2. Configure Redis for durability: enable persistence (RDB snapshots and/or AOF) so states survive a restart, and use the `volatile-lru` eviction policy (evicts only keys with a TTL) to avoid losing data.
3. Migrate existing states between storages:
   ```shell
   bin/console number-range:migrate {from} {to}
   bin/console number-range:migrate mysql redis
   ```
   Storage names are the registered storage keys `mysql` and `redis`. For any migration from or to Redis, the Redis connection (`number_range.config.connection`) must be configured, even if `increment_storage` is not currently `redis`.

## Essential identifiers

- `shopware.number_range.increment_storage` (`mysql` | `redis`)
- `shopware.number_range.config.connection`
- `shopware.redis.connections.<name>.dsn`
- `number-range:migrate` (arguments `from`, `to`)
- Storages: `IncrementSqlStorage` (`mysql`), `IncrementRedisStorage` (`redis`)

## Gotchas

- Migration is **not atomic**: generating numbers while migrating can produce duplicates. Run it during a deployment or maintenance window, not during normal operation; the command asks for confirmation and warns about this.
- The docs write the storage names as `SQL`/`Redis` (and `"Redis"` for `increment_storage`); the installed code only knows lowercase `mysql`/`redis`.
- The docs' info box refers to `shopware.number_range.redis_url`; that key does not exist in the installed code — configure `config.connection` instead.

## Version notes

- Before v6.6.8.0 the Redis DSN was set directly on the number range config (`increment_storage: "Redis"` plus `redis_url`). Since v6.6.8.0 Redis is configured via named `shopware.redis.connections` referenced by `number_range.config.connection`; 6.7.15.1 supports only the latter.

## Code check (6.7.15.1)
- absent `shopware.number_range.redis_url` — not defined in the installed config tree; use `config.connection`
- corrected `increment_storage` — docs: `"Redis"`; enum values are `mysql`, `redis`, default `mysql` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:973
- confirmed `config.connection` — required when `increment_storage` is `redis` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:986
- confirmed `connections` — named Redis connections, `dsn` required — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1633
- confirmed `number-range:migrate` — command with `from`/`to` arguments — vendor/shopware/core/System/NumberRange/Command/MigrateIncrementStorageCommand.php:16
- corrected `IncrementSqlStorage` — docs: storage name `SQL`; registered as `mysql` — vendor/shopware/core/System/DependencyInjection/number_range.php:64
- corrected `IncrementRedisStorage` — docs: storage name `Redis`; registered as `redis` — vendor/shopware/core/System/DependencyInjection/number_range.php:85
- confirmed `shopware.number_range.config.connection` — Redis client built from this connection name — vendor/shopware/core/System/DependencyInjection/number_range.php:102
