---
id: platform/dev/6.7/products/tools/cli/command-types.md
title: Command Types
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/command-types.html
sourceHash: 308dff683e9bf9f6a1c06d0165fbdb668fe529e8
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli", "shopware-cli project ci", "shopware-cli project create", "shopware-cli project dump", "shopware-cli project sbom", "shopware-cli extension fix", "shopware-cli project fix", "shopware-cli extension build", "shopware-cli extension validate", "shopware-cli account login", "shopware-cli token", "rector", "automatic refactoring", "cli command scopes"]
summary: "shopware-cli command scopes: project (create, dump, ci, sbom), extension (fix, build, validate), store login/token, and fix-based refactoring."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/automatic-refactoring.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/_index.md", "platform/dev/6.7/guides/plugins/_index.md"]
---
## What it is

Overview of the command scopes of Shopware CLI (`shopware-cli`), the standalone tool for Shopware projects and extensions: project commands, extension commands and Store commands, plus the automatic refactoring tool.

## When to use

- Finding which `shopware-cli` subcommand covers a project, extension or Store task.
- Setting up a CI/CD pipeline that builds a deployment artifact.
- Running automated code upgrades (refactoring) on an extension or a whole project.

## Key steps / config

### Automatic refactoring

Uses Rector for PHP, ESLint for JavaScript and custom rules for Admin Twig files. It modifies files in place. See [Automatic refactoring](platform/dev/6.7/products/tools/cli/automatic-refactoring.md).

```bash
shopware-cli extension fix /path/to/your/extension
shopware-cli project fix /path/to/your/project
```

### Project commands

Operate on a [Shopware project](platform/dev/6.7/guides/hosting/installation-updates/deployments/_index.md):

```bash
shopware-cli project create   # Create a new Shopware 6 project
shopware-cli project dump     # Dumps the Shopware database
shopware-cli project ci       # Build Shopware in the CI
shopware-cli project sbom     # Generate a CycloneDX SBOM from composer.lock
```

CI/CD split: `shopware-cli project ci` builds the deployment artifact (dependencies, compiled theme, built assets); at deploy time the [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) installs Shopware, manages extensions and runs database migrations on the target environment.

### Extension commands

For [extensions](platform/dev/6.7/guides/plugins/_index.md), preparing them for the Shopware Store or other distribution:

```bash
shopware-cli extension fix       # Fix an extension
shopware-cli extension build     # Builds assets for extensions
shopware-cli extension validate  # Validate an extension
```

### Store commands

```bash
shopware-cli account login   # Log in to the Shopware Store (account.shopware.com)
shopware-cli token           # Manage tokens for Store authentication
```

Any command accepts `--help`, e.g. `shopware-cli extension --help`.

## Essential identifiers

- `shopware-cli project create`, `shopware-cli project dump`, `shopware-cli project ci`, `shopware-cli project sbom`, `shopware-cli project fix`
- `shopware-cli extension fix`, `shopware-cli extension build`, `shopware-cli extension validate`
- `shopware-cli account login`, `shopware-cli token`

## Gotchas

- `extension fix` / `project fix` rewrite files in place — back up or commit your code first.
- `project ci` only builds the artifact; installation, extension management and migrations on the target happen via the Deployment Helper.

## Code check (6.7.13.0)
- unverified `shopware-cli` — standalone CLI tool, not part of vendor/shopware/{core,storefront,administration}
- unverified `shopware-cli project ci` — implemented in shopware-cli, out of scope
- unverified `shopware-cli extension fix` — Rector/ESLint rules live in shopware-cli, out of scope
- unverified `shopware-cli account login` — Store account tooling, out of scope
