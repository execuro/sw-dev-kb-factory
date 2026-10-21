---
id: platform/dev/6.7/guides/plugins/plugins/_index.md
title: Plugins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/
sourceHash: 835beb065d1bb20452e59b7f72c0b08d7e98ef90
codeCheckedAgainst: "6.7.15.1"
keywords: ["plugin", "static plugin", "managed plugin", "shopware bundle", "symfony bundle", "custom/plugins", "custom/static-plugins", "composer req", "plugin lifecycle", "extension type", "plugin vs app vs theme", "php extension"]
summary: Overview of Shopware plugins (PHP extensions built on Symfony bundles), comparing managed plugins, static plugins and bundles, and when to pick each.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/bundle.md", "platform/dev/6.7/guides/plugins/plugins/integrations/_index.md", "platform/dev/6.7/guides/plugins/themes/_index.md"]
---
## What it is

Entry page for Shopware plugins: the PHP-based, server-side extension type that runs inside the Shopware process with full access to the Symfony service container, events/subscribers, the database layer and migrations, CLI commands and scheduled tasks, and Administration/Storefront extensions. Technically a plugin is an extension of a [Symfony bundle](platform/dev/6.7/guides/plugins/plugins/bundle.md) with a defined directory structure and, when managed, a lifecycle (install, update, deactivate, uninstall).

## When to use

Pick a plugin for custom business logic, checkout/pricing changes, new entities or migrations, event listeners, DI services, Administration modules, CLI commands or scheduled tasks, third-party/identity-provider integrations, dynamic validation, or custom [MCP tools, prompts and resources](platform/dev/6.7/guides/plugins/plugins/mcp-server.md).

| Requirement | Use |
|---|---|
| Backend logic or deep integration | Plugin |
| Storefront styling or template overrides only | Plugin-based [theme](platform/dev/6.7/guides/plugins/themes/_index.md) |
| SaaS-based integration without server access | App |

For infrastructure integrations (Redis, Elasticsearch, custom APIs) see the [integration guides](platform/dev/6.7/guides/plugins/plugins/integrations/_index.md).

## Key steps / config

Plugin models:

| Feature | Plugin | Static Plugin | Shopware Bundle | Symfony Bundle |
|---|---|---|---|---|
| Installation | Admin | Composer | Composer | Composer |
| Location | `custom/plugins` | `custom/static-plugins` | `vendor` or `src` | `vendor` or `src` |
| Lifecycle events | Yes | Yes | No | No |
| Managed in Administration | Yes | No | No | No |
| Can be a theme | Yes | Yes | Yes | No |
| Admin/Storefront JS/CSS | Yes | Yes | Yes | No |

- **Static plugins (recommended for project logic):** live in `<shopware project root>/custom/static-plugins`, committed to Git, not detected by the Administration. Require them via Composer before install/activate: `composer req <vendor>/<plugin-name>` (package name from the plugin's `composer.json` `name`).
- **Managed plugins:** in `<shopware root>/custom/plugins`, typically installed via the Administration; common for marketplace extensions.
- **Bundles:** installed via Composer, no Shopware plugin lifecycle, not managed in the Administration; for full Symfony-level control.

Next: [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md); add [CI](platform/dev/6.7/guides/development/testing/ci.md) and tests to catch upgrade regressions.

## Essential identifiers

- `Shopware\Core\Framework\Plugin` (extends `Shopware\Core\Framework\Bundle`)
- `custom/plugins`, `custom/static-plugins`
- `composer req <vendor>/<plugin-name>`

## Gotchas

- Static plugins do not show up in the Administration until required via Composer.
- No need for one plugin per feature: for projects, prefer one repository with a shared CI pipeline and static analysis rules, organised by clear domain boundaries; static plugins vs. bundles internally matters less than consistent structure.

## Code check (6.7.15.1)
- confirmed `Plugin` — abstract class extends Shopware `Bundle` — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `Bundle` — extends the Symfony bundle — vendor/shopware/core/Framework/Bundle.php:33
- confirmed `Plugin::install()` — lifecycle hook — vendor/shopware/core/Framework/Plugin.php:39
- confirmed `Plugin::update()` — lifecycle hook — vendor/shopware/core/Framework/Plugin.php:47
- confirmed `Plugin::deactivate()` — lifecycle hook — vendor/shopware/core/Framework/Plugin.php:59
- confirmed `Plugin::uninstall()` — lifecycle hook — vendor/shopware/core/Framework/Plugin.php:63
- confirmed `custom/plugins` — default plugin directory of the kernel plugin loader — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:50
- confirmed `custom/static-plugins` — scanned alongside `custom/plugins` — vendor/shopware/core/TestBootstrapper.php:341
- unverified `composer req` — Composer CLI, out of scope
