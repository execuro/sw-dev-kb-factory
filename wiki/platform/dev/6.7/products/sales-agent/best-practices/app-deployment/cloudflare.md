---
id: platform/dev/6.7/products/sales-agent/best-practices/app-deployment/cloudflare.md
title: Cloudflare
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/best-practices/app-deployment/cloudflare.html
sourceHash: bea0d8fc005f7b3c173da32205b4ee6c6711b4a4
codeCheckedAgainst: "6.7.13.0"
keywords: ["cloudflare pages", "wrangler", "npx nuxi build --preset=cloudflare_pages", "wrangler pages deploy dist/", "upstash", "CLOUDFLARE_API_TOKEN", "REDIS_HOST", "REDIS_TLS", ".npmrc", "github actions", "cloudflare/pages-action", "sales agent deployment", "custom domain"]
summary: "Deploy the Sales Agent Nuxt frontend to Cloudflare Pages with Upstash Redis, wrangler, nuxi build --preset=cloudflare_pages and a GitHub Actions workflow."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/sales-agent/installation.md"]
---
## What it is

Guide for deploying the Sales Agent frontend source code to Cloudflare Pages, with Upstash as Redis provider, either manually from a local machine via Wrangler or automatically via GitHub Actions.

## When to use

- Hosting the Sales Agent Nuxt app on Cloudflare Pages/Workers.
- Setting up a CI pipeline that builds the `.env` from GitHub variables and publishes to Cloudflare Pages.

## Key steps / config

Prerequisites: a Cloudflare account; frontend source code cloned and pushed to your GitHub repository.

Redis with Upstash (Cloudflare has no built-in Redis):

1. In the Upstash Console, "Create Database" in a region close to your users.
2. From the database details copy `REDIS_HOST` (e.g. `xxx.upstash.io`), `REDIS_PORT` (usually `6379`, or TLS port `6380`), `REDIS_PASSWORD`; set `REDIS_TLS` to `true`.
3. Add to `.env`: `REDIS_CACHE=true`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_TLS=true`.
4. Optional: Cloudflare Dashboard → Workers & Pages → project → Settings → Integrations → add the Upstash integration.

Deploy from a local machine:

1. `.npmrc` must contain `shamefully-hoist=true` and `strict-peer-dependencies=false` (Nuxt issue 28248).
2. `pnpm install wrangler --save-dev`
3. Ensure the app has a generated `.env` file (see [installation](platform/dev/6.7/products/sales-agent/installation.md)).
4. `npx nuxi build --preset=cloudflare_pages`
5. `wrangler pages deploy dist/` — the first run asks you to create a project.

GitHub Actions:

- GitHub Secret `CLOUDFLARE_API_TOKEN` (API token with "Cloudflare Pages — Edit" permission).
- GitHub environment `production` holding all variables from `.env.template` (more environments like `development`, `staging` possible).
- Workflow file `.github/workflows/publish.yml`, skeleton:

```yml
on: { push: { branches: [main] } }
jobs:
  publish:
    runs-on: ubuntu-latest
    permissions: { contents: read, deployments: write }
    environment: production
    steps:
      # checkout, pnpm/action-setup@v4 (version 8), pnpm install
      # build .env: COMPANY_NAME ORIGIN REDIS_* APP_NAME APP_SECRET DATABASE_URL from vars
      # npx nuxi build --preset=cloudflare_pages
      - uses: cloudflare/pages-action@v1.5.0
        with: { apiToken: "...", accountId: YOUR_ACCOUNT_ID, projectName: YOUR_PROJECT_NAME, directory: dist, wranglerVersion: "3" }
```

Replace `YOUR_ACCOUNT_ID` (visible in the Cloudflare dashboard URL) and `YOUR_PROJECT_NAME`. Custom domains are configured per Cloudflare's Pages custom-domains instructions.

## Essential identifiers

- `npx nuxi build --preset=cloudflare_pages`, `wrangler pages deploy dist/`, `pnpm install wrangler --save-dev`
- `CLOUDFLARE_API_TOKEN`, `cloudflare/pages-action@v1.5.0`, `.github/workflows/publish.yml`
- `REDIS_CACHE`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_TLS`
- `COMPANY_NAME`, `ORIGIN`, `APP_NAME`, `APP_SECRET`, `DATABASE_URL`

## Gotchas

- Without `shamefully-hoist=true` / `strict-peer-dependencies=false` in `.npmrc` the build hits a known Nuxt issue.
- The sample pipeline is explicitly only a sample and must be adapted.

## Code check (6.7.13.0)
- unverified `REDIS_HOST` — env var of the separate Sales Agent Nuxt app; grep over vendor/shopware found nothing
- unverified `cloudflare_pages` — Nuxt/Nitro build preset, outside vendor/shopware (grep found nothing)
- unverified `CLOUDFLARE_API_TOKEN` — GitHub/Cloudflare CI secret, not Shopware code
- unverified `DATABASE_URL` — Prisma database URL of the Sales Agent app, out of scope of installed Shopware packages
