---
id: platform/dev/6.7/products/digital-sales-rooms/installation/app-installation.md
title: Frontend app installation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/installation/app-installation.html
sourceHash: 6c225b550cc9db8bf0b76f09a36a735ab9b6baf4
codeCheckedAgainst: "6.7.13.0"
keywords: ["dsr-frontends", "digital sales rooms", "SHOPWARE_STORE_API_ACCESS_TOKEN", "SHOPWARE_ADMIN_API", "SHOPWARE_STORE_API", "SHOPWARE_STOREFRONT_URL", "ORIGIN", "ALLOW_ANONYMOUS_MERCURE", ".env.template", "pnpm dev", "pnpm build", "shopware frontends", "nuxt 3"]
summary: Set up the Digital Sales Rooms frontend (dsr-frontends, Nuxt 3/Shopware Frontends) - .env keys, sales channel access key, pnpm dev and pnpm build.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/_index.md"]
---
## What it is

How to run the Digital Sales Rooms frontend template and connect it to Shopware after the plugin is installed. The template is built on the Shopware Frontends framework and therefore follows Shopware Frontends and Nuxt 3 concepts.

## When to use

After the admin-side plugin installation, when you need the DSR frontend running locally for development or built for production.

## Key steps / config

1. **Get the template** — it ships inside the Digital Sales Rooms plugin at `./templates/dsr-frontends` (`cd ./templates/dsr-frontends`). Copy the whole source into your own private repository for later customization.
2. **Generate the env file**: `cp .env.template .env`

| Key | Required | Meaning |
|---|---|---|
| `ORIGIN` | yes | Domain of the frontend app |
| `SHOPWARE_STOREFRONT_URL` | yes | Default Shopware storefront domain |
| `SHOPWARE_ADMIN_API` | yes | Shopware Admin API server URL |
| `SHOPWARE_STORE_API` | yes | Shopware Store API server URL |
| `SHOPWARE_STORE_API_ACCESS_TOKEN` | yes | API access key of the sales channel assigned the DSR domain (sales channel, section "API access") |
| `ALLOW_ANONYMOUS_MERCURE` | no | Development only; `1` runs with unsecured Mercure |

```shell
ORIGIN=https://dsr.shopware.io
SHOPWARE_STOREFRONT_URL=https://shopware.store
SHOPWARE_ADMIN_API=https://shopware.store/admin-api
SHOPWARE_STORE_API=https://shopware.store/store-api
SHOPWARE_STORE_API_ACCESS_TOKEN=XXXXXXXXXXX
```

3. **Development**: `npm install -g pnpm`, `pnpm install`, `pnpm dev`. The dev server usually listens on port `3000` on localhost.
4. **Production**: `npm install -g pnpm`, `pnpm install`, `pnpm build`, then deploy (see [app deployment](platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/_index.md)).
5. Next, set up the 3rd-party services (Daily.co video, Mercure realtime).

## Essential identifiers

- `templates/dsr-frontends`, `.env.template`, `.env`
- `ORIGIN`, `SHOPWARE_STOREFRONT_URL`, `SHOPWARE_ADMIN_API`, `SHOPWARE_STORE_API`, `SHOPWARE_STORE_API_ACCESS_TOKEN`, `ALLOW_ANONYMOUS_MERCURE`
- `pnpm install`, `pnpm dev`, `pnpm build`

## Gotchas

- `ALLOW_ANONYMOUS_MERCURE=1` is for development only — it disables Mercure security.
- The access token is the sales channel's store-API access key, not an admin integration key. Shopware sends it as the `sw-access-key` header.
- The example `SHOPWARE_ADMIN_API` value ends in `/admin-api`, but core Admin API routes in 6.7 sit under `/api` (e.g. `/api/oauth/token`). Check which base URL the frontend expects for your setup.

## Code check (6.7.13.0)
- confirmed `accessKey` — sales channel field "Access key to store api." backing the API access key — vendor/shopware/core/System/SalesChannel/SalesChannelDefinition.php:131
- confirmed `sw-access-key` — header carrying the store-API access key — vendor/shopware/core/PlatformRequest.php:19
- confirmed `/store-api` — Store API base path — vendor/shopware/core/Framework/Api/ApiDefinition/Generator/OpenApi/OpenApiSchemaBuilder.php:31
- confirmed `/api/oauth/token` — core Admin API routes use the `/api` prefix — vendor/shopware/core/Framework/Api/Controller/AuthController.php:33
- unverified `/admin-api` — docs example for SHOPWARE_ADMIN_API; no core route with this prefix found, may be proxy-specific
- unverified `SHOPWARE_STORE_API_ACCESS_TOKEN` — env var of the DSR frontend app, outside vendor/shopware
- unverified `ALLOW_ANONYMOUS_MERCURE` — env var of the DSR frontend app, outside vendor/shopware
- unverified `templates/dsr-frontends` — ships in the licensed plugin, not installed in vendor/shopware
