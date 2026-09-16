---
id: platform/dev/6.6/guides/plugins/apps/starter/starter-admin-extension.md
title: Starter Guide - Create Admin Extensions
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/starter/starter-admin-extension.html
sourceHash: 94f2d9fc4d2b6ab9ebe7db30b8dcf630d21c39e7
keywords: ["admin extension", "base-app-url", "manifest.xml", "Meteor Admin SDK", "notification.dispatch", "iFrame", "postMessage", "live-server", "shopware-cli", "extension api", "admin panel"]
summary: "Tutorial setting up an Administration UI extension via a static entry-point HTML file referenced by manifest base-app-url."
lastBuilt: "2026-09-15"
---
## What it is
A tutorial for setting up an extension for the Administration UI: an app manifest plus a static HTML entry point loaded in a hidden iFrame that communicates with the admin panel via the Meteor Admin SDK.

## When to use
Use when an app needs to add UI behavior (notifications, sections, modules) to the Shopware Administration without a full backend.

## Key steps / config
Create `manifest.xml` with standard `<meta>` fields. Create `src/index.html`, which loads the Meteor Admin SDK via CDN (exposed as `sw`) and calls `notification.dispatch` to show a title/message notification. Serve it locally:

```bash
npm install -g live-server
live-server src
```

Register the entry point in the manifest:

```xml
<manifest>
    <meta>...</meta>
    <setup>
        <registrationUrl>https://127.0.0.1:8000/app/lifecycle/register</registrationUrl>
        <secret>TestSecret</secret>
    </setup>
    <admin>
        <base-app-url>https://127.0.0.1:8080</base-app-url>
    </admin>
</manifest>
```

Install with `shopware-cli project extension upload SimpleNotification --activate --increase-version`.

## Essential identifiers
- `<admin><base-app-url>` (manifest)
- Meteor Admin SDK `sw` object, `notification.dispatch`
- `live-server`
- `shopware-cli project extension upload`

## Gotchas
Since `base-app-url` points at a local address, changes are only visible on the developer's own machine unless the entry point is hosted publicly (e.g. via a tunneling service) or on a CDN for production.

## Version notes
No version-specific constraints stated beyond general app manifest usage.
