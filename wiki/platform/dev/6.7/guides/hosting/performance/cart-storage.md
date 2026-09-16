---
id: platform/dev/6.7/guides/hosting/performance/cart-storage.md
title: Cart Storage
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/performance/cart-storage.html
sourceHash: 7e43d2961d774af582371ac2a1d3c98a3d5358c6
codeCheckedAgainst: "6.7.13.0"
keywords: ["cart:migrate", "shopware.cart.storage.type", "shopware.cart.storage.config.connection", "shopware.redis.connections", "dsn", "cart storage", "redis", "mysql", "persistent connection", "volatile-lru", "cart migration", "high throughput"]
summary: "Store Shopware carts in Redis via shopware.cart.storage (type redis + named redis connection) and migrate existing carts with bin/console cart:migrate."
lastBuilt: 2026-09-15
---
## What it is

How to move Shopware's cart persistence from the default database table to Redis, migrate existing carts between the two storages, and configure the Redis instance for durable cart data.

## When to use

High-throughput shops (e.g. thousands of orders per minute), especially with a DB cluster using read/write split, or when the rapidly changing cart table inflates the database `binlog`.

## Key steps / config

1. Define a named Redis connection and point the cart storage at it in `config/packages/shopware.yml`:

```yaml
shopware:
    redis:
        connections:
            persistent:
                dsn: 'redis://host:port/dbindex?persistent=1'
    cart:
        storage:
            type: 'redis'
            config:
                connection: 'persistent'
```

   - `shopware.cart.storage.type` accepts `mysql` (default) or `redis`.
   - With `type: 'redis'`, `shopware.cart.storage.config.connection` is required; each entry under `shopware.redis.connections` requires `dsn`.
   - `?persistent=1` enables connection pooling (persistent connection), not data persistence; recommended to avoid connection issues under high load.

2. Migrate existing carts so switching storage does not affect customers:

```shell
bin/console cart:migrate sql          # DB -> Redis
bin/console cart:migrate redis        # Redis -> DB
bin/console cart:migrate sql <url>    # optional explicit Redis URL
```

   The first argument (`from`) is the source storage and must be `redis` or `sql`. The optional second argument (`url`) is a Redis connection URL; without it the configured Redis connection is used, and if none is configured the URL must be passed.

3. Configure the Redis instance for durability: cart data must survive restarts, so enable RDB snapshots and/or AOF. Use eviction policy `volatile-lru` so only expired carts are evicted.

## Essential identifiers

- `bin/console cart:migrate <from> [url]`
- `shopware.cart.storage.type` (`mysql` | `redis`)
- `shopware.cart.storage.config.connection`
- `shopware.redis.connections.<name>.dsn`

## Gotchas

- The storage type value is `mysql`, but the `cart:migrate` source argument for the database is `sql`.
- Any eviction policy other than `volatile-lru` risks losing carts that have not expired.
- Unlike the HTTP/app cache Redis, the cart Redis holds durable data and should persist to disk.

## Version notes

- Before 6.6.8.0 the docs configured the cart Redis with a single `shopware.cart.redis_url` DSN key; since 6.6.8.0 use `shopware.redis.connections` plus `shopware.cart.storage`. The old key no longer exists in the 6.7 code.

## Code check (6.7.13.0)
- absent `shopware.cart.redis_url` — old pre-6.6.8.0 DSN key; not found anywhere in the installed code
- confirmed `shopware.cart.storage.type` — enum mysql/redis, default mysql — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:898
- confirmed `shopware.cart.storage.config.connection` — scalar, default null — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:904
- confirmed `redisNotConfiguredForCartStorage` — connection parameter required for redis storage — vendor/shopware/core/Checkout/DependencyInjection/DependencyInjectionException.php:16
- confirmed `shopware.redis.connections` — named connections, each with required dsn — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1588
- confirmed `cart:migrate` — console command — vendor/shopware/core/Checkout/Cart/Command/CartMigrateCommand.php:30
- corrected `CartMigrateCommand::VALID_SOURCE_STORAGES` — docs: `{fromStorage} {redisUrl?}`; code takes `from` (redis or sql) and optional `url` — vendor/shopware/core/Checkout/Cart/Command/CartMigrateCommand.php:38
