---
id: platform/dev/6.7/products/sales-agent/best-practices/app-deployment/hosted-with-ubuntu-server.md
title: Ubuntu Server with PM2
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/best-practices/app-deployment/hosted-with-ubuntu-server.html
sourceHash: d422594c0b3fadb4739e40a7502d8f458d70132e
codeCheckedAgainst: "6.7.15.1"
keywords: ["sales agent", "ubuntu server", "pm2", "ecosystem.config.cjs", "pm2 start ecosystem.config.cjs", "redis-server", "redis", "REDIS_CACHE", "REDIS_TLS", "requirepass", "node.js", "pnpm", "self-hosted", "deploy"]
summary: Run the Sales Agent frontend on an Ubuntu server under PM2 (cluster mode via ecosystem.config.cjs) with a local or managed Redis cache.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/sales-agent/installation.md"]
---
## What it is

A guide to deploying the Sales Agent frontend web application on an Ubuntu server, kept running by PM2, the Node.js process manager that runs the app in the background, restarts it on crashes, and manages logs.

## When to use

Use it when you self-host the Sales Agent frontend on your own Ubuntu machine (SSH access) rather than on a managed platform such as AWS Amplify or Cloudflare Pages.

## Key steps / config

**Prerequisites:** an Ubuntu server reachable via SSH, Node.js and npm installed, plus global tools:

```bash
npm install -g pm2
npm install -g pnpm
```

The frontend source code is cloned and pushed to your GitHub repository.

**Redis (required for caching), option 1 — local install:**

```bash
sudo apt update
sudo apt install redis-server
sudo nano /etc/redis/redis.conf
sudo systemctl enable redis-server
sudo systemctl start redis-server
redis-cli -a your_secure_password ping   # or: redis-cli ping
```

Settings to consider in `/etc/redis/redis.conf`: `supervised systemd` (systemd integration), `bind` to restrict access (e.g. `bind 127.0.0.1` for local only), and a password via `requirepass your_secure_password`. A working server answers `PONG`.

**Option 2 — managed Redis** (Upstash, Redis Cloud): use the host, port and password the service provides, with `REDIS_TLS=true`.

**Redis variables in `.env`:**

```bash
REDIS_CACHE=true
REDIS_HOST=127.0.0.1      # or managed endpoint
REDIS_PORT=6379
REDIS_PASSWORD=your_secure_password   # if requirepass is set
REDIS_TLS=false           # true for TLS-requiring managed services
```

**Build:** follow the app server setup and build steps in [installation](platform/dev/6.7/products/sales-agent/installation.md).

**Start with PM2:** create `ecosystem.config.cjs` in the project root; `script` must point to the build output (`.output/server/index.mjs` for Nuxt 3):

```js
module.exports = {
  apps: [{
    name: "SalesAgentApp",
    port: "3000",
    exec_mode: "cluster",
    instances: "max",
    script: "./.output/server/index.mjs",
  }],
};
```

Then run `pm2 start ecosystem.config.cjs`.

## Essential identifiers

- CLI: `npm install -g pm2`, `npm install -g pnpm`, `sudo apt install redis-server`, `redis-cli ping`, `pm2 start ecosystem.config.cjs`
- Files: `ecosystem.config.cjs`, `/etc/redis/redis.conf`, `.env`, `./.output/server/index.mjs`
- Env vars: `REDIS_CACHE`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_TLS`

## Gotchas

- If `requirepass` is set, `redis-cli ping` needs `-a <password>` and `.env` must carry the same `REDIS_PASSWORD`.
- A wrong `script` path in `ecosystem.config.cjs` (not the actual build output directory) prevents PM2 from starting the app.

## Code check (6.7.15.1)
- unverified `REDIS_CACHE` — Sales Agent frontend app env var; not present in vendor/shopware core, storefront or administration
- unverified `REDIS_HOST` — Sales Agent frontend app env var; not present in vendor/shopware core, storefront or administration
- unverified `REDIS_TLS` — Sales Agent frontend app env var; not present in vendor/shopware core, storefront or administration
- unverified `ecosystem.config.cjs` — PM2 configuration of the separate Sales Agent Nuxt app, out of scope for vendor/shopware
- unverified `pm2 start ecosystem.config.cjs` — PM2 CLI, out of scope for vendor/shopware
