---
id: platform/dev/6.6/guides/plugins/plugins/redis.md
title: Redis
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/redis.html
sourceHash: 934a23e638f6beb5e940dba182038f3b2ff14771
keywords: ["Redis", "RedisConnectionProvider", "RedisAdapter", "redis connection", "createConnection", "RedisCluster", "Predis", "Relay", "shopware.redis.connection", "cache adapter"]
summary: "How to access configured Redis connections in plugin code via RedisConnectionProvider, and notes on connection reuse and optionality."
lastBuilt: "2026-09-15"
---
## What it is

Explains how plugins can access Redis connections configured in Shopware (improved starting with Shopware v6.6.8.0) via `Shopware\Core\Framework\Adapter\Redis\RedisConnectionProvider`.

## When to use

When a plugin needs to read/write to a Redis connection that has already been set up in the Shopware Redis configuration.

## Key steps / config

Three ways to access a connection:

1. Inject `RedisConnectionProvider` and retrieve by name:

```xml
<service id="MyCustomService">
    <argument type="service" id="Shopware\Core\Framework\Adapter\Redis\RedisConnectionProvider" />
    <argument>%myservice.redis_connection_name%</argument>
</service>
```

```php
if ($this->redisConnectionProvider->hasConnection($this->connectionName)) {
    $connection = $this->redisConnectionProvider->getConnection($this->connectionName);
}
```

2. Use `RedisConnectionProvider` as a factory for a custom service, useful when multiple services should share the same connection:

```xml
<service id="my.custom.redis_connection" class="Redis">
    <factory service="Shopware\Core\Framework\Adapter\Redis\RedisConnectionProvider" method="getConnection" />
    <argument>%myservice.redis_connection_name%</argument>
</service>
```

3. Inject the connection service directly by name: `shopware.redis.connection.connection_name` (changing the connection name in config will cause container build errors).

## Essential identifiers

- `Shopware\Core\Framework\Adapter\Redis\RedisConnectionProvider`
- `RedisConnectionProvider::hasConnection()`, `RedisConnectionProvider::getConnection()`
- `\Symfony\Component\Cache\Adapter\RedisAdapter::createConnection`
- `shopware.redis.connection.connection_name`

## Gotchas

Connections are cached in a static variable and reused by DSN, so multiple services using the same DSN share one connection object — closing or reconfiguring it affects all of them. `RedisAdapter::createConnection` may return `\Redis`, `Relay`, `\RedisArray`, `\RedisCluster`, or `\Predis\ClientInterface` depending on installed extensions and the DSN. Redis is an optional dependency and might not be available in all installations.
