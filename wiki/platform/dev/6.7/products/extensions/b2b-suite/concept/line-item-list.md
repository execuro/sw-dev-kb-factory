---
id: platform/dev/6.7/products/extensions/b2b-suite/concept/line-item-list.md
title: Line Item List
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/concept/line-item-list.html
sourceHash: 455214969ca3845d4e5407714ac8f7585f3d933b
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "LineItemList", "LineItemReference", "line item list", "product list", "order context", "shopping list", "audit log", "persistable list", "line items", "vouchers"]
summary: "B2B Suite LineItemList component: LineItemList and LineItemReference entities abstract carts, orders and product lists behind an order context."
lastBuilt: 2026-10-21
---
## What it is

The LineItemList component is the central representation of product lists in the B2B Suite. It is used by many child components across the suite. Its design goals:

- a central abstraction of product lists;
- minimal knowledge and inheritance of Shopware core services and data structures;
- persistable lists of products;
- guaranteed audit logging.

## When to use

Read this when building or extending a B2B Suite component that handles product lists (carts, orders, saved lists) and you need to know which objects to depend on instead of Shopware's own cart/order structures.

## Key steps / config

- The component's two central entities are `LineItemList` and `LineItemReference`. A `LineItemReference` references a line item — usually a product, but it may be any other valid purchasable type (e.g. a voucher).
- To work with the Shopware cart, order and product listing, `LineItemReference`s can be populated from different Shopware entities. A not-yet-ordered list and an ordered list borrow their data from different Shopware structures, but consumers depend only on `LineItemList` and `LineItemReference` for unified access.
- The same pattern applies to the other data structures of the component: specific data is abstracted behind an **order context** object, which is either generated during the Shopware checkout or created dynamically through the API.
- Rule stated by the docs: *the B2B Suite may store or provide IDs without having an actual concept of what they refer to.*

## Essential identifiers

- `LineItemList` — list container entity
- `LineItemReference` — reference to a single purchasable line item
- order context — object carrying order-specific data for a list

## Gotchas

- Code against `LineItemList`/`LineItemReference`, not against the underlying Shopware cart or order objects; the abstraction is what keeps B2B components forward compatible.
- Referenced IDs are opaque to the suite — do not expect it to resolve or validate what they point to.

## Code check (6.7.15.1)
- unverified `LineItemList` — B2B Suite entity, no occurrence in vendor/shopware/{core,storefront,administration}
- unverified `LineItemReference` — B2B Suite entity, not in the installed Shopware packages
- confirmed `LineItem` — the Shopware cart line item the references borrow data from — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:21
- confirmed `LineItem::PROMOTION_LINE_ITEM_TYPE` — non-product purchasable type (vouchers/promotions) in the core cart — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:26
