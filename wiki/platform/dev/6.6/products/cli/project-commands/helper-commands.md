---
id: platform/dev/6.6/products/cli/project-commands/helper-commands.md
title: Helper Commands
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/cli/project-commands/helper-commands.html
sourceHash: 04a3f77d39156afdede18ac885cd5affb3800b16
keywords: ["shopware-cli", "project create", "project storefront-build", "project admin-build", "project storefront-watch", "project admin-watch", "project worker", "project clear-cache", "project console", "project generate-jwt", "project admin-api", "only-custom-static-extensions"]
summary: "Curated shopware-cli project helper commands: create, storefront/admin build & watch, worker, clear-cache, console, generate-jwt, admin-api."
lastBuilt: "2026-09-15"
---
## What it is

A curated list of `shopware-cli` helper commands useful for daily Shopware project work: project creation, build/watch replacements, worker management, cache clearing, console access, JWT generation and Admin API requests.

## Key steps / config

Create a project:

```bash
shopware-cli project create <folder-name>
shopware-cli project create <folder-name> <version>
```

`<version>` can be `latest` or `dev-trunk`.

Replacements for shell scripts:

| Shell Script | Shopware Command |
|---|---|
| bin/build-storefront.sh | `shopware-cli project storefront-build` |
| bin/build-administration.sh | `shopware-cli project admin-build` |
| bin/watch-storefront.sh | `shopware-cli project storefront-watch` |
| bin/watch-administration.sh | `shopware-cli project admin-watch` |

Watch only or exclude specific extensions:

```bash
shopware-cli project admin-watch --only-extensions <name>,<second>....
shopware-cli project admin-watch --skip-extensions <name>,<second>....
```

Build only extensions under `custom/static-plugins`:

```bash
shopware-cli project storefront-build --only-custom-static-extensions
shopware-cli project admin-build --only-custom-static-extensions
```

Run multiple workers instead of a single `bin/console messenger:consume`:

```bash
shopware-cli project worker <amount>
```

Clear cache without needing the project root directory (also clears the remote instance if an API connection is configured):

```bash
shopware-cli project clear-cache
```

Run a console command from anywhere:

```bash
shopware-cli project console <command>
```

Generate a JWT secret without a Shopware project or PHP installed:

```bash
shopware-cli project generate-jwt
```

Query the Admin API with a JWT token:

```bash
shopware-cli project admin-api --output-token
shopware-cli project admin-api GET /_info/version
```

## Essential identifiers

- `shopware-cli project create`
- `shopware-cli project storefront-build` / `admin-build`
- `shopware-cli project storefront-watch` / `admin-watch`
- `--only-extensions` / `--skip-extensions` / `--only-custom-static-extensions`
- `shopware-cli project worker`
- `shopware-cli project clear-cache`
- `shopware-cli project console`
- `shopware-cli project generate-jwt`
- `shopware-cli project admin-api`
