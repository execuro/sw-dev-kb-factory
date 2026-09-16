---
id: platform/dev/6.7/guides/plugins/plugins/_index.md
title: Plugins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/
sourceHash: 835beb065d1bb20452e59b7f72c0b08d7e98ef90
codeCheckedAgainst: "6.7.13.0"
keywords: ["plugin", "static plugin", "managed plugin", "bundle", "symfony bundle", "custom/plugins", "custom/static-plugins", "composer req", "extension type", "plugin vs app vs theme", "plugin lifecycle", "Shopware\\Core\\Framework\\Plugin"]
summary: "Overview of Shopware plugins: when to use a plugin vs theme vs app, and static plugins vs managed plugins vs Shopware/Symfony bundles"
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/bundle.md", "platform/dev/6.7/guides/plugins/themes/_index.md", "platform/dev/6.7/guides/plugins/plugins/integrations/_index.md"]
---
## What it is

Entry page for plugins: Shopware's PHP-based, server-side extension type. Plugins are Symfony bundles with a defined directory structure and, when managed, a lifecycle (install, update, deactivate, uninstall). They get full access to the Symfony service container, events/subscribers, the database layer and migrations, CLI commands and scheduled tasks, and Administration and Storefront extensions.

## When to use

- Custom business logic (customer tracking, content, product imports), checkout/pricing changes
- New entities or migrations, event subscribers, DI service registration
- Custom Administration modules, backend commands, scheduled tasks
- Third-party integrations (incl. identity providers), dynamic validations
- Custom [MCP tools, prompts and resources](platform/dev/6.7/guides/plugins/plugins/mcp-server.md) for AI clients

| Requirement | Use |
|---|---|
| Backend logic or deep integration | Plugin |
| Storefront styling or template overrides only | Plugin-based [theme](platform/dev/6.7/guides/plugins/themes/_index.md) |
| SaaS-based integration without server access | App |

Infrastructure integrations (Redis, Elasticsearch, custom APIs): see [integration guides](platform/dev/6.7/guides/plugins/plugins/integrations/_index.md).

## Key steps / config

Choose a plugin model:

| Feature | Plugin (managed) | Static plugin | Shopware bundle | Symfony bundle |
|---|---|---|---|---|
| Installation | Administration | Composer | Composer | Composer |
| Location | `custom/plugins` | `custom/static-plugins` | `vendor` or `src` | `vendor` or `src` |
| Lifecycle events | Yes | Yes | No | No |
| Managed in Administration | Yes | No | No | No |
| Can be a theme | Yes | Yes | Yes | No |
| Admin/Storefront JS/CSS | Yes | Yes | Yes | No |

- **Static plugins (recommended for project code):** live in `<shopware project root>/custom/static-plugins`, committed to Git. The Administration does not detect them; require them via Composer first (package name from the plugin's `composer.json` `name`), then install and activate:
  `composer req <vendor>/<plugin-name>`
- **Managed plugins:** in `<shopware root>/custom/plugins`, typically marketplace extensions installed via the Administration.
- **Bundles:** installed via Composer, no plugin lifecycle, not managed in the Administration; see [Bundle](platform/dev/6.7/guides/plugins/plugins/bundle.md).

Next: [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md), and [CI](platform/dev/6.7/guides/development/testing/ci.md) guidance against upgrade regressions.

## Essential identifiers

- `Shopware\Core\Framework\Plugin` (extends `Shopware\Core\Framework\Bundle`) — plugin base class with lifecycle methods
- `custom/plugins`, `custom/static-plugins`
- Composer package type `shopware-platform-plugin`
- `composer req <vendor>/<plugin-name>`

## Gotchas

- One plugin per feature is not necessary: for projects, keep custom logic in one repository with one CI pipeline and static-analysis setup, organised by clear domain boundaries. Multiple plugins are valid, but unified tooling reduces upgrade friction.
- Static plugins are invisible to the Administration until required via Composer.

## Code check (6.7.13.0)
- confirmed `Plugin` — abstract class extends Shopware `Bundle` — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `Bundle` — extends Symfony bundle — vendor/shopware/core/Framework/Bundle.php:32
- confirmed `Plugin::install()` — lifecycle hook (also update, activate, deactivate) — vendor/shopware/core/Framework/Plugin.php:39
- confirmed `Plugin::uninstall()` — lifecycle hook — vendor/shopware/core/Framework/Plugin.php:63
- confirmed `custom/plugins` — default plugin directory — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:50
- confirmed `custom/static-plugins` — referenced as plugin directory (test bootstrapper) — vendor/shopware/core/TestBootstrapper.php:337
- confirmed `COMPOSER_TYPE` — composer type `shopware-platform-plugin` — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:20
- confirmed `ComposerPluginLoader` — loads plugins installed via Composer — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/ComposerPluginLoader.php:15
- unverified `composer req` — Composer CLI, outside vendor/shopware
