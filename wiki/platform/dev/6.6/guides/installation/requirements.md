---
id: platform/dev/6.6/guides/installation/requirements.md
title: Requirements
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/installation/requirements.html
sourceHash: e695152a037a5dad6e0247127d5262b4562ac4d1
keywords: ["requirements", "PHP version", "memory_limit", "max_execution_time", "Composer", "MySQL", "MariaDB", "Node.js", "Redis", "Valkey", "webserver", "Symfony CLI", "operating system", "Unix", "WSL"]
summary: Lists the operating system, PHP, database, Node.js, key-value store, and webserver requirements for running Shopware 6.
lastBuilt: "2026-09-15"
---
## What it is

This page lists the environment requirements that must be met before installing Shopware 6: operating system, PHP, SQL database, JavaScript tooling, a Redis-protocol key/value store, and a webserver.

## When to use

Check this page before installing Shopware 6 locally or on a server, to confirm the environment meets the minimum versions and extensions Shopware needs.

## Key steps / config

Shopware 6 is only supported on Unix operating systems; Windows is only supported inside WSL 2 or Docker. To inspect the current environment, use `php -v`, `php -m`, `php -i | grep memory_limit`, `composer -V`, `node -v`, and `npm -v`.

PHP requirements:
- Compatible versions: 8.2, 8.3 and 8.4.
- `memory_limit`: 512M minimum.
- `max_execution_time`: 30 seconds minimum.
- Required extensions: `ext-amqp` (only if using a message queue, the default on PaaS), `ext-curl`, `ext-dom`, `ext-fileinfo`, `ext-gd`, `ext-iconv`, `ext-intl`, `ext-mbstring`, `ext-openssl`, `ext-pcre`, `ext-pdo`, `ext-pdo_mysql`, `ext-phar`, `ext-simplexml`, `ext-xml`, `ext-zip`, `ext-zlib`.
- Composer: version 2.2 or higher recommended.

SQL requirements:
- MySQL: recommended 8.4, minimum 8.0.22.
- MariaDB: recommended 11.4, minimum 10.11.6 or 11.0.4.
- For optimal MySQL performance, set `max_allowed_packet` to at least 32 MB.

JavaScript requirement: Node.js 22.0.0 or higher.

Shopware uses the Redis protocol, so it supports Redis-compatible key/value stores such as Valkey (recommended), Redis v7 or higher, Redict, KeyDB, and Dragonfly. Recommended configuration: `maxmemory-policy` set to `volatile-lfu`.

For local development, the Symfony CLI webserver is recommended.

The documentation's recommended full stack is: webserver Caddy, PHP 8.4, SQL MariaDB 11.4, Node 22, search OpenSearch 2.17.1, queue RabbitMQ, cache Valkey 8.0.

## Essential identifiers

- `memory_limit`, `max_execution_time` (php.ini)
- `ext-amqp`, `ext-pdo_mysql`, and the other listed `ext-*` PHP extensions
- `php -v`, `php -m`, `composer -V`, `node -v`, `npm -v` diagnostic commands
- `maxmemory-policy` / `volatile-lfu` (Redis-compatible store setting)
- `max_allowed_packet` (MySQL setting)

## Gotchas

On many shared hosting environments there are multiple PHP versions installed, and CLI and FPM can use different `php.ini` files — confirm with the hosting provider which PHP binary and `php.ini` apply.
