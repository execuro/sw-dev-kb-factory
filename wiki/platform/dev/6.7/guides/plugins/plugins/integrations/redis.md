---
id: platform/dev/6.7/guides/plugins/plugins/integrations/redis.md
title: Redis
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/integrations/redis.html
sourceHash: 58264e6875d3e1da5bf68ad4e2af24f508c34ec3
codeCheckedAgainst: "6.7.13.0"
keywords: ["redis", "RedisConnectionProvider", "getConnection", "hasConnection", "shopware.redis.connections", "dsn", "redis connection", "service factory", "RedisAdapter::createConnection", "Relay", "RedisCluster", "Predis", "optional dependency"]
summary: "Plugin access to shopware.redis.connections: inject RedisConnectionProvider, use it as service factory, or inject the connection service id."
lastBuilt: 2026-09-15
---
## What it is

Since Shopware 6.6.8.0, Redis connections are defined centrally by name and can be consumed by project and plugin code. This page shows the three ways to get such a connection in your services and the behaviour of the connection objects.

## When to use

Your plugin or project service needs a Redis connection that is configured in the shop's Redis configuration (hosting guide "Redis configuration") instead of creating its own client.

## Key steps / config

Connections are named entries under `shopware.redis.connections`, each with a required `dsn`:

```yaml
shopware:
    redis:
        connections:
            <name>:
                dsn: '...'
```

1. **Inject the provider** `Shopware\Core\Framework\Adapter\Redis\RedisConnectionProvider` and look connections up by name:

```php
$services->set(MyCustomService::class)
    ->args([service(RedisConnectionProvider::class), '<name>']);

// in MyCustomService
if ($this->redisConnectionProvider->hasConnection($this->connectionName)) {
    $connection = $this->redisConnectionProvider->getConnection($this->connectionName);
}
```

`getConnection()` throws for an unknown name; check `hasConnection()` first.

2. **Use the provider as a factory** to define a shared connection service:

```php
$services->set('my.custom.redis_connection', \Redis::class)
    ->factory([service(RedisConnectionProvider::class), 'getConnection'])
    ->args(['<name>']);
$services->set(MyCustomService::class)
    ->args([service('my.custom.redis_connection')]);
```

Type the constructor argument loosely (the source uses `object $redisConnection`). Useful when several services share one connection.

3. **Inject the connection service directly** by its container id (id format under Gotchas).

## Essential identifiers

- `Shopware\Core\Framework\Adapter\Redis\RedisConnectionProvider` — `getConnection(string $connectionName)`, `hasConnection(string $connectionName): bool`
- Config `shopware.redis.connections.<name>.dsn`
- `\Symfony\Component\Cache\Adapter\RedisAdapter::createConnection`

## Gotchas

- Direct injection: the source example `service('shopware.redis.connection.connection_name')` is a placeholder — the real id is `shopware.redis.connection.` followed by your configured connection name. Renaming a connection in config breaks the container build for services that reference the id directly.
- Connection objects come from `\Symfony\Component\Cache\Adapter\RedisAdapter::createConnection` and, depending on extensions/libraries and DSN, may be `\Redis|Relay|\RedisArray|\RedisCluster|\Predis\ClientInterface` — avoid strict `instanceof`/type hints.
- Connections are cached in a static variable and reused: the core factory keys the cache by DSN plus connection options and prefix, so identical DSNs share one object. Closing it or changing options affects every service using it.
- The connection is established when `RedisConnectionProvider::getConnection` is called, when the connection service is requested from the container, or when a service depending on it is instantiated (connection services are not lazy).
- Redis is optional in Shopware; plugins must not assume it is available.

## Version notes

- Improved named-connection support was introduced in Shopware 6.6.8.0.

## Code check (6.7.13.0)
- absent `shopware.redis.connection.connection_name` — literal example id; real ids are built from the configured connection name
- confirmed `RedisConnectionProvider::getConnection()` — throws for unknown names — vendor/shopware/core/Framework/Adapter/Redis/RedisConnectionProvider.php:28
- confirmed `RedisConnectionProvider::hasConnection()` — checks the service locator — vendor/shopware/core/Framework/Adapter/Redis/RedisConnectionProvider.php:37
- confirmed `RedisConnectionsCompilerPass::prepareConnections()` — registers one service per configured name with the prefixed id — vendor/shopware/core/Framework/Adapter/Redis/RedisConnectionsCompilerPass.php:33
- confirmed `connections` — shopware.redis.connections keyed by name — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1588
- confirmed `dsn` — required per connection — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1592
- corrected `RedisConnectionFactory::create()` — docs: reuse based on DSN only; code keys by DSN, options hash and prefix — vendor/shopware/core/Framework/Adapter/Cache/RedisConnectionFactory.php:44
- confirmed `RedisAdapter::createConnection` — called by the core factory — vendor/shopware/core/Framework/Adapter/Cache/RedisConnectionFactory.php:52
- confirmed `setLazy` — connection services are defined non-lazy — vendor/shopware/core/Framework/Adapter/Redis/RedisConnectionsCompilerPass.php:77
