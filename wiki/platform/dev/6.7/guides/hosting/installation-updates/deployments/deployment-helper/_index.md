---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md
title: Deployment Helper
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/
sourceHash: b9e863220bbf376cb2fca806edcdb95de0824ef9
codeCheckedAgainst: "6.7.13.0"
keywords: ["deployment helper", "shopware/deployment-helper", "shopware-deployment-helper run", "system:install", "system:update:finish", "--skip-theme-compile", "--skip-assets-install", "shopware-cli project ci", "PostDeploy", "maintenance mode", "deploy-time tasks", "install or update detection", "container deployment", "deployer sftp"]
summary: Deployment Helper (shopware/deployment-helper) - run command detecting install vs update, execution flow, maintenance mode scope, CI/deploy split.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/configuration.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/environment.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/troubleshooting.md", "platform/dev/6.7/products/tools/cli/project-commands/build.md"]
---
## What it is

The Deployment Helper (`shopware/deployment-helper`) is a standalone, Shopware-version-independent PHP tool installed via Composer that runs the deploy-time steps after code is on the server (or, in containers, against the new source before traffic switches). Its `run` command detects whether Shopware is installed and performs a fresh install or an update. It complements, not replaces, the CI build done by Shopware CLI `project ci`.

## When to use

When scripting deployments of a Shopware project (bare-metal, SFTP/Deployer, or container init job) and you want one command that installs/updates Shopware, manages extensions, compiles themes and runs one-time tasks.

## Key steps / config

Install and run:

```bash
composer require shopware/deployment-helper
vendor/bin/shopware-deployment-helper run
```

Typical pipeline (build once, deploy the artifact):

```bash
shopware-cli project ci .     # CI: dependencies, assets, theme
vendor/bin/shopware-deployment-helper run --skip-theme-compile --skip-assets-install
```

Only pass `--skip-theme-compile` / `--skip-assets-install` if the build really produced them.

What `run` does:

1. Waits for the database server (up to 10 retries, 1 s apart).
2. Detects installation: `system_config` table present, at least one user and one sales channel.
3. Fresh install: pre-install hooks → `system:install` → one admin user (from env vars) → one Storefront sales channel, default Storefront theme, first-run wizard disabled → install/activate all plugins and apps (unless overridden) → post-install hooks.
4. Update: pre-update hooks → maintenance mode on (if configured) → `system:update:finish` only if the Shopware version changed → refresh/install/update/deactivate/remove extensions → theme refresh and compile (unless skipped) → one-time tasks → post-update hooks → maintenance mode off.
5. Dispatches the PostDeploy event; listeners: cache clear (if configured), Fastly VCL update (if configured), usage data consent, staging setup (if enabled), Platform.sh tasks. Then `post` hooks run.

Deployment models: in containers, prepare the image with [`project ci`](platform/dev/6.7/products/tools/cli/project-commands/build.md) and run the helper in a second or init container; with SFTP/Deployer, run `project ci` on the CI server, upload, then run the helper on the server.

Next reads: [environment](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/environment.md), [YAML configuration](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/configuration.md), [troubleshooting](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/troubleshooting.md).

## Essential identifiers

- `shopware/deployment-helper`, `vendor/bin/shopware-deployment-helper run`
- `--skip-theme-compile`, `--skip-assets-install`
- `system:install`, `system:update:finish`
- `deployment.maintenance.enabled`

## Gotchas

- Maintenance mode (`deployment.maintenance.enabled: true`) is toggled only around `system:update:finish`, with a cache clear after enabling and after disabling. It affects only the Storefront, per sales channel; `/admin/` stays reachable.
- Redeploying the same Shopware version skips migrations entirely.
- A database with schema but no user or sales channel is treated as not installed, so `system:install` runs again.

## Code check (6.7.13.0)
- confirmed `system:install` — core install command used for fresh installs — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:27
- confirmed `skip-first-run-wizard` — system:install option matching the disabled wizard — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:56
- confirmed `system:update:finish` — core update/migration command — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:29
- confirmed `theme:refresh` — storefront command for theme refresh — vendor/shopware/storefront/Theme/Command/ThemeRefreshCommand.php:14
- confirmed `theme:compile` — storefront compile command — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
- confirmed `plugin:refresh` — core command to refresh plugins from the codebase — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:21
- confirmed `sales-channel:maintenance:enable` — maintenance is a per-sales-channel toggle in core — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceEnableCommand.php:21
- confirmed `system:setup:staging` — core staging command run by the staging listener — vendor/shopware/core/Maintenance/Staging/Command/SystemSetupStagingCommand.php:24
- unverified `shopware-deployment-helper` — separate package outside the checked core/storefront/administration roots
- unverified `shopware-cli project ci` — Shopware CLI, out of scope
