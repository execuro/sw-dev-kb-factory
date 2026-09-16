---
id: platform/dev/6.7/resources/references/adr/2023-05-09-optimise-cart-cleanup.md
title: Optimize cart cleanup
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-05-09-optimise-cart-cleanup.html
sourceHash: 5188f7c59e38d89bb7ca84740abfae7ef8517d7f
codeCheckedAgainst: "6.7.13.0"
keywords: ["cart cleanup", "cart table", "idx.cart.created_at", "created_at", "CartPersister::prune()", "CleanupCartTask", "cart.cleanup", "shopware.cart.expire_days", "expired carts", "delete old carts", "sql index", "performance"]
summary: "ADR: cart cleanup query filters on indexed created_at (idx.cart.created_at); CartPersister::prune() deletes old carts in batches of 1000."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (area: core, performance, 2023-05-09) about the SQL that deletes outdated rows from the `cart` table. The original query did not use any index, which on high-traffic shops led to query times above 30 seconds.

## When to use

When investigating slow or locking cart cleanup, tuning cart expiry, or writing a custom cart persister that has to remove old carts efficiently.

## Key steps / config

The decision: order the `WHERE` clause so rows are narrowed down by the indexed `created_at` column first. `EXPLAIN` on the rewritten query showed `possible_keys` = `idx.cart.created_at` instead of `NULL`.

ADR version of the query:

```sql
DELETE FROM cart
  WHERE created_at <= :timestamp
    AND (updated_at IS NULL OR updated_at <= :timestamp) LIMIT 1000;
```

What the installed 6.7 code does:

- Scheduled task `CleanupCartTask` (name `cart.cleanup`, daily) runs `CleanupCartTaskHandler`, which calls `AbstractCartPersister::prune(int $days)`.
- `$days` is `%shopware.cart.expire_days%` (default `120` in `shopware.yaml`).
- `CartPersister::prune()` runs `DELETE FROM cart WHERE created_at <= :timestamp LIMIT 1000` repeatedly until no row is affected; it no longer checks `updated_at` at all.
- Custom persisters override `prune()`; the base implementation in `AbstractCartPersister` is a no-op.

## Essential identifiers

- `idx.cart.created_at` — index on `cart.created_at`
- `Shopware\Core\Checkout\Cart\CartPersister::prune()`
- `Shopware\Core\Checkout\Cart\AbstractCartPersister::prune()`
- `Shopware\Core\Checkout\Cart\Cleanup\CleanupCartTask` / `CleanupCartTaskHandler`
- `shopware.cart.expire_days`

## Gotchas

- The ADR's `updated_at IS NULL OR updated_at <= ...` condition is not in the 6.7.13 query: carts are pruned by `created_at` only, so a cart still being updated is removed once its creation date passes the expiry window.
- Deletion happens in `LIMIT 1000` batches in a loop, not one large statement.

## Code check (6.7.13.0)
- confirmed `idx.cart.created_at` — index added on `cart.created_at` — vendor/shopware/core/Migration/V6_4/Migration1617784658AddCartIndex.php:22
- corrected `CartPersister::prune()` — docs: filter `created_at` AND (`updated_at IS NULL` OR `updated_at <=`); code filters `created_at <= :timestamp` only, LIMIT 1000 in a loop — vendor/shopware/core/Checkout/Cart/CartPersister.php:148
- confirmed `AbstractCartPersister::prune()` — non-abstract no-op called by the cleanup task — vendor/shopware/core/Checkout/Cart/AbstractCartPersister.php:33
- confirmed `CleanupCartTask::getTaskName()` — returns `cart.cleanup`, default interval daily — vendor/shopware/core/Checkout/Cart/Cleanup/CleanupCartTask.php:11
- confirmed `CleanupCartTaskHandler::run()` — calls `prune($this->days)` — vendor/shopware/core/Checkout/Cart/Cleanup/CleanupCartTaskHandler.php:34
- confirmed `shopware.cart.expire_days` — injected into the handler — vendor/shopware/core/Checkout/DependencyInjection/cart.xml:42
- confirmed `expire_days` — cart default `120` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:439
