---
id: platform/dev/6.6/products/sales-agent/deployment.md
title: Deployment
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/sales-agent/deployment.html
sourceHash: d53eb12bae449c8b44c7b6363f874de494d1c18a
keywords: ["Sales Agent deployment", "Nuxt production", "StorageAdapter.ts", "nuxt.config.ts", "nitro.storage", "unstorage", "pnpm run build", "docker compose", "storage adapter"]
summary: Sales Agent deployment relies on a configurable storage adapter (nitro.storage) and standard Nuxt production build/start commands.
lastBuilt: "2026-09-15"
---
## What it is

Describes how to build and deploy Sales Agent (a Nuxt application) for production, including its storage adapter configuration.

## Key steps / config

- Sales Agent uses a configurable storage adapter for persisting data, defined in `server/infrastructure/StorageAdapter.ts`. Local development uses a file-based fallback adapter; production requires configuring a proper adapter in the `nitro.storage` object inside `nuxt.config.ts`.
- Production build and start:
  ```bash
  pnpm run build
  pnpm run start
  ```
- Alternative production start via Docker Compose:
  ```bash
  docker compose -f docker-compose.prod.yml up
  ```

## Essential identifiers

- `server/infrastructure/StorageAdapter.ts`
- `nuxt.config.ts`
- `nitro.storage`
- `pnpm run build`
- `pnpm run start`
