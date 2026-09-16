---
id: platform/dev/6.7/concepts/extensions/_index.md
title: Extensions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/extensions/
sourceHash: 64536a511e2d03e9e67a623ba58099ad8d95ebba
codeCheckedAgainst: "6.7.13.0"
keywords: ["extensions", "apps", "plugins", "app system", "webhooks", "admin api", "manifest.xml", "Shopware\\Core\\Framework\\Plugin", "shopware cloud", "saas", "apps vs plugins", "extension concept"]
summary: Overview of Shopware extension types - apps (external, webhooks + Admin API, cloud-compatible) vs plugins (in-process, DB access, not supported in cloud).
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/extensions/_index.md", "platform/dev/6.7/guides/plugins/apps/app-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

Overview of the two ways to extend the Shopware Core: **apps** and **plugins**. The Core is designed for extensibility without sacrificing maintainability or structural integrity.

## When to use

Choosing between an app and a plugin before starting an extension, or explaining why an extension will or will not run in Shopware cloud.

## Key steps / config

| | Apps | Plugins |
|---|---|---|
| Runs | outside the Shopware Core process | inside the Shopware Core process |
| Integration | notified of events via registered webhooks; modify/read resources through the Admin REST API | react to events, execute custom code, extend services |
| Database | no direct access | direct access (update-compatibility via guidelines such as service facades and database migrations) |
| Shopware cloud | supported | **not supported** |
| Available since | Shopware 6.4.0.0 | — |

Implementation paths:

- Decision guide: [Extensions](platform/dev/6.7/guides/development/extensions/_index.md)
- [App Base Guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md) — apps are described by a `manifest.xml`.
- [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md) — plugins extend `Shopware\Core\Framework\Plugin`.

## Essential identifiers

- `Shopware\Core\Framework\Plugin` (plugin base class)
- `manifest.xml` (app manifest)
- Admin API, webhooks

## Gotchas

- Plugins are not supported by Shopware cloud because of their direct access to the Shopware process and the database.

## Version notes

- The app system was introduced with Shopware 6.4.0.0.

## Code check (6.7.13.0)
- confirmed `Plugin` — abstract plugin base class extends Shopware Bundle — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `Bundle` — Shopware Bundle extends Symfony bundle — vendor/shopware/core/Framework/Bundle.php:32
- confirmed `WebhookDispatcher` — dispatches events to registered app webhooks — vendor/shopware/core/Framework/Webhook/WebhookDispatcher.php:15
- confirmed `Manifest` — app manifest parsed from XML — vendor/shopware/core/Framework/App/Manifest/Manifest.php:31
- confirmed `manifest-3.0.xsd` — installed manifest schema — vendor/shopware/core/Framework/App/Manifest/Manifest.php:33
