---
id: platform/dev/6.7/resources/references/adr/2021-11-09-increment-pattern.md
title: Introduce increment pattern
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-11-09-increment-pattern.html
sourceHash: bc86584f734e75a781864686456b4e371da821de
codeCheckedAgainst: "6.7.15.1"
keywords: ["increment", "AbstractIncrementer", "IncrementGatewayRegistry", "IncrementerGatewayCompilerPass", "shopware.increment", "message_queue_stats", "increment pool", "counter", "redis", "mysql", "user_activity", "frequently used modules"]
summary: "ADR (2021-11-09): increment table and pluggable gateway (mysql/redis/array) per pool via shopware.increment, replacing the message_queue_stats table."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record introducing the increment pattern: a generic store for counters behind a swappable gateway. It replaced the `message_queue_stats` table, which caused bottlenecks and deadlocks on write-heavy systems because every queued message triggered an insert/duplicate-key update via MySQL. The admin's "Frequently Used modules" counter had the same problem.

## When to use

Read this when configuring counter storage (e.g. moving it to Redis), implementing a custom incrementer gateway, or working with the increment API endpoints.

## Key steps / config

1. Counters live in the new `increment` table by default, accessed through gateways instead of the DAL.
2. A gateway extends `Shopware\Core\Framework\Increment\AbstractIncrementer`. Abstract members in the installed code:
   - `increment(string $cluster, string $key): void`
   - `decrement(string $cluster, string $key): void`
   - `list(string $cluster, int $limit = 5, int $offset = 0): array` (limit `-1` = no limit)
   - `reset(string $cluster, ?string $key = null): void`
   - concrete: `getPool(): string`, `getConfig(): array`; `delete(string $cluster, array $keys = [])` becomes abstract in v6.8.0.
3. Pools are configured under `shopware.increment`; each pool has a `type` and an optional free-form `config`. Shipped adapter types: `mysql`, `redis`, `array`. Shopware's defaults define `user_activity` and `message_queue` as `mysql`.

```yaml
shopware:
    increment:
        user_activity:
            type: 'mysql'
        message_queue:
            type: 'redis'
            config:
                connection: 'my_redis_connection'
        custom_pool:
            type: 'array'
```

4. `IncrementerGatewayCompilerPass` resolves each pool to the service id `shopware.increment.<pool>.gateway.<type>`. If you register a service with that id, it is used (override); otherwise `mysql`/`array` are cloned from `shopware.increment.gateway.<type>`, and `redis` is built from the named `config.connection`. The class must extend `AbstractIncrementer`; it gets the `shopware.increment.gateway` tag and `setPool()`/`setConfig()` calls.
5. Admin API endpoints (ACL `increment:manage`): `POST /api/_action/increment/{pool}`, `POST /api/_action/decrement/{pool}`, `GET /api/_action/increment/{pool}`, `POST /api/_action/reset-increment/{pool}`, `DELETE /api/_action/delete-increment/{pool}`.

## Essential identifiers

- `Shopware\Core\Framework\Increment\AbstractIncrementer`
- `Shopware\Core\Framework\Increment\IncrementGatewayRegistry`
- `Shopware\Core\Framework\Increment\IncrementerGatewayCompilerPass`
- `MySQLIncrementer`, `RedisIncrementer`, `ArrayIncrementer`
- `shopware.increment`, `shopware.increment.<custom_pool>.gateway.<adapter>`
- `api.increment.increment`, `api.increment.list`, `api.increment.reset`

## Gotchas

- The ADR's Redis example uses `config.url`; the installed compiler pass only reads `config.connection` (a named Redis connection). Without it, the `redis` type expects you to have registered `shopware.increment.<pool>.gateway.redis` yourself, or the container build fails.
- The ADR lists `reset()` returning `array` and a `getDecorated()` method; the installed `AbstractIncrementer` declares `reset()` as `void` and has no `getDecorated()`.
- The `message_queue_stats` table was dropped in a 6.5 migration (data was migrated into `increment` in 6.4).

## Version notes

- 6.7: the increment-based message queue statistics are deprecated for 6.8 (`shopware.admin_worker.enable_queue_stats_worker` is deprecated; use `shopware.messenger.stats.enabled`). `AbstractIncrementer::delete()` becomes abstract in 6.8.

## Code check (6.7.15.1)
- confirmed `AbstractIncrementer::increment()` — abstract gateway method — vendor/shopware/core/Framework/Increment/AbstractIncrementer.php:21
- confirmed `AbstractIncrementer::list()` — default limit 5, offset 0 — vendor/shopware/core/Framework/Increment/AbstractIncrementer.php:28
- corrected `AbstractIncrementer::reset()` — docs: returns array; code: void — vendor/shopware/core/Framework/Increment/AbstractIncrementer.php:30
- corrected `AbstractIncrementer` — docs: gateway has getDecorated(): self; class declares none — vendor/shopware/core/Framework/Increment/AbstractIncrementer.php:10
- confirmed `shopware.increment.%s.gateway.%s` — per-pool gateway service id — vendor/shopware/core/Framework/Increment/IncrementerGatewayCompilerPass.php:30
- corrected `config.connection` — docs: config.url for redis pool — vendor/shopware/core/Framework/Increment/IncrementerGatewayCompilerPass.php:88
- confirmed `user_activity` — default pool, type mysql — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:221
- confirmed `increment` — config node with type and config per pool — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1133
- deprecated `enable_queue_stats_worker` — removed in 6.8.0 — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:266
- confirmed `message_queue_stats` — table dropped by migration — vendor/shopware/core/Migration/V6_5/Migration1675082889DropUnusedTables.php:22
