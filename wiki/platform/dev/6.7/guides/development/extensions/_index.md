---
id: platform/dev/6.7/guides/development/extensions/_index.md
title: Extensions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/extensions/
sourceHash: 785c335932f372b9a8c0cc6835281ba6d5d3f5d1
codeCheckedAgainst: "6.7.13.0"
keywords: ["extensions", "plugin", "app", "theme", "plugin vs app", "cloud", "self-hosted", "extension validate", "project validate", "extension info push", "mcp server", "MCP_SERVER", "store release"]
summary: Plugin vs app vs theme comparison (Cloud, DB schema, routes/commands) plus entry points for creating, validating, releasing and MCP-extending extensions.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/development/extensions/code-structure.md", "platform/dev/6.7/products/tools/cli/validation.md", "platform/dev/6.7/guides/upgrades-migrations/_index.md"]
---
## What it is

Overview of Shopware's two extension types — **plugins** (full system access, self-hosted only) and **apps** (API-based, cloud-compatible) — with a decision table and links to the main extension workflows. Both are installed and activated for the whole instance. A storefront theme is not a separate type: it is a stripped-down plugin with a customised storefront UI; in Cloud, themes are delivered via apps.

## When to use

- Deciding whether to build a plugin, an app or a theme.
- Finding the entry guide for creating, validating or releasing an extension.

## Key steps / config

Decision table (source):

| Task | Plugin (incl. theme) | App |
|---|---|---|
| Storefront appearance, admin modules, webhooks, custom entities, payment providers, Store publishing | yes | yes |
| Modify database structure | yes | no |
| Install in Shopware 6 Cloud | no | yes |
| Install self-hosted | yes | yes (since 6.4.0.0) |
| Custom logic/routes/CLI commands | yes | only externally via services/webhooks |
| Style/template inheritance | yes (theme plugins) | yes |

Themes do not add admin modules.

Workflows:
1. Review [code structure](platform/dev/6.7/guides/development/extensions/code-structure.md) before choosing a type.
2. Create a plugin via the [plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md); in PHPStorm the [Shopware 6 Toolbox](platform/dev/6.7/guides/development/tooling/shopware-toolbox.md) generates plugins and components.
3. Validate with `extension validate` (during development and on the packaged zip) or `project validate` (all extensions/bundles in a project) — see [validation](platform/dev/6.7/products/tools/cli/validation.md).
4. Manage Store metadata in Git with `extension info pull` / `extension info push` ([store page](platform/dev/6.7/products/tools/cli/shopware-account-commands/updating-store-page.md)); release via the [Store release workflow](platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md).
5. Check [upgrades and migrations](platform/dev/6.7/guides/upgrades-migrations/_index.md): extensions must explicitly support target Shopware versions.
6. Monetization models: [monetization](platform/dev/6.7/guides/development/monetization/_index.md).
7. Plugins and apps can add tools, prompts and resources to the built-in [MCP Server](platform/dev/6.7/products/tools/mcp-server/_index.md): [via plugin](platform/dev/6.7/guides/plugins/plugins/mcp-server.md), [via app](platform/dev/6.7/guides/plugins/apps/mcp-server.md).

## Essential identifiers

- `Shopware\Core\Framework\Plugin` (plugin base class), `Shopware\Storefront\Framework\ThemeInterface`
- `extension validate`, `project validate`, `extension info pull`, `extension info push` (Shopware CLI)

## Gotchas

- Plugins, including theme plugins, cannot run in Cloud.
- In core 6.7.13.0 the MCP server is experimental (`@experimental stableVersion:v6.8.0`) and behind the `MCP_SERVER` feature flag, which defaults to false — enable it before relying on MCP extensibility.

## Code check (6.7.13.0)
- confirmed `Plugin` — abstract plugin base class extending Bundle — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `ThemeInterface` — storefront theme marker interface — vendor/shopware/storefront/Framework/ThemeInterface.php:8
- confirmed `AppEntity` — app entity exists in core — vendor/shopware/core/Framework/App/AppEntity.php:36
- confirmed `MCP_SERVER` — feature flag, default false, experimental — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:89
- confirmed `McpLifecycleHandler` — app MCP lifecycle handler gated by the MCP_SERVER flag — vendor/shopware/core/Framework/DependencyInjection/mcp.php:413
- unverified `extension validate` — Shopware CLI command, out of scope
