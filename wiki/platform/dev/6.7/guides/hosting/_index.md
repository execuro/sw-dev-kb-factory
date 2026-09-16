---
id: platform/dev/6.7/guides/hosting/_index.md
title: Hosting
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/
sourceHash: 92f2e3d19defbb1437e05bdfbadd21718e44ee8f
codeCheckedAgainst: "6.7.13.0"
keywords: ["hosting", "server stack", "supported versions", "php version", "php extensions", "memory_limit", "max_execution_time", "mariadb", "mysql", "opensearch", "redis", "valkey", "rabbitmq", "max_allowed_packet", "requirements"]
summary: Recommended Shopware 6.7 application stack and minimum versions for PHP, MariaDB/MySQL, Node.js, OpenSearch, Redis/Valkey, web server and queue.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/installation/system-requirements.md"]
---
## What it is

Entry page of the hosting guides: the recommended application stack and supported component versions for running Shopware 6. Physical machine requirements are covered separately in [system requirements](platform/dev/6.7/guides/installation/system-requirements.md).

## When to use

When provisioning a server or local environment, checking whether a PHP/database/search/cache version is supported, or verifying PHP settings before installation.

## Key steps / config

| Component | Minimum | Recommended | Notes |
|---|---|---|---|
| PHP (required) | 8.2 | 8.4 | installed core accepts `~8.2.0 \|\| ~8.3.0 \|\| ~8.4.0 \|\| ~8.5.0`; `memory_limit` ≥ `512M`, `max_execution_time` ≥ 30s; Composer 2.2+ recommended |
| SQL (required) | MariaDB 10.11 (docs: 10.11.6) / MySQL 8.0.22 | MariaDB 11.4 / MySQL 8.4 | MySQL Innovation releases unsupported; `max_allowed_packet` ≥ `32M` |
| Node.js / npm (required) | Node 20.0.0 | Node 24 / npm 10 | |
| Search (optional) | OpenSearch 1.0 / Elasticsearch 7.8 | OpenSearch 2.17.1 | admin search preview needs OpenSearch 2.12+ or Elasticsearch 8.8+ |
| Cache / KV (optional) | Redis 7 | Valkey 8.0 | `maxmemory-policy: volatile-lfu`; caching and sessions |
| Web server (required) | any | Caddy | Apache and Nginx configs exist; Symfony CLI server works for local dev |
| Queue (optional) | any Symfony Messenger transport | RabbitMQ | SQL database is the default queue; use a dedicated queue in production |

PHP extensions required by the installed `shopware/core` composer package: `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `gd`, `intl`, `json`, `libxml`, `mbstring`, `openssl`, `pdo`, `pdo_mysql`, `session`, `simplexml`, `sodium`, `xml`, `xmlreader`, `zip`, `zlib`. Optional: `amqp` (message queues).

Verify the environment:

- `php -v`, `php -m`, `php -i | grep memory_limit`
- `composer -V`, `node -v`, `npm -v`

## Essential identifiers

- `memory_limit`, `max_execution_time`, `max_allowed_packet`, `maxmemory-policy: volatile-lfu`
- `php -m | grep intl`, `brew install php-intl`

## Gotchas

- CLI and FPM often use different `php.ini` files and a host may have several PHP binaries; check the one that actually runs Shopware.
- Homebrew PHP on macOS may lack `intl`; install `php-intl` separately and verify with `php -m | grep intl`.
- The docs' extension list (`iconv`, `pcre`, `phar`) differs from the installed core's composer requirements, which also demand `filter`, `json`, `libxml`, `pdo`, `session` and `sodium`.

## Version notes

- OpenSearch 3.1 support was added in Shopware 6.7.3.1.

## Code check (6.7.13.0)
- corrected `php` — docs: 8.2+ ; core allows 8.2 to 8.5 — vendor/shopware/core/composer.json:51
- corrected `ext-sodium` — docs omit it (and `filter`, `json`, `libxml`, `pdo`, `session`) — vendor/shopware/core/composer.json:67
- confirmed `ext-intl` — required extension — vendor/shopware/core/composer.json:58
- confirmed `MEMORY_LIMIT_REQUIREMENT` — installer checks `512M` — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:18
- confirmed `MAX_EXECUTION_TIME_REQUIREMENT` — installer checks 30 — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:17
- confirmed `$mysqlRequiredVersion` — `8.0.22` — vendor/shopware/core/Maintenance/System/Service/DatabaseConnectionFactory.php:38
- corrected `$mariaDBRequiredVersion` — docs: 10.11.6; code checks `10.11` — vendor/shopware/core/Maintenance/System/Service/DatabaseConnectionFactory.php:39
- unverified `max_allowed_packet` — database server setting, not enforced in scanned code
- unverified `maxmemory-policy` — Redis/Valkey server setting, out of scope
