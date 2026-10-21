---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/01-getting_started.md
sourceHash: 4d6145ef24678986aecca0270d26c7b679b26be7
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/01-getting_started.html
title: Getting Started
version: "6.7"
versions:
  - "6.7"
keywords: ["app server sdk", "@shopware-ag/app-server-sdk", "@shopware-ag/app-sdk-server", "AppServer", "InMemoryShopRepository", "app.registration.authorize", "authorizeCallback", "/authorize/callback", "app registration", "typescript app backend", "bun", "deno"]
summary: Install the TypeScript App Server SDK and expose /authorize and /authorize/callback via AppServer to handle Shopware app registration.
lastBuilt: 2026-10-21
---
## What it is

First step of the TypeScript/JavaScript App Server SDK (open source, `https://github.com/shopware/app-sdk-js`): installing it and wiring the app registration handshake with an `AppServer` instance. Assumes an app backend already runs.

## When to use

Starting an app backend in JS/TS (Bun, Deno, Node.js, edge/serverless) that must complete the registration handshake with a Shopware shop. The next guide in the series covers lifecycle handling.

## Key steps / config

1. Install: `npm install --save @shopware-ag/app-sdk-server` (command as given by the source; the code imports from `@shopware-ag/app-server-sdk` — see Gotchas).
2. Create an `AppServer` with app name, app secret and the absolute authorize callback URL of your backend, plus a shop repository. `InMemoryShopRepository` keeps shops in memory (local development/testing); replace it with a persistent database-backed repository in production.
3. Expose two routes in a `fetch(request)` handler:
   - `/authorize` → `app.registration.authorize(request)` (starts the registration flow)
   - `/authorize/callback` → `app.registration.authorizeCallback(request)` (handles Shopware's callback)
   - anything else → `new Response('Not found', { status: 404 })`

```javascript
import { AppServer, InMemoryShopRepository } from '@shopware-ag/app-server-sdk'
const app = new AppServer({
  appName: 'MyApp',
  appSecret: 'my-secret',
  authorizeCallbackUrl: '<backend-base-url>/authorize/callback',
}, new InMemoryShopRepository());
```

4. Run: `bun run index.js` or `deno serve index.js`. Node.js does not support the `Request`/`Response` objects natively; use `@hono/node-server` (the source recommends a framework like Hono).

## Essential identifiers

- `@shopware-ag/app-server-sdk`, `AppServer`, `InMemoryShopRepository`
- `appName`, `appSecret`, `authorizeCallbackUrl`
- `app.registration.authorize()`, `app.registration.authorizeCallback()`
- routes `/authorize`, `/authorize/callback`

## Gotchas

- The source's install command names `@shopware-ag/app-sdk-server`, while its import uses `@shopware-ag/app-server-sdk`; the two names differ — check the npm package name before installing.
- `InMemoryShopRepository` is for development only; production needs a custom repository that stores shops in a database.
- On the shop side, the `/authorize` route is what the manifest's `registrationUrl` points to (see Code check).

## Code check (6.7.15.1)
- confirmed `registrationUrl` — manifest element the shop calls to start registration — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:199
- confirmed `secret` — optional manifest registration secret — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:206
- confirmed `PrivateHandshake::assembleRequest()` — shop sends GET with `shop-id`, `shop-url`, `timestamp` query — vendor/shopware/core/Framework/App/Lifecycle/Registration/PrivateHandshake.php:31
- confirmed `shopware-app-signature` — HMAC-SHA256 of the query with the app secret — vendor/shopware/core/Framework/App/Lifecycle/Registration/PrivateHandshake.php:44
- confirmed `confirmation_url` — app response field the shop posts the confirmation to — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:101
- confirmed `shopware-shop-signature` — header on the shop's confirmation request — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:244
- unverified `AppServer` — npm SDK class, outside the installed Shopware code
- unverified `InMemoryShopRepository` — npm SDK class, outside the installed Shopware code
- unverified `@shopware-ag/app-sdk-server` — npm package name, outside the installed Shopware code
