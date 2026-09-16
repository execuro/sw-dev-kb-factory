---
id: platform/func/settings/shop/warehouses.md
title: Warehouses
docType: functional
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/shop/warehouses
sourceHash: f8bc22910e291176af215c4b3dcd110299d083a0e0503b6b0009a9b3e340380e
revision:
  current: true
  range: "6.6.0.0 - 6.6.10.6"
  swMin: "6.6.0.0"
  swMax: "6.6.10.6"
keywords: ["warehouses", "warehouse groups", "stock", "regional shipping", "rule builder", "Beyond plan", "product deliverability", "warehouse priority", "stock level and availability", "commerce settings"]
summary: "Manages warehouses and warehouse groups under Settings > Commerce > Warehouses for regional shipping and per-warehouse stock."
lastBuilt: "2026-09-15"
---

## What it is

Warehouse management lets merchants define multiple warehouses and group them by region so orders can be fulfilled from the most suitable warehouse, in combination with rules. It is a Beyond Plan feature available from 6.4.19.0.

## When to use

Use it when stock is split across several physical locations and shipments should be prioritized by shipping-address proximity (e.g. to shorten delivery times, reduce tax/customs issues for international orders).

## Key steps / config

- Found under **Settings > Commerce > Warehouses**.
- **Warehouses**: add via "new warehouse" — set Name, Description (e.g. address or stored products), and assign one or more Warehouse-groups from a dropdown. Edit/delete via the row's `...` menu or the "delete warehouse" button in the edit mask.
- Warehouses appear in the product mask, where stock is managed per warehouse.
- **Warehouse groups**: combine regional warehouses or warehouses of a certain stock type. Add via "Add a new warehouse group" — set the mandatory Warehouse group name, a Priority (used with the assigned rule to pick warehouses for shipment), an Internal description, and a Rule selecting the group by shipping address.
- Assign warehouses to a group via "add warehouses" (checkbox selection), or from the warehouse's own edit dropdown.
- Within a group, warehouses holding the same product can be reprioritized via the Priority column (double-click to edit, confirm with the check button, cancel with X).
- Product assignment: in the product's Stock level & availability area, selecting a warehouse group replaces the standard stock fields with per-warehouse stock settings.

## Essential identifiers

- Menu path: **Settings > Commerce > Warehouses**
- Product config area: Stock level & availability

## Gotchas

A warehouse can be removed from a group either via the warehouse list's `...` > delete, or by opening the warehouse and clicking the X on the group entry (or unchecking it in the dropdown).

## Version notes

Warehouses/warehouse groups are available as part of the Beyond Plan from version 6.4.19.0 onward.
