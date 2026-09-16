---
id: platform/dev/6.6/resources/references/adr/2023-05-09-optimise-cart-cleanup.md
title: Optimize cart cleanup
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-05-09-optimise-cart-cleanup.html"
sourceHash: "5188f7c59e38d89bb7ca84740abfae7ef8517d7f"
keywords: ["cart cleanup", "cart table", "sql performance", "database index", "possible_keys", "created_at", "updated_at", "delete query", "high traffic", "explain"]
summary: "ADR: reordering the cart-cleanup DELETE query's WHERE clause lets MySQL use an index, fixing 30s+ deletes on high-traffic shops."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record documenting a performance fix for the SQL query that deletes outdated `cart` table entries.

## When to use
Relevant when investigating slow cart-cleanup jobs or database index usage on the `cart` table on high-traffic shops.

## Key steps / config
Original query did not use an index (confirmed via `EXPLAIN`, `possible_keys` = `NULL`):
```
EXPLAIN DELETE FROM cart
WHERE (updated_at IS NULL AND created_at <= '2023-02-01')
   OR (updated_at IS NOT NULL AND updated_at <= '2023-02-01') LIMIT 1000;
```
The decision reorders the WHERE clause so the indexed field narrows results first:
```
EXPLAIN DELETE FROM cart
        WHERE created_at <= '2023-02-01'
          AND (updated_at IS NULL OR updated_at <= '2023-02-01') LIMIT 1000;
```
This version uses `possible_keys` = `idx.cart.created_at`.

## Essential identifiers
- `cart` table
- `idx.cart.created_at`
- `created_at`, `updated_at` columns

## Gotchas
On high-traffic shops the unindexed query could take more than 30 seconds to find and remove entries; the fixed query keeps the same delete logic but drastically reduces the time needed to find matching rows.
