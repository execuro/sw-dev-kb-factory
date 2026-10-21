---
id: platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md
title: Deployment Helper
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/deployments/deployment-helper/
sourceHash: b9e863220bbf376cb2fca806edcdb95de0824ef9
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware/deployment-helper", "shopware-deployment-helper run", "system:install", "system:update:finish", "shopware-cli project ci", "--skip-theme-compile", "--skip-assets-install", "PostDeploy", "deployment.maintenance.enabled", "deploy tool", "install or update", "maintenance mode", "zero-downtime deployment"]
summary: shopware/deployment-helper runs deploy-time steps; `run` detects install vs update and manages extensions, themes and one-time tasks.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/troubleshooting.md", "platform/dev/6.7/products/tools/cli/project-commands/build.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/environment.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/configuration.md"]
---
## What it is

The [Deployment Helper](https://github.com/shopware/deployment-helper) is a standalone PHP tool installed via Composer. It works independently of the Shopware version and runs the deploy-time steps after code reaches the server, or against new source code in a container before traffic switches over. It does not replace the CI build (`shopware-cli project ci`); it complements it. Its single `run` command detects whether Shopware is installed and either installs or updates it.

## When to use

- You deploy a pre-built Shopware artifact and need one command to install or update Shopware, manage plugins and apps, compile themes, and run one-time tasks.
- Container deployments (init container or second container), SFTP uploads and Deployer pipelines.

## Key steps / config

Install and run:

```bash
composer require shopware/deployment-helper
vendor/bin/shopware-deployment-helper run
```

Typical two-phase pipeline:

```bash
# CI build: dependencies, assets, compiled theme
shopware-cli project ci .
# Deploy: consume the artifact, do not rebuild assets
vendor/bin/shopware-deployment-helper run --skip-theme-compile --skip-assets-install
```

Pass `--skip-theme-compile` or `--skip-assets-install` only if the build actually produced the theme or the assets.

Before any step, the helper waits for the database: up to 10 retries with a one-second pause (`MySQLFactory` in the helper repo). It then checks the install state. Shopware counts as installed when the `system_config` table exists and there is at least one user and one sales channel.

**Fresh install flow:** pre-install hooks → `system:install` → create an admin user from env vars → create a Storefront sales channel and set the default theme → disable the first-run wizard → install and activate plugins and apps (unless overridden) → post-install hooks → PostDeploy event.

**Update flow:** pre-update hooks → enable maintenance mode (if configured) → `system:update:finish` (migrations run only if the Shopware version changed; a redeploy of the same version skips them) → refresh, install, update, deactivate or remove extensions → refresh and compile themes (unless skipped) → one-time tasks → post-update hooks → disable maintenance mode → PostDeploy event.

**PostDeploy listeners:** clear the cache (if configured), update the Fastly VCL (if configured), set usage data consent, run the staging setup (if enabled), and run Platform.sh-specific tasks. Post hooks run after them.

**Maintenance mode** (`deployment.maintenance.enabled: true`) is toggled only around `system:update:finish`. It is enabled first, then the cache is cleared, the updates run, maintenance is disabled, and the cache is cleared again. It affects only the Storefront and is set per sales channel. `/admin/` stays reachable.

Related pages: [environment](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/environment.md), [store auth](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/store.md), [extensions](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/extensions.md), [YAML configuration](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/configuration.md), [one-time tasks](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/one-time-tasks.md), [staging](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/staging.md), [hosting](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/hosting.md), [reference](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/reference.md), [troubleshooting](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/troubleshooting.md), [Shopware CLI project ci](platform/dev/6.7/products/tools/cli/project-commands/build.md).

## Essential identifiers

- `shopware/deployment-helper` (Composer package)
- `vendor/bin/shopware-deployment-helper run`, `--skip-theme-compile`, `--skip-assets-install`
- `system:install`, `system:update:finish`
- `deployment.maintenance.enabled`
- `shopware-cli project ci`

## Gotchas

- If the schema exists but there is no user or no sales channel, the helper treats Shopware as not installed and runs the install flow.
- The helper sits outside core on purpose: it runs against a stable installed Shopware, can be released independently of core, reuses Shopware's DB libraries, and reads the database directly instead of relying on console command output.

## Code check (6.7.15.1)
- confirmed `system:install` — core console command — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:31
- confirmed `system:update:finish` — core console command — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:30
- confirmed `skip-assets-install` — `system:install` option exists in core — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:59
- confirmed `maintenance` — per-sales-channel boolean field on SalesChannelDefinition — vendor/shopware/core/System/SalesChannel/SalesChannelDefinition.php:138
- confirmed `theme:compile` — core Storefront command used for theme compilation — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:21
- unverified `shopware-deployment-helper run` — separate shopware/deployment-helper package, out of scope
- unverified `MySQLFactory` — retry logic lives in the deployment-helper repo, out of scope
- unverified `shopware-cli project ci` — Go CLI, outside the vendor code roots
