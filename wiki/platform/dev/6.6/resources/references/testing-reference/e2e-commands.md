---
id: platform/dev/6.6/resources/references/testing-reference/e2e-commands.md
sourceHash: 90f3a4545783f1a12f752de2754f0cfee12ebf4e
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/testing-reference/e2e-commands.html
title: E2E Commands
version: "6.6"
versions: ["6.6"]
docType: developer
keywords: ["e2e commands", "e2e:restore-db", "e2e:dump-db", "e2e:setup", "e2e:open", "e2e:prepare", "e2e:cypress", "cypress tests", "bin/console", "composer run", "APP_ENV"]
summary: "Reference table of console/composer commands for restoring, seeding, and running Shopware's Cypress e2e test suite."
lastBuilt: 2026-09-15
---
## What it is

Reference table of the console and composer commands used to prepare, run, and reset Shopware's Cypress-based e2e tests.

## Key steps / config

- `bin/console e2e:restore-db` — sets Shopware back to the state of the backup.
- `APP_ENV=e2e bin/console e2e:dump-db` — creates a backup of Shopware's database.
- `composer run e2e:setup` — prepares the Shopware installation and environment for Cypress usage.
- `composer run e2e:open` — opens Cypress' e2e test runner.
- `composer run e2e:prepare` — installs dependencies and prepares the database for Cypress usage.
- `composer e2e:cypress -- run --spec="cypress/e2e/administration/**/*.cy.js"` — runs Cypress' admin e2e tests in CLI.
- `composer e2e:cypress -- run --spec="cypress/e2e/storefront/**/*.cy.js"` — runs Cypress' storefront e2e tests in CLI.

## Essential identifiers

`bin/console e2e:restore-db`, `bin/console e2e:dump-db`, `composer run e2e:setup`, `composer run e2e:open`, `composer run e2e:prepare`, `composer e2e:cypress`.
