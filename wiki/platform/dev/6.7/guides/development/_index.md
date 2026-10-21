---
id: platform/dev/6.7/guides/development/_index.md
title: Development
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/
sourceHash: 486fde8d70b19fedb42bd60d0deb52f69f677ec7
codeCheckedAgainst: "6.7.15.1"
keywords: ["development", "shopware-cli project dev", "shopware-cli project console", "bin/console", "extension development", "plugin", "app", "theme", "development workflow", "dev tooling", "deployment helper", "shopware toolbox", "administration"]
summary: Entry point for Shopware 6.7 development - extension types, typical workflow, Administration access, bin/console, Shopware CLI and IDE tooling.
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/guides/development/dev-environment.md", "platform/dev/6.7/guides/development/start-developing.md", "platform/dev/6.7/guides/development/extensions/_index.md", "platform/dev/6.7/guides/development/extensions/code-structure.md"]
---
## What it is

Landing page for the Development guides: how to build, extend and debug Shopware after [installation](platform/dev/6.7/guides/installation/_index.md). It routes to two paths — [Build an Extension](platform/dev/6.7/guides/development/extensions/_index.md) (plugins, apps, themes, Admin/Storefront extensions) and [Work with APIs](platform/dev/6.7/guides/development/integrations-api/_index.md) (API requests, ERP/external integration, headless storefronts). Shared foundations across both: APIs, testing, tooling, CLI and system commands, configuration, debugging.

## When to use

Starting a new Shopware project or extension and deciding which guide, extension type and tooling to use; orienting before reading the environment setup or extension guides.

## Key steps / config

Before starting, review [Code structure](platform/dev/6.7/guides/development/extensions/code-structure.md) and [Upgrades and Migrations](platform/dev/6.7/guides/upgrades-migrations/_index.md) to avoid deprecated patterns.

Extension types to choose from: Plugin, App, Plugin-based theme. Each extension guide follows `creation → lifecycle → implementation → testing`. For paid extensions, In-App Purchases or commission-based integrations see the [Monetization guide](platform/dev/6.7/guides/development/monetization/_index.md).

Typical workflow:

1. [Set up the environment](platform/dev/6.7/guides/development/dev-environment.md) — Docker-based, started with `shopware-cli project dev`.
2. [Start developing](platform/dev/6.7/guides/development/start-developing.md) — run commands, use watchers.
3. Create the project or extension; install and activate it.
4. Implement business logic; extend Storefront or Administration.
5. Add configuration or database changes if required.
6. Test and debug; set up [CI](platform/dev/6.7/guides/development/testing/ci.md) (static analysis, tests, reproducible builds) early.

The Administration is reachable under `/admin` on the local shop URL and is used to install/activate extensions, configure the system, manage entities (products, customers) and verify extension behaviour.

Tooling:

- `bin/console` — built-in CLI for installing/activating plugins (`plugin:install`, `plugin:refresh`), migrations, cache clearing, scheduled tasks, inspecting state; see the [commands reference](platform/dev/6.7/resources/references/core-reference/commands-reference.md). From the host: `shopware-cli project console`.
- Standalone [Shopware CLI](platform/dev/6.7/products/tools/cli/installation.md) — scaffolding, CI/CD, automation; see [helper commands](platform/dev/6.7/products/tools/cli/project-commands/helper-commands.md).
- IDE: [PHPStorm plugin (Shopware Toolbox)](platform/dev/6.7/guides/development/tooling/shopware-toolbox.md) and a VS Code extension (`shopware.shopware-lsp`).
- [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) — migrations, cache handling and maintenance during deployments.
- [Troubleshooting](platform/dev/6.7/guides/development/troubleshooting/_index.md) — reference for DAL, flow and rules issues.

## Essential identifiers

- `shopware-cli project dev`
- `shopware-cli project console`
- `bin/console`
- `plugin:install`, `plugin:refresh`

## Gotchas

- Upgrade effort depends on the installation: heavy custom code raises migration effort, but a project with no custom code and 60 Store plugins can be equally complex. Consistent architecture, centralised CI and a controlled extension strategy reduce upgrade pain.

## Code check (6.7.15.1)
- confirmed `plugin:install` — core console command — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:28
- confirmed `plugin:refresh` — core console command — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:22
- unverified `bin/console` — Symfony console entry point, not in the three checked package roots
- unverified `shopware-cli project dev` — Shopware CLI (separate Go tool), out of scope
- unverified `shopware-cli project console` — Shopware CLI, out of scope
- unverified `/admin` — Administration route is defined in Administration PHP outside the checked admin `src` root
