---
id: platform/dev/6.7/resources/references/adr/2021-11-09-increment-pattern.md
title: Introduce increment pattern
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2021-11-09-increment-pattern.html
sourceHash: bc86584f734e75a781864686456b4e371da821de
codeCheckedAgainst: "6.7.13.0"
keywords: ["increment", "AbstractIncrementer", "IncrementGatewayRegistry", "shopware.increment", "shopware.increment.gateway", "user_activity", "increment pool", "counter", "redis", "mysql", "array adapter", "frequently used modules", "message_queue_stats"]
summary: "ADR 2021-11-09: increment table and pluggable counter gateways (mysql/redis/array) per pool, configured under shopware.increment."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2021-11-09, area `services-settings`) introducing the increment pattern: countable data (message queue statistics, "Frequently Used modules" in the Administration) moves from the per-row `message_queue_stats` table to an `increment` table behind a gateway that can be backed by MySQL, Redis or an in-memory array. Storage is chosen per pool in config, bypassing the DAL to avoid write bottlenecks and deadlocks.

## When to use

When you need a high-write counter (visits, queue sizes) without DAL overhead, want to move an existing pool to Redis, or need to replace the default adapter of a pool with your own gateway.

## Key steps / config

1. Gateways extend `Shopware\Core\Framework\Increment\AbstractIncrementer`. Abstract members a gateway must implement (installed code):
   - `increment(string $cluster, string $key): void`
   - `decrement(string $cluster, string $key): void`
   - `list(string $cluster, int $limit = 5, int $offset = 0): array` (limit `-1` = no limit)
   - `reset(string $cluster, ?string $key = null): void`
   - Concrete, set by the container: `getPool(): string`, `getConfig(): array`.
2. Define or retune pools under `shopware.increment`. Each pool has `type` (`mysql`, `redis`, `array`) and an optional free-form `config`. For `redis`, the compiler pass reads `config.connection` (a connection name resolved through `RedisConnectionProvider::getConnection()`):

```yaml
shopware:
    increment:
        user_activity:
            type: 'mysql'
        custom_pool:
            type: 'redis'
            config:
                connection: '<redis connection name>'
        other_pool:
            type: 'array'
```

3. To override an adapter for a pool, register your own service with the id `shopware.increment.<custom_pool>.gateway.<adapter>`; its class must be a subclass of `AbstractIncrementer`. The compiler pass tags it `shopware.increment.gateway` and calls `setPool()`/`setConfig()`. Without such a service, `mysql`/`array` fall back to `shopware.increment.gateway.<type>`.
4. Fetch a gateway at runtime via `IncrementGatewayRegistry::get(string $pool)`; the pool constant `IncrementGatewayRegistry::USER_ACTIVITY_POOL` is `user_activity`.
5. Admin API: `POST /api/_action/increment/{pool}`, `POST /api/_action/decrement/{pool}`, `GET /api/_action/increment/{pool}`, `POST /api/_action/reset-increment/{pool}`, `DELETE /api/_action/delete-increment/{pool}`.

## Essential identifiers

- `Shopware\Core\Framework\Increment\AbstractIncrementer`
- `Shopware\Core\Framework\Increment\IncrementGatewayRegistry`
- `MySQLIncrementer`, `RedisIncrementer`, `ArrayIncrementer`
- `shopware.increment`, `shopware.increment.gateway` (tag)
- `shopware.increment.<custom_pool>.gateway.<adapter>`
- `increment` table

## Gotchas

- The ADR's Redis example uses `config.url`; the installed compiler pass only reads `config.connection` — with `url` alone no Redis gateway definition is created and container build fails with a gateway-not-found error.
- The ADR lists `reset(): array` and `getDecorated(): self`; the installed abstract class has `reset(): void` and no `getDecorated()`.
- `AbstractIncrementer::delete()` exists but is `@deprecated tag:v6.8.0` (will become abstract) — implement it in custom gateways now.

## Version notes

- The `message_queue` pool, `IncrementGatewayRegistry::MESSAGE_QUEUE_POOL` and the `enable_queue_stats_worker` option are deprecated for 6.8.0; use `shopware.messenger.stats.enabled` instead.
- The old `message_queue_stats` table is dropped by a 6.5 migration.

## Code check (6.7.13.0)
- confirmed `AbstractIncrementer::increment()` — abstract, `(string $cluster, string $key): void` — vendor/shopware/core/Framework/Increment/AbstractIncrementer.php:20
- corrected `AbstractIncrementer::reset()` — docs: returns array; code returns void — vendor/shopware/core/Framework/Increment/AbstractIncrementer.php:29
- corrected `AbstractIncrementer` — docs: gateway has getDecorated(): self; abstract class declares no such member — vendor/shopware/core/Framework/Increment/AbstractIncrementer.php:9
- deprecated `AbstractIncrementer::delete()` — tag:v6.8.0, will become abstract — vendor/shopware/core/Framework/Increment/AbstractIncrementer.php:36
- confirmed `shopware.increment.%s.gateway.%s` — custom gateway service id pattern, tag shopware.increment.gateway — vendor/shopware/core/Framework/Increment/IncrementerGatewayCompilerPass.php:30
- corrected `config.connection` — docs: redis pool config key url; compiler pass reads connection — vendor/shopware/core/Framework/Increment/IncrementerGatewayCompilerPass.php:88
- confirmed `increment` — config node with per-pool type and config — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1097
- deprecated `MESSAGE_QUEUE_POOL` — message_queue pool deprecated for v6.8.0 — vendor/shopware/core/Framework/Increment/IncrementGatewayRegistry.php:16
- corrected `message_queue_stats` — docs: table deprecated; installed migration drops it — vendor/shopware/core/Migration/V6_5/Migration1675082889DropUnusedTables.php:22
- confirmed `api.increment.increment` — POST /api/_action/increment/{pool} — vendor/shopware/core/Framework/Increment/Controller/IncrementApiController.php:27
