---
id: platform/dev/6.6/products/extensions/b2b-suite/concept/line-item-list.md
title: Line Item List
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/concept/line-item-list.html"
sourceHash: "511d947df12416cf1659533961aa54379702b3ed"
keywords: ["LineItemList", "LineItemReference", "line item list", "b2b suite", "product list", "audit logging", "cart", "order context", "purchasable items", "vouchers", "data structure"]
summary: "LineItemList and LineItemReference are the B2B Suite's central abstraction for persistable, audit-logged product lists."
lastBuilt: "2026-09-15"
---
## What it is

Describes the `LineItemList` component, the B2B Suite's central abstraction for representing product lists, used by multiple child components.

## When to use

Relevant when a component needs to represent a persistable, audit-logged list of products (or other purchasable items such as vouchers) that must work with the Shopware cart, order, and product listing.

## Key steps / config

- The component's main design choices: central abstraction of product lists, minimal knowledge/inheritance of Shopware core services and data structures, persistable lists of products, and guaranteed audit logging.
- Central entities: `LineItemList` and `LineItemReference`. A `LineItemReference` references line items, which are usually products but may be other valid purchasable item types (e.g. vouchers).
- `LineItemReference`s can be set up by different entities so the list works with Shopware's cart, order, and product listing.
- Each `LineItemReference` borrows data from Shopware data structures, but consumers should depend only on `LineItemReference`/`LineItemList` for unified access.
- An order context object (generated during Shopware checkout or created dynamically via the API) abstracts away the specific data. Rule: "The B2B-Suite may store or provide ID's, without having an actual concept of what they refer to."

## Essential identifiers

- `LineItemList`
- `LineItemReference`
