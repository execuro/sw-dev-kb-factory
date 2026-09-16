---
id: platform/dev/6.7/guides/installation/_index.md
title: Installation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/
sourceHash: 604e2bbfedda20d06e16f000ea4c9032ba7f6ac2
codeCheckedAgainst: "6.7.13.0"
keywords: ["installation", "install shopware", "shopware-cli project create", "shopware-cli project dev", "@shopware-ag/shopware-cli", "docker", "docker compose exec web", "community edition", "local development environment", "memory_limit", "default admin credentials", "first run wizard", "shopware account"]
summary: "Installing Shopware 6 CE locally with shopware-cli project create and project dev (Docker recommended), CLI options, default admin credentials."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/_index.md", "platform/dev/6.7/products/tools/cli/_index.md", "platform/dev/6.7/guides/installation/advanced-options.md", "platform/dev/6.7/guides/development/dev-environment.md"]
---
## What it is

Entry guide for setting up a local Shopware 6 Community Edition environment (shop projects, plugin/app/theme development, core contributions). The recommended path is Docker driven by the [Shopware CLI](platform/dev/6.7/products/tools/cli/_index.md); older methods live under [Legacy Setups](platform/dev/6.7/guides/installation/legacy-setups/_index.md).

## When to use

Starting a new local Shopware 6.7 project or development environment.

## Key steps / config

Prerequisites: [system requirements](platform/dev/6.7/guides/installation/system-requirements.md), Shopware CLI installed, Docker installed and running (recommended). DDEV and Dockware are community-maintained alternatives, not officially supported.

1. Create the project:
   ```bash
   shopware-cli project create my-shop
   # or without installing the CLI:
   npx @shopware-ag/shopware-cli project create my-shop
   ```
   For an existing target directory see [Advanced options](platform/dev/6.7/guides/installation/advanced-options.md).
2. Select the Shopware version (latest is the top option).
3. "How do you want to run Shopware?": **Run Shopware with Docker** (recommended) or **Use PHP and Composer** (local PHP/Composer, no Docker).
4. Optional customization:
   - Deployment Method: none (default), PaaS powered by Shopware, PaaS powered by Platform.sh, Deployer PHP, or Docker (Container) — generates `Dockerfile` and `.dockerignore` pinned to the resolved PHP version
   - CI/CD System: none (default), GitHub Actions, GitLab CI
   - Initialize Git repository (default yes)
   - OpenSearch (default no)
   - AMQP queue support (default yes)
5. Review the summary, then choose `proceed` (or restart/cancel).
6. Start the environment:
   ```bash
   cd my-shop
   shopware-cli project dev
   ```
   This opens the Development TUI: starts containers, runs the Shopware installer on first start, shows shop URLs, credentials, watchers, logs and services. See [Development Environment](platform/dev/6.7/guides/development/dev-environment.md).
7. Access: Storefront on 127.0.0.1 port 8000, Administration at path `/admin` on the same host; default credentials `admin` / `shopware`. Check containers with `docker compose ps`.

Continue with the [Development guide](platform/dev/6.7/guides/development/_index.md).

## Essential identifiers

- `shopware-cli project create`
- `npx @shopware-ag/shopware-cli project create`
- `shopware-cli project dev`
- `docker compose exec web composer <command>`
- `docker compose ps`
- Default login `admin` / `shopware`

## Gotchas

- The Shopware CLI installation method is Alpha; the [Docker setup guide](platform/dev/6.7/guides/installation/legacy-setups/docker-setup.md) is the fallback.
- If Docker is not running when you pick the Docker option, a "fatal error" may appear.
- With Docker, run Composer and PHP tools inside the `web` container; host PHP often has only `128M` memory and cannot reach the database. Shopware requires `memory_limit` of at least `512M`.
- No Shopware account is needed to install, develop or build; it is needed for Store extensions (free ones too), Shopware's private Composer registry, and commercial plans/services. The account/Store steps in the `First Run Wizard` can be skipped.

## Code check (6.7.13.0)
- confirmed `ConfigurationRequirementsValidator::MEMORY_LIMIT_REQUIREMENT` — installer requires memory_limit 512M — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:18
- confirmed `memory_limit` — checked against 512M, -1 accepted — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:48
- confirmed `admin` — basic setup creates user admin with password shopware — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:130
- confirmed `shopware` — default admin password in basic setup — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:132
- unverified `shopware-cli project create` — separate shopware-cli tool, out of scope
- unverified `shopware-cli project dev` — separate shopware-cli tool, out of scope
- unverified `docker compose exec web` — Docker/compose setup, out of scope
