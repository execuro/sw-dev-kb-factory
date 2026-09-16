---
id: platform/dev/6.6/resources/references/core-reference/composer-commands-reference.md
title: Composer Commands Reference
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/core-reference/composer-commands-reference.html
sourceHash: 1badcede7f3f88d3d74f914888cc66767669f7e0
keywords: ["composer commands", "composer setup", "build:js", "bin scripts", "phpstan", "phpunit", "ecs", "eslint", "e2e:setup", "lint", "bc-check"]
summary: "Composer commands for the shopware/shopware core repository; regular projects use ./bin/*.sh scripts instead."
lastBuilt: "2026-09-15"
---

## What it is
Reference list of composer commands for working on the `shopware/shopware` GitHub repository, run as `composer [command] [parameters]`.

## When to use
Use these commands when contributing to Shopware core itself (the `shopware/shopware` repository) — for regular Shopware projects, use the `./bin/*.sh` scripts instead.

## Key steps / config
Run commands as:
```bash
$ composer [command] [parameters]
```
Selected commands by category:
- Setup & build: `setup` (resets and reinstalls the instance, purges the database), `build:js` (builds Administration & Storefront), `build:js:admin`, `build:js:component-library`, `watch:admin`, `build:js:storefront`, `check:license`, `reset` (faster reset without composer/npm install).
- Administration: `admin:create:test`, `admin:generate-entity-schema-types`, `admin:unit`, `admin:unit:watch`, `admin:unit:prepare-vue3`, `admin:unit:vue3`, `admin:unit:watch:vue3`, `npm:admin:check-license`.
- Storefront: `build:js:storefront`, `npm:storefront:check-license`, `watch:storefront`.
- Testsuite & development: `bc-check`, `e2e:setup`, `e2e:open`, `e2e:prepare`, `ecs`, `ecs-fix`, `eslint` (and `eslint:admin`, `eslint:admin:fix`, `eslint:e2e`, `eslint:e2e:fix`, `eslint:storefront`), `init:testdb`, `lint` (shorthand for `stylelint`, `eslint`, `ecs`, `lint:changlog`, `lint:snippets`), `lint:changelog`, `lint:snippets`, `phpstan`, `phpunit`, `phpunit:quarantined`, `storefront:unit`, `storefront:unit:watch`.

## Essential identifiers
- `composer setup`, `composer reset`, `composer build:js`, `composer build:js:admin`, `composer build:js:storefront`
- `composer bc-check`, `composer phpstan`, `composer phpunit`, `composer lint`, `composer ecs`

## Gotchas
These commands are only available inside the `shopware/shopware` GitHub repository (i.e., when contributing to Shopware). For regular projects, use the `./bin/*.sh` scripts instead.
