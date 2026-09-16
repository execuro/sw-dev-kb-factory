---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/_index.md
title: Deployments
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/
sourceHash: 676988cb38d2e93947a1dc89939a5c9345c85b9f
codeCheckedAgainst: "6.7.13.0"
keywords: ["deployment", "deployments", "ci/cd", "build artifacts", "rollback", "maintenance mode", "deployment helper", "plugin deployment", "composer", "extension zip", "app backend", "webhooks", "release strategy", "blue/green"]
summary: Shopware 6 deployment principles for custom projects, plugins and apps - build once in CI, externalized config, maintenance mode, roll-forward, webhooks.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md", "platform/dev/6.7/guides/development/testing/ci.md", "platform/dev/6.7/products/tools/cli/extension-commands/build.md"]
---
## What it is

Overview page of the Shopware 6 deployment guides: core principles for deploying Shopware to your own infrastructure, and pointers to building Administration/Storefront assets without a database so CI/CD pipelines produce repeatable releases.

## When to use

When designing a deployment pipeline for a Shopware project, a custom or Store plugin, or an app with an external backend, and you need the baseline practices before diving into the Deployment Helper or database-less builds.

## Key steps / config

Best practices (all project types):

- Build artifacts once in CI (see platform/dev/6.7/guides/development/testing/ci.md) and deploy those artifacts.
- Keep configuration and secrets outside the codebase.
- Make database changes predictable; separate build-time from runtime concerns.

Cross-cutting practices:

- Roll forward by default; keep rollbacks minimal, database-aware, version-pinned and rehearsed.
- Enable maintenance mode for schema-changing releases; run health checks and smoke tests post-deploy before leaving maintenance.
- Tag releases consistently across source code, build artifacts and Store metadata; retain build logs and deployment reports.

Custom projects:

- Follow the ordered flow of the [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) and integrate it into the automation pipeline; keep environment config and secrets out of the repository.

Custom/Store plugins:

- Manage extensions via Composer where possible (versioned, reproducible installs).
- For Store submission or custom distribution, build versioned ZIP artifacts in CI with the [extension build command](platform/dev/6.7/products/tools/cli/extension-commands/build.md); install and activate via CLI or deployment automation.
- Run plugin migrations during deployment; keep update steps idempotent so retries are safe.
- Avoid manual post-deployment tweaks for Store plugins.

Apps (external backends and webhooks):

- Deploy app backends like any web service; use blue/green or canary so webhook handling is not interrupted.
- Keep manifest versions aligned with deployed code.
- Register webhooks for new events before emitting them.
- Externalize credentials and endpoints; make webhook handlers retry-safe and multi-tenant capable.

## Essential identifiers

- Deployment Helper (standalone deploy-time tool)
- `plugin:install` (CLI install of plugins)
- `sales-channel:maintenance:enable` / `sales-channel:maintenance:disable` (per-sales-channel maintenance mode)

## Gotchas

- Webhooks for newly introduced app events must be registered before the events are emitted, otherwise deliveries are lost.
- Non-idempotent plugin update steps break safe retries of a failed deployment.

## Code check (6.7.13.0)
- confirmed `plugin:install` — core CLI command for installing plugins — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:25
- confirmed `sales-channel:maintenance:enable` — core command toggling maintenance mode per sales channel — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceEnableCommand.php:21
- confirmed `sales-channel:maintenance:disable` — counterpart command — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceDisableCommand.php:12
- unverified `Deployment Helper` — separate package, outside the checked core/storefront/administration roots
- unverified `extension build command` — Shopware CLI (Go tool), out of scope
