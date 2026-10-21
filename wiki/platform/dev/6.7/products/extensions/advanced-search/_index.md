---
id: platform/dev/6.7/products/extensions/advanced-search/_index.md
title: Advanced Search
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/
sourceHash: afcd5fa57f474b4b18cba701a85ef47d5d8e3336
codeCheckedAgainst: "6.7.15.1"
keywords: ["advanced search", "SwagCommercial", "commercial plugin", "elasticsearch", "product search", "manufacturer search", "category search", "search configuration", "evolve plan", "beyond plan", "Commercial 5.5.0"]
summary: Overview of Shopware Advanced Search, the Elasticsearch-based Commercial feature (since 5.5.0) for product, manufacturer and category search.
lastBuilt: 2026-10-21
---
## What it is

Shopware Advanced Search is part of the Commercial plugin (`SwagCommercial`), available with the Evolve and Beyond plans. It is built on Elasticsearch: besides product search it can search manufacturers and categories, and its Administration module configures the search behavior.

## When to use

Entry point for the Advanced Search developer section — read it before extending search templates, completion, search logic, or the search/suggest routes.

## Gotchas

- Requires Elasticsearch; the docs assume basic knowledge of Elasticsearch (the 7.10 reference is linked upstream) and of Shopware's Elasticsearch integration.
- Only available with the Commercial plugin on the Evolve or Beyond plan, not in Shopware core.

## Version notes

- Available starting with Commercial 5.5.0.

## Code check (6.7.15.1)
- confirmed `ProductSearchRoute` — core product search route that Advanced Search builds on — vendor/shopware/core/Content/Product/SalesChannel/Search/ProductSearchRoute.php:23
- unverified `SwagCommercial` — Commercial plugin, not in core/storefront/administration
- unverified `Elasticsearch` — Shopware integration lives in shopware/elasticsearch, outside the checked roots
