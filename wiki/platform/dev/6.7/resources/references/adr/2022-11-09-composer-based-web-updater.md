---
id: platform/dev/6.7/resources/references/adr/2022-11-09-composer-based-web-updater.md
title: Composer-based web updater
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-11-09-composer-based-web-updater.html
sourceHash: 1c5f7c24cc88d7006fe078b5ef085fe4ddc0cc56
codeCheckedAgainst: "6.7.15.1"
keywords: ["web updater", "web installer", "composer update", "symfony flex", "phar", "shopware-installer.phar.php", "UpdateHtaccess", "ApiClient", "ExtensionCompatibility", ".env.local", "proc_open", "create-project", "adr"]
summary: "ADR 2022-11-09: replaces the Slim 2 zip-based web updater with a Symfony phar that updates Shopware via composer and Symfony Flex, like the CLI update."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (area: core, 2022-11-09) replacing the old Slim Framework 2 web updater, which downloaded a zip and unpacked a changeset, with a Symfony-based web updater shipped as a single phar file that runs the same composer-based process as the CLI update.

## When to use

When you need to understand how the Administration-triggered Shopware update works, why a web update requires composer and Symfony Flex, or which server requirements and config-file handling the update imposes.

## Key steps / config

Problems with the old updater: an unsupported framework; it assumed shop files were unchanged since the last install/update and only applied a changeset; a user-run Composer command could produce a different dumped autoloader and break the shop; and extensions had to bundle their own dependencies in the extension zip, overriding those of Shopware or other extensions.

Update flow decided by the ADR:

1. The Administration checks that all extensions are compatible with the next Shopware version (in 6.7: `ExtensionCompatibility::getExtensionCompatibilities()`).
2. On clicking the update button, the web updater phar is downloaded and executed (in 6.7: `ApiClient::downloadRecoveryTool()` writes `public/shopware-installer.phar.php`).
3. A project still on the old structure is migrated to Symfony Flex.
4. Maintenance mode is enabled using `bin/console`.
5. `composer update` updates Shopware.
6. `bin/console` updates the database.
7. Maintenance mode is disabled.
8. The phar is deleted and the user is redirected to the Administration.

Because the phar is fetched fresh for every update, updater fixes ship without waiting for a Shopware release. The same tool can install new projects via Composer's `create-project` command.

## Essential identifiers

- `composer update`, `bin/console`, `create-project`
- `proc_open`, `proc_close` — required PHP functions, plus a PHP-CLI binary
- `.env`, `.env.local`, `.htaccess`
- `Shopware\Core\Framework\Update\Services\UpdateHtaccess`
- `Shopware\Core\Framework\Update\Services\ApiClient`
- `Shopware\Core\Framework\Update\Services\ExtensionCompatibility`

## Gotchas

- System requirements change: `proc_open`/`proc_close` must be available and a PHP-CLI binary present.
- Symfony Flex normally needs the `git` binary and an initialised git repository to update config files. The web updater avoids this by backing up `.env` and `.htaccess`, overwriting all config files from a fresh installation, then restoring the backup.
- `.htaccess` changes are merged with `UpdateHtaccess`, which only rewrites the block between its `# BEGIN Shopware` / `# END Shopware` markers.
- For env values, use `.env.local` so the normal `.env` file can be updated.
- The plain CLI update requires an initialised git repository and uses the normal Symfony update flow.

## Version notes

The ADR says the phar is downloaded "from our server"; in 6.7 the download URL is `https://github.com/shopware/web-installer/releases/latest/download/shopware-installer.phar.php`, and the download is skipped when the `SW_RECOVERY_NEXT_VERSION` env var is set.

## Code check (6.7.15.1)
- confirmed `UpdateHtaccess` — event subscriber that updates the Shopware-owned `.htaccess` block — vendor/shopware/core/Framework/Update/Services/UpdateHtaccess.php:14
- confirmed `UpdateHtaccess::MARKER_START` — marker `# BEGIN Shopware` delimits the managed block — vendor/shopware/core/Framework/Update/Services/UpdateHtaccess.php:16
- confirmed `ApiClient::downloadRecoveryTool()` — downloads the updater phar into `public/` — vendor/shopware/core/Framework/Update/Services/ApiClient.php:67
- corrected `shopware-installer.phar.php` — docs: downloaded from Shopware's server; code fetches it from GitHub web-installer releases — vendor/shopware/core/Framework/Update/Services/ApiClient.php:73
- confirmed `SW_RECOVERY_NEXT_VERSION` — when set, the phar download is skipped — vendor/shopware/core/Framework/Update/Services/ApiClient.php:69
- confirmed `ExtensionCompatibility::getExtensionCompatibilities()` — extension compatibility check before update — vendor/shopware/core/Framework/Update/Services/ExtensionCompatibility.php:51
- confirmed `UpdateController::downloadLatestRecovery()` — Admin API action that triggers the phar download — vendor/shopware/core/Framework/Update/Api/UpdateController.php:115
- unverified `proc_open` — PHP runtime requirement of the external updater phar, not in Shopware code roots
