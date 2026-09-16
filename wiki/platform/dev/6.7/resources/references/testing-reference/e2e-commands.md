---
id: platform/dev/6.7/resources/references/testing-reference/e2e-commands.md
title: E2E Commands
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/testing-reference/e2e-commands.html
sourceHash: a2162bd929fd84f1055b697c9175ceae8d60f5c6
codeCheckedAgainst: "6.7.13.0"
keywords: ["e2e commands", "e2e:restore-db", "e2e:dump-db", "e2e:setup", "e2e:open", "e2e:prepare", "e2e:cypress", "APP_ENV=e2e", "cypress", "database backup", "end-to-end tests", "SystemRestoreDatabaseCommand"]
summary: "Shopware E2E CLI commands: bin/console e2e:dump-db / e2e:restore-db (APP_ENV=e2e) and composer e2e:setup, e2e:open, e2e:prepare, e2e:cypress."
lastBuilt: 2026-09-15
---
## What it is

Reference table of the command-line commands used to prepare, back up/restore and run Shopware's Cypress end-to-end tests.

## When to use

When setting up or running the platform's Cypress E2E suites for Administration or Storefront, or resetting the database between test runs.

## Key steps / config

| Command | Purpose |
|---|---|
| `APP_ENV=e2e bin/console e2e:dump-db` | Create a backup of the Shopware database |
| `APP_ENV=e2e bin/console e2e:restore-db` | Restore Shopware to the state of the backup (source lists it as `bin/console e2e:restore-db`) |
| `composer run e2e:setup` | Prepare Shopware installation and environment for Cypress |
| `composer run e2e:prepare` | Install dependencies and prepare the database for Cypress |
| `composer run e2e:open` | Open the Cypress test runner |
| `composer e2e:cypress -- run --spec="cypress/e2e/administration/**/*.cy.js"` | Run Administration E2E tests in CLI |
| `composer e2e:cypress -- run --spec="cypress/e2e/storefront/**/*.cy.js"` | Run Storefront E2E tests in CLI |

## Essential identifiers

- `e2e:dump-db` — `Shopware\Core\DevOps\System\Command\SystemDumpDatabaseCommand`
- `e2e:restore-db` — `Shopware\Core\DevOps\System\Command\SystemRestoreDatabaseCommand`
- `APP_ENV=e2e`
- composer scripts `e2e:setup`, `e2e:prepare`, `e2e:open`, `e2e:cypress`

## Gotchas

- In the installed code, both console commands are registered only when `kernel.environment` is `e2e` (`services_e2e.xml` is loaded conditionally), so `e2e:restore-db` also needs `APP_ENV=e2e`.
- Dumps are read from and written to `%kernel.project_dir%/var/dumps`.
- The restore command is also registered as `e2e:cleanup`.
- The composer scripts belong to the Shopware platform repository's `composer.json`, not to a project installed via `vendor/`.

## Code check (6.7.13.0)
- confirmed `e2e:dump-db` — console command on SystemDumpDatabaseCommand — vendor/shopware/core/DevOps/DependencyInjection/services_e2e.xml:13
- corrected `e2e:restore-db` — docs: runs as plain `bin/console e2e:restore-db`; only registered in e2e environment — vendor/shopware/core/DevOps/DependencyInjection/services_e2e.xml:20
- confirmed `services_e2e.xml` — loaded only when kernel.environment is e2e — vendor/shopware/core/DevOps/DevOps.php:29
- confirmed `e2e:cleanup` — second command name on SystemRestoreDatabaseCommand — vendor/shopware/core/DevOps/DependencyInjection/services_e2e.xml:21
- unverified `e2e:setup` — composer script of the platform monorepo, not in the checked roots
- unverified `e2e:cypress` — composer script of the platform monorepo, not in the checked roots
