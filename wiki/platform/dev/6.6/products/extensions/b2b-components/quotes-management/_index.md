---
id: platform/dev/6.6/products/extensions/b2b-components/quotes-management/_index.md
title: Quotes Management
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/quotes-management/
sourceHash: ee5e2db817ca2d59df6390ae06256ea1b02ca00e
keywords: ["quotes management", "quote", "quotes", "B2B", "b2b-components", "quote request", "checkout", "cart", "discount", "administration", "order", "B2B partner", "B2B merchant", "negotiation"]
summary: Overview of the B2B quote workflow, letting B2B partners request quotes from a cart and merchants adjust and send them back for acceptance.
lastBuilt: 2026-09-15
---
## What it is

Describes the Quotes Management component of the B2B components, a feature that lets B2B partners request price quotes from the contents of their cart instead of negotiating manually with the merchant.

## When to use

Relevant when building or extending B2B storefronts that need a formal request-for-quote flow between a business customer (partner) and the merchant, instead of a plain add-to-cart checkout.

## Key steps / config

The quote process follows this sequence, as described by the source:

1. A B2B partner populates their cart with the desired products.
2. The partner initiates a quote request based on the current cart contents.
3. The B2B merchant reviews the submitted quote in the administration system.
4. The merchant can apply discounts to individual product items within the quote to tailor the offer to the partner's needs.
5. The modified quote is sent back to the B2B partner for consideration.
6. The partner is free to accept or decline the offer.
7. On acceptance, the partner is guided through the regular checkout process, and the system automatically generates an order from the accepted quote.

## Gotchas

The whole point of the feature, per the source, is to reduce the need for extensive manual back-and-forth discussion between partner and merchant by handling quote negotiation, discounting and order creation through this structured request/review/accept flow rather than ad-hoc communication.
