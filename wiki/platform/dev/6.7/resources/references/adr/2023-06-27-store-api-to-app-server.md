---
id: platform/dev/6.7/resources/references/adr/2023-06-27-store-api-to-app-server.md
title: Client side communication to App Server
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-06-27-store-api-to-app-server.html
sourceHash: 7e0896656f93ec8868f38f6fd3ee35d2816c6ac0
codeCheckedAgainst: "6.7.15.1"
keywords: ["/store-api/app-system/{name}/generate-token", "store-api.app-system.generate-token", "frontend.app-system.generate-token", "AppJWTGenerateRoute", "AppClientService", "shopware-app-token", "jwt", "app server", "app secret", "customerId", "salesChannelId", "app system", "client token", "adr"]
summary: "ADR: endpoint issuing an app-secret-signed JWT with customer/sales-channel claims so browser clients can call an app server securely."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2023): only the Shopware backend could call an app server securely, because the app server verifies the request signature generated with the shop-to-app-server secret. A browser calling the app server directly could not prove who the logged-in customer is. Shopware therefore provides an endpoint that issues a JWT for a given app, signed with that same app secret, which the client forwards to the app server.

## When to use

- An app's storefront JavaScript (or a headless client) needs to call its own app server with trustworthy customer/sales-channel context, e.g. to submit a product review.
- You implement JWT verification on an app server.

## Key steps / config

1. Client requests a token (customer must be logged in; the app must be installed and active):
   - Store API: `POST /store-api/app-system/{name}/generate-token` (route `store-api.app-system.generate-token`)
   - Storefront: `POST /app-system/{name}/generate-token` (route `frontend.app-system.generate-token`)
2. Response shape:

```json
{ "token": "...", "expires": "<ATOM date>", "shopId": "..." }
```

3. Token: HMAC SHA-256, signed with the app secret. Standard claims: issuer = shop id, issued-at, not-before, expiry (10 minutes after issue). Always added: `inAppPurchases`. Added only when the app's ACL role grants the matching privilege: `salesChannelId` (`sales_channel:read`), `customerId` (`customer:read`), `currencyId` (`currency:read`), `languageId` (`language:read`), `paymentMethodId` (`payment_method:read`), `shippingMethodId` (`shipping_method:read`).
4. Client sends the JWT to the app server; the app server verifies it with the app secret and trusts only the claims. The request body stays untrusted and must be validated.
5. Storefront helper `AppClientService` (constructed with the app name) caches the token in `sessionStorage` under `app-system.<name>`, refetches after `expires`, and sends it as the `shopware-app-token` header on its `get`/`post`/`patch`/`delete` calls; `reset()` drops the cached token.

## Essential identifiers

- `Shopware\Core\Framework\App\Api\AppJWTGenerateRoute::generate()`
- `Shopware\Storefront\Controller\AppController::generateToken()`
- `store-api.app-system.generate-token`, `frontend.app-system.generate-token`
- `AppClientService`, header `shopware-app-token`

## Gotchas

- Without a logged-in customer the route throws (`jwtGenerationRequiresCustomerLoggedIn`); an unknown or inactive app yields an app-not-found error.
- The ADR's sequence diagram uses `GET`; the installed routes accept only `POST`.
- The ADR states 15 minutes validity and a `cartToken` claim; the installed code uses 10 minutes and adds no cart token claim. Re-request a token only on expiry; the token can be reused until then.
- The ADR asks for rate limiting of the route; no rate limiter is configured on it in the route class.

## Code check (6.7.15.1)
- corrected `/store-api/app-system/{name}/generate-token` — docs: GET; route is POST only — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:35
- confirmed `frontend.app-system.generate-token` — Storefront route, POST — vendor/shopware/storefront/Controller/AppController.php:29
- confirmed `AppJWTGenerateRoute::generate()` — requires a logged-in customer — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:36
- corrected `modify('+10 minutes')` — docs: valid 15 minutes — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:51
- confirmed `customerId` — claim only with customer:read privilege — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:69
- confirmed `salesChannelId` — claim only with sales_channel:read privilege — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:65
- corrected `issuedBy` — docs: `shopId` claim; shop id is the issuer and a response field — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:57
- unverified `cartToken` — docs list it as a claim; AppJWTGenerateRoute adds no such claim
- confirmed `shopware-app-token` — header set by the storefront helper — vendor/shopware/storefront/Resources/app/storefront/src/service/app-client.service.ts:93
- confirmed `AppClientService` — caches the token in sessionStorage — vendor/shopware/storefront/Resources/app/storefront/src/service/app-client.service.ts:6
