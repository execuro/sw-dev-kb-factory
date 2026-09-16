---
id: platform/dev/6.7/guides/plugins/plugins/integrations/commercial/_index.md
title: Commercial Plugins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/integrations/commercial/
sourceHash: 22d2f6f5268d790a02070b5c8a4844a8ba6a5882
codeCheckedAgainst: "6.7.13.0"
keywords: ["commercial plugin", "shopware commercial", "commercial plans", "enterprise features", "customer-specific pricing", "custom prices", "multi-inventory", "warehouse", "api-first", "custom_price", "warehouse_group", "product_warehouse"]
summary: "Index of API-first features in the Shopware Commercial plugin (Commercial plans): customer-specific pricing and multi-inventory integration guides."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/integrations/commercial/customer-specific-pricing.md", "platform/dev/6.7/guides/plugins/plugins/integrations/commercial/multi-inventory.md"]
---
## What it is

Section index for the Commercial plugin, which extends Shopware with advanced enterprise features available in Shopware Commercial plans. The section documents the plugin's API-first features and how to integrate them into external systems.

## When to use

When an external system (typically an ERP) has to drive features that are only available with the Commercial plugin, and you need the integration guide for one of them.

## Key steps / config

Guides in this section:

1. [Customer-specific Pricing](platform/dev/6.7/guides/plugins/plugins/integrations/commercial/customer-specific-pricing.md) — per-customer price overrides pushed through the Admin API action route `/api/_action/custom-price` (stored in the `custom_price` entity).
2. [Multi-Inventory](platform/dev/6.7/guides/plugins/plugins/integrations/commercial/multi-inventory.md) — stock per warehouse and warehouse group, managed via the generic Admin API endpoints and the sync API (entities `warehouse`, `warehouse_group`, `product_warehouse`).

Both require the Commercial plugin to be installed and activated in addition to a regular Shopware 6 installation.

## Essential identifiers

- Commercial plugin
- `custom_price` (customer-specific pricing)
- `warehouse`, `warehouse_group`, `product_warehouse` (multi-inventory)

## Gotchas

- The Commercial plugin is not part of the installed open-source packages; its entities are not defined in core. Core only lists their field names in the usage-data allow list, so they cannot be verified beyond names there.

## Code check (6.7.13.0)
- confirmed `custom_price` — entity name listed with productId/customerId/customerGroupId/price fields in core's usage-data allow list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1794
- confirmed `warehouse` — entity name listed in the usage-data allow list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1900
- confirmed `warehouse_group` — entity name listed in the usage-data allow list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1908
- confirmed `product_warehouse` — entity name listed in the usage-data allow list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1919
- unverified `/api/_action/custom-price` — route lives in the Commercial plugin, not in the installed vendor/shopware packages
