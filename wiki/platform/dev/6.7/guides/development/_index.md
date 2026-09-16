---
id: platform/dev/6.7/guides/development/_index.md
title: Development
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/
sourceHash: 486fde8d70b19fedb42bd60d0deb52f69f677ec7
codeCheckedAgainst: "6.7.13.0"
keywords: ["development", "bin/console", "shopware-cli project dev", "shopware-cli project console", "development workflow", "extension development", "plugin", "app", "theme", "administration", "deployment helper", "shopware toolbox", "ci", "dev environment"]
summary: "Shopware 6.7 development entry page: extension types, typical workflow, Admin access, tooling (bin/console, shopware-cli, Deployment Helper)."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/dev-environment.md", "platform/dev/6.7/guides/development/start-developing.md", "platform/dev/6.7/guides/development/extensions/_index.md", "platform/dev/6.7/guides/development/extensions/code-structure.md"]
---
## What it is

Overview page for building, extending and debugging Shopware after [installation](platform/dev/6.7/guides/installation/_index.md). It routes to two main paths — [Build an Extension](platform/dev/6.7/guides/development/extensions/_index.md) (plugins, apps, themes, Admin/Storefront extensions) and [Work with APIs](platform/dev/6.7/guides/development/integrations-api/_index.md) (API requests, ERP integration, headless storefronts) — and lists shared foundations: APIs, testing, tooling, CLI/system commands, configuration, debugging.

## When to use

Starting development on a Shopware 6.7 project or extension and deciding which guide, extension type or tool applies.

## Key steps / config

Before starting, read [Code structure](platform/dev/6.7/guides/development/extensions/code-structure.md) and [Upgrades and Migrations](platform/dev/6.7/guides/upgrades-migrations/_index.md) to avoid deprecated patterns.

Extension types: Plugin, App, Plugin-based theme. Each guide follows `creation → lifecycle → implementation → testing`. Paid extensions, In-App Purchases and commission models: [Monetization](platform/dev/6.7/guides/development/monetization/_index.md).

Typical workflow:
1. [Set up the environment](platform/dev/6.7/guides/development/dev-environment.md) — Docker-based, started with `shopware-cli project dev`.
2. [Start developing](platform/dev/6.7/guides/development/start-developing.md) — commands, watchers, customization.
3. Create the project or extension; install and activate it.
4. Implement business logic; extend Storefront or Administration.
5. Add configuration or database changes if required.
6. Test and debug; set up [CI](platform/dev/6.7/guides/development/testing/ci.md) early (static analysis, tests, reproducible builds).

The Administration (path `/admin` on the local host) is used to install/activate extensions, configure the system, manage entities and verify extension behavior.

Tooling:
- `bin/console` — built-in CLI for installing/activating plugins (`plugin:install`, `plugin:activate`), migrations (`database:migrate`), cache clearing, scheduled tasks (`scheduled-task:run`), inspecting state; see [commands reference](platform/dev/6.7/resources/references/core-reference/commands-reference.md). Run from the host with `shopware-cli project console`.
- Standalone [Shopware CLI](platform/dev/6.7/products/tools/cli/installation.md) — scaffolding, CI/CD, automation; see [helper commands](platform/dev/6.7/products/tools/cli/project-commands/helper-commands.md).
- IDE: [PHPStorm plugin](platform/dev/6.7/guides/development/tooling/shopware-toolbox.md) and a VS Code extension (`shopware.shopware-lsp`).
- [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) — migrations and cache handling during deployments.

[Troubleshooting](platform/dev/6.7/guides/development/troubleshooting/_index.md) covers DAL, flow and rules.

## Essential identifiers

- `bin/console`
- `shopware-cli project dev`
- `shopware-cli project console`

## Gotchas

- Upgrade effort depends on the installation: heavy custom code raises it, but a project with no custom code and 60 Store plugins can be equally complex. Consistent architecture, centralized CI and a controlled extension strategy reduce it.

## Code check (6.7.13.0)
- confirmed `plugin:install` — core console command — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:25
- confirmed `plugin:activate` — core console command — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginActivateCommand.php:14
- confirmed `database:migrate` — core migration command — vendor/shopware/core/Framework/Migration/Command/MigrationCommand.php:21
- confirmed `scheduled-task:run` — core scheduled task runner command — vendor/shopware/core/Framework/MessageQueue/Command/ScheduledTaskRunner.php:19
- unverified `shopware-cli project dev` — standalone Shopware CLI, not part of the installed vendor roots
- unverified `shopware-cli project console` — standalone Shopware CLI, out of scope
- unverified `Deployment Helper` — separate package, outside the checked vendor roots
