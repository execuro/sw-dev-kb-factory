---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/_index.md
title: Deployments
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/
sourceHash: 676988cb38d2e93947a1dc89939a5c9345c85b9f
codeCheckedAgainst: "6.7.15.1"
keywords: ["deployment", "deployment helper", "ci/cd", "build artifacts", "maintenance mode", "rollback", "roll forward", "composer", "plugin migrations", "extension zip", "app backend", "webhooks", "blue/green"]
summary: Deployment principles for Shopware 6 - build once in CI, roll forward, maintenance mode for schema changes, Composer plugins, app backend/webhook rules.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md", "platform/dev/6.7/guides/development/testing/ci.md", "platform/dev/6.7/products/tools/cli/extension-commands/build.md"]
---
## What it is

Overview of the deployment section: core principles for deploying Shopware 6 and building Administration and Storefront assets without a database, so CI/CD pipelines and releases are repeatable.

## When to use

When designing a deployment pipeline for a custom Shopware project, for custom or Store plugins, or for apps with external backends.

## Key steps / config

General best practices:

- Build artifacts once in [CI](platform/dev/6.7/guides/development/testing/ci.md) and deploy those artifacts.
- Keep configuration and secrets outside the codebase; make database changes predictable; separate build-time from runtime concerns.

Cross-cutting practices:

- Roll forward by default; keep rollbacks minimal, database-aware, version-pinned and rehearsed.
- Enable maintenance mode for schema-changing releases; run health checks and smoke tests after deploy before leaving maintenance mode (core ships `sales-channel:maintenance:enable` / `sales-channel:maintenance:disable`).
- Tag releases consistently across source, build artifacts and Store metadata; retain build logs and deployment reports.

Custom projects: follow the ordered flow of the [Deployment helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) and integrate it into the automation pipeline.

Custom/Store plugins:

- Manage extensions via Composer where possible for versioned, reproducible installs.
- For Store submission or custom distribution, build versioned ZIP artifacts in CI with the [Extension build command](platform/dev/6.7/products/tools/cli/extension-commands/build.md), then install and activate them via CLI (e.g. `plugin:install --activate`) or automation.
- Run plugin migrations during deployment; keep update steps idempotent so retries are safe. Avoid manual post-deployment tweaks for Store plugins.

Apps:

- Deploy app backends like any web service; use blue/green or canary releases so webhook handling is not interrupted.
- Keep manifest versions aligned with deployed code; register webhooks before emitting new events.
- Externalize credentials and endpoints; make webhook handlers retry-safe and multi-tenant capable.

## Code check (6.7.15.1)
- confirmed `sales-channel:maintenance:enable` — maintenance mode command — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceEnableCommand.php:21
- confirmed `sales-channel:maintenance:disable` — leaves maintenance mode — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceDisableCommand.php:13
- confirmed `plugin:install` — install command, with `--activate` option — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:28
- confirmed `plugin:zip-import` — imports a plugin ZIP artifact — vendor/shopware/core/Framework/Plugin/Command/PluginZipImportCommand.php:23
- confirmed `plugin:update:all` — installs all available plugin updates — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginUpdateAllCommand.php:21
- unverified `Extension build command` — part of shopware-cli, outside the checked roots
