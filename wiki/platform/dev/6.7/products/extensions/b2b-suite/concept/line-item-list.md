---
id: platform/dev/6.7/products/extensions/b2b-suite/concept/line-item-list.md
title: Line Item List
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/concept/line-item-list.html
sourceHash: 455214969ca3845d4e5407714ac8f7585f3d933b
codeCheckedAgainst: "6.7.13.0"
keywords: ["LineItemList", "LineItemReference", "line item list", "product list", "order context", "audit logging", "b2b suite", "line item", "persistable product lists", "vouchers"]
summary: B2B Suite LineItemList component - LineItemList and LineItemReference entities as a unified abstraction over Shopware cart, order and product data.
lastBuilt: 2026-09-15
---
## What it is

The LineItemList component is the central representation of product lists in the B2B Suite and is reused by many child components. Design goals:

- central abstraction of product lists
- minimal knowledge and inheritance of Shopware core services and data structures
- persistable product lists
- guaranteed audit logging

## When to use

When working with any B2B Suite feature that handles lists of products (e.g. carts, orders, stored lists) and you need to understand which objects to depend on instead of Shopware's own cart/order structures.

## Key steps / config

- The component's central entities are `LineItemList` and `LineItemReference`. A `LineItemReference` references a line item — usually a product, but any valid purchasable item (e.g. a voucher) is possible.
- To work with the Shopware cart, order and product listing, `LineItemReference` objects can be populated from different Shopware entities. Each reference borrows data from Shopware data structures, but consumers depend only on `LineItemReference` and `LineItemList` for unified access — both for not-yet-ordered and for ordered lists.
- Order-specific data is abstracted away through an order context object, which is either generated during the Shopware checkout process or created dynamically through the API.
- Rule stated by the source: the B2B Suite may store or provide IDs without having an actual concept of what they refer to.

## Essential identifiers

- `LineItemList` — B2B Suite product list entity
- `LineItemReference` — reference to a single purchasable line item within a list

## Gotchas

- `LineItemList` here is a B2B Suite entity, not a Shopware core class; Shopware core's own cart item class is `LineItem`, which the B2B structures only borrow data from.

## Code check (6.7.13.0)
- unverified `LineItemList` — B2B Suite extension not installed; no class of that name in vendor/shopware/core, storefront or administration
- unverified `LineItemReference` — B2B Suite extension not installed; no match under vendor/shopware roots
- confirmed `LineItem` — core cart line item class the B2B references draw data from — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:21
