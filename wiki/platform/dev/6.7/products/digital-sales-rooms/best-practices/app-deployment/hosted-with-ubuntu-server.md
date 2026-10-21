---
id: platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/hosted-with-ubuntu-server.md
title: Ubuntu Server with PM2
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/best-practices/app-deployment/hosted-with-ubuntu-server.html
sourceHash: a8d8c0338d3d69d1027ace470fca88baabcc4223
codeCheckedAgainst: "6.7.15.1"
keywords: ["pm2", "ubuntu server", "digital sales rooms", "dsr", "ecosystem.config.cjs", "pm2 start ecosystem.config.cjs", "npm install -g pm2", "pnpm", ".output/server/index.mjs", "nuxt 3", "node.js", "process manager", "self-hosted"]
summary: Run the Digital Sales Rooms Nuxt frontend on an Ubuntu server with PM2 in cluster mode via an ecosystem.config.cjs file.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/installation/app-installation.md"]
---
## What it is

How to deploy the Digital Sales Rooms (DSR) frontend web app to an Ubuntu server and run it with PM2. PM2 is a process manager for Node.js. It keeps the app running in the background, restarts it after a crash, and manages logs.

## When to use

Use this when you self-host the DSR frontend on a Linux server with a Node.js runtime instead of a managed platform such as AWS Amplify or Cloudflare Pages.

## Key steps / config

Prerequisites:

- An Ubuntu server you can reach over SSH.
- Node.js and npm installed on the server.
- PM2 installed globally with `npm install -g pm2`.
- pnpm installed globally with `npm install -g pnpm`.
- The frontend source, cloned into your GitHub repository. It comes from the plugin zip, under `/templates/dsr-frontends`.

Steps:

1. Clone the source onto the server. Generate the `.env` file and build for production by following [app installation](platform/dev/6.7/products/digital-sales-rooms/installation/app-installation.md).
2. Create `ecosystem.config.cjs` in the project root. `script` must point to the build output, which is `.output/server/index.mjs` for Nuxt 3:

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

3. Start the app with `pm2 start ecosystem.config.cjs`.

## Essential identifiers

- `ecosystem.config.cjs`: PM2 config file in the project root
- `pm2 start ecosystem.config.cjs`
- `./.output/server/index.mjs`: Nuxt 3 server entry point
- `exec_mode: 'cluster'`, `instances: 'max'`, `port: '3000'`

## Gotchas

- The `script` path in `ecosystem.config.cjs` must point to your app's build output directory. For Nuxt 3 that is `.output/server/index.mjs`.

## Code check (6.7.15.1)
- unverified `ecosystem.config.cjs` — PM2 configuration for the DSR Nuxt frontend, out of scope for vendor/shopware
- unverified `.output/server/index.mjs` — Nuxt build output path, out of scope for vendor/shopware
- unverified `dsr-frontends` — the DSR frontend ships in the DSR plugin zip and is not part of the installed core, storefront or administration code
