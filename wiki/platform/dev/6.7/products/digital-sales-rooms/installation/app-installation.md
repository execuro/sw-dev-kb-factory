---
id: platform/dev/6.7/products/digital-sales-rooms/installation/app-installation.md
title: Frontend app installation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/installation/app-installation.html
sourceHash: 6c225b550cc9db8bf0b76f09a36a735ab9b6baf4
codeCheckedAgainst: "6.7.15.1"
keywords: ["digital sales rooms", "dsr-frontends", "frontend template", "shopware frontends", "nuxt 3", ".env.template", "SHOPWARE_STORE_API_ACCESS_TOKEN", "SHOPWARE_ADMIN_API", "SHOPWARE_STORE_API", "ALLOW_ANONYMOUS_MERCURE", "pnpm", "api access key", "env file"]
summary: Run the Digital Sales Rooms frontend template (dsr-frontends, Nuxt 3) - copy .env.template, set Shopware API env vars, pnpm dev/build.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/_index.md"]
---
## What it is

Instructions for running the Digital Sales Rooms (DSR) frontend app after the DSR plugin is installed in Shopware. The frontend template is built on Shopware Frontends and inherits Shopware Frontends and Nuxt 3 concepts.

## When to use

After installing the Digital Sales Rooms plugin, when you need to run the frontend locally for development or build it for production and connect it to a Shopware instance.

## Key steps / config

1. Get the template from the plugin: `cd ./templates/dsr-frontends`. The folder holds the full frontend source; you can copy it into your own private repository for later customization.
2. Generate the env file: `cp .env.template .env`.
3. Set the env keys:

| Key | Required | Meaning |
|---|---|---|
| `ORIGIN` | Yes | Domain of the frontend app, e.g. `https://dsr.shopware.io` |
| `SHOPWARE_STOREFRONT_URL` | Yes | Default Shopware storefront domain, e.g. `https://shopware.store` |
| `SHOPWARE_ADMIN_API` | Yes | Admin API server, e.g. `https://shopware.store/admin-api` |
| `SHOPWARE_STORE_API` | Yes | Store API server, e.g. `https://shopware.store/store-api` |
| `SHOPWARE_STORE_API_ACCESS_TOKEN` | Yes | The `API access key` from the `API access` section of the sales channel that carries the DSR domain |
| `ALLOW_ANONYMOUS_MERCURE` | No | Development only; `1` means the app runs against unsecured Mercure |

```shell
ORIGIN=https://dsr.shopware.io
SHOPWARE_STOREFRONT_URL=https://shopware.store
SHOPWARE_ADMIN_API=https://shopware.store/admin-api
SHOPWARE_STORE_API=https://shopware.store/store-api
SHOPWARE_STORE_API_ACCESS_TOKEN=XXXXXXXXXXX
```

4. Development: `npm install -g pnpm`, `pnpm install`, `pnpm dev`. The dev server usually listens on port `3000` on localhost.
5. Production: `npm install -g pnpm`, `pnpm install`, `pnpm build`, then deploy (see [app deployment](platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/_index.md)).

After that, set up the third-party services (Daily.co video, Mercure realtime).

## Essential identifiers

- `./templates/dsr-frontends`
- `.env.template` / `.env`
- `ORIGIN`, `SHOPWARE_STOREFRONT_URL`, `SHOPWARE_ADMIN_API`, `SHOPWARE_STORE_API`, `SHOPWARE_STORE_API_ACCESS_TOKEN`, `ALLOW_ANONYMOUS_MERCURE`
- `pnpm dev`, `pnpm build`

## Gotchas

- `ALLOW_ANONYMOUS_MERCURE=1` is for development only; it runs the app with unsecured Mercure.
- The access token must come from the sales channel that has the Digital Sales Rooms domain assigned.

## Code check (6.7.15.1)
- confirmed `PlatformRequest::HEADER_ACCESS_KEY` — the store API access key is sent as the `sw-access-key` header — vendor/shopware/core/PlatformRequest.php:19
- confirmed `access_key` — sales channel field holding the store API access key (`accessKey`) — vendor/shopware/core/System/SalesChannel/SalesChannelDefinition.php:134
- unverified `SHOPWARE_STORE_API_ACCESS_TOKEN` — env var of the DSR frontend template, not part of the Shopware core packages
- unverified `ALLOW_ANONYMOUS_MERCURE` — DSR frontend env flag, not in the Shopware core packages
- unverified `./templates/dsr-frontends` — ships with the Digital Sales Rooms plugin, out of scope
