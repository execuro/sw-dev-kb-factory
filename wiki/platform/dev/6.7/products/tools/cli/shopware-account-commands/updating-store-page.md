---
id: platform/dev/6.7/products/tools/cli/shopware-account-commands/updating-store-page.md
title: Updating Store Page of Extension
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/shopware-account-commands/updating-store-page.html
sourceHash: 18f3d80cb2139cdba6cf0eaea5a97ad5e779fd89
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli account producer extension info pull", "shopware-cli account producer extension info push", ".config/shopware-extension.yml", "store.images", "store.image_directory", "shopware store listing", "store page", "extension metadata", "store images", "preview image", "listing as code", "ci/cd store update"]
summary: Manage an extension's Shopware Store listing as code with shopware-cli info pull/push and .config/shopware-extension.yml image and metadata config.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/shopware-account-commands/authentication.md", "platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md"]
---
## What it is

Shopware CLI can manage an extension's Shopware Store listing as code: descriptions, tags, installation instructions, images and other Store metadata live next to the extension in `.config/shopware-extension.yml`, are reviewed in Git, and are pushed from a workstation or CI/CD instead of being maintained only in the Store UI.

## When to use

- You want Store listing changes tracked and reviewed together with code changes (pull requests for localized or marketing content).
- You maintain several extensions or localized listings and want reproducible listing history per extension.
- You want to automate Store page updates instead of copying content manually into the Store UI.

Prerequisite: you are logged into the Shopware Store with Shopware CLI (see [Authentication](platform/dev/6.7/products/tools/cli/shopware-account-commands/authentication.md)).

## Key steps / config

1. Fetch the current Store page once, when adopting the workflow:

   ```bash
   shopware-cli account producer extension info pull <path-to-extension-folder>
   ```

   This downloads all uploaded Store images and creates `.config/shopware-extension.yml` with the extension's Store metadata. The file can be committed; it is removed automatically when you build a ZIP with Shopware CLI.
2. Edit `.config/shopware-extension.yml` and the referenced images in the extension repository.
3. Review the listing changes in Git like any other content change.
4. Push the approved metadata:

   ```bash
   shopware-cli account producer extension info push <path-to-extension-folder>
   ```

   This uploads all configured images and metadata to the Store page.
5. Validate and upload the release package separately via the [Store release workflow](platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md) — listing updates and package uploads are separate actions.

Image configuration, option A — explicit list:

```yaml
store:
  images:
    - file: <path-to-file>
      priority: 1        # ordering
      activate:          # languages the image is used in
        de: false
        en: false
      preview:           # only one image can be the preview
        de: false
        en: false
```

Option B — one directory, images sorted by filename; per-language subdirectories named by language code (e.g. `src/Resources/store/images/de/0.png`, `.../en/0.png`):

```yaml
store:
  image_directory: <path-to-directory>
```

## Essential identifiers

- `shopware-cli account producer extension info pull`
- `shopware-cli account producer extension info push`
- `.config/shopware-extension.yml`
- `store.images` (`file`, `priority`, `activate`, `preview`)
- `store.image_directory`

## Gotchas

- `info push` changes go live immediately on the Shopware Store and are visible to all users. The Store page cache refreshes every 6 hours, so a mistake can stay visible for that period — review before pushing.
- Only one image per language can be the preview image.
- `info push` does not upload a new extension version; package validation and upload are a separate step.

## Code check (6.7.15.1)
- unverified `shopware-cli account producer extension info pull` — Shopware CLI (Go tool), not part of vendor/shopware, out of scope
- unverified `shopware-cli account producer extension info push` — Shopware CLI command, out of scope
- unverified `.config/shopware-extension.yml` — read by Shopware CLI only; not referenced in vendor/shopware/core
- unverified `store.images` — Shopware CLI config schema, out of scope
- unverified `store.image_directory` — Shopware CLI config schema, out of scope
- confirmed `shopware-cli` — core registers Shopware CLI as a public OAuth client under `shopware.api.oauth_clients` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:244
