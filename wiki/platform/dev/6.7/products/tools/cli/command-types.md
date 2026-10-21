---
id: platform/dev/6.7/products/tools/cli/command-types.md
title: Command Types
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/command-types.html
sourceHash: 308dff683e9bf9f6a1c06d0165fbdb668fe529e8
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli", "command scopes", "project create", "project dump", "project ci", "project sbom", "extension fix", "extension build", "extension validate", "account login", "token", "store commands", "refactoring", "cyclonedx sbom"]
summary: "Shopware CLI command scopes: project (create, dump, ci, sbom), extension (fix, build, validate) and Store (account login, token) commands."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/automatic-refactoring.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/_index.md", "platform/dev/6.7/guides/plugins/_index.md"]
---
## What it is

Shopware CLI groups its commands into three scopes:

- Project commands work with a Shopware project, for example to build it, dump the database, or sync configuration.
- Extension commands build and validate extensions.
- Store commands publish or update extensions in the Shopware Store.

The CLI also includes automatic refactoring for PHP, JavaScript, and Admin Twig files. It uses Rector for PHP, ESLint for JavaScript, and custom rules for Admin Twig.

## When to use

Use this page to find the right command group for a task: setting up and maintaining a [project](platform/dev/6.7/guides/hosting/installation-updates/deployments/_index.md), building and validating [extensions](platform/dev/6.7/guides/plugins/_index.md), or publishing to the Store.

## Key steps / config

Project commands:

```bash
shopware-cli project create   # Create a new Shopware 6 project
shopware-cli project dump     # Dumps the Shopware database
shopware-cli project ci       # Build Shopware in the CI
shopware-cli project sbom     # Generate a CycloneDX SBOM from composer.lock
shopware-cli project fix /path/to/your/project
```

In CI/CD, `shopware-cli project ci` builds the deployment artifact, including dependencies, the compiled theme, and built assets. The [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) then installs Shopware, manages extensions, and runs migrations at deploy time.

Extension commands:

```bash
shopware-cli extension fix /path/to/your/extension   # Fix an extension
shopware-cli extension build                         # Builds assets for extensions
shopware-cli extension validate                      # Validate an extension
```

Store commands:

```bash
shopware-cli account login   # Log in to the Shopware Store (account.shopware.com)
shopware-cli token           # Manage tokens for Store authentication
```

Add `--help` to any command to list its options, for example `shopware-cli extension --help`.

## Essential identifiers

- `shopware-cli project create`, `project dump`, `project ci`, `project sbom`, `project fix`
- `shopware-cli extension fix`, `extension build`, `extension validate`
- `shopware-cli account login`, `shopware-cli token`

## Gotchas

- The refactoring commands `extension fix` and `project fix` change files in place. Back up or version your code before you run them. See [Automatic Refactoring](platform/dev/6.7/products/tools/cli/automatic-refactoring.md).

## Code check (6.7.15.1)
- unverified `shopware-cli project ci` — Shopware CLI command, a standalone tool outside the checked package roots
- unverified `shopware-cli project sbom` — Shopware CLI command, outside the checked package roots
- unverified `shopware-cli extension fix` — Shopware CLI command, outside the checked package roots
- unverified `shopware-cli extension build` — Shopware CLI command, outside the checked package roots
- unverified `shopware-cli account login` — Shopware CLI command, outside the checked package roots
- unverified `shopware-cli token` — Shopware CLI command, outside the checked package roots
