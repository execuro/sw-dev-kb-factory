---
id: platform/dev/6.6/resources/references/app-reference/script-reference/product-script-services-reference.md
title: Product script services reference
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/app-reference/script-reference/product-script-services-reference.html
sourceHash: 0ef8fa769f2391246ad152f1f2c3b7f0afddbfff
keywords: ["PriceCollectionFacade", "ProductProxy", "SalesChannelProductEntity", "calculatedPrice", "calculatedCheapestPrice", "calculatedPrices", "PriceFacade", "product script services", "graduated prices"]
summary: "PriceCollectionFacade and ProductProxy script services for reading and overwriting a product's calculated/graduated prices."
lastBuilt: "2026-09-15"
---

## What it is
Reference documentation for the script-service facades exposed for products inside app scripts: `Shopware\Core\Content\Product\Hook\Pricing\PriceCollectionFacade` for a product's quantity/graduated price collection, and `Shopware\Core\Content\Product\Hook\Pricing\ProductProxy`, a wrapper around `SalesChannelProductEntity` that exposes product properties and price facades.

## When to use
Use `PriceCollectionFacade` when a script needs to reset or overwrite a product's graduated (quantity-based) prices. Use `ProductProxy` when a script needs to read arbitrary properties of the current product, or its calculated cheapest price, calculated price, or calculated price collection.

## Key steps / config
`PriceCollectionFacade`:
- `reset()` — resets the complete price collection.
- `change(changes)` — completely overwrites the product's quantity price graduation; `changes` is an array.
- `count()` — returns the number of prices stored in the collection.

`ProductProxy`:
- `__get(name)` — gives access to all properties of the underlying `SalesChannelProductEntity`; returns `mixed|null` since all properties go through `__get()`.
- `calculatedCheapestPrice` — returns the cheapest price wrapped in a `PriceFacade`, or `null` if the product has none.
- `calculatedPrice` — returns the product's price wrapped in a `PriceFacade`, or `null` if the product has no price.
- `calculatedPrices` — returns the product's graduated prices wrapped in a `PriceCollectionFacade`, or `null` if the product has no graduated prices.

## Essential identifiers
- `Shopware\Core\Content\Product\Hook\Pricing\PriceCollectionFacade`
- `Shopware\Core\Content\Product\Hook\Pricing\ProductProxy`
- `Shopware\Core\Content\Product\SalesChannel\SalesChannelProductEntity`
- `Shopware\Core\Checkout\Cart\Facade\PriceFacade`

## Gotchas
`calculatedCheapestPrice`, `calculatedPrice`, and `calculatedPrices` can each be `null` depending on whether the product has a cheapest price, a price, or graduated prices respectively — check for `null` before using the returned facade.
