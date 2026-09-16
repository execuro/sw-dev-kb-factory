---
id: platform/dev/6.7/products/extensions/b2b-components/quotes-management/_index.md
title: Quotes Management
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/quotes-management/
sourceHash: ee5e2db817ca2d59df6390ae06256ea1b02ca00e
codeCheckedAgainst: "6.7.13.0"
keywords: ["quotes management", "quote", "quote request", "request for quotation", "rfq", "b2b components", "cart to quote", "quote discount", "quote to order", "commercial plugin"]
summary: B2B Quote Management overview - quote requested from cart, merchant discounts items in admin, accepted quote goes through checkout into an order.
lastBuilt: 2026-09-15
---
## What it is

Overview of the B2B Components (Commercial) Quote Management feature: B2B partners request a quote based on their cart, the merchant reviews and adjusts it in the administration, and an accepted quote becomes an order.

## When to use

As the entry point when working on quote-based B2B flows; the concepts and guides below this section cover the entities and cart/quote conversion.

## Key steps / config

The process flow described by the source:

1. The B2B partner fills the cart with products.
2. The partner initiates a quote request based on the cart contents.
3. The merchant reviews the quote in the administration and can apply discounts to individual product line items.
4. The modified quote is sent back to the partner.
5. The partner accepts or declines. On acceptance, the partner goes through checkout.
6. The system automatically generates an order from the accepted quote.

## Code check (6.7.13.0)
- unverified `Quote Management` — feature implemented in the Commercial plugin, outside the installed vendor/shopware roots
- confirmed `OrderDefinition` — core order entity that an accepted quote results in — vendor/shopware/core/Checkout/Order/OrderDefinition.php:56
