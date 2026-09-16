---
id: platform/dev/6.7/guides/plugins/apps/lifecycle/clientside-to-app-backend.md
title: Client-Side App Backend Communication
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/clientside-to-app-backend.html
sourceHash: 4d745ba9a20df8331df5bc0423b09efd02a10d23
codeCheckedAgainst: "6.7.13.0"
keywords: ["jwt", "json web token", "generate-token", "store-api.app-system.generate-token", "frontend.app-system.generate-token", "AppClientService", "app-client.service.ts", "shopware-app-token", "shopware-app-shop-id", "AppJWTGenerateRoute", "storefront to app backend", "cors", "claims"]
summary: "Browser-to-app-backend calls: POST generate-token route returns an app-secret-signed JWT; send it as shopware-app-token plus shopware-app-shop-id headers."
lastBuilt: 2026-09-15
---
## What it is

A mechanism that lets Storefront JavaScript call an app backend directly. The shop issues a JSON Web Token signed with the app secret, containing session data as claims; the app backend validates it.

## When to use

An app needs browser-initiated requests to its own server (e.g. submitting a product review) with a trustworthy customer/sales-channel context, without proxying through Shopware.

## Key steps / config

1. **Request a token** (logged-in customer required) with `POST`:
   - Store API: `/store-api/app-system/{name}/generate-token` (route `store-api.app-system.generate-token`)
   - Storefront: `/app-system/{name}/generate-token` (route `frontend.app-system.generate-token`)
   Response shape:
   ```json
   { "token": "...", "expires": "<ATOM date>", "shopId": "..." }
   ```
2. **Call the app backend** with headers `shopware-app-token: <token>` and `shopware-app-shop-id: <shopId>`.
   In the Storefront, the helper does steps 1-2 and caches the token in `sessionStorage` until `expires`:
   ```javascript
   import AppClient from 'src/service/app-client.service.ts';
   const client = new AppClient('MyAppName');
   client.get('https://my-app-backend.com/foo', { headers: {} });
   client.post(url); client.patch(url); client.delete(url);
   ```
   `reset()` drops the cached token.
3. **Allow CORS** on the app backend: `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: GET, POST, OPTIONS`, `Access-Control-Allow-Headers: shopware-app-shop-id, shopware-app-token` (Symfony: e.g. NelmioCorsBundle).
4. **Validate the token:** look up the shop by `shopware-app-shop-id`, verify the JWT with the app secret as HMAC-SHA256 key. App PHP SDK: `$shopResolver->resolveShop($serverRequest)`, then `$contextResolver->assembleStorefrontRequest($serverRequest, $shop)` and read `$storefront->claims->getCustomerId()`. Symfony bundle: type-hint a controller argument `Shopware\App\SDK\Context\Storefront\StorefrontAction`.

### JWT content (installed code)

- Signed HMAC SHA-256 with the app's `app_secret`; `iss` = shopId; valid 10 minutes.
- Always: `inAppPurchases`.
- Only with the matching app permission: `salesChannelId` (`sales_channel:read`), `customerId` (`customer:read`), `currencyId` (`currency:read`), `languageId` (`language:read`), `paymentMethodId` (`payment_method:read`), `shippingMethodId` (`shipping_method:read`).

## Essential identifiers

- `/store-api/app-system/{name}/generate-token`, `/app-system/{name}/generate-token`
- `Shopware\Core\Framework\App\Api\AppJWTGenerateRoute`
- `AppClientService` (`src/service/app-client.service.ts`)
- `shopware-app-token`, `shopware-app-shop-id`
- `Shopware\App\SDK\Context\Storefront\StorefrontAction`

## Gotchas

- Without a logged-in customer the route fails with HTTP 400 "JWT generation requires customer to be logged in".
- The app must be active; `{name}` is the app's technical name.
- The docs list a `countryId` claim and a `client.put()` helper method; neither exists in the installed code — the claims are those listed above, and `AppClientService` offers only `get`, `post`, `patch`, `delete`.

## Version notes

Token generation exists since Shopware 6.5.5.0.

## Code check (6.7.13.0)
- confirmed `AppJWTGenerateRoute::generate()` — store-api POST route `/store-api/app-system/{name}/generate-token` — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:35
- confirmed `frontend.app-system.generate-token` — storefront POST route `/app-system/{name}/generate-token` — vendor/shopware/storefront/Controller/AppController.php:29
- confirmed `AppException::jwtGenerationRequiresCustomerLoggedIn()` — thrown when no customer in context — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:39
- confirmed `issuedBy` — issuer is shopId, token expires after 10 minutes — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:57
- confirmed `salesChannelId` — claim only with `sales_channel:read` — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:65
- corrected `customerId` — docs: set whenever customer logged in; code requires `customer:read` — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:69
- corrected `paymentMethodId` — docs: claims languageId/currencyId/customerId/countryId/salesChannelId; code has no countryId, adds paymentMethodId, shippingMethodId, inAppPurchases — vendor/shopware/core/Framework/App/Api/AppJWTGenerateRoute.php:81
- confirmed `shopware-app-token` — header set by storefront AppClientService along with `shopware-app-shop-id` — vendor/shopware/storefront/Resources/app/storefront/src/service/app-client.service.ts:93
- corrected `AppClientService` — docs: offers put(); code has only get/post/patch/delete — vendor/shopware/storefront/Resources/app/storefront/src/service/app-client.service.ts:6
- unverified `StorefrontAction` — App PHP SDK class, not in vendor/shopware scope
