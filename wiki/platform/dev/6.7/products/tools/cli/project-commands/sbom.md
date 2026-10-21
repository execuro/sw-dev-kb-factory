---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/tools/cli/project-commands/sbom.md
relatedPages:
  - platform/dev/6.7/products/tools/cli/project-commands/build.md
sourceHash: aa951588b5a048f5692552062210d7b89db7cf40
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/project-commands/sbom.html
title: Generate a Project SBOM
version: "6.7"
versions:
  - "6.7"
keywords: ["shopware-cli project sbom", "sbom", "software bill of materials", "cyclonedx", "cyclonedx-json", "sbom.cdx.json", "composer.lock", "--include-dev-dependencies", "packages-dev", "shopware-cli project ci", "vulnerability scanning", "compliance export"]
summary: "shopware-cli project sbom writes a CycloneDX 1.7 JSON SBOM (sbom.cdx.json) from composer.lock without running the full project ci build."
lastBuilt: 2026-10-21
---
## What it is

`shopware-cli project sbom` generates a Software Bill of Materials (SBOM) for a Shopware project from `composer.lock`. The output is a CycloneDX 1.7 JSON document — the same artifact `shopware-cli project ci` produces, but without running the full CI build (asset compilation and other CI steps).

## When to use

Security reviews, vulnerability scanning, compliance exports and release artifacts, when you only need the bill of materials and not a production build. If you need the full build anyway, `shopware-cli project ci` writes the SBOM as part of it (see platform/dev/6.7/products/tools/cli/project-commands/build.md).

## Key steps / config

```bash
# Write sbom.cdx.json into the current Shopware project
shopware-cli project sbom

# Explicit project path, format and output file
shopware-cli project sbom ./my-shop --format cyclonedx-json --output sbom.json

# Include packages-dev from composer.lock
shopware-cli project sbom --include-dev-dependencies
```

What the command does:

1. Reads `composer.lock` (and optionally `composer.json` for the root component name and version).
2. Builds a CycloneDX 1.7 JSON SBOM of the Composer packages.
3. Writes the document to the output path — default `sbom.cdx.json` in the project root.
4. Exits non-zero with an error when `composer.lock` is missing or unreadable.

Without a path argument the CLI resolves the nearest Shopware project by walking up the directory tree looking for `composer.json` / `composer.lock`, and falls back to the current working directory.

| Option | Description | Default |
|---|---|---|
| `[path]` | Shopware project directory | Nearest project / working directory |
| `--format` | SBOM format (`cyclonedx-json` only) | `cyclonedx-json` |
| `--output` / `-o` | Output file path | `sbom.cdx.json` in the project root |
| `--include-dev-dependencies` | Include `packages-dev` from `composer.lock` | `false` |

Requirements: a valid `composer.lock` in the project root (or the given path), and a Shopware CLI release that ships the `project sbom` command.

## Essential identifiers

- `shopware-cli project sbom`
- `shopware-cli project ci`
- `--format cyclonedx-json`, `--output` / `-o`, `--include-dev-dependencies`
- `sbom.cdx.json`, `composer.lock`, `composer.json`, `packages-dev`

## Gotchas

- `packages-dev` are excluded by default, matching `project ci`; pass `--include-dev-dependencies` to include them.
- Only Composer packages are covered — the SBOM is built from `composer.lock`, so a missing lock file is a hard error.
- `cyclonedx-json` is the only supported `--format`.

## Code check (6.7.15.1)
- unverified `shopware-cli project sbom` — command lives in the separate Shopware CLI tool, outside vendor/shopware, out of scope
- unverified `--include-dev-dependencies` — Shopware CLI option, not part of vendor/shopware, out of scope
- unverified `sbom.cdx.json` — default output file of Shopware CLI, out of scope
- unverified `shopware-cli project ci` — Shopware CLI command, out of scope
