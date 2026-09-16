---
id: platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md
title: Upgrade Shopware
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/upgrade-shopware.html
sourceHash: 6513f0c05a4b82ec28156ae18935b045205a0e70
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli project upgrade", "system:update:finish", "sales-channel:maintenance:enable", "sales-channel:maintenance:disable", "composer update --no-scripts", "composer recipes:update", "maintenance mode", "update shopware", "upgrade", "shopware/commercial", "symfony flex recipes", "migrations"]
summary: "Updating Shopware via the shopware-cli upgrade wizard or manually with composer update and system:update:finish."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/project-commands/upgrade.md", "platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md", "platform/dev/6.7/guides/upgrades-migrations/_index.md"]
---
## What it is

How to update an existing Shopware installation: the recommended Shopware CLI upgrade wizard, or a manual Composer-based update followed by `system:update:finish`.

## When to use

- Preparing a project for a new Shopware version locally, in CI, or on a running environment.
- For custom plugins/apps, review [Upgrades and Migrations](platform/dev/6.7/guides/upgrades-migrations/_index.md) first.

## Key steps / config

### Recommended: Shopware CLI wizard

From a clean Git working tree:

```bash
shopware-cli project upgrade
# CI / read-only preflight
shopware-cli project upgrade --no-interaction --target latest-patch --dry-run
```

It checks readiness, lets you pick the target version, checks Composer-managed extensions and verifies the dependency set before changing files. It does not deploy; test, review the report, commit and deploy yourself. Details: [Upgrade a Shopware Project](platform/dev/6.7/products/tools/cli/project-commands/upgrade.md).

### Manual Composer update

1. Maintenance mode (running environments only): `bin/console sales-channel:maintenance:enable --all` (`-a`; alternatively pass sales channel ids).
2. Raise the Shopware constraint in `composer.json` (and `shopware/commercial` if used), then `composer update --no-scripts`.
3. Optional, recommended: `composer recipes:update`; review changes.
4. `bin/console system:update:finish` – runs migrations and asset installation; the storefront reacts to the post-finish event to recompile themes. Options: `--skip-migrations`, `--skip-asset-build`, `--version-selection-mode` (default `safe`).
5. `bin/console sales-channel:maintenance:disable --all`.

## Essential identifiers

- `shopware-cli project upgrade`
- `bin/console sales-channel:maintenance:enable --all` / `sales-channel:maintenance:disable --all`
- `composer update --no-scripts`, `composer recipes:update`
- `bin/console system:update:finish`

## Gotchas

- Without raising the version constraints, `composer update` resolves to the installed version and nothing is upgraded.
- `--no-scripts` is needed because scripts may call Shopware commands that only work after recipes are updated.
- `system:update:finish` skips itself when `DATABASE_URL` is not defined.
- Best practices: DB backup, staging test with production-like data, read release notes/UPGRADE files, check extension compatibility, use Rector and Administration codemods (see [Performing Shopware Updates](platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md)), avoid skipping majors, commit `composer.json`/`composer.lock`.
- Afterwards: clear caches, rebuild assets if required, test checkout/login/API flows and extensions, review logs for errors and deprecations.

## Code check (6.7.13.0)
- confirmed `sales-channel:maintenance:enable` — enables maintenance mode for sales channels — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceEnableCommand.php:21
- confirmed `--all` — option (short `-a`) sets maintenance for all sales channels — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceEnableCommand.php:46
- confirmed `sales-channel:maintenance:disable` — subclass of the enable command — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceDisableCommand.php:12
- confirmed `system:update:finish` — finishes the update process — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:29
- confirmed `--skip-migrations` — skips migrations — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:47
- confirmed `--skip-asset-build` — skips asset building — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:53
- confirmed `version-selection-mode` — destructive migration mode, default safe — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:59
- confirmed `DATABASE_URL` — command skips when not defined — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:74
- confirmed `UpdatePostFinishEvent` — storefront theme subscriber handles update finish — vendor/shopware/storefront/Theme/Subscriber/UpdateSubscriber.php:42
- unverified `shopware-cli project upgrade` — separate Shopware CLI tool, outside vendor/shopware scope
