---
id: platform/dev/6.7/concepts/framework/in-app-purchases.md
title: In-App Purchases
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/in-app-purchases.html
sourceHash: fd7230d09209989c026d5de024bc21e88f738760
codeCheckedAgainst: "6.7.15.1"
keywords: ["in-app purchases", "iap", "paywall", "jwt", "jwks", "in-app-purchase.update", "InAppPurchase", "InAppPurchaseUpdateTask", "scheduled-task:run-single", "api.store.active-in-app-purchases", "app server", "extension monetization"]
summary: "In-App Purchases (since 6.6.9.0): per-extension signed JWT of bought features, JWKS verification, in-app-purchase.update task, sent to app servers."
lastBuilt: 2026-10-20
---
## What it is

In-App Purchases (IAP), available since Shopware 6.6.9.0, let an extension lock features behind a paywall inside the same extension, e.g. a free version with limited features and paid features unlocked on purchase. Purchases are created in the Shopware Account (see the Extension Partner documentation at https://docs.shopware.com/en/account-en/extension-partner/in-app-purchases).

## When to use

- Offering paid feature tiers within one app or plugin.
- Validating on an app server which features a shop has bought.
- Forcing a refresh of a shop's purchase tokens.

## Key steps / config

**Token** — each extension's purchases are represented by one signed JSON Web Token (JWT); all bought In-App Purchases are JWT claims. The signature can be verified with the JWKS at `https://api.shopware.com/inappfeatures/jwks`. Shopware verifies the signature itself for use in Core and Administration.

**Updating tokens** — tokens are fetched when a purchase is made and periodically by the scheduled task `in-app-purchase.update` (`InAppPurchaseUpdateTask`, daily interval, rescheduled on failure). Trigger manually:

```bash
bin/console scheduled-task:run-single in-app-purchase.update
```

**Apps** — IAP is optimized for app servers: whenever Shopware sends a request to the app server it includes the extension's IAP JWT (signed query parameter `in-app-purchases`), so the server can validate active purchases and unlock features.

**Admin API (app integration context)** in 6.7.15.1:
- `GET /api/store/active-in-app-purchases` → `{ "inAppPurchases": ..., "encodedInAppPurchases": ... }`
- `POST /api/store/check-in-app-purchase-active` with `identifier` → `{ "isActive": bool }`

**Checkout** — Shopware handles checkout, payment and subscription management. To start a purchase, provide the identifier of the desired In-App Purchase; a modal opens for the user to complete the transaction.

## Essential identifiers

- `in-app-purchase.update` (scheduled task name)
- `Shopware\Core\Framework\Store\InAppPurchase` (`isActive()`, `getJWTByExtension()`)
- `https://api.shopware.com/inappfeatures/jwks`
- `api.store.active-in-app-purchases`, `api.store.check-in-app-purchase-active`

## Gotchas

- Plugins are inherently less secure for IAP: their open code is easier to spoof or tamper with than an app server check.
- The docs name a manual refresh endpoint `/api/_action/in-app-purchases/refresh`; no such route exists in the 6.7.15.1 core, storefront or administration source — use the scheduled-task command instead.

## Code check (6.7.15.1)
- confirmed `in-app-purchase.update` — task name of `InAppPurchaseUpdateTask` — vendor/shopware/core/Framework/Store/InAppPurchase/InAppPurchaseUpdateTask.php:18
- confirmed `InAppPurchaseUpdateTask::getDefaultInterval()` — daily — vendor/shopware/core/Framework/Store/InAppPurchase/InAppPurchaseUpdateTask.php:21
- confirmed `/inappfeatures/jwks` — JWKS fetched from the store API — vendor/shopware/core/Framework/Store/InAppPurchase/Services/KeyFetcher.php:66
- confirmed `in-app-purchases` — JWT appended to signed app requests — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:47
- confirmed `InAppPurchase::getJWTByExtension()` — per-extension JWT — vendor/shopware/core/Framework/Store/InAppPurchase.php:60
- confirmed `InAppPurchase::isActive()` — checks an identifier per extension — vendor/shopware/core/Framework/Store/InAppPurchase.php:70
- confirmed `api.store.active-in-app-purchases` — GET route — vendor/shopware/core/Framework/Store/InAppPurchase/Api/InAppPurchasesController.php:35
- confirmed `api.store.check-in-app-purchase-active` — POST route, requires `identifier` — vendor/shopware/core/Framework/Store/InAppPurchase/Api/InAppPurchasesController.php:46
- absent `/api/_action/in-app-purchases/refresh` — no route with this path in the installed code
