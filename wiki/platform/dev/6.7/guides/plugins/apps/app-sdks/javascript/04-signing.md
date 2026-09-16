---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/04-signing.md
title: Signing Responses
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/04-signing.html
sourceHash: 85448fc782865dd7937b6ee262cf4554ae6e96d8
codeCheckedAgainst: "6.7.13.0"
keywords: ["signResponse", "app.signer", "AppServer", "getShopById", "shopware-app-signature", "@shopware-ag/app-server-sdk", "response signing", "hmac", "app secret", "action button response", "server-to-server"]
summary: "JS App Server SDK: sign server-to-server responses with app.signer.signResponse(response, shop); Shopware checks the shopware-app-signature header."
lastBuilt: 2026-09-15
---
## What it is

How to sign an HTTP response in the JavaScript App Server SDK (`@shopware-ag/app-server-sdk`). Shopware requires signed responses for requests it handles server-to-server; the signature verifies the response's authenticity and that it was not tampered with.

## When to use

When your app backend answers a Shopware server-to-server call whose response Shopware evaluates — for example an action button or an app payload service call — and you build the `Response` yourself instead of letting an integration sign it.

## Key steps / config

1. Obtain the shop: from the context resolver, or via the shop repository (`app.repository.getShopById('shop-id')`).
2. Build a standard `Response`.
3. Call `app.signer.signResponse(response, shop)`; it returns the signed response.

```ts
import { AppServer } from '@shopware-ag/app-server-sdk'

const app = new AppServer(/** ... */);
const shop = await app.repository.getShopById('shop-id');

const response = new Response('Hello World', {
  headers: { 'Content-Type': 'text/plain' },
});

const signedResponse = await app.signer.signResponse(response, shop);
```

What Shopware checks (installed core): the response must carry a `shopware-app-signature` header equal to the hex HMAC-SHA256 of the raw response body, keyed with the shop's app secret. A missing header or mismatch makes the call fail with "Could not verify the authenticity of the response" (HTTP 401 responses are exempt from the check).

## Essential identifiers

- `app.signer.signResponse(response, shop)`
- `app.repository.getShopById()`
- `AppServer` from `@shopware-ag/app-server-sdk`
- Response header `shopware-app-signature`

## Gotchas

- The source's snippet is fenced as `php` but is JavaScript/TypeScript.
- Sign the final body: any change to the body after signing invalidates the HMAC.
- Not every outbound call validates the response. In core, action buttons and app payload services request response validation; plain webhook delivery does not.

## Code check (6.7.13.0)
- unverified `signResponse` — JS SDK method, outside the vendor/shopware scope
- unverified `getShopById` — JS SDK repository method, outside the vendor/shopware scope
- confirmed `shopware-app-signature` — header name Shopware reads from app responses — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:13
- confirmed `RequestSigner::isResponseAuthentic()` — missing header returns false; compares via hash_equals — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:34
- confirmed `RequestSigner::signPayload()` — hash_hmac sha256 over the body with the secret — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:48
- confirmed `AuthMiddleware::VALIDATED_RESPONSE` — option key that enables the response check — vendor/shopware/core/Framework/App/Hmac/Guzzle/AuthMiddleware.php:22
- confirmed `isResponseAuthentic` — skipped when the status code is 401 — vendor/shopware/core/Framework/App/Hmac/Guzzle/AuthMiddleware.php:75
- confirmed `Could not verify the authenticity of the response` — ServerException on failed check — vendor/shopware/core/Framework/App/Hmac/Guzzle/AuthMiddleware.php:77
- confirmed `VALIDATED_RESPONSE` — action button calls set it to true — vendor/shopware/core/Framework/App/ActionButton/Executor.php:99
- confirmed `AppPayloadServiceHelper::createRequestOptions()` — app payload calls validate responses — vendor/shopware/core/Framework/App/Payload/AppPayloadServiceHelper.php:137
