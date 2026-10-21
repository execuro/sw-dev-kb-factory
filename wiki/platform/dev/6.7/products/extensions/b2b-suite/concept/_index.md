---
id: platform/dev/6.7/products/extensions/b2b-suite/concept/_index.md
title: Concepts
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/concept/
sourceHash: a993b5eafc1644b5611d0e8902bc1d64e5bba525
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "b2b concepts", "system architecture", "basic conventions", "method structure", "line item list", "LineItemList", "business-to-business", "b2b components", "trading partners"]
summary: "Overview of B2B Suite concept pages: system architecture, basic conventions, method structure and the line item list component."
lastBuilt: 2026-10-21
---
## What it is

Entry page for the B2B Suite concept section. The B2B Suite is a Shopware extension for business-to-business transactions: it provides tools for communication, collaboration and transaction management between a shop operator and its trading partners (company accounts and their employees).

## When to use

Start here when you need the conceptual background of the B2B Suite before extending it. The section is split into four topics:

- **System architecture** — how the suite is built from loosely coupled components and how they depend on each other.
- **Basic conventions** — naming rules for container ids, tables, templates, snippets, and the mapping between UI terms and entity names.
- **Method structure** — which functions are replaceable and what compatibility guarantees apply to public, protected `@internal` and TypeScript methods.
- **Line item list** — the central product-list abstraction (`LineItemList` / `LineItemReference`) used by carts, orders, and other B2B components.

## Code check (6.7.15.1)
- unverified `B2B Suite` — separate extension (`Shopware\B2B\...` namespace), no matching code in vendor/shopware/{core,storefront,administration}; out of scope
- unverified `LineItemList` — B2B Suite component, not present in the installed core/storefront/administration packages
