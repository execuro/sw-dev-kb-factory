---
docType: developer
id: platform/dev/6.6/guides/hosting/performance/number-ranges.md
sourceHash: 234a7a1a5517552a1a57f2463c6f3eeb8f8784d6
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/performance/number-ranges.html
title: Number Ranges
version: "6.6"
versions: ["6.6"]
keywords: ["number ranges", "shopware.number_range.increment_storage", "number-range:migrate", "order numbers", "invoice numbers", "atomic increment", "volatile-lru", "config/packages/shopware.yml", "shopware.redis.connections"]
summary: "Storing Shopware's atomic number range sequences (order/invoice numbers) in Redis instead of the database for high throughput."
lastBuilt: "2026-09-15"
---
## What it is

This page explains Number Ranges, which generate consecutive number sequences (order numbers, invoice numbers, etc.) via an atomic operation, and how to move their storage from the database to Redis.

## When to use

Use it in high-throughput scenarios (e.g., thousands of orders per minute) where the database becomes a bottleneck due to the atomicity requirement of number range generation.

## Key steps / config

Create `config/packages/shopware.yml`. Before v6.6.8.0:

```yaml
shopware:
    number_range:
        increment_storage: "Redis"
        redis_url: 'redis://host:port/dbindex'
```

Since v6.6.8.0:

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

Migrate between storages:

```shell
bin/console number-range:migrate {fromStorage} {toStorage}
```

Example, from SQL to Redis:

```shell
bin/console number-range:migrate SQL Redis
```

## Essential identifiers

- `shopware.number_range.increment_storage`
- `bin/console number-range:migrate`

## Gotchas

Redis offers better atomic-increment support than the database, which is why it's recommended for high-throughput number range generation. Recommended key eviction policy is `volatile-lru`, with RDB/AOF persistence for durability across a Redis restart. The migration command is **not atomic** — running it while numbers are actively being generated may produce duplicate numbers, so it should run only during deployment/maintenance windows, not normal operation.
