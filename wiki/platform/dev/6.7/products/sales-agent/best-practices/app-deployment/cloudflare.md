---
id: platform/dev/6.7/products/sales-agent/best-practices/app-deployment/cloudflare.md
title: Cloudflare
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/best-practices/app-deployment/cloudflare.html
sourceHash: bea0d8fc005f7b3c173da32205b4ee6c6711b4a4
codeCheckedAgainst: "6.7.15.1"
keywords: ["sales agent", "cloudflare pages", "cloudflare", "wrangler", "upstash", "redis", "nuxi build --preset=cloudflare_pages", "wrangler pages deploy dist/", "CLOUDFLARE_API_TOKEN", "github actions", "cloudflare/pages-action", ".npmrc", "shamefully-hoist", "deploy"]
summary: Deploy the Sales Agent frontend to Cloudflare Pages with Upstash Redis, Wrangler, a cloudflare_pages Nuxt build and an optional GitHub Actions pipeline.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/sales-agent/installation.md"]
---
## What it is

A deployment guide for hosting the Sales Agent frontend source code on Cloudflare Pages, covering Redis via Upstash, a manual deploy with Wrangler, and an automated deploy with GitHub Actions.

## When to use

Use it when the Sales Agent frontend should run on Cloudflare Pages/Workers. These provide no built-in Redis, so the source recommends Upstash, which integrates natively with Cloudflare.

## Key steps / config

Prerequisites: a Cloudflare account; the frontend source cloned and pushed to your GitHub repository.

**Upstash Redis:** in the Upstash Console click "Create Database", pick a region close to your users, then copy the connection details from the database page into `.env`:

```bash
REDIS_CACHE=true
REDIS_HOST=your-database.upstash.io
REDIS_PORT=6379          # or TLS port 6380
REDIS_PASSWORD=your_upstash_password
REDIS_TLS=true
```

Optionally, connect Upstash in the Cloudflare Dashboard instead: Workers & Pages → your project → Settings → Integrations → add the Upstash integration.

**Deploy from a local machine:**

1. Because of a Nuxt issue (nuxt/nuxt #28248), put `shamefully-hoist=true` and `strict-peer-dependencies=false` in `.npmrc`.
2. `pnpm install wrangler --save-dev`
3. Make sure the app already has a generated `.env` file (see [installation](platform/dev/6.7/products/sales-agent/installation.md)).
4. `npx nuxi build --preset=cloudflare_pages`
5. `wrangler pages deploy dist/` — the first run asks you to create a project.

**GitHub Actions automation:**

- Add the GitHub secret `CLOUDFLARE_API_TOKEN` (an API token with the "Cloudflare Pages — Edit" permission).
- Create a GitHub environment `production` holding all variables from `.env.template`; other environments (`development`, `staging`) can carry different values for the same names.
- Add `.github/workflows/publish.yml`. Skeleton:

```yml
on: { push: { branches: [main] } }
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions: { contents: read, deployments: write }
    environment: production
    steps:
      # checkout, pnpm/action-setup@v4, pnpm install,
      # write .env from vars.* (COMPANY_NAME, ORIGIN, REDIS_*, APP_NAME, APP_SECRET, DATABASE_URL)
      - run: npx nuxi build --preset=cloudflare_pages
      - uses: cloudflare/pages-action@v1.5.0
        with: { apiToken: "${{ secrets.CLOUDFLARE_API_TOKEN }}", accountId: YOUR_ACCOUNT_ID, projectName: YOUR_PROJECT_NAME, directory: dist, wranglerVersion: "3" }
```

Replace `YOUR_ACCOUNT_ID` (visible in the dashboard URL, `https://dash.cloudflare.com/<ACCOUNT_ID>/pages`) and `YOUR_PROJECT_NAME`.

**Custom domain:** point custom domains or subdomains at the Pages project per Cloudflare's Pages custom-domain instructions.

## Essential identifiers

- CLI: `pnpm install wrangler --save-dev`, `npx nuxi build --preset=cloudflare_pages`, `wrangler pages deploy dist/`
- Secret: `CLOUDFLARE_API_TOKEN`; action: `cloudflare/pages-action@v1.5.0`
- Env vars: `REDIS_CACHE`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_TLS`, `COMPANY_NAME`, `ORIGIN`, `APP_NAME`, `APP_SECRET`, `DATABASE_URL`
- Files: `.npmrc`, `.env`, `.env.template`, `.github/workflows/publish.yml`

## Gotchas

- The workflow is explicitly a sample; adapt the trigger branch, environment name and account/project values.
- Without the `.npmrc` hoisting settings the build is affected by the referenced Nuxt issue.

## Code check (6.7.15.1)
- unverified `REDIS_CACHE` — Sales Agent frontend app env var; not present in vendor/shopware core, storefront or administration
- unverified `REDIS_HOST` — Sales Agent frontend app env var; not present in vendor/shopware core, storefront or administration
- unverified `REDIS_TLS` — Sales Agent frontend app env var; not present in vendor/shopware core, storefront or administration
- unverified `CLOUDFLARE_API_TOKEN` — GitHub secret for Cloudflare tooling, out of scope for vendor/shopware
- unverified `wrangler pages deploy dist/` — Cloudflare CLI, out of scope for vendor/shopware
- unverified `npx nuxi build --preset=cloudflare_pages` — Nuxt CLI, out of scope for vendor/shopware
