---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/subscriptions/_index.md
relatedPages:
  - platform/dev/6.7/products/extensions/subscriptions/concept.md
sourceHash: fc28f8bf13488c3246766baaf467c3212c7b128e
sourceUrl: https://developer.shopware.com/docs/products/extensions/subscriptions/
title: Subscriptions
version: "6.7"
versions:
  - "6.7"
keywords: ["subscriptions", "subscription extension", "recurring payment", "recurring orders", "subscription model", "abo", "regular delivery", "subscription intervals", "repeat purchase"]
summary: Entry page for the Subscriptions extension, which sells products as recurring-payment subscriptions delivered at regular intervals.
lastBuilt: 2026-10-21
---
## What it is

The entry page for the Subscriptions extension. The extension adds a subscription-based model for products, so a shop can offer products on a subscription basis. In this recurring payment model, customers subscribe to a product and receive it at regular intervals.

## When to use

Products that are consumed regularly — the source names groceries, cosmetics and magazines — and that the shop wants to sell as recurring deliveries rather than one-off purchases.

## Key steps / config

Before working with the extension, read the [subscription concepts](platform/dev/6.7/products/extensions/subscriptions/concept.md) and the merchant user documentation at `https://docs.shopware.com/en/shopware-6-en/settings/shop/subscriptions`.

## Gotchas

- Subscriptions is a separate extension; its code is not part of Shopware core, Storefront or Administration, so nothing on this page can be checked against the installed core packages.

## Code check (6.7.15.1)
- unverified `subscription extension` — separate extension, not shipped in the installed core, storefront or administration packages; the source names no identifiers
