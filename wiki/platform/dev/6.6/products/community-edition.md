---
id: "platform/dev/6.6/products/community-edition.md"
title: "Community Edition"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/community-edition.html"
sourceHash: "34ab48cf21a1a416251cd9162e8527b5a979420f"
relatedPages: ["platform/dev/6.6/concepts/commerce/content/shopping-experiences-cms.md"]
keywords: ["Community Edition", "Shopware open source", "Admin API", "Sync API", "Store API", "Shopping Experiences", "Data Abstraction Layer", "Rule builder", "Extensions", "Plugins Themes Apps", "mono repository", "Composable Frontends"]
summary: "Overview of Shopware Community Edition: its Symfony-bundle components and core technical features like Admin/Store API, DAL, rule builder."
lastBuilt: "2026-09-15"
---
## What it is
Describes the Shopware Community Edition: the free, open-source base variant of Shopware that PaaS and SaaS offerings build upon, along with the platform's core components and technical features.

## When to use
Use this as an orientation page when evaluating what the Community Edition includes technically — its component structure, APIs, and extension system — before deciding where to install Shopware or how to extend it.

## Key steps / config
Shopware is a Symfony application composed of several Symfony bundles, each mirrored to its own repository and also included in the `shopware/shopware` mono repository: Core (framework, business logic, APIs), Storefront (Bootstrap/Twig based default frontend), Administration (Vue.js SPA back office, talking to the Core via the Admin API), and Elasticsearch (entity search indexing/adapter). A `Production` repository lets a project require only the packages it needs, e.g. only `shopware/core`, for headless setups.

Key technical features:
- **Admin API** — used by the Administration for all back-office tasks; also exposes the **Sync API** for bulk `UPSERT`/`DELETE` operations in a single request.
- **Store API** — built for customer-facing clients covering the full customer journey (listing, product detail, checkout); used by the Storefront and by Composable Frontends.
- **Shopping Experiences** — the CMS feature for building custom pages (listing, shop, landing, product detail) via drag-and-drop blocks in the Administration; content is stored generically and available through the Store API — see [Shopping Experiences (CMS)](platform/dev/6.6/concepts/commerce/content/shopping-experiences-cms.md) for more detail.
- **Data Abstraction Layer** — the built-in ORM, including automatic API endpoint generation per entity.
- **Rule builder** — the rule engine for building conditions used across modules, e.g. promotion codes, shipping methods, payment methods, product prices.
- **Extensions** — Plugins, Themes, and Apps let you extend and customize Shopware without touching the core.

## Essential identifiers
- `shopware/shopware` — the mono repository containing Core, Storefront, Administration, Elasticsearch
- Admin API / Sync API — back-office and bulk-write APIs
- Store API — customer-facing storefront API
- Data Abstraction Layer — Shopware's built-in ORM
