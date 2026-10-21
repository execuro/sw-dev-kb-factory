---
id: platform/dev/6.7/products/tools/cli/project-commands/dev-environment.md
title: Development Environment
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/dev-environment.html
sourceHash: 35f34aa8000e49bf48d797774d1a688b7c3e06ad
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli project dev", "shopware-cli project dev install", "shopware-cli project logs", "shopware-cli project create", ".config/shopware-project.yml", "local dev environment", "docker dev setup", "tui dashboard", "admin credentials", "--local-domain", "xdebug profiler", "log files", "multiple shopware versions"]
summary: CLI reference for shopware-cli project dev (start/status/stop/install), project logs, and the docker/environments block of .config/shopware-project.yml.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/development/dev-environment.md", "platform/dev/6.7/products/tools/cli/project-commands/local-proxy.md", "platform/dev/6.7/guides/development/start-developing.md"]
---
## What it is

Quick reference for the `shopware-cli project dev` and `shopware-cli project logs` commands, which run and inspect the Docker-based local development environment. The full workflow and setup guide is the [Development Environment guide](platform/dev/6.7/guides/development/dev-environment.md).

## When to use

Starting, stopping or checking the local environment, installing Shopware into it non-interactively (CI, scripts, agents), reading application logs, or running several Shopware versions side by side.

## Key steps / config

Lifecycle:

```bash
shopware-cli project dev          # interactive dashboard (default in a terminal)
shopware-cli project dev start    # background, for CI/scripting
shopware-cli project dev status
shopware-cli project dev stop
```

Non-interactive install:

```bash
shopware-cli project dev install \
  --locale de-DE --currency EUR \
  --admin-username admin --admin-password mysecret123
```

It starts the environment if needed, runs the deployment helper to install Shopware, and saves the admin credentials to `.config/shopware-project.yml`. If the shop is already installed it prints a notice and exits successfully.

| Flag | Default | Notes |
|---|---|---|
| `--locale` | `en-GB` | default storefront language |
| `--currency` | `EUR` | default currency |
| `--admin-username` | `admin` | |
| `--admin-password` | `shopware` | at least 8 characters |

Dashboard tabs: **Overview** (shop info, credentials, setup health checks, watcher toggles), **Instance** (containers, watcher processes, live-streamed log files), **Config** (PHP version, profiler).

Logs:

```bash
shopware-cli project logs                       # last 100 lines of newest log file
shopware-cli project logs dev-2026-05-18.log    # specific file
shopware-cli project logs -f                    # follow
shopware-cli project logs -l                    # list log files
shopware-cli project logs --lines 50
```

Configuration in `.config/shopware-project.yml` (skeleton):

```yaml
compatibility_date: '2026-03-01'
docker:
  php:
    version: "8.3"
    profiler: xdebug
environments:
  local:
    type: docker
    url: <shop URL>
    admin_api: { username: admin, password: shopware }
```

Parallel versions — combine a version argument on `project create` with the [local proxy](platform/dev/6.7/products/tools/cli/project-commands/local-proxy.md) so each shop gets its own hostname instead of colliding on host ports:

```bash
shopware-cli project create my-shop-6-6 6.6.7.0 --docker --local-domain --no-interaction
shopware-cli project create my-shop-6-7 6.7.0.0 --docker --local-domain --no-interaction
```

After the environment runs, continue with [Start Developing](platform/dev/6.7/guides/development/start-developing.md).

## Essential identifiers

- `shopware-cli project dev`, `start`, `status`, `stop`, `install`
- `--locale`, `--currency`, `--admin-username`, `--admin-password`
- `shopware-cli project logs`, `-f`, `-l`, `--lines`
- `shopware-cli project create`, `--docker`, `--local-domain`, `--no-interaction`
- `.config/shopware-project.yml`: `docker.php.version`, `docker.php.profiler`, `environments.local`

## Gotchas

- The guide notes PHP `memory_limit` of at least 512M when running Composer, PHP and npm inside the web container.

## Code check (6.7.15.1)
- confirmed `system:install` — core's own installer command (the CLI's deployment helper is out of scope) — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:31
- confirmed `shop-locale` — core install falls back to `en-GB`, same as the CLI `--locale` default — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:144
- confirmed `shop-currency` — core install option for the default currency ISO code — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:58
- unverified `shopware-cli project dev` — Go CLI command, outside the Shopware package roots
- unverified `shopware-cli project dev install` — Go CLI command and its defaults, out of scope
- unverified `shopware-cli project logs` — Go CLI command, out of scope
- unverified `shopware-cli project create` — Go CLI command, out of scope
- unverified `.config/shopware-project.yml` — shopware-cli config file, not read by core
