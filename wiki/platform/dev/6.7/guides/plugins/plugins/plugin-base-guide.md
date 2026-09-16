---
id: platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
title: Plugin Base Guide
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-base-guide.html
sourceHash: 7be6cb2e7b24f4ee2a71fb23c1d3b168a2487f62
codeCheckedAgainst: "6.7.13.0"
keywords: ["plugin", "plugin development", "static plugin", "plugin:create", "plugin lifecycle", "shopware toolbox", "scaffold plugin", "extension", "upgrade readiness", "migrations", "dependency injection", "development roadmap"]
summary: "Roadmap of the typical Shopware 6.7 plugin development steps with links to focused guides, scaffolding via plugin:create and Toolbox, upgrade tips"
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/creating-plugins.md", "platform/dev/6.7/guides/plugins/plugins/install-activate-plugin.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md", "platform/dev/6.7/guides/development/tooling/shopware-toolbox.md"]
---
## What it is

An entry-point roadmap for building a Shopware plugin with the recommended static plugin approach. It lists the usual development steps (each linked to its focused guide), the tools that generate plugin code, and design rules that keep a plugin upgrade-ready. Not every plugin needs every step.

## When to use

Starting a new plugin, or deciding which focused guide covers the next piece of work (services, events, Storefront/Administration, migrations, scheduled tasks, tests).

## Key steps / config

Typical order:

1. [Create the plugin structure](platform/dev/6.7/guides/plugins/plugins/creating-plugins.md)
2. [Install and activate](platform/dev/6.7/guides/plugins/plugins/install-activate-plugin.md)
3. [Plugin lifecycle](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md)
4. [Plugin configuration](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md)
5. [Register services](platform/dev/6.7/guides/plugins/plugins/services/_index.md) with [dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md)
6. [Listen to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md) or [decorate services](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md)
7. Extend [Storefront](platform/dev/6.7/guides/plugins/plugins/storefront/_index.md) and/or [Administration](platform/dev/6.7/guides/plugins/plugins/administration/_index.md)
8. [Database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md) (if required)
9. [Scheduled tasks](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md) or [CLI commands](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md) (if required)
10. Dependencies: [npm](platform/dev/6.7/guides/plugins/plugins/dependencies/using-npm-dependencies.md), [Composer](platform/dev/6.7/guides/plugins/plugins/dependencies/using-composer-dependencies.md)
11. [Tests](platform/dev/6.7/guides/development/testing/_index.md) and [CI](platform/dev/6.7/guides/development/testing/ci.md)
12. [Diagnostics / logging](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/logging.md)

**Tooling**: `bin/console plugin:create` scaffolds the plugin. The [Shopware 6 Toolbox](platform/dev/6.7/guides/development/tooling/shopware-toolbox.md) PHPStorm plugin generates plugins, subscribers, scheduled tasks, migrations and Administration modules from adaptable file templates. Generated optional features are usually several files of one wiring (e.g. a controller needs route config and service registration; a scheduled task has a task and a handler); the focused guides explain those parts.

## Gotchas

Upgrade readiness — design so that:
- [Migrations](platform/dev/6.7/guides/upgrades-migrations/_index.md) are idempotent.
- Lifecycle logic is minimal and predictable.
- Domain logic lives behind services.
A small, well-structured plugin surface makes upgrades easier.

## Code check (6.7.13.0)
- confirmed `plugin:create` — scaffolding console command — vendor/shopware/core/Framework/Plugin/Command/PluginCreateCommand.php:21
- confirmed `plugin:install` — install command used in the install/activate step — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:25
- confirmed `plugin:refresh` — refreshes the plugin list — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:21
- confirmed `Plugin::install()` — lifecycle hook on the plugin base class — vendor/shopware/core/Framework/Plugin.php:39
- confirmed `Plugin::uninstall()` — lifecycle hook on the plugin base class — vendor/shopware/core/Framework/Plugin.php:63
