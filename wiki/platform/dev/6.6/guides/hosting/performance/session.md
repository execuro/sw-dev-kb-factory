---
id: platform/dev/6.6/guides/hosting/performance/session.md
title: Session
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/performance/session.html
sourceHash: 421083fc881cec135699cb5ce3c4746d22306c0f
keywords: ["session", "session storage", "session.save_handler", "php.ini", "redis.yml", "handler_id", "PdoSessionHandler", "MemcachedSessionHandler", "MongoDbSessionHandler", "Redis session", "session adapters", "clustering"]
summary: Describes Shopware's PHP session storage and how to switch to Redis or other Symfony session handlers for clustered setups.
lastBuilt: "2026-09-15"
---
## What it is

This page documents how Shopware handles user sessions. By default, Shopware uses whatever session storage is configured in PHP, which on most installations is the local filesystem.

## When to use

Small setups do not need to change anything, but larger setups using clustering or with a lot of traffic will probably need to configure an alternative session storage, such as Redis, to reduce load on the database.

## Key steps / config

There are two ways to switch the session handler to Redis:

1. Configure Redis directly via `php.ini`:

```ini
session.save_handler = redis
session.save_path = "tcp://host:6379?database=0"
```

Refer to the PhpRedis documentation (`github.com/phpredis/phpredis`) for all possible `save_path` options.

2. Configure Redis via Shopware's own configuration by creating `config/packages/redis.yml`:

```yaml
# config/packages/redis.yml
framework:
    session:
        handler_id: "redis://host:port/0"
```

As session data should be durable across a Redis restart, configure Redis to persist to disk (snapshots/RDB and Append Only Files/AOF), not just keep data in memory. As the key eviction policy, use `allkeys-lru`, which only automatically deletes the least recently used entries once Redis reaches its max memory consumption.

Symfony also ships other PHP session handler implementations that can be wired in as services: `PdoSessionHandler`, `MemcachedSessionHandler`, and `MongoDbSessionHandler` (all under `Symfony\Component\HttpFoundation\Session\Storage\Handler`). To use one, register it as a service and point `handler_id` at that service id, for example:

```xml
<service id="session.db" class="Symfony\Component\HttpFoundation\Session\Storage\Handler\PdoSessionHandler">
    <argument ....></argument>
</service>
```

```yaml
# config/packages/redis.yml
framework:
    session:
        handler_id: "session.db"
```

## Essential identifiers

- `session.save_handler`, `session.save_path` (`php.ini` settings)
- `config/packages/redis.yml`
- `framework.session.handler_id`
- `Symfony\Component\HttpFoundation\Session\Storage\Handler\PdoSessionHandler`
- `Symfony\Component\HttpFoundation\Session\Storage\Handler\MemcachedSessionHandler`
- `Symfony\Component\HttpFoundation\Session\Storage\Handler\MongoDbSessionHandler`
- `allkeys-lru` eviction policy

## Gotchas

Session data stored in Redis should be treated as durable: configure Redis with RDB snapshots and/or AOF persistence so sessions survive a Redis restart, rather than relying on in-memory storage alone.
