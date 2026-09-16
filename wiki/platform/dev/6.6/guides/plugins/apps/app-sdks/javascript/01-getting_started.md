---
id: platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/01-getting_started.md
title: Getting started
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/javascript/01-getting_started.html
sourceHash: 2f771f79815984c7198c30ced56552495d2c1581
keywords: ["AppServer", "InMemoryShopRepository", "app-server-sdk", "app-sdk-js", "registration", "authorize", "authorizeCallback", "npm install", "Hono", "Bun", "Deno", "Node.js", "app registration"]
summary: "JS App SDK getting-started guide: npm install, create an AppServer instance, wire /authorize and /authorize/callback routes."
lastBuilt: "2026-09-15"
---
## What it is

This page is the getting-started guide for the Shopware App SDK for JavaScript (the open-source `app-sdk-js` project), covering installation and the app registration handshake.

## When to use

When starting a new app backend in TypeScript/JavaScript that needs to register with Shopware and handle the registration callback.

## Key steps / config

1. Install the SDK:

```bash
npm install --save @shopware-ag/app-sdk-server
```

2. Create an `AppServer` instance with an app name, app secret, an authorize callback URL, and a shop repository, then route `/authorize` and `/authorize/callback` to it:

```javascript
import { AppServer, InMemoryShopRepository } from '@shopware-ag/app-server-sdk'

const app = new AppServer({
  appName: 'MyApp',
  appSecret: 'my-secret',
  authorizeCallbackUrl: 'localhost:3000/authorize/callback',
}, new InMemoryShopRepository());

export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === '/authorize') {
      return app.registration.authorize(request);
    } else if (pathname === '/authorize/callback') {
      return app.registration.authorizeCallback(request);
    }
    return new Response('Not found', { status: 404 });
  }
};
```

`InMemoryShopRepository` stores shops in memory; a custom repository can persist them to a database instead. Runtime entry points differ: Bun runs `bun run index.js`, Deno runs `deno serve index.js`, and Node.js needs `@hono/node-server` (or a framework such as Hono) because it lacks native `Request`/`Response` objects.

## Essential identifiers

- `AppServer`
- `InMemoryShopRepository`
- `app.registration.authorize(request)`
- `app.registration.authorizeCallback(request)`
- `@shopware-ag/app-server-sdk` (import path used in code)

## Gotchas

The install command given uses the package name `@shopware-ag/app-sdk-server`, while the code example imports from `@shopware-ag/app-server-sdk` — the source itself uses both spellings.
