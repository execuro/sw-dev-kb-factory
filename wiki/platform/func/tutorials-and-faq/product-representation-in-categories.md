---
id: platform/func/tutorials-and-faq/product-representation-in-categories.md
title: Product Representation In Categories
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/product-representation-in-categories
sourceHash: d714d6efe469ba014023153629f9171db14ab824a34c6bedec82378fa2cf5b28
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["product box", "category page", "Shopping Experiences", "Product Listing block", "advanced prices", "list price", "variant information", "cheapest variant", "add to shopping cart button"]
summary: "How product box display on category pages is controlled: admin product-list settings, Shopping Experiences layout, and pricing/variant badges."
lastBuilt: 2026-09-15
---

## What it is

Explains the settings that influence how a product is represented in the product box on category pages, and what information is shown depending on the product's type and configuration.

## Key steps / config

Configuration options: under **Settings > Shop > Products**, you can specify whether a "buy" button is shown on category overview to add the product directly to the cart. The general layout of product boxes is defined in a **Shopping Experience** of type Category Pages, in the Product Listing block.

Information shown in the product box depends on product configuration:
- **Advanced prices**: if a price scale has been created, the lowest possible price is shown with the addition "From"; no direct add-to-cart button is displayed for these products.
- **List price**: if a list price higher than the current sales price is set, it is shown crossed out next to the sales price, with a discount badge.
- **Variant information**: for products with multiple variants, information on the variant shown in the box is displayed; if the shown variant isn't the cheapest, the cheapest variant's info is also shown. Clicking the add-to-cart button adds the displayed variant; clicking elsewhere on the box (image/name) selects another variant.

## Essential identifiers

- Shopping Experience block: Product Listing
- Settings > Shop > Products
