---
id: platform/dev/6.7/products/extensions/subscriptions/guides/_index.md
title: Guides
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/subscriptions/guides/
sourceHash: ad36ecc88b090d3775a2f80910965d1d084f37a9
codeCheckedAgainst: "6.7.15.1"
keywords: ["subscriptions guides", "separate checkout", "mixed checkout", "template scoping", "b2b employee integration", "subscription cart", "subscription_cart", "recurring orders", "abo", "subscriptions extension"]
summary: "Index of Subscriptions extension guides: separate checkout, mixed cart checkout, template scoping, and B2B employee integration."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/extensions/subscriptions/concept.md", "platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md", "platform/dev/6.7/products/extensions/subscriptions/guides/mixed-checkout.md", "platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md"]
---
## What it is

Overview page for the guides section of the Shopware Subscriptions extension, covering common integration topics. It lists the available guides and points back to the concept page, which should be read first.

## When to use

Use it to pick the right guide when integrating an extension with subscriptions. Read the [concept](platform/dev/6.7/products/extensions/subscriptions/concept.md) before any of the guides.

## Key steps / config

Available guides:

- [Separate Checkout](platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md) — the separate subscription checkout flow.
- [Mixed Checkout](platform/dev/6.7/products/extensions/subscriptions/guides/mixed-checkout.md) — the mixed cart checkout with subscription and regular products in one cart.
- [Template Scoping](platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md) — working with scoped templates in subscriptions.
- [B2B Employee Integration](platform/dev/6.7/products/extensions/subscriptions/guides/b2b-employee-integration.md) — using subscriptions with B2B employee management.

## Code check (6.7.15.1)
- confirmed `subscription_cart` — subscription cart link table is known to core as a table without DAL definition — vendor/shopware/core/Framework/DataAbstractionLayer/DefinitionValidator.php:121
- confirmed `_templateScopes` — request attribute core reads for template scoping — vendor/shopware/core/Framework/Adapter/Twig/TemplateScopeDetector.php:14
- unverified `Subscriptions` — commercial extension code is not part of core/storefront/administration
