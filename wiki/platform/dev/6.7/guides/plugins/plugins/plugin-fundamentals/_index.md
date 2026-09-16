---
id: platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/_index.md
title: Plugin Fundamentals
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/
sourceHash: a01ec59b6e4dcac315238947e5bddb255eb6a958
codeCheckedAgainst: "6.7.13.0"
keywords: ["plugin fundamentals", "plugin lifecycle", "plugin configuration", "cli command", "scheduled task", "logging", "services", "dependency injection", "event subscriber", "decorating services", "storefront controller", "database migrations", "plugin dependencies"]
summary: "Router for plugin basics: lifecycle, config.xml, CLI commands, scheduled tasks, logging, services, events, controllers, migrations, dependencies."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md"]
---
## What it is

Overview/router page for the building blocks used to add behavior to a Shopware 6.7 plugin. It maps each common task to the guide that covers it.

## When to use

When you know what a plugin should do but not which mechanism or guide applies. New plugin developers should start with the [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md), which walks through creation, installation, lifecycle, configuration, services, events, database changes, testing and diagnostics.

## Key steps / config

Pick the guide by task:

- Run code on install, update, activate, deactivate or uninstall: [Plugin lifecycle](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/plugin-lifecycle.md)
- Add settings shown in the Administration: [Plugin configuration](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md)
- Add a Symfony console command: [CLI commands](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md)
- Run recurring background work: [Scheduled tasks](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md)
- Write plugin logs / diagnostics: [Logging](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/logging.md)
- Register services or inject dependencies: [Services and dependency injection](platform/dev/6.7/guides/plugins/plugins/services/_index.md)
- React to Shopware events: [Listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md)
- Change or extend existing services (decoration): [Decorating services](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md)
- Add a Storefront URL or render a Storefront response: [Add Custom Controller](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md)
- Add database changes: [Database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md)
- Add Composer or npm dependencies: [Plugin dependencies](platform/dev/6.7/guides/plugins/plugins/dependencies/_index.md)

Rule of thumb from the source:

| Need | Mechanism |
|---|---|
| React to something Shopware already does | event subscriber |
| New HTTP entry point | controller |
| Manual or scripted CLI work | command (`console.command` tag) |
| Recurring background work | scheduled task (`shopware.scheduled.task` tag) |

## Essential identifiers

- `Shopware\Core\Framework\Plugin` — plugin base class; lifecycle hooks `install()`, `update()`, `activate()`, `deactivate()`, `uninstall()`
- `console.command` — service tag for CLI commands
- `shopware.scheduled.task` — service tag for scheduled tasks
- `Shopware\Storefront\Controller\StorefrontController` — base for Storefront controllers
- `Shopware\Core\Framework\Migration\MigrationStep` — base for database migrations

## Code check (6.7.13.0)
- confirmed `Plugin` — abstract plugin base class extending Bundle — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `Plugin::install()` — lifecycle hook, empty default — vendor/shopware/core/Framework/Plugin.php:39
- confirmed `Plugin::update()` — lifecycle hook — vendor/shopware/core/Framework/Plugin.php:47
- confirmed `Plugin::activate()` — lifecycle hook — vendor/shopware/core/Framework/Plugin.php:55
- confirmed `Plugin::deactivate()` — lifecycle hook — vendor/shopware/core/Framework/Plugin.php:59
- confirmed `Plugin::uninstall()` — lifecycle hook — vendor/shopware/core/Framework/Plugin.php:63
- confirmed `console.command` — tag used for core commands — vendor/shopware/core/Framework/DependencyInjection/app.php:720
- confirmed `shopware.scheduled.task` — autoconfigured for ScheduledTask subclasses — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:90
- confirmed `StorefrontController` — abstract Storefront controller base — vendor/shopware/storefront/Controller/StorefrontController.php:40
- confirmed `MigrationStep` — abstract migration base class — vendor/shopware/core/Framework/Migration/MigrationStep.php:17
