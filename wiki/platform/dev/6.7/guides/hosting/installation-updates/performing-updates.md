---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/hosting/installation-updates/performing-updates.md
relatedPages:
  - platform/dev/6.7/resources/guidelines/code/backward-compatibility.md
  - platform/dev/6.7/products/tools/cli/project-commands/upgrade.md
  - platform/dev/6.7/products/tools/cli/_index.md
  - platform/dev/6.7/guides/installation/system-requirements.md
sourceHash: 10aa9061a7085805a79308ec958330289d2f8c67
sourceUrl: https://developer.shopware.com/docs/guides/hosting/installation-updates/performing-updates.html
title: Performing Shopware Updates
version: "6.7"
versions:
  - "6.7"
keywords: ["shopware update", "upgrade", "shopware-cli project upgrade", "system:update:prepare", "system:update:finish", "sales-channel:maintenance:enable", "sales-channel:maintenance:disable", "maintenance mode", "composer recipes:update", "major update", "web updater", "shopware/core"]
summary: "Shopware update procedure: shopware-cli project upgrade or manual Composer prep, then maintenance mode, system:update:prepare/finish on production."
lastBuilt: 2026-10-21
---
## What it is

The procedure for updating a Shopware 6 project: preflight checks, local preparation (Shopware CLI wizard or manual Composer), and the console commands to run on the production server after deploying.

## When to use

Applying a monthly minor/patch release or the yearly major release. Minor/patch updates need no special attention unless extensions use internal/experimental APIs (see [Backwards Compatibility Promise](platform/dev/6.7/resources/guidelines/code/backward-compatibility.md)); major updates contain breaking changes.

## Key steps / config

**Preflight** (no file changes):

```bash
shopware-cli project upgrade --no-interaction --target latest-patch --dry-run
```

Interactive: `shopware-cli project upgrade` ([upgrade wizard](platform/dev/6.7/products/tools/cli/project-commands/upgrade.md)). The wizard requires Composer-managed extensions; for local plugins it suggests `shopware-cli project autofix composer-plugins`.

**Prepare**: back up database and files. For majors, first raise PHP to the minimum of the target version ([system requirements](platform/dev/6.7/guides/installation/system-requirements.md)), review `UPGRADE.md`, and review the wizard's extension report.

**Local, recommended**: from a clean Git state run `shopware-cli project upgrade` — it checks, updates Composer, refreshes Flex recipes, runs the Deployment Helper and writes `.shopware-cli/upgrade/report.md`. Review report and diff, test, commit `composer.json`/`composer.lock`, deploy. It does not deploy to production.

**Local, manual**: set the `shopware/core` constraint, then:

```json
{ "require": { "shopware/core": "6.7.0.0" } }
```

```bash
composer update --no-scripts
composer recipes:update
git add composer.json composer.lock && git commit -m "Update Shopware to 6.7.0"
```

**Production, after the code is deployed**:

```bash
bin/console sales-channel:maintenance:enable --all
bin/console system:update:prepare
bin/console system:update:finish
bin/console sales-channel:maintenance:disable --all
```

`system:update:prepare` dispatches events for extensions to prepare; `system:update:finish` runs migrations and update tasks. Before disabling maintenance, check Administration, Storefront flows (cart, checkout), extensions, performance and logs.

**Web updater**: Administration > Settings > System > Shopware Update (enables maintenance, downloads, migrates, disables maintenance).

## Essential identifiers

- `shopware-cli project upgrade`, `--dry-run`, `--target latest-patch`
- `bin/console system:update:prepare`, `bin/console system:update:finish`
- `bin/console sales-channel:maintenance:enable --all` / `sales-channel:maintenance:disable --all`
- `composer update --no-scripts`, `composer recipes:update`

## Gotchas

- Run the production commands only after the new code is deployed — migrations must match the code version.
- Do not enable maintenance mode just to prepare/test locally.
- On wizard failure or cancel, Shopware CLI restores `composer.json`/`composer.lock` only; other files need Git.
- Blue-green deployment allows rollback without a DB restore only if just Shopware (no extensions) was updated.
- The web updater can hit timeouts and memory limits; use it only on small instances.
- Extension tools: Rector for Shopware, Administration codemods, Twig block versioning in the PHPStorm plugin — always review results.

## Version notes

- `shopware-cli project upgrade-check` from older guides is replaced by the `project upgrade --dry-run` preflight.

## Code check (6.7.15.1)
- confirmed `sales-channel:maintenance:enable` — core command with `--all` option (shortcut `-a`) — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceEnableCommand.php:21
- confirmed `$all` — `--all` option of the enable command — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceEnableCommand.php:45
- confirmed `sales-channel:maintenance:disable` — core console command — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceDisableCommand.php:13
- confirmed `system:update:prepare` — core console command — vendor/shopware/core/Maintenance/System/Command/SystemUpdatePrepareCommand.php:22
- confirmed `system:update:finish` — core console command — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:30
- unverified `shopware-cli project upgrade` — Shopware CLI, out of scope
- unverified `composer recipes:update` — Symfony Flex, out of scope
