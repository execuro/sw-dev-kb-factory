---
id: platform/dev/6.6/guides/plugins/plugins/checkout/cart/add-cart-discounts.md
title: Add cart discounts
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/checkout/cart/add-cart-discounts.html
sourceHash: d4
keywords: [cart, discount, PromotionEntity, processor]
summary: Add a discount line item to the cart with a cart processor (6.6).
lastBuilt: 2026-08-30
---
## What it is

A cart processor adds a discount `LineItem` for matching products (6.6 variant).

## Key steps / config

Implement `CartProcessorInterface`; the `PromotionEntity` service differs from 6.7.
