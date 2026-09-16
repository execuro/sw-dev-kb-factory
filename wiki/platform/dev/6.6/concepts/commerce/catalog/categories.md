---
id: platform/dev/6.6/concepts/commerce/catalog/categories.md
title: Categories
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/commerce/catalog/categories.html
sourceHash: 929ec9fea72f12594cf81baf32b32da61e5fa9e0
keywords: ["categories", "category tree", "Dynamic Product Group", "product assignment", "sales channel navigation", "CMS layout", "structuring element", "custom link", "hide in navigation"]
summary: Categories organize products in a hierarchical tree, drive store navigation, and can carry CMS layouts.
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/concepts/commerce/content/shopping-experiences-cms.md"]
---
## What it is

Products in Shopware are organized in categories, represented as a single hierarchical tree that spans the whole product catalog of a store. A product can belong to multiple categories.

## When to use

Relevant when structuring catalog content, building store navigation, or deciding how a category should be laid out visually.

## Key steps / config

- **Product assignments** — products are assigned to a category either through an explicit assignment (stored in a database table) or via a Dynamic Product Group (filters evaluated at execution time).
- **Navigation** — each Sales Channel can select a category as the root of its navigation; Shopware builds navigation from that category's child categories. Parent categories also inherit the explicit assignments of their children through the inheritance relation between categories.
- **CMS layouts** — every category has a CMS layout assigned, dictating how the category is displayed and centralizing management of CMS pages.
- **Types** — beyond being a product collection/navigation item, a category can be a *structuring element* (visible in the tree but not itself visitable) or a *custom link* redirecting to an external resource.

## Essential identifiers

- Sales Channel
- Dynamic Product Group
- CMS layout

## Gotchas

Categories can be globally hidden from store navigation via a hide-in-navigation flag.
