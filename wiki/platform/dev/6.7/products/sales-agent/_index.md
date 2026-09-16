---
id: platform/dev/6.7/products/sales-agent/_index.md
title: Sales Agent
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/
sourceHash: 5dff5c9ed6d07db67cfdb1790c45cd6ce6ef42cc
codeCheckedAgainst: "6.7.13.0"
keywords: ["sales agent", "sales representative app", "shopware frontends", "nuxt 3", "nitro", "prisma", "redis cache", "mysql", "pnpm", "beyond license", "evolve license", "swag-sales-agent"]
summary: "Sales Agent: licensed standalone Nuxt 3 frontend app for sales reps on Shopware 6.7.3+; needs node 18, pnpm 8, MySQL, Redis, Beyond/Evolve license."
lastBuilt: 2026-09-15
---
## What it is

Sales Agent is a licensed (not open source) application that lets sales representatives handle communication and sales tasks with their customers against a Shopware instance, without using the Shopware Administration. It is a standalone frontend app running on a Nuxt instance, built on the Shopware Frontends framework — it is not part of the default Storefront and is hosted on its own domain, separate from the Storefront domain.

## When to use

- Evaluating or setting up a dedicated sales-representative tool on top of Shopware 6.7.
- Checking prerequisites and architecture before installing or deploying Sales Agent.

## Key steps / config

Access: the code lives in a private GitLab repository. Request access via a support ticket in the Shopware Account; access is granted after validation or purchase of a Beyond or Evolve license.

Prerequisites:

- node >= v18
- pnpm >= 8
- Shopware Frontends framework based on Nuxt 3
- Shopware 6 instance, version 6.7.3 and above
- Database: MySQL
- Beyond or Evolve license on the Shopware instance

API documentation for the app's endpoints is published on Stoplight under `swag-sales-agent`.

Architecture:

- Frontend: Vue
- Backend: Nuxt with Nitro as server engine
- Database: MySQL, accessed from Nuxt through Prisma
- Cache layer: Redis, via Nitro's caching system built on its storage layer

## Gotchas

- Sales Agent is a separate Nuxt deployment with its own domain; it does not extend or theme the Storefront.
- Requires a Beyond or Evolve license — not available in lower plans.

## Version notes

- Minimum Shopware version stated by the source: 6.7.3.

## Code check (6.7.13.0)
- unverified `Sales Agent` — licensed standalone Nuxt app, no code under vendor/shopware core, storefront or administration (grep for sales agent found nothing)
- unverified `Beyond or Evolve license` — license tiers are not represented in the installed core code
- unverified `6.7.3 and above` — minimum version is a product requirement of the separate app, not checkable in core
- unverified `swag-sales-agent` — API lives in the licensed app, out of scope of the installed Shopware packages
