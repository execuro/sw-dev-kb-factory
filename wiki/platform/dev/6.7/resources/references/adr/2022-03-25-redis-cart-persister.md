---
id: platform/dev/6.7/resources/references/adr/2022-03-25-redis-cart-persister.md
title: Redis cart persister
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-redis-cart-persister.html
sourceHash: 194b8d10fbc8750753bf0d810da436b7fa9ede55
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware\\Core\\Checkout\\Cart\\RedisCartPersister", "AbstractCartPersister", "CartPersister", "CartStorageCompilerPass", "shopware.cart.storage.type", "shopware.cart.storage.config.connection", "shopware.cart.compress", "shopware.cart.redis", "cart:migrate", "redis", "cart storage", "shopping cart persistence", "compression"]
summary: "ADR: RedisCartPersister stores carts in Redis; 6.7 selects it via shopware.cart.storage.type redis plus storage.config.connection; compress optional."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record explaining why Shopware added `Shopware\Core\Checkout\Cart\RedisCartPersister`, a cart persister that stores the serialized cart in Redis instead of the database. Loading a cart wrote it back to the database after validation (breaking primary/replica setups), and the serialized carts caused high network traffic.

## When to use

- You run a primary/replica database setup or high cart traffic and want carts out of MySQL.
- You need to configure cart storage, cart compression, or move carts between MySQL and Redis.

## Key steps / config

1. Define a Redis connection under `shopware.redis.connections` and select Redis cart storage in `config/packages/*.yaml` (the installed code uses a storage type plus a named connection):

```yaml
shopware:
    cart:
        compress: false
        storage:
            type: "redis"   # mysql (default) | redis
            config:
                connection: "<connection name>"
```

2. `CartStorageCompilerPass` reads `shopware.cart.storage.type`:
   - `mysql` — removes the `shopware.cart.redis` service and the `RedisCartPersister` definition.
   - `redis` — throws if `shopware.cart.storage.config.connection` is `null`; otherwise removes `CartPersister` and aliases `CartPersister` to `RedisCartPersister`.
3. Optional compression: `shopware.cart.compress` (default `false`) and `shopware.cart.compression_method` (default `gzip`), consumed by `CartCompressor`.
4. Carts expire after `shopware.cart.expire_days` (default `120`).
5. To move existing carts between storages, run `bin/console cart:migrate <from> [url]` with `from` = `redis` or `sql`.

## Essential identifiers

- `Shopware\Core\Checkout\Cart\RedisCartPersister` (extends `AbstractCartPersister`; Redis key prefix `cart-persister-`)
- `AbstractCartPersister` members: `getDecorated()`, `load()`, `save()`, `delete()`, `replace()`
- `Shopware\Core\Checkout\DependencyInjection\CompilerPass\CartStorageCompilerPass`
- `shopware.cart.storage.type`, `shopware.cart.storage.config.connection`, `shopware.cart.compress`, `shopware.cart.expire_days`
- Service id `shopware.cart.redis`; command `cart:migrate`

## Gotchas

- The ADR configures Redis with `shopware.cart.redis_url` and describes a `CartRedisCompilerPass`; neither exists in 6.7. Use `storage.type`/`storage.config.connection` and `CartStorageCompilerPass` instead.
- The ADR implies compression is on by default ("can be deactivated again"); in the installed code `compress` defaults to `false`.
- The ADR says there is no migration path between storages; 6.7 ships the `cart:migrate` command.
- Selecting `redis` without a connection fails at container compile time.

## Code check (6.7.13.0)
- absent `Shopware\Core\Checkout\DependencyInjection\CompilerPass\CartRedisCompilerPass` — replaced by CartStorageCompilerPass in the same namespace
- absent `shopware.cart.redis_url` — replaced by shopware.cart.storage.type and shopware.cart.storage.config.connection
- confirmed `RedisCartPersister` — extends AbstractCartPersister — vendor/shopware/core/Checkout/Cart/RedisCartPersister.php:20
- confirmed `AbstractCartPersister::getDecorated()` — abstract, also load/save/delete/replace — vendor/shopware/core/Checkout/Cart/AbstractCartPersister.php:19
- confirmed `CartStorageCompilerPass` — switches on storage type, aliases CartPersister for redis — vendor/shopware/core/Checkout/DependencyInjection/CompilerPass/CartStorageCompilerPass.php:16
- confirmed `shopware.cart.storage.config.connection` — required for redis, else exception — vendor/shopware/core/Checkout/DependencyInjection/CompilerPass/CartStorageCompilerPass.php:28
- confirmed `storage` — enum type mysql/redis default mysql, config.connection default null — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:896
- corrected `compress` — docs: compression enabled unless deactivated; default false — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:889
- corrected `cart:migrate` — docs: no migration path between storages — vendor/shopware/core/Checkout/Cart/Command/CartMigrateCommand.php:30
- confirmed `shopware.cart.redis` — Redis service built from storage.config.connection — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:552
