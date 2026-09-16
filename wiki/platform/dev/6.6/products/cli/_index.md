---
id: platform/dev/6.6/products/cli/_index.md
title: Shopware CLI
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/cli/
sourceHash: 384e56a66cfd0750f20709983fc7b5e9b5792049
keywords: ["Shopware CLI", "shopware-cli", "project commands", "extension commands", "store commands", "command-line interface", "build extensions", "dump databases", "external tool"]
summary: Shopware CLI is an open-source external command-line tool with project, extension, and store command scopes for building and managing Shopware extensions.
lastBuilt: "2026-09-15"
relatedPages:
  - platform/dev/6.6/products/cli/installation.md
---
## What it is

Shopware CLI (`shopware-cli`) is an open-source external command-line interface for Shopware 6, providing commands to interact with a Shopware instance, build extensions, and dump databases. It is a separate tool, not part of the Shopware instance itself.

## When to use

Use it whenever tooling outside the Shopware instance is needed: building/packaging extensions, interacting with a running project, or publishing to the Shopware Store.

## Key steps / config

The CLI consists of three command scopes:

- Project commands — interact with a Shopware project
- Extension commands — build Shopware extensions
- Store commands — publish extensions to the Shopware Store or update them

Install it first via [installation](platform/dev/6.6/products/cli/installation.md) before using any of these command groups.

## Essential identifiers

- `shopware-cli` (CLI binary name)
