---
id: platform/dev/6.7/concepts/framework/in-app-purchases.md
title: In-App Purchases
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/in-app-purchases.html
sourceHash: fd7230d09209989c026d5de024bc21e88f738760
codeCheckedAgainst: "6.7.13.0"
keywords: ["in-app purchases", "iap", "paywall", "jwt", "jwks", "in-app-purchase.update", "scheduled-task:run-single", "InAppPurchase", "InAppPurchaseUpdateTask", "api.store.check-in-app-purchase-active", "extension monetization", "app server"]
summary: In-App Purchases (6.6.9.0+) - per-extension signed JWT, JWKS verification, daily in-app-purchase.update task, app server checks, checkout modal.
lastBuilt: 2026-09-15
---
## What it is

Concept page for In-App Purchases (IAP): a way to lock features of an extension behind a paywall, so one extension can ship a free tier plus paid features. Available since Shopware 6.6.9.0.

## When to use

- You sell an app or plugin and want to unlock features per purchase.
- You need to know how purchase data reaches Shopware and your app server, and how to verify it.

## Key steps / config

1. **Create** the In-App Purchase in the Shopware Account ([Documentation for Extension Partner](https://docs.shopware.com/en/account-en/extension-partner/in-app-purchases)).
2. **Token**: each extension's purchases are delivered as a signed JSON Web Token (JWT); all bought IAPs are JWT claims, protecting against tampering/spoofing. Verify the signature with the JWKS at `https://api.shopware.com/inappfeatures/jwks`. Shopware verifies the signature itself for use in Core and Administration.
3. **Refresh**: tokens are fetched on a new purchase and periodically by scheduled task `in-app-purchase.update` (default interval daily). Trigger manually:

   ```
   bin/console scheduled-task:run-single in-app-purchase.update
   ```

4. **Apps**: IAP is optimised for app servers — Shopware includes the IAP JWT in every request to the app server, which validates active purchases and unlocks features. From the Admin API (integration source), an app can read its purchases via `GET /api/store/active-in-app-purchases` and check one identifier via `POST /api/store/check-in-app-purchase-active` with body `{"identifier": "..."}`.
5. **Checkout**: to start a purchase, provide the IAP identifier; Shopware opens a modal where the user completes the transaction. Payment and subscription management are handled by Shopware.

## Essential identifiers

- `in-app-purchase.update` (`InAppPurchaseUpdateTask`)
- `scheduled-task:run-single`
- `InAppPurchase::isActive()`, `InAppPurchase::getByExtension()`, `InAppPurchase::getJWTByExtension()`
- Routes `api.store.active-in-app-purchases`, `api.store.check-in-app-purchase-active`
- JWKS path `/inappfeatures/jwks`

## Gotchas

- Plugins are inherently less secure for IAP: their open code is more vulnerable to spoofing and tampering than an app server check.
- The docs also name a refresh endpoint `/api/_action/in-app-purchases/refresh`; no such route exists in the installed 6.7.13.0 core, storefront or administration code — use the scheduled task command instead.
- The two `/api/store/...` routes require an Admin API source with an integration (app); other context sources throw.

## Version notes

- In-App Purchases are available since Shopware 6.6.9.0.

## Code check (6.7.13.0)
- confirmed `InAppPurchaseUpdateTask::getTaskName()` — returns `in-app-purchase.update` — vendor/shopware/core/Framework/Store/InAppPurchase/InAppPurchaseUpdateTask.php:18
- confirmed `InAppPurchaseUpdateTask::getDefaultInterval()` — daily — vendor/shopware/core/Framework/Store/InAppPurchase/InAppPurchaseUpdateTask.php:21
- confirmed `scheduled-task:run-single` — console command — vendor/shopware/core/Framework/MessageQueue/Command/RunSingleScheduledTaskCommand.php:15
- confirmed `/inappfeatures/jwks` — JWKS fetched from the store API client — vendor/shopware/core/Framework/Store/InAppPurchase/Services/KeyFetcher.php:66
- confirmed `api.store.active-in-app-purchases` — GET route for the calling app — vendor/shopware/core/Framework/Store/InAppPurchase/Api/InAppPurchasesController.php:35
- confirmed `api.store.check-in-app-purchase-active` — POST, requires `identifier` — vendor/shopware/core/Framework/Store/InAppPurchase/Api/InAppPurchasesController.php:46
- confirmed `InAppPurchase::isActive()` — per extension and identifier — vendor/shopware/core/Framework/Store/InAppPurchase.php:70
- unverified `/api/_action/in-app-purchases/refresh` — route not found in core, storefront or administration sources
