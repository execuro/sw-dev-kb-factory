---
id: platform/dev/6.7/products/saas.md
title: SaaS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/saas.html
sourceHash: 0d2a007f83f47739b4ada2dcc5b393dec5d1e0bb
codeCheckedAgainst: "6.7.13.0"
keywords: ["saas", "cloud", "shopware cloud", "app system", "apps", "extensions", "hosting", "updates"]
summary: "Shopware SaaS (Cloud): Shopware runs updates, hosting and infrastructure; extensions for SaaS stores are built with the App system."
lastBuilt: 2026-09-15
---
## What it is

Overview of Shopware's SaaS (Cloud) offering: Shopware provides updates, hosting and infrastructure for the store, and the store can still be extended.

## When to use

When deciding how to extend a Shopware SaaS/Cloud store: extensions for SaaS stores are developed with the App system rather than installed server-side code.

## Code check (6.7.13.0)
- confirmed `AppEntity` — the App system exists in the installed core as the app entity — vendor/shopware/core/Framework/App/AppEntity.php:36
- unverified `saas` — hosting, updates and infrastructure of the SaaS offering are outside vendor/shopware
