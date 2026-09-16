---
id: platform/dev/6.7/guides/plugins/apps/create-admin-extension.md
title: Build an Admin UI App Locally
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/create-admin-extension.html
sourceHash: 6063986803e5a4b083ec5565e741a8379a536aa6
codeCheckedAgainst: "6.7.13.0"
keywords: ["manifest.xml", "app:refresh", "app:install", "app:activate", "app:list", "custom/apps", "@shopware-ag/admin-extension-sdk", "vite", "admin module", "administration app", "host.docker.internal", "iframe", "local dev server"]
summary: Local setup for an app whose Administration module is served from a Vite dev server via manifest <admin><module source>, no app backend needed.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/app-signature-verification.md", "platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md"]
---
## What it is

A local-development recipe for a Shopware app that adds an Administration module whose UI is loaded (in an iframe) from a frontend dev server such as Vite. The app is defined only by `manifest.xml` in `custom/apps`; no app backend, registration or signing is needed to render the module.

## When to use

You want to add a custom Administration module via an app and iterate on its frontend locally. For registration, signing, webhooks or Admin API credentials, continue with [App registration & backend setup](platform/dev/6.7/guides/plugins/apps/lifecycle/app-registration-setup.md), [App signature verification](platform/dev/6.7/guides/plugins/apps/lifecycle/app-signature-verification.md) and [Webhooks](platform/dev/6.7/guides/plugins/apps/lifecycle/webhook.md).

Prerequisites per the source: local Shopware instance, shell access to the PHP container for `bin/console`, Node.js 22 on the host (`nvm install 22`, `nvm use 22`).

## Key steps / config

1. Create the app folder: `mkdir -p custom/apps/MyAdminTestApp`. The folder name must equal `<meta><name>`. (`npm init @shopware/app` may fail in some environments; manual creation is enough.)
2. Create `custom/apps/MyAdminTestApp/manifest.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`). The parser requires `name`, `label`, `version`, `author`, `copyright` and `license` in `<meta>`:
   ```xml
   <manifest xsi:noNamespaceSchemaLocation="…/manifest-3.0.xsd">
     <meta>
       <name>MyAdminTestApp</name><label>…</label><version>1.0.0</version>
       <author>…</author><copyright>…</copyright><license>…</license>
     </meta>
     <admin>
       <module name="my-admin-test-app" source="…host.docker.internal:5173" parent="sw-extension">
         <label>Admin Test</label>
       </module>
     </admin>
   </manifest>
   ```
   `<module>` requires `name` and `parent`; `source` is the dev server URL (the source uses plain HTTP to `host.docker.internal` on port 5173); optional `position` defaults to `0`.
3. Inside the PHP container:
   ```bash
   bin/console app:refresh
   bin/console app:install --activate MyAdminTestApp
   bin/console app:list
   ```
   Confirm the prompt allowing communication with external hosts such as `host.docker.internal`. If listed inactive: `bin/console app:activate MyAdminTestApp` or **Extensions → My Extensions → Apps**.
4. Frontend on the host, inside the project directory: `mkdir -p admin-frontend && cd admin-frontend`, `npm create vite@latest .` (framework `Vanilla`, variant `JavaScript`), then `npm install` and `npm install @shopware-ag/admin-extension-sdk`.
5. Start with host binding: `npm run dev -- --host`. Vite defaults to port 5173 — keep it identical to the port in `source`.
6. Log in to the Administration (`/admin` on the local instance, port 8000 in the source), ensure the app is active, open the module under **Extensions**.

## Essential identifiers

- `manifest.xml`, `<admin>`, `<module name source parent>`
- `bin/console app:refresh`, `app:install --activate`, `app:list`, `app:activate`
- `custom/apps/<Name>`
- `@shopware-ag/admin-extension-sdk`, `npm run dev -- --host`

## Gotchas

- `app:refresh` fails if a required `<meta>` field is missing or empty; the source names only `<author>` and `<copyright>`, but the installed parser also requires `<license>`, which the source's example omits.
- `app:list` empty: run `app:refresh`, confirm `custom/apps/<Name>` exists inside the container.
- App missing in **My Extensions**: folder name does not match `<meta><name>`.
- Blank iframe: Vite not running, not started with `--host`, or port differs from `source`; test reaching `host.docker.internal:5173` from the container.
- `host.docker.internal` on Linux may need extra host mapping; keep the frontend inside the project if Docker uses bind mounts.

## Code check (6.7.13.0)
- corrected `license` — docs: only author and copyright named as required — vendor/shopware/core/Framework/App/Manifest/Xml/Meta/Metadata.php:23
- confirmed `author` — required meta field — vendor/shopware/core/Framework/App/Manifest/Xml/Meta/Metadata.php:21
- confirmed `copyright` — required meta field — vendor/shopware/core/Framework/App/Manifest/Xml/Meta/Metadata.php:22
- confirmed `validateRequiredElements()` — throws "<field> must not be empty" when a required field is unset — vendor/shopware/core/Framework/App/Manifest/Xml/XmlElement.php:94
- confirmed `parent` — required attribute of admin module; name required, position default 0 — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:259
- confirmed `app:refresh` — command exists, alias app:update — vendor/shopware/core/Framework/App/Command/RefreshAppCommand.php:26
- confirmed `app:install` — supports activate option — vendor/shopware/core/Framework/App/Command/InstallAppCommand.php:28
- confirmed `app:activate` — command exists — vendor/shopware/core/Framework/App/Command/ActivateAppCommand.php:15
- confirmed `app:list` — command exists — vendor/shopware/core/Framework/App/Command/AppListCommand.php:19
- confirmed `custom/apps` — app directory; folder must match app name — vendor/shopware/core/Framework/App/Command/ValidateAppCommand.php:71
