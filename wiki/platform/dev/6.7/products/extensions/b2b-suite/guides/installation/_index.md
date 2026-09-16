---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/installation/_index.md
title: Installation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/installation/
sourceHash: 2ce43269bafc4f391cd8f7989a7d48d09dbb3dcb
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "installation", "psh.phar", "docker:start", "docker:ssh", "./psh.phar init", "mac:init", ".psh.yaml", "DB_USER", "SW_HOST", "system requirements", "development environment"]
summary: B2B Suite dev environment setup with psh.phar - Docker commands (docker:start, init), macOS mac:* commands, .psh.yaml DB constants, version requirements.
lastBuilt: 2026-09-15
---
## What it is

Setup of a B2B Suite development environment using the `psh.phar` script runner, either with Docker on Linux (recommended, also used in CI) or natively on macOS, plus the minimum requirements per B2B Suite version.

## When to use

When setting up a local or CI environment to develop or test the B2B Suite. For production, the host must meet the Shopware core system requirements.

## Key steps / config

Minimum requirements (B2B Suite follows core requirements):
- B2B Suite 4.6.0 till 4.6.9: Shopware 6.4, PHP 7.4.3, MySQL 5.7.21, MariaDB 10.3.22
- B2B Suite 4.7.0 and above: Shopware 6.5

Docker (Linux, docker runtime 1.12.* or higher):
```bash
./psh.phar docker:start     # start & build containers
./psh.phar docker:ssh       # ssh into web container
./psh.phar docker:ssh-mysql # ssh into mysql
./psh.phar docker:status    # running containers, network bridges
./psh.phar docker:stop
./psh.phar docker:destroy   # clear the whole docker cache
```
1. `./psh.phar docker:start`
2. `./psh.phar docker:ssh`
3. `./psh.phar init` inside the web container; after a few minutes the test environment is reachable at 10.100.200.46.
4. `./psh.phar` without arguments lists all commands.

macOS (requires Apache, MySQL and Ant, e.g. via brew): `./psh.phar mac:init`, `mac:start`, `mac:stop`, `mac:restart`. Database settings go into your own `.psh.yaml` (see `.psh.yaml.dist`):
```yaml
mac:
    paths:
      - "dev-ops/mac/actions"
    const:
      DB_USER: "..."
      DB_PASSWORD: "..."
      DB_HOST: "..."
      SW_HOST: "..."
```

Common scripts once the environment runs: `./psh.phar clear` (remove vendor components and state), `./psh.phar init` (Composer init, install plugins), `./psh.phar unit` (run test suite).

## Essential identifiers

- `psh.phar`, `./psh.phar init`, `./psh.phar clear`, `./psh.phar unit`
- `docker:start`, `docker:ssh`, `docker:ssh-mysql`, `docker:status`, `docker:stop`, `docker:destroy`
- `mac:init`, `mac:start`, `mac:stop`, `mac:restart`
- `.psh.yaml`, `.psh.yaml.dist`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `SW_HOST`

## Gotchas

- Docker and native setups offer equal functionality only when the host is Linux-based.
- The listed version requirements stop at Shopware 6.5; the page states nothing specific for 6.7.

## Code check (6.7.13.0)
- unverified `psh.phar` — B2B Suite repository tooling, not in vendor/shopware
- unverified `docker:start` — psh script of the B2B Suite repository, out of scope
- unverified `mac:init` — psh script of the B2B Suite repository, out of scope
- unverified `.psh.yaml` — B2B Suite repository config file, out of scope
- unverified `B2B Suite 4.7.0 requires Shopware 6.5` — plugin composer constraints not in vendor/shopware
