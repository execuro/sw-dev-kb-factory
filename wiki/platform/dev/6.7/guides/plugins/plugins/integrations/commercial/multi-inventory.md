---
id: platform/dev/6.7/guides/plugins/plugins/integrations/commercial/multi-inventory.md
title: Multi-Inventory
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/integrations/commercial/multi-inventory.html
sourceHash: 9ec19cfed8cb97d1ce69a8dd6d7523f454488b08
codeCheckedAgainst: "6.7.15.1"
keywords: ["multi-inventory", "warehouse", "warehouse_group", "product_warehouse", "order_warehouse_group", "order_product_warehouse", "/api/warehouse-group", "/api/_action/sync", "stock per warehouse", "erp stock sync", "available_stock", "commercial plugin", "beyond"]
summary: Commercial multi-inventory - warehouse/warehouse_group/product_warehouse entities, Admin API payloads, rule-based stock availability.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

Multi-Inventory is a Commercial plugin feature (Beyond plan) that manages stock across multiple warehouses and warehouse groups. It is designed for API-first ERP integrations and also has an Administration UI for manual management.

## When to use

When an ERP must remain the single source of truth for stock, and product availability in Shopware must be computed from per-warehouse stock filtered by rules.

## Key steps / config

1. Requirements: a Shopware 6 instance, a Shopware Beyond license, and the activated Commercial plugin ([plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).
2. All new entities support the Admin API through their generic entity endpoints and the sync service.

Data model: `warehouse`, `warehouse_group` (`name`, `description`, `priority`, `ruleId`), M:N `warehouse_group_warehouse`, `product_warehouse_group`, `product_warehouse` (`productId`, `warehouseId`, `stock`), plus order-side `order_warehouse_group` and `order_product_warehouse`.

Create/update a group and assign warehouses (`POST /api/warehouse-group`, `PATCH /api/warehouse-group/{id}`):

```json
{ "id": "...", "name": "Group A", "description": "...",
  "priority": 25, "ruleId": "...", "warehouses": [{ "id": "..." }] }
```

A warehouse is created via `POST /api/warehouse` / `PATCH /api/warehouse/{id}` with `name` and `groups: [{ "id": ... }]`.

Assign groups to a product and create product warehouses via `POST /api/_action/sync`:

```json
[{ "action": "upsert", "entity": "product", "payload": [{
  "id": "...", "versionId": "...",
  "warehouseGroups": [{ "id": "..." }],
  "warehouses": [{ "id": "...", "productId": "...", "productVersionId": "...",
    "warehouseId": "...", "stock": 0 }] }] }]
```

Stock updates: batch `upsert` on entity `product_warehouse` (`id`, `stock`) via the sync API, or `PATCH /api/product-warehouse/{id}` with `stock`.

## Essential identifiers

- Entities `warehouse`, `warehouse_group`, `product_warehouse`, `order_warehouse_group`, `order_product_warehouse`
- Routes `/api/warehouse-group`, `/api/warehouse`, `/api/product-warehouse`, `/api/_action/sync`
- Product associations `warehouseGroups`, `warehouses`
- `product_warehouse.stock`

## Gotchas

- Only products assigned to warehouse groups use this logic; all others keep default Shopware behaviour.
- Availability: a warehouse group counts only if its assigned rule is valid; valid groups are ordered by their own `priority`, not rule priority. Total stock is the sum over all warehouses in active groups; one warehouse may belong to several groups. Availability also honours `max_purchase`, `min_purchase`, `purchase_steps`.
- `product.available_stock` is not used: stock of product warehouses is reduced immediately when an order is placed, independent of order state (order states still drive Flow Builder triggers and subscribers).
- Editing existing orders does not recalculate warehouse stock; the ERP must push corrected stock.
- Stopping use of Multi-Inventory falls back to default behaviour; editing orders that originally used `ProductWarehouses` will then adjust stock from incorrect values.

## Code check (6.7.15.1)
- unverified `/api/warehouse-group` — entity definitions and routes ship in the Commercial plugin, outside core/storefront/administration
- confirmed `warehouse_group` — listed with `priority`, `ruleId`, `warehouses` in core usage-data allow list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1908
- confirmed `product_warehouse` — listed with `productId`, `warehouseId`, `stock` — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1919
- confirmed `order_product_warehouse` — order-side entity listed in allow list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1934
- confirmed `/api/_action/sync` — core sync route — vendor/shopware/core/Framework/Api/Controller/SyncController.php:43
- confirmed `available_stock` — core product field, write-protected — vendor/shopware/core/Content/Product/ProductDefinition.php:180
- confirmed `purchase_steps` — core product field, default 1 — vendor/shopware/core/Content/Product/ProductDefinition.php:191
- confirmed `max_purchase` — core product field — vendor/shopware/core/Content/Product/ProductDefinition.php:192
- confirmed `min_purchase` — core product field, default 1 — vendor/shopware/core/Content/Product/ProductDefinition.php:193
