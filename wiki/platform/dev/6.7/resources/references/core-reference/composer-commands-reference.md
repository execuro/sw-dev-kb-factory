---
id: platform/dev/6.7/resources/references/core-reference/composer-commands-reference.md
title: Composer Commands Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/core-reference/composer-commands-reference.html
sourceHash: 031366768aeffb10683c52f66313351cdda6eaa9
codeCheckedAgainst: "6.7.15.1"
keywords: ["composer scripts", "composer setup", "build:js", "build:js:admin", "build:js:storefront", "watch:admin", "watch:storefront", "admin:unit", "phpunit", "phpstan", "ecs", "lint", "e2e:setup", "bc-check", "contributing"]
summary: Composer scripts of the shopware/shopware repo for setup, JS builds, watchers, linting, PHPUnit/Jest/E2E test suites; not available in regular projects.
lastBuilt: 2026-10-21
---
## What it is

A list of the composer scripts defined in the `shopware/shopware` GitHub repository, run as `composer [command] [parameters]`. They cover instance setup, building and watching the Administration and Storefront, linting, and launching the test suites.

## When to use

When contributing to Shopware itself, i.e. working in a clone of the `shopware/shopware` repository. In a regular Shopware project these scripts do not exist; use the `./bin/*.sh` scripts instead.

## Key steps / config

```bash
composer [command] [parameters]
```

**Setup & build**

- `setup` — resets and re-installs the instance; the database is purged.
- `reset` — resets the instance without composer and npm install (faster when dependencies did not change).
- `build:js` — builds Administration and Storefront; combines `build:js:admin` and `build:js:storefront`.
- `build:js:admin` — builds the Administration; includes `bundle:dump`, `feature:dump`, `admin:generate-entity-schema-types` and `assets:install`.
- `build:js:storefront` — builds the Storefront JavaScript; includes `bundle:dump`, `feature:dump` and `theme:compile`.
- `build:js:component-library` — builds the component library.
- `watch:admin` / `watch:storefront` — build with hot module reloading.
- `check:license`, `npm:admin:check-license`, `npm:storefront:check-license` — check third-party dependency licenses (composer, Administration, Storefront).

**Administration**

- `admin:create:test` — generates a test boilerplate.
- `admin:generate-entity-schema-types` — converts entity schemas to data types.
- `admin:unit`, `admin:unit:watch` — Jest unit suite for the Admin (single run / interactive watcher).
- `admin:unit:prepare-vue3`, `admin:unit:vue3`, `admin:unit:watch:vue3` — the same suite with Vue3.

**Testsuite & development**

- `bc-check` — checks the current branch for backwards compatibility breaks.
- `e2e:setup` — installs a clean instance for E2E and launches `e2e:prepare`; `e2e:prepare` installs the Admin Extension SDK test plugin with fixtures and dumps the database; `e2e:open` launches the Cypress UI.
- `ecs` / `ecs-fix` — Easy Coding Standard check / fix.
- `eslint` (all JS/TS), `eslint:admin`, `eslint:admin:fix`, `eslint:e2e`, `eslint:e2e:fix`, `eslint:storefront`.
- `lint` — shorthand for `stylelint`, `eslint`, `ecs`, `lint:changelog` and `lint:snippets`.
- `lint:changelog` — validates changelogs; `lint:snippets` — validates snippets exist in all core-supported languages.
- `init:testdb` — initializes the test database.
- `phpstan` — PHP static analysis; `phpunit` — PHP unit suite; `phpunit:quarantined` — quarantined tests.
- `storefront:unit`, `storefront:unit:watch` — Jest unit suite for the Storefront.

## Essential identifiers

- `setup`, `reset`, `build:js`, `build:js:admin`, `build:js:storefront`, `watch:admin`, `watch:storefront`
- `admin:unit`, `storefront:unit`, `phpunit`, `phpstan`, `ecs`, `lint`, `bc-check`, `e2e:setup`
- Console commands invoked by the builds: `bundle:dump`, `feature:dump`, `assets:install`, `theme:compile`

## Gotchas

- `setup` purges the database.
- The source's `lint` row spells the changelog script `lint:changlog`; the script listed separately is `lint:changelog`.

## Code check (6.7.15.1)
- confirmed `bundle:dump` — console command run by `build:js:admin`/`build:js:storefront` — vendor/shopware/core/Framework/Plugin/Command/BundleDumpCommand.php:16
- confirmed `feature:dump` — console command, alias `administration:dump:features` — vendor/shopware/core/Framework/Feature/Command/FeatureDumpCommand.php:16
- confirmed `assets:install` — console command run by `build:js:admin` — vendor/shopware/core/Framework/Adapter/Asset/AssetInstallCommand.php:23
- confirmed `theme:compile` — Storefront console command run by `build:js:storefront` — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:21
- unverified `admin:generate-entity-schema-types` — not found in the core/storefront/administration src roots; defined outside the checked package roots
- unverified `build:js` — composer scripts live in the repository root composer.json, out of scope of the checked package roots
