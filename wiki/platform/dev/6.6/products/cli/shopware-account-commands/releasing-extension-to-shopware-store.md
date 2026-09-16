---
id: platform/dev/6.6/products/cli/shopware-account-commands/releasing-extension-to-shopware-store.md
title: Releasing automated extension to Shopware Store
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/cli/shopware-account-commands/releasing-extension-to-shopware-store.html
sourceHash: ce2554ef5f3c7265caecb29abe1af2b22ff93304
keywords: ["shopware-cli", "account producer extension upload", "shopware-cli extension validate", "CHANGELOG", "skip-for-review-result", "Shopware Store", "release extension", "composer.json", "manifest.xml"]
summary: "shopware-cli account producer extension upload <zip-path> releases a validated, logged-in extension zip to the Shopware Store."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/products/cli/shopware-account-commands/authentication.md", "platform/dev/6.6/products/cli/extension-commands/build.md"]
---
## What it is

Describes uploading a built and validated extension zip to the Shopware Store via Shopware CLI.

## When to use

Use once an extension is logged into the Shopware Store, packaged as a zip with a `CHANGELOG*.md` entry for the new version, and validated.

## Key steps / config

Prerequisites: logged into the Shopware Store (see [Authentication](platform/dev/6.6/products/cli/shopware-account-commands/authentication.md)); a zip with all assets (see [Creating a zip](platform/dev/6.6/products/cli/extension-commands/build.md)); a `CHANGELOG*.md` file with an entry for the new version (a German changelog is optional); validated with `shopware-cli extension validate <zip-path>`.

Upload/release:

```bash
shopware-cli account producer extension upload <zip-path>
```

The command first checks whether an extension with the same version already exists in the store; if not, it uploads it, using the Composer constraint from `composer.json` or the manifest file for compatibility. After upload it waits for automatic validation results (can take a few minutes); on failure it prints the error and requires a fixed re-upload. `--skip-for-review-result` skips waiting for this check.

## Essential identifiers

- `shopware-cli account producer extension upload <zip-path>`
- `shopware-cli extension validate <zip-path>`
- `--skip-for-review-result`
- `composer.json`
