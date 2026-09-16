---
id: platform/dev/6.7/resources/references/core-reference/composer-commands-reference.md
title: Composer Commands Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/core-reference/composer-commands-reference.html
sourceHash: 031366768aeffb10683c52f66313351cdda6eaa9
codeCheckedAgainst: "6.7.13.0"
keywords: ["composer scripts", "composer commands", "shopware/shopware", "build:js:admin", "build:js:storefront", "watch:admin", "watch:storefront", "phpunit", "phpstan", "ecs", "eslint", "setup", "contribution", "platform development"]
summary: "Composer scripts of the shopware/shopware repo (contributors only): setup/reset, build:js, watch:admin/storefront, jest units, phpunit, phpstan, ecs, eslint."
lastBuilt: 2026-09-15
---
## What it is

The composer scripts defined in the `shopware/shopware` GitHub repository for building, watching, linting and testing the platform, run as `composer [command] [parameters]`.

## When to use

Only when contributing to Shopware itself inside a `shopware/shopware` checkout. In regular projects these scripts do not exist; use the `./bin/*.sh` scripts instead.

## Key steps / config

Setup and build:

- `setup` — resets and re-installs the instance; the database is purged.
- `reset` — resets without composer/npm install (faster when dependencies are unchanged).
- `build:js` — `build:js:admin` plus `build:js:storefront`.
- `build:js:admin` — includes `bundle:dump`, `feature:dump`, `admin:generate-entity-schema-types` and `assets:install`.
- `build:js:storefront` — includes `bundle:dump`, `feature:dump` and `theme:compile`.
- `build:js:component-library`, `check:license`.
- `watch:admin`, `watch:storefront` — builds with hot module reloading.

Administration: `admin:create:test`, `admin:generate-entity-schema-types`, `admin:unit`, `admin:unit:watch`, `admin:unit:prepare-vue3`, `admin:unit:vue3`, `admin:unit:watch:vue3`, `npm:admin:check-license`.

Storefront: `npm:storefront:check-license`, `storefront:unit`, `storefront:unit:watch`.

Testsuite and development:

- `bc-check` — backwards-compatibility break check for the current branch.
- `e2e:setup` (launches `e2e:prepare`), `e2e:open` (Cypress UI), `e2e:prepare`.
- `ecs`, `ecs-fix` — Easy Coding Standard.
- `eslint`, `eslint:admin`, `eslint:admin:fix`, `eslint:e2e`, `eslint:e2e:fix`, `eslint:storefront`.
- `lint` — runs `stylelint`, `eslint`, `ecs`, the changelog lint and `lint:snippets`; `lint:changelog`, `lint:snippets`.
- `init:testdb`, `phpstan`, `phpunit`, `phpunit:quarantined`.

## Essential identifiers

- `composer setup`, `composer reset`
- `build:js`, `build:js:admin`, `build:js:storefront`
- `watch:admin`, `watch:storefront`
- `admin:unit`, `storefront:unit`, `phpunit`, `phpstan`, `ecs`, `eslint`, `lint`

## Gotchas

- `setup` purges the database.
- The source's description of `lint` spells the changelog step `lint:changlog`; the script it lists separately is `lint:changelog`.
- The build scripts invoke the console commands `bundle:dump`, `feature:dump`, `theme:compile` and `assets:install`; outside the repository you can run those directly via `bin/console`.

## Code check (6.7.13.0)
- confirmed `bundle:dump` — console command used by both JS builds — vendor/shopware/core/Framework/Plugin/Command/BundleDumpCommand.php:14
- confirmed `feature:dump` — console command used by both JS builds — vendor/shopware/core/Framework/Feature/Command/FeatureDumpCommand.php:15
- confirmed `theme:compile` — storefront console command used by `build:js:storefront` — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
- unverified `build:js:admin` — composer scripts live in the shopware/shopware root composer.json, outside the checked roots
- unverified `admin:generate-entity-schema-types` — composer script, not part of the checked vendor roots
- unverified `assets:install` — Symfony FrameworkBundle command, vendor/symfony out of scope
