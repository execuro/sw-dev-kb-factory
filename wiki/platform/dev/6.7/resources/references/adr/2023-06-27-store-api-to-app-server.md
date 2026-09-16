---
id: platform/dev/6.7/resources/references/adr/2023-06-27-store-api-to-app-server.md
title: Client side communication to App Server
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-06-27-store-api-to-app-server.html
sourceHash: 7e0896656f93ec8868f38f6fd3ee35d2816c6ac0
codeCheckedAgainst: "6.7.13.0"
keywords: ["/store-api/app-system/{name}/generate-token", "/app-system/{name}/generate-token", "store-api.app-system.generate-token", "frontend.app-system.generate-token", "AppJWTGenerateRoute", "jwt", "app server", "app token", "customerId", "salesChannelId", "app secret", "app system"]
summary: "ADR: POST /store-api/app-system/{name}/generate-token issues an app-secret-signed JWT for a logged-in customer so clients can call the App Server."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2023-06-27, area core, tag app-system): a Store API endpoint, plus a Storefront equivalent, that issues a short-lived JWT so browser or client code can call an app's App Server. The App Server can then trust the customer and sales-channel context carried by the token.

## When to use

When an app's client-side code (Storefront JS, headless frontend) must call its own App Server and the App Server needs verified information such as the logged-in customer. Without the token, only Shopware's backend-signed requests can be verified.

## Key steps / config

1. The client calls the token endpoint with `POST`:
   - Store API: `/store-api/app-system/{name}/generate-token` (route `store-api.app-system.generate-token`)
   - Storefront: `/app-system/{name}/generate-token` (route `frontend.app-system.generate-token`, no-store)
   `{name}` is the app's technical name.
2. Preconditions: a customer must be logged in, and the app must exist with `active = 1`. Otherwise an `AppException` is thrown. The Storefront controller turns it into a JSON `message` with the exception's status code.
3. The response contains the token, its expiry and the shop id:

```json
{ "token": "...", "expires": "<ATOM datetime>", "shopId": "..." }
```

4. The token is signed with HMAC SHA-256 using the app's `app_secret`, the same shop-to-app-server secret used for request signatures. Standard claims: issuer = shop id, issued-at, not-before, expiry (now + 10 minutes). An `inAppPurchases` claim is always added.
5. Further claims are added only when the app's ACL role has the matching privilege:
   - `sales_channel:read` → `salesChannelId`
   - `customer:read` → `customerId`
   - `currency:read` → `currencyId`
   - `language:read` → `languageId`
   - `payment_method:read` → `paymentMethodId`
   - `shipping_method:read` → `shippingMethodId`
6. The client sends the JWT (for example in a header) to the App Server. The App Server verifies the signature with the app secret and uses the claims. The request body stays untrusted and must be validated.
7. The client can reuse the token until it expires. Store it in session storage and request a new one only after expiry.

## Essential identifiers

- `/store-api/app-system/{name}/generate-token`, `store-api.app-system.generate-token`
- `/app-system/{name}/generate-token`, `frontend.app-system.generate-token`
- `Shopware\Core\Framework\App\Api\AppJWTGenerateRoute`
- `Shopware\Storefront\Controller\AppController`
- Claims: `salesChannelId`, `customerId`, `currencyId`, `languageId`, `paymentMethodId`, `shippingMethodId`, `inAppPurchases`

## Gotchas

- The ADR's diagram shows `GET` and a `{appName}` placeholder. The installed routes accept only `POST`, and the parameter is `{name}`.
- The ADR says tokens are valid for 15 minutes. The code sets the expiry to 10 minutes.
- The ADR lists `shopId` and `cartToken` claims. The code puts the shop id into the issuer claim and the response body, and adds no cart token claim.
- The ADR recommends rate limiting because generating a JWT is expensive.

## Version notes

Consequences named by the ADR: a Storefront helper that obtains, caches and renews the token, and JWT verification support in the PHP App SDK.

## Code check (6.7.13.0)
- corrected `/store-api/app-system/{name}/generate-token` — docs: GET with {appName}; code POST with {name} — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:35
- corrected `/app-system/{name}/generate-token` — docs: {appName}; Storefront route is POST only — vendor/shopware/storefront/Controller/AppController.php:28
- confirmed `AppJWTGenerateRoute::generate()` — throws when no customer is logged in — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:36
- confirmed `app_secret` — HMAC key is the app secret of an active app — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:42
- corrected `expiresAt` — docs: valid 15 minutes; code +10 minutes — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:60
- corrected `issuedBy` — docs: shopId claim; code sets shop id as issuer — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:57
- corrected `withClaim` — docs: cartToken claim; code adds inAppPurchases and privilege-bound claims only — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:62
- corrected `salesChannelId` — docs: always present; code requires sales_channel:read — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:65
- confirmed `customerId` — only with customer:read privilege — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:69
- confirmed `shopId` — returned in the JSON response next to token and expires — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:91
