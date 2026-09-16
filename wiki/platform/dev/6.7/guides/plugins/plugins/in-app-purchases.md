---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/in-app-purchases.md
sourceHash: 1efc4a13675b01980bcd61f58d3075727ecff0c2
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/in-app-purchases.html
title: In-App Purchases (IAP)
version: "6.7"
versions:
  - "6.7"
keywords: ["in-app purchases", "iap", "paywall", "InAppPurchase", "isActive", "inAppPurchaseCheckout", "Shopware.InAppPurchase", "Shopware.Store", "InAppPurchasesGatewayEvent", "extension monetization", "paid features", "plugin"]
summary: In-App Purchases in plugins - request checkout via inAppPurchaseCheckout store, check InAppPurchase::isActive in PHP and admin, InAppPurchasesGatewayEvent.
lastBuilt: 2026-09-15
---
## What it is

In-App Purchases (IAP) lock features of an extension behind a paywall inside the same extension, so a free version can be upgraded with paid features. Shopware provides the checkout; the extension requests it and checks which purchases are active.

## When to use

You build a plugin (or app) that offers paid features and must trigger the purchase flow in the Administration, or gate behaviour in PHP or admin code on an active purchase.

## Key steps / config

1. **Request a checkout** in the Administration via the `inAppPurchaseCheckout` Pinia store. You provide the button yourself and hide it when the IAP is already active and cannot be bought again:
   ```ts
   computed: {
       inAppPurchaseCheckout() { return Shopware.Store.get('inAppPurchaseCheckout'); },
       hideButton(): boolean { return Shopware.InAppPurchase.isActive('MyExtensionName', 'my-iap-identifier'); },
   },
   methods: {
       onClick() { this.inAppPurchaseCheckout.request({ identifier: 'my-iap-identifier' }, 'MyExtensionName'); },
   },
   ```
   `request(entry, extension)` throws if the extension name is not a known bundle.
2. **Check in PHP**: inject `Shopware\Core\Framework\Store\InAppPurchase` and call `isActive(string $extensionName, string $identifier): bool`:
   ```php
   public function __construct(private readonly InAppPurchase $inAppPurchase) {}
   // ...
   if ($this->inAppPurchase->isActive('MyExtensionName', 'my-iap-identifier')) { /* ... */ }
   ```
   The service also exposes `all()`, `getByExtension()`, and `formatPurchases()`.
3. **Check in the Administration**: `Shopware.InAppPurchase.isActive('MyExtensionName', 'my-iap-identifier')`.
4. **Manipulate available IAPs**: apps use the In-App Purchase gateway; plugins listen to `Shopware\Core\Framework\App\InAppPurchases\Event\InAppPurchasesGatewayEvent`, dispatched after the gateway receives the app server response (payload: `$response`, an `InAppPurchasesResponse`).

## Essential identifiers

- `Shopware\Core\Framework\Store\InAppPurchase` / `isActive()`
- `Shopware.InAppPurchase.isActive()`
- `Shopware.Store.get('inAppPurchaseCheckout')`, `request()`
- `Shopware\Core\Framework\App\InAppPurchases\Event\InAppPurchasesGatewayEvent`

## Gotchas

- `InAppPurchase` is a `final` class — inject it, do not extend it; its constructor is `@internal`.
- `InAppPurchasesGatewayEvent` is marked `@internal` in the installed code, so its shape is not covered by the backward-compatibility promise even though the docs recommend listening to it.
- Active purchases are cached per request in the service and cleared via `reset()`.

## Version notes

- Available since Shopware 6.6.9.0.

## Code check (6.7.13.0)
- confirmed `InAppPurchase` — final service class in `Shopware\Core\Framework\Store` — vendor/shopware/core/Framework/Store/InAppPurchase.php:10
- confirmed `InAppPurchase::isActive()` — `(string $extensionName, string $identifier): bool` — vendor/shopware/core/Framework/Store/InAppPurchase.php:70
- confirmed `inAppPurchaseCheckout` — Pinia store id — vendor/shopware/administration/Resources/app/administration/src/app/store/in-app-purchase-checkout.store.ts:22
- confirmed `request()` — store action `(entry, extension)`, throws on unknown extension — vendor/shopware/administration/Resources/app/administration/src/app/store/in-app-purchase-checkout.store.ts:30
- confirmed `isActive()` — admin `Shopware.InAppPurchase` method — vendor/shopware/administration/Resources/app/administration/src/core/in-app-purchase.ts:25
- confirmed `InAppPurchase` — exposed on global Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:216
- confirmed `InAppPurchasesGatewayEvent` — class exists, marked `@internal` — vendor/shopware/core/Framework/App/InAppPurchases/Event/InAppPurchasesGatewayEvent.php:19
- confirmed `InAppPurchasesGatewayEvent` — dispatched after gateway response — vendor/shopware/core/Framework/App/InAppPurchases/Gateway/InAppPurchasesGateway.php:36
