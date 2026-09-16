---
id: platform/dev/6.7/products/sales-agent/installation.md
title: Local installation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/installation.html
sourceHash: 6bdcae10d380e5edda8c7c3407eaeb3dc0affbfc
codeCheckedAgainst: "6.7.13.0"
keywords: ["sales agent", "swagsalesagent", ".env.template", "pnpm install", "pnpm db:migration:deploy", "pnpm db:migration:dev", "pnpm dev", "pnpm app:build", "bundle/swagsalesagent.zip", "app server", "local setup", "redis", "mysql"]
summary: "Local setup of the Shopware Sales Agent app server: clone swagsalesagent, .env from .env.template, pnpm install, migrate, dev/build, upload app zip."
lastBuilt: 2026-09-15
---
## What it is

Local installation steps for the Shopware Sales Agent app: running its app server from the `swagsalesagent` repository and connecting it to a Shopware instance as an app.

## When to use

When setting up the Sales Agent app server on a local machine for development, or building the app zip to install it in a Shopware shop.

## Key steps / config

Prerequisites: credentials for a MySQL database and a Redis cache layer.

1. Clone the repository:
   ```shell
   git clone https://github.com/shopware/swagsalesagent.git
   cd swagsalesagent
   ```
2. Create the env file from the template and fill in the required values (each property is explained in `.env.template`):
   ```shell
   cp .env.template .env
   ```
3. Install dependencies: `pnpm install --frozen-lockfile --prefer-offline`
4. Migrate the database — pick one:
   - `pnpm db:migration:deploy` — run existing migrations without creating new files.
   - `pnpm db:migration:dev` — run and create new migration files when the schema changed.
5. Run the development server: `pnpm dev`
6. Build for production: `pnpm build`
7. Connect to Shopware:
   - Build the app zip: `pnpm app:build`
   - Upload `bundle/swagsalesagent.zip` in the Shopware Extensions module.
   - Verify: a Sales Agent menu item appears under Settings.

## Essential identifiers

- Repository: `https://github.com/shopware/swagsalesagent.git`
- Env files: `.env`, `.env.template`
- Commands: `pnpm install --frozen-lockfile --prefer-offline`, `pnpm db:migration:deploy`, `pnpm db:migration:dev`, `pnpm dev`, `pnpm build`, `pnpm app:build`
- Build artifact: `bundle/swagsalesagent.zip`

## Gotchas

- `pnpm db:migration:dev` creates new migration files when schema changes exist; use `pnpm db:migration:deploy` to only apply existing ones.
- The Shopware extension upload accepts only zip files (mime type `application/zip`) and requires the `system.plugin_upload` ACL privilege.

## Code check (6.7.13.0)
- confirmed `api.extension.upload` — admin extension zip upload route used by the Extensions module — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:59
- confirmed `system.plugin_upload` — ACL privilege required for the upload route — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:60
- confirmed `application/zip` — uploaded file must have zip mime type — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:82
- unverified `swagsalesagent` — separate app repository, not part of vendor/shopware
- unverified `pnpm app:build` — app-server tooling, out of scope of the installed Shopware code
- unverified `.env.template` — lives in the app repository, out of scope
