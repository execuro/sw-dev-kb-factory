---
id: platform/dev/6.6/resources/references/adr/2023-02-01-app-script-product-pricing.md
title: App script product pricing
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-02-01-app-script-product-pricing.html
sourceHash: a58a74df536ed3a7352d89e093c00a209393701e
keywords: ["app script", "product-pricing hook", "calculatedPrice", "calculatedPrices", "calculatedCheapestPrice", "services.prices.create", "services.cart.get", "price manipulation", "app scripting", "cart hook"]
summary: "ADR: introduces the product-pricing app-script hook, letting scripts reset, change, discount or surcharge product prices."
lastBuilt: 2026-09-15
---
## What it is
An architecture decision record introducing direct price manipulation for products via the product-pricing app-script hook, complementing the existing cart hook (which only allowed adding discounts/new line items).

## When to use
Relevant when writing app scripts that need to manipulate a product's price directly (e.g. "give a free sample") rather than only adding cart discounts.

## Key steps / config
- In the product-pricing hook, iterate `hook.products` and operate on `product.calculatedCheapestPrice` / `product.calculatedPrices` / `product.calculatedPrice`.
- Reset default price calculation: `product.calculatedCheapestPrice.reset`, `product.calculatedPrices.reset` (the default price itself is not allowed to be reset since that would make it invalid).
- Build a price object via `services.prices.create({...})` with currency keys (`default`, `USD`, `EUR`, etc.) each holding `gross`/`net`.
- Apply it with `product.calculatedPrice.change(price)`, `.minus(price)`, `.plus(price)`, `.discount(10)`, `.surcharge(10)` — same methods exist on `calculatedCheapestPrice`.
- Graduated prices: `product.calculatedPrices.change([{ to, price }, ...])` with a list of tier objects.
- To manipulate a product's price inside the cart: `services.cart.get('my-product-id')` then `product.price.change(price)`, `.discount(10)`, `.surcharge(10)`.

## Essential identifiers
- `services.prices.create`
- `services.cart.get`
- `product.calculatedPrice` / `product.calculatedPrices` / `product.calculatedCheapestPrice`
- `product.price` (cart line item)
- product-pricing hook
