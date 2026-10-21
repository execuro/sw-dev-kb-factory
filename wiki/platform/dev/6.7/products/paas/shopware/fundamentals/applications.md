---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/paas/shopware/fundamentals/applications.md
relatedPages:
  - platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md
  - platform/dev/6.7/products/paas/shopware/monitoring/logs.md
  - platform/dev/6.7/products/paas/shopware/fundamentals/snapshots.md
  - platform/dev/6.7/guides/hosting/installation-updates/extension-management.md
sourceHash: f1d0ae6065de4e7109db762f91a591e1435c4a37
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/fundamentals/applications.html
title: Applications
version: "6.7"
versions:
  - "6.7"
keywords: ["sw-paas application create", "sw-paas application build create", "sw-paas application update", "sw-paas application deploy create", "sw-paas exec", "sw-paas command create", "sw-paas domain create", "COMPOSER_AUTH", "application.yaml", "paas native", "environment", "deployment", "custom domain", "build logs"]
summary: "Shopware PaaS Native applications: resource defaults, sw-paas build/update/deploy commands, rolling deployments, Composer plugins, exec/command, domains."
lastBuilt: 2026-10-21
---
## What it is

An application in Shopware PaaS Native is one environment inside a project (production, staging, temporary feature testing). Each has its own compute resources, infrastructure and deployment configuration, so staging can run on small hibernating instances while production uses larger always-on ones. The number of projects and applications depends on the booked plan.

## When to use

When creating, building, deploying, inspecting or running commands against a PaaS Native environment, installing plugins there, or attaching domains to it.

## Key steps / config

Default resource profile (horizontal scaling is the primary mechanism; limits above this depend on the plan):

| Component | Replicas | CPU request | Memory request | Memory limit |
|---|---|---|---|---|
| `storefront` | `2` | `50m` | `256Mi` | `2Gi` |
| `admin` | `1` | `25m` | `128Mi` | `2Gi` |
| `worker` | `1` | `50m` | `256Mi` | `1Gi` |

1. Create: `sw-paas application create`. It reads `application.yaml` at the repository root; for a sub-directory pass `--application-yaml-path apps/shopware/application.yaml` (stored on the application and reused by later updates; see [monorepo deploys](platform/dev/6.7/products/paas/shopware/guides/monorepo.md)).
2. Build: `sw-paas application build create`; follow with `sw-paas application build logs`. Builds are regular Docker builds; external network access (e.g. Composer repositories) is allowed. Credentials go in [Vault secrets](platform/dev/6.7/products/paas/shopware/fundamentals/secrets.md) as `buildenv`, or in `BUILD`-scoped environment variables.
3. Update: `sw-paas application update` (asks for the commit SHA) builds, waits, then deploys.
4. Deploy a chosen successful build (latest or an earlier one for rollback): `sw-paas application deploy create`. Manage with `sw-paas application deploy list` and `sw-paas application deploy get`.
5. Logs: `sw-paas application logs` (runtime) and `sw-paas application deploy logs` (setup/migrations); both end with a Grafana Explore URL. See [Logs](platform/dev/6.7/products/paas/shopware/monitoring/logs.md). Backups: [Snapshots](platform/dev/6.7/products/paas/shopware/fundamentals/snapshots.md).
6. Plugins: install only [via Composer](platform/dev/6.7/guides/hosting/installation-updates/extension-management.md) — instances are identical and stateless. For private packages create a `COMPOSER_AUTH` secret with `sw-paas vault create`, entering the Composer auth JSON as a `buildenv`.
7. Commands: `sw-paas exec --new` opens an interactive shell in the application container; `sw-paas command create` runs a command in a new isolated container (working directory `/var/www/html`, TTL 1 hour), without waiting for completion — suited to CI/CD.
8. Domains: each first deployment gets a `shopware.shop` domain derived from the application name and ID. For custom domains configure DNS first, then `sw-paas domain create` (multiple domains per application, routed via Fastly), then redeploy with `sw-paas application deploy create`, then assign the domain to a storefront in Shopware.

## Essential identifiers

- `sw-paas application create`, `--application-yaml-path`, `application.yaml`
- `sw-paas application build create`, `sw-paas application build logs`
- `sw-paas application update`, `sw-paas application deploy create|list|get|logs`, `sw-paas application logs`
- `sw-paas exec --new`, `sw-paas command create`, `sw-paas domain create`, `sw-paas vault create`
- `COMPOSER_AUTH`, `buildenv`, `BUILD` scope

## Gotchas

- Application names are unique per project and stay reserved after deletion — they cannot be reused.
- Deployments are Kubernetes rolling updates and zero-downtime only without database migrations. Migrations run first, then the deployment helper flow (which also provides pre-/post-deployment hooks); schema changes can break code still serving traffic. Breaking changes are expected only on major upgrades — keep rollouts backward compatible and use a low-traffic window.
- DNS must be fully propagated before `sw-paas domain create`, which validates in real time. A subdomain uses `CNAME`; an apex domain needs `A`, `AAAA` and a `TXT` ownership challenge — values in [CDN docs](platform/dev/6.7/products/paas/shopware/cdn/_index.md).
- `sw-paas exec` has network caveats listed in [known issues](platform/dev/6.7/products/paas/shopware/known-issues.md).
- Domain status updates are a beta feature. The CLI supports non-interactive mode and token-based machine-to-machine auth for CI/CD.

## Code check (6.7.15.1)
- confirmed `runtime_extension_management` — deployment config node (default true) that, when false, blocks runtime extension changes, matching Composer-only plugin management — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:352
- confirmed `shopware.deployment.runtime_extension_management` — injected into the extension store actions controller — vendor/shopware/core/Framework/DependencyInjection/store.php:283
- confirmed `StoreException::extensionRuntimeExtensionManagementNotAllowed()` — thrown when runtime extension management is disabled — vendor/shopware/core/Framework/Store/Api/ExtensionStoreActionsController.php:220
- unverified `sw-paas` — PaaS CLI, not part of the Shopware code roots
- unverified `application.yaml` — PaaS platform file, out of scope
- unverified `COMPOSER_AUTH` — Composer/build-time variable, not read by Shopware core
- unverified `/var/www/html` — container image layout, out of scope
