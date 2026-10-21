---
id: platform/dev/6.7/guides/development/extensions/_index.md
title: Extensions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/extensions/
sourceHash: 785c335932f372b9a8c0cc6835281ba6d5d3f5d1
codeCheckedAgainst: "6.7.15.1"
keywords: ["extensions", "plugin", "app", "theme", "plugin vs app", "extension type comparison", "shopware cloud", "self-hosted", "extension validate", "project validate", "extension info pull", "extension info push", "mcp server", "store release"]
summary: "Overview of Shopware extension types (plugins, apps, themes): capability comparison, Cloud vs self-hosted, and entry points for build, validate, release."
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/guides/development/extensions/code-structure.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/products/tools/cli/validation.md", "platform/dev/6.7/guides/upgrades-migrations/_index.md"]
---
## What it is

Entry page for Shopware extension development. Shopware has two extension types, both installed and activated for the whole instance:

- **Plugins** — full system access, self-hosted only.
- **Apps** — API-based, cloud-compatible.

A storefront theme is not a separate type: it is a stripped-down plugin with a customized storefront UI. In Cloud, themes are delivered via apps.

## When to use

When choosing between plugin and app for a feature, or when looking for the starting guide for creating, validating, releasing or monetizing an extension. Review the [code structure](platform/dev/6.7/guides/development/extensions/code-structure.md) guidance before picking a type to reduce upgrade friction.

## Key steps / config

Which type to build:

| Task | Plugin (incl. theme) | App | Remark |
|---|---|---|---|
| Change Storefront appearance | yes | yes | In Cloud, themes come via apps |
| Add admin modules | yes | yes | Themes do not add admin modules |
| Execute webhooks | yes | yes | Apps are webhook-first |
| Add custom entities | yes | yes | |
| Modify database structure | yes | no | Apps cannot change the schema |
| Integrate payment providers | yes | yes | |
| Publish in the Shopware Store | yes | yes | |
| Install in Cloud shops | no | yes | Plugins/theme plugins cannot run in Cloud |
| Install in self-hosted shops | yes | yes | Apps since 6.4.0.0 |
| Custom logic/routes/commands | yes | partial | Apps run logic externally (services, webhooks); no internal Symfony routes or CLI commands |
| Control style/template inheritance | yes | yes | Theme-plugin specific |

Common workflows:

1. Create a plugin: [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md); PHPStorm users can generate components with the [Shopware 6 Toolbox](platform/dev/6.7/guides/development/tooling/shopware-toolbox.md).
2. Validate one extension: `extension validate` during development and against the packaged zip before a Store upload ([validation](platform/dev/6.7/products/tools/cli/validation.md)).
3. Validate all extensions/bundles in a project: `project validate`.
4. Keep Store metadata and images in Git: `extension info pull` / `extension info push` ([store page](platform/dev/6.7/products/tools/cli/shopware-account-commands/updating-store-page.md)).
5. Release: [Store release workflow](platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md).
6. Selling or paid features: [Monetization](platform/dev/6.7/guides/development/monetization/_index.md) (paid extensions, In-App Purchases, commission-based integrations).

Both plugins and apps can add tools, prompts and resources to the built-in [MCP Server](platform/dev/6.7/products/tools/mcp-server/_index.md): [via plugin](platform/dev/6.7/guides/plugins/plugins/mcp-server.md), [via app](platform/dev/6.7/guides/plugins/apps/mcp-server.md).

## Essential identifiers

- `Shopware\Core\Framework\Plugin` — plugin base class
- `extension validate`, `project validate`, `extension info pull`, `extension info push` — CLI commands

## Gotchas

- Extensions must explicitly support target Shopware versions; check [Upgrades and Migrations](platform/dev/6.7/guides/upgrades-migrations/_index.md) before releasing updates.
- Plugins, including theme plugins, cannot be installed in Shopware Cloud.

## Code check (6.7.15.1)
- confirmed `Plugin` — abstract plugin base class extends `Bundle` — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `AppEntity` — apps are persisted as app entities — vendor/shopware/core/Framework/App/AppEntity.php:36
- confirmed `ThemeInterface` — storefront theme marker interface for theme plugins — vendor/shopware/storefront/Framework/ThemeInterface.php:8
- confirmed `McpServerBuilderCompilerPass` — core registers an MCP server builder — vendor/shopware/core/Framework/Framework.php:26
- unverified `extension validate` — shopware-cli command, outside the installed core
- unverified `extension info push` — shopware-cli command, outside the installed core
