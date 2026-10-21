---
id: platform/dev/6.7/products/tools/cli/project-commands/helper-commands.md
title: Helper Commands
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/helper-commands.html
sourceHash: 4afeb0082e0dea3a885667296abf451de09a3547
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli project create", "shopware-cli project admin-build", "shopware-cli project storefront-build", "shopware-cli project worker", "shopware-cli project clear-cache", "swx", "shopware-cli project admin-api", "shopware-cli project validate", "shopware-cli project doctor", "generate-jwt", ".config/shopware-project.yml", "APP_SECRET", "helper commands", "build scripts replacement"]
summary: shopware-cli project helpers for create, admin/storefront build and watch, workers, clear-cache, swx console, admin-api, validate, doctor
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/development/dev-environment.md", "platform/dev/6.7/products/tools/cli/project-commands/dev-environment.md", "platform/dev/6.7/products/tools/cli/validation.md", "platform/dev/6.7/products/tools/cli/configuration.md"]
---
## What it is

A curated list of `shopware-cli project ...` helper commands for daily project work: creation, dev environment, admin/storefront build replacements, Messenger workers, cache clearing, a `bin/console` proxy (`swx`), a pre-authenticated Admin API client, validation, diagnostics, project config and JWT key generation.

## When to use

When you want one CLI for routine tasks instead of the `bin/*.sh` scripts, manual `bin/console messenger:consume` processes, or hand-built curl authentication against the Admin API.

## Key steps / config

**Create**: `shopware-cli project create <folder-name> [<version>]`; `<version>` may be `latest` or `dev-trunk`. `--no-audit` bypasses Composer's security advisory blocking for old versions.

**Dev environment** (see [guide](platform/dev/6.7/guides/development/dev-environment.md), [CLI reference](platform/dev/6.7/products/tools/cli/project-commands/dev-environment.md)): `shopware-cli project dev` (TUI), `project dev start|status|stop`, `project logs`. Run Composer inside the container (`docker compose exec web composer <command>`); host PHP often has `memory_limit` below the required `512M`.

**Build script replacements**:

| Shell script | Command |
|---|---|
| `bin/build-storefront.sh` | `shopware-cli project storefront-build` |
| `bin/build-administration.sh` | `shopware-cli project admin-build` |
| `bin/watch-storefront.sh` | `shopware-cli project storefront-watch` |
| `bin/watch-administration.sh` | `shopware-cli project admin-watch` |

`admin-watch --only-extensions <name>,<second>` / `--skip-extensions ...` limit watched extensions. `--only-custom-static-extensions` on `storefront-build`/`admin-build` builds only `custom/static-plugins`.

**Workers**: `shopware-cli project worker <amount>`; use supervisord/systemd in production.

**Cache / console**: `shopware-cli project clear-cache` (clears the remote cache if an API connection is in `.config/shopware-project.yml`, see [configuration](platform/dev/6.7/products/tools/cli/configuration.md)); `shopware-cli project console <command>` or `swx`. `swx` also runs `composer.json` scripts (`swx phpstan -- --memory-limit=2G`); `swx composer install` / `shopware-cli project composer require ...` proxy Composer.

**Admin API**: `shopware-cli project admin-api POST /api/search/product -d '{"limit":10}'` — curl-style flags (`-d`, `-H`); `--output-token` prints the JWT.

**Validate**: `shopware-cli project validate [path]` with `--format summary|json|github|gitlab|junit|markdown`, `--only phpstan,eslint`, `--exclude eslint`, `--no-copy`, `--local-only`, `--verbose`; built-in checker `builtin`. See [Validation](platform/dev/6.7/products/tools/cli/validation.md).

**Other**: `shopware-cli project doctor`, `project config-schema`, `project config init` (writes credentials under `environments.local`).

## Essential identifiers

- `project create`, `project dev`, `project worker`, `project clear-cache`, `project console`, `swx`
- `project admin-api`, `project validate`, `project doctor`, `project config init`
- `.config/shopware-project.yml`, `environments.local`, `validation.ignore_extensions`

## Gotchas

- `admin-build` runs `npm install` on first execution.
- Built-in `bin/console` commands win over same-named Composer scripts in `swx`; lifecycle hooks (`post-install-cmd`, `auto-scripts`) are not exposed.
- `validate`: unknown checker names fail early; `prettier`/`rector` cannot be selected; the `sw-cli` alias is deprecated.
- Top-level `url`/`admin_api` config keys are deprecated in favour of `environments`.
- The docs example `admin-api GET /_info/version` maps to the core route `/api/_info/version`.

## Version notes

`shopware-cli project generate-jwt <path-to-project>` (`--env` emits base64 `JWT_PRIVATE_KEY`/`JWT_PUBLIC_KEY`) is deprecated, removal planned October 2026. Only 6.5/6.6 use the `config/jwt/` keys; 6.7 signs JWTs with `APP_SECRET` (docs: at least 32 characters).

## Code check (6.7.15.1)
- confirmed `APP_SECRET` — 6.7 JWT configuration reads the secret from this env var (HMAC SHA-256, no key files) — vendor/shopware/core/Framework/Api/OAuth/JWTConfigurationFactory.php:23
- confirmed `JWTConfigurationFactory::createJWTConfiguration()` — builds a symmetric signer configuration — vendor/shopware/core/Framework/Api/OAuth/JWTConfigurationFactory.php:20
- confirmed `APP_SECRET_LENGTH` — generated secrets are 136 characters — vendor/shopware/core/Maintenance/System/Command/SystemGenerateAppSecretCommand.php:22
- confirmed `system:install` — core install command exists — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:31
- confirmed `/api/_info/version` — Admin API version route — vendor/shopware/core/Framework/Api/Controller/InfoController.php:229
- confirmed `/api/search/` — dynamic search route per entity — vendor/shopware/core/Framework/Api/Route/ApiRouteLoader.php:109
- unverified `APP_SECRET` minimum length 32 — no length check found in core; documented constraint only
- unverified `shopware-cli` — Go CLI, not part of the Shopware core/storefront/administration packages
- unverified `messenger:consume` — Symfony Messenger command, vendor/symfony out of scope
- unverified `cache:clear` — Symfony FrameworkBundle command, vendor/symfony out of scope
