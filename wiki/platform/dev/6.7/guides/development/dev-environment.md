---
id: platform/dev/6.7/guides/development/dev-environment.md
title: Development Environment
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/dev-environment.html
sourceHash: f2d9e86671ab20e9cb53dc8f239c83a824e2bfb8
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli project dev", "docker", "compose.override.yaml", ".shopware-project.yml", "compatibility_date", "swx", "shopware-cli project console", "memory_limit", "xdebug", "local proxy", "dev environment", "shopware/deployment-helper", "tui dashboard"]
summary: Shopware CLI Docker dev environment via project dev - TUI, .shopware-project.yml, compose.override.yaml, ports, legacy migration
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/project-commands/local-proxy.md", "platform/dev/6.7/guides/development/tooling/using-watchers.md", "platform/dev/6.7/products/tools/cli/project-commands/build.md", "platform/dev/6.7/guides/development/start-developing.md"]
---
## What it is

Shopware CLI's integrated Docker development environment: `shopware-cli project dev` starts the stack, a terminal dashboard (TUI) shows status, logs, watchers and PHP/profiler config, and the CLI generates and owns `compose.yaml`. Requires `compatibility_date` `2026-03-01` or later in `.shopware-project.yml` (set automatically by `shopware-cli project create`).

## When to use

- Setting up or running a local Shopware project with Docker.
- Migrating a pre-March-2026 project using `make up`/`make setup` and a hand-written `compose.yaml`.
- Testing an extension against several Shopware versions at once.

## Key steps / config

Lifecycle: `shopware-cli project dev` (TUI; starts containers, runs install wizard if needed), `shopware-cli project dev start` (non-interactive, CI), `shopware-cli project dev status`, `shopware-cli project dev stop`.

TUI tabs: **Overview** (shop info, Admin/Adminer/Mailpit credentials, setup health, watcher toggles), **Instance** (containers, watcher processes, log files such as `dev.log`), **Config** (PHP `8.2`–`8.5`; profiler `none`, `xdebug`, `blackfire`, `tideways`, `pcov`, `spx`). **Save & Regenerate** rewrites `compose.yaml`; restart afterwards.

Commands from the host:
- Logs: `shopware-cli project logs` (`-f`, `-l`, `--lines 50`, or a file name).
- Console: `shopware-cli project console cache:clear`, alias `swx` (e.g. `swx plugin:refresh`, `swx dal:refresh:index`).
- Composer/PHP/npm inside the container: `docker compose exec web composer install`, `docker compose exec web bash`.
- Host PHP only: `memory_limit = 512M`, check with `php -i | grep memory_limit`.

`.shopware-project.yml` shape:

```yaml
compatibility_date: '2026-03-01'
docker:
  php:
    version: "8.3"
    profiler: xdebug
    blackfire_server_id: ""
    blackfire_server_token: ""
    tideways_api_key: ""
environments:
  local:
    type: docker        # docker | local | symfony-cli
    url: ...
    admin_api: { username: admin, password: shopware }
```

Blackfire/Tideways credentials go in `.shopware-project.local.yml` (gitignored). Select an environment with `-e`/`--env` (empty defaults to `environments.local`; unknown names fail).

Services: `web` (PHP + Node.js with Caddy, port 8000), `database` (MariaDB 11.8), `adminer` (9080), `mailer` (Mailpit, 8025); auto-detected from `composer.lock`: `lavinmq` (15672, for `symfony/amqp-messenger`, sets `MESSENGER_TRANSPORT_DSN`), `opensearch` (9200, for `shopware/elasticsearch`), `blackfire`, `tideways-daemon`. Web ports: `8000` Storefront, `8080` HTTP alt, `5173` Admin Watcher (Vite), `9998` Storefront Watcher, `9999` Storefront Proxy, `5773` IDE debugging. Customisations go in `compose.override.yaml`.

Legacy migration: `shopware-cli project dev` with a missing or older `compatibility_date` launches a wizard (admin `admin`/`shopware`, PHP version from `composer.lock`). It sets the date, adds `environments.local` of type `docker`, replaces `compose.yaml`, leaves `Makefile` untouched, and adds `shopware/deployment-helper` to `composer.json` if missing.

Parallel versions (Docker executor only; see [local proxy](platform/dev/6.7/products/tools/cli/project-commands/local-proxy.md)):
```bash
shopware-cli project create my-shop-6-7 6.7.0.0 --docker --local-domain --no-interaction
(cd my-shop-6-7 && shopware-cli project dev start)
shopware-cli project proxy list
shopware-cli project proxy teardown
```
Each shop gets `https://<project>.shopware.local`.

## Essential identifiers

- `shopware-cli project dev` / `start` / `status` / `stop`, `shopware-cli project logs`, `shopware-cli project console`, `swx`
- `.shopware-project.yml`, `.shopware-project.local.yml`, `compatibility_date`, `environments.local.type`
- `compose.yaml` (managed), `compose.override.yaml`
- `shopware/deployment-helper`

## Gotchas

- `compose.yaml` is regenerated on config changes; never edit it. Back up a legacy one before the wizard — it is overwritten.
- Host Composer often fails with "Allowed memory size of 134217728 bytes exhausted" (128M); Shopware needs at least 512M, and composer scripts may need the database reachable only in the Docker network. The TUI memory check reports container PHP, not host PHP.
- Top-level `url` and `admin_api` keys are deprecated (still work, log a warning); use `environments`.
- Compatibility date error: set `compatibility_date: '2026-03-01'` (see [build](platform/dev/6.7/products/tools/cli/project-commands/build.md)).

## Code check (6.7.13.0)
- confirmed `MEMORY_LIMIT_REQUIREMENT` — installer requires memory_limit 512M — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:18
- confirmed `MESSENGER_TRANSPORT_DSN` — env var for messenger transport, default doctrine — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:3
- confirmed `plugin:refresh` — PluginRefreshCommand name — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:21
- confirmed `plugin:install` — PluginInstallCommand name — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:25
- confirmed `dal:refresh:index` — RefreshIndexCommand name — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:22
- unverified `cache:clear` — Symfony framework command, outside vendor/shopware
- unverified `shopware-cli project dev` — shopware-cli binary, out of scope
- unverified `shopware/deployment-helper` — separate package, out of scope
