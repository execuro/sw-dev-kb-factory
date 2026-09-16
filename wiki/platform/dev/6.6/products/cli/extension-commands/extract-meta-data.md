---
id: "platform/dev/6.6/products/cli/extension-commands/extract-meta-data.md"
title: "Extracting Meta Data"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/cli/extension-commands/extract-meta-data.html"
sourceHash: "5d2f8eaee00777a6cfd27e51a75e9e5f7c22838e"
keywords: ["shopware-cli", "get-version", "get-changelog", "extension metadata", "changelog extraction", "CI/CD", "extension version", "automated release", "extension CLI"]
summary: "Documents shopware-cli extension get-version and get-changelog commands for use in CI/CD release pipelines."
lastBuilt: "2026-09-15"
---
## What it is
Documents the Shopware-CLI helpers for extracting metadata — version and changelog — from an extension, useful in CI/CD pipelines for automated releases.

## When to use
Use this in a CI/CD pipeline when automating an extension release and needing to read its current version or changelog programmatically rather than parsing extension files manually.

## Key steps / config
Extract the extension's version:

```bash
shopware-cli extension get-version <path>
```

Extract the extension's changelog:

```bash
shopware-cli extension get-changelog <path>
```

For both commands, `<path>` can be absolute or relative to the current working directory. `get-version` outputs the extension's version; `get-changelog` outputs its changelog, always in English regardless of other configured locales.

## Essential identifiers
- `shopware-cli extension get-version <path>` — outputs the extension version
- `shopware-cli extension get-changelog <path>` — outputs the extension changelog (English only)

## Gotchas
`get-changelog` always outputs the English changelog, even if the extension provides changelogs in other locales.
