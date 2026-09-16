---
id: platform/dev/6.7/guides/development/tooling/_index.md
title: Tooling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/tooling/
sourceHash: e183c8fbd7ae890444181068bb53730688e6ab9f
codeCheckedAgainst: "6.7.13.0"
keywords: ["tooling", "bin/console", "shopware-cli", "swx", "shopware-cli project console", "shopware-cli project dev", "shopware-cli project ci", "shopware-cli project sbom", "deployment helper", "fixture bundle", "phpstorm plugin", "mcp server", "cli choice"]
summary: "Overview of official Shopware tooling and when to use bin/console, shopware-cli, swx, project ci/sbom/dev, Deployment Helper, IDE plugins and MCP server."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/_index.md", "platform/dev/6.7/resources/references/core-reference/commands-reference.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md", "platform/dev/6.7/guides/development/dev-environment.md"]
---
## What it is

Overview of the official Shopware tools across development, deployment and maintenance, with decision tables for choosing between `bin/console`, Shopware CLI helpers and Deployment Helper.

## When to use

Deciding which command-line entry point or tool fits a task: application commands, local dev stack, CI builds, SBOM generation, deploy-time maintenance, IDE support, or AI client access.

## Key steps / config

**Choosing the CLI**

| Tool | Use it for |
|---|---|
| `bin/console` | Commands of the Shopware application: plugin lifecycle, database migrations, cache clearing, scheduled tasks, system inspection |
| `shopware-cli` | Project/extension tooling: create projects, run dev environment, build assets, validate and package extensions, Store interaction, CI |
| `shopware-cli project console <command>` | Run a `bin/console` command with the CLI resolving project context |
| `swx <command>` | Short alias for `shopware-cli project console <command>` |
| `shopware-cli project dev` | Interactive local dev environment/TUI for the Docker stack, logs, watchers |

**Raw commands vs. helpers vs. deployment tooling** — use the lowest-level command that fits, but prefer helper/deployment tooling for repeatable steps:

- One-off local application command: `bin/console`.
- Daily development commands: `shopware-cli project console <command>` or `swx <command>`.
- Local stack: `shopware-cli project dev`.
- CI build: `shopware-cli project ci` — reproducible artifact with dependencies and assets prepared.
- SBOM: `shopware-cli project sbom` — writes a CycloneDX 1.7 SBOM from `composer.lock` without a full CI build.
- Installing/updating/maintaining a deployed instance: Deployment Helper (install/update detection, migrations, extension management, maintenance mode, cache handling, one-time commands).
- Exceptional production debugging: raw commands, carefully; move repeated steps into Deployment Helper configuration.

**Available tooling (linked pages)**

- Development Environment: `platform/dev/6.7/guides/development/dev-environment.md`
- `bin/console` command reference: `platform/dev/6.7/resources/references/core-reference/commands-reference.md`
- Deployment Helper: `platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md`
- Fixture Bundle (demo/test data): `platform/dev/6.7/guides/development/tooling/fixture-bundle.md`
- PHPStorm plugin (Shopware 6 Toolbox): `platform/dev/6.7/guides/development/tooling/shopware-toolbox.md`; a VS Code extension also exists (`shopware.shopware-lsp`)
- Shopware CLI: `platform/dev/6.7/products/tools/cli/_index.md`, formatter: `platform/dev/6.7/products/tools/cli/formatter.md`
- MCP Server (Model Context Protocol server for AI clients such as Claude Desktop, Cursor, Claude Code; extensible via plugins and apps): `platform/dev/6.7/products/tools/mcp-server/_index.md`
- Admin Extension SDK: NPM library for apps/plugins extending the Administration.

## Essential identifiers

- `bin/console`
- `shopware-cli`, `swx`
- `shopware-cli project console`, `shopware-cli project dev`, `shopware-cli project ci`, `shopware-cli project sbom`
- Deployment Helper, Fixture Bundle, Shopware 6 Toolbox, MCP Server

## Code check (6.7.13.0)
- confirmed `plugin:install` — plugin lifecycle command in core — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:25
- confirmed `plugin:activate` — plugin lifecycle command in core — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginActivateCommand.php:14
- confirmed `database:migrate` — migration command in core — vendor/shopware/core/Framework/Migration/Command/MigrationCommand.php:21
- confirmed `scheduled-task:run` — scheduled task runner command — vendor/shopware/core/Framework/MessageQueue/Command/ScheduledTaskRunner.php:19
- confirmed `cache:clear:all` — core cache clearing command — vendor/shopware/core/Framework/Adapter/Command/CacheClearAllCommand.php:14
- unverified `shopware-cli` — separate Go tool, not part of vendor/shopware packages
- unverified `swx` — shopware-cli alias, outside vendor/shopware scope
