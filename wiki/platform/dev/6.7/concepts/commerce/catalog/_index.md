---
id: platform/dev/6.7/concepts/commerce/catalog/_index.md
title: Catalog
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/catalog/
sourceHash: 6d76d6bd1251880b206a9c81b3a0caea7bf5b62e
codeCheckedAgainst: "6.7.13.0"
keywords: ["catalog", "product catalog", "products", "prices", "categories", "ProductDefinition", "CategoryDefinition", "catalogue", "commerce concepts"]
summary: Entry page of the Catalog concepts section - structure organizing products, prices and everything needed to maintain a product catalog.
lastBuilt: 2026-09-15
---
## What it is

Landing page for the **Catalog** concepts: the structure that organizes products, prices and everything related to maintaining a product catalog in a Shopware store. The section starts with how products are defined, then covers related topics such as categories.

## When to use

As the entry point before reading the individual catalog concept pages (products, categories).

## Essential identifiers

- `Shopware\Core\Content\Product\ProductDefinition` (entity `product`)
- `Shopware\Core\Content\Category\CategoryDefinition` (entity `category`)

## Code check (6.7.13.0)
- confirmed `ProductDefinition::ENTITY_NAME` — product entity `product` — vendor/shopware/core/Content/Product/ProductDefinition.php:85
- confirmed `CategoryDefinition::ENTITY_NAME` — category entity `category` — vendor/shopware/core/Content/Category/CategoryDefinition.php:55
