---
id: platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/cloudflare.md
title: Cloudflare
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/best-practices/app-deployment/cloudflare.html
sourceHash: 8ddad3cae6ac3133e81c68a13d0ec91a6e65e5c9
codeCheckedAgainst: "6.7.15.1"
keywords: ["cloudflare pages", "cloudflare", "wrangler", "digital sales rooms", "dsr", "npx nuxi build --preset=cloudflare_pages", "wrangler pages deploy dist/", "CLOUDFLARE_API_TOKEN", "github actions", "SHOPWARE_STORE_API", "shamefully-hoist", ".npmrc", "sales channel domain"]
summary: Deploy the Digital Sales Rooms frontend to Cloudflare Pages with wrangler or a GitHub Actions workflow, using the cloudflare_pages Nuxt preset.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/installation/app-installation.md", "platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md"]
---
## What it is

How to deploy the Digital Sales Rooms (DSR) Nuxt frontend to Cloudflare Pages. You can deploy by hand from a local machine with Wrangler, or automatically with a GitHub Actions pipeline.

## When to use

Use this when you host the DSR frontend on Cloudflare Pages instead of AWS Amplify or a self-managed Node.js server.

## Key steps / config

Prerequisites: a Cloudflare account, and the frontend source in your GitHub repository. The source is in the plugin zip under `/templates/dsr-frontends`.

**Deploy from a local machine**

1. Because of Nuxt issue 28248 (`https://github.com/nuxt/nuxt/issues/28248`), make sure `.npmrc` contains:
   ```bash
   shamefully-hoist=true
   strict-peer-dependencies=false
   ```
2. Install Wrangler with `pnpm install wrangler --save-dev`.
3. Generate the `.env` file first. See [app installation](platform/dev/6.7/products/digital-sales-rooms/installation/app-installation.md).
4. Build with `npx nuxi build --preset=cloudflare_pages`.
5. Deploy with `wrangler pages deploy dist/`. The first run asks you to create a project.

**Automation with GitHub Actions**

- GitHub Secret `CLOUDFLARE_API_TOKEN`: a Cloudflare API token with the "Cloudflare Pages — Edit" permission.
- GitHub environment `production` with the variables `SHOPWARE_STORE_API`, `SHOPWARE_ADMIN_API`, `SHOPWARE_STORE_API_ACCESS_TOKEN`, `SHOPWARE_STOREFRONT_URL` and `ORIGIN`. You can add more environments (`development`, `staging`) that use the same variable names.
- Workflow file `.github/workflows/publish.yml`, skeleton:

```yml
on: { push: { branches: [main] } }
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions: { contents: read, deployments: write }
    environment: production
    steps:
      # actions/checkout@v3, pnpm/action-setup@v4 (version 8), pnpm install
      # build .env from vars.SHOPWARE_* and vars.ORIGIN
      # npx nuxi build --preset=cloudflare_pages
      - uses: cloudflare/pages-action@v1.5.0
        with: { apiToken: ..., accountId: YOUR_ACCOUNT_ID, projectName: YOUR_PROJECT_NAME, directory: dist, wranglerVersion: '3' }
```

- Replace `YOUR_ACCOUNT_ID` with the account ID from the dashboard URL (`https://dash.cloudflare.com/<ACCOUNT_ID>/pages`). Replace `YOUR_PROJECT_NAME` with your project name.

**After deployment:** set a custom domain by following Cloudflare's Pages custom-domain guide. Then register the frontend domain as a [sales channel domain](platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md).

## Essential identifiers

- `npx nuxi build --preset=cloudflare_pages`, `wrangler pages deploy dist/`
- `CLOUDFLARE_API_TOKEN`, `cloudflare/pages-action@v1.5.0`, `.github/workflows/publish.yml`
- `SHOPWARE_STORE_API`, `SHOPWARE_ADMIN_API`, `SHOPWARE_STORE_API_ACCESS_TOKEN`, `SHOPWARE_STOREFRONT_URL`, `ORIGIN`

## Gotchas

- The `.npmrc` settings `shamefully-hoist=true` and `strict-peer-dependencies=false` are a workaround for the linked Nuxt issue.
- The workflow is only a sample. Adjust the trigger branch, environment name, account ID and project name for your setup.

## Code check (6.7.15.1)
- unverified `SHOPWARE_STORE_API` — env var read by the DSR Nuxt frontend, not by vendor/shopware code
- unverified `SHOPWARE_ADMIN_API` — DSR frontend env var, not referenced in vendor/shopware
- unverified `cloudflare_pages` — Nuxt/Nitro build preset, out of scope for vendor/shopware
- unverified `CLOUDFLARE_API_TOKEN` — GitHub/Cloudflare secret, out of scope for vendor/shopware
- confirmed `PlatformRequest::HEADER_ACCESS_KEY` — the Store API access token is sent as the `sw-access-key` header — vendor/shopware/core/PlatformRequest.php:19
- confirmed `SalesChannelDomainDefinition::ENTITY_NAME` — the sales channel domain is the `sales_channel_domain` entity — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:34
