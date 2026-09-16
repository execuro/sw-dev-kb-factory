---
id: platform/dev/6.7/guides/plugins/_index.md
title: Extensions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/
sourceHash: 4e780f18dc5c8b50cba1b8a08117d2e5c5f11063
codeCheckedAgainst: "6.7.13.0"
keywords: ["extensions", "plugin", "app", "theme", "plugin vs app", "extension types", "cloud", "self-hosted", "custom/plugins", "custom/apps", "webhooks", "monetization", "comparison"]
summary: Shopware 6.7 extension types compared - plugins (full system access, self-hosted only) vs apps (external, HTTP API, Cloud-compatible); themes are plugins.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/extensions/code-structure.md", "platform/dev/6.7/guides/development/monetization/_index.md", "platform/dev/6.7/guides/upgrades-migrations/_index.md"]
---
## What it is

Overview of Shopware's two extension types and a decision table for choosing between them:

- **Plugins** — full system access, self-hosted only.
- **Apps** — based on an HTTP API and run externally; may need an external server to call Shopware APIs and handle webhooks; Cloud-compatible.

Both are installed and activated for the whole Shopware instance. A storefront theme is not a separate type but a stripped-down plugin with a customized storefront UI; in Cloud, themes are delivered via apps.

## When to use

When deciding whether to build a plugin, an app or a theme, and before starting an extension (review the recommended [Code structure](platform/dev/6.7/guides/development/extensions/code-structure.md) first to reduce upgrade friction).

## Key steps / config

Decision table (Plugin incl. theme / App):

| Task | Plugin | App | Remark |
|---|---|---|---|
| Change Storefront appearance | yes | yes | in Cloud, themes come via apps |
| Add admin modules | yes | yes | themes do not add admin modules |
| Execute webhooks | yes | yes | apps are webhook-first |
| Add custom entities | yes | yes | |
| Modify database structure | yes | no | apps cannot change the schema |
| Integrate payment providers | yes | yes | |
| Publish in the Shopware Store | yes | yes | |
| Install in Shopware 6 Cloud | no | yes | plugins/theme plugins cannot run in Cloud |
| Install in self-hosted | yes | yes | apps since 6.4.0.0 |
| Custom logic/routes/commands | yes | partial | apps run logic externally; no Symfony routes or CLI commands |
| Control style/template inheritance | yes | yes | specific to theme plugins |

Installed locations in a project: plugins under `custom/plugins`, apps under `custom/apps`. A plugin's base class is `Shopware\Core\Framework\Plugin`.

To sell an extension or offer paid features (paid extensions, In-App Purchases, commission-based integrations) see the [Monetization guide](platform/dev/6.7/guides/development/monetization/_index.md).

## Essential identifiers

- `Shopware\Core\Framework\Plugin`
- `custom/plugins`, `custom/apps`

## Gotchas

- Extensions must explicitly support target Shopware versions; review [Upgrades and Migrations](platform/dev/6.7/guides/upgrades-migrations/_index.md) before releasing updates.
- Apps cannot modify the database schema, add internal Symfony routes or CLI commands.

## Version notes

- Apps can be installed in self-hosted shops since Shopware 6.4.0.0.

## Code check (6.7.13.0)
- confirmed `Plugin` — abstract plugin base class extends Shopware `Bundle` — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `custom/plugins` — default plugin directory of the kernel plugin loader — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:50
- confirmed `custom/apps` — `shopware.app_dir` parameter — vendor/shopware/core/Framework/DependencyInjection/app.php:182
- unverified `6.4.0.0` — historical version claim for app support, not checkable in installed code
- unverified `Cloud` — SaaS restriction on plugins is a platform policy, not in vendor/shopware
