---
id: platform/func/settings/productlist.md
title: Productlist
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/productlist
sourceHash: b2f87895ddc7f687e835225094e82f36b657f7d76cf984fccfb9c3733085edba
revision:
  current: true
  range: "6.4.4.0 - 6.6.10.8"
  swMax: "6.6.10.8"
  swMin: "6.4.4.0"
keywords: ["product list", "Settings > Commerce > Products", "buy button", "autoplay videos", "clearance hiding", "sorting options", "default sorting", "technical name", "number of products per page"]
summary: "Settings > Commerce > Products: configures buy buttons, autoplay, clearance hiding, reviews, filters and sorting options for the storefront listing."
lastBuilt: 2026-09-15
---
## What it is
This admin area (Settings > Commerce > Products) configures how products are displayed in the storefront listing: buy buttons, autoplay video covers, clearance handling, reviews display, filters, and product sorting options.

## When to use
Use when adjusting default product-listing behaviour store-wide or per sales channel, or when creating custom sorting options for the listing/search results.

## Key steps / config
- Default Sales Channel: choose which sales channels newly created products are automatically assigned to, and their default visibility, once activated.
- Product section settings (global or per sales channel): Display buy buttons in listings (shows "Add to basket", or "Details" for variant products; disabling shows "Details" for all products), Autoplay videos in product listings, Hide products after clearance (hides items once stock reaches 0), Show variant options in the search suggestion results, Show reviews (star rating in listing), Number of reviews per page, Disable filter options without results, "Mark products as 'new', for ? days" (e.g. 30), Number of products per page, Default sorting, Default search result sorting.
- Sorting / Sorting options: overview lists each sorting option's criterion and priority (double-click priority to adjust); "Add option" creates a new one with Name, Technical Name (unique, required), Active, Sorting Criteria (e.g. release date, stock level, product name), Order (ascending/descending) and Priority.

## Essential identifiers
- Menu path: `Settings > Commerce > Products`
- Sorting option fields: `Name`, `Technical Name`, `Sorting Criteria`, `Order`, `Priority`

## Gotchas
- Disabling "Display buy buttons in listings" replaces the buy button with "Details" for all products, including simple (non-variant) ones.
- "Technical Name" for a sorting option must be unique across all sorting options.
