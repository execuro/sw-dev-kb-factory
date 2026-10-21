---
id: platform/dev/6.7/guides/hosting/infrastructure/_index.md
title: Infrastructure
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/
sourceHash: 013a72d1dabcb3c2accd2f6bbe74d6d375cc3ed4
codeCheckedAgainst: "6.7.15.1"
keywords: ["infrastructure", "hosting", "elasticsearch", "database cluster", "filesystem", "media files", "message queue", "rate limiter", "reverse proxy", "https", "DATABASE_URL", "MESSENGER_TRANSPORT_DSN", "SHOPWARE_ES_ENABLED"]
summary: "Overview of Shopware hosting infrastructure: Elasticsearch, database cluster, media filesystem, message queue, rate limiter and reverse HTTPS proxy."
lastBuilt: 2026-10-21
---
## What it is

Entry page for the Shopware hosting infrastructure guides. The infrastructure for a Shopware installation consists of:

- Elasticsearch for advanced search
- a database cluster for data storage
- a filesystem for media files
- a message queue for asynchronous communication
- a rate limiter for request management
- a reverse HTTPS proxy for secure communication

Each component is described in more detail in the following sub-pages of this section.

## When to use

When planning or reviewing a production hosting setup and deciding which infrastructure components Shopware needs.

## Essential identifiers

Entry points in the installed code for some of the components listed above (details on the sub-pages):

- `DATABASE_URL` — primary database connection string
- `SHOPWARE_ES_ENABLED` — Elasticsearch enabled flag set by the installer
- `MESSENGER_TRANSPORT_DSN` — message queue transport
- `shopware.filesystem` — filesystem configuration node

## Code check (6.7.15.1)
- confirmed `DATABASE_URL` — read by the database connection factory — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:42
- confirmed `SHOPWARE_ES_ENABLED` — written to `.env` by the installer, default `0` — vendor/shopware/core/Installer/Configuration/EnvConfigWriter.php:48
- confirmed `MESSENGER_TRANSPORT_DSN` — default `doctrine://default?auto_setup=false` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:3
- confirmed `filesystem` — bundle config node for filesystems — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:76
