---
docType: developer
id: platform/dev/6.6/guides/hosting/performance/increment.md
sourceHash: 818bb8d4663ebd4c80fab57f0bd5258f699a2aee
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/performance/increment.html
title: Increment Storage
version: "6.6"
versions: ["6.6"]
keywords: ["increment storage", "shopware.increment.user_activity", "shopware.increment.message_queue", "increment table", "config/packages/shopware.yml", "volatile-lru", "Queue Notification", "Module Usage Overview", "redis", "array storage"]
summary: "Configuring or disabling Shopware's increment storage (queue/user-activity status) via Redis or in-memory array adapter."
lastBuilt: "2026-09-15"
---
## What it is

This page documents the increment storage, used to track and display status in the Administration (message queue status, last-used module per user), stored transaction-safely with locks.

## When to use

Use it when the default `increment` database table is locked frequently by many message consumers, degrading worker performance, and a different storage backend or disabling it entirely is needed.

## Key steps / config

Create `config/packages/shopware.yml`. Before v6.6.8.0:

```yaml
shopware:
    increment:
        user_activity:
          type: 'redis'
          config:
            url: 'redis://host:port/dbindex'
        message_queue:
          type: 'redis'
          config:
            url: 'redis://host:port/dbindex'
```

Since v6.6.8.0:

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

To disable the increment storage entirely (Queue Notification and Module Usage Overview will stop working):

```yaml
shopware:
    increment:
        user_activity:
            type: 'array'
        message_queue:
            type: 'array'
```

## Essential identifiers

- `shopware.increment.user_activity`
- `shopware.increment.message_queue`
- `increment` database table

## Gotchas

Recommended Redis key eviction policy is `volatile-lru` for durability; for persistence across a Redis restart use snapshots (RDB) and Append Only Files (AOF).

## Version notes

The config shape changed at v6.6.8.0: before it, each increment type had its own `config.url`; since v6.6.8.0, a shared `shopware.redis.connections` entry is referenced by `config.connection`.
