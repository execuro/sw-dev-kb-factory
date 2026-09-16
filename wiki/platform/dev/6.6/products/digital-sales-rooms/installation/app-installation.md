---
id: platform/dev/6.6/products/digital-sales-rooms/installation/app-installation.md
title: Frontend app installation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/digital-sales-rooms/installation/app-installation.html
sourceHash: e44410cf880b6e6972f48161c061b994de3a6a90
keywords: ["digital sales rooms", "DSR", "frontend app installation", "dsr-frontends", "Shopware Frontends", "Nuxt 3", ".env.template", "SHOPWARE_STORE_API_ACCESS_TOKEN", "pnpm dev", "pnpm build", "ORIGIN", "ALLOW_ANONYMOUS_MERCURE"]
summary: "How to get, configure via .env, and run/build the Digital Sales Rooms Nuxt 3 frontend template (dsr-frontends)."
relatedPages: ["platform/dev/6.6/products/digital-sales-rooms/best-practices/app-deployment/_index.md"]
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to get, configure and run the Digital Sales Rooms (DSR) frontend template after the plugin itself has been installed in Shopware. The template is built on the Shopware Frontends framework and inherits from Shopware Frontends and Nuxt 3 concepts, so it must be run as its own Node application separate from the Shopware backend.

## When to use

Follow this after completing the admin-side plugin installation, when you need to stand up and connect the separate DSR frontend application — either for local development or for a production build.

## Key steps / config

1. Get the frontend template: inside the DSR plugin, the source lives under `./templates/dsr-frontends`; copy this folder and push it to your own private repository for future customization.
2. Generate the environment file by copying the template: `cp .env.template .env`. The `.env` file defines:
   - `ORIGIN` — the frontend app's own domain, e.g. `https://dsr.shopware.io`.
   - `SHOPWARE_STOREFRONT_URL` — the Shopware storefront domain, e.g. `https://shopware.store`.
   - `SHOPWARE_ADMIN_API` — the Shopware admin-api domain, e.g. `https://shopware.store/admin-api`.
   - `SHOPWARE_STORE_API` — the Shopware store-api domain, e.g. `https://shopware.store/store-api`.
   - `SHOPWARE_STORE_API_ACCESS_TOKEN` — the API access key copied from the sales channel's "API access" section.
   - `ALLOW_ANONYMOUS_MERCURE` — development-only flag; when set to `1` the app runs with unsecured Mercure.
3. For development: install pnpm globally (`npm install -g pnpm`), run `pnpm install`, then `pnpm dev`. The dev server listens on port 3000 by default.
4. For production: install pnpm globally, run `pnpm install`, then build with `pnpm build`.

## Essential identifiers

- `dsr-frontends` — the frontend template folder inside the DSR plugin.
- `.env.template` / `.env` — the environment configuration files.
- `ORIGIN`, `SHOPWARE_STOREFRONT_URL`, `SHOPWARE_ADMIN_API`, `SHOPWARE_STORE_API`, `SHOPWARE_STORE_API_ACCESS_TOKEN`, `ALLOW_ANONYMOUS_MERCURE` — the required/optional env keys.
- `pnpm install`, `pnpm dev`, `pnpm build` — the pnpm commands used to run and build the app.

## Gotchas

`ALLOW_ANONYMOUS_MERCURE=1` disables Mercure security and is intended for development only.

After building the app, see the deployment page (`platform/dev/6.6/products/digital-sales-rooms/best-practices/app-deployment/_index.md`) for how to deploy the production build.
