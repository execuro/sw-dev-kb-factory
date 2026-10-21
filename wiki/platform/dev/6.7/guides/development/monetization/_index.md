---
id: platform/dev/6.7/guides/development/monetization/_index.md
title: Monetization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/monetization/
sourceHash: 3e6c48b4bc3f7638eacd9d517fc027262f3cb275
codeCheckedAgainst: "6.7.15.1"
keywords: ["monetization", "paid extensions", "in-app purchases", "IAP", "InAppPurchase", "subscription", "one-time purchase", "Shopware Store", "Shopware Account", "Shopware Technology Partner", "STP", "commission"]
summary: Ways to monetize a Shopware extension - paid Store extensions, In-App Purchases (since 6.6.9.0), and commission-based integrations under an STP agreement.
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/guides/development/monetization/in-app-purchases.md", "platform/dev/6.7/guides/development/testing/store/quality-guidelines.md", "platform/dev/6.7/guides/development/testing/store/store-review-errors.md"]
---
## What it is

An overview of the monetization models Shopware offers for extensions sold through the Shopware Store.

## When to use

You are choosing a business model for an extension: selling it outright, unlocking features inside it, or earning revenue from an external service it integrates.

## Key steps / config

1. **Paid extensions**: sell the extension as a one-time purchase or a subscription via the Shopware Store. Pricing and licensing are managed in your Shopware Account.
2. **In-App Purchases (IAP)**: lock specific features of the same extension behind extra purchases. Available since Shopware 6.6.9.0. In core, active purchases are exposed through the `Shopware\Core\Framework\Store\InAppPurchase` service (`isActive($extensionName, $identifier)`, `getByExtension()`, `all()`). Details: [In-App Purchases](platform/dev/6.7/guides/development/monetization/in-app-purchases.md).
3. **Commission-based integrations**: if the extension integrates external services that generate revenue (e.g. transaction-based fees), a Shopware Technology Partner (STP) agreement may be required.

All monetized extensions must comply with the [quality guidelines](platform/dev/6.7/guides/development/testing/store/quality-guidelines.md) and avoid the [Common Store Review Errors](platform/dev/6.7/guides/development/testing/store/store-review-errors.md).

## Essential identifiers

- `Shopware\Core\Framework\Store\InAppPurchase`
- `InAppPurchase::isActive()`

## Version notes

- In-App Purchases require Shopware 6.6.9.0 or later.

## Code check (6.7.15.1)
- confirmed `InAppPurchase` — core service holding active purchases per extension — vendor/shopware/core/Framework/Store/InAppPurchase.php:10
- confirmed `InAppPurchase::isActive()` — checks an identifier for an extension name — vendor/shopware/core/Framework/Store/InAppPurchase.php:70
- confirmed `InAppPurchase::getByExtension()` — lists active purchase identifiers of one extension — vendor/shopware/core/Framework/Store/InAppPurchase.php:53
- unverified `6.6.9.0` — introduction version is not recorded in the installed code
- unverified `STP` — commercial agreement, not represented in code
