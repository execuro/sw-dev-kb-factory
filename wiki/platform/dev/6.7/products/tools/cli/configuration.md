---
id: platform/dev/6.7/products/tools/cli/configuration.md
title: Configuration files
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/configuration.html
sourceHash: 903f52e75dfe44c5adbc995cc97dfefdf47bc116
codeCheckedAgainst: "6.7.15.1"
keywords: [".config/shopware-project.yml", ".config/shopware-extension.yml", ".shopware-project.yml", ".shopware-extension.yml", "shopware-project.local.yml", "--project-config", "project config init", "extension config init", "shopware-cli", "deployment helper", "config lookup priority", "legacy config location", "local override"]
summary: Where Shopware CLI and Deployment Helper look for project and extension config files, lookup order, legacy root files and the local override.
lastBuilt: 2026-10-21
---
## What it is

Shopware CLI keeps separate configuration files for projects and extensions. The preferred location for both is a `.config/` directory next to the checkout they describe, following the `.config` convention (a standard place other tools can also adopt). Shopware CLI and Deployment Helper are the first official Shopware tools to use it.

```text
.config/shopware-project.yml
.config/shopware-extension.yml
```

## When to use

When creating or migrating a Shopware CLI project or extension config, when a config change seems to be ignored (wrong file picked up), or when you need a per-machine override that should not be committed.

## Key steps / config

Project configuration lookup (when no explicit path is passed), used by Shopware CLI and Deployment Helper:

1. `.config/shopware-project.yml`
2. `.shopware-project.yaml`
3. `.shopware-project.yml`

Extension configuration lookup, relative to the extension directory:

1. `.config/shopware-extension.yml`
2. `.shopware-extension.yml`
3. `.shopware-extension.yaml`

- `--project-config <path>` always wins over project-config discovery. Extension config has no equivalent option.
- Local override for project config: path is derived from the resolved base file. With the preferred base it is `.config/shopware-project.local.yml`; a legacy base file keeps its matching root-level local override. The override is deep-merged and should not be committed.
- New files written by `project config init`, `project create`, the development-environment TUI, or `extension config init` go to the preferred `.config/` paths. Existing files are updated where they were resolved.
- Migration steps are in the Shopware CLI project-config ADR: https://github.com/shopware/shopware-cli/blob/main/docs/adr/0002-project-config-dot-config.md

## Essential identifiers

- `.config/shopware-project.yml`, `.config/shopware-project.local.yml`
- `.config/shopware-extension.yml`
- `--project-config <path>`
- `project config init`, `project create`, `extension config init`

## Gotchas

- Root-level files are legacy but still supported. If both the preferred and a legacy file exist, the preferred file wins and the CLI warns that the legacy file is ignored for that run.
- Project lookup checks `.yaml` before `.yml` at the root; extension lookup checks `.yml` before `.yaml`.

## Code check (6.7.15.1)
- unverified `.config/shopware-project.yml` — read by the Go-based shopware-cli, not by vendor/shopware core/storefront/administration; no occurrence in those roots
- unverified `.config/shopware-extension.yml` — shopware-cli config file, out of scope of the installed Shopware code
- unverified `--project-config` — shopware-cli / Deployment Helper option, out of scope
- unverified `shopware-project.local.yml` — shopware-cli local override, out of scope
