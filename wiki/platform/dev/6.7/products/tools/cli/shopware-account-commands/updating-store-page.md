---
id: platform/dev/6.7/products/tools/cli/shopware-account-commands/updating-store-page.md
title: Updating Store Page of Extension
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/shopware-account-commands/updating-store-page.html
sourceHash: 5a30dc15975d67fcfc8d1a72cbda306244268bc5
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli account producer extension info pull", "shopware-cli account producer extension info push", ".shopware-extension.yml", "store.images", "store.image_directory", "store page", "store listing", "shopware store", "extension metadata", "store images", "listing as code", "producer account"]
summary: "shopware-cli account producer extension info pull/push syncs Store listing metadata and images via .shopware-extension.yml; pushes go live immediately."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/shopware-account-commands/authentication.md", "platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md"]
---
## What it is

Shopware CLI commands that manage an extension's Shopware Store listing (descriptions, tags, installation instructions, images) as a file kept next to the extension code, so the listing can be versioned in Git and pushed from CI/CD instead of edited only in the Store UI.

## When to use

- You maintain one or several extensions (possibly with localized listings) and want Store page changes reviewed through pull requests.
- You want to automate Store page updates as part of a release pipeline.

Prerequisite: you are logged into the Shopware Store with Shopware CLI (see [Authentication](platform/dev/6.7/products/tools/cli/shopware-account-commands/authentication.md)).

## Key steps / config

1. Pull the current Store page once when adopting the workflow:
   `shopware-cli account producer extension info pull <path-to-extension-folder>`
   This downloads all uploaded Store images and creates `.shopware-extension.yml` with the Store metadata.
2. Edit `.shopware-extension.yml` and the referenced images in the extension repository.
3. Review the listing changes in Git like any other change.
4. Push approved metadata:
   `shopware-cli account producer extension info push <path-to-extension-folder>`
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
- `.shopware-extension.yml`
- `store.images` (`file`, `priority`, `activate`, `preview`)
- `store.image_directory`

## Gotchas

- `info push` changes go live immediately on the Shopware Store for all users; the Store page cache refreshes every 6 hours, so mistakes can stay visible that long. Review before pushing.
- `.shopware-extension.yml` can be committed; it is automatically removed from ZIP files created by Shopware CLI, so listing configuration does not end up in the distributed package.
- Only one image may be marked as preview (per language).

## Code check (6.7.13.0)
- unverified `shopware-cli account producer extension info pull` — external Go CLI, not part of vendor/shopware
- unverified `shopware-cli account producer extension info push` — external Go CLI, not part of vendor/shopware
- unverified `.shopware-extension.yml` — read only by shopware-cli; no reference in vendor/shopware/core
- unverified `store.image_directory` — shopware-cli config schema, out of scope
- unverified `store.images` — shopware-cli config schema, out of scope
