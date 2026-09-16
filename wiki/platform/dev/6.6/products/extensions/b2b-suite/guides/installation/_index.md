---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/installation/_index.md
title: Installation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/installation/"
sourceHash: 2ce43269bafc4f391cd8f7989a7d48d09dbb3dcb
keywords: ["installation", "b2b suite", "psh.phar", "docker", "docker:start", "docker:ssh", "mac:init", "system requirements", "PHP", "MySQL", "MariaDB", "psh.yaml"]
summary: "B2B Suite installation on Linux (Docker via psh.phar) or OS X (mac: psh commands), with minimum requirements per suite version."
lastBuilt: "2026-09-15"
---
## What it is
Describes how to install the B2B Suite for development (Docker on Linux) or on an OS X system, and the minimum requirements for the production environment.

## When to use
When setting up a local or production environment for the B2B Suite and needing to know which Shopware Core version, PHP, and database versions are required, or which `psh.phar` commands to run.

## Key steps / config
Minimum requirements by suite version:

- B2B Suite 4.6.0–4.6.9: Shopware 6.4, PHP 7.4.3, MySQL 5.7.21, MariaDB 10.3.22.
- B2B Suite 4.7.0+: Shopware 6.5.

Docker (Linux, recommended), via `psh.phar`:

```bash
./psh.phar docker:start     # start & build containers
./psh.phar docker:ssh       # ssh access web server
./psh.phar docker:ssh-mysql # ssh access mysql
./psh.phar docker:status    # show running containers and network bridges
./psh.phar docker:stop      # stop the containers
./psh.phar docker:destroy   # clear the whole docker cache
```

After `./psh.phar docker:start` and `./psh.phar docker:ssh`, run `./psh.phar init` to initialize. The test environment then becomes reachable at the private IP address printed by the setup. Run `./psh.phar` alone to list all commands.

OS X, via Apache/MySQL/Ant (installable with brew):

```bash
./psh.phar mac:init         # build installation
./psh.phar mac:start        # start apache, mysql
./psh.phar mac:stop         # stop apache, mysql
./psh.phar mac:restart      # restart apache, mysql
```

Database configuration for the Mac setup lives in a `*.psh.yaml` file (see `*.psh.yaml.dist` for reference), with keys `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `SW_HOST` under a `mac.const` block.

Common scripts once the environment is booted:

```bash
./psh.phar clear # remove vendor components and previously set state
./psh.phar init  # init Composer, install plugins
./psh.phar unit  # execute test suite
```

## Essential identifiers
- `psh.phar` and its `docker:*`, `mac:*`, `clear`, `init`, `unit` commands
- `*.psh.yaml`, `*.psh.yaml.dist`
