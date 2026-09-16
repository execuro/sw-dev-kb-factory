---
id: "platform/dev/6.6/resources/references/adr/2022-11-09-composer-based-web-updater.md"
title: "Composer-based web updater"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-11-09-composer-based-web-updater.html"
sourceHash: "1c5f7c24cc88d7006fe078b5ef085fe4ddc0cc56"
keywords: ["composer update", "bin/console", "UpdateHtaccess", ".env.local", "Symfony Flex", "phar", "web updater", "maintenance mode", "create-project", "proc_open", "git binary"]
summary: "ADR: web updater rewritten as a Symfony-based phar using composer update and bin/console, replacing the old Slim Framework 2 updater."
lastBuilt: "2026-09-15"
---
## What it is
ADR replacing Shopware's Slim Framework 2 based zip-unpacking web updater with a new Symfony-based updater packaged as a single phar file, aligned with the CLI/Composer update process.

## When to use
Relevant when understanding how a Shopware installation is updated from the administration UI versus the CLI, and what system requirements that implies.

## Key steps / config
- The phar is downloaded from Shopware's server per update and runs the update.
- Update flow: check extension compatibility, download/run the phar, migrate to Symfony Flex if needed, enable maintenance mode via `bin/console`, run `composer update`, run `bin/console` to update the database, disable maintenance mode, then delete the phar and redirect to the admin.
- New projects can also be created with Composer's `create-project` command.
- Config file merging reuses the existing `UpdateHtaccess` service (marker-based `.htaccess` merging); `.env` files are updated via `.env.local` rather than overwriting `.env` directly, after backing up `.env`/`.htaccess` and restoring them post-update.

## Essential identifiers
`UpdateHtaccess`, `.env.local`, `bin/console`, `composer update`, `create-project`.

## Gotchas
Requires `proc_open`/`proc_close` PHP functions and a PHP-CLI binary; Symfony Flex config updates require the `git` binary and an initialized git repository so config-file changes can be reviewed. The normal CLI update path also requires a git repository.
