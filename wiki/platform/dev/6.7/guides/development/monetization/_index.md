---
id: platform/dev/6.7/guides/development/monetization/_index.md
title: Monetization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/monetization/
sourceHash: 3e6c48b4bc3f7638eacd9d517fc027262f3cb275
codeCheckedAgainst: "6.7.13.0"
keywords: ["monetization", "paid extensions", "in-app purchases", "iap", "subscription", "one-time purchase", "shopware store", "shopware account", "commission", "shopware technology partner", "stp", "extension pricing"]
summary: "Store extension monetization: paid (one-time/subscription), In-App Purchases (since 6.6.9.0), commission-based integrations (STP agreement)."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/monetization/in-app-purchases.md", "platform/dev/6.7/guides/development/testing/store/quality-guidelines.md", "platform/dev/6.7/guides/development/testing/store/store-review-errors.md"]
---
## What it is

Overview of the ways to monetize an extension distributed through the Shopware Store: paid extensions, In-App Purchases (IAP), and commission-based integrations.

## When to use

When deciding on a business model for an extension before publishing it in the Shopware Store.

## Key steps / config

- **Paid extensions**: sold as a one-time purchase or as a subscription via the Shopware Store. Pricing and licensing are managed in the Shopware Account, not in extension code.
- **In-App Purchases (IAP)**: lock specific features behind additional purchases inside the same extension. See [In-App Purchases](platform/dev/6.7/guides/development/monetization/in-app-purchases.md).
- **Commission-based integrations**: if the extension integrates external services and generates revenue (e.g. transaction-based fees), a Shopware Technology Partner (STP) agreement may be required.
- Every monetized extension must comply with the [quality guidelines](platform/dev/6.7/guides/development/testing/store/quality-guidelines.md) and avoid the [Common Store Review Errors](platform/dev/6.7/guides/development/testing/store/store-review-errors.md).

## Essential identifiers

- `Shopware\Core\Framework\Store\InAppPurchase` (core service holding active In-App Purchases per extension)

## Version notes

- In-App Purchases are available since Shopware 6.6.9.0.

## Code check (6.7.13.0)
- confirmed `InAppPurchase` — core service exposing active purchases per extension — vendor/shopware/core/Framework/Store/InAppPurchase.php:10
- confirmed `InAppPurchase::getByExtension()` — returns purchased IAP identifiers for one extension — vendor/shopware/core/Framework/Store/InAppPurchase.php:53
- confirmed `ExtensionStruct::$inAppPurchases` — Store extension data carries IAP list — vendor/shopware/core/Framework/Store/Struct/ExtensionStruct.php:163
- unverified `6.6.9.0` — introduction version not derivable from installed code
- unverified `STP agreement` — commercial/licensing policy, not in code
