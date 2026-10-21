---
id: platform/dev/6.7/resources/references/adr/2022-03-25-redis-cart-persister.md
title: Redis cart persister
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-redis-cart-persister.html
sourceHash: 194b8d10fbc8750753bf0d810da436b7fa9ede55
codeCheckedAgainst: "6.7.15.1"
keywords: ["Shopware\\Core\\Checkout\\Cart\\RedisCartPersister", "AbstractCartPersister", "CartPersister", "CartStorageCompilerPass", "shopware.cart.storage.type", "shopware.cart.storage.config.connection", "shopware.cart.compress", "shopware.cart.redis", "cart:migrate", "redis", "cart storage", "shopping cart persistence", "master-slave database"]
summary: "ADR: RedisCartPersister keeps carts in Redis; in 6.7 enabled via shopware.cart.storage.type redis plus a named Redis connection."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-03-25) introducing `Shopware\Core\Checkout\Cart\RedisCartPersister`, an `AbstractCartPersister` implementation that keeps shopping carts in Redis instead of the database. Benchmarks had shown two problems with database storage: every cart load wrote the cart back after validation (a write on the connection, breaking master-slave database setups), and the serialized cart objects sent large amounts of data through the internal network.

## When to use

When cart load/save is a database bottleneck, or when reads should be served from a replica without cart writes on the same connection.

## Key steps / config

1. Switch cart storage to Redis in `config/packages/*.yaml` (6.7 config shape):

```yaml
shopware:
    cart:
        compress: false
        storage:
            type: "redis"          # mysql (default) | redis
            config:
                connection: "..."  # name of a configured Redis connection
```

2. `CartStorageCompilerPass` reads `shopware.cart.storage.type`: for `mysql` it removes the `shopware.cart.redis` service and `RedisCartPersister`; for `redis` it throws if `shopware.cart.storage.config.connection` is null, removes `CartPersister` and aliases `CartPersister::class` to `RedisCartPersister::class`. The `shopware.cart.redis` service is built by `RedisConnectionProvider::getConnection()` from that connection name.
3. Compression of the serialized cart is controlled by `shopware.cart.compress` (default `false` in 6.7) and `shopware.cart.compression_method` (default `gzip`), both passed to `CartCompressor`.
4. A custom persister extending `AbstractCartPersister` must declare all abstract members:

```php
class RedisCartPersister extends AbstractCartPersister
{
    public function getDecorated(): AbstractCartPersister { /* ... */ }
    public function load(string $token, SalesChannelContext $context): Cart { /* ... */ }
    public function save(Cart $cart, SalesChannelContext $context): void { /* ... */ }
    public function delete(string $token, SalesChannelContext $context): void { /* ... */ }
    public function replace(string $oldToken, string $newToken, SalesChannelContext $context): void { /* ... */ }
}
```

## Essential identifiers

- `Shopware\Core\Checkout\Cart\RedisCartPersister`, `Shopware\Core\Checkout\Cart\AbstractCartPersister`, `CartPersister`
- `Shopware\Core\Checkout\DependencyInjection\CompilerPass\CartStorageCompilerPass`
- `shopware.cart.storage.type`, `shopware.cart.storage.config.connection`, `shopware.cart.compress`, `shopware.cart.compression_method`
- service id `shopware.cart.redis`; command `cart:migrate`

## Gotchas

- The ADR's `shopware.cart.redis_url` key and `\Shopware\Core\Checkout\DependencyInjection\CompilerPass\CartRedisCompilerPass` no longer exist in 6.7.15.1; configuring the old key does nothing. Use `storage.type`/`storage.config.connection`.
- With `storage.type: redis` and no connection, container compilation fails with `CHECKOUT__CART_REDIS_NOT_CONFIGURED`.
- The ADR says compression is on and can be turned off with `compress: false`; in 6.7 `shopware.cart.compress` defaults to `false`, so it must be enabled explicitly.
- The ADR notes there was no migration path between storages; 6.7 ships `cart:migrate` (described as "Migrate carts from redis to database").

## Version notes

The ADR's single `redis_url` switch was replaced by the `shopware.cart.storage` block (`type` + `config.connection`) and the compiler pass was renamed to `CartStorageCompilerPass`.

## Code check (6.7.15.1)
- absent `Shopware\Core\Checkout\DependencyInjection\CompilerPass\CartRedisCompilerPass` — not in the installed code; replaced by CartStorageCompilerPass
- absent `shopware.cart.redis_url` — not in the installed code; replaced by `shopware.cart.storage.*`
- confirmed `CartStorageCompilerPass` — switches on `shopware.cart.storage.type` — vendor/shopware/core/Checkout/DependencyInjection/CompilerPass/CartStorageCompilerPass.php:16
- confirmed `shopware.cart.storage.config.connection` — required (non-null) for `redis` type — vendor/shopware/core/Checkout/DependencyInjection/CompilerPass/CartStorageCompilerPass.php:28
- confirmed `storage.type` — enum `mysql`/`redis`, default `mysql` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:934
- corrected `compress` — docs: compression enabled by default; default is `false` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:925
- confirmed `RedisCartPersister` — extends `AbstractCartPersister` — vendor/shopware/core/Checkout/Cart/RedisCartPersister.php:21
- confirmed `AbstractCartPersister::getDecorated()` — abstract, alongside load/save/delete/replace — vendor/shopware/core/Checkout/Cart/AbstractCartPersister.php:21
- confirmed `shopware.cart.redis` — built from the named connection via RedisConnectionProvider — vendor/shopware/core/Checkout/DependencyInjection/cart.php:739
- corrected `cart:migrate` — docs: no migration path between storages — vendor/shopware/core/Checkout/Cart/Command/CartMigrateCommand.php:31
