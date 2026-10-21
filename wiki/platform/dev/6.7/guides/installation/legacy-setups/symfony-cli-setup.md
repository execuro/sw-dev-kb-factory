---
id: platform/dev/6.7/guides/installation/legacy-setups/symfony-cli-setup.md
title: Install with Symfony CLI
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/legacy-setups/symfony-cli-setup.html
sourceHash: 0c9fc93a9c19f3c6244e9d96b4f99d9bb782e198
codeCheckedAgainst: "6.7.15.1"
keywords: ["symfony cli", "symfony server:start", "symfony console system:install", "--basic-setup", "shopware/production", "composer create-project", ".env.local", "DATABASE_URL", "APP_URL", ".php-version", "php.ini", "memory_limit", "local web server", "without docker"]
summary: "Run Shopware locally without Docker via Symfony CLI: .env.local DATABASE_URL, symfony console system:install, symfony server:start."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md", "platform/dev/6.7/guides/installation/system-requirements.md", "platform/dev/6.7/guides/hosting/_index.md", "platform/dev/6.7/resources/references/config-reference/server/nginx.md"]
---
## What it is

Guide to running Shopware 6 locally with Symfony CLI on the host's own PHP, Composer and Node.js, without Docker for the app (optionally Docker for the database only). [Docker](platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md) remains the recommended default.

## When to use

You already have PHP and a database installed locally, or want a low-overhead workflow. Check the [system requirements](platform/dev/6.7/guides/installation/system-requirements.md) first.

## Key steps / config

Prerequisites: Symfony CLI; PHP 8.2+ with required extensions (see [recommended stack](platform/dev/6.7/guides/hosting/_index.md)); Composer 2.x; Node.js 20+ and npm; a running MySQL 8 or MariaDB 11. Optional: Elasticsearch 8, Docker for the database.

1. Create the project:
   `composer create-project shopware/production <project-name>` (or `shopware/production:6.6.10.0`). Flex asks whether to use Docker — **Yes** to run the database in a container.
2. Configure `.env.local` (git-ignored):

```dotenv
DATABASE_URL=mysql://username:password@localhost:3306/dbname
```

   Other settings such as `APP_URL`, `MAILER_DSN` or `OPENSEARCH_URL` go here too.
3. Database in Docker (optional): `docker compose up -d`; stop with `docker compose down`; `docker compose down -v` also deletes data volumes.
4. Install: `symfony console system:install --basic-setup` (add `--create-database` if the database does not exist). `--basic-setup` creates the admin user and a Storefront sales channel for `APP_URL`. Admin login: `admin` / `shopware` — change after install.
5. Start the server: `symfony server:start` (port 8000; `-d` for background; `--port=8080` if 8000 is taken); stop with `symfony server:stop`. Admin at `/admin`, Storefront at the root.
6. Pin PHP: a `.php-version` file containing e.g. `8.3`; check with `symfony php -v`.
7. PHP settings: a project-root `php.ini`, e.g. `memory_limit = 512M`; check with `symfony php -i`.

Symfony CLI uses PHP's built-in web server by default; [Nginx](platform/dev/6.7/resources/references/config-reference/server/nginx.md) or [Caddy](platform/dev/6.7/resources/references/config-reference/server/caddy.md) give better performance. Frontend build/watch: see [start developing](platform/dev/6.7/guides/development/start-developing.md).

## Essential identifiers

- `symfony console system:install --basic-setup`, `--create-database`
- `symfony server:start`, `symfony server:stop`, `symfony console cache:clear`
- `.env.local`, `DATABASE_URL`, `APP_URL`, `MAILER_DSN`, `OPENSEARCH_URL`
- `.php-version`, `php.ini`, `memory_limit`

## Gotchas

- Always prefix commands with `symfony` so the right PHP binary is used and the Docker-based database is reachable.
- Homebrew PHP: enable `intl` (`brew install php-intl`, verify `php -m | grep intl`).
- File-permission problems during install or cache rebuild: `symfony console cache:clear`.
- The source lists `SHOPWARE_ES_HOSTS` as a `.env.local` setting; the 6.7 code does not read it — use `OPENSEARCH_URL`.
- The installer's requirement check expects `memory_limit` of at least `512M`.

## Code check (6.7.15.1)
- confirmed `system:install` — command name — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:31
- confirmed `--create-database` — creates database if missing — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:50
- confirmed `--basic-setup` — creates admin user and storefront sales channel — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:52
- confirmed `APP_URL` — basic setup uses it as the storefront sales channel URL — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:143
- confirmed `admin` — basic setup creates admin with password shopware — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:134
- confirmed `DATABASE_URL` — read by the MySQL connection factory — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:42
- corrected `OPENSEARCH_URL` — docs: SHOPWARE_ES_HOSTS as the search host env var — vendor/shopware/core/Maintenance/System/Command/SystemSetupCommand.php:83
- absent `SHOPWARE_ES_HOSTS` — not found anywhere in the installed code
- confirmed `memory_limit` — installer requirement check reads it, minimum 512M — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:48
- unverified `symfony server:start` — Symfony CLI, outside the checked packages
