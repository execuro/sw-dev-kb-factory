---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/products/paas/shopware/fundamentals/applications.md
sourceHash: 204db701845e37f99fd88f0aba4aa52537d0273d
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/applications.html
title: Applications
version: "6.7"
versions:
  - "6.7"
keywords: ["sw-paas application create", "sw-paas application build start", "sw-paas application update", "sw-paas application deploy create", "sw-paas exec", "sw-paas command create", "sw-paas domain create", "sw-paas vault create", "COMPOSER_AUTH", "cdn.shopware.shop", "paas environment", "staging", "deployment", "custom domain"]
summary: "PaaS applications: default replicas/resources, sw-paas application build/update/deploy, exec vs command, Composer plugin management, custom domains."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/extension-management.md", "platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md", "platform/dev/6.7/products/paas/shopware/monitoring/logs.md", "platform/dev/6.7/products/paas/shopware/fundamentals/snapshots.md"]
---
## What it is

An application is one environment (production, staging, temporary feature testing) inside a Shopware PaaS Native project, with its own compute resources, infrastructure and deployment configuration. The page covers resources, build/deploy commands, command execution, plugin management and domains.

## When to use

When creating an environment, building and deploying a specific commit or build, inspecting deploy logs, running console commands remotely, installing private Composer packages, or attaching a custom domain.

## Key steps / config

**Default resource profile** (horizontal scaling is the primary mechanism; limits above this depend on the booked plan):

| Component | Replicas | CPU req | Mem req | Mem limit |
|---|---|---|---|---|
| `storefront` | 2 | `50m` | `256Mi` | `2Gi` |
| `admin` | 1 | `25m` | `128Mi` | `2Gi` |
| `worker` | 1 | `50m` | `256Mi` | `1Gi` |

**Lifecycle**:

- `sw-paas application create` — create an application.
- `sw-paas application build start` / `sw-paas application build logs` — build and follow output. Builds are regular Docker builds and may reach external sources (e.g. Composer repositories). Credentials via [Vault secrets](platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md) as `buildenv`, or `BUILD`-scoped environment variables.
- `sw-paas application update` — takes a commit SHA, builds, waits, then deploys.
- `sw-paas application deploy create` — deploy any successful build (latest or a previous one for rollback).
- `sw-paas application deploy list` / `sw-paas application deploy get` — deployment history/details.
- `sw-paas application logs` (runtime) and `sw-paas application deploy logs` (setup and migrations) — both print a Grafana Explore URL; see [Logs](platform/dev/6.7/products/paas/shopware/monitoring/logs.md). Backups: [Snapshots](platform/dev/6.7/products/paas/shopware/fundamentals/snapshots.md).

**Deployment behavior**: zero downtime via Kubernetes rolling updates; database migrations run first, then the deployment helper flow, which also provides pre/post-deployment hooks. CI/CD works through non-interactive mode and token auth.

**Plugins**: managed [via Composer](platform/dev/6.7/guides/hosting/installation-updates/extension-management.md) because instances must stay identical and stateless. For private packages, create a `COMPOSER_AUTH` secret with `sw-paas vault create`, entering the Composer auth JSON as a `buildenv`.

**Commands**:

- `sw-paas exec --new` — interactive shell in the application container.
- `sw-paas command create` — runs in a new isolated container, no need to wait; default directory `/var/www/html`, container TTL 1 hour.

**Domains**: first deployment gets a free `shopware.shop` domain derived from name and ID. Custom domain: `sw-paas domain create` (multiple per application), point DNS to `cdn.shopware.shop` (routed through Fastly), redeploy with `sw-paas application deploy create`, then assign the domain to a storefront in Shopware.

## Essential identifiers

- `sw-paas application create|update|logs`, `sw-paas application build start|logs`, `sw-paas application deploy create|list|get|logs`
- `sw-paas exec --new`, `sw-paas command create`
- `sw-paas domain create`, `cdn.shopware.shop`
- `sw-paas vault create`, `COMPOSER_AUTH`, `buildenv`

## Gotchas

- Application names are unique within a project and stay reserved after deletion — they cannot be reused.
- `command` containers live 1 hour; commands must finish within that.
- Breaking database changes are expected only on major upgrades — keep deployments backward compatible during a major-version rollout, since migrations run before the rolling update.
- Local plugin installation is not feasible in the clustered setup; use Composer.
- Check the known issues page for network considerations with `sw-paas exec`.
- Domain status updates are a beta feature.

## Code check (6.7.13.0)
- confirmed `runtime_extension_management` — deployment flag (default true) gating runtime store actions, relevant to Composer-only plugin management — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:331
- confirmed `ExtensionStoreActionsController::checkExtensionManagementAllowed()` — rejects runtime extension actions when the flag is false — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:217
- unverified `sw-paas` — PaaS CLI, not part of vendor/shopware
- unverified `COMPOSER_AUTH` — Composer build-time variable, not read by vendor/shopware/core
- unverified `cdn.shopware.shop` — PaaS CDN endpoint, outside the installed code
