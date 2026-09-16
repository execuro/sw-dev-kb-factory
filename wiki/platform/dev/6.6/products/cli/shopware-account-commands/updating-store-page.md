---
id: platform/dev/6.6/products/cli/shopware-account-commands/updating-store-page.md
title: Updating Store Page of Extension
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/cli/shopware-account-commands/updating-store-page.html
sourceHash: 94ea7d202696c78981af9156be58bf66941fc9ca
keywords: ["shopware-cli", "account producer extension info pull", "account producer extension info push", ".shopware-extension.yml", "store images", "image_directory", "store page", "preview image", "activate de en"]
summary: "shopware-cli account producer extension info pull/push manages an extension's Shopware Store page description and images."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/products/cli/shopware-account-commands/authentication.md"]
---
## What it is

Describes versioning a Shopware extension's Store page representation (description, images, other assets) via Shopware CLI.

## When to use

Use after logging into the Shopware Store (see [Authentication](platform/dev/6.6/products/cli/shopware-account-commands/authentication.md)), to fetch or update the current Store page content.

## Key steps / config

Fetch the current Store page (recommended starting point) into a local `.shopware-extension.yml` and downloaded images:

```bash
shopware-cli account producer extension info pull <path-to-extension-folder>
```

The resulting `.shopware-extension.yml` can be checked into version control; it is automatically removed when creating a zip with Shopware CLI.

Push changes back to the Store page:

```bash
shopware-cli account producer extension info push <path-to-extension-folder>
```

Images can be configured explicitly:

```yaml
store:
  images:
    - file:
      priority: 1
      activate:
        de: false
        en: false
      preview:
        de: false
        en: false
```

or via a single directory:

```yaml
store:
  image_directory:
```

Images are sorted by file name; per-language images use subdirectories named by language code (e.g. `de/`, `en/`), each with its own preview image.

## Essential identifiers

- `shopware-cli account producer extension info pull` / `push`
- `.shopware-extension.yml`
- `store.images`, `store.image_directory`
