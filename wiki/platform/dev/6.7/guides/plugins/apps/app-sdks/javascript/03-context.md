---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/03-context.md
sourceHash: 722e3c8e0b50d1b68fb57f7638d8821b6df3baf9
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/03-context.html
title: Context
version: "6.7"
versions:
  - "6.7"
keywords: ["ContextResolver", "app.contextResolver", "fromBrowser", "fromAPI", "BrowserAppModuleRequest", "@shopware-ag/app-server-sdk/types", "app server sdk", "request context", "iframe", "webhook", "action button", "typed payload"]
summary: TypeScript App Server SDK ContextResolver - fromBrowser() for iframe app modules, fromAPI() for webhooks/action buttons, with typed payload generics.
lastBuilt: 2026-10-21
---
## What it is

The `ContextResolver` of the TypeScript App Server SDK validates an incoming request, resolves the shop it belongs to and returns a typed context object for further processing. It is reached via `app.contextResolver` on an `AppServer` instance.

## When to use

Handling requests sent to the app backend after registration: app module iframes in the Administration, webhooks, action buttons.

## Key steps / config

- `fromBrowser(request)` — requests from browser-based app modules such as iframes.
- `fromAPI(request)` — Shopware server-to-server calls such as webhooks or action buttons.
- Both accept a generic type parameter for the expected context payload; built-in types live in `@shopware-ag/app-server-sdk/types` (`types.ts` in `https://github.com/shopware/app-sdk-js`).

```ts
import { AppServer } from '@shopware-ag/app-server-sdk'
import { BrowserAppModuleRequest } from '@shopware-ag/app-server-sdk/types'

const app = new AppServer(/** ... */);
const ctx = await app.contextResolver.fromBrowser<BrowserAppModuleRequest>(/** Request */);
ctx.payload['sw-version']; // typed

type MyCustomWebHook = { foo: string; }
const ctx2 = await app.contextResolver.fromBrowser<MyCustomWebHook>(/** Request */);
ctx2.payload.foo; // typed, IDE completion
```

If a built-in type is missing, file an issue on the SDK repository or define your own type in the project.

## Essential identifiers

- `ContextResolver`, `app.contextResolver`
- `fromBrowser()`, `fromAPI()`
- `BrowserAppModuleRequest` from `@shopware-ag/app-server-sdk/types`
- `ctx.payload`

## Gotchas

- Pick the method by request origin: Shopware signs iframe URLs as query parameters, but server-to-server calls with a `shopware-shop-signature` header (see Code check), so a browser request resolved with `fromAPI()` (or vice versa) has its data in the wrong place.

## Code check (6.7.15.1)
- confirmed `QuerySigner::signUri()` — iframe/browser URLs get `shop-id`, `shop-url`, `timestamp`, `sw-version`, `app-version` query values — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:34
- confirmed `sw-version` — query value surfaced as `ctx.payload['sw-version']` — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:45
- confirmed `shopware-shop-signature` — query signature on browser URLs, verified by `fromBrowser()` — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:55
- confirmed `RequestSigner::SHOPWARE_SHOP_SIGNATURE` — header on server-to-server requests, verified by `fromAPI()` — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- confirmed `Source` — webhook/action payload `source` with `url`, `shopId`, `appVersion` used to resolve the shop — vendor/shopware/core/Framework/App/Payload/Source.php:12
- unverified `ContextResolver` — npm SDK class, outside the installed Shopware code
- unverified `BrowserAppModuleRequest` — npm SDK type, outside the installed Shopware code
