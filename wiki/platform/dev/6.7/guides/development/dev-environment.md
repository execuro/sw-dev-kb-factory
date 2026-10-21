---
id: platform/dev/6.7/guides/development/dev-environment.md
title: Development Environment
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/dev-environment.html
sourceHash: a5190f298cf04d3f99f98c91d89e4f7ac08fe29e
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli project dev", "shopware-cli project console", "swx", "shopware-cli project logs", "compose.override.yaml", ".config/shopware-project.yml", "compatibility_date", "environments.local", "shopware-cli project proxy", "docker dev environment", "development tui", "xdebug profiler", "memory_limit"]
summary: "shopware-cli project dev: Docker dev stack with TUI, managed compose.yaml, executors, ports, profiler config and legacy make-setup migration."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/configuration.md", "platform/dev/6.7/products/tools/cli/project-commands/local-proxy.md", "platform/dev/6.7/guides/hosting/_index.md", "platform/dev/6.7/guides/development/tooling/using-watchers.md"]
---
## What it is

Shopware CLI ships a Docker-based development environment: one command starts the stack, opens a terminal dashboard (TUI), streams logs, toggles watchers and configures PHP version and profiler, and generates the `compose.yaml` for you.

## When to use

Setting up or running a local Shopware project, migrating an older `make up`/`make setup` project, running `bin/console`/Composer against the container, or running several Shopware versions side by side to test an extension.

## Key steps / config

Requires `compatibility_date` `2026-03-01` or later in `.config/shopware-project.yml` (set automatically by `shopware-cli project create`; lookup paths: see platform/dev/6.7/products/tools/cli/configuration.md).

- `shopware-cli project dev` — TUI; starts containers, runs the install wizard if Shopware is not installed.
- `shopware-cli project dev start` / `status` / `stop` — non-interactive (CI/scripting).
- TUI tabs: 1 Overview (shop/access info, Setup health, watcher toggles), 2 Instance (containers, watcher processes, log files such as `dev.log`; `Enter` toggles follow), 3 Config (PHP `8.2`–`8.5`; profiler `none`, `xdebug`, `blackfire`, `tideways`, `pcov`, `spx`). **Save & Regenerate** rewrites `compose.yaml`; restart afterwards.
- Logs: `shopware-cli project logs` (last 100 lines), `<file>`, `-f`, `-l`, `--lines 50`.
- Console: `shopware-cli project console plugin:refresh` (alias `swx plugin:refresh`); runs via `docker compose exec` with the Docker executor.
- Composer/PHP/npm run **inside** the container: `docker compose exec web composer install`, `docker compose exec web bash`. Prefer `shopware-cli project admin-watch` / `storefront-watch` over npm watch scripts.
- Host PHP (local / symfony-cli executors): `memory_limit = 512M`, verify with `php -i | grep memory_limit`.

`.config/shopware-project.yml`:

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
    url: ...            # e.g. port 8000 on 127.0.0.1
    admin_api: { username: admin, password: shopware }
```

Secrets (Blackfire/Tideways) go in `.config/shopware-project.local.yml` (git-ignored). Select an environment with global `-e`/`--env` (e.g. `shopware-cli project extension list -e local`); empty defaults to `environments.local`, an unknown name fails.

Generated services: `web` (PHP + Node.js + Caddy, port 8000), `database` (MariaDB 11.8), `adminer` (9080), `mailer` (Mailpit, 8025), plus auto-detected from `composer.lock`: `lavinmq` (15672, for `symfony/amqp-messenger`, sets `MESSENGER_TRANSPORT_DSN`), `opensearch` (9200, for `shopware/elasticsearch`), `blackfire`, `tideways-daemon`. Web container ports: `8000` Storefront, `8080` HTTP alt, `5173` Admin Watcher (Vite), `9998` Storefront Watcher, `9999` Storefront Proxy, `5773` IDE debugging. Project dir is bind-mounted as `.:/var/www/html`.

Customise only via `compose.override.yaml` (merged on top), e.g. `services.web.environment`, extra `ports`, extra services.

Legacy migration: if `compatibility_date` is missing or before `2026-03-01`, `project dev` runs a wizard (admin user `admin`, password `shopware`, PHP version from `composer.lock`), then sets the date, adds `environments.local` of type `docker`, regenerates `compose.yaml`, adds `shopware/deployment-helper` to `composer.json` if missing, and installs Shopware. The `Makefile` is left untouched.

Parallel versions (needs `--docker` and the local proxy, platform/dev/6.7/products/tools/cli/project-commands/local-proxy.md):

```bash
shopware-cli project create my-shop-6-7 6.7.0.0 --docker --local-domain --no-interaction
(cd my-shop-6-7 && shopware-cli project dev start)
shopware-cli project proxy list
shopware-cli project proxy teardown
```

Each shop gets `https://<project>.shopware.local`.

## Essential identifiers

- `shopware-cli project dev`, `shopware-cli project console`, `swx`, `shopware-cli project logs`, `shopware-cli project proxy list|teardown`
- `.config/shopware-project.yml`, `.config/shopware-project.local.yml`, `compose.yaml`, `compose.override.yaml`
- `compatibility_date`, `docker.php.version`, `docker.php.profiler`, `environments.local.type`, `environments.local.admin_api`
- `shopware/deployment-helper`, `MESSENGER_TRANSPORT_DSN`

## Gotchas

- `compose.yaml` is CLI-managed and regenerated on every config change — never edit it; the migration wizard overwrites an existing hand-written one, so move customisations to `compose.override.yaml` first.
- Host Composer often fails: host PHP defaults to `memory_limit=128M` ("Allowed memory size of 134217728 bytes exhausted"), Shopware needs at least 512M, and Composer scripts may need the database inside the Docker network. The TUI memory check reports the container PHP, not the host.
- Top-level `url`/`admin_api` keys are deprecated (still work, log a warning); `project create` and `project config init` only write `environments.local`.
- The local proxy works only with the Docker executor.

## Version notes

Projects created before March 2026 use the older `make up`/`make down`/`make setup` workflow and must pass the migration wizard.

## Code check (6.7.15.1)
- confirmed `MEMORY_LIMIT_REQUIREMENT` — installer requirement check expects memory_limit of 512M — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:18
- confirmed `MESSENGER_TRANSPORT_DSN` — env var drives the messenger transport, default doctrine://default — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:3
- confirmed `plugin:refresh` — console command name — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:22
- confirmed `plugin:install` — console command name, used with --activate — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:28
- confirmed `dal:refresh:index` — console command name — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:23
- unverified `cache:clear` — provided by Symfony FrameworkBundle, out of scope
- unverified `shopware-cli project dev` — Shopware CLI binary, not part of vendor/shopware
- unverified `shopware/deployment-helper` — separate Composer package, out of scope
