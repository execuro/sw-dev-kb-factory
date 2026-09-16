---
id: platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md
title: Performing Shopware Updates
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/performing-updates.html
sourceHash: 10aa9061a7085805a79308ec958330289d2f8c67
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli project upgrade", "system:update:prepare", "system:update:finish", "sales-channel:maintenance:enable", "sales-channel:maintenance:disable", "composer recipes:update", "upgrade", "update", "major update", "maintenance mode", "web updater", "migrations"]
summary: "Shopware update workflow: shopware-cli upgrade dry-run, Composer update, recipes, then system:update:prepare/finish under maintenance mode on production."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/project-commands/upgrade.md", "platform/dev/6.7/resources/guidelines/code/backward-compatibility.md", "platform/dev/6.7/guides/installation/system-requirements.md", "platform/dev/6.7/products/tools/cli/_index.md"]
---
## What it is

The hosting guide for updating a Shopware 6 project: when to update, the two update types, preflight checks with Shopware CLI, local preparation of Composer changes, the commands to run on the production server, and the Administration web updater.

## When to use

Planning or executing a minor/patch or major Shopware update, checking extension compatibility before an upgrade, or scripting the post-deploy update commands in a deployment pipeline.

## Key steps / config

**Update types**: minor/patch updates ship monthly (features, fixes, security patches) and need no special attention unless extensions use internal/experimental APIs (see [Backwards Compatibility Promise](platform/dev/6.7/resources/guidelines/code/backward-compatibility.md)). Major updates ship once a year with breaking changes. Security fixes can also be installed via the Security Plugin without updating.

**Preparation**

1. Preflight (read-only) with the Shopware CLI upgrade wizard:
   ```bash
   shopware-cli project upgrade --no-interaction --target latest-patch --dry-run
   ```
   It checks project readiness, Composer-managed extension compatibility and Composer resolvability. Extensions must be managed through Composer; for local plugins the CLI suggests `shopware-cli project autofix composer-plugins`.
2. Back up database and files.
3. For majors: raise PHP to the new minimum first (see [System Requirements](platform/dev/6.7/guides/installation/system-requirements.md)), read `UPGRADE.md`, review the wizard's extension queue.

**Local preparation (recommended)**: run `shopware-cli project upgrade` from a clean Git state (see [Upgrade a Shopware Project](platform/dev/6.7/products/tools/cli/project-commands/upgrade.md)). It runs checks, the Composer update, Symfony Flex recipe refresh, Shopware Deployment Helper, and writes `.shopware-cli/upgrade/report.md`. On failure it restores `composer.json`/`composer.lock`. Then review the report and diff, test, commit, deploy. The wizard does not deploy.

**Manual local preparation**

1. Set the `shopware/core` constraint in `composer.json`:
   ```json
   { "require": { "shopware/core": "6.7.0.0" } }
   ```
2. `composer update --no-scripts`
3. `composer recipes:update` (review changes)
4. Commit `composer.json`, `composer.lock` and reviewed recipe changes; deploy.

**Production server** (only after the new code is deployed):

```bash
bin/console sales-channel:maintenance:enable --all
bin/console system:update:prepare
bin/console system:update:finish
bin/console sales-channel:maintenance:disable --all
```

`system:update:prepare` dispatches update-prepare events for extensions; `system:update:finish` runs migrations and post-update tasks (in the installed code it also installs assets unless `--skip-asset-build`, and accepts `--skip-migrations` and `--version-selection-mode`).

**Web updater**: Administration > **Settings** > **System** > **Shopware Update**; enables maintenance mode, downloads, migrates, disables maintenance mode.

**Final checks** before leaving maintenance mode: Administration, Storefront checkout flow, extensions, performance, error logs, and keep the CLI upgrade report.

## Essential identifiers

- `shopware-cli project upgrade`, `--dry-run`, `--target latest-patch`
- `shopware-cli project autofix composer-plugins`
- `.shopware-cli/upgrade/report.md`
- `composer update --no-scripts`, `composer recipes:update`
- `sales-channel:maintenance:enable --all` / `sales-channel:maintenance:disable --all`
- `system:update:prepare`, `system:update:finish`
- `UpdatePrePrepareEvent`, `UpdatePostPrepareEvent`, `UpdatePreFinishEvent`, `UpdatePostFinishEvent`

## Gotchas

- `shopware-cli project upgrade-check` from older guides is replaced by `shopware-cli project upgrade --dry-run`.
- Run `system:update:*` only on a server where the updated code is deployed; migrations must match the deployed code.
- Do not enable maintenance mode just to prepare or test the upgrade locally.
- Blue-green deployment allows rollback without restoring the DB backup, recommended only when Shopware alone (no extensions) was updated.
- The web updater is only for small instances: browser timeouts and memory limits hit larger shops.
- Tools for extension developers: Rector for Shopware (PHP), Administration codemods (JS), the PHPStorm Twig block versioning feature; always review their results.

## Code check (6.7.13.0)
- confirmed `sales-channel:maintenance:enable` — console command — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceEnableCommand.php:21
- confirmed `all` — `--all` option read in execute — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceEnableCommand.php:58
- confirmed `sales-channel:maintenance:disable` — subclass of the enable command with maintenance flag false — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceDisableCommand.php:12
- confirmed `system:update:prepare` — dispatches pre/post prepare events — vendor/shopware/core/Maintenance/System/Command/SystemUpdatePrepareCommand.php:21
- confirmed `UpdatePrePrepareEvent` — dispatched by system:update:prepare — vendor/shopware/core/Maintenance/System/Command/SystemUpdatePrepareCommand.php:51
- confirmed `system:update:finish` — runs migrations and events — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:29
- confirmed `skip-asset-build` — finish installs assets unless this option is set — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:53
- confirmed `UpdatePostFinishEvent` — dispatched after migrations — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:97
- confirmed `sw-settings-shopware-updates` — Administration update module exists — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-shopware-updates/index.ts:19
- unverified `shopware-cli project upgrade` — external Shopware CLI tool, out of scope
