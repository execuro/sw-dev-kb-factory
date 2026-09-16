---
id: platform/dev/6.7/products/tools/cli/extension-commands/extract-meta-data.md
title: Extracting Meta Data
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/extension-commands/extract-meta-data.html
sourceHash: 09d78966e4af302eef8964f10d01a189505b6248
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli", "shopware-cli extension get-version", "shopware-cli extension get-name", "shopware-cli extension get-changelog", "shopware-cli extension config-schema", ".shopware-extension.yml", "extension version", "extension name", "changelog", "json schema", "ci/cd", "release automation"]
summary: shopware-cli helpers get-version, get-name, get-changelog and config-schema that read extension metadata for CI/CD release pipelines.
lastBuilt: 2026-09-15
---
## What it is

Shopware CLI (`shopware-cli`) ships helper subcommands under `shopware-cli extension` that read metadata from an extension (plugin or app) and print it to stdout: its version, its name, its changelog, and the JSON schema of the `.shopware-extension.yml` configuration file.

## When to use

- In a CI/CD pipeline that needs the extension version, name or changelog for an automated release (for example tagging a release or filling release notes).
- When a script has to determine the extension identifier programmatically instead of hard-coding it.
- When an AI agent or automation tool needs to know which options `.shopware-extension.yml` accepts.

## Key steps / config

All three extraction commands take a `<path>` to the extension; the path can be absolute or relative to the current working directory.

1. Print the extension version:
   ```bash
   shopware-cli extension get-version <path>
   ```
2. Print the extension name (the extension identifier):
   ```bash
   shopware-cli extension get-name <path>
   ```
3. Print the extension changelog:
   ```bash
   shopware-cli extension get-changelog <path>
   ```
4. Print the JSON schema describing all available configuration options of `.shopware-extension.yml` (no path argument):
   ```bash
   shopware-cli extension config-schema
   ```

Because each command writes only the requested value, its output can be captured directly into a pipeline variable.

## Essential identifiers

- `shopware-cli extension get-version <path>`
- `shopware-cli extension get-name <path>`
- `shopware-cli extension get-changelog <path>`
- `shopware-cli extension config-schema`
- `.shopware-extension.yml`

## Gotchas

- `get-changelog` always outputs the English changelog; there is no option described for other languages.

## Code check (6.7.13.0)
- unverified `shopware-cli extension get-version` — Shopware CLI is a separate tool, outside vendor/shopware core, storefront and administration
- unverified `shopware-cli extension get-name` — Shopware CLI command, out of scope of the installed code index
- unverified `shopware-cli extension get-changelog` — Shopware CLI command, out of scope of the installed code index
- unverified `shopware-cli extension config-schema` — Shopware CLI command, out of scope of the installed code index
- unverified `.shopware-extension.yml` — read by Shopware CLI, not by vendor/shopware code
