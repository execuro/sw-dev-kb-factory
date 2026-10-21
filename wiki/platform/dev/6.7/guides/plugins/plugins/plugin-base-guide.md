---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/creating-plugins.md
  - platform/dev/6.7/guides/plugins/plugins/install-activate-plugin.md
  - platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md
  - platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md
sourceHash: 7be6cb2e7b24f4ee2a71fb23c1d3b168a2487f62
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-base-guide.html
title: Plugin Base Guide
version: "6.7"
versions:
  - "6.7"
keywords: ["plugin:create", "plugin development flow", "static plugin", "plugin structure", "plugin lifecycle", "shopware toolbox", "scaffold plugin", "dependency injection", "migrations", "scheduled task", "upgrade readiness", "plugin checklist"]
summary: Ordered development flow for a Shopware 6.7 plugin (structure, lifecycle, config, services, extensions, migrations, tests), scaffolding tools and upgrade tips.
lastBuilt: 2026-10-21
---
## What it is

An overview of the typical development flow for a Shopware plugin using the recommended static plugin approach, linking to the focused guide for each step. Not every plugin needs every step.

## When to use

Starting a new plugin and deciding which pieces (configuration, services, Storefront/Administration extensions, migrations, tasks, tests) it needs and in which order.

## Key steps / config

1. [Create the plugin structure](platform/dev/6.7/guides/plugins/plugins/creating-plugins.md)
2. [Install and activate the plugin](platform/dev/6.7/guides/plugins/plugins/install-activate-plugin.md)
3. [Understand the plugin lifecycle](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md)
4. [Add plugin configuration](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md)
5. [Register services](platform/dev/6.7/guides/plugins/plugins/services/_index.md) and use [dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md)
6. [Listen to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md) or [decorate services](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md)
7. Extend the [Storefront](platform/dev/6.7/guides/plugins/plugins/storefront/_index.md) and/or [Administration](platform/dev/6.7/guides/plugins/plugins/administration/_index.md)
8. [Add database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md) (if required)
9. [Scheduled tasks](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md) or [CLI commands](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md) (if required)
10. Dependencies: [npm](platform/dev/6.7/guides/plugins/plugins/dependencies/using-npm-dependencies.md), [Composer](platform/dev/6.7/guides/plugins/plugins/dependencies/using-composer-dependencies.md) (if required)
11. [Write tests](platform/dev/6.7/guides/development/testing/_index.md) and configure [CI](platform/dev/6.7/guides/development/testing/ci.md)
12. Add [diagnostics](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/logging.md)

Tooling:

- `bin/console plugin:create` scaffolds the plugin.
- The [Shopware 6 Toolbox plugin](platform/dev/6.7/guides/development/tooling/shopware-toolbox.md) for PHPStorm generates plugins, subscribers, scheduled tasks, migrations and Administration modules from adaptable file templates.

Generated optional features are usually parts of one piece of framework wiring (e.g. a controller depends on route configuration and service registration; a scheduled task has separate task and handler roles); the focused guides explain these, so manual reproduction is normally unnecessary.

Upgrade readiness — design plugins so that [migrations](platform/dev/6.7/guides/upgrades-migrations/_index.md) are idempotent, lifecycle logic is minimal and predictable, and domain logic is encapsulated behind services. A small, well-structured plugin surface eases upgrades.

## Essential identifiers

- `bin/console plugin:create`

## Code check (6.7.15.1)
- confirmed `plugin:create` — console command registered — vendor/shopware/core/Framework/Plugin/Command/PluginCreateCommand.php:22
- confirmed `plugin:install` — lifecycle command used in the install step — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:28
- confirmed `plugin:refresh` — discovers new plugins before install — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:22
- unverified `Shopware 6 Toolbox` — PHPStorm plugin, outside the checked roots
