---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/php/04-signing.md
title: Signing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/php/04-signing.html
sourceHash: 751c12fef993085e1bac81a1dfd934f2f7651e3b
codeCheckedAgainst: "6.7.13.0"
keywords: ["ResponseSigner", "signResponse", "shopware-app-signature", "response signing", "hmac", "ActionButton", "TaxProvider", "payment app", "ShopResolver", "app-php-sdk", "app secret", "psr-7 response"]
summary: "PHP app SDK ResponseSigner::signResponse signs app responses (shopware-app-signature) for action buttons, tax providers and payments."
lastBuilt: 2026-09-15
---
## What it is

The PHP App Server SDK page on signing responses returned to Shopware with `\Shopware\App\SDK\Authentication\ResponseSigner`.

## When to use

Whenever your app answers a Shopware call whose response the shop validates. The source names ActionButton, TaxProvider and Payment; the installed core also validates responses for checkout gateway, context gateway and in-app purchase payload calls.

## Key steps / config

1. Resolve the shop for the incoming request (the shop record holds the secret used for signing).
2. Build your PSR-7 response.
3. Sign it with `ResponseSigner::signResponse()`:

```php
$shopResolver = new \Shopware\App\SDK\Shop\ShopResolver($repository);
$shop = $shopResolver->resolveShop($psrRequest);

// do something, build $psrResponse

$signer = new \Shopware\App\SDK\Authentication\ResponseSigner();
$signer->signResponse($psrResponse, $shop);
```

What the core checks (installed code): the response must carry header `shopware-app-signature` equal to `hash_hmac('sha256', <response body>, <app secret>)`, compared with `hash_equals`. If it is missing or wrong, the request fails with "Could not verify the authenticity of the response". Responses with HTTP status 401 are not checked.

## Essential identifiers

- `\Shopware\App\SDK\Authentication\ResponseSigner` — `signResponse()`
- `\Shopware\App\SDK\Shop\ShopResolver` — `resolveShop()`
- Header `shopware-app-signature`

## Gotchas

- The source snippet assigns `$response` but signs `$psrResponse`; sign the response object you actually return.
- Sign the final body: any change to the body after signing invalidates the HMAC.
- Signing uses the per-shop app secret stored at registration; after re-registration the new secret applies.

## Code check (6.7.13.0)
- unverified `\Shopware\App\SDK\Authentication\ResponseSigner` — external package shopware/app-php-sdk, not in vendor/shopware
- unverified `ResponseSigner::signResponse()` — external SDK method, out of scope
- confirmed `shopware-app-signature` — header name the core validates — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:13
- confirmed `RequestSigner::isResponseAuthentic()` — HMAC of body compared via hash_equals — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:34
- confirmed `RequestSigner::signPayload()` — hash_hmac with sha256 default — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:48
- confirmed `AuthMiddleware::VALIDATED_RESPONSE` — action button calls require signed response — vendor/shopware/core/Framework/App/ActionButton/Executor.php:99
- confirmed `AuthMiddleware::VALIDATED_RESPONSE` — set for all payload-based app calls — vendor/shopware/core/Framework/App/Payload/AppPayloadServiceHelper.php:151
- confirmed `createRequestOptions` — tax provider calls use validated request options — vendor/shopware/core/Framework/App/TaxProvider/Payload/TaxProviderPayloadService.php:37
- confirmed `createRequestOptions` — payment calls use validated request options — vendor/shopware/core/Framework/App/Payment/Payload/PaymentPayloadService.php:44
- confirmed `isResponseAuthentic` — skipped for 401 responses — vendor/shopware/core/Framework/App/Hmac/Guzzle/AuthMiddleware.php:75
