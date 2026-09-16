---
id: platform/dev/6.7/guides/installation/legacy-setups/symfony-cli-setup.md
title: Install with Symfony CLI
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/legacy-setups/symfony-cli-setup.html
sourceHash: 0c9fc93a9c19f3c6244e9d96b4f99d9bb782e198
codeCheckedAgainst: "6.7.13.0"
keywords: ["symfony cli", "symfony console system:install", "symfony server:start", "symfony server:stop", "composer create-project shopware/production", ".env.local", "DATABASE_URL", ".php-version", "php.ini", "memory_limit", "--basic-setup", "local development without docker", "ext-intl"]
summary: "Run Shopware locally without Docker via Symfony CLI: create-project, DATABASE_URL in .env.local, symfony console system:install, server:start, .php-version."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md", "platform/dev/6.7/guides/installation/system-requirements.md", "platform/dev/6.7/resources/references/config-reference/server/nginx.md", "platform/dev/6.7/guides/development/start-developing.md"]
---
## What it is

Local Shopware 6 setup using the Symfony CLI with the host's own PHP, Composer, Node.js and database, without Docker. Shopware recommends the [Docker setup](platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md) as the default; Symfony CLI is the lighter alternative.

## When to use

You already have PHP and a database installed locally, or want a low-overhead workflow without containers.

## Key steps / config

Prerequisites (see [system requirements](platform/dev/6.7/guides/installation/system-requirements.md) and the [hosting overview](platform/dev/6.7/guides/hosting/_index.md)): Symfony CLI, PHP 8.2 or higher with required extensions (including `intl`), Composer 2.x, Node.js 20+ with npm, a running MySQL 8 or MariaDB 11. Optional: Elasticsearch 8, Docker for the database only.

1. Create the project:
   ```bash
   composer create-project shopware/production <project-name>
   composer create-project shopware/production:6.6.10.0 <project-name>   # pinned version
   ```
   Symfony Flex asks whether to use Docker; **Yes** runs the database in a container, **No** uses a local MySQL/MariaDB.
2. Configure the database in `.env.local` (git-ignored) in the project root:
   ```dotenv
   DATABASE_URL=mysql://username:password@localhost:3306/dbname
   ```
   Other settings such as `APP_URL`, `MAILER_DSN` or `OPENSEARCH_URL` can go there too.
3. Optional Docker database: `docker compose up -d`; stop with `docker compose down` (keeps data); `docker compose down -v` deletes volumes.
4. Install: `symfony console system:install --basic-setup` (add `--create-database` if the database does not exist). `--basic-setup` creates the admin user and a Storefront sales channel for `APP_URL`.
5. Default Administration login: `admin` / `shopware` — change it after installation.
6. Start the web server: `symfony server:start` (port `8000`; `-d` runs in background; `--port=8080` for another port). Administration at `localhost:8000/admin`, Storefront at `localhost:8000`. Stop with `symfony server:stop`.
7. Pin PHP: create `.php-version` containing e.g. `8.3`, commit it; verify with `symfony php -v`.
8. PHP settings: add a project-root `php.ini`, e.g. `memory_limit = 512M`; verify with `symfony php -i`.
9. Optional: use [Nginx](platform/dev/6.7/resources/references/config-reference/server/nginx.md) or [Caddy](platform/dev/6.7/resources/references/config-reference/server/caddy.md) instead of PHP's built-in server; build/watch Administration and Storefront per the [frontend development guide](platform/dev/6.7/guides/development/start-developing.md).

## Essential identifiers

- `symfony console system:install --basic-setup`, `--create-database`
- `symfony console cache:clear`
- `symfony server:start`, `symfony server:start -d`, `symfony server:stop`
- `shopware/production`
- `.env.local`, `DATABASE_URL`, `APP_URL`, `MAILER_DSN`, `OPENSEARCH_URL`
- `.php-version`, `php.ini`, `symfony php -v`, `symfony php -i`

## Gotchas

- Always prefix commands with `symfony` (e.g. `symfony console`), otherwise the wrong PHP binary may be used or the Docker-based MySQL may be unreachable.
- Homebrew PHP: ensure `intl` is enabled (`brew install php-intl`, check `php -m | grep intl`).
- File-permission issues during install or cache rebuilds: run `symfony console cache:clear` or check directory ownership.
- The docs list `SHOPWARE_ES_HOSTS` as an env setting; the installed code reads `OPENSEARCH_URL` instead.
- `system:install` stops if `install.lock` exists; pass `--force` to reinstall.
- Increase `memory_limit` / `max_execution_time` to avoid failing Administration builds or cache warm-up.

## Code check (6.7.13.0)
- confirmed `system:install` — console command name — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:27
- confirmed `basic-setup` — option creates storefront sales channel and admin user — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:48
- confirmed `create-database` — option creates database if it does not exist — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:46
- confirmed `APP_URL` — basic setup uses it as the storefront sales channel URL — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:139
- confirmed `DATABASE_URL` — required env variable for the installer — vendor/shopware/core/Maintenance/System/Struct/DatabaseConnectionInformation.php:53
- corrected `OPENSEARCH_URL` — docs: SHOPWARE_ES_HOSTS as env setting — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:48
- absent `SHOPWARE_ES_HOSTS` — not referenced anywhere under vendor/shopware
- confirmed `php` — shopware/core requires ~8.2.0 up to ~8.5.0 — vendor/shopware/core/composer.json:51
- confirmed `ext-intl` — required PHP extension — vendor/shopware/core/composer.json:58
- unverified `symfony server:start` — Symfony CLI, outside vendor/shopware scope
