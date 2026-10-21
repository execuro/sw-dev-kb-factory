---
id: platform/dev/6.7/guides/hosting/_index.md
title: Hosting
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/
sourceHash: 92f2e3d19defbb1437e05bdfbadd21718e44ee8f
codeCheckedAgainst: "6.7.15.1"
keywords: ["hosting", "server requirements", "supported versions", "php", "mariadb", "mysql", "opensearch", "elasticsearch", "redis", "valkey", "memory_limit", "max_allowed_packet", "rabbitmq", "caddy", "php extensions"]
summary: Shopware 6.7 supported stack - PHP 8.2+, MariaDB 10.11+/MySQL 8.0.22+, Node 20+, optional search, cache and queue - plus php.ini minimums.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/installation/system-requirements.md"]
---
## What it is

Overview of the recommended application stack and minimum supported versions for running Shopware 6.7. Physical machine requirements are on [System requirements](platform/dev/6.7/guides/installation/system-requirements.md).

## When to use

When setting up or auditing a server or local environment for Shopware: choosing PHP, database, search, cache, web server and queue versions, and checking `php.ini` limits.

## Key steps / config

| Component | Minimum | Recommended | Notes |
|---|---|---|---|
| PHP | 8.2 (composer allows 8.2, 8.3, 8.4, 8.5) | 8.4 | Required; Composer 2.2+ recommended |
| SQL | MariaDB 10.11 (docs: 10.11.6) or MySQL 8.0.22; no Innovation releases | MariaDB 11.4 / MySQL 8.4 | Required; `max_allowed_packet ≥ 32M` |
| Node.js / npm | Node 20.0.0 | Node 24 / npm 10 | Required |
| Search | OpenSearch 1.0 or Elasticsearch 7.8 | OpenSearch 2.17.1 | Optional; admin search preview needs OpenSearch 2.12+ or Elasticsearch 8.8+ |
| Cache / KV | Redis 7 | Valkey 8.0 | Optional; caching and sessions; `maxmemory-policy: volatile-lfu` |
| Web server | any | Caddy | Required; Apache and Nginx also documented; Symfony CLI server for local dev |
| Queue | any Symfony Messenger transport | RabbitMQ | Optional; default is the SQL database, a dedicated queue is recommended in production |

PHP settings checked by the installer: `memory_limit` ≥ `512M` (or `-1`), `max_execution_time` ≥ `30` (or `0`).

PHP extensions required by `shopware/core`'s `composer.json`: `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `gd`, `intl`, `json`, `libxml`, `mbstring`, `openssl`, `pdo`, `pdo_mysql`, `session`, `simplexml`, `sodium`, `xml`, `xmlreader`, `zip`, `zlib`. Optional: `amqp` for message queues.

Verify your environment:

- `php -v`, `php -m`, `php -i | grep memory_limit`
- `composer -V`, `node -v`, `npm -v`
- macOS/Homebrew: `brew install php-intl`, then `php -m | grep intl`

## Essential identifiers

- `memory_limit`, `max_execution_time` (php.ini)
- `max_allowed_packet` (MySQL/MariaDB)
- `maxmemory-policy: volatile-lfu` (Redis/Valkey)

## Gotchas

- CLI and FPM often use different PHP binaries and `php.ini` files; check the one that actually serves the shop.
- Homebrew PHP may lack the `intl` extension.
- The docs list `iconv`, `pcre` and `phar` as required extensions; core's `composer.json` does not require them, but requires `filter`, `json`, `libxml`, `pdo`, `session` and `sodium`, which the docs omit.
- The runtime DB check rejects MariaDB below 10.11 and MySQL below 8.0.22 when the connection is created.

## Version notes

- OpenSearch 3.1 support was added in Shopware 6.7.3.1.

## Code check (6.7.15.1)
- corrected `php` — docs: 8.2+; composer allows 8.2 to 8.5 — vendor/shopware/core/composer.json:36
- confirmed `ext-intl` — required extension — vendor/shopware/core/composer.json:43
- corrected `ext-sodium` — docs: not listed; required by composer — vendor/shopware/core/composer.json:52
- corrected `$mariaDBRequiredVersion` — docs: MariaDB 10.11.6; code checks 10.11 — vendor/shopware/core/Maintenance/System/Service/DatabaseConnectionFactory.php:39
- confirmed `$mysqlRequiredVersion` — MySQL 8.0.22 — vendor/shopware/core/Maintenance/System/Service/DatabaseConnectionFactory.php:38
- confirmed `MEMORY_LIMIT_REQUIREMENT` — `512M`, `-1` also passes — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:18
- confirmed `MAX_EXECUTION_TIME_REQUIREMENT` — 30 seconds, `0` also passes — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:17
- unverified `max_allowed_packet` — server setting, no check found in core
- unverified `maxmemory-policy` — Redis/Valkey server setting, outside the checked packages
- unverified `OpenSearch` — search server versions not checked in core
