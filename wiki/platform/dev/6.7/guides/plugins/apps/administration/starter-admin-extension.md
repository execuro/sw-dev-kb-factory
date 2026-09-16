---
id: platform/dev/6.7/guides/plugins/apps/administration/starter-admin-extension.md
title: Create Admin Extensions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/administration/starter-admin-extension.html
sourceHash: 84b05a0feae6260c6701584fb42d89545a9f2c0b
codeCheckedAgainst: "6.7.13.0"
keywords: ["admin extension", "app", "manifest.xml", "base-app-url", "Meteor Admin SDK", "admin extension sdk", "iframe", "postMessage", "notification.dispatch", "shopware-cli project extension upload", "--increase-version", "live-server", "administration ui"]
summary: Minimal app that runs a Meteor Admin SDK entry point (hidden iFrame) via manifest admin base-app-url, served locally and uploaded with shopware-cli.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md"]
---
## What it is

A starter walkthrough for an app that extends the Shopware Administration: a `manifest.xml` wrapper plus a static HTML entry point that loads the Meteor Admin SDK and shows an admin notification.

## When to use

You want to add UI to the Administration from an app (cloud or self-hosted) without a plugin, and need the minimal local dev loop: entry point file, local server, manifest link, install.

## Key steps / config

1. Create a project directory (e.g. `SimpleNotification/`) with a `manifest.xml`. On self-hosted Shopware it may live in `custom/apps`. The manifest uses schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd` and a `<meta>` block with `name`, `label`, `description`, `author`, `copyright`, `version`, `license`.
2. Create `src/index.html` as the entry point. It is rendered as a hidden iFrame when the Administration loads and talks to the admin via `postMessage`. The Meteor Admin SDK script is loaded through a CDN and exposed as the `sw` object; the example calls the SDK method `notification.dispatch` with a title and message.
3. Serve the file locally: `npm install -g live-server` then `live-server src` (serves on local port 8080).
4. Point the manifest at the entry point via the `<admin>` section:

```xml
<manifest xsi:noNamespaceSchemaLocation="...manifest-3.0.xsd">
    <meta>...</meta>
    <setup>
        <registrationUrl>.../app/lifecycle/register</registrationUrl>
        <secret>TestSecret</secret>
    </setup>
    <admin>
        <base-app-url>(URL of your entry point)</base-app-url>
    </admin>
</manifest>
```

5. Install via Shopware CLI (first run `shopware-cli project config init`):
   `shopware-cli project extension upload SimpleNotification --activate --increase-version`. It zips the directory, uploads it to the configured store and activates it. The notification appears when the Administration is opened.

## Essential identifiers

- `manifest.xml`, `<admin>`, `<base-app-url>`
- `<setup>`, `<registrationUrl>`, `<secret>`
- `src/index.html` (entry point), `sw` object, `notification.dispatch`
- `shopware-cli project config init`, `shopware-cli project extension upload`
- `--activate`, `--increase-version`

## Gotchas

- `--increase-version` bumps the version in `manifest.xml`; the source says it is required so Shopware picks up manifest changes since the last installation.
- A locally served entry point is only visible on your own machine. To share it, host the file or expose it via a tunnelling service; for production host it on a public CDN or static hosting.
- In the installed schema, `<secret>` inside `<setup>` is optional (only for local development, skips store-based authentication), while `<registrationUrl>` is required when `<setup>` is present.

## Code check (6.7.13.0)
- confirmed `base-app-url` — optional single element of the `admin` complex type — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:211
- confirmed `registrationUrl` — required element of `setup` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:188
- confirmed `secret` — optional (`minOccurs="0"`) element of `setup` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:195
- confirmed `author` — meta element in manifest-3.0 schema — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:164
- confirmed `Metadata::REQUIRED_FIELDS` — label, name, author, copyright, license, version are required meta fields — vendor/shopware/core/Framework/App/Manifest/Xml/Meta/Metadata.php:18
- unverified `shopware-cli project extension upload` — external CLI tool, not in vendor/shopware
- unverified `notification.dispatch` — Meteor Admin SDK (npm package), out of scope
