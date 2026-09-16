---
id: platform/dev/6.6/concepts/framework/migrations.md
title: Migrations
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/framework/migrations.html
sourceHash: 5f7b23dce55523d8c77d96cc2144cee01ad2a2b6
keywords: ["migrations", "migration", "database schema", "changeset", "update", "updateDestructive", "Migration directory", "plugin migrations", "console command", "schema change", "rollback", "database changes"]
summary: "Migrations are PHP classes with update/updateDestructive methods that apply or revert plugin database schema changes."
lastBuilt: "2026-09-15"
---
## What it is

Migrations are PHP classes containing database schema changesets. These changesets can be applied or reverted to bring the database into a certain state — a concept similar to migrations in other frameworks or in Symfony.

## When to use

Use a migration whenever a plugin needs to change the database schema (create or alter tables/columns) and wants Shopware to apply or roll back that change in a controlled way.

## Key steps / config

- Place migration files in the `Migration` directory under the plugin's source code root directory so Shopware recognizes them as plugin migrations.
- Each migration filename follows a specific pattern; Shopware provides a console command that generates a correctly named migration file with the default methods already scaffolded.
- Each migration class can define two methods:
  - `update` — must contain only non-destructive changes that can be rolled back at any time.
  - `updateDestructive` — can contain destructive changes (e.g. dropping columns or tables) that cannot be reversed.

## Essential identifiers

- `Migration` directory (plugin source root)
- `update` method
- `updateDestructive` method
