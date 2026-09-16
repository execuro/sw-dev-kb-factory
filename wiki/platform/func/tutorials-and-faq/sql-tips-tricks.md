---
id: platform/func/tutorials-and-faq/sql-tips-tricks.md
title: Sql Tips Tricks
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/sql-tips-tricks"
sourceHash: "68a3ef24f8782089af67eb4111e1c58b071730001ad52f0e95e9a024abacb23a"
revision:
  current: true
  range: "6.5.0.0 - 6.6.10.6"
  swMax: "6.6.10.6"
  swMin: "6.5.0.0"
keywords: ["sql", "database queries", "product table", "property_group", "customer table", "order tables", "inheritance", "plugin table", "app table", "collation", "utf8mb4_unicode_ci", "customer_group", "unsupported"]
summary: "Unsupported SQL snippets for clearing products/properties/customers/orders, restoring variant inheritance, disabling extensions and fixing collation."
lastBuilt: "2026-09-15"
---

## What it is

A collection of unsupported, expert-only SQL statements for directly manipulating a
Shopware 6 database: clearing catalogue/customer/order data, restoring variant
inheritance, temporarily disabling extensions, fixing collation mismatches, and
restoring the default customer group.

## When to use

Before going live, when a shop needs its demo/test data wiped, variant inheritance
reset after a migration, extensions disabled for debugging, a wrong table collation
corrected, or the default customer group restored — always with a backup first, since
this is not officially supported.

## Key steps / config

- Delete all products: `DELETE FROM product;`
- Delete all properties: `DELETE FROM property_group;`
- Delete all customer data (pre-go-live only, never on a live store, never where orders
  with receipts exist): `DELETE FROM customer;`
- Delete all orders (same live-store caution) deletes from `order`, `order_address`,
  `order_customer`, `order_delivery`, `order_delivery_position`, `order_line_item`,
  `order_tag`, and `order_transaction`.
- Restore variant inheritance after a migration by setting the relevant `product`
  columns (e.g. `active`, `tax_id`, `product_manufacturer_id`, `delivery_time_id`,
  `product_media_id`, `weight`, `width`, `height`, `length`, `tag_ids`) to `NULL` where
  `parent_id IS NOT NULL`, then deleting stale rows from `product_translation`,
  `product_tag`, `product_media`, `product_visibility`, and `product_property` for
  those variant product IDs.
- Disable non-default extensions for debugging: back up with
  `CREATE TABLE plugin_tmp LIKE plugin;` (and, from Shopware 6.5, an equivalent
  `app_tmp` backup of the `app` table, since apps/themes are tracked separately), then
  `UPDATE plugin SET active = 0 WHERE (author <> 'shopware AG' AND author <> 'Shopware')
  OR (author IS NULL);` and `UPDATE app SET active = 0;`. Restore later by joining back
  to the `_tmp` tables and setting `active` from the backup, then drop the temporary
  tables.
- Fix a wrong table/database collation (default is `utf8mb4_unicode_ci`): detect via a
  query against `information_schema.columns`, then run either
  `ALTER DATABASE ... CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci` or
  `ALTER TABLE ... CONVERT TO CHARACTER SET utf8mb4 COLLATE 'utf8mb4_unicode_ci'`. The
  symptom in logs is `SQLSTATE[HY000]: General error: 1267 Illegal mix of collations`.
- Restore the default customer group (translations must then be re-added manually in
  the admin) via an `INSERT INTO customer_group (id, display_gross,
  registration_active, created_at, updated_at) VALUES (UNHEX('CFBD5018D38D41D8ADCA10D94FC8BDD6'), ...)`.

## Essential identifiers

- `product`, `property_group`, `customer`, `order` and related `order_*` tables
- `plugin` / `plugin_tmp`, `app` / `app_tmp` tables
- `customer_group` table, id `CFBD5018D38D41D8ADCA10D94FC8BDD6`
- `utf8mb4_unicode_ci` collation

## Gotchas

- These statements are explicitly **not officially supported**; execute only with
  necessary expertise and always take a backup first.
- Orders that have receipts must never be deleted.
- The `DELETE FROM customer;`/order-deletion queries must never be run against a live
  store — pre-go-live/test use only.
- From Shopware 6.5, extensions and themes are also tracked as apps and must be
  deactivated via the separate `app` table in addition to `plugin`.
