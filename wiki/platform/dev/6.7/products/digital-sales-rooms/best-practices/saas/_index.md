---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/products/digital-sales-rooms/best-practices/saas/_index.md
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/_index.md", "platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/_index.md", "platform/dev/6.7/products/digital-sales-rooms/configuration/_index.md"]
sourceHash: 88ddd6688ac5cd971c102ddbbbf50fe564a1783c
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/best-practices/saas/
title: SaaS
version: "6.7"
versions: ["6.7"]
keywords: ["digital sales rooms", "dsr", "saas", "beyond merchant", "marketing menu", "frontend app deployment", "3rd party setup", "configuration", "cloud"]
summary: "Digital Sales Rooms on SaaS: plugin is preinstalled for Beyond merchants; still deploy the frontend app, set up 3rd parties and configure the plugin."
lastBuilt: 2026-09-15
---
## What it is

Checklist for running Digital Sales Rooms (DSR) on a Shopware SaaS instance. For *Beyond merchants* on SaaS, the DSR plugin is already installed, so a *Digital Sales Rooms* section appears under the Marketing menu item in the Administration.

## When to use

You are a Beyond merchant on SaaS and see the Digital Sales Rooms section, but DSR does not yet work end to end.

## Key steps / config

The plugin being installed is not enough; complete these steps for DSR to function fully with SaaS:

1. Deploy the frontend app — [Frontend App Deployment](platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/_index.md).
2. Set up the required 3rd-party services — [3rd parties](platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/_index.md).
3. Configure the plugin — [Configuration](platform/dev/6.7/products/digital-sales-rooms/configuration/_index.md).

## Code check (6.7.13.0)
- unverified `Digital Sales Rooms` — commercial plugin preinstalled on SaaS; no DSR code in vendor/shopware core, storefront or administration
