---
id: platform/dev/6.7/products/extensions/b2b-components/shopping-lists/_index.md
title: Shopping lists
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/shopping-lists/
sourceHash: 709eb3215819f5dcd10317f1a4fc62ee8a690151
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopping lists", "shopping list", "b2b components", "b2b", "commercial", "SwagCommercial", "product list", "quantity tracking", "wishlist", "b2b_components_shopping_list"]
summary: Overview of the B2B Components Shopping lists feature - customers create, edit and organize product lists with quantities for repeated purchasing.
lastBuilt: 2026-09-15
---
## What it is

Landing page of the *Shopping lists* B2B component (part of the Shopware Commercial B2B Components). The component lets users create, edit and organize shopping lists of products, with quantity tracking per item and the ability to mark items as purchased, so recurring or event-specific purchases can be prepared in advance.

## When to use

Start here when working with B2B shopping lists; the section continues with the entity/schema concept page and the Store API / pricing guide for the same component.

## Gotchas

- The shopping list implementation is not part of the open-source core packages; it ships with the commercial plugin. The installed core only references its table name (usage-data allow list), so behavior cannot be verified against `vendor/shopware`.

## Code check (6.7.13.0)
- confirmed `b2b_components_shopping_list` — core usage-data allow list knows the entity table (fields `id`, `active`) — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2092
- confirmed `SwagCommercial` — commercial plugin listed as a translated plugin in core — vendor/shopware/core/System/Resources/translation.yaml:8
- unverified `Shopping lists` — feature implementation lives in the commercial plugin, not installed under vendor/shopware
