---
id: platform/dev/6.7/guides/plugins/apps/administration/starter-admin-extension.md
title: Create Admin Extensions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/administration/starter-admin-extension.html
sourceHash: 84b05a0feae6260c6701584fb42d89545a9f2c0b
codeCheckedAgainst: "6.7.15.1"
keywords: ["base-app-url", "manifest.xml", "admin extension", "Meteor Admin SDK", "notification.dispatch", "entry point", "hidden iframe", "live-server", "shopware-cli project extension upload", "--increase-version", "custom/apps", "SimpleNotification"]
summary: Minimal app that loads a Meteor Admin SDK entry point via <base-app-url> as a hidden Admin iframe and uploads it with shopware-cli.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md"]
---
## What it is

A starter walkthrough for an app that extends the Administration UI through the Meteor Admin SDK: an app manifest plus a static HTML entry point, registered via `<base-app-url>`, which shows a notification when the Administration loads.

## When to use

Setting up a first local development loop for an Administration extension app (cloud or self-hosted), before adding sections, modules or other SDK features.

## Key steps / config

1. Create the project directory `SimpleNotification/` with `manifest.xml` (self-hosted: it can live in `custom/apps` of the installation). Schema: `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`. `<meta>` holds `name`, `label`, `description`, `author`, `copyright`, `version`, `license`.
2. Create the entry point `src/index.html`. It is rendered as a hidden iframe when the Administration loads and talks to it through `postMessage`. It loads the Meteor Admin SDK script from a CDN (exposed as the `sw` object) and calls `notification.dispatch` with a title and message.
3. Serve it locally:

```bash
npm install -g live-server
live-server src
```

4. Point the manifest at the entry point (values elided; the guide uses the local live-server URL on port 8080 and a local registration URL):

```xml
<manifest ...>
    <meta>...</meta>
    <setup>
        <registrationUrl>...</registrationUrl>
        <secret>...</secret>
    </setup>
    <admin>
        <base-app-url>...</base-app-url>
    </admin>
</manifest>
```

5. Install with the Shopware CLI (configure first with `shopware-cli project config init`):

```bash
shopware-cli project extension upload SimpleNotification --activate --increase-version
```

The command zips the extension directory and uploads it to the configured store. The notification appears on next Administration load.

## Essential identifiers

- `<admin><base-app-url>` in `manifest.xml`
- `src/index.html` entry point, SDK object `sw`, method `notification.dispatch`
- `shopware-cli project config init`, `shopware-cli project extension upload ... --activate --increase-version`

## Gotchas

- `--increase-version` bumps the version in `manifest.xml`; it is required so Shopware picks up manifest changes since the last install.
- A locally served entry point only works on your own machine; share it by hosting it or exposing it publicly (e.g. ngrok). For production host it on a public CDN or static hosting.

## Code check (6.7.15.1)
- confirmed `base-app-url` — optional single `<admin>` child of type anyURI — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:222
- confirmed `Admin::$baseAppUrl` — parsed from the `base-app-url` element — vendor/shopware/core/Framework/App/Manifest/Xml/Administration/Admin.php:104
- confirmed `notificationDispatch` — Administration handler behind the SDK `notification.dispatch` — vendor/shopware/administration/Resources/app/administration/src/app/init/notification.init.ts:10
- unverified `shopware-cli` — separate CLI tool, outside the installed Shopware packages
- unverified `live-server` — third-party npm tool, out of scope
