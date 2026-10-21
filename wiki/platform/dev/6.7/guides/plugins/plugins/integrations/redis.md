---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/integrations/redis.md
sourceHash: 58264e6875d3e1da5bf68ad4e2af24f508c34ec3
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/integrations/redis.html
title: Redis
version: "6.7"
versions:
  - "6.7"
keywords: ["RedisConnectionProvider", "Shopware\\Core\\Framework\\Adapter\\Redis\\RedisConnectionProvider", "getConnection", "hasConnection", "shopware.redis.connections", "RedisAdapter::createConnection", "RedisConnectionFactory", "redis", "redis connection", "named connection", "plugin redis access", "cache"]
summary: Access named Redis connections in plugins via RedisConnectionProvider (inject, factory, or service id); connection types, reuse and lazy init (6.6.8+).
lastBuilt: 2026-10-21
---
## What it is

How plugin code obtains the named Redis connections configured for a Shopware installation (available since Shopware 6.6.8.0). Connections are defined in the Redis hosting configuration and exposed through `Shopware\Core\Framework\Adapter\Redis\RedisConnectionProvider`.

## When to use

Your plugin or project service needs a Redis client and should reuse a connection configured centrally instead of building its own DSN handling.

## Key steps / config

Three ways to get a connection:

1. Inject the provider and look up by name at runtime (safe if the name may not exist):

```php
$services->set(MyCustomService::class)
    ->args([service(Shopware\Core\Framework\Adapter\Redis\RedisConnectionProvider::class), '%your.parameter%']);
// in the service:
if ($this->redisConnectionProvider->hasConnection($this->connectionName)) {
    $connection = $this->redisConnectionProvider->getConnection($this->connectionName);
}
```

2. Use the provider as a factory so several services share one connection service:

```php
$services->set('my.custom.redis_connection', \Redis::class)
    ->factory([service(Shopware\Core\Framework\Adapter\Redis\RedisConnectionProvider::class), 'getConnection'])
    ->args(['%your.parameter%']);
$services->set(MyCustomService::class)->args([service('my.custom.redis_connection')]);
```

Type the constructor argument loosely (the source uses `object`), since the concrete class varies.

3. Inject the connection service directly by id. Each entry under the `shopware.redis.connections` parameter is registered as service `shopware.redis.connection.` followed by its configured name. Renaming the connection in config breaks the container build.

`%your.parameter%` above stands for a container parameter holding the connection name.

## Essential identifiers

- `Shopware\Core\Framework\Adapter\Redis\RedisConnectionProvider` — `getConnection(string $connectionName)`, `hasConnection(string $connectionName): bool`
- Container parameter `shopware.redis.connections` (each entry needs a `dsn`)
- Service id prefix `shopware.redis.connection.`
- `\Symfony\Component\Cache\Adapter\RedisAdapter::createConnection`

## Gotchas

- The source shows `service('shopware.redis.connection.connection_name')` — `connection_name` is a placeholder for your configured connection name, not a real service.
- Connection objects may be `\Redis|Relay|\RedisArray|\RedisCluster|\Predis\ClientInterface` depending on installed extensions and the DSN — avoid strict `instanceof`/type hints.
- Connections are cached in a static variable keyed by DSN; connections sharing a DSN share one object, so closing it or changing options affects every user.
- The connection is established when `RedisConnectionProvider::getConnection` is called, when the connection service is requested, or when a service depending on it is instantiated. Connection services are not lazy; for deferred connection, inject the provider.
- `getConnection()` throws for an unknown name; check with `hasConnection()` first.
- Redis is optional in Shopware — plugins must handle installations without it.

## Version notes

- Improved Redis connection support starts with Shopware 6.6.8.0.

## Code check (6.7.15.1)
- absent `shopware.redis.connection.connection_name` — doc placeholder; real ids are built from configured names
- confirmed `RedisConnectionProvider::getConnection()` — throws `unknownRedisConnection` if missing — vendor/shopware/core/Framework/Adapter/Redis/RedisConnectionProvider.php:28
- confirmed `RedisConnectionProvider::hasConnection()` — checks the service locator — vendor/shopware/core/Framework/Adapter/Redis/RedisConnectionProvider.php:37
- confirmed `shopware.redis.connection.` — service id prefix per configured name — vendor/shopware/core/Framework/Adapter/Redis/RedisConnectionsCompilerPass.php:50
- confirmed `shopware.redis.connections` — parameter read; each entry requires `dsn` — vendor/shopware/core/Framework/Adapter/Redis/RedisConnectionsCompilerPass.php:37
- confirmed `setLazy` — connection service definitions are set non-lazy — vendor/shopware/core/Framework/Adapter/Redis/RedisConnectionsCompilerPass.php:72
- confirmed `RedisConnectionFactory::$connections` — static cache reused across requests — vendor/shopware/core/Framework/Adapter/Cache/RedisConnectionFactory.php:28
- confirmed `RedisAdapter::createConnection` — used to create the client — vendor/shopware/core/Framework/Adapter/Cache/RedisConnectionFactory.php:52
