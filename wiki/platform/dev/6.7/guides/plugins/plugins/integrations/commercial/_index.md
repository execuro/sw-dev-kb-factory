---
id: platform/dev/6.7/guides/plugins/plugins/integrations/commercial/_index.md
title: Commercial Plugins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/integrations/commercial/
sourceHash: 22d2f6f5268d790a02070b5c8a4844a8ba6a5882
codeCheckedAgainst: "6.7.15.1"
keywords: ["commercial plugin", "shopware commercial", "commercial plans", "enterprise features", "api-first", "customer-specific pricing", "custom prices", "multi-inventory", "warehouse", "warehouse_group", "erp integration", "beyond plan"]
summary: Hub for API-first features of the Shopware Commercial plugin - customer-specific pricing and multi-inventory (warehouses).
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/integrations/commercial/customer-specific-pricing.md", "platform/dev/6.7/guides/plugins/plugins/integrations/commercial/multi-inventory.md"]
---
## What it is

Section index for the Commercial plugin, which extends Shopware with enterprise features available in Shopware Commercial plans. The section documents the plugin's API-first features and how to integrate them into external systems.

## When to use

When integrating an ERP or other external system with a Commercial-plan feature exposed through the Admin API.

## Key steps / config

Pages in this section:

- [Customer-specific Pricing](platform/dev/6.7/guides/plugins/plugins/integrations/commercial/customer-specific-pricing.md) - price overrides per customer via a sync-style Admin API route.
- [Multi-Inventory](platform/dev/6.7/guides/plugins/plugins/integrations/commercial/multi-inventory.md) - stock per warehouse and warehouse group, managed via the Admin API.

## Gotchas

The features are not part of core; they require the Commercial plugin to be installed and activated.

## Code check (6.7.15.1)
- unverified `Commercial plugin` — feature code ships in the Commercial plugin, outside core/storefront/administration
- confirmed `warehouse_group` — multi-inventory entity name is listed in core's usage-data allow list, entity itself not defined in core — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1908
- confirmed `/api/_action/sync` — core sync route the commercial APIs model themselves on — vendor/shopware/core/Framework/Api/Controller/SyncController.php:43
