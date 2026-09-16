---
id: platform/dev/6.6/products/digital-sales-rooms/best-practices/app-deployment/cloudflare.md
title: Cloudflare
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/digital-sales-rooms/best-practices/app-deployment/cloudflare.html
sourceHash: 8ddad3cae6ac3133e81c68a13d0ec91a6e65e5c9
keywords: ["Cloudflare Pages", "Digital Sales Rooms", "DSR", "Wrangler", "nuxi build", "GitHub Actions", "CLOUDFLARE_API_TOKEN", "SHOPWARE_STORE_API", "SHOPWARE_ADMIN_API", "SHOPWARE_STOREFRONT_URL", "ORIGIN", "custom domain", "sales channel domain"]
summary: "Deploying the Digital Sales Rooms frontend to Cloudflare Pages, manually via Wrangler or automated with GitHub Actions."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.6/products/digital-sales-rooms/installation/app-installation.md", "platform/dev/6.6/products/digital-sales-rooms/configuration/domain-config.md"]
---
## What it is
Steps for deploying the Digital Sales Rooms frontend source code to Cloudflare Pages, either manually from a local machine or automated via GitHub Actions.

## When to use
Use this when Cloudflare Pages is the chosen hosting target for the DSR frontend app, whether deploying once from a local machine or setting up a repeatable CI pipeline.

## Key steps / config
Local deployment:
1. Clone the frontend source code (inside `/templates/dsr-frontends` after extracting the plugin zip) and push it to a Git repository.
2. Ensure `.npmrc` contains:

```text
shamefully-hoist=true
strict-peer-dependencies=false
```

3. Install Wrangler: `pnpm install wrangler --save-dev`
4. Make sure the frontend app has an [.env file generated](platform/dev/6.6/products/digital-sales-rooms/installation/app-installation.md).
5. Build for Cloudflare Pages: `npx nuxi build --preset=cloudflare_pages`
6. Deploy: `wrangler pages deploy dist/` (first run prompts you to create a project).

GitHub Actions automation:
- Add a `CLOUDFLARE_API_TOKEN` GitHub secret (created in the Cloudflare dashboard with "Cloudflare Pages — Edit" permission).
- Create a GitHub environment named `production` (and optionally `development`/`staging`) with variables `SHOPWARE_STORE_API`, `SHOPWARE_ADMIN_API`, `SHOPWARE_STORE_API_ACCESS_TOKEN`, `SHOPWARE_STOREFRONT_URL`, `ORIGIN`.
- Add a `.github/workflows/publish.yml` workflow that checks out the repo, installs pnpm/dependencies, writes the `.env` file from the variables, runs `npx nuxi build --preset=cloudflare_pages`, and publishes via the `cloudflare/pages-action` action using `apiToken`, `accountId`, and `projectName`.
7. Point a custom domain/subdomain at the Pages project (per Cloudflare's own custom-domains guide).
8. Use the resulting domain to configure the [sales channel domain](platform/dev/6.6/products/digital-sales-rooms/configuration/domain-config.md).

## Essential identifiers
- `CLOUDFLARE_API_TOKEN`
- `SHOPWARE_STORE_API`, `SHOPWARE_ADMIN_API`, `SHOPWARE_STORE_API_ACCESS_TOKEN`, `SHOPWARE_STOREFRONT_URL`, `ORIGIN`
- `wrangler pages deploy dist/`
- `npx nuxi build --preset=cloudflare_pages`

## Gotchas
- The `.github/workflows/publish.yml` sample the source shows is explicitly noted as just a sample; several parts need updating for the specific use case before it can be relied on.
