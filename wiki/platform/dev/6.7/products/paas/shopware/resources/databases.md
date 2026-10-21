---
id: platform/dev/6.7/products/paas/shopware/resources/databases.md
title: Databases
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/resources/databases.html
sourceHash: 9dd29967409168f1512f7d930e6b0daba19414c9
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-paas open service", "sw-paas", "--service database", "mysql", "database cluster", "managed database", "db tunnel", "port 3306", "shopware paas native", "backups"]
summary: Shopware PaaS Native gives each application a managed MySQL cluster; connect only via the CLI tunnel `sw-paas open service --service database --port 3306`.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/paas/shopware/known-issues.md"]
---
## What it is

Shopware PaaS Native provisions a managed MySQL cluster for every application created. The platform handles automatic backups and recovery, high availability, performance monitoring and metrics, resource scaling (CPU, RAM, storage), and encryption of data at rest and in transit.

## When to use

When you need to reach the database of a PaaS Native application from your machine, for example to inspect data or run queries with a local client.

## Key steps / config

Open a tunnel to the database service with the PaaS CLI:

```sh
sw-paas open service --service database --port 3306
```

Database access is only provided through this CLI tunnel.

## Essential identifiers

- `sw-paas open service --service database --port 3306` — opens the database tunnel
- MySQL port `3306`

## Gotchas

- Direct public exposure of the database is not supported; there is no public endpoint to connect to.
- Network conditions can affect the tunnel command — see the [known issues](platform/dev/6.7/products/paas/shopware/known-issues.md) page before running it.

## Code check (6.7.15.1)
- unverified `sw-paas open service` — PaaS CLI tool, not part of the installed shopware/core, storefront or administration code
- unverified `--service database` — PaaS CLI option, out of scope of the vendor roots
