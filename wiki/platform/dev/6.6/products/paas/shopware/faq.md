---
id: platform/dev/6.6/products/paas/shopware/faq.md
title: Frequently Asked Questions
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/paas/shopware/faq.html
sourceHash: 790b5d3f7347267c3b39da72127554d582b437dd
keywords: ["PaaS FAQ", "sw-paas application update", "sw-paas exec", "sw-paas watch", "sw-paas application list", "secrets management", "SSH access", "extension management", "Composer", "rollback", "commit SHA", "stateless containers"]
summary: FAQ for Shopware PaaS Native covering rollback, filesystem writes, branching, plugin management, secrets, SSH, and CLI commands.
lastBuilt: "2026-09-15"
---
## What it is

FAQ page answering common operational questions about Shopware PaaS Native: rollbacks, filesystem access, branch linkage, plugin management, secrets, database access, infrastructure customization, and CLI usage.

## Key steps / config

- No rollback is possible after a force push that loses git history.
- Containers are stateless; local file writes are discouraged — persistent storage must use S3 buckets or other external storage.
- An application is linked to a commit SHA, not a branch; change it with `sw-paas application update`.
- Plugin management via the Administration UI is unsupported (HA/clustered, stateless instances) — plugins must be installed/updated via Composer as part of the project codebase.
- Only Shopware projects are supported (no arbitrary Node.js apps).
- Secrets are stored in the PaaS secret store, applicable at organization, project, or application level, encrypted in the database and decrypted only on CLI access.
- Database access is possible via the `open` CLI command.
- Infrastructure (e.g. web server config) is opinionated and not customizable; CDN is fixed to Fastly and database config is currently fixed.
- Custom application/decoupled storefront hosting is evaluated case by case, not currently supported.
- `exec` uses an existing container for an interactive, synchronous shell; `command` spins up a new container, non-interactive, suited to automation/CI/CD.
- SSH-like access is provided via `sw-paas exec`, not traditional SSH.
- `sw-paas application list` shows application update status; `sw-paas watch` streams real-time project/application events.

## Essential identifiers

- `sw-paas application update`
- `sw-paas application list`
- `sw-paas exec`
- `sw-paas watch`

## Gotchas

- Losing git history via a force push makes rollback impossible.
- Local filesystem writes are discouraged since all containers are stateless.
