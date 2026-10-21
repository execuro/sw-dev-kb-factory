---
id: platform/dev/6.7/resources/references/testing-reference/e2e-commands.md
title: E2E Commands
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/testing-reference/e2e-commands.html
sourceHash: a2162bd929fd84f1055b697c9175ceae8d60f5c6
codeCheckedAgainst: "6.7.15.1"
keywords: ["e2e", "cypress", "end-to-end tests", "e2e:restore-db", "e2e:dump-db", "e2e:setup", "e2e:open", "e2e:prepare", "e2e:cypress", "APP_ENV=e2e", "database backup"]
summary: Commands for Shopware Cypress E2E tests - database dump/restore, e2e:setup, e2e:prepare, e2e:open and running admin/storefront specs.
lastBuilt: 2026-10-21
---
## What it is

A table of the commands used to prepare a Shopware installation for Cypress end-to-end tests, back up and restore its database, and run the admin or storefront E2E specs.

## When to use

When setting up or running the Cypress E2E suite against a Shopware platform checkout, or resetting the database to a known state between test runs.

## Key steps / config

| Command | Purpose |
|---|---|
| `bin/console e2e:restore-db` | Sets Shopware back to the state of the backup |
| `APP_ENV=e2e bin/console e2e:dump-db` | Creates a backup of Shopware's database |
| `composer run e2e:setup` | Prepares the installation and environment for Cypress |
| `composer run e2e:open` | Opens the Cypress E2E test runner |
| `composer run e2e:prepare` | Installs dependencies and prepares the database for Cypress |
| `composer e2e:cypress -- run --spec="cypress/e2e/administration/**/*.cy.js"` | Runs admin E2E tests in the CLI |
| `composer e2e:cypress -- run --spec="cypress/e2e/storefront/**/*.cy.js"` | Runs storefront E2E tests in the CLI |

## Essential identifiers

- `e2e:restore-db`, `e2e:dump-db` (`bin/console`)
- `e2e:setup`, `e2e:open`, `e2e:prepare`, `e2e:cypress` (composer scripts)
- Spec globs `cypress/e2e/administration/**/*.cy.js`, `cypress/e2e/storefront/**/*.cy.js`

## Gotchas

- `e2e:dump-db` is run with `APP_ENV=e2e`.
- Arguments after `--` are passed through to Cypress (`run --spec=...`).

## Code check (6.7.15.1)
- unverified `e2e:restore-db` — no console command with this name in the checked core/storefront/administration roots; provided by the E2E test tooling
- unverified `e2e:dump-db` — no console command with this name in the checked package roots
- unverified `e2e:setup` — composer script in the repository root composer.json, out of scope
- unverified `e2e:cypress` — composer script in the repository root composer.json, out of scope
