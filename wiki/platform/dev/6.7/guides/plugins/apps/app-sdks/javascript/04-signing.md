---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/04-signing.md
title: Signing Responses
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/04-signing.html
sourceHash: 85448fc782865dd7937b6ee262cf4554ae6e96d8
codeCheckedAgainst: "6.7.15.1"
keywords: ["signResponse", "app.signer", "AppServer", "@shopware-ag/app-server-sdk", "getShopById", "shopware-app-signature", "response signing", "hmac", "app secret", "javascript app sdk", "server-to-server", "isResponseAuthentic"]
summary: "JavaScript App Server SDK: sign a Response for a shop with app.signer.signResponse() so Shopware accepts server-to-server replies."
lastBuilt: 2026-10-21
---
## What it is

How the JavaScript App Server SDK (`@shopware-ag/app-server-sdk`) signs outgoing responses. Shopware requires signed responses for requests it sends server-to-server; the signature lets the shop check that the response is authentic and was not tampered with.

## When to use

Whenever your app server answers a server-to-server call from Shopware (for example an action button or other endpoint where the shop verifies the reply) and you build the `Response` yourself rather than letting an integration such as Hono sign it.

## Key steps / config

1. Obtain the shop: from the context resolver, or via `app.repository.getShopById('shop-id')`.
2. Build a standard `Response`.
3. Call `app.signer.signResponse(response, shop)`; it returns the signed response (async).

```ts
import { AppServer } from '@shopware-ag/app-server-sdk'
const app = new AppServer(/** ... */);
const shop = await app.repository.getShopById('shop-id');
const response = new Response('Hello World', { headers: { 'Content-Type': 'text/plain' } });
const signedResponse = await app.signer.signResponse(response, shop);
```

On the Shopware side, the signature is expected in the `shopware-app-signature` response header and is an HMAC-SHA256 of the response body (checked by the core, see Code check).

## Essential identifiers

- `@shopware-ag/app-server-sdk`
- `AppServer`, `app.signer.signResponse(response, shop)`
- `app.repository.getShopById()`
- `shopware-app-signature` (header verified by Shopware)

## Gotchas

- Shopware compares the HMAC over the exact response body; modifying the body after signing invalidates the signature.

## Code check (6.7.15.1)
- confirmed `RequestSigner::SHOPWARE_APP_SIGNATURE` — response signature header is `shopware-app-signature` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:13
- confirmed `RequestSigner::isResponseAuthentic()` — fails when the header is missing, else compares HMAC of the body with `hash_equals` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:34
- confirmed `RequestSigner::signPayload()` — `hash_hmac` with default algorithm `sha256` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:48
- confirmed `AuthMiddleware::VALIDATED_RESPONSE` — core only enforces response authenticity when this request option is set, skipped for status 401 — vendor/shopware/core/Framework/App/Hmac/Guzzle/AuthMiddleware.php:67
- unverified `app.signer.signResponse()` — JavaScript SDK API, not part of the Shopware code roots
- unverified `app.repository.getShopById()` — JavaScript SDK API, out of scope
