---
id: platform/dev/6.7/products/sales-agent/best-practices/app-deployment/hosted-with-ubuntu-server.md
title: Ubuntu Server with PM2
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/sales-agent/best-practices/app-deployment/hosted-with-ubuntu-server.html
sourceHash: d422594c0b3fadb4739e40a7502d8f458d70132e
codeCheckedAgainst: "6.7.13.0"
keywords: ["sales agent", "pm2", "ubuntu server", "deployment", "ecosystem.config.cjs", "pm2 start", "redis", "redis-server", "REDIS_HOST", "REDIS_TLS", "REDIS_CACHE", "nuxt 3", "process manager", "pnpm", "cluster mode"]
summary: "Deploy the Sales Agent Nuxt frontend on Ubuntu with PM2: Redis setup, REDIS_* env vars, ecosystem.config.cjs in cluster mode, pm2 start."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/sales-agent/installation.md"]
---
## What it is

A deployment guide for the Sales Agent frontend web application (a Nuxt 3 app) on an Ubuntu server, using PM2 as the Node.js process manager to run the app in the background, restart it on crashes and manage logs. Redis is required for caching.

## When to use

When self-hosting the Sales Agent frontend on an Ubuntu machine reachable via SSH, instead of a platform-as-a-service deployment.

## Key steps / config

1. Prerequisites: Ubuntu server with SSH access, Node.js and npm installed, then global tools:
   - `npm install -g pm2`
   - `npm install -g pnpm`
   - Clone the frontend source code and push it to your own GitHub repository.
2. Redis, option 1 (local install):
   - `sudo apt update` and `sudo apt install redis-server`
   - Edit `/etc/redis/redis.conf`: set `supervised systemd`, restrict `bind` (e.g. `bind 127.0.0.1` for local only), set a password with `requirepass your_secure_password`.
   - `sudo systemctl enable redis-server` and `sudo systemctl start redis-server`
   - Verify: `redis-cli -a your_secure_password ping` (or `redis-cli ping` without a password) must answer `PONG`.
3. Redis, option 2: a managed service (the source names Upstash and Redis Cloud); it supplies host, port and password.
4. Add Redis variables to the app's `.env`:

```bash
REDIS_CACHE=true
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=your_secure_password
REDIS_TLS=false
```

5. Build the app following the app-server setup in [Sales Agent installation](platform/dev/6.7/products/sales-agent/installation.md).
6. Create `ecosystem.config.cjs` in the project root; `script` must point to the build output (`.output/server/index.mjs` for Nuxt 3):

```js
module.exports = {
  apps: [
    { name: "SalesAgentApp", port: "3000", exec_mode: "cluster",
      instances: "max", script: "./.output/server/index.mjs" },
  ],
};
```

7. Start: `pm2 start ecosystem.config.cjs`.

## Essential identifiers

- `pm2`, `pm2 start ecosystem.config.cjs`
- `ecosystem.config.cjs` keys: `name`, `port`, `exec_mode`, `instances`, `script`
- `.output/server/index.mjs`
- `REDIS_CACHE`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_TLS`
- `/etc/redis/redis.conf`: `supervised systemd`, `bind`, `requirepass`

## Gotchas

- Set `REDIS_TLS=true` for managed Redis services that require TLS (e.g. Upstash); keep `REDIS_HOST` pointing at the managed endpoint rather than `127.0.0.1`.
- `REDIS_PASSWORD` is only needed when `requirepass` is configured.
- The `script` path in `ecosystem.config.cjs` must match the actual build output directory.

## Code check (6.7.13.0)
- unverified `REDIS_CACHE` — Sales Agent Nuxt app env var; not present in vendor/shopware (separate frontend repository, out of scope)
- unverified `REDIS_TLS` — Sales Agent app env var; no occurrence in the installed Shopware packages
- unverified `ecosystem.config.cjs` — PM2 config file of the Sales Agent app; out of scope of vendor/shopware
- unverified `SalesAgentApp` — PM2 app name example; Sales Agent source is not installed
- unverified `pm2 start` — PM2 CLI, third-party tool outside vendor/shopware
