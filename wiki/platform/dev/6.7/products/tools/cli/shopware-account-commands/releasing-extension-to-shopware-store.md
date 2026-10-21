---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md
relatedPages:
  - platform/dev/6.7/products/tools/cli/shopware-account-commands/authentication.md
  - platform/dev/6.7/products/tools/cli/extension-commands/build.md
  - platform/dev/6.7/products/tools/cli/validation.md
  - platform/dev/6.7/guides/development/testing/store/_index.md
sourceHash: 10b0327a412d93a046f6e992bce9e812da8c0399
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.html
title: Automatically Release an Extension to the Shopware Store
version: "6.7"
versions:
  - "6.7"
keywords: ["shopware-cli account producer extension upload", "shopware-cli account producer extension release", "--skip-for-review-result", "shopware-cli extension validate", "shopware store release", "publish extension", "automatic code review", "CHANGELOG*.md", "composer.json", "manifest.xml", "ci/cd", "extension zip"]
summary: "Upload an extension zip to the Shopware Store via shopware-cli account producer extension upload; triggers and awaits the automatic code review."
lastBuilt: 2026-10-21
---
## What it is

How to upload an extension version to the Shopware Store with `shopware-cli account producer extension upload`, which pushes metadata and the zip, triggers the automatic code review and waits for its result. Designed primarily for CI/CD release automation.

## When to use

Automating extension releases from a pipeline, or uploading a new version of an extension that already exists in your producer account.

## Key steps / config

Prerequisites:

- Logged into the Shopware Store ([Authentication](platform/dev/6.7/products/tools/cli/shopware-account-commands/authentication.md)).
- A zip of the extension with all assets ([Build extensions](platform/dev/6.7/products/tools/cli/extension-commands/build.md)).
- The zip contains a `CHANGELOG*.md` file with an entry for the new version (German changelog optional).
- The zip has been validated with `shopware-cli extension validate <zip-path>` ([Validation](platform/dev/6.7/products/tools/cli/validation.md)).

Upload:

```bash
shopware-cli account producer extension upload <zip-path>
# return right after triggering the review
shopware-cli account producer extension upload <zip-path> --skip-for-review-result
```

What `upload` does:

1. Reads name and version from the zip — the extension must already exist in the producer account.
2. Creates a new binary for that version, or updates the existing binary if the version was uploaded but not yet published.
3. Pushes changelog entries and the compatible Shopware versions, derived from the Composer constraint in `composer.json` or `manifest.xml`.
4. Uploads the zip.
5. Triggers the automatic code review and waits for it (may take several minutes).
6. Reports passed / passed with warnings / failed; a failed review exits with an error — fix and upload again.

Waiting behaviour: waits 10 seconds, then polls up to 10 times at 15-second intervals (about two and a half minutes). No separate release/publish/approve CLI step is required. Afterwards, check the version status in the Shopware Account (version overview shows status, the analyses run — basic extension analysis, code quality analysis — and the latest review result).

## Essential identifiers

- `shopware-cli account producer extension upload <zip-path>`
- `--skip-for-review-result`
- `shopware-cli extension validate <zip-path>`
- `CHANGELOG*.md`, `composer.json`, `manifest.xml`

## Gotchas

- An already published version's binary cannot be replaced: the command logs that it is already published, skips the upload and exits successfully. Upload a new version instead.
- If the review takes longer than the polling window, the command logs `Skipping waiting for code review result as it took too long` and exits successfully — a green pipeline does not prove the review passed.
- Passing the automatic code review is not final Store approval; a brand-new extension also goes through functional testing and manual code review ([Store review](platform/dev/6.7/guides/development/testing/store/_index.md)).
- The source also shows `shopware-cli account producer extension release <name> --version <version>` while stating that no separate release step is needed for this workflow.

## Code check (6.7.15.1)
- unverified `shopware-cli account producer extension upload` — Shopware CLI command against the Shopware Account API, outside vendor/shopware, out of scope
- unverified `--skip-for-review-result` — Shopware CLI option, out of scope
- unverified `shopware-cli extension validate` — Shopware CLI command, out of scope
- unverified `CHANGELOG*.md` — read by Shopware CLI/Store, not by vendor/shopware core, out of scope
- confirmed `compatibility` — app manifest `meta` element carrying the Shopware version constraint read from `manifest.xml` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:180
