---
id: platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md
title: Automatically Release an Extension to the Shopware Store
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.html
sourceHash: 10b0327a412d93a046f6e992bce9e812da8c0399
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli account producer extension upload", "shopware-cli account producer extension release", "--skip-for-review-result", "shopware-cli extension validate", "shopware store", "release extension", "publish plugin", "automatic code review", "CHANGELOG*.md", "manifest.xml", "composer.json", "ci/cd"]
summary: shopware-cli account producer extension upload sends a zip to the Store, pushes changelog and compat versions, polls the automatic code review.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/shopware-account-commands/authentication.md", "platform/dev/6.7/products/tools/cli/extension-commands/build.md", "platform/dev/6.7/products/tools/cli/validation.md", "platform/dev/6.7/guides/development/testing/store/_index.md"]
---
## What it is

Automating the release of an extension version to the Shopware Store with `shopware-cli account producer extension upload`, primarily for CI/CD pipelines.

## When to use

When a new extension version (zip) is ready and should be uploaded and submitted to the Store's automatic code review without using the Account UI.

## Key steps / config

Prerequisites:

- Logged into the Shopware Store ([Authentication](platform/dev/6.7/products/tools/cli/shopware-account-commands/authentication.md)).
- A zip of the extension with all assets ([build](platform/dev/6.7/products/tools/cli/extension-commands/build.md)).
- The zip contains a `CHANGELOG*.md` with an entry for the new version (German changelog optional).
- Zip validated with `shopware-cli extension validate <zip-path>` ([validation](platform/dev/6.7/products/tools/cli/validation.md)).

Upload:

```bash
shopware-cli account producer extension upload <zip-path>
# return immediately after triggering the review
shopware-cli account producer extension upload <zip-path> --skip-for-review-result
```

Upload process:

1. Reads name and version from the zip — the extension must already exist in the producer account.
2. Creates a new binary for that version, or updates the existing binary if the version is uploaded but not yet published.
3. Pushes changelog entries and compatible Shopware versions, derived from the Composer constraint in `composer.json` or `manifest.xml`.
4. Uploads the zip.
5. Triggers the automatic code review and waits for the result.
6. Reports passed / passed with warnings / failed; a failed review exits with an error.

No separate release/publish/approve CLI step is required. The source also shows `shopware-cli account producer extension release <name> --version <version>`. After the review, check the version status in the Shopware Account (version overview: status, basic extension analysis, code quality analysis, latest review result).

## Essential identifiers

- `shopware-cli account producer extension upload <zip-path>`
- `--skip-for-review-result`
- `shopware-cli account producer extension release <name> --version <version>`
- `shopware-cli extension validate <zip-path>`
- `CHANGELOG*.md`, `composer.json`, `manifest.xml`

## Gotchas

- Waiting: 10 s initial delay, then up to 10 polls at 15 s intervals (about 2.5 min). If unfinished, it logs `Skipping waiting for code review result as it took too long` and exits successfully — a green pipeline does not prove the review passed.
- An already published version cannot be replaced: the command logs that it is published, skips the upload and exits successfully. Upload a new version instead.
- A brand-new extension additionally goes through functional testing and manual code review ([Store review](platform/dev/6.7/guides/development/testing/store/_index.md)); passing the automatic review does not guarantee Store approval.

## Code check (6.7.13.0)
- unverified `shopware-cli account producer extension upload` — Shopware CLI (Go tool), not part of vendor/shopware
- unverified `--skip-for-review-result` — CLI option, out of scope of vendor/shopware
- unverified `CHANGELOG*.md` — Store/CLI packaging requirement, not read by vendor/shopware core
- confirmed `manifest.xml` — app manifest file core detects inside extension zips — vendor/shopware/core/Framework/Plugin/PluginZipDetector.php:46
