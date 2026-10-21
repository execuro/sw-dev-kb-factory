---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/_index.md
title: JavaScript App Server SDK
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/
sourceHash: 0518a4974c7a0e4a09648836bb00cc2fe94c38c6
codeCheckedAgainst: "6.7.15.1"
keywords: ["app-sdk-js", "javascript app server sdk", "typescript", "app server", "node.js", "deno", "bun", "cloudflare workers", "context", "signing", "http client", "shopware app"]
summary: "Overview of Shopware's TypeScript App Server SDK (app-sdk-js): context object, request/response signing and HTTP client; runs on Node.js, Deno, Bun, Workers."
lastBuilt: 2026-10-21
---
## What it is

Overview of the JavaScript App Server SDK (https://github.com/shopware/app-sdk-js), a TypeScript library with the building blocks for Shopware app servers. It is built on the standard JavaScript Request/Response APIs, so it runs on Node.js, Deno, Bun and Cloudflare Workers.

## When to use

When implementing the backend of a Shopware app in JavaScript/TypeScript rather than PHP.

## Key steps / config

The SDK provides:

- A context object giving access to shop information and services, used to call Shopware APIs and work with entities.
- Signing support to validate the authenticity and integrity of requests from and responses to Shopware.
- An HTTP client for Shopware endpoints that handles authentication, request execution and response processing.

## Essential identifiers

- `app-sdk-js` (repository `shopware/app-sdk-js`)

## Code check (6.7.15.1)
- confirmed `RequestSigner::SHOPWARE_SHOP_SIGNATURE` — Shopware signs requests to apps with `shopware-shop-signature` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- confirmed `RequestSigner::isResponseAuthentic()` — Shopware verifies app responses via `shopware-app-signature` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:34
- unverified `app-sdk-js` — external JavaScript package, not in the Shopware code roots
