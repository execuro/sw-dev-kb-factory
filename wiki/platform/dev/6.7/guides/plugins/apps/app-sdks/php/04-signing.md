---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/php/04-signing.md
title: Signing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/php/04-signing.html
sourceHash: 751c12fef993085e1bac81a1dfd934f2f7651e3b
codeCheckedAgainst: "6.7.15.1"
keywords: ["ResponseSigner", "signResponse", "ShopResolver", "resolveShop", "shopware-app-signature", "AuthMiddleware", "RequestSigner", "response signing", "hmac", "action button", "tax provider", "payment app"]
summary: PHP App SDK ResponseSigner::signResponse() signs responses; Shopware checks the shopware-app-signature HMAC on action button, tax and payment calls.
lastBuilt: 2026-10-21
---
## What it is

How a PHP app backend signs its responses to Shopware with the SDK's `ResponseSigner`, so the shop can verify they come from the app.

## When to use

Your app answers an action button, tax provider or payment request — Shopware requires a signed response for these.

## Key steps / config

1. Resolve the shop for the incoming request: `$shop = (new \Shopware\App\SDK\Shop\ShopResolver($repository))->resolveShop($psrRequest);`
2. Build your PSR-7 response.
3. Sign it before returning:

```php
$signer = new \Shopware\App\SDK\Authentication\ResponseSigner();
$signer->signResponse($psrResponse, $shop);
```

What Shopware checks: the response must carry a `shopware-app-signature` header equal to the HMAC-SHA256 of the response body, keyed with the app secret stored for the shop. Without the header, or on mismatch, the call fails with "Could not verify the authenticity of the response".

## Essential identifiers

- `\Shopware\App\SDK\Authentication\ResponseSigner` — `signResponse($psrResponse, $shop)`
- `\Shopware\App\SDK\Shop\ShopResolver` — `resolveShop($psrRequest)`
- Response header `shopware-app-signature`

## Gotchas

- In 6.7.15.1 the shop verifies signatures on action button calls and on every request built via the app payload helper — tax provider, payment, plus checkout gateway, context gateway and in-app purchase calls — not only the three the docs list.
- A `401` response is not signature-checked.
- The source snippet signs `$psrResponse` but assigns the built response to `$response`; use the same variable.

## Code check (6.7.15.1)
- unverified `\Shopware\App\SDK\Authentication\ResponseSigner` — shopware/app-php-sdk package, outside the checked roots
- unverified `\Shopware\App\SDK\Shop\ShopResolver` — app-php-sdk package, out of scope
- confirmed `RequestSigner::SHOPWARE_APP_SIGNATURE` — header name shopware-app-signature — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:13
- confirmed `RequestSigner::isResponseAuthentic()` — missing header fails; body HMAC compared with hash_equals — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:34
- confirmed `RequestSigner::signPayload()` — hash_hmac with sha256 by default — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:48
- confirmed `AuthMiddleware::VALIDATED_RESPONSE` — triggers verification, skipped on 401 — vendor/shopware/core/Framework/App/Hmac/Guzzle/AuthMiddleware.php:67
- confirmed `VALIDATED_RESPONSE` — action button executor requires a signed response — vendor/shopware/core/Framework/App/ActionButton/Executor.php:99
- confirmed `AppPayloadServiceHelper::createRequestOptions()` — sets VALIDATED_RESPONSE for payload-service calls (tax, payment, gateways) — vendor/shopware/core/Framework/App/Payload/AppPayloadServiceHelper.php:137
