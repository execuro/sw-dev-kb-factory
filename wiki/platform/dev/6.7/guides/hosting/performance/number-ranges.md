---
id: platform/dev/6.7/guides/hosting/performance/number-ranges.md
title: Number Ranges
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/number-ranges.html
sourceHash: 234a7a1a5517552a1a57f2463c6f3eeb8f8784d6
codeCheckedAgainst: "6.7.13.0"
keywords: ["number ranges", "order number", "invoice number", "shopware.number_range", "increment_storage", "config.connection", "redis", "mysql", "number-range:migrate", "IncrementRedisStorage", "IncrementSqlStorage", "atomic increment", "shopware.redis.connections"]
summary: Store number range state in Redis (increment_storage redis + config.connection) and move state with number-range:migrate mysql redis.
lastBuilt: 2026-09-15
---
## What it is

Number ranges generate consecutive sequences (order numbers, invoice numbers, etc.). Generation is atomic, so no number is produced twice. State is stored in the database by default (`increment_storage: "mysql"`); under high throughput (thousands of orders per minute) that atomicity makes the database a bottleneck, and Redis handles atomic increments better.

## When to use

High order/document volume where number range generation contends on the database, or when moving existing number range state between MySQL and Redis during a deployment.

## Key steps / config

1. Declare a Redis connection and point the number range storage at it in `config/packages/shopware.yml`. In 6.7, `increment_storage` is an enum of `mysql` (default) and `redis`, and `config.connection` is required when it is `redis`:

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

2. Configure the Redis instance for durability: persistence via RDB snapshots and/or AOF, eviction policy `volatile-lru`.

3. Migrate existing state between storages (storage names are the registered keys `mysql` and `redis`):

   ```shell
   bin/console number-range:migrate {from} {to}
   bin/console number-range:migrate mysql redis
   ```

   The command asks for confirmation before copying every number range state from the source storage to the target.

## Essential identifiers

- `shopware.number_range.increment_storage` (`mysql` | `redis`, default `mysql`)
- `shopware.number_range.config.connection`
- `shopware.redis.connections.<name>.dsn`
- `number-range:migrate` (arguments `from`, `to`)
- `Shopware\Core\System\NumberRange\ValueGenerator\Pattern\IncrementStorage\IncrementSqlStorage`
- `Shopware\Core\System\NumberRange\ValueGenerator\Pattern\IncrementStorage\IncrementRedisStorage`
- `Shopware\Core\System\NumberRange\ValueGenerator\Pattern\IncrementStorage\IncrementStorageRegistry`

## Gotchas

- Migration is not atomic: generating numbers while migrating can produce duplicates. Run it during deployment/maintenance, not in normal operation.
- To migrate from or to Redis, `shopware.number_range.config.connection` must be set even if `increment_storage` is still `mysql`; without it the Redis storage service is removed from the container. The docs name `shopware.number_range.redis_url` for this, a key the installed code does not have.
- The docs' example `number-range:migrate SQL Redis` and value `"Redis"` do not match 6.7: storage keys and enum values are lowercase `mysql`/`redis`.

## Version notes

- Before 6.6.8.0 the docs configured `increment_storage: "Redis"` with a direct Redis URL key; since 6.6.8.0 the storage references a named connection from `shopware.redis.connections`.

## Code check (6.7.13.0)
- absent `shopware.number_range.redis_url` — not defined anywhere in the installed code; use `shopware.number_range.config.connection`
- corrected `increment_storage` — docs: `"Redis"`; enum values are `mysql`, `redis`, default `mysql` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:937
- confirmed `config.connection` — required when `increment_storage` is `redis` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:950
- confirmed `shopware.number_range.config.connection` — when null the Redis storage definitions are removed — vendor/shopware/core/System/DependencyInjection/CompilerPass/NumberRangeIncrementerCompilerPass.php:15
- confirmed `number-range:migrate` — console command name — vendor/shopware/core/System/NumberRange/Command/MigrateIncrementStorageCommand.php:15
- corrected `IncrementSqlStorage` — docs: `SQL` storage name; registered under storage key `mysql` — vendor/shopware/core/System/DependencyInjection/number_range.xml:39
- confirmed `IncrementRedisStorage` — registered under storage key `redis` — vendor/shopware/core/System/DependencyInjection/number_range.xml:51
- confirmed `IncrementStorageRegistry::migrate()` — copies each state from source to target storage — vendor/shopware/core/System/NumberRange/ValueGenerator/Pattern/IncrementStorage/IncrementStorageRegistry.php:36
- confirmed `dsn` — required per entry of `shopware.redis.connections` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1592
- unverified `volatile-lru` — Redis server setting, outside vendor/shopware
