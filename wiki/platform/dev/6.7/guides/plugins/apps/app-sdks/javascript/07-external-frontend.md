---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/07-external-frontend.md
title: External Frontend
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/07-external-frontend.html
sourceHash: 4ae33325e4ff73fe80378feb8f36f7bbed239c32
codeCheckedAgainst: "6.7.15.1"
keywords: ["appIframeEnable", "appIframeRedirects", "appIframePath", "configureAppServer", "hono", "/client-api", "/app/browser", "external frontend", "iframe", "admin module", "cookie auth", "javascript app sdk"]
summary: "JavaScript App Server SDK: serve a separate admin-module frontend via Hono with appIframeEnable/appIframeRedirects and cookie-protected /client-api/* routes."
lastBuilt: 2026-10-21
---
## What it is

A pattern in the JavaScript App Server SDK for apps whose Administration UI (built with the admin-extension-sdk) lives in a separate frontend application (Next.js, Nuxt, Angular, React, Vue, ...). The Hono integration verifies the shop's browser request, sets a cookie, and redirects to the frontend; the frontend then calls the app server, which authenticates via that cookie.

## When to use

When your app's admin module or iframe is a standalone frontend project and it needs to call your app server as a verified shop.

## Key steps / config

1. Enable iframe handling in `configureAppServer` and map the entry path to the frontend path:

```ts
import { Hono } from "hono/tiny";
import { configureAppServer } from "@shopware-ag/app-server-sdk/integration/hono";
const app = new Hono();
configureAppServer(app, {
  /** ... */
  appIframeEnable: true,
  appIframeRedirects: { '/app/browser': '/client' },
});
app.get('/client-api/test', (c) => c.json({ shopId: c.get('shop').getShopId() }));
```

2. In `manifest.xml`, point the module/iframe URL at `/app/browser`. The app server verifies the signed request and redirects to `/client`.
3. From the frontend, call the app server with a plain `fetch("/client-api/test")`; the cookie authenticates it and `c.get('shop')` is available.

## Essential identifiers

- `configureAppServer`, `appIframeEnable`, `appIframeRedirects`, `appIframePath`
- `/client-api/*` (protected by Hono middleware), `/app/browser`
- `c.get('shop').getShopId()`

## Gotchas

- Only `/client-api/*` is protected automatically. The source says the `/client-app/*` path can be changed with `appIframePath`.

## Code check (6.7.15.1)
- confirmed `QuerySigner::signUri()` — Shopware appends `shop-id`, `shop-url`, `timestamp`, `sw-version` etc. to iframe/module URLs — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:34
- confirmed `shopware-shop-signature` — query parameter carrying the HMAC the app server verifies — vendor/shopware/core/Framework/App/Hmac/QuerySigner.php:55
- confirmed `main-module` — manifest element whose `source` URL can point at `/app/browser` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:273
- confirmed `module` — admin module element with `source` attribute — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:264
- unverified `appIframeEnable` — JavaScript SDK option, not in the Shopware code roots
- unverified `appIframeRedirects` — JavaScript SDK option, out of scope
- unverified `appIframePath` — JavaScript SDK option, out of scope
