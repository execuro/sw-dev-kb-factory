---
id: platform/dev/6.6/snippets/guide/app_database_setup.md
title: App Database Setup
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/snippets/guide/app_database_setup.html
sourceHash: 27fd23876f8e7c5a310f6f090dd21654376082f6
keywords: ["App Bundle", "Shop entity", "AbstractShop", "DATABASE_URL", "doctrine", "PostgreSQL", "MySQL", "SQLite", "symfony/maker-bundle", "migrations", "bin/console make:migration", "bin/console doctrine:migrations:migrate", "app database"]
summary: "Configuring the database engine and running the first migration for an App Bundle's Shop entity using Doctrine and Symfony's maker-bundle."
lastBuilt: "2026-09-15"
---
## What it is
Describes how to configure the database used by an App Bundle, which ships with a basic Shop entity that can be extended to store more app information.

## When to use
When setting up or changing the database engine for a Shopware app built with the App Bundle, before running the app's first migration.

## Key steps / config
- Symfony configures doctrine to use PostgreSQL by default. Change the `DATABASE_URL` environment variable in your `.env` file to use MySQL instead.
- To use SQLite (for development), set `DATABASE_URL` to `sqlite:///%kernel.project_dir%/var/app.db`.
- After choosing the database engine, require two extra composer packages:

```shell
composer req symfony/maker-bundle migrations
```

- Create the first migration with `bin/console make:migration` (which uses the `AbstractShop` class) and apply it with `bin/console doctrine:migrations:migrate`.

## Essential identifiers
- `DATABASE_URL` (env var, in `.env`)
- `AbstractShop` (class used by `make:migration`)
- `bin/console make:migration`
- `bin/console doctrine:migrations:migrate`
- `symfony/maker-bundle`, `migrations` (composer packages)
