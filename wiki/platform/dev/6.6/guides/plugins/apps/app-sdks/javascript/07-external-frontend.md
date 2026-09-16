---
id: platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/07-external-frontend.md
title: External Frontend
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/javascript/07-external-frontend.html
sourceHash: 4ae33325e4ff73fe80378feb8f36f7bbed239c32
keywords: ["external frontend", "appIframeEnable", "appIframeRedirects", "appIframePath", "Hono", "configureAppServer", "iframe", "client-api", "cookie", "admin-extension-sdk"]
summary: "JS App SDK: serve an admin iframe frontend as a separate app, protected via configureAppServer's appIframeEnable/appIframeRedirects."
lastBuilt: "2026-09-15"
---
## What it is

Describes running an app's admin-interface frontend as a separate application (e.g. Next.js, Nuxt.js, Angular, React, Vue.js) instead of building it with the admin-extension-sdk directly, and authenticating its requests through the Hono integration.

## When to use

When an app's admin UI needs a full frontend framework rather than embedding directly, and that frontend must still call back into the app server as an authenticated shop.

## Key steps / config

The browser requests the app server, which verifies the request, sets a cookie, and forwards to the frontend; the frontend then makes regular AJAX requests against the app server, which uses the cookie to re-verify:

```ts
import { configureAppServer } from "@shopware-ag/app-server-sdk/integration/hono";

configureAppServer(app, {
  /** ... */
  appIframeEnable: true,
  appIframeRedirects: {
    '/app/browser': '/client'
  }
});

app.get('/client-api/test', (c) => {
  return c.json({ shopId: c.get('shop').getShopId() });
});
```

Configure `manifest.xml` to point the module URL at `/app/browser`; the app server verifies and redirects to `/client`. The frontend then calls `fetch("/client-api/test")`.

## Essential identifiers

- `appIframeEnable`
- `appIframeRedirects`
- `appIframePath`
- `c.get('shop').getShopId()`

## Gotchas

The path `/client-api/*` is automatically protected by Hono middleware; the equivalent app path can be renamed via `appIframePath` in `configureAppServer`.
