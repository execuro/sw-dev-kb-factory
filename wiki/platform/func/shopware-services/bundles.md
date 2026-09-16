---
id: platform/func/shopware-services/bundles.md
title: Bundles
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/shopware-services/bundles
sourceHash: b698b4f3218d3e71b236929b9161d2c7cd73233dc195455f6041bd5dd90de19c
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["Product Bundles", "bundle", "Blueprint status", "Shopware Evolve", "bundle discount", "price matrix", "Rule Builder", "bundle item rules", "dynamic product groups", "Admin API", "Catalogues", "SEO URL template", "partial returns"]
summary: "Product Bundles (Blueprint): combine products into a discounted package, manageable under Catalogues > Bundles, with Rule Builder and Admin API support."
lastBuilt: "2026-09-15"
---
## What it is

Bundles (Blueprint status, minimal scope subject to change) let a merchant combine several individual products into a single purchasable package with an optional price discount. Available to Shopware Evolve plan (or higher) customers on Shopware 6.7.9.0 or later.

## When to use

Use bundles for cross-selling/increasing cart value, starter packs/complete solutions, or clearing stock by pairing slow movers with bestsellers.

## Key steps / config

Create bundles under **Catalogues > Bundles**:
- General: Name (1), Product number (2, usually auto-assigned), Description (3), Highlight bundle (4, badge).
- Add media: cover image used as the main Storefront image.
- Add products: Add products (1), Refresh data (2), Position (3, reorder). A bundle needs at least two products; quantity per product is fixed at 1; both main products and variants can be selected.
- Prices: Prices (1, subtotal/discount/total), Currency depending prices (2), Add discount (3), Type (4, Percentage or fixed amount), Value (5), Maximum discount value (6), Discount rules (7, Rule Builder conditions), Prevent combination with other promotions (8).
- Visibility and assignment: Sales Channels (1), Active (2), Set visibility for selected Sales Channels (3), Categories (4), Tags (5), Search keywords (6).
- Labelling: Release date (informational only; the bundle remains purchasable before the date).
- Layout: assign a bundle page from Shopping Experiences.
- SEO settings: Meta title (1), Meta description (2), SEO keywords (3), Sales Channel (4), SEO path (5), Main category (6).

Rule Builder additions for bundles: "Item is bundle item" and "Item of selected bundle" conditions.

A dedicated SEO URL template for bundles can be set under **Settings > SEO** (defaults to the product template).

## Essential identifiers

- `Catalogues > Bundles`
- Rule Builder conditions: "Item is bundle item", "Item of selected bundle"
- CMS element: bundle recommendations element (Shopping Experiences)
- Admin API: dedicated bundle endpoints for create/manage/automate

## Gotchas

- A bundle must contain at least two products; quantity per product is always 1 at this stage.
- If a customer removes a product from the bundle, the bundle discount is also removed.
- Returns can be partial; refunds are based on the discounted individual price of the returned product.

## Version notes

Bundles are in Blueprint status: functionality is intentionally minimal and may change fundamentally based on feedback. Requires Shopware Evolve plan or higher, Shopware 6.7.9.0+.
