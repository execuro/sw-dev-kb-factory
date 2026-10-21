---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/tools/cli/extension-commands/extract-meta-data.md
sourceHash: f8c0ef9d3f32d8de5d0ceb0ad5f18bff19c6bf68
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/extension-commands/extract-meta-data.html
title: Extracting Meta Data
version: "6.7"
versions:
  - "6.7"
keywords: ["shopware-cli", "shopware-cli extension get-version", "shopware-cli extension get-name", "shopware-cli extension get-changelog", "shopware-cli extension config-schema", ".config/shopware-extension.yml", "extension version", "extension name", "changelog", "json schema", "ci/cd", "release automation"]
summary: "Shopware CLI helpers that print an extension's version, name, English changelog, or the JSON schema of .config/shopware-extension.yml"
lastBuilt: 2026-10-21
---
## What it is

Shopware CLI (`shopware-cli`) ships helper commands under `shopware-cli extension` that read metadata out of an extension directory: its version, its name, its changelog, and the JSON schema of the extension configuration file `.config/shopware-extension.yml`. They are intended for scripted use, typically in CI/CD pipelines that build and publish an extension release automatically.

## When to use

- A release pipeline needs the extension version for the automated release.
- A pipeline needs to determine the extension identifier (name) programmatically.
- Release notes for an automated release should be taken from the extension's changelog.
- An AI agent or another automation tool needs to understand the configuration structure of `.config/shopware-extension.yml`, i.e. which options it accepts.

## Key steps / config

Each extraction command takes the extension path as its argument. The path can be absolute or relative to the current working directory.

```bash
shopware-cli extension get-version <path>
shopware-cli extension get-name <path>
shopware-cli extension get-changelog <path>
shopware-cli extension config-schema
```

1. `get-version` outputs the version of the extension.
2. `get-name` outputs the name of the extension (its identifier).
3. `get-changelog` outputs the changelog of the extension.
4. `config-schema` takes no path and outputs the JSON schema that describes all available configuration options in `.config/shopware-extension.yml`.

## Essential identifiers

- `shopware-cli extension get-version <path>`
- `shopware-cli extension get-name <path>`
- `shopware-cli extension get-changelog <path>`
- `shopware-cli extension config-schema`
- `.config/shopware-extension.yml`

## Gotchas

- `get-changelog` always outputs the English changelog; the page names no option for selecting another language.
- These are `shopware-cli` commands, not shop `bin/console` commands; they operate on the extension path you pass.

## Code check (6.7.15.1)
- unverified `shopware-cli extension get-version` — shopware-cli is a separate tool, not part of vendor/shopware core, storefront or administration
- unverified `shopware-cli extension get-name` — shopware-cli command, out of scope of the installed Shopware packages
- unverified `shopware-cli extension get-changelog` — shopware-cli command, out of scope of the installed Shopware packages
- unverified `shopware-cli extension config-schema` — shopware-cli command, out of scope of the installed Shopware packages
- unverified `.config/shopware-extension.yml` — not referenced in the installed Shopware packages; read by shopware-cli only
