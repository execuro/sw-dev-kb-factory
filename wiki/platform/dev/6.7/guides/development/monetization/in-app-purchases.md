---
id: platform/dev/6.7/guides/development/monetization/in-app-purchases.md
title: In-App Purchases (IAP)
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/monetization/in-app-purchases.html
sourceHash: d03bcdee422d7363c4341814002c75b7feb2e43e
codeCheckedAgainst: "6.7.15.1"
keywords: ["in-app purchases", "iap", "sw.iap.purchase", "inAppPurchases", "in-app-purchases", "sw-main-hidden", "jwt", "jwks", "shopware/app-bundle", "shopware/app-php-sdk", "ModuleAction", "paywall", "meteor admin sdk", "extension monetization"]
summary: How extensions sell In-App Purchases via sw.iap.purchase() and validate the IAP JWT (in-app-purchases / inAppPurchases) against Shopware's JWKS.
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/concepts/framework/in-app-purchases.md"]
---
## What it is

In-App Purchases (IAP) let an extension lock features behind a paywall inside the same extension, e.g. a free tier with limited features plus paid features. Available since Shopware 6.6.9.0. Concept background: [In-App purchases concept](platform/dev/6.7/concepts/framework/in-app-purchases.md); partner-side documentation: [Documentation for Extension Partner](https://docs.shopware.com/en/account-en/extension-partner/in-app-purchases).

## When to use

- You want users to buy a feature of your app/plugin from inside the Administration.
- Your app server must decide which features are unlocked for a shop based on purchased IAPs.

## Key steps / config

1. **Start a checkout**: call `sw.iap.purchase()` from the [Meteor Admin SDK](https://github.com/shopware/meteor/tree/main/packages/admin-sdk). Shopware provides the checkout flow itself; the Admin handles the SDK message `iapCheckout` and stores the request in the `inAppPurchaseCheckout` store. You must render the buy button yourself and hide it when the IAP cannot be bought more than once. Alternatively, post a correctly formatted `postMessage` with an IAP identifier to the Admin.
2. **Read active purchases**: every request Shopware sends to your app carries a JWT whose claims list all bought IAPs:
   - GET requests: query parameter `in-app-purchases`
   - POST requests: `inAppPurchases` inside the `source` object of the body
3. **PHP / Symfony app servers**: validate and decode the JWT with `shopware/app-php-sdk` (plain PHP) or `shopware/app-bundle` (Symfony, via the action argument of your route).
4. **Admin iframe**: purchases also arrive with the initial `sw-main-hidden` admin request; inject them into your JS app, e.g.:

```php
#[Route(path: '/app/admin', name: 'admin')]
public function admin(ModuleAction $action): Response {
    return $this->render('admin.html.twig', [
        'inAppPurchases' => $action->inAppPurchases->all(),
    ]);
}
```

5. **Non-PHP app servers**: verify the JWT signature with any JWT/JOSE library against the JWKS at `https://api.shopware.com/inappfeatures/jwks`, then read the claims:

```js
import { jwtVerify, createRemoteJWKSet } from 'jose';
const JWKS = createRemoteJWKSet(new URL('https://api.shopware.com/inappfeatures/jwks'));
const { payload } = await jwtVerify(token, JWKS);
```

6. **Manipulating available IAPs**: apps can alter the offered IAPs through the In-App purchase gateway (separate page).

## Essential identifiers

- `sw.iap.purchase()` (Meteor Admin SDK), Admin handler `iapCheckout`
- Query parameter `in-app-purchases`; body field `source.inAppPurchases`
- `sw-main-hidden` admin location
- `shopware/app-php-sdk`, `shopware/app-bundle`, `ModuleAction::$inAppPurchases`
- JWKS: `https://api.shopware.com/inappfeatures/jwks`

## Gotchas

- The checkout is purely functional: button rendering and hiding non-repeatable IAPs is your responsibility.
- Always verify the token signature before trusting its claims.

## Version notes

- IAP exists since Shopware 6.6.9.0.

## Code check (6.7.15.1)
- confirmed `in-app-purchases` — query parameter added to signed app requests with the extension's IAP JWT — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:47
- confirmed `Source::$inAppPurchases` — POST payload `source` carries the IAP JWT — vendor/shopware/core/Framework/App/Payload/Source.php:24
- confirmed `inAppPurchases` — claim added to the app JWT generated for the Admin — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:62
- confirmed `iapCheckout` — Admin ExtensionAPI handler for the SDK checkout request — vendor/shopware/administration/Resources/app/administration/src/app/init/in-app-purchase-checkout.init.ts:10
- confirmed `inAppPurchaseCheckout` — Admin store holding pending checkout requests — vendor/shopware/administration/Resources/app/administration/src/app/store/in-app-purchase-checkout.store.ts:22
- confirmed `/inappfeatures/jwks` — core fetches the IAP JWKS from the Store API at this path — vendor/shopware/core/Framework/Store/InAppPurchase/Services/KeyFetcher.php:66
- confirmed `api.store.active-in-app-purchases` — Admin API route returning an app's active IAPs — vendor/shopware/core/Framework/Store/InAppPurchase/Api/InAppPurchasesController.php:35
- unverified `sw.iap.purchase()` — lives in the Meteor Admin SDK package, out of scope
- unverified `ModuleAction` — lives in shopware/app-bundle, out of scope
