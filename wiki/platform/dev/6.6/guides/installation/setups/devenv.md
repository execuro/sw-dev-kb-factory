---
id: platform/dev/6.6/guides/installation/setups/devenv.md
title: Devenv
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/installation/setups/devenv.html
sourceHash: 21112fcf6ab31355741cb9a1440086968db80517
keywords: ["devenv", "nix", "cachix", "direnv", "devenv.nix", "devenv.local.nix", "devenv up", "devenv shell", "blackfire", "xdebug", "varnish", "reproducible dev environment"]
summary: "Devenv installs and runs Shopware's dev services natively (no containers) via a per-project devenv.nix description."
lastBuilt: 2026-09-15
---

## What it is

Devenv is a dependency manager for the services and binaries (PHP, Node, MySQL, Redis,
OpenSearch, etc.) a project needs for local development or CI, described in a
`devenv.nix` file and locked to reproducible versions. Unlike Docker or a VM, the services
run natively rather than in containers.

## When to use

For a reproducible per-project local (or CI) environment on Linux, WSL or macOS without
container/virtualization overhead.

## Key steps / config

- Install Nix, then Cachix, then devenv (`nix-env -iA cachix ...`, `cachix use devenv`,
  `nix-env -iA devenv -f https://github.com/NixOS/nixpkgs/tarball/nixpkgs-unstable`), and
  `cachix use shopware` for Shopware's build cache.
- Create a project either via `composer create-project shopware/production <project-name>`
  then `composer require devenv` (adds `devenv.nix`), or by cloning `shopware/shopware`.
- Boot services: `devenv up`. Adjust `.env`'s `DATABASE_URL` to the local devenv MySQL
  (`mysql://shopware:shopware@127.0.0.1:3306/shopware?sslmode=disable&charset=utf8mb4`).
- In a new terminal, `devenv shell` to enter the environment with php/composer/npm/node,
  then `bin/console system:install --basic-setup --create-database --force` to initialize
  Shopware. Default credentials: user `admin`, password `shopware`.
- Optionally install `direnv` so the environment activates automatically on `cd`; add the
  `direnv hook` to the shell rc file and run `direnv allow`.
- Customize services by creating `devenv.local.nix`:
  ```nix
  { pkgs, config, lib, ... }:
  {
    services.adminer.enable = false;
    languages.javascript.package = pkgs.nodejs-18_x;
    env.APP_URL = "...";
  }
  ```
- Enable Blackfire, XDebug, Varnish, an alternate MySQL/MariaDB version, or pinned package
  versions the same way, via `services.blackfire.*`, `languages.php.extensions`,
  `services.varnish.*`, `services.mysql.package`, or `overrideAttrs`.
- Reload after editing `*.nix` files: exit and re-enter `devenv shell` (or let direnv do
  it automatically).
- Clean up orphaned services/packages: `devenv gc`.

## Essential identifiers

- `devenv.nix`, `devenv.local.nix`
- `devenv up`, `devenv shell`, `devenv gc`
- `services.adminer`, `services.blackfire`, `services.varnish`, `services.mysql`,
  `services.caddy`, `languages.php.extensions`, `languages.javascript.package`
- `bin/console system:install --basic-setup --create-database --force`

## Gotchas

- Service ports must be free before `devenv up`, or the command fails.
- On Windows/WSL2, the default sales channel domain must be changed to the Caddy address
  used locally, and it must use plain HTTP, not HTTPS.
- The MySQL service cannot be reached over the `localhost` socket — use `127.0.0.1`
  instead.
- Direnv performance degrades as the project directory grows (a known upstream issue).
- Redis can fail to start with a locale other than `en_US`; export `LANG=en_US.UTF8` as a
  workaround.

## Version notes

Devenv is built on Nix; the guide targets Shopware 6.6 and its `template` (Symfony Flex)
or the `shopware/shopware` core repository as the two supported project sources.
