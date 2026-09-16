---
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/02-lifecycle.md
title: Lifecycle
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/02-lifecycle.html
sourceHash: 06b07c8772891167a5df3a8f11ba23687b27f07c
codeCheckedAgainst: "6.7.13.0"
keywords: ["app lifecycle", "app server sdk", "javascript app sdk", "app.activated", "app.deactivated", "app.deleted", "webhooks", "manifest.xml", "app.registration.activate", "app.registration.deactivate", "app.registration.delete", "uninstall app"]
summary: "TypeScript App Server SDK lifecycle: register app.activated/app.deactivated/app.deleted webhooks in manifest.xml and route them to app.registration handlers."
lastBuilt: 2026-09-15
---
## What it is

Guide for handling app lifecycle events (activate, deactivate, uninstall) in an app backend built with the Shopware App Server SDK in TypeScript, so the backend can keep the shop's app state in its database in sync.

## When to use

Your JavaScript/TypeScript app backend stores per-shop state and must react when a shop activates, deactivates or deletes (uninstalls) the app. Builds on the registration setup from the getting-started page.

## Key steps / config

1. Register lifecycle webhooks in `manifest.xml`; each `<webhook>` needs `name`, `url` and `event`:

```xml
<webhooks>
    <webhook name="appActivate" url="https://app-server.com/app/activate" event="app.activated"/>
    <webhook name="appDeactivated" url="https://app-server.com/app/deactivate" event="app.deactivated"/>
    <webhook name="appDelete" url="https://app-server.com/app/delete" event="app.deleted"/>
</webhooks>
```

2. Route the webhook paths to the SDK's registration handlers, next to the registration routes:

```javascript
import { AppServer, InMemoryShopRepository } from '@shopware-ag/app-server-sdk'
// app = new AppServer({ appName, appSecret, authorizeCallbackUrl }, new InMemoryShopRepository())
if (pathname === '/authorize') return app.registration.authorize(request);
if (pathname === '/authorize/callback') return app.registration.authorizeCallback(request);
if (pathname === '/app/activate') return app.registration.activate(request);
if (pathname === '/app/deactivate') return app.registration.deactivate(request);
if (pathname === '/app/delete') return app.registration.delete(request);
return new Response('Not found', { status: 404 });
```

3. With these routes the backend is notified of every app state change and can track it in its database.

## Essential identifiers

- Webhook events `app.activated`, `app.deactivated`, `app.deleted`
- Manifest elements `<webhooks>` / `<webhook name url event>`
- `app.registration.activate(request)`, `app.registration.deactivate(request)`, `app.registration.delete(request)`
- Routes `/app/activate`, `/app/deactivate`, `/app/delete`

## Gotchas

- Shopware only sends lifecycle notifications for events you registered as webhooks in the manifest.
- The `<webhook>` element also accepts an optional `onlyLiveVersion` boolean (default `false`) in the installed manifest schema; the source does not use it.

## Code check (6.7.13.0)
- confirmed `AppActivatedEvent::NAME` — value `app.activated` — vendor/shopware/core/Framework/App/Event/AppActivatedEvent.php:13
- confirmed `AppDeactivatedEvent::NAME` — value `app.deactivated` — vendor/shopware/core/Framework/App/Event/AppDeactivatedEvent.php:13
- confirmed `AppDeletedEvent::NAME` — value `app.deleted` — vendor/shopware/core/Framework/App/Event/AppDeletedEvent.php:16
- confirmed `webhooks` — manifest element holding webhook entries — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:241
- confirmed `webhook.event` — required attribute, with required `name` and `url` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:268
- confirmed `webhook.onlyLiveVersion` — optional boolean, default false — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:269
- unverified `app.registration.activate` — method of the external npm SDK, outside vendor/shopware
- unverified `@shopware-ag/app-server-sdk` — npm package, outside vendor/shopware
