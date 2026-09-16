---
id: platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/cloudflare.md
title: Cloudflare
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/best-practices/app-deployment/cloudflare.html
sourceHash: 8ddad3cae6ac3133e81c68a13d0ec91a6e65e5c9
codeCheckedAgainst: "6.7.13.0"
keywords: ["cloudflare pages", "digital sales rooms", "dsr", "wrangler", "wrangler pages deploy", "npx nuxi build --preset=cloudflare_pages", "CLOUDFLARE_API_TOKEN", "SHOPWARE_STORE_API", "SHOPWARE_STORE_API_ACCESS_TOKEN", "github actions", "cloudflare/pages-action", ".npmrc", "shamefully-hoist", "sales channel domain"]
summary: Deploy the Digital Sales Rooms Nuxt frontend to Cloudflare Pages via wrangler or a GitHub Actions pipeline using cloudflare/pages-action.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/installation/app-installation.md", "platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md"]
---
## What it is

A deployment recipe for the Digital Sales Rooms (DSR) Nuxt frontend app on Cloudflare Pages: a manual deploy from a local machine with Wrangler, and an automated deploy through GitHub Actions.

## When to use

You host the DSR frontend app on Cloudflare Pages, either once from your machine or continuously from a GitHub repository.

## Key steps / config

Prerequisites: a Cloudflare account; the frontend source taken from `/templates/dsr-frontends` in the extracted DSR plugin zip, pushed to your GitHub repository.

Deploy from local machine:

1. Because of a Nuxt issue (nuxt/nuxt#28248), set in `.npmrc`:
   ```bash
   shamefully-hoist=true
   strict-peer-dependencies=false
   ```
2. Install Wrangler: `pnpm install wrangler --save-dev`
3. Make sure the app already has its generated `.env` file ([app installation](platform/dev/6.7/products/digital-sales-rooms/installation/app-installation.md)).
4. Build: `npx nuxi build --preset=cloudflare_pages`
5. Deploy: `wrangler pages deploy dist/` — the first run asks you to create a project.

Automation with GitHub Actions:

1. GitHub Secrets: add `CLOUDFLARE_API_TOKEN` (a Cloudflare API token with the "Cloudflare Pages — Edit" permission).
2. GitHub environment `production` (optionally also `development`, `staging`) with variables `SHOPWARE_STORE_API`, `SHOPWARE_ADMIN_API`, `SHOPWARE_STORE_API_ACCESS_TOKEN`, `SHOPWARE_STOREFRONT_URL`, `ORIGIN`.
3. Create `.github/workflows/publish.yml` (sample only, adapt it). Skeleton:
   ```yml
   on: { push: { branches: [main] } }
   jobs:
     publish:
       environment: production
       permissions: { contents: read, deployments: write }
       steps:
         # actions/checkout@v3, pnpm/action-setup@v4 (version 8), pnpm install
         # write .env from ${{ vars.SHOPWARE_STORE_API }} ... ${{ vars.ORIGIN }}
         # npx nuxi build --preset=cloudflare_pages
         - uses: cloudflare/pages-action@v1.5.0
           with: { apiToken: "${{ secrets.CLOUDFLARE_API_TOKEN }}", accountId: YOUR_ACCOUNT_ID, projectName: YOUR_PROJECT_NAME, directory: dist, wranglerVersion: '3' }
   ```
4. Replace `YOUR_ACCOUNT_ID` (visible in the Cloudflare dashboard URL, the segment before `/pages`) and `YOUR_PROJECT_NAME`.

Afterwards, optionally attach a custom domain in Cloudflare Pages, then register the frontend domain as the [sales channel domain](platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md) (a `sales_channel_domain` entry in core).

## Essential identifiers

- `npx nuxi build --preset=cloudflare_pages`, `wrangler pages deploy dist/`
- `CLOUDFLARE_API_TOKEN`, `cloudflare/pages-action@v1.5.0`, `.github/workflows/publish.yml`
- `SHOPWARE_STORE_API`, `SHOPWARE_ADMIN_API`, `SHOPWARE_STORE_API_ACCESS_TOKEN`, `SHOPWARE_STOREFRONT_URL`, `ORIGIN`
- `/templates/dsr-frontends`

## Gotchas

- Without `shamefully-hoist=true` and `strict-peer-dependencies=false` in `.npmrc` the build hits the referenced Nuxt issue.
- The build output directory is `dist`; the workflow's `directory` must match.
- The sample workflow runs `cat .env`, which prints the env values (including the access token) into the job log.

## Code check (6.7.13.0)
- unverified `SHOPWARE_STORE_API` — DSR frontend app env var, not present in vendor/shopware core/storefront/administration
- unverified `SHOPWARE_STORE_API_ACCESS_TOKEN` — DSR frontend app env var, outside the installed Shopware packages
- unverified `SHOPWARE_STOREFRONT_URL` — DSR frontend app env var, outside the installed Shopware packages
- unverified `CLOUDFLARE_API_TOKEN` — GitHub/Cloudflare secret, out of scope
- unverified `npx nuxi build --preset=cloudflare_pages` — Nuxt tooling, out of scope
- unverified `wrangler pages deploy dist/` — Cloudflare CLI, out of scope
- unverified `/templates/dsr-frontends` — ships inside the DSR plugin zip, not in vendor/shopware
- confirmed `sales_channel_domain` — entity name of SalesChannelDomainDefinition — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:31
