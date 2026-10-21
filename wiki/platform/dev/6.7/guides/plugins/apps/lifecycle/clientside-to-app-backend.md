---
id: platform/dev/6.7/guides/plugins/apps/lifecycle/clientside-to-app-backend.md
title: Client-Side App Backend Communication
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/clientside-to-app-backend.html
sourceHash: 4d745ba9a20df8331df5bc0423b09efd02a10d23
codeCheckedAgainst: "6.7.15.1"
keywords: ["/store-api/app-system/{name}/generate-token", "/app-system/{name}/generate-token", "frontend.app-system.generate-token", "AppJWTGenerateRoute", "AppClientService", "app-client.service", "shopware-app-token", "shopware-app-shop-id", "jwt", "json web token", "claims", "cors", "storefront to app backend"]
summary: "Browser-to-app-backend calls via a shop-signed JWT from POST /store-api/app-system/{name}/generate-token; claims, headers, Storefront AppClient."
lastBuilt: 2026-10-21
---
## What it is

A mechanism (since 6.5.5.0) for calling an app backend directly from the browser. The shop issues a JSON Web Token signed with HMAC-SHA256 using the app's `appSecret`, with the shop ID as issuer; the browser sends it to the app server, which verifies it and reads session data from its claims.

## When to use

When Storefront JavaScript needs to talk to your app server (e.g. submit a product review) and the app must trust which customer/sales channel/currency the request belongs to. A JWT is only issued for a logged-in customer.

## Key steps / config

1. **Request a token** with `POST /store-api/app-system/{name}/generate-token` (Store API) or `POST /app-system/{name}/generate-token` (Storefront route `frontend.app-system.generate-token`). Response shape:

```json
{ "token": "...", "expires": "<ATOM date>", "shopId": "..." }
```

2. **Send it to the app server** as header `shopware-app-token`, with the shop ID as header `shopware-app-shop-id`.
3. **Storefront helper:** the `AppClientService` in `src/service/app-client.service.ts` fetches and caches the token in `sessionStorage` (key `app-system.<name>`), refetches it after `expires`, and adds both headers automatically:

```javascript
import AppClient from 'src/service/app-client.service.ts';
const client = new AppClient('MyAppName');
client.get(url, { headers: {} }); // also post(), patch(), delete(), reset()
```

4. **Allow CORS** on the app backend, e.g. `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: GET, POST, OPTIONS`, `Access-Control-Allow-Headers: shopware-app-shop-id, shopware-app-token` (NelmioCorsBundle recommended for the Symfony bundle).
5. **Validate on the app server:**
   - App PHP SDK: `$shopResolver->resolveShop($serverRequest)`, then `$contextResolver->assembleStorefrontRequest($serverRequest, $shop)`, then e.g. `$storefront->claims->getCustomerId()`.
   - Symfony bundle: type-hint `Shopware\App\SDK\Context\Storefront\StorefrontAction` in a controller action.
   - Custom: look up the shop by `shopware-app-shop-id`, verify `shopware-app-token` with an HMAC-SHA256 JWT verifier keyed with the app secret.

### Claims (each only if the app holds the listed permission)

| claim | permission |
|---|---|
| `salesChannelId` | `sales_channel:read` |
| `customerId` | `customer:read` |
| `currencyId` | `currency:read` |
| `languageId` | `language:read` |
| `paymentMethodId` | `payment_method:read` |
| `shippingMethodId` | `shipping_method:read` |

`inAppPurchases` is always set; standard `iss` (shop ID), `iat`, `nbf`, `exp` are present.

## Essential identifiers

- Routes: `/store-api/app-system/{name}/generate-token` (`store-api.app-system.generate-token`), `/app-system/{name}/generate-token` (`frontend.app-system.generate-token`)
- Headers: `shopware-app-token`, `shopware-app-shop-id`
- Core: `Shopware\Core\Framework\App\Api\AppJWTGenerateRoute`; Storefront: `Shopware\Storefront\Controller\AppController`, `AppClientService`
- SDK: `StorefrontAction`, `assembleStorefrontRequest()`

## Gotchas

- Without a logged-in customer the route throws (`jwtGenerationRequiresCustomerLoggedIn`); the Storefront route returns it as a JSON error.
- The app must be active, otherwise the app is not found.
- Tokens expire 10 minutes after issue.
- The docs list a `countryId` claim and a `client.put()` helper; neither exists in 6.7.15.1.

## Version notes

Introduced in Shopware 6.5.5.0.

## Code check (6.7.15.1)
- confirmed `/store-api/app-system/{name}/generate-token` — POST only, store-api scope — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:35
- confirmed `AppJWTGenerateRoute::generate()` — throws unless a customer is logged in — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:38
- confirmed `issuedBy` — signed with Sha256 HMAC keyed by app_secret, issuer shopId, expires +10 minutes — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:57
- corrected `customerId` — docs: claims are languageId, currencyId, customerId, countryId, salesChannelId; code sets no countryId and adds paymentMethodId, shippingMethodId, inAppPurchases — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:69
- confirmed `paymentMethodId` — claim gated by payment_method:read — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:81
- confirmed `frontend.app-system.generate-token` — Storefront POST route /app-system/{name}/generate-token — vendor/shopware/storefront/Controller/AppController.php:29
- corrected `AppClientService` — docs: client.put(); the class only has get, post, patch, delete, reset — vendor/shopware/storefront/Resources/app/storefront/src/service/app-client.service.ts:6
- confirmed `shopware-app-token` — header filled from token response, with shopware-app-shop-id — vendor/shopware/storefront/Resources/app/storefront/src/service/app-client.service.ts:93
- unverified `StorefrontAction` — App PHP SDK / Symfony bundle class, not in the installed Shopware packages
