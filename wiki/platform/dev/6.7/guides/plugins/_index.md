---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/_index.md
relatedPages:
  - platform/dev/6.7/guides/development/extensions/code-structure.md
  - platform/dev/6.7/guides/development/monetization/_index.md
  - platform/dev/6.7/guides/upgrades-migrations/_index.md
sourceHash: 4e780f18dc5c8b50cba1b8a08117d2e5c5f11063
sourceUrl: https://developer.shopware.com/docs/guides/plugins/
title: Extensions
version: "6.7"
versions:
  - "6.7"
keywords: ["extensions", "plugin", "app", "theme", "plugin vs app", "extension types", "cloud", "self-hosted", "custom/plugins", "custom/apps", "Shopware\\Core\\Framework\\Plugin", "ThemeInterface", "monetization"]
summary: Shopware 6.7 extension types - plugins (in-process, self-hosted only) vs apps (external, HTTP API, cloud) - with a capability table.
lastBuilt: 2026-10-21
---
## What it is

The entry page for Shopware extension development. It names the two extension types and compares what each can do:

- **Plugins** — full system access, run inside Shopware, self-hosted only.
- **Apps** — based on an HTTP API and run externally; may need an external server to call Shopware APIs and handle webhooks; cloud-compatible.

Both are installed and activated for the whole Shopware instance. A storefront theme is not a separate type but a stripped-down plugin with a customized storefront UI; in Cloud, themes are delivered via apps.

## When to use

When deciding whether to build a plugin or an app, before reading the plugin, app or theme base guides. Review the recommended [code structure](platform/dev/6.7/guides/development/extensions/code-structure.md) first to reduce upgrade friction; for paid extensions, In-App Purchases or commission-based integrations see [Monetization](platform/dev/6.7/guides/development/monetization/_index.md).

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
| Install in Cloud shops | no | yes | Plugins and theme plugins cannot run in Cloud |
| Install in self-hosted shops | yes | yes | Apps since 6.4.0.0 |
| Custom logic/routes/commands | yes | partial | Apps run logic externally; no internal Symfony routes or CLI commands |
| Style/template inheritance | yes | yes | Specific to theme plugins |

In the installed code, plugins extend `Shopware\Core\Framework\Plugin` and are loaded from `custom/plugins`; apps are loaded from `custom/apps`; theme plugins implement `Shopware\Storefront\Framework\ThemeInterface`.

## Essential identifiers

- `Shopware\Core\Framework\Plugin`
- `Shopware\Storefront\Framework\ThemeInterface`
- `custom/plugins`, `custom/apps`

## Gotchas

- Extensions must explicitly support their target Shopware versions; check [Upgrades and Migrations](platform/dev/6.7/guides/upgrades-migrations/_index.md) before releasing updates.
- Apps cannot add internal Symfony routes or CLI commands and cannot modify the database schema.

## Version notes

- Apps can be installed in self-hosted shops since Shopware 6.4.0.0.

## Code check (6.7.15.1)
- confirmed `Shopware\Core\Framework\Plugin` — abstract plugin base class extending Symfony `Bundle` — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `custom/plugins` — default plugin directory of the kernel plugin loader — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:50
- confirmed `custom/apps` — `shopware.app_dir` parameter — vendor/shopware/core/Framework/DependencyInjection/app.php:192
- confirmed `ThemeInterface` — interface marking theme plugins — vendor/shopware/storefront/Framework/ThemeInterface.php:8
- unverified `apps since 6.4.0.0` — historical version claim, not checkable in the 6.7 code
- unverified `apps cannot modify database schema` — capability claim, not expressed as a single code check
