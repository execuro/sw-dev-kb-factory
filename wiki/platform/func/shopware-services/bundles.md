---
id: platform/func/shopware-services/bundles.md
title: Bundles
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/shopware-services/bundles
sourceHash: 2ddc3e667effb69091e51748c4e59ab388d5186524695e143602b090490a1ad8
revision:
  current: true
  range: "6.7.9.0 - 6.7.14.2"
  swMax: "6.7.14.2"
  swMin: "6.7.9.0"
keywords: ["bundles", "product bundles", "Catalogues > Bundles", "bundle discount", "Item is bundle item", "Item of selected bundle", "Commercial extension", "Evolve", "Beyond", "configure and add to cart", "dynamic product groups", "admin api", "produktbundle"]
summary: Product Bundles in the Commercial extension (Evolve/Beyond, 6.7.9.0+) - create and price bundles, storefront display, cart behavior, returns, rules, API.
lastBuilt: 2026-10-20
---
## What it is

A bundle is a product made up of several individual items, sold as one package with an optional discount. It is a commercial feature available with an installed Commercial extension and an Evolve or Beyond plan on Shopware 6.7.9.0 or later.

## When to use

Use it for cross-selling, starter packs or complete solutions, and clearing slow-moving stock. This page covers admin setup, storefront and cart behavior, rules and the API.

## Key steps / config

Create under **Catalogues > Bundles**:
1. General: name, product number (number range by default), description, highlight bundle.
2. Media; cover image is the Storefront main image.
3. Add products; order them with the Position column. Per product via **Configure**: General tab (optional or required, adjustable quantity with minimum and maximum) and Variants tab (select variants, mark a default; new variants are added automatically).
4. Prices: subtotal, currency-dependent prices, discount (Type: percentage or fixed amount, Value, Minimum bundle value, Maximum discount value, Discount rules, Prevent combination with other promotions).
5. Visibility: Sales Channels, Active, categories, tags, search keywords.
6. Release date (informational only, bundle stays purchasable), Layout tab (Shopping Experiences page), SEO settings (meta title, description, SEO path, main category).

Storefront: listing shows cover, name, number of products and reduced price; the detail page shows savings, included products and a **Configure and add to cart** button for configurable bundles. In the cart the bundle discount is distributed across products.

Rule Builder conditions: **Item is bundle item**, **Item of selected bundle**. Dynamic product groups can filter **Product type equals bundle**. A CMS element for bundle recommendations exists for product detail pages. A dedicated SEO URL template can be set under **Settings > SEO**. Admin API docs: https://shopware.stoplight.io/docs/admin-api/b1f9ddd99ef2a-create-bundle-s

## Gotchas

- A bundle must contain at least two products.
- Products or variants assigned to a bundle cannot be deleted; remove them from all bundles first.
- Removing a product from a bundle in the cart discards the bundle discount for the other products; the discount can also be removed manually.
- Availability indicators warn about inactive or unavailable products, products not in the bundle's sales channels, custom product templates, or missing variant selection.
- Partial returns are possible; the discount is distributed proportionally and the refund uses the discounted individual price.
- Automatic combination ("Automatically combine products into bundles", in the shopping cart settings) combines only when a bundle discount applies; customers can click **Undo**.

## Version notes

Requires Shopware 6.7.9.0 or later.
