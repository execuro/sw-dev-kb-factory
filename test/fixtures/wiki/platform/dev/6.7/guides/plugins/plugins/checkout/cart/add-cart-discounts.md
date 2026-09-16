---
id: platform/dev/6.7/guides/plugins/plugins/checkout/cart/add-cart-discounts.md
title: Add cart discounts
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/cart/add-cart-discounts.html
sourceHash: c3
keywords: [cart, discount, PromotionEntity, processor, LineItem]
summary: Add a discount line item to the cart with a cart processor.
lastBuilt: 2026-08-30
---
## What it is

A cart processor adds a discount `LineItem` for matching products (6.7 variant).

## Key steps / config

Implement `CartProcessorInterface` and register it with the tag `shopware.cart.processor`.
The `PromotionEntity` is not needed for custom discounts.

## Gotchas

Discounts must be re-added on every calculation; the cart is rebuilt each time.
