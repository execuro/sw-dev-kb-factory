---
id: platform/dev/6.7/products/extensions/_index.md
title: Extensions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/
sourceHash: 0fc2533361963d528ff8a4971baf807e1fe1367a
codeCheckedAgainst: "6.7.13.0"
keywords: ["extensions", "Migration Assistant", "B2B Suite", "B2B Components", "Advanced Search", "Subscriptions", "shopware extensions", "b2b", "data migration", "subscription products", "custom search fields"]
summary: "Overview of Shopware's own extensions: Migration Assistant, B2B Suite, B2B Components, Advanced Search and Subscriptions."
lastBuilt: 2026-09-15
---
## What it is

Landing page for the documentation of Shopware-provided extensions. It lists five extensions, each with a one-line purpose:

- **Migration Assistant** — connects a source shop and a target shop to migrate data.
- **B2B Suite** — adds core B2B functions: workflows, order lists, budgets and quick orders.
- **B2B Components** — modular B2B functionality to add to a shop.
- **Advanced Search** — lets you customize the search fields.
- **Subscriptions** — offer products on a subscription basis.

## When to use

Start here to pick the sub-section for one of these extensions (for example Advanced Search configuration or B2B Components) before reading the specific guides.

## Gotchas

None of these extensions is part of the `shopware/core`, `shopware/storefront` or `shopware/administration` packages; their code ships separately (for example in the commercial plugin), so their classes cannot be looked up in the core vendor packages.

## Code check (6.7.13.0)
- unverified `Migration Assistant` — separate extension, not part of vendor/shopware core/storefront/administration
- unverified `B2B Suite` — separate extension, out of scope of the installed core packages
- unverified `B2B Components` — shipped with the commercial extension, out of scope
- unverified `Advanced Search` — commercial extension (`Shopware\Commercial\AdvancedSearch`), no match in vendor/shopware/core
- unverified `Subscriptions` — commercial extension, out of scope
