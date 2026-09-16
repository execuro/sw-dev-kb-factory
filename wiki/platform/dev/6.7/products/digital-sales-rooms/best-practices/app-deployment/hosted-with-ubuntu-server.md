---
id: platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/hosted-with-ubuntu-server.md
title: Ubuntu Server with PM2
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/best-practices/app-deployment/hosted-with-ubuntu-server.html
sourceHash: a8d8c0338d3d69d1027ace470fca88baabcc4223
codeCheckedAgainst: "6.7.13.0"
keywords: ["pm2", "ubuntu server", "digital sales rooms", "dsr", "ecosystem.config.cjs", "pm2 start ecosystem.config.cjs", "npm install -g pm2", "pnpm", ".output/server/index.mjs", "nuxt", "node.js", "cluster mode", "self-hosted deployment"]
summary: Run the Digital Sales Rooms Nuxt frontend on an Ubuntu server under PM2 using an ecosystem.config.cjs in cluster mode pointing at .output/server/index.mjs.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/installation/app-installation.md"]
---
## What it is

A deployment recipe for running the Digital Sales Rooms (DSR) Nuxt frontend app on a self-managed Ubuntu server with PM2, the Node.js process manager that keeps the app running in the background, restarts it automatically when it crashes, and manages logs for troubleshooting.

## When to use

You host the DSR frontend on your own Ubuntu machine with a Node.js runtime rather than on a managed host such as AWS Amplify or Cloudflare Pages.

## Key steps / config

Prerequisites:

- An Ubuntu server you can access via SSH, with Node.js and npm installed.
- PM2 installed globally: `npm install -g pm2`
- pnpm installed globally: `npm install -g pnpm`
- The frontend source: download the DSR plugin zip, extract it, take `/templates/dsr-frontends`, push it to your GitHub repository and clone it onto the server.

Build:

1. Generate the `.env` file and build the code for production as described in [app installation](platform/dev/6.7/products/digital-sales-rooms/installation/app-installation.md) (its "generate env file" and "for production" sections).

Run with PM2:

1. Create `ecosystem.config.cjs` in the project root. The `script` path must point to the app's build output directory (for Nuxt 3: `.output/server/index.mjs`):
   ```js
   module.exports = {
     apps: [{
       name: 'DSRNuxtApp',
       port: '3000',
       exec_mode: 'cluster',
       instances: 'max',
       script: './.output/server/index.mjs'
     }]
   }
   ```
2. Start the app: `pm2 start ecosystem.config.cjs`

## Essential identifiers

- `ecosystem.config.cjs` — PM2 app definition file in the project root
- `pm2 start ecosystem.config.cjs` — start command
- `exec_mode: 'cluster'`, `instances: 'max'`, `port: '3000'` — process settings from the sample
- `./.output/server/index.mjs` — Nuxt 3 server entry produced by the production build
- `/templates/dsr-frontends` — frontend app location in the plugin zip

## Gotchas

- The production build and `.env` generation must happen before starting PM2; the `script` entry references the build output, whose path depends on the framework (the `.output/server/index.mjs` path applies to Nuxt 3).

## Code check (6.7.13.0)
- unverified `ecosystem.config.cjs` — PM2 configuration, outside vendor/shopware
- unverified `pm2 start ecosystem.config.cjs` — PM2 CLI, out of scope
- unverified `./.output/server/index.mjs` — Nuxt build output, out of scope
- unverified `/templates/dsr-frontends` — ships inside the DSR plugin zip, not in vendor/shopware
- unverified `DSRNuxtApp` — sample PM2 app name, not a Shopware identifier
