---
id: platform/dev/6.7/guides/installation/project-overview.md
title: Project Structure Overview
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/project-overview.html
sourceHash: c8cfbf6c756aacfe19a789d70d8a2d0bc3f08f0e
codeCheckedAgainst: "6.7.15.1"
keywords: ["project structure", "project template", "shopware-cli project dev", "shopware-cli project console", "swx", "bin/console", "docker compose exec web", "custom/plugins", "custom/apps", "custom/static-plugins", "compose.yaml", "directory layout", "memory_limit"]
summary: Layout of a Shopware project template (bin, config, custom, var, compose.yaml), its Docker containers, and which CLI to use for what in day-to-day dev.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/development/dev-environment.md"]
---
## What it is

Orientation page for a freshly installed Shopware project: the development tooling, the Composer-based project template, the Docker components it starts, and the root directory layout.

## When to use

Right after installation, to know where code goes and which command runner to use.

## Key steps / config

Tooling in daily use:

- `shopware-cli project dev` — TUI of the [development environment](platform/dev/6.7/guides/development/dev-environment.md): start/stop the stack, log streaming from `var/log/` and containers, Admin/Storefront watchers (HMR), PHP version and profiler (xdebug, blackfire, tideways), service discovery (Adminer, Mailpit, queue).
- `shopware-cli project console <command>` — runs Shopware app commands from the host; `swx <command>` is its shortcut (e.g. `swx cache:clear`).
- `docker compose exec web <command>` — run Composer, PHP or npm inside the web container (e.g. `docker compose exec web composer <command>`); do not use host Composer by default.
- `bin/console` — Shopware's Symfony console (migrations, plugin install, cache, config); in Docker setups call it through `shopware-cli project console`/`swx`.

Dev tools (`shopware/dev-tools`, Symfony profiler — dev mode only, linting/testing) are managed via Shopware CLI in the user environment, not as project `require-dev`. Demo data is optional; prefer terminal setup over the First Run Wizard.

Docker components (names follow the project folder, e.g. `my-project`): network `my-project_default`; volume `my-project_db-data` (MariaDB files); containers `my-project-mailer-1` (Mailpit, port 8025), `my-project-database-1` (MariaDB, hostname `database`), `my-project-web-1` (PHP + Caddy, Storefront/Admin on port 8000), `my-project-adminer-1` (port 8080).

Root layout:

```text
project-root/
├── bin/  config/  files/  public/  src/  var/  vendor/
├── custom/
│   ├── plugins/  apps/  static-plugins/
├── compose.yaml  compose.override.yaml
├── composer.json  composer.lock  symfony.lock
├── Makefile  .env  README.md
```

- `bin/` executables (`bin/console`); `config/` Symfony config; `custom/` your plugins, apps, themes; `files/` uploaded media (git-ignored); `public/` web root with `index.php`; `src/` core app source, not usually edited; `var/` cache/logs, safe to delete; `vendor/` Composer packages.
- `compose.yaml` defines services; `compose.override.yaml` optional local overrides (ports, volumes); `composer.lock` committed, not hand-edited; `symfony.lock` records Flex recipes; `Makefile` is a legacy helper (`make up`, `make setup`).

## Essential identifiers

- `shopware-cli project dev`, `shopware-cli project console`, `swx`
- `bin/console`, `docker compose exec web`
- `custom/plugins`, `custom/apps`, `custom/static-plugins`
- `compose.yaml`, `compose.override.yaml`, `symfony.lock`

## Gotchas

- Host PHP does not share the container's memory limit or service network; Shopware requires `memory_limit` ≥ `512M`.
- The standalone Shopware CLI is not `bin/console`: it handles dev environment, extension builds and CI workflows.

## Code check (6.7.15.1)
- confirmed `custom/apps` — app directory under project root — vendor/shopware/core/Kernel.php:305
- confirmed `custom/plugins` — plugin directory — vendor/shopware/core/TestBootstrapper.php:340
- confirmed `custom/static-plugins` — static plugin directory — vendor/shopware/core/TestBootstrapper.php:341
- confirmed `memory_limit` — installer requirement check reads it, minimum 512M — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:48
- unverified `shopware-cli project dev` — Shopware CLI, outside the checked packages
- unverified `swx` — Shopware CLI shortcut, out of scope
