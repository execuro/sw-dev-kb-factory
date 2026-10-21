---
id: platform/dev/6.7/concepts/commerce/_index.md
title: Commerce
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/
sourceHash: 40337717df72a08bee7966f816030fc8b0a4f454
codeCheckedAgainst: "6.7.15.1"
keywords: ["commerce", "ecommerce", "commerce concepts", "concepts", "catalog", "product", "category", "sales_channel", "ProductDefinition", "CategoryDefinition", "SalesChannelDefinition", "shopware architecture"]
summary: Entry page for Shopware 6.7 commerce concepts (catalog, products, categories, sales channels); conceptual only, no code examples.
lastBuilt: 2026-10-20
---
## What it is

Section landing page for the commerce-related concepts of Shopware, which at its core is an ecommerce platform. The pages below it explain ideas and data structures (catalog, products, categories, sales channels) rather than step-by-step tasks.

## When to use

Read the pages in this section to understand how Shopware models commerce data before implementing against it. The Concepts section deliberately contains no code examples; for guided, step-by-step tutorials use the Guides section instead.

## Code check (6.7.15.1)
- confirmed `ProductDefinition::ENTITY_NAME` — core commerce entity `product` exists — vendor/shopware/core/Content/Product/ProductDefinition.php:85
- confirmed `CategoryDefinition::ENTITY_NAME` — core commerce entity `category` exists — vendor/shopware/core/Content/Category/CategoryDefinition.php:55
- confirmed `SalesChannelDefinition::ENTITY_NAME` — core commerce entity `sales_channel` exists — vendor/shopware/core/System/SalesChannel/SalesChannelDefinition.php:75
