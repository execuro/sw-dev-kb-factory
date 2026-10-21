---
id: platform/dev/6.7/guides/development/tooling/_index.md
title: Tooling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/tooling/
sourceHash: e183c8fbd7ae890444181068bb53730688e6ab9f
codeCheckedAgainst: "6.7.15.1"
keywords: ["bin/console", "shopware-cli", "swx", "shopware-cli project console", "shopware-cli project dev", "shopware-cli project ci", "shopware-cli project sbom", "deployment helper", "fixture bundle", "cli choice", "developer tooling", "mcp server", "phpstorm plugin"]
summary: "Overview of Shopware tooling: when to use bin/console vs shopware-cli, swx, project dev/ci/sbom, Deployment Helper, IDE plugins and MCP server."
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/development/dev-environment.md
  - platform/dev/6.7/resources/references/core-reference/commands-reference.md
  - platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md
  - platform/dev/6.7/products/tools/cli/_index.md
---
## What it is

Hub page for Shopware's official tooling across development, deployment and maintenance. Its main content is a decision guide for which command-line entry point to use: the application's own `bin/console`, the external `shopware-cli`, or the Deployment Helper.

## When to use

When you have to pick a tool for a task: running a Shopware application command, starting the local Docker stack, building in CI, generating an SBOM, or running install/update steps on a deployed instance.

## Key steps / config

CLI entry points:

| Tool | Use it for |
|---|---|
| `bin/console` | Commands shipped by the Shopware application: plugin lifecycle (e.g. `plugin:install`, `plugin:activate`), migrations (`database:migrate`), cache clearing, scheduled tasks (`scheduled-task:run`), system inspection |
| `shopware-cli` | Project and extension tooling: create projects, run the dev environment, build assets, validate/package extensions, Store interaction, CI |
| `shopware-cli project console <command>` | Runs a `bin/console` command through Shopware CLI, which resolves the project context |
| `swx <command>` | Short alias for `shopware-cli project console <command>` |
| `shopware-cli project dev` | Interactive local dev environment and TUI for the Docker stack, logs, watchers |

Which level to use:

| Situation | Prefer |
|---|---|
| One-off application command locally | `bin/console` |
| Common commands during daily development | `shopware-cli project console <command>` or `swx <command>` |
| Start/manage the local stack | `shopware-cli project dev` |
| Build in CI (reproducible artifact, dependencies and assets prepared) | `shopware-cli project ci` |
| Generate a CycloneDX 1.7 SBOM from `composer.lock` without a full CI build | `shopware-cli project sbom` |
| Install/update/maintain a deployed instance (install/update detection, migrations, extension management, maintenance mode, cache, one-time commands) | Deployment Helper |
| Manual debugging of an exceptional production issue | Raw commands, carefully |

Rule of thumb: raw `bin/console` for direct local or diagnostic work, Shopware CLI helpers for daily convenience, Deployment Helper for repeatable deployment and maintenance steps.

Other tools listed:

- [Development Environment](platform/dev/6.7/guides/development/dev-environment.md) — Docker-based stack with a terminal dashboard.
- Admin Extension SDK — NPM library for apps and plugins extending the Administration.
- [Command reference](platform/dev/6.7/resources/references/core-reference/commands-reference.md) for `bin/console`.
- [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md).
- [Fixture Bundle](platform/dev/6.7/guides/development/tooling/fixture-bundle.md) — seed demo and test data.
- IDE support: [PHPStorm plugin](platform/dev/6.7/guides/development/tooling/shopware-toolbox.md) and a VS Code extension (`shopware.shopware-lsp`).
- [Shopware CLI](platform/dev/6.7/products/tools/cli/_index.md), including [formatting](platform/dev/6.7/products/tools/cli/formatter.md).
- [MCP Server](platform/dev/6.7/products/tools/mcp-server/_index.md) — Model Context Protocol server letting AI clients work with a shop through tools, resources and prompts; extensible via plugins and apps.

## Essential identifiers

- `bin/console`
- `shopware-cli`, `swx`
- `shopware-cli project console`, `shopware-cli project dev`, `shopware-cli project ci`, `shopware-cli project sbom`

## Gotchas

- `shopware-cli` is a separate tool, not part of the Shopware application; its commands are not in the `bin/console` command list.
- Steps that repeat on every deployment belong in Deployment Helper configuration, not in ad-hoc raw commands.

## Code check (6.7.15.1)
- confirmed `plugin:install` — bin/console lifecycle command shipped by core — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:28
- confirmed `plugin:activate` — bin/console lifecycle command shipped by core — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginActivateCommand.php:15
- confirmed `database:migrate` — core migration command — vendor/shopware/core/Framework/Migration/Command/MigrationCommand.php:22
- confirmed `scheduled-task:run` — core scheduled task runner command — vendor/shopware/core/Framework/MessageQueue/Command/ScheduledTaskRunner.php:20
- unverified `shopware-cli` — external Go tool, not in the Shopware code roots
- unverified `swx` — alias provided by shopware-cli, out of scope
- unverified `shopware-cli project sbom` — shopware-cli subcommand, out of scope
- unverified `cache:clear` — provided by Symfony FrameworkBundle, vendor/symfony out of scope
