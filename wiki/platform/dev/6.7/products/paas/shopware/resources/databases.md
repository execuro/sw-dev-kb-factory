---
id: platform/dev/6.7/products/paas/shopware/resources/databases.md
title: Databases
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/resources/databases.html
sourceHash: 9dd29967409168f1512f7d930e6b0daba19414c9
codeCheckedAgainst: "6.7.13.0"
keywords: ["sw-paas open service", "--service database", "--port 3306", "mysql", "database cluster", "managed database", "cli tunnel", "paas native", "backups", "database connection"]
summary: "Shopware PaaS Native gives each application a managed MySQL cluster; connect only via CLI tunnel: sw-paas open service --service database --port 3306."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/paas/shopware/known-issues.md"]
---
## What it is

Shopware PaaS Native provisions a managed MySQL cluster for each application. The platform handles automatic backups and recovery, high availability, performance monitoring and metrics, resource scaling (CPU, RAM, storage), and encryption of data at rest and in transit.

## When to use

When you need to connect to an application's database on PaaS Native, e.g. to inspect data with a MySQL client.

## Key steps / config

Open a CLI tunnel to the database service:

```sh
sw-paas open service --service database --port 3306
```

Then connect your MySQL client through that tunnel.

## Essential identifiers

- `sw-paas open service --service database --port 3306`

## Gotchas

- Database access is only via the CLI tunnel; direct public database exposure is not supported.
- Check the [known issues](platform/dev/6.7/products/paas/shopware/known-issues.md) for network considerations when running the tunnel command.

## Code check (6.7.13.0)
- unverified `sw-paas open service` — PaaS Native CLI command, not part of vendor/shopware core/storefront/administration
- unverified `mysql cluster` — managed backups, HA and scaling are PaaS infrastructure, outside vendor/shopware
- confirmed `DATABASE_URL` — Shopware connects to MySQL through the DATABASE_URL env variable (not named by the docs page) — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:42
