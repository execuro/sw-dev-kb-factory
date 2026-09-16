---
id: platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/03-context.md
title: Context
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/javascript/03-context.html
sourceHash: ae53f8e085220f9f77b79dd2160f865c157d4949
keywords: ["ContextResolver", "contextResolver", "fromBrowser", "fromAPI", "BrowserAppModuleRequest", "types.ts", "context", "iframe", "webhook", "action button", "AppServer"]
summary: "JS App SDK Context guide: use app.contextResolver.fromBrowser/fromAPI, typed via BrowserAppModuleRequest or a custom type."
lastBuilt: "2026-09-15"
---
## What it is

Describes the `ContextResolver`, which validates the incoming request, resolves the shop, and provides typed context objects.

## When to use

When handling a request from an iframe (browser context) or a webhook/action button call (API context) and needing a typed payload.

## Key steps / config

```javascript
const app = new AppServer(/** ... */);

app.contextResolver.fromBrowser(/** Request */);
app.contextResolver.fromAPI(/** Request */);
```

Both methods accept a generic type parameter for the context:

```ts
import { BrowserAppModuleRequest } from '@shopware-ag/app-server-sdk/types'

const ctx = await app.contextResolver.fromBrowser<BrowserAppModuleRequest>(/** Request */);
console.log(ctx.payload['sw-version']);
```

Custom webhook payload shapes can be typed inline when a built-in type does not fit:

```ts
type MyCustomWebHook = { foo: string };
const ctx = await app.contextResolver.fromBrowser<MyCustomWebHook>(/** Request */);
```

Available types are listed in `types.ts` in the `app-sdk-js` repository.

## Essential identifiers

- `app.contextResolver.fromBrowser()`
- `app.contextResolver.fromAPI()`
- `BrowserAppModuleRequest`
- `@shopware-ag/app-server-sdk/types`
