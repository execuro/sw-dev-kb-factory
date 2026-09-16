---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/07-external-frontend.md
title: External Frontend
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/07-external-frontend.html
sourceHash: 4ae33325e4ff73fe80378feb8f36f7bbed239c32
codeCheckedAgainst: "6.7.13.0"
keywords: ["configureAppServer", "appIframeEnable", "appIframeRedirects", "appIframePath", "/client-api/*", "/app/browser", "hono", "external frontend", "admin iframe", "app module", "cookie authentication", "admin-extension-sdk"]
summary: "JS App Server SDK Hono setup for a separate frontend: appIframeEnable/appIframeRedirects verify the iframe request, set a cookie, protect /client-api/*."
lastBuilt: 2026-09-15
---
## What it is

A pattern for apps whose Administration UI (built with the admin-extension-sdk) lives in a separate frontend application (Next.js, Nuxt.js, Angular, React, Vue.js, ...), using the Hono integration of the JavaScript App Server SDK to authenticate requests from that frontend.

## When to use

When the admin iframe content is served by its own frontend app and that frontend needs to call the app server backend for shop-specific data, with the request verified as coming from a registered shop.

## Key steps / config

Flow: the browser requests a URL on the app server; the app server verifies the signed request, sets a cookie and redirects to the frontend. The frontend then makes regular AJAX requests to the app server, which verifies them using the cookie.

```ts
import { Hono } from "hono/tiny";
import { configureAppServer } from "@shopware-ag/app-server-sdk/integration/hono";

const app = new Hono();
configureAppServer(app, {
  /** ... */
  appIframeEnable: true,
  appIframeRedirects: { '/app/browser': '/client' }
});

app.get('/client-api/test', (c) => {
  return c.json({ shopId: c.get('shop').getShopId() });
});
```

1. Enable `appIframeEnable: true` and map entry paths to frontend paths in `appIframeRedirects`.
2. In `manifest.xml`, point the admin module's URL to `/app/browser`; the app server verifies it and redirects to `/client`.
3. In the frontend, call `fetch("/client-api/test")`; the app server verifies the cookie and exposes the shop via `c.get('shop')`.
4. Routes under `/client-api/*` are protected automatically by a Hono middleware. The path prefix can be changed in `configureAppServer` with `appIframePath`.

On the Shopware side, the URL given as a module `source` in the manifest is signed as a query string (`shop-id`, `shop-url`, `timestamp`, `sw-version`, `app-version`, `shopware-shop-signature`) before the Administration loads it in the iframe; that signed query is what the `/app/browser` entry route has to verify.

## Essential identifiers

- `configureAppServer` options `appIframeEnable`, `appIframeRedirects`, `appIframePath`
- `c.get('shop').getShopId()`
- Entry route `/app/browser`, protected API prefix `/client-api/*`

## Gotchas

- The source is inconsistent about the path: it says `/client-api/*` is protected, then that "the path `/client-app/*`" can be changed with `appIframePath`. Check the SDK for which prefix `appIframePath` controls.
- The source imports `Hono` from `hono/tiny` here, while the Integrations page uses `hono`.

## Code check (6.7.13.0)
- unverified `appIframeEnable` — JS SDK option, outside the vendor/shopware scope
- unverified `appIframePath` — JS SDK option, outside the vendor/shopware scope
- confirmed `module` — manifest admin module type with a source attribute — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:253
- confirmed `main-module` — source attribute required — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:262
- confirmed `signUri` — module source URLs are signed before iframe load — vendor/shopware/core/Framework/App/Manifest/ModuleLoader.php:160
- confirmed `shop-id` — query parameter in the signed iframe URL — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:42
- confirmed `shopware-shop-signature` — HMAC query parameter appended last — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:55
