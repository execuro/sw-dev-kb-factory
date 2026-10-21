---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/apps/app-sdks/javascript/02-lifecycle.md
sourceHash: 06b07c8772891167a5df3a8f11ba23687b27f07c
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-sdks/javascript/02-lifecycle.html
title: Lifecycle
version: "6.7"
versions:
  - "6.7"
keywords: ["app lifecycle", "app server sdk", "@shopware-ag/app-server-sdk", "app.activated", "app.deactivated", "app.deleted", "app.registration.activate", "app.registration.deactivate", "app.registration.delete", "webhooks", "manifest.xml", "uninstall app"]
summary: TypeScript App Server SDK lifecycle - app.activated/deactivated/deleted webhooks routed to app.registration activate/deactivate/delete.
lastBuilt: 2026-10-21
---
## What it is

Second guide of the TypeScript App Server SDK: how the app backend tracks the app's lifecycle state (activated, deactivated, uninstalled) in its own database. Shopware notifies the backend of these changes through webhooks registered in `manifest.xml`.

## When to use

An app backend built with `@shopware-ag/app-server-sdk` needs to know when a shop activates, deactivates or uninstalls the app, to keep the stored shop state correct.

## Key steps / config

1. Register one webhook per lifecycle method in `manifest.xml`:

```xml
<webhooks>
    <webhook name="appActivate" url="https://app-server.com/app/activate" event="app.activated"/>
    <webhook name="appDeactivated" url="https://app-server.com/app/deactivate" event="app.deactivated"/>
    <webhook name="appDelete" url="https://app-server.com/app/delete" event="app.deleted"/>
</webhooks>
```

2. Route those URLs to the SDK's registration handlers, alongside the registration routes from the getting-started guide (same `AppServer` + `InMemoryShopRepository` setup):

| Path | Handler |
|---|---|
| `/authorize` | `app.registration.authorize(request)` |
| `/authorize/callback` | `app.registration.authorizeCallback(request)` |
| `/app/activate` | `app.registration.activate(request)` |
| `/app/deactivate` | `app.registration.deactivate(request)` |
| `/app/delete` | `app.registration.delete(request)` |

Unmatched paths return `new Response('Not found', { status: 404 })`.

## Essential identifiers

- Lifecycle methods: `activate`, `deactivate`, `uninstall`
- Webhook events: `app.activated`, `app.deactivated`, `app.deleted`
- `<webhook name="..." url="..." event="..."/>` inside `<webhooks>`
- `app.registration.activate()`, `app.registration.deactivate()`, `app.registration.delete()`

## Gotchas

- Uninstall is delivered as the `app.deleted` event (handler `delete`), not an `uninstall` event.
- The `app.deleted` webhook payload carries `keepUserData` (whether the merchant chose to keep app data), and the event is only dispatched to the app being removed.
- Every `<webhook>` needs `name`, `url` and `event`.

## Code check (6.7.15.1)
- confirmed `app.activated` — `AppActivatedEvent::NAME` — vendor/shopware/core/Framework/App/Event/AppActivatedEvent.php:13
- confirmed `app.deactivated` — `AppDeactivatedEvent::NAME` — vendor/shopware/core/Framework/App/Event/AppDeactivatedEvent.php:13
- confirmed `app.deleted` — `AppDeletedEvent::NAME`, fired on uninstall — vendor/shopware/core/Framework/App/Event/AppDeletedEvent.php:16
- confirmed `AppDeletedEvent::getWebhookPayload()` — payload `keepUserData` — vendor/shopware/core/Framework/App/Event/AppDeletedEvent.php:45
- confirmed `AppDeletedEvent::isAllowed()` — only the app itself receives it — vendor/shopware/core/Framework/App/Event/AppDeletedEvent.php:52
- confirmed `webhook` — manifest element inside `webhooks` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:252
- confirmed `webhook.name` — required attribute; `url` and `event` also required, `onlyLiveVersion` optional — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:277
- unverified `app.registration.activate()` — npm SDK method, outside the installed Shopware code
- unverified `app.registration.delete()` — npm SDK method, outside the installed Shopware code
