---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/products/paas/shopware/faq.md
sourceHash: 7610531403dd02ffd762bdac16ec295420ca044b
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/faq.html
title: Frequently Asked Questions
version: "6.7"
versions:
  - "6.7"
keywords: ["paas faq", "shopware paas native", "sw-paas exec", "sw-paas command", "sw-paas application update", "sw-paas application list", "sw-paas watch", "runtime_extension_management", "SwagExtensionStore", "egress ip", "stateless containers", "zero downtime deployment", "scheduler", "composable frontends"]
summary: "Shopware PaaS Native FAQ: stateless containers, sw-paas exec vs command, egress IPs, deployments, scheduler, limits, and runtime extension management."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/composable-frontends/_index.md", "platform/dev/6.7/products/paas/shopware/resources/databases.md"]
---
## What it is

A list of short answers about Shopware PaaS Native: what the platform allows (filesystem, runtimes, infrastructure customisation), how deployments and CLI commands behave, networking facts, and current limitations.

## When to use

When deciding whether something is possible on PaaS Native (custom runtimes, SSH, basic auth, extra queues, profilers), when allowlisting PaaS egress IPs in a third-party system, or when the admin reports "Runtime extension management is disabled".

## Key steps / config

- **Filesystem**: containers are stateless; local file writes are discouraged. Persistent storage goes to S3 buckets or other external storage. Code and filesystem changes are made in the Git repository.
- **Git history**: no rollback is possible after a force push that loses git history.
- **Branches**: an application is linked to a commit SHA, not a branch. Change it with `sw-paas application update`.
- **Runtimes**: general custom applications are not supported; composable frontends are a dedicated application kind and may use Node.js (see [Composable Frontends](platform/dev/6.7/products/paas/shopware/composable-frontends/_index.md)).
- **Cloud**: AWS only (no Azure/GCP).
- **Secrets**: stored in the PaaS secret store at organization, project or application level; encrypted in the database, decrypted only when accessed via the CLI.
- **Database**: direct access is possible, see [databases](platform/dev/6.7/products/paas/shopware/resources/databases.md). CDN (Fastly) and database configuration are fixed for now.
- **Access restriction**: basic auth is not recommended; use Shopware maintenance mode instead.
- **Shell access**: no traditional SSH; `sw-paas exec` opens a remote terminal session.
- **`exec` vs `command`**:
  - `exec`: reuses an existing container, interactive and synchronous; for debugging and maintenance.
  - `command`: spins up a new container, non-interactive, can be asynchronous; for automation, CI/CD, scheduled tasks.
- **Update status**: `sw-paas application list` shows application status; `sw-paas watch` streams real-time project/application events.
- **Deployments**: zero downtime via Kubernetes rolling updates. Database migrations run first, then the deployment helper flow; pre/post-deployment hooks are configured through the deployment helper. CI/CD is supported through non-interactive mode and token-based machine-to-machine auth.
- **Egress IPs** (AWS `eu-central-1`): `18.156.111.92`, `52.59.182.116`, `18.159.165.194` — currently stable, safe to allowlist.
- **Builds**: regular Docker builds, may reach external endpoints (e.g. Composer repositories).
- **Cloning**: restores an exact snapshot of database and filesystem; no anonymization.
- **Scheduler**: the platform runs the scheduler every 5 minutes.
- **Extension store**: install the `SwagExtensionStore` plugin via Composer to enable in-app purchases from the admin.

## Essential identifiers

- `sw-paas application update`, `sw-paas application list`, `sw-paas watch`, `sw-paas exec`
- `SwagExtensionStore`
- `shopware.deployment.runtime_extension_management` (set in `config/packages/z-shopware.yaml` per the docs)

## Gotchas

- Setting `runtime_extension_management: true` in `config/packages/z-shopware.yaml` does not remove the "Runtime extension management is disabled" error on PaaS — runtime extension management is deliberately disabled because of the ephemeral environment. Install `SwagExtensionStore` via Composer instead.
- Not supported currently: additional queues, SSO for Grafana/OpenSearch, Blackfire/Tideways as part of the platform, managed load tests, server-level infrastructure customisation.
- Number of projects/applications depends on the booked plan; infrastructure and support requests go through the standard ticketing process.

## Code check (6.7.13.0)
- confirmed `runtime_extension_management` — boolean under `shopware.deployment`, defaults to true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:331
- confirmed `StoreException::extensionRuntimeExtensionManagementNotAllowed()` — HTTP 403 with message "Runtime extension management is disabled" — vendor/shopware/core/Framework/Store/StoreException.php:113
- confirmed `ExtensionStoreActionsController::checkExtensionManagementAllowed()` — throws the error when the flag is false — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:217
- confirmed `disableExtensionManagement` — admin info payload is the inverse of the flag — vendor/shopware/core/Framework/Api/Controller/InfoController.php:211
- confirmed `SwagExtensionStore` — admin store landing page activates this extension by name — vendor/shopware/administration/Resources/app/administration/src/module/sw-extension/page/sw-extension-store-landing-page/index.js:31
- confirmed `sales-channel:maintenance:enable` — maintenance mode command exists — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceEnableCommand.php:21
- confirmed `scheduled-task:run` — scheduler command the platform invokes — vendor/shopware/core/Framework/MessageQueue/Command/ScheduledTaskRunner.php:19
- unverified `sw-paas` — PaaS CLI, not part of the installed Shopware code
- unverified `z-shopware.yaml` — project config file name, not in vendor/shopware
