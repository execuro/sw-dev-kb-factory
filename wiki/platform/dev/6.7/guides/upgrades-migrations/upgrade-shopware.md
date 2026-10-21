---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/upgrades-migrations/upgrade-shopware.md
relatedPages:
  - platform/dev/6.7/products/tools/cli/project-commands/upgrade.md
  - platform/dev/6.7/guides/upgrades-migrations/_index.md
  - platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md
sourceHash: 6513f0c05a4b82ec28156ae18935b045205a0e70
sourceUrl: https://developer.shopware.com/docs/guides/upgrades-migrations/upgrade-shopware.html
title: Upgrade Shopware
version: "6.7"
versions:
  - "6.7"
keywords: ["shopware-cli project upgrade", "system:update:finish", "sales-channel:maintenance:enable", "sales-channel:maintenance:disable", "composer update --no-scripts", "composer recipes:update", "shopware/commercial", "upgrade", "update shopware", "maintenance mode", "version constraint", "dry-run"]
summary: Upgrading a Shopware install via shopware-cli project upgrade or manually (composer update --no-scripts, recipes:update, system:update:finish).
lastBuilt: 2026-10-21
---
## What it is

How to update an existing Shopware installation: the recommended Shopware CLI upgrade wizard, or a manual Composer-based update, plus operational checks before and after.

## When to use

Moving a project to a newer Shopware version. Plugin/app maintainers should also read [Upgrades and Migrations](platform/dev/6.7/guides/upgrades-migrations/_index.md) first.

## Key steps / config

**Recommended — Shopware CLI wizard** (from a clean Git working tree, locally):

```bash
shopware-cli project upgrade
# CI / read-only preflight:
shopware-cli project upgrade --no-interaction --target latest-patch --dry-run
```

The wizard checks readiness, lets you pick the target version, checks Composer-managed extensions, verifies the dependency set with Composer, shows the plan, then applies the upgrade locally and produces a report. It does not deploy; test, review the report/changed files, commit, and deploy via your normal process. Options: [Upgrade a Shopware Project](platform/dev/6.7/products/tools/cli/project-commands/upgrade.md).

**Manual Composer update:**

1. On a running environment, enable maintenance mode: `bin/console sales-channel:maintenance:enable --all` (locally, do this as part of deployment instead).
2. Raise the Shopware version constraint in `composer.json` (and `shopware/commercial` if used), then `composer update --no-scripts`. `--no-scripts` avoids scripts calling Shopware CLI commands that only work after updated recipes are installed.
3. Optional, recommended: `composer recipes:update` to force-update Symfony Flex-managed config; review before committing.
4. `bin/console system:update:finish` — runs the update routines: database migrations and, unless `--skip-asset-build` is given, the asset build.
5. Then `bin/console sales-channel:maintenance:disable --all`.

## Essential identifiers

- `shopware-cli project upgrade` (`--no-interaction`, `--target latest-patch`, `--dry-run`)
- `bin/console sales-channel:maintenance:enable --all` / `sales-channel:maintenance:disable --all`
- `composer update --no-scripts`, `composer recipes:update`
- `bin/console system:update:finish`
- `composer.json`, `composer.lock`, `shopware/commercial`

## Gotchas

- Without changing the version constraints, the update resolves to the installed version and nothing is upgraded.
- Without `--all` or sales channel IDs, the maintenance commands update nothing.
- Start from a clean Git tree and a recoverable DB backup; test on local/staging with production-like data; read release notes, changelogs and UPGRADE files; check extension compatibility; avoid skipping majors unless the path is tested; commit `composer.json`/`composer.lock`.
- Track deprecations with Rector and Administration codemods (see [Performing Shopware Updates](platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md)).
- After the update: clear caches if needed, rebuild Administration/Storefront assets if required, test checkout/login/API flows and extensions, check logs for errors and deprecations.

## Code check (6.7.15.1)
- confirmed `sales-channel:maintenance:enable` — sets `maintenance` on sales channels — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceEnableCommand.php:21
- confirmed `all` — `--all` option; without it and without IDs nothing is updated — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceEnableCommand.php:45
- confirmed `sales-channel:maintenance:disable` — subclass of the enable command with `$setMaintenanceMode = false` — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceDisableCommand.php:13
- confirmed `system:update:finish` — finishes the update — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:30
- confirmed `database:migrate` — run by system:update:finish — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:118
- confirmed `skip-asset-build` — option skipping the asset build — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:53
- unverified `shopware-cli project upgrade` — Shopware CLI tool, out of scope
- unverified `composer recipes:update` — Composer/Symfony Flex, out of scope
