---
id: platform/dev/6.7/products/tools/cli/project-commands/sbom.md
title: Generate a Project SBOM
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/sbom.html
sourceHash: aa951588b5a048f5692552062210d7b89db7cf40
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli project sbom", "sbom", "software bill of materials", "cyclonedx", "cyclonedx-json", "sbom.cdx.json", "composer.lock", "packages-dev", "--include-dev-dependencies", "--output", "--format", "shopware-cli project ci", "vulnerability scanning", "compliance"]
summary: shopware-cli project sbom writes a CycloneDX 1.7 JSON SBOM from composer.lock (default sbom.cdx.json); dev packages excluded unless flagged.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/project-commands/build.md"]
---
## What it is

`shopware-cli project sbom` generates a Software Bill of Materials (SBOM) for a Shopware project from `composer.lock`. The output is a CycloneDX 1.7 JSON document — the same artifact `shopware-cli project ci` produces, but without running the full CI build.

## When to use

Security reviews, vulnerability scanning, compliance exports and release artifacts, when you need only the SBOM and not a production build (no asset compilation or other CI steps). If you need the full production build anyway, `shopware-cli project ci` also writes the SBOM — see [Build a Complete Project](platform/dev/6.7/products/tools/cli/project-commands/build.md).

## Key steps / config

```bash
# Write sbom.cdx.json into the current Shopware project
shopware-cli project sbom

# Explicit project path, format, and output file
shopware-cli project sbom ./my-shop --format cyclonedx-json --output sbom.json

# Include packages-dev from composer.lock
shopware-cli project sbom --include-dev-dependencies
```

What the command does:

- Reads `composer.lock` (and optionally `composer.json` for the root component name and version).
- Builds a CycloneDX 1.7 JSON SBOM of Composer packages.
- Writes it to the output path (default `sbom.cdx.json` in the project root).
- Exits non-zero with an error when `composer.lock` is missing or unreadable.

| Option | Description | Default |
|---|---|---|
| `[path]` | Shopware project directory | Nearest project / working directory |
| `--format` | SBOM format (`cyclonedx-json` only) | `cyclonedx-json` |
| `--output` / `-o` | Output file path | `sbom.cdx.json` in project root |
| `--include-dev-dependencies` | Include `packages-dev` from `composer.lock` | `false` |

Without a path argument, Shopware CLI walks up the directory tree looking for `composer.json` / `composer.lock` to find the nearest project, falling back to the current working directory.

Requirements: a valid `composer.lock` in the project root (or the given path), and a Shopware CLI release that includes the `project sbom` command.

## Essential identifiers

- `shopware-cli project sbom`
- `shopware-cli project ci`
- `--format cyclonedx-json`, `--output` / `-o`, `--include-dev-dependencies`
- `sbom.cdx.json`, `composer.lock`, `packages-dev`

## Gotchas

- `packages-dev` are excluded by default (matching `project ci`); pass `--include-dev-dependencies` to include them.
- `cyclonedx-json` is the only supported format.

## Code check (6.7.13.0)
- unverified `shopware-cli project sbom` — Shopware CLI (Go tool), not part of vendor/shopware; no match in core/storefront
- unverified `shopware-cli project ci` — Shopware CLI command, out of scope of vendor/shopware
- unverified `--include-dev-dependencies` — CLI option, out of scope of vendor/shopware
- unverified `sbom.cdx.json` — CLI default output file, not referenced in vendor/shopware
