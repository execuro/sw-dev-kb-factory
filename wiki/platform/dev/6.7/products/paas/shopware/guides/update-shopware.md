---
id: platform/dev/6.7/products/paas/shopware/guides/update-shopware.md
title: Update Shopware in PaaS Native
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/guides/update-shopware.html
sourceHash: fff6cd6a57549d177e2a4c7b45042f63f1d432dc
codeCheckedAgainst: "6.7.13.0"
keywords: ["system:update:prepare", "system:update:finish", "sw-paas application update", "sw-paas app deploy list", "sw-paas snapshot create", "sw-paas exec --new", "composer recipes:update", "shopware/core", "DEPLOYING_STORE_SUCCESS", "update shopware", "upgrade", "paas native"]
summary: "Update Shopware on PaaS Native: composer update shopware/core, recipes:update, system:update:prepare, sw-paas application update, system:update:finish."
lastBuilt: 2026-09-15
---
## What it is

The procedure for updating the Shopware version of a Shopware PaaS Native application: check the last deployment, snapshot, bump `shopware/core` in the code base, prepare, redeploy, and finish the update.

## When to use

When moving a PaaS Native shop to a newer Shopware release.

## Key steps / config

1. Pre-check: `sw-paas app deploy list` — the latest deployment must be in state `DEPLOYING_STORE_SUCCESS`. If it is `DEPLOYING_STORE_FAILED`, do not start the update; fix the deployment first.
2. Back up database and filesystem: `sw-paas snapshot create`, and wait until the snapshot is done.
3. Update the code base:
   - `git checkout -b my-new-branch`
   - in `composer.json`, set `shopware/core` to the new version
   - `composer update --no-scripts`
   - `composer recipes:update`
   - `git add . && git commit -m "Updating Shopware to version X.Y.Z"` (note the commit SHA)
   - `git push -u origin my-new-branch`
4. Prepare: `sw-paas exec --new`, then in the session `bin/console system:update:prepare`.
5. Deploy: `sw-paas application update`; track with `sw-paas app deploy list` and/or `sw-paas app deploy get`.
6. Finish: once the application is updated, open `sw-paas exec --new` again and run `bin/console system:update:finish`.

## Essential identifiers

- `sw-paas app deploy list`, `sw-paas app deploy get`
- `sw-paas snapshot create`
- `sw-paas exec --new`
- `sw-paas application update`
- `bin/console system:update:prepare`, `bin/console system:update:finish`
- `DEPLOYING_STORE_SUCCESS`, `DEPLOYING_STORE_FAILED`

## Gotchas

- Never start an update on top of a failed deployment.
- Installed code: both `system:update:prepare` and `system:update:finish` print a note and exit successfully without doing anything when `DATABASE_URL` is empty — run them inside the exec session where the application environment is set.
- Installed code: `system:update:finish` accepts `--skip-migrations`, `--skip-asset-build` and `--version-selection-mode` (not mentioned in the source).

## Code check (6.7.13.0)
- confirmed `system:update:prepare` — console command in core — vendor/shopware/core/Maintenance/System/Command/SystemUpdatePrepareCommand.php:21
- confirmed `DATABASE_URL` — prepare skips when empty — vendor/shopware/core/Maintenance/System/Command/SystemUpdatePrepareCommand.php:36
- confirmed `system:update:finish` — console command in core — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:29
- confirmed `skip-migrations` — option of system:update:finish — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:47
- confirmed `skip-asset-build` — option of system:update:finish — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:53
- confirmed `version-selection-mode` — option of system:update:finish, default safe mode — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:59
- confirmed `DATABASE_URL` — finish skips when empty — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:74
- unverified `composer recipes:update` — Symfony Flex, outside vendor/shopware
- unverified `DEPLOYING_STORE_SUCCESS` — PaaS deployment state, outside vendor/shopware
- unverified `sw-paas application update` — PaaS CLI, outside vendor/shopware
