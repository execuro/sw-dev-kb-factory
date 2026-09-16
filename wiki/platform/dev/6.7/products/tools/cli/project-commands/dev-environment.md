---
id: platform/dev/6.7/products/tools/cli/project-commands/dev-environment.md
title: Development Environment
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/dev-environment.html
sourceHash: "6d6c9bdf0418e154e5b86a2b94360c3d613263e6"
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli project dev", "shopware-cli project dev install", "shopware-cli project logs", "--admin-password", "--locale", "--currency", ".shopware-project.yml", "compatibility_date", "docker.php.profiler", "local dev environment", "tui dashboard", "application logs"]
summary: "Reference for shopware-cli project dev (start/status/stop/install flags) and project logs, plus .shopware-project.yml docker/environments config."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/dev-environment.md", "platform/dev/6.7/products/tools/cli/project-commands/local-proxy.md", "platform/dev/6.7/guides/development/start-developing.md"]
---
## What it is

Quick reference for the `shopware-cli project dev` and `shopware-cli project logs` commands. The full workflow, configuration reference and troubleshooting are in the [Development Environment guide](platform/dev/6.7/guides/development/dev-environment.md).

## When to use

Starting/stopping the Docker-based local environment, installing Shopware non-interactively (CI, scripts, agents), tailing application logs, or running several Shopware versions side by side.

## Key steps / config

```bash
shopware-cli project dev          # interactive dashboard (default in a terminal)
shopware-cli project dev start    # background start (CI/scripting)
shopware-cli project dev status
shopware-cli project dev stop
```

Non-interactive install — starts the environment if needed, runs the deployment helper, saves admin credentials to `.shopware-project.yml`; exits successfully with a notice if already installed:

```bash
shopware-cli project dev install --locale de-DE --currency EUR \
  --admin-username admin --admin-password mysecret123
```

| Flag | Default |
|---|---|
| `--locale` | `en-GB` |
| `--currency` | `EUR` |
| `--admin-username` | `admin` |
| `--admin-password` | `shopware` (min. 8 characters) |

Dashboard tabs: **Overview** (shop info, credentials, health checks, watcher toggles), **Instance** (containers, watchers, live log files), **Config** (PHP version, profiler).

Logs:

```bash
shopware-cli project logs                      # last 100 lines of newest log
shopware-cli project logs dev-2026-05-18.log   # specific file
shopware-cli project logs -f                   # follow
shopware-cli project logs -l                   # list files
shopware-cli project logs --lines 50
```

`.shopware-project.yml` shape:

```yaml
compatibility_date: '2026-03-01'
docker:
  php: { version: "8.3", profiler: xdebug }
environments:
  local:
    type: docker
    url: ...            # local shop URL, e.g. 127.0.0.1:8000
    admin_api: { username: admin, password: shopware }
```

Parallel versions: combine a version argument on `project create` with the [local proxy](platform/dev/6.7/products/tools/cli/project-commands/local-proxy.md) so each shop gets its own hostname:

```bash
shopware-cli project create my-shop-6-6 6.6.7.0 --docker --local-domain --no-interaction
shopware-cli project create my-shop-6-7 6.7.0.0 --docker --local-domain --no-interaction
```

Next steps: [Start Developing](platform/dev/6.7/guides/development/start-developing.md).

## Essential identifiers

- `shopware-cli project dev` (`start`, `status`, `stop`, `install`)
- `--locale`, `--currency`, `--admin-username`, `--admin-password`
- `shopware-cli project logs` (`-f`, `-l`, `--lines`)
- `.shopware-project.yml`: `compatibility_date`, `docker.php.version`, `docker.php.profiler`, `environments.local.admin_api`
- `shopware-cli project create ... --docker --local-domain`

## Gotchas

- Run Composer, PHP and npm inside the web container; the guide notes PHP `memory_limit` of at least 512M.

## Code check (6.7.13.0)
- confirmed `shop-locale` — core `system:install` option for the default shop locale — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:53
- confirmed `shop-currency` — core `system:install` option for the default currency ISO code — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:54
- confirmed `en-GB` — core basic setup falls back to `en-GB` locale, matching the `--locale` default — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:140
- confirmed `minPasswordLength` — core admin provisioning enforces a configurable minimum password length (generated ones at least 8) — vendor/shopware/core/Maintenance/User/Service/UserProvisioner.php:43
- confirmed `php` — core allows PHP `~8.3.0`, matching `docker.php.version: "8.3"` — vendor/shopware/core/composer.json:51
- unverified `project dev install` — implemented in shopware-cli (Go), out of scope
- unverified `project logs` — implemented in shopware-cli (Go), out of scope
- unverified `docker.php.profiler` — shopware-cli config key, out of scope
- unverified `environments.local.admin_api` — shopware-cli config key, out of scope
