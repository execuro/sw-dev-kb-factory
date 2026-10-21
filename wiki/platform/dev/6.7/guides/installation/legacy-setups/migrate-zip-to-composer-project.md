---
id: platform/dev/6.7/guides/installation/legacy-setups/migrate-zip-to-composer-project.md
title: Migrate Zip Installation to Composer Project
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/legacy-setups/migrate-zip-to-composer-project.html
sourceHash: 45790c72d378b9bc5294e59de6256d5e3c825748
codeCheckedAgainst: "6.7.15.1"
keywords: ["zip installation", "composer project template", "symfony flex", "shopware-cli project autofix flex", "composer.json", "symfony/flex", "symfony/runtime", "composer recipe:install", "composer recipes:update", "MAILER_DSN", "OPENSEARCH_URL", "legacy migration"]
summary: Convert a pre-6.5 zip-based Shopware install to the Symfony Flex Composer project template, via shopware-cli autofix or manual composer.json changes.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/installation/_index.md"]
---
## What it is

Migration guide for legacy Shopware installations created before 6.5 from the deprecated zip distribution, converting them to the Composer-based project template using Symfony Flex. New projects should use the regular [installation guide](platform/dev/6.7/guides/installation/_index.md).

## When to use

You maintain a shop originally installed from the pre-6.5 zip archive and want Composer dependency management, Flex recipes and easier CI/CD.

## Key steps / config

Automatic (recommended): `shopware-cli project autofix flex`

Manual:

1. Backup: clean Git state, or stash / full backup of files and database.
2. Root `composer.json` — add the Flex config:

```json
"extra": {
    "symfony": {
        "allow-contrib": true,
        "endpoint": [
            "https://raw.githubusercontent.com/shopware/recipes/flex/main/index.json",
            "flex://defaults"
        ]
    }
}
```

   Replace all existing `scripts` with `auto-scripts: []`, `post-install-cmd: ["@auto-scripts"]`, `post-update-cmd: ["@auto-scripts"]`. Remove any fixed `config.platform.php` entry (PHP is now determined by required packages).
3. After installing the new packages, delete obsolete template files: `.dockerignore`, `.editorconfig`, `.env.dist`, `.github`, `.gitlab-ci`, `.gitlab-ci.yml`, `Dockerfile`, `docker-compose.yml`, `easy-coding-standard.php`, `PLATFORM_COMMIT_SHA`, `artifacts`, `bin/deleted_files_vendor.sh`, `bin/entrypoint.sh`, `bin/package.sh`, `config/etc`, `src`, `config/secrets`, `config/services`, `config/services.xml`, `config/services_test.xml`, `license.txt`, `phpstan.neon`, `phpunit.xml.dist`, `psalm.xml`. Then `touch .env`.
4. Install Flex (allow both new Composer plugins):
   `composer require "symfony/flex:*" "symfony/runtime:*"`
   `composer recipe:install --force --reset`
5. Update environment variables to the names the 6.7 code reads: mail via `MAILER_DSN`, search via `OPENSEARCH_URL` (renamed from older names, see Gotchas).
6. Commit. Later config changes are applied with `composer recipes:update`.

## Essential identifiers

- `shopware-cli project autofix flex`
- `symfony/flex`, `symfony/runtime`
- `composer recipe:install --force --reset`, `composer recipes:update`
- `extra.symfony.endpoint`, `flex://defaults`
- `MAILER_DSN`, `OPENSEARCH_URL`

## Gotchas

- Renamed env vars: `MAILER_URL` → `MAILER_DSN`, `SHOPWARE_ES_HOSTS` → `OPENSEARCH_URL`. The old names are not read anywhere in the 6.7 code.
- Only applies to pre-6.5 zip installs.

## Code check (6.7.15.1)
- confirmed `MAILER_DSN` — mailer dsn bound to this env var — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:37
- confirmed `OPENSEARCH_URL` — env var written/read by system:setup for Elasticsearch hosts — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:83
- absent `MAILER_URL` — old variable name, not found in the installed code
- absent `SHOPWARE_ES_HOSTS` — old variable name, not found in the installed code
- unverified `shopware-cli project autofix flex` — Shopware CLI, outside the checked packages
- unverified `composer recipe:install` — Composer/Symfony Flex command, out of scope
