---
id: platform/dev/6.7/guides/development/monetization/in-app-purchases.md
title: In-App Purchases (IAP)
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/monetization/in-app-purchases.html
sourceHash: 0af7f9ba63a014111b159d5b3dc549f1f4da6c1e
codeCheckedAgainst: "6.7.13.0"
relatedPages: ["platform/dev/6.7/concepts/framework/in-app-purchases.md"]
keywords: ["in-app purchases", "iap", "sw.iap.purchase", "iapCheckout", "in-app-purchases", "inAppPurchases", "jwt", "jwks", "shopware/app-bundle", "shopware/app-php-sdk", "ModuleAction", "meteor admin sdk", "paywall", "InAppPurchase"]
summary: "In-App Purchases: start checkout via Admin SDK sw.iap.purchase(), read bought IAPs from the in-app-purchases JWT, verify it against Shopware's JWKS."
lastBuilt: 2026-09-15
---
## What it is

In-App Purchases (IAP) let an extension lock features behind a paywall inside the same extension (e.g. free base version plus paid features). This guide covers starting the purchase checkout and reading which IAPs are active on the app server and in the app's admin UI. Concept: [In-App purchases concept](platform/dev/6.7/concepts/framework/in-app-purchases.md); extension-partner docs: [Documentation for Extension Partner](https://docs.shopware.com/en/account-en/extension-partner/in-app-purchases).

## When to use

When building an app/extension with free and paid feature tiers and you need to sell a feature and check whether a shop has bought it.

## Key steps / config

1. **Start checkout**: call `sw.iap.purchase()` from the [Meteor Admin SDK](https://github.com/shopware/meteor/tree/main/packages/admin-sdk). The Administration handles the resulting `iapCheckout` message and opens the Shopware-provided checkout. You provide the button yourself and must hide it if the IAP cannot be bought more than once. Alternatively send a correctly formatted `postMessage` with the IAP identifier to the Admin.
2. **Receive active IAPs**: every request Shopware sends to the app carries a JWT whose claims list all bought IAPs:
   - GET requests: query parameter `in-app-purchases`
   - POST requests: `source.inAppPurchases` in the request body
3. **Validate on PHP servers**: use `shopware/app-php-sdk` (plain PHP) or `shopware/app-bundle` (Symfony, via the matching action argument of the route).
4. **Admin module**: IAPs are also sent with the initial `sw-main-hidden` admin request; inject them into your JS app, e.g. with `shopware/app-bundle`:

```php
#[Route(path: '/app/admin', name: 'admin')]
public function admin(ModuleAction $action): Response {
    return $this->render('admin.html.twig', [
        'inAppPurchases' => $action->inAppPurchases->all(),
    ]);
}
```

5. **Validate on non-PHP servers**: verify the JWT signature with a JWT/JOSE library against Shopware's JWKS at `https://api.shopware.com/inappfeatures/jwks`, then read the purchased IAP identifiers from the claims (Node.js: `jwtVerify` + `createRemoteJWKSet` from `jose`).
6. **Manipulate available IAPs**: apps can alter the offered IAPs through the In-App purchase gateway (manifest `<gateways><inAppPurchases>` URL).

## Essential identifiers

- `sw.iap.purchase()`, `iapCheckout`
- `in-app-purchases` (query param), `inAppPurchases` (body `source` field / JWT claim)
- `https://api.shopware.com/inappfeatures/jwks`
- `shopware/app-php-sdk`, `shopware/app-bundle`, `ModuleAction`
- `Shopware\Core\Framework\Store\InAppPurchase` (core-side active purchases, `getByExtension()`, `isActive()`)

## Gotchas

- Always verify the JWT signature before trusting the claims.
- The checkout only handles payment; showing/hiding the purchase button is the extension's responsibility.

## Version notes

- Available since Shopware 6.6.9.0.

## Code check (6.7.13.0)
- confirmed `iapCheckout` — Admin handles the SDK checkout message and resolves the extension by origin — vendor/shopware/administration/Resources/app/administration/src/app/init/in-app-purchase-checkout.init.ts:10
- confirmed `in-app-purchases` — signed query parameter carries the extension's IAP JWT — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:47
- confirmed `Source::$inAppPurchases` — payload `source` field for the JWT — vendor/shopware/core/Framework/App/Payload/Source.php:24
- confirmed `InAppPurchase::getJWTByExtension()` — JWT per extension sent to apps — vendor/shopware/core/Framework/Store/InAppPurchase.php:60
- confirmed `InAppPurchase::isActive()` — core check for an identifier per extension — vendor/shopware/core/Framework/Store/InAppPurchase.php:70
- confirmed `/inappfeatures/jwks` — core fetches the JWKS from the Store API — vendor/shopware/core/Framework/Store/InAppPurchase/Services/KeyFetcher.php:66
- confirmed `inAppPurchases` — manifest gateway element — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:517
- unverified `sw.iap.purchase()` — Meteor Admin SDK package, out of scope
- unverified `ModuleAction` — shopware/app-bundle, out of scope
- unverified `sw-main-hidden` — not found in the checked vendor roots; app-server side
