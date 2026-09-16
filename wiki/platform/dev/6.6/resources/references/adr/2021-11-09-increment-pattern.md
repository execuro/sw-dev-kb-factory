---
id: platform/dev/6.6/resources/references/adr/2021-11-09-increment-pattern.md
title: Introduce increment pattern
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-11-09-increment-pattern.html
sourceHash: bc86584f734e75a781864686456b4e371da821de
keywords: ["increment pattern", "message_queue_stats", "increment table", "Frequently Used modules", "increment gateway", "shopware.increment", "redis adapter", "mysql adapter", "array adapter", "getDecorated", "message queue stats"]
summary: ADR replacing the message_queue_stats table with a configurable increment gateway (mysql/redis/array pools) to reduce write contention.
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record introducing a new `increment` table and pluggable gateway to replace the deprecated `message_queue_stats` table, which caused bottlenecks and deadlocks under heavy write traffic.

## When to use
Relevant when tracking countable stats (message queue counts, "Frequently Used modules" visit counts) that need high write throughput without hitting the main database directly.

## Key steps / config
New gateway interface methods:
- `increment(string $cluster, string $key): void`
- `decrement(string $cluster, string $key): void`
- `list(string $cluster, int $limit = 5, int $offset = 0): array`
- `reset(string $cluster, ?string $key = null): array`
- `getPool(): string`
- `getConfig(): array`
- `getDecorated(): self`

Pools are configured per adapter in the config file:

```yaml
shopware:
    increment:
        user_activity:
            type: 'mysql'
        message_queue:
            type: 'redis'
            config:
                url: 'redis://localhost'
        custom_pool:
          type: 'array'
```

Shipped adapters: Redis, MySQL, array. Custom adapters register in the DI container with id `shopware.increment.<custom_pool>.gateway.<adapter>`.

## Essential identifiers
- `shopware.increment` config node
- `shopware.increment.<custom_pool>.gateway.<adapter>` (DI service id pattern)
- `increment` table (replaces `message_queue_stats`)

## Gotchas
- `message_queue_stats` DAL classes, its API endpoint, its services and the table itself are all deprecated; they are removed entirely in the next major.
- The message queue stats feature (or any individual pool) can be disabled entirely via config.

## Version notes
Deprecations of `message_queue_stats` are removed with the next major version after this ADR.
