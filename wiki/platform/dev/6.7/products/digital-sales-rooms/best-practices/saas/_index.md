---
id: platform/dev/6.7/products/digital-sales-rooms/best-practices/saas/_index.md
title: SaaS
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/best-practices/saas/
sourceHash: 88ddd6688ac5cd971c102ddbbbf50fe564a1783c
codeCheckedAgainst: "6.7.15.1"
keywords: ["saas", "shopware saas", "beyond merchant", "digital sales rooms", "dsr", "marketing menu", "frontend app deployment", "3rd party setup", "dsr configuration", "cloud"]
summary: Digital Sales Rooms on SaaS. The plugin is preinstalled for Beyond merchants; you still deploy the frontend, set up 3rd parties and configure it.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/_index.md", "platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/_index.md", "platform/dev/6.7/products/digital-sales-rooms/configuration/_index.md"]
---
## What it is

Notes on running Digital Sales Rooms (DSR) on Shopware SaaS. For *Beyond merchants* on SaaS, the DSR plugin is already installed in the SaaS instance. The *Digital Sales Rooms* section appears under the **Marketing** menu item in the Administration.

## When to use

Read this if you are a Beyond merchant on SaaS and need DSR to work fully, beyond what the preinstalled plugin provides.

## Key steps / config

The plugin is preinstalled, but you still have to complete these steps yourself:

1. Deploy the frontend app. See [frontend app deployment](platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/_index.md).
2. Set up the 3rd-party services. See [3rd parties](platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/_index.md).
3. Configure DSR. See [configuration](platform/dev/6.7/products/digital-sales-rooms/configuration/_index.md).

## Gotchas

- Having the plugin installed is not enough. DSR does not work fully on SaaS until the frontend app is deployed and the 3rd-party services and configuration are in place.

## Code check (6.7.15.1)
- unverified `Digital Sales Rooms` — commercial plugin, not part of the installed core, storefront or administration code
- unverified `Beyond` — SaaS plan/licensing, out of scope for vendor/shopware
