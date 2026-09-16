---
id: platform/dev/6.7/guides/installation/legacy-setups/devenv-setup.md
title: Install with Devenv
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/legacy-setups/devenv-setup.html
sourceHash: e3cbeba1fb12f249d6d49afaf06433bf1e160c0d
codeCheckedAgainst: "6.7.13.0"
keywords: ["devenv", "nix", "devenv up", "devenv shell", "devenv.nix", "devenv.local.nix", "frosh/devenv-meta", "system:install", "direnv", "DATABASE_URL", "framework:demodata", "dal:refresh:index", "adminer", "mailhog", "local development environment"]
summary: "Install Shopware with Nix-based Devenv: Nix and Devenv setup, frosh/devenv-meta, devenv up, system:install, direnv, default service ports."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/installation/legacy-setups/devenv-options.md", "platform/dev/6.7/guides/installation/system-requirements.md"]
---
## What it is

A guide for running Shopware with Devenv, a Nix-based tool that installs project-local PHP, Node.js, Composer and services (MySQL, Redis, OpenSearch, ...) from a `devenv.nix` file. Services and binaries run natively on the host, without containers or VMs, with state stored per project.

## When to use

Setting up a reproducible, non-Docker local or CI environment, especially as a Shopware core contributor or advanced user. General requirements: [system requirements](platform/dev/6.7/guides/installation/system-requirements.md).

## Key steps / config

Host prerequisites: Nix package manager, Git, and optionally Docker Engine for extra containerised services.

1. Install Nix (Determinate Systems installer, multi-user mode):
   `curl -L https://install.determinate.systems/nix | sh -s -- install`
   Restart the terminal, or load it in the current shell: `. /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh`
2. Install/update Devenv: `nix profile install github:cachix/devenv/latest`
3. Verify: `nix --version`, `devenv --version`, `which devenv`, `devenv help`.
4. Get a project with a `devenv.nix`:
   - New project: `composer create-project shopware/production <project-name>`, then `composer require frosh/devenv-meta` (generates a basic `devenv.nix`).
   - Core contribution: `git clone https://github.com/shopware/shopware.git && cd shopware` (already contains `devenv.nix`).
5. Make sure ports `8000`, `3306`, `6379` (and `80`) are free (`lsof -i :80 -i :3306 -i :6379 -i :8000` on macOS, `ss -tulpn | grep ...` on Linux, with `sudo` to include system services).
6. Optional: check the `.env` database connection:
   `DATABASE_URL="mysql://shopware:shopware@127.0.0.1:3306/shopware?sslmode=disable&charset=utf8mb4"`
7. Start services: `devenv up`. In a new terminal: `devenv shell`.
8. Inside the shell: `bin/console system:install --basic-setup --create-database --force`
9. Open `localhost:8000/admin` (port 8000, http); log in with `admin` / `shopware`.
10. Demo data (optional): `composer setup && APP_ENV=prod bin/console framework:demodata && APP_ENV=prod bin/console dal:refresh:index`

Direnv (optional) auto-activates the environment on `cd`: install it (`brew install direnv`, `apt install direnv`, or `nix profile install nixpkgs#direnv`), add `eval "$(direnv hook bash)"` / `eval "$(direnv hook zsh)"` / `direnv hook fish | source` to the shell config, then run `direnv allow` once per project and `direnv reload` after config changes. `devenv up` is still required once.

Default services:

| Service | Address |
|---|---|
| MySQL | `mysql://shopware:shopware@127.0.0.1:3306` (data in `<PROJECT_ROOT>/.devenv/state/mysql`) |
| Mailhog (SMTP) | `smtp://127.0.0.1:1025`, web UI on `localhost:8025` |
| Redis | `tcp://127.0.0.1:6379` |
| Caddy | `127.0.0.1:8000` |
| Adminer | `127.0.0.1:9080` (user `shopware`, password `shopware`) |

Customisation goes into `<PROJECT_ROOT>/devenv.local.nix` (disable services, change settings, add services):

```nix
{ pkgs, config, lib, ... }:
{
  services.adminer.enable = false;
  services.caddy.virtualHosts."<scheme>://shopware.swag" = { extraConfig = '' ... ''; };
  languages.javascript = { package = pkgs.nodejs-18_x; };
  env.APP_URL = "<scheme>://shopware.swag:YOUR_CADDY_PORT";
}
```

Without Direnv, reload after changing any `*.nix` file with `exit` then `devenv shell`. Binaries live in `<PROJECT_ROOT>/.devenv/profile/bin` (useful for IDE interpreter config). More recipes: [Additional Devenv Options](platform/dev/6.7/guides/installation/legacy-setups/devenv-options.md).

## Essential identifiers

- `devenv up`, `devenv shell`, `devenv.nix`, `devenv.local.nix`
- `frosh/devenv-meta`, `shopware/production`
- `bin/console system:install --basic-setup --create-database --force`
- `bin/console framework:demodata`, `bin/console dal:refresh:index`, `bin/console database:migrate`
- `DATABASE_URL`, `APP_URL`
- `direnv allow`, `direnv reload`

## Gotchas

- Remove older single-user or Homebrew Nix installs first (`~/.nix-profile`, `~/.nix-defexpr`, `~/.nix-channels`, `~/.local/state/nix`, `/nix`); deleting `/nix` removes the global store and may need `sudo`.
- If Nix commands are missing after install, restart the terminal or `source ~/.zshrc`.
- Occupied service ports make Devenv fail to start the corresponding service.
- Use `127.0.0.1`, not `localhost`, when connecting to MySQL. If you change the MySQL port/user in `devenv.local.nix`, update `DATABASE_URL` too.
- Redis error `Failed to configure LOCALE for invalid locale name`: `export LANG=en_US.UTF-8` before starting.
- WSL2: change the default sales channel domain to `localhost:8000` using http, not https.
- If installation completes without schema creation, run `bin/console database:migrate`.
- `system:install` refuses to run when `install.lock` exists unless `--force` is passed.
- Do not commit service tokens or credentials; keep secrets in `.env` or a secret manager.

## Code check (6.7.13.0)
- confirmed `system:install` — console command name — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:27
- confirmed `basic-setup` — option creates admin user and storefront sales channel — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:48
- confirmed `create-database` — option creates the database if missing — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:46
- confirmed `force` — option bypasses the install.lock check — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:49
- confirmed `DATABASE_URL` — read from env by the installer, required — vendor/shopware/core/Maintenance/System/Struct/DatabaseConnectionInformation.php:53
- confirmed `framework:demodata` — console command name — vendor/shopware/core/Framework/Demodata/Command/DemodataCommand.php:42
- confirmed `dal:refresh:index` — console command name — vendor/shopware/core/Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:22
- confirmed `database:migrate` — console command name; also run by system:install — vendor/shopware/core/Framework/Migration/Command/MigrationCommand.php:21
- unverified `frosh/devenv-meta` — third-party Composer package, outside vendor/shopware scope
- unverified `devenv up` — Devenv CLI, outside vendor/shopware scope
