---
id: platform/dev/6.7/guides/plugins/plugins/integrations/commercial/multi-inventory.md
title: Multi-Inventory
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/integrations/commercial/multi-inventory.html
sourceHash: 9ec19cfed8cb97d1ce69a8dd6d7523f454488b08
codeCheckedAgainst: "6.7.13.0"
keywords: ["multi-inventory", "warehouse", "warehouse_group", "product_warehouse", "order_warehouse_group", "order_product_warehouse", "/api/warehouse-group", "/api/_action/sync", "warehouseGroups", "stock per warehouse", "erp stock sync", "commercial plugin", "shopware beyond"]
summary: "Commercial plugin Multi-Inventory: warehouses and warehouse groups with per-warehouse product stock, rule-based availability, Admin/sync API payloads, caveats."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

Multi-Inventory is a Commercial plugin feature (Beyond plan) that manages product stock across multiple warehouses and warehouse groups. It is built for API-first ERP integrations, with an Administration UI for manual management and inspection.

## When to use

When stock is held in several warehouses, an ERP is the single source of truth for stock, and availability should depend on rules (e.g. customer group) per warehouse group.

## Key steps / config

Prerequisites: Shopware 6 instance, Shopware Beyond license, Commercial plugin installed and activated (see [plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).

Data model (new entities): `warehouse`, `warehouse_group` (with `rule_id`, `priority`), `warehouse_group_warehouse` (M:N), `product_warehouse_group`, `product_warehouse` (`product_id`, `warehouse_id`, stock), `order_warehouse_group`, `order_product_warehouse`. All support the generic Admin API entity endpoints and the sync API.

1. Create/update a warehouse group and assign warehouses — `POST /api/warehouse-group`, `PATCH /api/warehouse-group/{id}`:
   ```json
   { "id": "...", "name": "Group A", "description": "...",
     "priority": 25, "ruleId": "...", "warehouses": [{ "id": "..." }] }
   ```
2. Create/update a warehouse and assign groups — `POST /api/warehouse`, `PATCH /api/warehouse/{id}` with `id`, `name`, `groups: [{ "id": ... }]`.
3. Assign groups to products and create product warehouses — `POST /api/_action/sync`:
   ```json
   [{ "action": "upsert", "entity": "product", "payload": [{
     "id": "...", "versionId": "...", "warehouseGroups": [{ "id": "..." }],
     "warehouses": [{ "id": "...", "productId": "...", "productVersionId": "...",
       "warehouseId": "...", "stock": 0 }] }] }]
   ```
4. Update stock — batch via sync with `"entity": "product_warehouse"` and `id`/`stock` payloads, or `PATCH /api/product-warehouse/{id}` with `stock`.

Availability: a warehouse group counts only if its rule is valid; valid groups are ordered by their own `priority` (independent of rule priority). Stock of all warehouses in active groups is summed. A product is available when the rule matches and requested quantity ≤ total stock, also respecting `max_purchase`, `min_purchase`, `purchase_steps`. Products without warehouse groups use default Shopware behaviour.

## Essential identifiers

- Entities: `warehouse`, `warehouse_group`, `product_warehouse`, `order_warehouse_group`, `order_product_warehouse`
- Endpoints: `/api/warehouse-group`, `/api/warehouse`, `/api/product-warehouse`, `/api/_action/sync`
- Fields: `priority`, `ruleId`, `warehouses`, `groups`, `warehouseGroups`, `warehouseId`, `stock`

## Gotchas

- `product.available_stock` is intentionally not used: warehouse stock is reduced immediately when an order is placed; no order state change is needed. Order states still matter for Flow Builder and event subscribers.
- Editing existing orders does not recalculate warehouse stock; the ERP must push corrected stock (immediate or daily sync).
- Stopping Multi-Inventory for products (deleting data or deactivating) falls back to default behaviour; editing old orders that used `ProductWarehouses` then adjusts product stock with incorrect values.

## Code check (6.7.13.0)
- unverified `/api/warehouse-group` — entity routes come from the Commercial plugin, not installed in vendor/shopware
- confirmed `warehouse_group` — entity listed with name, description, priority, ruleId, warehouses in core's usage-data allow list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1908
- confirmed `warehouse` — entity listed with name, description, groups — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1900
- confirmed `product_warehouse` — entity listed with productId, warehouseId, stock — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1919
- confirmed `order_warehouse_group` — entity listed with orderId, warehouseGroupId — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1927
- confirmed `order_product_warehouse` — entity listed with orderId, productId, warehouseId, quantity — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1934
- confirmed `/api/_action/sync` — core sync route — vendor/shopware/core/Framework/Api/Controller/SyncController.php:43
- confirmed `available_stock` — core product field, write-protected — vendor/shopware/core/Content/Product/ProductDefinition.php:179
- confirmed `max_purchase` — core product field; `min_purchase` and `purchase_steps` on adjacent lines — vendor/shopware/core/Content/Product/ProductDefinition.php:189
- unverified `warehouse_group_warehouse` — mapping entity from the docs ER diagram, not listed in installed packages
