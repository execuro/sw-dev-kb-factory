---
id: platform/dev/6.7/resources/references/adr/2022-11-09-composer-based-web-updater.md
title: Composer-based web updater
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-11-09-composer-based-web-updater.html
sourceHash: 1c5f7c24cc88d7006fe078b5ef085fe4ddc0cc56
codeCheckedAgainst: "6.7.13.0"
keywords: ["web updater", "phar", "composer update", "Symfony Flex", "UpdateHtaccess", "UpdatePostFinishEvent", "system:update:prepare", "system:update:finish", "sales-channel:maintenance:enable", ".env.local", "proc_open", "shopware update", "create-project"]
summary: "ADR: Shopware updates via a downloaded Symfony-based phar running composer update; needs proc_open/PHP-CLI, migrates to Symfony Flex, keeps .env/.htaccess."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2022-11-09, area core) replacing the Slim Framework 2 web updater, which unpacked a zip changeset over the shop, with a Symfony-based updater packaged as a single phar that uses the same Composer update process as the CLI.

## When to use

When updating a Shopware installation through the Administration, when a project still uses the old (pre-Flex) structure, or when checking server requirements and config-file handling for updates.

## Key steps / config

Update process of the new web updater:

1. The Shopware Admin checks that all extensions are compatible with the next Shopware version.
2. On clicking the update button, the phar is downloaded from Shopware's server and executed (always the newest updater, independent of Shopware releases).
3. A project on the old structure is migrated to Symfony Flex.
4. Maintenance mode is enabled via `bin/console`.
5. `composer update` updates Shopware.
6. `bin/console` updates the database.
7. Maintenance mode is disabled.
8. The phar is deleted and the user redirected to the Shopware Admin.

The installed core provides `system:update:prepare`, `system:update:finish`, `sales-channel:maintenance:enable` and `sales-channel:maintenance:disable`. After the update finishes, `UpdateHtaccess` (subscriber to `UpdatePostFinishEvent`) refreshes `.htaccess` from `.htaccess.dist`, replacing only the lines between `# BEGIN Shopware` and `# END Shopware`.

New projects can be set up the same way using Composer's `create-project` command.

## Essential identifiers

- `composer update`, `create-project`
- `UpdateHtaccess`, `UpdatePostFinishEvent`
- `system:update:prepare`, `system:update:finish`
- `.env`, `.env.local`, `.htaccess`

## Gotchas

- System requirements: PHP functions `proc_open` and `proc_close` and a PHP-CLI binary must be available.
- Symfony Flex needs the `git` binary and an initialised repository to update config files. The web updater avoids this by backing up `.env` and `.htaccess`, overwriting all config files from a fresh installation and restoring the backup; `.env` customisations belong in `.env.local`.
- The normal CLI update requires an initialised git repository and uses the standard Symfony update flow.
- `UpdateHtaccess` skips the merge if either marker was removed from `.htaccess` or no `.htaccess.dist` exists; known old default files are replaced wholesale. The class is `@internal`.
- Problems addressed: the old updater assumed untouched shop files and could break the dumped autoloader after user Composer commands; extensions had to bundle their own dependencies.

## Code check (6.7.13.0)
- confirmed `UpdateHtaccess` — subscriber class, marked internal — vendor/shopware/core/Framework/Update/Services/UpdateHtaccess.php:14
- confirmed `UpdatePostFinishEvent` — triggers the htaccess update — vendor/shopware/core/Framework/Update/Services/UpdateHtaccess.php:35
- confirmed `MARKER_START` — only lines between the Shopware markers are replaced — vendor/shopware/core/Framework/Update/Services/UpdateHtaccess.php:16
- confirmed `UpdateHtaccess::update()` — requires .htaccess and .htaccess.dist, skips if markers missing — vendor/shopware/core/Framework/Update/Services/UpdateHtaccess.php:39
- confirmed `system:update:prepare` — console command — vendor/shopware/core/Maintenance/System/Command/SystemUpdatePrepareCommand.php:21
- confirmed `system:update:finish` — console command — vendor/shopware/core/Maintenance/System/Command/SystemUpdateFinishCommand.php:29
- confirmed `sales-channel:maintenance:enable` — console command — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceEnableCommand.php:21
- confirmed `sales-channel:maintenance:disable` — console command — vendor/shopware/core/Maintenance/SalesChannel/Command/SalesChannelMaintenanceDisableCommand.php:12
- unverified `phar` — the web updater itself is a separate tool, not in vendor/shopware
