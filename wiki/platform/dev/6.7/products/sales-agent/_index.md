---
id: platform/dev/6.7/products/sales-agent/_index.md
title: Sales Agent
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/
sourceHash: 5dff5c9ed6d07db67cfdb1790c45cd6ce6ef42cc
codeCheckedAgainst: "6.7.15.1"
keywords: ["sales agent", "swag-sales-agent", "sales representative", "nuxt", "nitro", "prisma", "redis", "pnpm", "shopware frontends", "beyond license", "evolve license", "b2b sales"]
summary: Sales Agent is a licensed standalone Nuxt app for sales reps working with Shopware 6.7.3+; needs Node 18+, pnpm 8+, MySQL and a Beyond or Evolve license.
lastBuilt: 2026-10-21
---
## What it is

Sales Agent is an application that streamlines communication and sales processes between sales representatives and their customers. It integrates with Shopware so sales reps can handle their tasks in an optimized environment without the overhead of the Shopware Administration. It is licensed and not available as open source.

It is not part of the default Storefront: it is a standalone frontend app running on a Nuxt instance, hosted separately under its own domain, different from the Storefront domain.

## When to use

When planning to install or integrate Sales Agent for a Shopware shop with a Beyond or Evolve license, or when you need its prerequisites and architecture.

## Key steps / config

1. Request access to the private GitLab repository by creating a support ticket in your Shopware Account. Access is granted after a short validation or after purchasing the Beyond or Evolve license.
2. Check the minimum requirements:
   - node >= v18
   - pnpm >= 8
   - Shopware Frontends framework based on Nuxt 3
   - a Shopware 6 instance, version 6.7.3 and above
   - MySQL database
   - Beyond or Evolve license on the Shopware instance
3. Use the Sales Agent API documentation (Stoplight, `swag-sales-agent`) for the available endpoints.

## Essential identifiers

Architecture components:

- **Frontend**: Vue.
- **Backend**: Nuxt, using Nitro as its server engine.
- **Database**: MySQL, accessed from Nuxt through Prisma.
- **Cache layer**: Redis; Nitro provides a caching system on top of its storage layer.

## Gotchas

- Separate deployment and domain from the Storefront — it does not run inside Shopware.
- Requires Shopware 6.7.3 or newer; the installed core here is 6.7.15.1.

## Code check (6.7.15.1)
- unverified `swag-sales-agent` — licensed standalone app, not in the installed core, storefront or administration code
- unverified `Shopware 6.7.3` — minimum version is a claim of the external app, not enforceable from vendor roots
