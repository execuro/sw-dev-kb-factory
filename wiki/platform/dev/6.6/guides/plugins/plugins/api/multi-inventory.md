---
id: platform/dev/6.6/guides/plugins/plugins/api/multi-inventory.md
title: Multi Inventory
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/api/multi-inventory.html
sourceHash: 35c107080ab0c92b7ac1e3538f9b176e068a4321
keywords: ["Multi-Inventory", "Warehouse", "WarehouseGroup", "/api/warehouse-group", "/api/warehouse", "/api/_action/sync", "product_warehouse.stock", "Rule builder", "Shopware Beyond", "Commercial plugin", "ProductWarehouse", "available_stock"]
summary: "Commercial Multi-Inventory feature: Warehouse/WarehouseGroup entities and Admin API endpoints for per-warehouse stock, API-first for ERPs."
lastBuilt: "2026-09-15"
---
## What it is

Multi-Inventory is a Commercial plugin feature (Shopware Beyond) that adds Warehouse and WarehouseGroup entities to model per-warehouse stock, intended to be driven API-first by an ERP system, with an Administration UI also available.

## When to use

When Product availability and stock need to be tracked per warehouse rather than as a single global stock value, typically integrated with an external ERP.

## Key steps / config

New entities: `Warehouse`, `WarehouseGroup`, `ProductWarehouse`, `ProductWarehouseGroup`, `WarehouseGroupWarehouse`, `OrderWarehouseGroup`, `OrderProductWarehouse`, all reachable via the sync service or generic entity endpoints.

Create/update a WarehouseGroup:

```json
// POST /api/warehouse-group
// PATCH /api/warehouse-group/<id>
{
    "id": "...",
    "name": "Group A",
    "priority": 25,
    "ruleId": "...",
    "warehouses": [{ "id": "..." }]
}
```

Assign WarehouseGroups to a Product and create ProductWarehouses via `/api/_action/sync` with `action: upsert`, `entity: product`, including `warehouseGroups` and `warehouses` in the payload.

Update stock in batch via sync (`entity: product_warehouse`, field `stock`) or directly via `PATCH /api/product-warehouse/<id>`.

## Essential identifiers

- `/api/warehouse-group`, `/api/warehouse`, `/api/_action/sync`
- `product_warehouse.stock`
- entity `product_warehouse`
- Rule builder (assigns rules to WarehouseGroups)

## Gotchas

Multi-Inventory behavior only applies to Products assigned to WarehouseGroups; unrelated Products keep default Shopware behavior. `product.available_stock` is intentionally not used — stock is reduced immediately on order placement instead. Multi-Inventory never recalculates stock for existing orders being edited; that must be pushed from the external ERP. If Multi-Inventory is disabled or its data deleted for a product, Shopware falls back to default behavior and may use incorrect stock values for orders that originally used ProductWarehouses.
