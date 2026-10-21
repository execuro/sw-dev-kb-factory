---
id: platform/dev/6.7/concepts/extensions/_index.md
title: Extensions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/extensions/
sourceHash: 64536a511e2d03e9e67a623ba58099ad8d95ebba
codeCheckedAgainst: "6.7.15.1"
keywords: ["extensions", "apps", "plugins", "app system", "webhooks", "admin api", "Plugin", "Manifest", "manifest.xml", "shopware cloud", "saas", "apps vs plugins"]
summary: "Shopware's two extension models: apps (external, webhooks + Admin API, cloud-compatible) vs plugins (in-process, DB access, not supported in cloud)."
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/guides/development/extensions/_index.md", "platform/dev/6.7/guides/plugins/apps/app-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

Overview of the two ways to extend the Shopware Core: **apps** and **plugins**. The Core is built to allow extensibility without sacrificing maintainability or structural integrity.

## When to use

When deciding whether an extension should be an app or a plugin, before following the matching base guide.

## Key steps / config

- **Apps** (since Shopware 6.4.0.0): not executed inside the Shopware Core process. They register webhooks to be notified about events and modify/interact with Shopware resources through the Admin REST API. An app is described by its manifest file (`manifest.xml`, parsed by `Shopware\Core\Framework\App\Manifest\Manifest`).
- **Plugins**: executed inside the Shopware Core process; they can react to events, execute custom code or extend services, and have direct access to the database. Update-compatibility is ensured by guidelines such as a service facade and database migrations. Every plugin class extends `Shopware\Core\Framework\Plugin`.
- To choose between the two, use the [Extensions guide](platform/dev/6.7/guides/development/extensions/_index.md); then follow the [App Base Guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md) or the [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## Essential identifiers

- `Shopware\Core\Framework\Plugin` — plugin base class
- `Shopware\Core\Framework\App\Manifest\Manifest` — app manifest model
- Webhooks, Admin API

## Gotchas

- Because of their direct access to the Shopware process and the database, plugins are **not supported by Shopware cloud**. Cloud stores can only be extended with apps.

## Version notes

- The app system was introduced in Shopware 6.4.0.0.

## Code check (6.7.15.1)
- confirmed `Plugin` — abstract plugin base class, extends `Bundle` — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `Manifest` — app manifest class, validated against `manifest-3.0.xsd` — vendor/shopware/core/Framework/App/Manifest/Manifest.php:36
- confirmed `WebhookManager` — dispatches events to registered webhooks — vendor/shopware/core/Framework/Webhook/Service/WebhookManager.php:38
- confirmed `ApiRouteScope::ID` — Admin API route scope `api` — vendor/shopware/core/Framework/Routing/ApiRouteScope.php:15
