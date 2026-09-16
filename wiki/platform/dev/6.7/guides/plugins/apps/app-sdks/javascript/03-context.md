---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/03-context.md
title: Context
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/03-context.html
sourceHash: 722e3c8e0b50d1b68fb57f7638d8821b6df3baf9
codeCheckedAgainst: "6.7.13.0"
keywords: ["ContextResolver", "fromBrowser", "fromAPI", "AppServer", "BrowserAppModuleRequest", "@shopware-ag/app-server-sdk", "app-sdk-js", "request validation", "shop signature", "iframe", "webhook", "typed payload"]
summary: "JS App Server SDK ContextResolver: fromBrowser() for iframe requests, fromAPI() for webhooks/action buttons; validates request, resolves shop, types payload."
lastBuilt: 2026-09-15
---
## What it is

The `ContextResolver` of the JavaScript App Server SDK (`@shopware-ag/app-server-sdk`) validates an incoming request from Shopware, resolves the matching shop from the shop repository, and returns a typed context object for further processing.

- `fromBrowser()` resolves requests coming from browser-based app modules, such as iframes.
- `fromAPI()` resolves requests coming from Shopware server-to-server calls, such as webhooks or action buttons.

## When to use

In an app backend built on the JS SDK, whenever a route receives a request from Shopware (admin module iframe load, webhook, action button) and you need the verified shop plus the request payload.

## Key steps / config

```ts
import { AppServer } from '@shopware-ag/app-server-sdk'
import { BrowserAppModuleRequest } from '@shopware-ag/app-server-sdk/types'

const app = new AppServer(/** ... */);

// iframe / app module (signed query string)
const ctx = await app.contextResolver.fromBrowser<BrowserAppModuleRequest>(/** Request */);
console.log(ctx.payload['sw-version']);

// webhook, action button (signed POST body)
app.contextResolver.fromAPI(/** Request */);
```

1. Access the resolver via `app.contextResolver` on an `AppServer` instance.
2. Pick the method by request origin: browser (`fromBrowser`) or server-to-server (`fromAPI`).
3. Pass a generic type parameter to type `ctx.payload`. Built-in types live in the SDK's `types.ts` (https://github.com/shopware/app-sdk-js/blob/main/src/types.ts); if one is missing, file an issue on the SDK repository or define your own:

```ts
type MyCustomWebHook = { foo: string; }
const ctx = await app.contextResolver.fromBrowser<MyCustomWebHook>(/** Request */);
ctx.payload.foo; // typed
```

On the Shopware side, the two request shapes differ: app-module and action-button iframe URLs are signed as a query string (`shop-id`, `shop-url`, `timestamp`, `sw-version`, `app-version`, then `shopware-shop-signature`), while server-to-server POSTs carry the HMAC-SHA256 of the body in the `shopware-shop-signature` header.

## Essential identifiers

- `ContextResolver`, `app.contextResolver.fromBrowser()`, `app.contextResolver.fromAPI()`
- `AppServer` from `@shopware-ag/app-server-sdk`
- `BrowserAppModuleRequest` from `@shopware-ag/app-server-sdk/types`
- Shopware query/header names: `shopware-shop-signature`, `shop-id`, `shop-url`, `sw-version`

## Gotchas

- Using the wrong method for the origin fails validation: browser requests carry the signature in the query, API requests in a header over the POST body.
- The generic type parameter only types the payload; it does not validate its shape at runtime.

## Code check (6.7.13.0)
- unverified `ContextResolver` — JS SDK class, outside the vendor/shopware scope
- unverified `BrowserAppModuleRequest` — JS SDK type, outside the vendor/shopware scope
- confirmed `QuerySigner::signUri()` — signs browser URLs for app modules and action-button iframes — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:34
- confirmed `shop-id` — query parameter added to signed browser URLs — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:42
- confirmed `sw-version` — query parameter present in the signed browser payload — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:45
- confirmed `shopware-shop-signature` — query signature appended to the URL — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:55
- confirmed `RequestSigner::signRequest()` — POST body HMAC sent as shopware-shop-signature header — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:17
- confirmed `RequestSigner::signPayload()` — hash_hmac with sha256 — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:48
