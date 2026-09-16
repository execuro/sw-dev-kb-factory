---
id: platform/dev/6.6/guides/hosting/infrastructure/database-cluster.md
title: Database Cluster
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/infrastructure/database-cluster.html
sourceHash: 10aa2b54b1c99c0136454e58679e60f20af005d7
keywords: ["database cluster", "read-write splitting", "DATABASE_URL", "DATABASE_REPLICA_x_URL", "DebugStack", "executeStatement", "MySQL replication", "cart:migrate", "group_concat_max_len", "sql_mode", "ONLY_FULL_GROUP_BY", "SQL_SET_DEFAULT_SESSION_VARIABLES", "cart in redis"]
summary: "Explains MySQL primary/replica read-write splitting, required MySQL settings, cart-in-Redis, and DATABASE_URL/DATABASE_REPLICA_x_URL config."
lastBuilt: 2026-09-15
---
## What it is
Describes how to scale Shopware using a MySQL database cluster with a single primary and multiple read-only replicas, available since Shopware 6.4.12.0.

## When to use
Use it when scaling Shopware beyond a single database server, splitting read and write queries across a primary/replica MySQL cluster.

## Key steps / config
- Shopware splits SQL reads and writes by default; a write query (`INSERT`/`UPDATE`/`DELETE`) is routed to the primary, and the current connection then uses the primary only for the rest of the request. This is enforced by the `executeStatement` method in the `DebugStack` decoration (`Shopware\Core\Profiling\Doctrine\DebugStack`).
- Preparing the MySQL server: ensure `group_concat_max_len` is at least `320000`, and `sql_mode` does not contain `ONLY_FULL_GROUP_BY`. Once configured directly on the server, you can set `SQL_SET_DEFAULT_SESSION_VARIABLES=0` in `.env` so Shopware skips the runtime check.
- Storing carts in Redis reduces write load on the read-only cluster. Add to `config/packages/cart.yml`:

```yaml
shopware:
    cart:
        redis_url: 'redis://localhost:6379/0?persistent=1'
```

Use the `cart:migrate` command to migrate carts between MySQL and Redis without affecting end users.
- Configure the cluster in `.env` with `DATABASE_URL` (primary connection string) and `DATABASE_REPLICA_x_URL` (e.g. `DATABASE_REPLICA_0_URL`, `DATABASE_REPLICA_1_URL`) for each read-only server.

## Essential identifiers
- `DATABASE_URL`
- `DATABASE_REPLICA_x_URL`
- `SQL_SET_DEFAULT_SESSION_VARIABLES`
- `Shopware\Core\Profiling\Doctrine\DebugStack::executeStatement`
- `cart:migrate` CLI command
- `group_concat_max_len`, `sql_mode`

## Gotchas
Read-write consistency is guaranteed only within the same request; replication lag between the primary and read-only nodes is not accounted for by Shopware and is left to the database replication process.

## Version notes
Database cluster support is available starting with Shopware 6.4.12.0.
