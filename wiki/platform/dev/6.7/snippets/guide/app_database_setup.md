---
id: platform/dev/6.7/snippets/guide/app_database_setup.md
title: App Database Setup
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/snippets/guide/app_database_setup.html
sourceHash: 60f974b082ca9928fe335efb0a700cf76b64b82e
codeCheckedAgainst: "6.7.15.1"
keywords: ["app bundle", "app backend", "database setup", "DATABASE_URL", "AbstractShop", "shop entity", "doctrine", "postgresql", "mysql", "sqlite", "make:migration", "doctrine:migrations:migrate", "symfony/maker-bundle"]
summary: App Bundle backend database setup - DATABASE_URL for PostgreSQL, MySQL or SQLite, then Doctrine migrations for the Shop entity.
lastBuilt: 2026-10-21
---
## What it is

Setup steps for the database of a Symfony-based app backend built with the Shopware App Bundle. The bundle ships a basic Shop entity storing the shop information; you can extend it to store more data for your app.

## When to use

When bootstrapping an app server with the App Bundle and you need to choose a database engine and create the initial schema.

## Key steps / config

1. Pick the engine via the `DATABASE_URL` environment variable in `.env`. Symfony configures Doctrine for PostgreSQL by default; change the URL to use MySQL. For development, SQLite works with `sqlite:///%kernel.project_dir%/var/app.db`.
2. Install the extra packages:
   ```shell
   composer req symfony/maker-bundle migrations
   ```
3. Generate the first migration (based on the `AbstractShop` class) with `bin/console make:migration`.
4. Apply it with `bin/console doctrine:migrations:migrate`.

## Essential identifiers

`DATABASE_URL`, `AbstractShop`, `symfony/maker-bundle`, `bin/console make:migration`, `bin/console doctrine:migrations:migrate`

## Code check (6.7.15.1)
- unverified `AbstractShop` — belongs to the App Bundle (a separate package), not in the core/storefront/administration roots; out of scope
- unverified `DATABASE_URL` — here an env var of the app's own Symfony project, not of the Shopware installation; out of scope
- unverified `doctrine:migrations:migrate` — Doctrine Migrations command, outside the checked package roots
