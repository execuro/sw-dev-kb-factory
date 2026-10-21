---
id: platform/dev/6.7/guides/plugins/plugins/integrations/_index.md
title: Integrations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/integrations/
sourceHash: 0b92ad078ff7511225d1f9e0a490ecf406a0e745
codeCheckedAgainst: "6.7.15.1"
keywords: ["integrations", "plugin integrations", "external systems", "erp integration", "customer-specific pricing", "multi-inventory", "redis", "elasticsearch", "opensearch", "integrations api", "infrastructure services", "product entity extension"]
summary: Hub for plugin integration guides - commercial pricing/inventory APIs, Integrations API, Redis, Elasticsearch and ES entity extensions.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/integrations/commercial/customer-specific-pricing.md", "platform/dev/6.7/guides/plugins/plugins/integrations/commercial/multi-inventory.md", "platform/dev/6.7/guides/development/integrations-api/_index.md", "platform/dev/6.7/guides/plugins/plugins/integrations/redis.md"]
---
## What it is

Overview page for plugin guides that connect Shopware to external systems and infrastructure services, beyond basic plugin setup.

## When to use

Use these guides when a plugin needs to connect to external services, extend core infrastructure, or integrate ERP and pricing systems.

## Key steps / config

The guides are grouped into three areas:

- Commercial and API-based integrations:
  - [Customer-specific pricing](platform/dev/6.7/guides/plugins/plugins/integrations/commercial/customer-specific-pricing.md) - per-customer price overrides fed from an ERP.
  - [Multi-inventory](platform/dev/6.7/guides/plugins/plugins/integrations/commercial/multi-inventory.md) - stock per warehouse and warehouse group.
  - [Integrations API](platform/dev/6.7/guides/development/integrations-api/_index.md) - Admin API access for external systems.
- Infrastructure integrations:
  - [Redis](platform/dev/6.7/guides/plugins/plugins/integrations/redis.md)
  - [Elasticsearch](platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/_index.md)
- Extended search capabilities:
  - [Adding product entity extensions to Elasticsearch](platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/add-product-entity-extension-to-elasticsearch.md)

## Code check (6.7.15.1)
- confirmed `/api/_action/sync` — Admin API sync route used by the commercial integrations for batched writes — vendor/shopware/core/Framework/Api/Controller/SyncController.php:43
- confirmed `shopware.storefront.redirect_on_single_hit_fields` — storefront search parameter covered by the Elasticsearch guide — vendor/shopware/storefront/Resources/config/packages/shopware.php:6
- unverified `Commercial plugin` — customer-specific pricing and multi-inventory ship in the Commercial plugin, not in core/storefront/administration
