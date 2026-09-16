---
id: platform/dev/6.7/products/extensions/subscriptions/guides/_index.md
title: Guides
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/subscriptions/guides/
sourceHash: ad36ecc88b090d3775a2f80910965d1d084f37a9
codeCheckedAgainst: "6.7.13.0"
keywords: ["subscriptions guides", "separate checkout", "mixed checkout", "mixed cart", "template scoping", "b2b employee integration", "subscription checkout", "subscription cart", "recurring orders", "subscriptions"]
summary: "Index of Subscriptions extension guides: separate checkout, mixed cart checkout, template scoping and B2B employee integration."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/subscriptions/concept.md", "platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md", "platform/dev/6.7/products/extensions/subscriptions/guides/mixed-checkout.md", "platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md"]
---
## What it is

Index of the how-to guides for the Subscriptions extension. Read the [concept](platform/dev/6.7/products/extensions/subscriptions/concept.md) first.

## Key steps / config

Available guides:

- [Separate Checkout](platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md) — the separate (isolated, one product at a time) subscription checkout flow
- [Mixed Checkout](platform/dev/6.7/products/extensions/subscriptions/guides/mixed-checkout.md) — mixed cart checkout with subscription and regular products in one cart
- [Template Scoping](platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md) — working with scoped Storefront templates for subscriptions
- [B2B Employee Integration](platform/dev/6.7/products/extensions/subscriptions/guides/b2b-employee-integration.md) — subscriptions with B2B Components employee management

## Code check (6.7.13.0)
- confirmed `TemplateScopeDetector::SCOPES_ATTRIBUTE` — core request attribute `_templateScopes` that template scoping builds on — vendor/shopware/core/Framework/Adapter/Twig/TemplateScopeDetector.php:15
- unverified `Shopware\Commercial\Subscription` — Subscriptions extension code is not installed in the checked vendor roots
