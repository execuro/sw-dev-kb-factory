---
id: platform/dev/6.7/guides/installation/legacy-setups/devenv-setup.md
title: Install with Devenv
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/legacy-setups/devenv-setup.html
sourceHash: 8de1f918c3c33b694f59a2cd4e2be9936bec20c1
codeCheckedAgainst: "6.7.15.1"
keywords: ["devenv", "nix", "devenv.nix", "devenv.local.nix", "frosh/devenv-meta", "devenv up", "devenv shell", "direnv", "system:install", "DATABASE_URL", "framework:demodata", "local development environment", "mailpit", "adminer"]
summary: Set up Shopware 6.7 locally with Nix-based Devenv (no containers), default services and ports, system:install, Direnv, devenv.local.nix overrides.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/installation/system-requirements.md", "platform/dev/6.7/guides/installation/legacy-setups/devenv-options.md"]
---
## What it is

Guide to running Shopware with Devenv, a Nix-based tool that installs exact, per-project versions of PHP, Node.js, Composer and services (MySQL, Redis, Caddy, Mailpit, Adminer) natively on the host — no Docker or VM. The environment is declared in `devenv.nix`.

## When to use

Shopware core contributors or advanced users who want reproducible local and CI builds without containerization. For general system requirements see [system requirements](platform/dev/6.7/guides/installation/system-requirements.md).

## Key steps / config

Host needs only the Nix package manager, Git, and optionally Docker Engine for extra containerized services.

1. Install Nix (Determinate Systems installer, multi-user mode):
   `curl -L https://install.determinate.systems/nix | sh -s -- install`
   Restart the terminal, or load it with `. /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh`.
2. Install Devenv (**2.4 or newer** required by the Shopware config): `nix profile add nixpkgs#devenv` (older Nix: `nix profile install`); update with `nix profile upgrade devenv`. Verify with `nix --version`, `devenv version`.
3. Get a project:
   - New project (no host PHP needed):
     `nix run nixpkgs#php84Packages.composer -- create-project shopware/production <project-name>`
     then `nix run nixpkgs#php84Packages.composer -- require frosh/devenv-meta` — adds `devenv.nix`, `devenv.yaml`, `devenv.lock`, `.envrc`.
   - Core contribution: `git clone https://github.com/shopware/shopware.git && cd shopware` (already ships `devenv.nix`).
4. `devenv up` (foreground; `devenv up -d` background, `devenv down` to stop).
5. In a new terminal: `devenv shell`, then
   `bin/console system:install --basic-setup --create-database --force`
6. Open the Admin at 127.0.0.1 port 8000, path `/admin`; login `admin` / `shopware`.
7. Demo data: `composer require --dev shopware/dev-tools`, then
   `APP_ENV=prod bin/console framework:demodata && APP_ENV=prod bin/console dal:refresh:index`.
   On `shopware/shopware`, run `composer setup` first. If schema creation was skipped, run `bin/console database:migrate`.

Environment: Devenv exports `DATABASE_URL`, `MAILER_DSN`, and (when the services are enabled) `MESSENGER_TRANSPORT_DSN` and `OPENSEARCH_URL`. Real env vars beat `.env` values. Database `shopware`, user `shopware`, password `shopware` are created on first start.

Default services: MySQL `127.0.0.1:3306` (data in `<PROJECT_ROOT>/.devenv/state/mysql`), Mailpit SMTP `1025` / UI `8025`, Redis `6379` (sessions; `redis` PHP extension auto-enabled), Caddy `8000`, Adminer `8010` (server `127.0.0.1`, user/password/db `shopware`). RabbitMQ and OpenSearch are optional (see [Devenv options](platform/dev/6.7/guides/installation/legacy-setups/devenv-options.md)).

Overrides go in `devenv.local.nix`:

```nix
{ pkgs, config, lib, ... }:
{
  services.adminer.enable = false;
  languages.php.version = "8.3";
  languages.javascript.package = pkgs.nodejs_24;
  env.SHOPWARE_HTTP_CACHE_ENABLED = "0";
}
```

Restart services and shell after editing (`exit`, `devenv shell` without Direnv). Binaries live in `<PROJECT_ROOT>/.devenv/profile/bin` (useful for IDE interpreters).

Direnv (optional): install it, add `eval "$(direnv hook zsh)"` (or `bash`; fish: `direnv hook fish | source`), then `direnv allow` on first entry and `direnv reload` after config changes. The `.envrc` from `frosh/devenv-meta` uses `eval "$(devenv direnvrc)"`. Services still need `devenv up`.

## Essential identifiers

- `devenv.nix`, `devenv.yaml`, `devenv.lock`, `.envrc`, `devenv.local.nix`
- `frosh/devenv-meta`, `shopware/dev-tools`
- `devenv up`, `devenv shell`, `devenv down`, `direnv allow`
- `bin/console system:install --basic-setup --create-database --force`
- `framework:demodata`, `dal:refresh:index`, `database:migrate`
- `DATABASE_URL`, `MAILER_DSN`, `MESSENGER_TRANSPORT_DSN`, `OPENSEARCH_URL`, `SHOPWARE_HTTP_CACHE_ENABLED`

## Gotchas

- Remove older single-user or `brew install nix` installations first (`rm -rf ~/.nix-profile ~/.nix-defexpr ~/.nix-channels ~/.local/state/nix` and `/nix`, may need `sudo`) — this deletes the global Nix store.
- `strict_ports` is enabled: if 8000, 3306, 6379, 8010, 1025 or 8025 is taken, `devenv up` fails with e.g. `Port 3306 is already in use (PID 12345)`. Check with `lsof -i :8000 ...` (macOS) or `ss -tulpn` (Linux, `sudo` for system services).
- Use `127.0.0.1`, not `localhost`: the install stores 127.0.0.1 port 8000 as the Storefront sales channel domain, and MySQL should be reached via `127.0.0.1`.
- WSL2: change the sales channel domain to localhost port 8000 over plain http, not https.
- Redis error `Failed to configure LOCALE for invalid locale name`: `export LANG=en_US.UTF-8`.
- Caddy's admin API on `127.0.0.1:2019` is expected; multiple projects share it via `SO_REUSEPORT` on macOS/Linux.
- Do not commit service tokens or credentials.

## Code check (6.7.15.1)
- confirmed `system:install` — install command name — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:31
- confirmed `--create-database` — option creates database if missing — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:50
- confirmed `--basic-setup` — creates admin user and storefront sales channel — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:52
- confirmed `--force` — installs even if install.lock exists — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:53
- confirmed `admin` — basic-setup creates user admin with password shopware — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:134
- confirmed `framework:demodata` — command defined in core — vendor/shopware/core/Framework/Demodata/Command/DemodataCommand.php:44
- confirmed `dal:refresh:index` — command name — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:23
- confirmed `database:migrate` — command name; also run by system:install — vendor/shopware/core/Framework/Migration/Command/MigrationCommand.php:22
- confirmed `DATABASE_URL` — read by the MySQL connection factory — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:42
- confirmed `SHOPWARE_HTTP_CACHE_ENABLED` — env var backs shopware.http.cache.enabled — vendor/shopware/core/Framework/DependencyInjection/services.php:189
