---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/_index.md
title: JavaScript App Server SDK
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/
sourceHash: 0518a4974c7a0e4a09648836bb00cc2fe94c38c6
codeCheckedAgainst: "6.7.13.0"
keywords: ["app-sdk-js", "javascript app server sdk", "typescript app sdk", "app server", "node.js", "deno", "bun", "cloudflare workers", "shopware-app-signature", "shopware-shop-signature", "request signing", "http client", "app context"]
summary: "Overview of Shopware's TypeScript app server SDK (app-sdk-js): context object, request/response signing, HTTP client; runs on Node.js, Deno, Bun, Workers."
lastBuilt: 2026-09-15
---
## What it is

Overview page for the JavaScript App Server SDK, published at `https://github.com/shopware/app-sdk-js`. It is written in pure TypeScript and built on the standard JavaScript `Request`/`Response` APIs, so the same app backend code can run on Node.js, Deno, Bun and Cloudflare Workers.

## When to use

When building the backend (app server) of a Shopware app in JavaScript/TypeScript instead of PHP, and you need registration, request verification, response signing and Admin API access without implementing the app-system protocol by hand.

## Key steps / config

The source lists three building blocks the SDK provides (no code sample is given on this page):

1. **Context object** — gives access to shop-related information and services needed to interact with Shopware's APIs, access entities and run operations.
2. **Signing** — validates the authenticity and integrity of requests coming from Shopware and signs responses going back. On the Shopware side (installed core), outgoing POST requests to the app carry an HMAC-SHA256 of the body in the `shopware-shop-signature` header, and responses that Shopware validates must carry a `shopware-app-signature` header computed with the app secret.
3. **HTTP client** — wraps authentication, request execution and response handling for calls to Shopware endpoints.

Which responses Shopware validates (installed core): action button responses and all payloads built via the app payload helper (tax provider, payment, checkout/context gateway, in-app purchases). A missing or wrong `shopware-app-signature` there is rejected with "Could not verify the authenticity of the response".

## Essential identifiers

- `app-sdk-js` (repository `https://github.com/shopware/app-sdk-js`)
- `shopware-shop-signature` — header Shopware sends on signed requests
- `shopware-app-signature` — header the app must set on signed responses

## Gotchas

- The SDK itself is not part of the installed Shopware packages; its API names are not documented on this page and cannot be checked against `vendor/shopware`.
- Signatures are plain `hash_hmac('sha256', body, appSecret)`; the core compares with `hash_equals`, so any body modification after signing breaks validation.

## Code check (6.7.13.0)
- unverified `app-sdk-js` — external npm/GitHub package, not in vendor/shopware
- confirmed `shopware-shop-signature` — header constant used when signing POST bodies — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- confirmed `shopware-app-signature` — response header checked on validated responses — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:13
- confirmed `RequestSigner::isResponseAuthentic()` — compares HMAC of body with the app signature header — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:34
- confirmed `RequestSigner::signPayload()` — HMAC with sha256 default — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:48
- confirmed `AuthMiddleware::VALIDATED_RESPONSE` — action button requests require an authentic response — vendor/shopware/core/Framework/App/ActionButton/Executor.php:99
- confirmed `AppPayloadServiceHelper::createRequestOptions()` — enables response validation for payload-based app calls — vendor/shopware/core/Framework/App/Payload/AppPayloadServiceHelper.php:137
