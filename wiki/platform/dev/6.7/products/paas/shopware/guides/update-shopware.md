---
id: platform/dev/6.7/products/paas/shopware/guides/update-shopware.md
title: Update Shopware in PaaS Native
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/guides/update-shopware.html
sourceHash: fff6cd6a57549d177e2a4c7b45042f63f1d432dc
codeCheckedAgainst: "6.7.15.1"
keywords: ["system:update:prepare", "system:update:finish", "sw-paas app deploy list", "sw-paas application update", "sw-paas snapshot create", "sw-paas exec --new", "DEPLOYING_STORE_SUCCESS", "composer recipes:update", "shopware/core", "upgrade", "version update", "paas native"]
summary: "Upgrade Shopware on PaaS Native: check deploy state, snapshot, bump shopware/core, system:update:prepare, sw-paas application update, finish."
lastBuilt: 2026-10-21
---
## What it is

The procedure for upgrading the Shopware version of an application running on Shopware PaaS Native: verify the last deployment, snapshot the data, update the code base with Composer, then run the Shopware update commands around the PaaS application update.

## When to use

When moving a PaaS Native shop to a newer `shopware/core` version.

## Key steps / config

1. **Pre-check** — run `sw-paas app deploy list`. Only start if the latest deployment has status `DEPLOYING_STORE_SUCCESS`.
2. **Snapshot** — back up database and Shopware filesystem with `sw-paas snapshot create` and wait until it is done.
3. **Update the code base**:
   - `git checkout -b my-new-branch`
   - in `composer.json` raise `shopware/core` to the new version
   - `composer update --no-scripts`
   - `composer recipes:update`
   - `git add . && git commit -m "Updating Shopware to version X.Y.Z"` (note the commit SHA)
   - `git push -u origin my-new-branch`
4. **Prepare** — open an exec session with `sw-paas exec --new` and run `bin/console system:update:prepare`.
5. **Deploy** — run `sw-paas application update`; track it with `sw-paas app deploy list` and/or `sw-paas app deploy get`.
6. **Finish** — after a successful update, open a new session (`sw-paas exec --new`) and run `bin/console system:update:finish`. In the installed code this runs core migrations (`database:migrate`, then `database:migrate-destructive` with `--version-selection-mode`, default `safe`) and `assets:install`; options `--skip-migrations` and `--skip-asset-build` skip those steps.

## Essential identifiers

- PaaS CLI: `sw-paas app deploy list`, `sw-paas app deploy get`, `sw-paas snapshot create`, `sw-paas exec --new`, `sw-paas application update`
- Shopware console: `system:update:prepare`, `system:update:finish`
- Deployment states: `DEPLOYING_STORE_SUCCESS`, `DEPLOYING_STORE_FAILED`

## Gotchas

- If the latest deployment state is `DEPLOYING_STORE_FAILED`, do not start a Shopware update — fix the deployment first.
- Both `system:update:prepare` and `system:update:finish` silently skip (print a note and exit successfully) when `DATABASE_URL` is not defined, so run them inside the exec session where the app environment is present.

## Code check (6.7.15.1)
- confirmed `system:update:prepare` — console command dispatching UpdatePrePrepareEvent/UpdatePostPrepareEvent — vendor/shopware/core/Maintenance/System/Command/SystemUpdatePrepareCommand.php:22
- confirmed `system:update:finish` — console command running migrations and asset install — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:30
- confirmed `skip-migrations` — option of system:update:finish — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:47
- confirmed `skip-asset-build` — option of system:update:finish — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:53
- confirmed `version-selection-mode` — destructive-migration mode option, default safe — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:59
- confirmed `DATABASE_URL` — both commands skip when it is empty — vendor/shopware/core/Maintenance/System/Command/SystemUpdatePrepareCommand.php:36
- unverified `sw-paas application update` — PaaS CLI, outside vendor/shopware
- unverified `DEPLOYING_STORE_SUCCESS` — PaaS deployment state, not in vendor/shopware code
