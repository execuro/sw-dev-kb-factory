---
id: platform/dev/6.7/guides/plugins/plugins/in-app-purchases.md
title: In-App Purchases (IAP)
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/in-app-purchases.html
sourceHash: 1efc4a13675b01980bcd61f58d3075727ecff0c2
codeCheckedAgainst: "6.7.15.1"
keywords: ["in-app purchase", "IAP", "paywall", "InAppPurchase", "isActive", "inAppPurchaseCheckout", "Shopware.InAppPurchase", "Shopware.Store", "InAppPurchasesGatewayEvent", "plugin monetization", "paid feature", "extension partner"]
summary: "Plugin In-App Purchases: request checkout via the inAppPurchaseCheckout admin store, check InAppPurchase::isActive() in PHP or admin JS, gateway event."
lastBuilt: 2026-10-21
---
## What it is

How a plugin locks features behind In-App Purchases (IAP) within the same extension: starting the Shopware-provided checkout from the Administration, checking whether a purchase is active in PHP and admin JS, and reacting to the IAP gateway. See also the [Extension Partner documentation](https://docs.shopware.com/en/account-en/extension-partner/in-app-purchases).

## When to use

You offer a free extension with optional paid features and need to gate code paths or UI on whether a given IAP identifier was bought.

## Key steps / config

1. **Offer the purchase (Administration).** Request a checkout via the `inAppPurchaseCheckout` store; Shopware renders the checkout. You provide the button and hide it when the IAP cannot be bought again:

```ts
computed: {
    inAppPurchaseCheckout() { return Shopware.Store.get('inAppPurchaseCheckout'); },
    hideButton(): boolean { return Shopware.InAppPurchase.isActive('MyExtensionName', 'my-iap-identifier'); },
},
methods: {
    onClick() { this.inAppPurchaseCheckout.request({ identifier: 'my-iap-identifier' }, 'MyExtensionName'); },
},
```

2. **Check in PHP.** Inject `Shopware\Core\Framework\Store\InAppPurchase` and call `isActive(string $extensionName, string $identifier): bool`. Also available: `all()`, `getByExtension(string $extensionName)`.
3. **Check in the Administration.** `Shopware.InAppPurchase.isActive('MyExtensionName', 'my-iap-identifier')`.
4. **Manipulate available IAPs.** Apps use the In-App Purchase gateway; plugins can listen to `Shopware\Core\Framework\App\InAppPurchases\Event\InAppPurchasesGatewayEvent`, dispatched after the gateway received the app server response; it carries the `response` (`InAppPurchasesResponse`).

## Essential identifiers

- `Shopware\Core\Framework\Store\InAppPurchase::isActive()`
- `inAppPurchaseCheckout` (admin store, action `request(entry, extension)`)
- `Shopware.InAppPurchase.isActive()`
- `Shopware\Core\Framework\App\InAppPurchases\Event\InAppPurchasesGatewayEvent`

## Gotchas

- `inAppPurchaseCheckout.request()` throws `Extension with the name "..." not found.` if the extension name is not a registered bundle in the admin config.
- `InAppPurchasesGatewayEvent` is annotated `@internal` in the code, although the docs present it for plugins.

## Version notes

In-App Purchases are available since Shopware 6.6.9.0.

## Code check (6.7.15.1)
- confirmed `InAppPurchase::isActive()` — (extensionName, identifier): bool — vendor/shopware/core/Framework/Store/InAppPurchase.php:70
- confirmed `InAppPurchase::getByExtension()` — active identifiers per extension — vendor/shopware/core/Framework/Store/InAppPurchase.php:53
- confirmed `inAppPurchaseCheckout` — Pinia store id — vendor/shopware/administration/Resources/app/administration/src/app/store/in-app-purchase-checkout.store.ts:22
- confirmed `request` — store action (entry, extension), throws on unknown bundle — vendor/shopware/administration/Resources/app/administration/src/app/store/in-app-purchase-checkout.store.ts:30
- confirmed `InAppPurchase` — exposed as Shopware.InAppPurchase on the global object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:229
- confirmed `isActive` — admin JS (extensionName, inAppPurchase) — vendor/shopware/administration/Resources/app/administration/src/core/in-app-purchase.ts:20
- confirmed `InAppPurchasesGatewayEvent` — dispatched in InAppPurchasesGateway — vendor/shopware/core/Framework/App/InAppPurchases/Gateway/InAppPurchasesGateway.php:36
- corrected `InAppPurchasesGatewayEvent` — docs: plugin-facing event; class docblock marks it @internal — vendor/shopware/core/Framework/App/InAppPurchases/Event/InAppPurchasesGatewayEvent.php:21
