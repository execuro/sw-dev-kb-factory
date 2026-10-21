---
id: platform/dev/6.7/guides/hosting/performance/cart-storage.md
title: Cart Storage
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/cart-storage.html
sourceHash: 167c9c71ee8f80bfcf2966474b316881bb16bea4
codeCheckedAgainst: "6.7.15.1"
keywords: ["cart storage", "redis cart", "shopware.cart.storage", "shopware.redis.connections", "cart:migrate", "CartMigrateCommand", "RedisCartPersister", "persistent=1", "volatile-lru", "binlog", "cart persister", "high throughput"]
summary: Store Shopware carts in Redis instead of MySQL via shopware.cart.storage and a named Redis connection; migrate existing carts with cart:migrate.
lastBuilt: 2026-10-21
---
## What it is

Shopware stores carts in the database (`cart` table) by default. For high-throughput shops (thousands of orders per minute, DB clusters with read/write split) this can be a bottleneck and inflate the database `binlog`, so carts can be stored in Redis instead.

## When to use

- High order throughput or a read/write-split DB cluster.
- Moving existing carts between MySQL and Redis without affecting customers.

## Key steps / config

1. Define a Redis connection and point the cart storage at it in `config/packages/shopware.yml`:

```yaml
shopware:
    redis:
        connections:
            persistent:
                dsn: 'redis://host:port/dbindex?persistent=1'
    cart:
        storage:
            type: 'redis'          # allowed: mysql (default), redis
            config:
                connection: 'persistent'
```

`?persistent=1` enables connection pooling (persistent connection, recommended under high load), not data persistence. `dsn` is required for every connection under `shopware.redis.connections`.

2. Migrate existing carts:

```shell
bin/console cart:migrate {fromStorage} {redisUrl?}
bin/console cart:migrate sql
```

`fromStorage` is `sql` or `redis` (the source storage). The Redis URL argument is optional; without it the configured connection is used, and if none is configured you must pass the URL.

3. Configure the Redis instance for durability: enable RDB snapshots and/or AOF so carts survive a restart, and use eviction policy `volatile-lru` (only evicts keys with a TTL) to avoid losing data.

## Essential identifiers

- `shopware.cart.storage.type`, `shopware.cart.storage.config.connection`
- `shopware.redis.connections.<name>.dsn`
- `bin/console cart:migrate` (`Shopware\Core\Checkout\Cart\Command\CartMigrateCommand`)
- `Shopware\Core\Checkout\Cart\RedisCartPersister`

## Gotchas

- Redis cart keys are written with a TTL of `shopware.cart.expire_days` (default 120) days by the migration, which is what makes `volatile-lru` safe.
- Any `type` other than `mysql`/`redis` is rejected by the config tree.

## Version notes

- Before 6.6.8.0 the cart used a single `shopware.cart.redis_url` DSN key. Since 6.6.8.0 the named-connection form above is used; the installed 6.7 code no longer knows the old key.

## Code check (6.7.15.1)
- absent `shopware.cart.redis_url` — pre-6.6.8.0 key not present anywhere in the installed code
- confirmed `shopware.cart.storage` — enum type mysql/redis, default mysql — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:932
- confirmed `config.connection` — named Redis connection for cart storage, default null — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:940
- confirmed `expire_days` — cart expiry, default 120 days — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:928
- confirmed `shopware.redis.connections` — named connections with required dsn — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1633
- confirmed `cart:migrate` — console command name — vendor/shopware/core/Checkout/Cart/Command/CartMigrateCommand.php:31
- confirmed `CartMigrateCommand::VALID_SOURCE_STORAGES` — source must be redis or sql — vendor/shopware/core/Checkout/Cart/Command/CartMigrateCommand.php:38
- confirmed `url` — optional Redis URL argument of cart:migrate — vendor/shopware/core/Checkout/Cart/Command/CartMigrateCommand.php:66
- confirmed `RedisCartPersister::PREFIX` — key prefix of carts stored in Redis — vendor/shopware/core/Checkout/Cart/Command/CartMigrateCommand.php:193
