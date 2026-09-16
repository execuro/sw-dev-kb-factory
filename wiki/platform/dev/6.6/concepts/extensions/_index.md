---
id: platform/dev/6.6/concepts/extensions/_index.md
title: Extensions
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/extensions/
sourceHash: f58a30a8cd33293485c12e7aed6b16edc56b9311
keywords: ["Extensions", "Apps", "Plugins", "app system", "webhooks", "Admin REST API", "service facade", "database migrations", "Shopware Core", "extensibility", "Shopware cloud"]
summary: "Overview of Shopware's two extension systems: apps, which are webhook-driven and external, and plugins, which run in-process with direct core access."
lastBuilt: 2026-09-15
---
## What it is
Shopware's Core is designed to give developers a clear extensibility model without sacrificing maintainability or structural integrity. This section introduces the two ways to extend Shopware: apps and plugins.

## When to use
Decide between apps and plugins here based on how much direct access to the Shopware process and database your extension needs, and whether it must remain compatible with Shopware cloud.

## Key steps / config
**Apps** — introduced starting with Shopware 6.4.0.0. Apps are not executed within the Shopware Core process; instead they are notified about events via webhooks they register, and they modify and interact with Shopware resources through the Admin REST API.

**Plugins** — executed within the Shopware Core process itself. Plugins can react to events, execute custom code, or extend services, and they have direct access to the database. Guidelines are in place to keep plugins update-compatible, such as using a service facade or database migrations.

## Essential identifiers
- Apps
- Plugins
- Admin REST API
- Shopware 6.4.0.0

## Gotchas
Because plugins have direct access to the Shopware process and database, plugins are not supported by Shopware cloud.
