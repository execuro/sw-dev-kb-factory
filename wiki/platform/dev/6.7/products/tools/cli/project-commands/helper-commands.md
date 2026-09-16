---
id: platform/dev/6.7/products/tools/cli/project-commands/helper-commands.md
title: Helper Commands
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/helper-commands.html
sourceHash: 0b20b2335ec681f298ec7b08ba219de418e37012
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli project create", "shopware-cli project admin-build", "shopware-cli project storefront-build", "shopware-cli project worker", "swx", "shopware-cli project admin-api", "shopware-cli project validate", "shopware-cli project doctor", "shopware-cli project generate-jwt", ".shopware-project.yml", "--only-custom-static-extensions", "cli helper commands", "build scripts replacement"]
summary: "shopware-cli project helper commands: create, dev, storefront/admin build and watch, worker, console/swx, admin-api, validate, doctor, generate-jwt."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/project-commands/dev-environment.md", "platform/dev/6.7/guides/development/dev-environment.md", "platform/dev/6.7/products/tools/cli/validation.md"]
---
## What it is

A curated reference of `shopware-cli project` subcommands for day-to-day work in a Shopware project: project creation, the Docker dev environment, asset builds, workers, console/Composer proxying, Admin API calls, validation, diagnostics and project config.

## When to use

When you need a CLI shortcut instead of `bin/console`, the `bin/build-*.sh`/`bin/watch-*.sh` scripts, manual Admin API authentication, or hand-started Messenger workers.

## Key steps / config

**Create a project** — `shopware-cli project create <folder-name> [<version>]`; version may be `latest` or `dev-trunk`. `--no-audit` bypasses Composer's security advisory blocking for old versions.

**Dev environment** (see [CLI reference](platform/dev/6.7/products/tools/cli/project-commands/dev-environment.md), [guide](platform/dev/6.7/guides/development/dev-environment.md)):

```bash
shopware-cli project dev            # interactive TUI
shopware-cli project dev start|status|stop
shopware-cli project logs
```

In Docker projects run Composer inside the container: `docker compose exec web composer <command>`.

**Script replacements**

| Shell script | Command |
|---|---|
| `bin/build-storefront.sh` | `shopware-cli project storefront-build` |
| `bin/build-administration.sh` | `shopware-cli project admin-build` |
| `bin/watch-storefront.sh` | `shopware-cli project storefront-watch` |
| `bin/watch-administration.sh` | `shopware-cli project admin-watch` |

- `admin-watch --only-extensions <name>,<second>` / `--skip-extensions <name>,<second>`
- `storefront-build --only-custom-static-extensions` / `admin-build --only-custom-static-extensions` build only `custom/static-plugins`.

**Other commands**

- `shopware-cli project worker <amount>` — starts N `messenger:consume` workers (dev use).
- `shopware-cli project clear-cache` — shortcut for `bin/console cache:clear`; clears the remote instance when an API connection is configured in `.shopware-project.yml`.
- `shopware-cli project console <command>` (alias `swx`) — also runs `composer.json` scripts: `swx phpstan -- --memory-limit=2G`. `swx composer install`, `shopware-cli project composer require shopware/dev-tools` proxy full Composer.
- `shopware-cli project admin-api GET /_info/version`, `... POST /api/search/product -d '{"limit":10}'`; `--output-token` prints the JWT.
- `shopware-cli project validate [path]` with `--format summary|json|github|gitlab|junit|markdown`, `--only`, `--exclude` (comma-separated), `--no-copy`, `--local-only`. See [Validation](platform/dev/6.7/products/tools/cli/validation.md).
- `shopware-cli project doctor`, `shopware-cli project config-schema`, `shopware-cli project config init` (writes URL and Admin API credentials under `environments.local`).
- `shopware-cli project generate-jwt <path-to-project>` writes keys to `config/jwt/`; `--env` prints `JWT_PRIVATE_KEY`/`JWT_PUBLIC_KEY` base64-encoded.

## Essential identifiers

- `shopware-cli project create`, `dev`, `logs`, `storefront-build`, `admin-build`, `storefront-watch`, `admin-watch`
- `shopware-cli project worker`, `clear-cache`, `console`, `swx`, `composer`, `admin-api`
- `shopware-cli project validate`, `doctor`, `config-schema`, `config init`, `generate-jwt`
- `.shopware-project.yml`, `environments.local`, `validation.ignore_extensions`

## Gotchas

- Host PHP often has too low a `memory_limit`; Shopware requires at least `512M`.
- `admin-build` runs `npm install` on first run, so it is slow initially.
- For production workers use supervisord or systemd, not `project worker`.
- Built-in `bin/console` commands take precedence over a Composer script of the same name; lifecycle hooks (`post-install-cmd`, `auto-scripts`) are not exposed via `swx`.
- `project validate` skips extensions resolved from `vendor/` and those in `validation.ignore_extensions`.
- Top-level `url` and `admin_api` keys in `.shopware-project.yml` are deprecated (warning logged); move them under `environments`.
- The core route is `/api/_info/version`; the docs' `admin-api` example writes it as `/_info/version`.

## Version notes

`generate-jwt` is only needed for Shopware before 6.5; 6.5+ generates JWT secrets automatically.

## Code check (6.7.13.0)
- confirmed `/api/_info/version` — core Admin API version route (GET) — vendor/shopware/core/Framework/Api/Controller/InfoController.php:222
- confirmed `/api/search/` — dynamic per-entity search route, so `/api/search/product` exists — vendor/shopware/core/Framework/Api/Route/ApiRouteLoader.php:109
- confirmed `512M` — installer memory limit requirement — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:18
- confirmed `memory_limit` — ini value checked against the requirement — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:48
- unverified `shopware-cli project` — subcommands and flags live in the Go shopware-cli, out of scope
- unverified `messenger:consume` — Symfony Messenger command, out of scope
- unverified `cache:clear` — Symfony FrameworkBundle command, out of scope
- unverified `JWT_PRIVATE_KEY` — no occurrence in vendor/shopware/core; project-level config, out of scope
- unverified `.shopware-project.yml` — shopware-cli config file, out of scope
