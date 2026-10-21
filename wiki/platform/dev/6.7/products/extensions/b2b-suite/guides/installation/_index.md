---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/installation/_index.md
title: Installation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/installation/
sourceHash: 2ce43269bafc4f391cd8f7989a7d48d09dbb3dcb
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "installation", "psh.phar", "./psh.phar docker:start", "./psh.phar init", "./psh.phar mac:init", ".psh.yaml", "docker", "development environment", "system requirements", "DB_USER", "SW_HOST"]
summary: "B2B Suite dev setup with psh.phar: Docker commands (Linux), mac commands (OS X), .psh.yaml DB constants, per-release version requirements."
lastBuilt: 2026-10-21
---
## What it is

How to set up a B2B Suite development environment with the `psh.phar` script runner: a Docker-based setup (used by the B2B Suite developers and in their CI) for Linux hosts, a native setup for OS X, and common init/test scripts. Production installs must meet the Shopware core system requirements (see the system requirements page on `docs.shopware.com`).

## When to use

When installing the B2B Suite for local development or testing, or when checking which Shopware/PHP/database versions a B2B Suite release supports.

## Key steps / config

**Version requirements (per source):**

- B2B Suite 4.6.0 – 4.6.9: Shopware 6.4, PHP 7.4.3, MySQL 5.7.21, MariaDB 10.3.22
- B2B Suite 4.7.0 and above: Shopware 6.5

**Linux – Docker (recommended).** Requires a Docker runtime 1.12.* or higher.

```bash
./psh.phar docker:start     # start & build containers
./psh.phar docker:ssh       # ssh into the web container
./psh.phar docker:ssh-mysql # ssh into mysql
./psh.phar docker:status    # running containers / network bridges
./psh.phar docker:stop      # stop the containers
./psh.phar docker:destroy   # clear the whole docker cache
```

1. `./psh.phar docker:start` — boots several containers.
2. `./psh.phar docker:ssh` — log into the web container.
3. `./psh.phar init` — initialisation; after a few minutes the test environment is reachable at the IP address 10.100.200.46.
4. `./psh.phar` alone lists all available commands.

**OS X.** Requires Apache, MySQL and Ant (installable with brew).

```bash
./psh.phar mac:init      # build installation
./psh.phar mac:start     # start apache, mysql
./psh.phar mac:stop      # stop apache, mysql
./psh.phar mac:restart   # restart apache, mysql
```

Database settings go into your own `.psh.yaml` (use `.psh.yaml.dist` as the template):

```yaml
mac:
    paths:
      - "dev-ops/mac/actions"
    const:
      DB_USER: "USERNAME"
      DB_PASSWORD: "PASSWORD"
      DB_HOST: "DB_HOST"
      SW_HOST: "SWHost"
```

**Common scripts** (after the environment is up):

- `./psh.phar clear` — remove vendor components and previously set state
- `./psh.phar init` — init Composer, install plugins
- `./psh.phar unit` — execute the test suite

## Essential identifiers

- `psh.phar`, `.psh.yaml`, `.psh.yaml.dist`
- `docker:start`, `docker:ssh`, `docker:ssh-mysql`, `docker:status`, `docker:stop`, `docker:destroy`
- `mac:init`, `mac:start`, `mac:stop`, `mac:restart`
- `init`, `clear`, `unit`
- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `SW_HOST`

## Gotchas

- The Docker setup's functions are only equivalent across systems when the host is Linux-based.
- `psh.phar` and `.psh.yaml` belong to the B2B Suite repository, not to the Shopware platform packages.

## Version notes

- The documented requirements stop at "B2B Suite 4.7.0 and above: Shopware 6.5" and PHP 7.4.3; the installed core 6.7.15.1 requires PHP `~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0`, so the PHP 7.4 figure does not apply to a 6.7 shop.

## Code check (6.7.15.1)
- corrected `php` — docs: PHP 7.4.3 (B2B Suite 4.6.x); installed core requires ~8.2.0 through ~8.5.0 — vendor/shopware/core/composer.json:36
- confirmed `shopware/core` — installed package is the 6.7 core, newer than the Shopware 6.4/6.5 versions the page lists — vendor/shopware/core/composer.json:2
- unverified `psh.phar` — B2B Suite repository tooling, outside the platform packages
- unverified `.psh.yaml` — B2B Suite repository tooling, outside the platform packages
