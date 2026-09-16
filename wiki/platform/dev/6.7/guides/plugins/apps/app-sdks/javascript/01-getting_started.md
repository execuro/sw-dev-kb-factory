---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/01-getting_started.md
title: Getting Started
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/01-getting_started.html
sourceHash: 4d6145ef24678986aecca0270d26c7b679b26be7
codeCheckedAgainst: "6.7.13.0"
keywords: ["app server sdk", "javascript app sdk", "typescript", "AppServer", "InMemoryShopRepository", "@shopware-ag/app-server-sdk", "app.registration.authorize", "app.registration.authorizeCallback", "/authorize", "/authorize/callback", "app registration", "bun", "deno"]
summary: "Install the TypeScript App Server SDK and expose /authorize and /authorize/callback via AppServer and InMemoryShopRepository for app registration."
lastBuilt: 2026-09-15
---
## What it is

Getting-started guide for the Shopware App Server SDK in TypeScript (open source, `https://github.com/shopware/app-sdk-js`): installing it and wiring the app registration handshake into a fetch-style request handler.

## When to use

Building an app backend in JavaScript/TypeScript (Bun, Deno, Node.js via an adapter) that must handle the Shopware app registration flow. Assumes a running app backend.

## Key steps / config

1. Install via npm (command as given in the source):

```bash
npm install --save @shopware-ag/app-sdk-server
```

2. Create an `AppServer` with app name, app secret and the authorize callback URL, plus a shop repository. `InMemoryShopRepository` keeps shops in memory (local development/testing only); use a persistent database-backed repository in production.
3. Expose two routes: `/authorize` starts registration, `/authorize/callback` handles Shopware's callback:

```javascript
import { AppServer, InMemoryShopRepository } from '@shopware-ag/app-server-sdk'
const app = new AppServer({
  appName: 'MyApp',
  appSecret: 'my-secret',
  authorizeCallbackUrl: '<app-base-url>/authorize/callback',
}, new InMemoryShopRepository());
export default { async fetch(request) {
  const { pathname } = new URL(request.url);
  if (pathname === '/authorize') return app.registration.authorize(request);
  if (pathname === '/authorize/callback') return app.registration.authorizeCallback(request);
  return new Response('Not found', { status: 404 });
} };
```

(The source example uses a local port-3000 URL for `authorizeCallbackUrl`.)

4. Run it: `bun run index.js` or `deno serve index.js`. Node.js lacks native `Request`/`Response` support for this handler; use `@hono/node-server`, or a framework like Hono.

## Essential identifiers

- `AppServer`, `InMemoryShopRepository`
- `app.registration.authorize(request)`, `app.registration.authorizeCallback(request)`
- Config keys `appName`, `appSecret`, `authorizeCallbackUrl`
- Routes `/authorize`, `/authorize/callback`

## Gotchas

- The source is inconsistent on the package name: the install command uses `@shopware-ag/app-sdk-server`, the import uses `@shopware-ag/app-server-sdk`. The package is not part of the installed Shopware code, so this could not be resolved here; check the npm registry.
- The source's install heading says "App PHP SDK" but the package is the JavaScript SDK.
- Shopware (core) fails a registration when the app returns a new secret identical to the current one.

## Code check (6.7.13.0)
- confirmed `registrationUrl` — manifest setup element used by a shop to register to the app — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:188
- confirmed `AppRegistrationService::registerApp()` — core side of the registration handshake — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:43
- confirmed `confirmation_url` — read from the app's registration response — vendor/shopware/core/Framework/App/Lifecycle/Registration/AppRegistrationService.php:55
- confirmed `RequestSigner::SHOPWARE_SHOP_SIGNATURE` — `shopware-shop-signature` header — vendor/shopware/core/Framework/App/Hmac/RequestSigner.php:15
- unverified `AppServer` — class of the external npm SDK, outside vendor/shopware
- unverified `InMemoryShopRepository` — class of the external npm SDK, outside vendor/shopware
- unverified `@shopware-ag/app-server-sdk` — npm package, outside vendor/shopware
