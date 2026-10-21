---
id: platform/dev/6.7/resources/references/adr/2023-01-10-atomic-theme-compilation.md
title: Atomic theme compilation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-01-10-atomic-theme-compilation.html
sourceHash: 080fa8d1845cc047500b7d810c57f68f982b5e7e
codeCheckedAgainst: "6.7.15.1"
keywords: ["atomic theme compilation", "theme compile", "theme seed", "AbstractThemePathBuilder", "SeedingThemePathBuilder", "MD5ThemePathBuilder", "generateNewPath", "saveSeed", "assemblePath", "ThemeCompiler", "theme_path_builder_id", "storefront.themeSeeds", "theme.delete_files", "paas", "upsun"]
summary: "ADR 2023-01-10: themes compile into a new seeded folder via AbstractThemePathBuilder; the seed is saved only on success."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (area: storefront, 2023-01-10) that makes theme compilation atomic: every compile writes into a fresh folder derived from a random seed, and the storefront switches to it only after the compile succeeded. It extends `Shopware\Storefront\Theme\AbstractThemePathBuilder` with a seeding mechanism.

## When to use

When writing or decorating a custom theme path builder, when debugging broken storefront CSS/JS after a theme compile, or when deploying on PaaS/Upsun where the theme is compiled at build time.

## Key steps / config

Problem solved: previously the theme was compiled into the same folder, which was deleted and recreated at compile start. A crash (e.g. a wrongly configured theme value) left an incomplete folder and a broken storefront, and requests hitting the shop during a compile could see missing files.

Compile flow in 6.7 (`ThemeCompiler`):

1. A new random seed is generated (`Uuid::randomHex()`).
2. `generateNewPath($salesChannelId, $themeId, $seed)` returns the folder for this compilation; compiled files are copied there.
3. Only after the copy succeeded, `saveSeed($salesChannelId, $themeId, $seed)` persists the seed.
4. Subsequent `assemblePath($salesChannelId, $themeId)` calls (on every storefront request) use the saved seed, so the new folder goes live.
5. If the old and new path are identical (a non-seeding builder), the compiler deletes the folder before writing, which is the old non-atomic behaviour.

A custom path builder must implement all four abstract members of `AbstractThemePathBuilder`:

```php
class MyThemePathBuilder extends AbstractThemePathBuilder
{
    public function getDecorated(): AbstractThemePathBuilder { /* ... */ }
    public function assemblePath(string $salesChannelId, string $themeId): string { /* ... */ }
    public function generateNewPath(string $salesChannelId, string $themeId, string $seed): string { /* ... */ }
    public function saveSeed(string $salesChannelId, string $themeId, string $seed): void { /* ... */ }
}
```

Implementations shipped in 6.7:

- `Shopware\Storefront\Theme\SeedingThemePathBuilder` — default (`storefront.theme.theme_path_builder_id`). Stores the seed in `system_config` per sales channel under `storefront.themeSeeds.<themeId>`, falling back to the legacy sales-channel-wide `storefront.themeSeed`. The system config is already heavily cached and supports per-sales-channel values, so the per-request lookup stays fast.
- `Shopware\Storefront\Theme\MD5ThemePathBuilder` — ignores the seed (`saveSeed()` is a no-op, `generateNewPath()` returns `assemblePath()`). Intended for PaaS or tests, where the theme cannot be recompiled at runtime.

Theme assets are stored in a separate folder named after the `themeId`, independent of sales channel and theme configuration, so they are not duplicated on every compile.

## Essential identifiers

- `Shopware\Storefront\Theme\AbstractThemePathBuilder`
- `AbstractThemePathBuilder::generateNewPath()`, `::saveSeed()`, `::assemblePath()`, `::getDecorated()`
- `Shopware\Storefront\Theme\SeedingThemePathBuilder`, `Shopware\Storefront\Theme\MD5ThemePathBuilder`
- `Shopware\Storefront\Theme\ThemeCompiler`
- `storefront.theme.theme_path_builder_id`
- `storefront.themeSeeds.<themeId>` (system config)
- `theme.delete_files` — scheduled task removing unused theme files

## Gotchas

- Discarded alternative: compiling into a temp folder and moving it over the live folder. Moving is atomic on local filesystems but not on S3 or Google Cloud Storage (no real folders, files are moved one by one), it does not fix requests during an in-progress copy, and it multiplies paid file operations.
- Storing the seed as an extra column in `theme_sales_channel` and reading it in the `RequestTransformer` was rejected: the DAL does not allow extra columns in mapping definitions and resets them, since mappings are written with `REPLACE INTO`.
- New asset URLs mean all storefront caches must be invalidated (previously a cache-buster query parameter did the same job). Old folders must survive a while because CDNs such as Fastly may still serve stale HTML pointing at them.
- PaaS/Upsun: the compile runs in the `build` step without a DB connection, and immutable deploys make the file system read-only, so the seeding builder cannot be used there; use the `MD5ThemePathBuilder`. Rolling back means redeploying the previous release. Once Upsun allows external theme asset storage, compiling can move to the `deploy` step and use seeding.

## Version notes

- The ADR (6.5 era) added `generateNewPath()`/`saveSeed()` as concrete `@deprecated` methods with a seed-ignoring default, to become abstract in 6.6. In 6.7 both are abstract, so custom builders without them fail to load.
- The ADR described deleting the old folder through a delayed queue message (`DeleteThemeFilesMessage`, delay `storefront.theme.file_delete_delay`, default 15 min). In 6.7 both are deprecated for removal in 6.8.0: the delay option "has no effect anymore", and unused theme files are deleted by the `DeleteThemeFilesTask` scheduled task.

## Code check (6.7.15.1)
- corrected `AbstractThemePathBuilder::generateNewPath()` — docs: concrete deprecated default method; now abstract — vendor/shopware/storefront/Theme/AbstractThemePathBuilder.php:28
- corrected `AbstractThemePathBuilder::saveSeed()` — docs: concrete no-op default; now abstract — vendor/shopware/storefront/Theme/AbstractThemePathBuilder.php:34
- confirmed `AbstractThemePathBuilder::getDecorated()` — abstract, also required in custom builders — vendor/shopware/storefront/Theme/AbstractThemePathBuilder.php:14
- confirmed `generateNewPath` — `ThemeCompiler` calls it with a `Uuid::randomHex()` seed — vendor/shopware/storefront/Theme/ThemeCompiler.php:93
- confirmed `saveSeed` — `ThemeCompiler` calls it only after files are copied — vendor/shopware/storefront/Theme/ThemeCompiler.php:128
- corrected `storefront.themeSeeds.` — docs: seed in system_config; key is per theme, legacy `storefront.themeSeed` fallback — vendor/shopware/storefront/Theme/SeedingThemePathBuilder.php:17
- confirmed `SeedingThemePathBuilder` — default value of `theme_path_builder_id` — vendor/shopware/storefront/DependencyInjection/Configuration.php:9
- confirmed `MD5ThemePathBuilder` — seed-ignoring builder for PaaS/tests — vendor/shopware/storefront/Theme/MD5ThemePathBuilder.php:14
- deprecated `DeleteThemeFilesMessage` — removed in 6.8.0, files now deleted by scheduled task — vendor/shopware/storefront/Theme/Message/DeleteThemeFilesMessage.php:17
- deprecated `file_delete_delay` — docs: configurable delay, default 15 min; option has no effect, removal in 6.8.0 — vendor/shopware/storefront/DependencyInjection/Configuration.php:30
