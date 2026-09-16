---
docType: developer
id: platform/dev/6.6/guides/hosting/performance/cart-storage.md
sourceHash: 69497e288495e2b05374004615db5d696afecaf0
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/performance/cart-storage.html
title: Cart Storage
version: "6.6"
versions: ["6.6"]
keywords: ["cart storage", "redis_url", "shopware.cart.redis_url", "shopware.cart.storage", "shopware.redis.connections", "cart:migrate", "binlog", "high throughput", "volatile-lru", "config/packages/shopware.yml"]
summary: "Storing the shopping cart in Redis instead of the database for high-throughput scenarios, plus migration between storages."
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to move Shopware's cart storage from the database to Redis to avoid a performance bottleneck under high order throughput.

## When to use

Use it when running thousands of orders per minute, especially with a DB cluster using read/write splitting, where the default DB-backed cart table causes `binlog` growth and lock contention.

## Key steps / config

Create `config/packages/shopware.yml`:

Before v6.6.8.0:

```yaml
shopware:
  cart:
    redis_url: 'redis://host:port/dbindex?persistent=1'
```

Since v6.6.8.0:

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

The `?persistent=1` parameter refers to connection pooling, not persistent data storage.

Migrate existing carts between storages:

```shell
bin/console cart:migrate {fromStorage} {redisUrl?}
```

The Redis URL argument is optional; if omitted, the configured value is used (or is required if not configured). Example, migrating from SQL to Redis:

```shell
bin/console cart:migrate sql
```

## Essential identifiers

- `shopware.cart.redis_url`
- `shopware.cart.storage`
- `shopware.redis.connections`
- `bin/console cart:migrate`

## Gotchas

For durability across a Redis restart, configure snapshots (RDB) and Append Only Files (AOF) persistence. Recommended key eviction policy is `volatile-lru`, since it only deletes expired data rather than risking active cart loss.

## Version notes

The config shape changed at v6.6.8.0: before it, cart Redis config used `shopware.cart.redis_url` directly; since v6.6.8.0, it uses `shopware.redis.connections` plus `shopware.cart.storage.config.connection`.
