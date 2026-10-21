---
id: platform/dev/6.7/guides/installation/_index.md
title: Installation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/
sourceHash: 604e2bbfedda20d06e16f000ea4c9032ba7f6ac2
codeCheckedAgainst: "6.7.15.1"
keywords: ["installation", "shopware-cli project create", "shopware-cli project dev", "@shopware-ag/shopware-cli", "docker", "docker compose ps", "local development environment", "community edition", "setup", "first run wizard", "memory_limit", "default admin credentials", "development tui"]
summary: Install Shopware 6 CE locally with shopware-cli project create (Docker recommended), start it with project dev; prompts, options, URLs, credentials.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/_index.md", "platform/dev/6.7/guides/installation/system-requirements.md", "platform/dev/6.7/guides/installation/advanced-options.md", "platform/dev/6.7/guides/installation/legacy-setups/_index.md"]
---
## What it is

The entry guide for setting up a local Shopware 6 Community Edition development environment. The recommended path is Docker, driven by the Shopware CLI (installed separately from Shopware); older methods live under platform/dev/6.7/guides/installation/legacy-setups/_index.md.

## When to use

Starting a custom shop project, developing a plugin/app/theme, or contributing to the core, and you need a working local instance.

## Key steps / config

Prerequisites: system requirements (platform/dev/6.7/guides/installation/system-requirements.md), the Shopware CLI (platform/dev/6.7/products/tools/cli/_index.md), Docker (recommended).

1. Create the project:
   - `shopware-cli project create my-shop`
   - or without installing the CLI: `npx @shopware-ag/shopware-cli project create my-shop`
   - Existing target directory: see platform/dev/6.7/guides/installation/advanced-options.md.
2. Select the Shopware version (latest is the top option).
3. "How do you want to run Shopware?": **Run Shopware with Docker** (recommended; Docker must be running or a "fatal error" appears) or **Use PHP and Composer; Shopware CLI handles the installation**.
4. Optional customization:
   - **Deployment Method**: none (default), PaaS powered by Shopware, PaaS powered by Platform.sh, Deployer PHP, or Docker (Container) — the latter generates a production-ready `Dockerfile` and `.dockerignore`.
   - **CI/CD System**: none (default), GitHub Actions, GitLab CI.
   - **Initialize Git repository**: `yes` by default.
   - **OpenSearch**: `no` by default.
   - **AMQP**: `yes` by default.
5. Review the summary and choose `proceed`.
6. Start the environment: `cd my-shop` then `shopware-cli project dev` — launches the Development TUI, which starts the containers, runs the installer (first time only) and shows URLs, credentials, watchers, logs and services. See platform/dev/6.7/guides/development/dev-environment.md.
7. Access: Storefront on `127.0.0.1:8000`, Administration on `127.0.0.1:8000/admin`, credentials `admin` / `shopware`. Check containers with `docker compose ps`.

Next: platform/dev/6.7/guides/development/_index.md.

## Essential identifiers

- `shopware-cli project create`, `shopware-cli project dev`
- `npx @shopware-ag/shopware-cli`
- `docker compose exec web composer <command>`, `docker compose ps`

## Gotchas

- The Shopware CLI installation method is in Alpha; the Docker setup guide (platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md) is the fallback.
- With Docker, run Composer and PHP tools inside the `web` container. Host PHP often has only `128M` memory and cannot reach the database; Shopware needs `memory_limit` of at least `512M`.
- No Shopware account is needed to install or develop. It is needed for Store extensions (free ones too), licensed packages from the private Composer registry, and commercial plans/services. Account and Store steps in the First Run Wizard can be skipped.
- DDEV and Dockware are community-maintained, not officially supported.

## Code check (6.7.15.1)
- confirmed `MEMORY_LIMIT_REQUIREMENT` — installer requires `512M` — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:18
- confirmed `memory_limit` — ini value read by the requirements validator — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:48
- confirmed `'username' => 'admin'` — basic setup creates user `admin` — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:134
- confirmed `'--password' => 'shopware'` — basic setup default password — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:136
- confirmed `sw-first-run-wizard` — First Run Wizard module exists in the Administration — vendor/shopware/administration/Resources/app/administration/src/module/sw-first-run-wizard/index.js:6
- unverified `shopware-cli project create` — separate shopware-cli tool, out of scope
- unverified `shopware-cli project dev` — separate shopware-cli tool, out of scope
