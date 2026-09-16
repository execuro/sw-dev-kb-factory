---
id: platform/dev/6.6/guides/installation/template.md
title: Project Template
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/installation/template.html
sourceHash: afed90b11d5e8c4cc259de0ca58ddec2d99f5ebb
keywords: ["project template", "composer create-project", "shopware/production", ".env.local", "system:install", "basic-setup", "shopware packagist", "composer recipes:update", "zip installation migration", "shopware-cli project autofix flex"]
summary: "Composer starting point for new Shopware 6.6 projects: creation, install, optional packages, updates, and legacy zip migration."
lastBuilt: 2026-09-15
---

## What it is

The Shopware project template is a Composer project used as the starting point for new
Shopware projects or for developing extensions/themes.

## When to use

When starting a new Shopware project, adding optional dev tooling, updating an existing
installation, or migrating from the legacy zip-based installation to the Composer
template.

## Key steps / config

- Create: `composer create-project shopware/production <project-name>` (or pin a version,
  e.g. `shopware/production:6.6.10.5`); clones the latest tag of the Template repository.
- Bundles like `shopware/administration`, `shopware/storefront`, `shopware/elasticsearch`
  ship by default; remove unneeded ones with `composer remove shopware/<bundle-name>`.
- Put local overrides of `.env` values in `.env.local`, since `.env` is overwritten by the
  Shopware Web Installer during updates.
- Install: `bin/console system:install --basic-setup` (creates admin user and default
  sales channel for `APP_URL`; add `--create-database` if needed). Default credentials:
  `admin` / `shopware`.
- Optional packages: `composer require --dev shopware/dev-tools`,
  `composer require --dev symfony/profiler-pack`,
  `composer require paas --ignore-platform-req=ext-amqp`, `composer require fastly`.
- Build/watch assets via `./bin/build-administration.sh`, `./bin/build-storefront.sh`,
  `./bin/watch-administration.sh`, `./bin/watch-storefront.sh`.
- Update: `bin/console system:update:prepare`, then `composer update --no-scripts`, then
  `bin/console system:update:finish`; or force-update config files with
  `composer recipes:update`.
- Migrate from a pre-6.5 zip install: use `shopware-cli project autofix flex`, or manually
  adjust `composer.json`'s `extra.symfony` endpoints and `scripts`, remove the fixed
  `platform.php` entry, delete legacy files (`.dockerignore`, `Dockerfile`,
  `docker-compose.yml`, etc.), then `composer require "symfony/flex:*" "symfony/runtime:*"`
  and `composer recipe:install --force --reset`.
- Renamed env vars during migration: `MAILER_URL` -> `MAILER_DSN`,
  `SHOPWARE_ES_HOSTS` -> `OPENSEARCH_URL`.

## Essential identifiers

- `composer create-project shopware/production`, `bin/console system:install`,
  `bin/console system:update:prepare`, `bin/console system:update:finish`,
  `composer recipes:update`, `shopware-cli project autofix flex`
- `.env`, `.env.local`, `MAILER_DSN`, `OPENSEARCH_URL`

## Gotchas

- Prior to Shopware 6.4.17.0, `APP_ENV=dev` needs `composer require --dev profiler`
  installed to avoid a missing web_profiler extension error.
- Prior to Shopware 6.4.17.0, `framework:demo-data` needs
  `composer require --dev mbezhanov/faker-provider-collection maltyxx/images-generator`
  to work.
