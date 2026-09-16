---
id: platform/dev/6.6/products/sales-agent/installation.md
title: Installation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/sales-agent/installation.html
sourceHash: fa0b9ef58cbe4e434c0cee2744b9982884807fe4
keywords: ["Sales Agent installation", ".env.template", "AUTH_ORIGIN", "SHOPWARE_STORE_API", "SHOPWARE_ADMIN_API", "API_AUTH_SECRET_KEY", "pnpm install", "docker compose", "mkcert", "integration setup", "STORAGE_DRIVER"]
summary: Installation steps for Sales Agent: clone repo, configure .env, create a Shopware integration, install dependencies, run dev server.
lastBuilt: "2026-09-15"
---
## What it is

Step-by-step installation instructions for Sales Agent, including environment configuration and required Shopware integration permissions.

## Key steps / config

1. Clone the repository:
   ```shell
   git clone https://github.com/shopware/swagsalesagent.git
   cd swagsalesagent
   ```
2. Create `.env` from `.env.template`:
   ```shell
   cp .env.template .env
   ```
3. In the Shopware storefront sales channel, copy the API Access Key into `.env`; in Admin > Settings > Integrations, create an integration with at least: write permission for Orders, view permission for Sales Channels, view permission for Customers; copy the secrets into `.env`.
4. Install dependencies:
   ```shell
   pnpm install --frozen-lockfile --prefer-offline
   ```
5. Run the dev server:
   ```shell
   pnpm run dev
   ```
6. Alternative Docker setup:
   ```shell
   docker compose up
   ```

`.env` properties include `AUTH_ORIGIN`, `SHOPWARE_STORE_API`, `SHOPWARE_STORE_API_ACCESS_TOKEN`, `SHOPWARE_ADMIN_API`, `SHOPWARE_ADMIN_API_CLIENT_ID`, `SHOPWARE_ADMIN_API_CLIENT_SECRET`, `SHOPWARE_STOREFRONT_URL`, `SHOPWARE_CDN_URL`, `API_AUTH_SECRET_KEY`, `STORAGE_DRIVER`, `STORAGE_HOST`, `STORAGE_PORT`, `STORAGE_PASSWORD`, `STORAGE_TLS`.

For local SSL: install `mkcert`, run `mkcert localhost` inside the SalesAgent directory, then start with:
```shell
NODE_TLS_REJECT_UNAUTHORIZED=0 nuxt dev --host=localhost --https --ssl-cert 'localhost.pem' --ssl-key 'localhost-key.pem'
```

## Essential identifiers

- `.env.template`
- `AUTH_ORIGIN`
- `SHOPWARE_STORE_API`
- `SHOPWARE_ADMIN_API_CLIENT_ID`
- `API_AUTH_SECRET_KEY`
- `STORAGE_DRIVER`

## Gotchas

`localhost` in the SSL setup command can be replaced with any IP address or domain name to test from other devices on the local network.
