---
id: platform/dev/6.7/products/sales-agent/installation.md
title: Local installation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/installation.html
sourceHash: 6bdcae10d380e5edda8c7c3407eaeb3dc0affbfc
codeCheckedAgainst: "6.7.15.1"
keywords: ["sales agent", "swagsalesagent", "local installation", ".env.template", "pnpm install", "pnpm db:migration:deploy", "pnpm db:migration:dev", "pnpm dev", "pnpm app:build", "bundle/swagsalesagent.zip", "mysql", "redis", "app server"]
summary: Local setup of the Sales Agent app server (MySQL, Redis, pnpm, migrations) and connecting it to Shopware by uploading bundle/swagsalesagent.zip.
lastBuilt: 2026-10-21
---
## What it is

Step-by-step local installation of the Sales Agent app server from the `swagsalesagent` repository, and how to connect the built app to a Shopware instance.

## When to use

When setting up the Sales Agent for local development or building it for production and installing it in a shop.

## Key steps / config

**Prepare** — obtain credentials for a MySQL database and a Redis cache layer.

**Set up the app server**

```shell
git clone https://github.com/shopware/swagsalesagent.git
cd swagsalesagent
cp .env.template .env
pnpm install --frozen-lockfile --prefer-offline
```

Fill in the required values in `.env`; every property is explained in `.env.template`.

**Migrate the database** — pick one:

- `pnpm db:migration:deploy` — execute existing migrations without creating new files.
- `pnpm db:migration:dev` — execute migrations and create new migration files if there are schema changes.

**Run / build**

- `pnpm dev` — development server.
- `pnpm build` — build code for production.

**Connect the app to Shopware**

1. Build the app zip: `pnpm app:build`.
2. Upload `bundle/swagsalesagent.zip` in the Shopware Administration under Extensions.
3. Verify: after installation a Sales Agent menu item appears in the Settings.

## Essential identifiers

- `.env.template` / `.env` — app server configuration
- `pnpm db:migration:deploy`, `pnpm db:migration:dev` — database migrations
- `pnpm dev`, `pnpm build`, `pnpm app:build` — run, build, package
- `bundle/swagsalesagent.zip` — app archive to upload

## Gotchas

- Use `pnpm db:migration:deploy` when you only want to apply existing migrations; `pnpm db:migration:dev` also generates new migration files on schema changes.
- MySQL and Redis credentials are required before the `.env` can be completed.

## Code check (6.7.15.1)
- confirmed `/api/_action/extension/upload` — Admin API route backing the extension zip upload in Extensions — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:58
- confirmed `system.plugin_upload` — ACL privilege required by the upload route — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:60
- unverified `swagsalesagent` — separate Sales Agent app repository, not in the installed core, storefront or administration packages
- unverified `pnpm app:build` — script of the Sales Agent repository, out of scope
- unverified `pnpm db:migration:deploy` — script of the Sales Agent repository, out of scope
- unverified `.env.template` — file of the Sales Agent repository, out of scope
