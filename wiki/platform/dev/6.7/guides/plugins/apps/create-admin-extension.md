---
id: platform/dev/6.7/guides/plugins/apps/create-admin-extension.md
title: Build an Admin UI App Locally
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/create-admin-extension.html
sourceHash: 6063986803e5a4b083ec5565e741a8379a536aa6
codeCheckedAgainst: "6.7.15.1"
keywords: ["manifest.xml", "custom/apps", "app:refresh", "app:install", "app:activate", "app:list", "@shopware-ag/admin-extension-sdk", "admin module", "vite dev server", "host.docker.internal", "administration iframe", "local app development"]
summary: "Local Admin UI app setup - manifest.xml with an admin module loaded from a Vite dev server, app:refresh/app:install, no app backend needed."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/app-signature-verification.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md"]
---
## What it is

A walkthrough for creating a Shopware app that adds a custom Administration module whose UI is served from a local frontend dev server (Vite). The app is defined via `manifest.xml`, discovered from `custom/apps`, and needs no app backend to render the module.

## When to use

- You want to add a custom module to the Administration via an app.
- You want to iterate on an app-based Admin UI locally before building an app backend.
- For registration, signing, webhooks or Admin API credentials, continue with [App registration & backend setup](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md).

Prerequisites: a local Shopware instance with Administration access, shell access to the PHP container for `bin/console`, and Node.js 22 on the host (`nvm install 22`, `nvm use 22`).

## Key steps / config

1. Create the app folder: `mkdir -p custom/apps/MyAdminTestApp`. The folder name must match `<meta><name>`. Scaffolding via `npm init @shopware/app` may fail in some environments; manual creation is sufficient.
2. Create `custom/apps/MyAdminTestApp/manifest.xml`. The installed `Metadata` class requires `label`, `name`, `author`, `copyright`, `license` and `version` in `<meta>`; a `<module>` requires `name` and `parent`, `source` is the dev-server URL:

```xml
<manifest xmlns:xsi="..." xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd">
    <meta>
        <name>MyAdminTestApp</name>
        <label>My Admin Test App</label>
        <version>1.0.0</version>
        <author>Your Name</author>
        <copyright>(c) Your Name</copyright>
        <license>...</license>
    </meta>
    <admin>
        <module name="my-admin-test-app" source="..." parent="sw-extension">
            <label>Admin Test</label>
        </module>
    </admin>
</manifest>
```

   In the source, `source` points to `host.docker.internal` on port `5173` (plain HTTP to the local Vite server).
3. In the PHP container, from the project root: `bin/console app:refresh`, `bin/console app:install --activate MyAdminTestApp`, `bin/console app:list`. Confirm the prompt allowing communication with external hosts such as `host.docker.internal`. If listed inactive, run `bin/console app:activate MyAdminTestApp` or activate under **Extensions > My Extensions > Apps**.
4. On the host, in the project root: `mkdir -p admin-frontend`, `cd admin-frontend`, `npm create vite@latest .` (framework `Vanilla`, variant `JavaScript`), then `npm install` and `npm install @shopware-ag/admin-extension-sdk`.
5. Start Vite reachable from Docker: `npm run dev -- --host`. Vite defaults to port `5173`; keep it in sync with the manifest `source` URL. Keep the frontend inside the Shopware project directory if Docker relies on bind mounts.
6. In the Administration, ensure `MyAdminTestApp` is active under **Extensions > My Extensions > Apps** and open the module from **Extensions**.

## Essential identifiers

- `custom/apps/<Name>/manifest.xml`, schema `manifest-3.0.xsd`
- `<meta>`: `name`, `label`, `version`, `author`, `copyright`, `license`
- `<admin><module name source parent>`, `parent="sw-extension"`
- `bin/console app:refresh`, `app:install --activate`, `app:list`, `app:activate`
- `@shopware-ag/admin-extension-sdk`, `npm run dev -- --host`

## Gotchas

- `app:refresh` fails when a required `<meta>` element is missing or empty; the docs name `<author>` and `<copyright>`, but the installed code also requires `<license>` (the docs example omits it).
- `app:list` shows nothing: run `app:refresh` and confirm `custom/apps/<Name>` exists inside the container.
- App missing in **My Extensions**: folder name must match `<meta><name>`.
- Blank iframe: Vite must be running, started with `--host`, on the same port as `source`; test reachability of `host.docker.internal:5173` from the container.
- `host.docker.internal` may need extra host mapping or network config on Linux.

## Code check (6.7.15.1)
- confirmed `admin.module` — `<module>` element allowed inside `<admin>` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:220
- corrected `Metadata::REQUIRED_FIELDS` — docs: only `<author>`/`<copyright>` called required; code also requires `license` (plus label, name, version) — vendor/shopware/core/Framework/App/Manifest/Xml/Meta/Metadata.php:18
- confirmed `module.parent` — required attribute of `<module>` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:270
- confirmed `module.name` — required attribute of `<module>` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:269
- confirmed `module.source` — optional anyURI attribute of `<module>` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:268
- confirmed `app:refresh` — console command (alias `app:update`) — vendor/shopware/core/Framework/App/Command/RefreshAppCommand.php:27
- confirmed `app:install` — console command with `activate` option — vendor/shopware/core/Framework/App/Command/InstallAppCommand.php:29
- confirmed `app:list` — console command — vendor/shopware/core/Framework/App/Command/AppListCommand.php:20
- confirmed `app:activate` — console command — vendor/shopware/core/Framework/App/Command/ActivateAppCommand.php:16
- unverified `@shopware-ag/admin-extension-sdk` — npm package, outside the vendor roots
