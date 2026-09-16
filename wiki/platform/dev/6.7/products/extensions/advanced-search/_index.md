---
id: platform/dev/6.7/products/extensions/advanced-search/_index.md
title: Advanced Search
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/
sourceHash: afcd5fa57f474b4b18cba701a85ef47d5d8e3336
codeCheckedAgainst: "6.7.13.0"
keywords: ["advanced search", "Commercial plugin", "elasticsearch", "opensearch", "product search", "manufacturer search", "category search", "search configuration", "Evolve plan", "Beyond plan", "commercial 5.5.0", "search module"]
summary: Overview of Shopware Advanced Search, an Elasticsearch-based search module in the Commercial plugin (5.5.0+, Evolve/Beyond plans).
lastBuilt: 2026-09-15
---
## What it is

Advanced Search is a module of the Shopware Commercial plugin, available with the Evolve and Beyond plans, starting with Commercial 5.5.0. It is built on Elasticsearch and, besides product search, can also search manufacturers and categories. Search behaviour is configured through an Administration module.

## When to use

When a shop on the Evolve or Beyond plan needs a configurable, Elasticsearch-backed search experience beyond the default product search, including manufacturer and category results.

## Gotchas

- Requires Commercial plugin 5.5.0 or later.
- The source expects basic knowledge of Elasticsearch (it references the Elasticsearch 7.10 reference docs) and of Shopware's Elasticsearch implementation before working with the module.
- The Commercial plugin code is not part of the installed `vendor/shopware/{core,storefront,administration}` packages, so the module itself cannot be verified against installed code.

## Code check (6.7.13.0)
- confirmed `SHOPWARE_ES_ENABLED` — core Elasticsearch toggle env var read by system setup, default `0` — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:59
- confirmed `OPENSEARCH_URL` — search host env var used for the Elasticsearch/OpenSearch connection — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:60
- unverified `Advanced Search` — Commercial plugin module, not in the installed core/storefront/administration packages
