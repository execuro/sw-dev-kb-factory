---
id: platform/dev/6.7/resources/references/adr/2023-05-09-optimise-cart-cleanup.md
title: Optimize cart cleanup
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-05-09-optimise-cart-cleanup.html
sourceHash: 5188f7c59e38d89bb7ca84740abfae7ef8517d7f
codeCheckedAgainst: "6.7.15.1"
keywords: ["cart cleanup", "CartPersister::prune()", "CleanupCartTask", "CleanupCartTaskHandler", "idx.cart.created_at", "cart table", "shopware.cart.expire_days", "expired carts", "delete old carts", "sql index", "performance", "adr"]
summary: "ADR 2023-05-09: cart cleanup DELETE filters on indexed created_at first (idx.cart.created_at) so high-traffic shops avoid 30s+ full scans."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2023-05-09, area core, performance) about the SQL that deletes outdated rows from the `cart` table. The original statement used no database index (`EXPLAIN` showed `possible_keys` = `NULL`), which on high-traffic shops led to query times above 30 seconds.

## When to use

- Investigating slow cart cleanup or long-running `DELETE FROM cart` statements.
- Writing custom cleanup SQL against the `cart` table and wanting it to hit an index.

## Key steps / config

The decision: reorder the conditions so that the rows can be narrowed down by the indexed `created_at` column first. The logic stays the same; only the lookup time drops.

Original (no index used):

```sql
DELETE FROM cart
WHERE (updated_at IS NULL AND created_at <= '2023-02-01')
   OR (updated_at IS NOT NULL AND updated_at <= '2023-02-01') LIMIT 1000;
```

ADR version (uses `idx.cart.created_at`):

```sql
DELETE FROM cart
WHERE created_at <= '2023-02-01'
  AND (updated_at IS NULL OR updated_at <= '2023-02-01') LIMIT 1000;
```

In 6.7.15.1 the cleanup is `CartPersister::prune()`, called by `CleanupCartTaskHandler` (scheduled task `CleanupCartTask`) with `shopware.cart.expire_days` (default `120`). It deletes in batches of 1000 until no rows are affected, using only `WHERE created_at <= :timestamp`. When a cart is saved, `CartPersister` writes `created_at = :now` on both insert and update, so `created_at` acts as the last-modified time.

## Essential identifiers

- `cart` table, index `idx.cart.created_at`
- `Shopware\Core\Checkout\Cart\CartPersister::prune()`
- `CleanupCartTask`, `CleanupCartTaskHandler`
- `shopware.cart.expire_days`

## Gotchas

- Keep custom cleanup SQL filtering on `created_at` so that `idx.cart.created_at` can be used. A leading `OR` across `updated_at` forces a full scan.

## Version notes

- The ADR's query still filters on `updated_at`. The installed 6.7.15.1 statement no longer uses `updated_at` at all: it filters on `created_at` only, because a save refreshes `created_at`.

## Code check (6.7.15.1)
- confirmed `idx.cart.created_at` — index on `cart.created_at` added by migration — vendor/shopware/core/Migration/V6_4/Migration1617784658AddCartIndex.php:22
- confirmed `CartPersister::prune()` — deletes in `LIMIT 1000` batches until nothing is affected — vendor/shopware/core/Checkout/Cart/CartPersister.php:161
- corrected `created_at <= :timestamp` — docs: `created_at <= … AND (updated_at IS NULL OR updated_at <= …)`; code filters on `created_at` only — vendor/shopware/core/Checkout/Cart/CartPersister.php:167
- confirmed `created_at` — refreshed to now on every cart update — vendor/shopware/core/Checkout/Cart/CartPersister.php:118
- confirmed `CleanupCartTaskHandler` — calls `prune($this->days)` — vendor/shopware/core/Checkout/Cart/Cleanup/CleanupCartTaskHandler.php:18
- confirmed `CleanupCartTask` — scheduled task class — vendor/shopware/core/Checkout/Cart/Cleanup/CleanupCartTask.php:9
- confirmed `shopware.cart.expire_days` — injected into the Redis cart persister — vendor/shopware/core/Checkout/DependencyInjection/cart.php:736
- confirmed `cart.expire_days` — default 120 days — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:477
