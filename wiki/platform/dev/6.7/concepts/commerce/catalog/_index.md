---
id: platform/dev/6.7/concepts/commerce/catalog/_index.md
title: Catalog
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/catalog/
sourceHash: 6d76d6bd1251880b206a9c81b3a0caea7bf5b62e
codeCheckedAgainst: "6.7.15.1"
keywords: ["catalog", "product catalog", "products", "prices", "product", "product_price", "ProductDefinition", "ProductPriceDefinition", "catalog structure", "commerce concepts"]
summary: Entry page for Shopware 6.7 catalog concepts - how products, prices and related data are organised into a product catalog; starts with products.
lastBuilt: 2026-10-20
---
## What it is

Section landing page for the structure that organises products, prices and everything related to maintaining a product catalog in a Shopware store. The section begins with products and how they are defined, then covers categories and sales channels.

## When to use

Start here when you need the conceptual model of the catalog (products, their prices, and the data around them) before working with the corresponding entities.

## Code check (6.7.15.1)
- confirmed `ProductDefinition::ENTITY_NAME` — catalog entity `product` — vendor/shopware/core/Content/Product/ProductDefinition.php:85
- confirmed `ProductPriceDefinition::ENTITY_NAME` — price data entity `product_price` — vendor/shopware/core/Content/Product/Aggregate/ProductPrice/ProductPriceDefinition.php:26
