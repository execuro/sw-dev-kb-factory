---
id: platform/dev/6.7/guides/installation/project-overview.md
title: Project Structure Overview
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/project-overview.html
sourceHash: c8cfbf6c756aacfe19a789d70d8a2d0bc3f08f0e
codeCheckedAgainst: "6.7.13.0"
keywords: ["project structure", "project template", "shopware-cli project dev", "shopware-cli project console", "swx", "bin/console", "docker compose exec web", "custom/plugins", "custom/apps", "custom/static-plugins", "compose.yaml", "memory_limit", "directory layout", "docker containers"]
summary: Shopware 6.7 project template layout, its Docker containers, and day-to-day CLI tools (shopware-cli, swx, bin/console, docker compose exec web).
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/dev-environment.md"]
---
## What it is

Orientation page for a freshly installed Shopware 6.7 project: the development tooling you interact with, the Docker components the project template starts, and the root-level directories and files of the Composer-based Shopware Project Template.

## When to use

Right after installation, when you need to know which command runs where (host vs. container), which container provides which service, and where your own plugins, apps and themes go.

## Key steps / config

Day-to-day commands:

- `shopware-cli project dev` — TUI that starts/stops the Docker stack, streams logs from `var/log/` and containers, runs Admin/Storefront watchers (HMR), configures PHP version and profiler (xdebug, blackfire, tideways), and lists services (Adminer, Mailpit, queue). See [Development Environment](platform/dev/6.7/guides/development/dev-environment.md).
- `shopware-cli project console <command>` — runs Shopware application (`bin/console`) commands from the host in the correct container context.
- `swx <command>` — shortcut for the above, e.g. `swx cache:clear`.
- `docker compose exec web <command>` — runs Composer, PHP or npm inside the web container, e.g. `docker compose exec web composer <command>`. Do not use host Composer by default: host PHP does not share the container's memory limit or service network. Shopware requires `memory_limit` of at least `512M`.

Dev tools (`shopware/dev-tools`, Symfony profiler — development mode only, linting/testing tools) are managed via Shopware CLI in the user environment, not as project `require-dev` dependencies. Demo data (SwagPlatformDemoData) is optional; prefer terminal-based setup over the First Run Wizard.

Docker components (names prefixed with the project folder name):

| Component | Purpose |
|---|---|
| Network `my-project_default` | private network between containers |
| Volume `my-project_db-data` | persistent MariaDB data |
| `my-project-mailer-1` | Mailpit, web UI on localhost port 8025 |
| `my-project-database-1` | MariaDB, hostname `database` inside the network |
| `my-project-web-1` | PHP + Caddy, Storefront and Admin on localhost port 8000 |
| `my-project-adminer-1` | Adminer DB UI on localhost port 8080 |

Project root:

```text
project-root/
├── bin/            # bin/console
├── config/         # Symfony configuration
├── custom/
│   ├── plugins/
│   ├── apps/
│   └── static-plugins/
├── files/          # uploaded media, temp files (not in git)
├── public/         # web root, index.php
├── src/  var/  vendor/
├── compose.yaml  compose.override.yaml
├── composer.json  composer.lock  symfony.lock
├── Makefile  .env  README.md
```

## Essential identifiers

- `shopware-cli project dev`, `shopware-cli project console`, `swx`
- `bin/console`
- `docker compose exec web`
- `custom/plugins`, `custom/apps`, `custom/static-plugins`
- `compose.yaml`, `compose.override.yaml`, `composer.json`, `composer.lock`, `symfony.lock`, `.env`
- `var/log/`

## Gotchas

- Shopware CLI (standalone tool for dev environment, extension builds, CI) is not the same as `bin/console` (the Symfony application console shipped with Shopware).
- `var/` (cache, logs) can be deleted safely; Shopware rebuilds it. `files/` is generated at runtime and ignored by git.
- `composer.lock` and `symfony.lock` are not edited manually.
- `Makefile` only exists in older setups (`make up`, `make setup`).
- The Symfony profiler is available only in development mode.

## Code check (6.7.13.0)
- confirmed `custom/plugins` — default plugin directory of the kernel plugin loader — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:50
- confirmed `custom/apps` — `shopware.app_dir` parameter points to the project's custom/apps — vendor/shopware/core/Framework/DependencyInjection/app.php:182
- confirmed `custom/static-plugins` — static plugins folder is part of the plugin search paths — vendor/shopware/core/TestBootstrapper.php:337
- confirmed `memory_limit` — installer requirements validator reads it and requires 512M — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:48
- unverified `shopware-cli project dev` — Shopware CLI is a separate tool, not in vendor/shopware
- unverified `swx` — Shopware CLI shortcut, out of scope
- unverified `cache:clear` — Symfony framework command, vendor/symfony out of scope
