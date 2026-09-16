---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/snippets/guide/app_database_setup.md
sourceHash: 27fd23876f8e7c5a310f6f090dd21654376082f6
sourceUrl: https://developer.shopware.com/docs/snippets/guide/app_database_setup.html
title: App Database Setup
version: "6.7"
versions:
  - "6.7"
keywords: ["app bundle", "AbstractShop", "shop entity", "DATABASE_URL", "doctrine", "postgresql", "mysql", "sqlite", "symfony/maker-bundle", "make:migration", "doctrine:migrations:migrate", "database migration"]
summary: "App Bundle DB setup: set DATABASE_URL (PostgreSQL default, MySQL or SQLite), install maker-bundle and migrations, generate and run migrations."
lastBuilt: 2026-09-15
---
## What it is

Setup snippet for the database of a Symfony app backend built on the Shopware App Bundle. The bundle ships a basic Shop entity (based on the `AbstractShop` class) that stores the shop information; you can extend it to store more app-specific data.

## When to use

When bootstrapping a Symfony-based app server with the App Bundle and you need to pick a database engine and create the initial schema for the shop entity.

## Key steps / config

1. Choose the database engine via the `DATABASE_URL` environment variable in the app's `.env` file. Symfony configures Doctrine for PostgreSQL by default; change the URL to use MySQL.
2. For development you can use SQLite:
   `DATABASE_URL` = `sqlite:///%kernel.project_dir%/var/app.db`
3. Require the two extra Composer packages:
   ```shell
   composer req symfony/maker-bundle migrations
   ```
4. Generate the first migration (it picks up the `AbstractShop`-based entity):
   `bin/console make:migration`
5. Apply it to the database:
   `bin/console doctrine:migrations:migrate`

## Essential identifiers

- `AbstractShop` — App Bundle base class of the Shop entity
- `DATABASE_URL` — Doctrine connection env var in `.env`
- `symfony/maker-bundle`, `migrations` — Composer packages to require
- `bin/console make:migration`, `bin/console doctrine:migrations:migrate`

## Gotchas

- The default engine is PostgreSQL, not MySQL — adjust `DATABASE_URL` if your app uses MySQL.
- The SQLite URL is meant for development only.

## Code check (6.7.13.0)
- unverified `AbstractShop` — part of the App Bundle (shopware/app-bundle), outside vendor/shopware/{core,storefront,administration}; no match in core
- unverified `DATABASE_URL` — refers to the app server's own Symfony `.env`, not the Shopware shop; out of scope
- unverified `make:migration` — command of symfony/maker-bundle, out of scope
- unverified `doctrine:migrations:migrate` — command of doctrine/doctrine-migrations-bundle, out of scope
