---
id: platform/dev/6.6/products/digital-sales-rooms/best-practices/app-deployment/hosted-with-ubuntu-server.md
title: Hosting a Frontend App on an Ubuntu Server with PM2
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/digital-sales-rooms/best-practices/app-deployment/hosted-with-ubuntu-server.html
sourceHash: 6d0aa85518557a9237a129c6c38a1c068d4572c3
keywords: ["PM2", "Ubuntu server", "Digital Sales Rooms", "DSR", "Nuxt 3", "process manager", "ecosystem.config.cjs", "dsr-frontends", "pnpm", "Node.js"]
summary: "Deploying the Digital Sales Rooms frontend to an Ubuntu server, run and kept alive with the PM2 process manager."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.6/products/digital-sales-rooms/installation/app-installation.md"]
---
## What it is
A guide to deploying the DSR frontend web application to an Ubuntu server using PM2, a process manager for Node.js applications that restarts the app on crash and manages logs.

## When to use
Use this when self-hosting the DSR frontend on your own Ubuntu server (accessed via SSH) rather than a managed platform like AWS Amplify or Cloudflare Pages.

## Key steps / config
1. Prerequisites: an accessible Ubuntu server, Node.js & npm, and PM2 installed globally (`npm install -g pm2`) plus pnpm (`npm install -g pnpm`).
2. Clone the frontend source code (found inside `/templates/dsr-frontends` after extracting the plugin zip) and push it to your Git repository.
3. After cloning onto the Ubuntu server, follow the guide to [build the env file and build the code for production](platform/dev/6.6/products/digital-sales-rooms/installation/app-installation.md).
4. Create `ecosystem.config.cjs` in the project root, pointing `script` at the build output (e.g. `.output/server/index.mjs` for Nuxt 3):

```js
module.exports = {
  apps: [
    {
      name: 'DSRNuxtApp',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
```

5. Start the app: `pm2 start ecosystem.config.cjs`

## Essential identifiers
- `ecosystem.config.cjs`
- `pm2 start ecosystem.config.cjs`
- `npm install -g pm2`
