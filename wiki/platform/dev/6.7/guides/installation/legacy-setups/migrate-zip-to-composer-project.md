---
id: platform/dev/6.7/guides/installation/legacy-setups/migrate-zip-to-composer-project.md
title: Migrate Zip Installation to Composer Project
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/legacy-setups/migrate-zip-to-composer-project.html
sourceHash: 45790c72d378b9bc5294e59de6256d5e3c825748
codeCheckedAgainst: "6.7.13.0"
keywords: ["zip installation", "composer project template", "symfony flex", "shopware-cli project autofix flex", "symfony/flex", "symfony/runtime", "composer recipe:install", "composer recipes:update", "MAILER_DSN", "OPENSEARCH_URL", "MAILER_URL", "SHOPWARE_ES_HOSTS", "legacy migration"]
summary: "Convert a pre-6.5 zip-based Shopware install to the Symfony Flex Composer template: shopware-cli autofix or manual composer.json, cleanup, env var renames."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/installation/_index.md"]
---
## What it is

Migration steps for legacy Shopware installations created before 6.5 from the deprecated zip distribution (all dependencies bundled) to the Composer-based project template using Symfony Flex. New projects should use the regular [installation guide](platform/dev/6.7/guides/installation/_index.md) instead.

## When to use

You maintain a shop originally installed from the zip archive and want proper dependency management, Flex-managed configuration, easier CI/CD and extension management.

## Key steps / config

**Automatic (recommended):**

```bash
shopware-cli project autofix flex
```

**Manual:**

1. Backup: ensure a clean Git state; stash everything or back up files and database.
2. Root `composer.json` — add the Flex endpoint, replace all scripts, and remove the fixed `config.platform.php` entry (PHP is then determined by the required packages):
   ```json
   "extra": { "symfony": { "allow-contrib": true, "endpoint": [
       "https://raw.githubusercontent.com/shopware/recipes/flex/main/index.json",
       "flex://defaults" ] } },
   "scripts": {
       "auto-scripts": [],
       "post-install-cmd": ["@auto-scripts"],
       "post-update-cmd": ["@auto-scripts"]
   }
   ```
3. Remove obsolete template files: `.dockerignore`, `.editorconfig`, `.env.dist`, `.github`, `.gitlab-ci`, `.gitlab-ci.yml`, `Dockerfile`, `docker-compose.yml`, `easy-coding-standard.php`, `PLATFORM_COMMIT_SHA`, `artifacts`, `bin/deleted_files_vendor.sh`, `bin/entrypoint.sh`, `bin/package.sh`, `config/etc`, `src`, `config/secrets`, `config/services`, `config/services.xml`, `config/services_test.xml`, `license.txt`, `phpstan.neon`, `phpunit.xml.dist`, `psalm.xml`. Then create an empty env file: `touch .env`.
4. Install Flex (Composer must be installed; allow both new Composer plugins):
   ```bash
   composer require "symfony/flex:*" "symfony/runtime:*"
   composer recipe:install --force --reset
   ```
5. Rename environment variables to the names the installed code uses: the mailer DSN is `MAILER_DSN`, the search host is `OPENSEARCH_URL`.
6. Review and commit. Later config changes are applied with `composer recipes:update`.

## Essential identifiers

- `shopware-cli project autofix flex`
- `symfony/flex`, `symfony/runtime`
- `composer recipe:install --force --reset`, `composer recipes:update`
- `flex://defaults`, `auto-scripts`
- `MAILER_DSN`, `OPENSEARCH_URL`

## Gotchas

- Only for installations created before 6.5 via the zip distribution.
- Old env names are not read by the installed code: `MAILER_URL` becomes `MAILER_DSN`, `SHOPWARE_ES_HOSTS` becomes `OPENSEARCH_URL`.
- Remove legacy files only after installing the new Composer packages.

## Version notes

- Before Shopware 6.5, Shopware shipped as a zip archive; from 6.5 on, the Composer project template with Symfony Flex replaces it.

## Code check (6.7.13.0)
- confirmed `MAILER_DSN` — mailer DSN variable in the Flex default .env written by the installer — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:35
- confirmed `OPENSEARCH_URL` — search host variable written to .env and .env.local — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:48
- absent `SHOPWARE_ES_HOSTS` — old name, no longer referenced anywhere under vendor/shopware
- absent `MAILER_URL` — old name, no longer referenced anywhere under vendor/shopware
- confirmed `symfony/runtime` — required by shopware/core — vendor/shopware/core/composer.json:153
- unverified `shopware-cli project autofix flex` — Shopware CLI tool, outside vendor/shopware scope
- unverified `composer recipe:install` — Symfony Flex Composer plugin, outside vendor/shopware scope
