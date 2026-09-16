---
id: platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/02-lifecycle.md
title: Lifecycle
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/javascript/02-lifecycle.html
sourceHash: 06b07c8772891167a5df3a8f11ba23687b27f07c
keywords: ["lifecycle", "activate", "deactivate", "uninstall", "manifest.xml", "webhook", "app.activated", "app.deactivated", "app.deleted", "AppServer", "registration"]
summary: "JS App SDK lifecycle guide: activate/deactivate/uninstall webhooks declared in manifest.xml and routed to app.registration methods."
lastBuilt: "2026-09-15"
---
## What it is

Describes how the Shopware App System manages an app's lifecycle: Shopware sends webhooks to the app's backend server on lifecycle changes, and the app must implement handlers to keep its own state in sync.

## When to use

When an app needs to track activation, deactivation, or uninstallation state in its own database.

## Key steps / config

The lifecycle methods are `activate`, `deactivate`, `uninstall`. Register the corresponding webhooks in `manifest.xml`:

```xml
<webhooks>
    <webhook name="appActivate" url="https://app-server.com/app/activate" event="app.activated"/>
    <webhook name="appDeactivated" url="https://app-server.com/app/deactivate" event="app.deactivated"/>
    <webhook name="appDelete" url="https://app-server.com/app/delete" event="app.deleted"/>
</webhooks>
```

In the server code, route each incoming path to the matching `app.registration` method:

```javascript
if (pathname === '/authorize') { return app.registration.authorize(request); }
if (pathname === '/authorize/callback') { return app.registration.authorizeCallback(request); }
if (pathname === '/app/activate') { return app.registration.activate(request); }
if (pathname === '/app/deactivate') { return app.registration.deactivate(request); }
if (pathname === '/app/delete') { return app.registration.delete(request); }
```

This lets the backend get notified of any app state change and track it in its own database.

## Essential identifiers

- `app.registration.activate(request)`
- `app.registration.deactivate(request)`
- `app.registration.delete(request)`
- `manifest.xml` `<webhooks>` element
- events: `app.activated`, `app.deactivated`, `app.deleted`
