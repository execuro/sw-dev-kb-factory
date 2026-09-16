---
id: platform/dev/6.6/resources/references/adr/2022-03-25-redis-cart-persister.md
title: Redis cart persister
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-03-25-redis-cart-persister.html"
sourceHash: 194b8d10fbc8750753bf0d810da436b7fa9ede55
keywords: ["RedisCartPersister", "AbstractCartPersister", "CartRedisCompilerPass", "shopware.cart.redis_url", "shopware.cart.compress", "cart persistence", "redis", "checkout", "cart storage", "master-slave", "database load"]
summary: "Documents RedisCartPersister, an alternative Redis-backed cart storage configured via shopware.cart.redis_url and shopware.cart.compress."
lastBuilt: "2026-09-15"
---
## What it is

ADR documenting `Shopware\Core\Checkout\Cart\RedisCartPersister`, an alternative cart storage backend that persists the shopping cart in Redis instead of the database.

## When to use

Relevant when diagnosing high database load caused by cart read/write traffic, when the store needs to preserve a working master-slave database setup, or when configuring Redis-backed cart persistence.

## Key steps / config

- The default cart persister re-writes the cart to the database on every load (after validation), which forces a write on the database connection and breaks master-slave database setups; it also serializes the whole cart object, producing large payloads sent over the internal network.
- `RedisCartPersister extends AbstractCartPersister` and implements `load()`, `save()`, `delete()` and `replace()` against a `\Redis`/`\RedisCluster` connection, using an `EventDispatcherInterface` and a `$compress` flag.
- Enable it by configuring a Redis connection URL in `config/packages/*.yaml`:

```yaml
shopware:
    cart:
        redis_url: 'redis://redis'
```

- If `shopware.cart.redis_url` is not set, `Shopware\Core\Checkout\DependencyInjection\CompilerPass\CartRedisCompilerPass` removes the `shopware.cart.redis` and `RedisCartPersister::class` service definitions from the container, so the default database-backed persister remains active. When Redis is configured, the same compiler pass removes `CartPersister::class` and aliases it to `RedisCartPersister::class`.
- Cache compression is on by default to cut network traffic and can be turned off:

```yaml
shopware:
    cart:
        compress: false
```

## Essential identifiers

- `Shopware\Core\Checkout\Cart\RedisCartPersister`
- `Shopware\Core\Checkout\DependencyInjection\CompilerPass\CartRedisCompilerPass`
- config keys `shopware.cart.redis_url`, `shopware.cart.compress`

## Gotchas

There is no migration path to move an existing shopping cart from one storage backend to the other — switching between the database persister and the Redis persister does not carry carts over.
