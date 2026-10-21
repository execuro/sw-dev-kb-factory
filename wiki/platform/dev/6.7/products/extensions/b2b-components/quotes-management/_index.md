---
id: platform/dev/6.7/products/extensions/b2b-components/quotes-management/_index.md
title: Quotes Management
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/quotes-management/
sourceHash: ee5e2db817ca2d59df6390ae06256ea1b02ca00e
codeCheckedAgainst: "6.7.15.1"
keywords: ["quotes management", "quote", "quote request", "request for quote", "rfq", "b2b components", "cart to quote", "quote discount", "quote to order", "commercial plugin", "b2b negotiation", "offer"]
summary: "B2B Quote Management overview: partners request a quote from their cart, merchants discount items in the Administration, accepted quotes become orders."
lastBuilt: 2026-10-21
---
## What it is

Overview of the B2B Components *Quote Management* feature (Shopware Commercial plugin), which lets B2B partners request quotes from their cart and lets merchants answer them with adjusted prices, replacing manual negotiation.

## When to use

When a B2B shop needs a request-for-quote flow: a customer asks for an offer on a cart, the merchant reviews and discounts it, and the accepted offer is turned into an order.

## Key steps / config

The lifecycle described by the source:

1. A B2B partner fills the cart with the desired products.
2. The partner starts a quote request based on the cart contents.
3. The merchant reviews the quote in the Administration and can apply discounts to individual product line items.
4. The modified quote is sent back to the partner.
5. The partner accepts or declines. On acceptance the partner goes through checkout, and the system generates an order from the accepted quote automatically.

## Gotchas

- The feature ships with the Commercial plugin; Shopware core contains no quote entity definitions or routes.

## Code check (6.7.15.1)
- confirmed `quote` — core's usage-data allow-list references the quote entity (defined by the Commercial plugin) — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2099
- unverified `Quote Management` — feature implementation lives in the Commercial plugin, outside the installed core/storefront/administration roots
