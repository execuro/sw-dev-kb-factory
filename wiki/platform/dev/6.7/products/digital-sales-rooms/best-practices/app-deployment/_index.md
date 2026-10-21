---
id: platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/_index.md
title: Frontend App Deployment
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/best-practices/app-deployment/
sourceHash: a3615b5f7d6d799161e7f738ff97a986197f61ec
codeCheckedAgainst: "6.7.15.1"
keywords: ["digital sales rooms", "dsr", "frontend app deployment", "dsr-frontends", "shopware frontends", "nuxt", "nuxt deploy", "static hosting", "node.js runtime", "hosting", "deployment options"]
summary: Deployment options for the Digital Sales Rooms Nuxt frontend app (static hosting or Node.js server), with AWS, Cloudflare and PM2 child guides.
lastBuilt: 2026-10-21
---
## What it is

The entry page for deploying the *Digital Sales Room* (DSR) frontend app. The DSR frontend is a template generated with Shopware Frontends (a Nuxt application), so it can be deployed the same ways as any Shopware Frontends template. The two main options are a static hosting service or a server with a Node.js runtime.

## When to use

Read this when you have the DSR frontend source and need to choose where to host it. The child pages cover specific targets: AWS Amplify, Cloudflare Pages, and an Ubuntu server running PM2.

## Key steps / config

- Pick a hosting model: static hosting, or a Node.js runtime server.
- For general approaches, follow the Shopware Frontends deployment guide (`/frontends/best-practices/deployment.html` on developer.shopware.com) and the Nuxt deployment instructions (`https://nuxt.com/deploy`).
- For DSR-specific practice, use the provider pages in this section (AWS, Cloudflare, Ubuntu Server with PM2).

## Code check (6.7.15.1)
- unverified `dsr-frontends` — the DSR frontend is a Nuxt app shipped in the DSR plugin zip and is not part of the installed core, storefront or administration code
- unverified `nuxt` — Nuxt deployment presets belong to the frontend toolchain, out of scope for vendor/shopware
