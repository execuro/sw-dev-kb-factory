---
id: platform/dev/6.7/guides/plugins/plugins/integrations/_index.md
title: Integrations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/integrations/
sourceHash: 0b92ad078ff7511225d1f9e0a490ecf406a0e745
codeCheckedAgainst: "6.7.13.0"
keywords: ["integrations", "external systems", "erp integration", "customer-specific pricing", "multi-inventory", "redis", "elasticsearch", "product entity extension", "integrations api", "commercial plugin", "infrastructure services", "RedisConnectionProvider"]
summary: "Index of plugin integration guides: customer-specific pricing, multi-inventory, API, Redis, Elasticsearch and product entity extensions for search."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/integrations/redis.md", "platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/_index.md", "platform/dev/6.7/guides/plugins/plugins/integrations/commercial/customer-specific-pricing.md", "platform/dev/6.7/guides/plugins/plugins/integrations/commercial/multi-inventory.md"]
---
## What it is

Entry page for the plugin guides that connect Shopware to external systems and infrastructure services — scenarios that go beyond basic plugin setup. It groups the guides into three areas.

## When to use

When a plugin needs to connect to external services, extend core infrastructure, or integrate ERP and pricing systems, and you need to pick the right guide.

## Key steps / config

Pick the guide by integration type:

1. **Commercial and API-based integrations**
   - [Customer-specific pricing](platform/dev/6.7/guides/plugins/plugins/integrations/commercial/customer-specific-pricing.md) — Commercial plugin feature for per-customer price overrides from an ERP.
   - [Multi-inventory](platform/dev/6.7/guides/plugins/plugins/integrations/commercial/multi-inventory.md) — Commercial plugin feature for stock across warehouses and warehouse groups.
   - [Integrations API](platform/dev/6.7/guides/development/integrations-api/_index.md) — using the Shopware APIs from external systems.
2. **Infrastructure integrations**
   - [Redis](platform/dev/6.7/guides/plugins/plugins/integrations/redis.md)
   - [Elasticsearch](platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/_index.md)
3. **Extended search capabilities**
   - [Adding product entity extensions to Elasticsearch](platform/dev/6.7/guides/plugins/plugins/integrations/elasticsearch/add-product-entity-extension-to-elasticsearch.md)

## Essential identifiers

- Topics: customer-specific pricing, multi-inventory, Integrations API, Redis, Elasticsearch, product entity extension for Elasticsearch
- Core anchors: `RedisConnectionProvider` (Redis connections), `integration` entity (API integrations)

## Gotchas

- Customer-specific pricing and multi-inventory are not part of the open-source core; they ship with the Commercial plugin, so their entities are not defined in the core package.

## Code check (6.7.13.0)
- confirmed `RedisConnectionProvider` — core class providing named Redis connections — vendor/shopware/core/Framework/Adapter/Redis/RedisConnectionProvider.php:15
- confirmed `integration` — core entity name for API integrations — vendor/shopware/core/System/Integration/IntegrationDefinition.php:31
- confirmed `integration:create` — CLI command to create an API integration — vendor/shopware/core/Framework/Api/Command/CreateIntegrationCommand.php:18
- confirmed `elasticsearch` — config section present in core shopware.yaml — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:673
- confirmed `custom_price` — Commercial entity only referenced in the usage-data allow list, not defined in core — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1794
- confirmed `warehouse_group` — Commercial entity only referenced in the usage-data allow list, not defined in core — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1908
