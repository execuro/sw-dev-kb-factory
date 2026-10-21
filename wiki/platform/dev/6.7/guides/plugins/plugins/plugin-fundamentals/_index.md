---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/_index.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md
  - platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md
  - platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md
  - platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md
sourceHash: a01ec59b6e4dcac315238947e5bddb255eb6a958
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/
title: Plugin Fundamentals
version: "6.7"
versions:
  - "6.7"
keywords: ["plugin fundamentals", "plugin lifecycle", "plugin configuration", "cli command", "scheduled task", "event subscriber", "controller", "logging", "decorate service", "database migration", "plugin dependencies", "ScheduledTask"]
summary: Task router for plugin building blocks - lifecycle, config, CLI commands, scheduled tasks, logging, services, events, controllers, migrations, dependencies.
lastBuilt: 2026-10-21
---
## What it is

Index of the plugin building blocks, organised by the task you want to solve, with a rule of thumb for choosing between subscriber, controller, command and scheduled task.

## When to use

You know what your plugin must do and need the right focused guide. New to plugins? Start with the [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).

## Key steps / config

Pick the guide by task:

- Run code on install, update, activate, deactivate or uninstall: [Plugin lifecycle](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md)
- Configurable settings in the Administration: [Plugin configuration](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md)
- Custom Symfony console command: [CLI commands](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md)
- Recurring background work: [Scheduled tasks](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md)
- Diagnostics and plugin logs: [Logging](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/logging.md)
- Register services / inject dependencies: [Services and dependency injection](platform/dev/6.7/guides/plugins/plugins/services/_index.md)
- React to Shopware events: [Listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md)
- Change or extend existing services: [Decorating services](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md)
- New Storefront URL or response: [Add Custom Controller](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md)
- Database changes: [Database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md)
- Composer or npm dependencies: [Plugin dependencies](platform/dev/6.7/guides/plugins/plugins/dependencies/_index.md)

Rule of thumb: event subscriber to react to something Shopware already does; controller for a new HTTP entry point; command for manual or scripted CLI work; scheduled task for recurring background work.

## Code check (6.7.15.1)
- confirmed `Plugin::install()` — lifecycle hook on the plugin base class — vendor/shopware/core/Framework/Plugin.php:39
- confirmed `Plugin::update()` — lifecycle hook — vendor/shopware/core/Framework/Plugin.php:47
- confirmed `Plugin::activate()` — lifecycle hook — vendor/shopware/core/Framework/Plugin.php:55
- confirmed `Plugin::deactivate()` — lifecycle hook — vendor/shopware/core/Framework/Plugin.php:59
- confirmed `Plugin::uninstall()` — lifecycle hook — vendor/shopware/core/Framework/Plugin.php:63
- confirmed `ScheduledTask` — abstract base for recurring background tasks — vendor/shopware/core/Framework/MessageQueue/ScheduledTask/ScheduledTask.php:10
