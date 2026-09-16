---
id: platform/dev/6.7/resources/references/adr/2023-01-10-atomic-theme-compilation.md
title: Atomic theme compilation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-01-10-atomic-theme-compilation.html
sourceHash: 080fa8d1845cc047500b7d810c57f68f982b5e7e
codeCheckedAgainst: "6.7.13.0"
keywords: ["AbstractThemePathBuilder", "SeedingThemePathBuilder", "MD5ThemePathBuilder", "generateNewPath", "saveSeed", "assemblePath", "storefront.themeSeed", "theme_path_builder_id", "DeleteThemeFilesTask", "theme compilation", "theme seed", "broken storefront", "paas", "upsun"]
summary: "ADR 2023-01-10: theme compiles into a new seeded folder via AbstractThemePathBuilder generateNewPath/saveSeed; old folder kept until switch succeeds."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2023-01-10, area storefront) making theme compilation atomic: each compile writes into a new folder derived from a random seed, and the Storefront switches to it only after the compile succeeds.

## When to use

- Writing a custom `Shopware\Storefront\Theme\AbstractThemePathBuilder` implementation.
- Debugging a broken Storefront after a failed theme compile, or theme folders that change on every compile.
- Running on PaaS/Upsun with immutable deploys and a build-time theme compile.

## Key steps / config

Problem solved: compiling always into the same folder deleted and recreated it first, so a crash (e.g. wrong theme config values) or a request during compilation left the Storefront without all compiled files.

Flow in the installed `ThemeCompiler`:

1. Generate a random seed (`Uuid::randomHex()`).
2. `generateNewPath($salesChannelId, $themeId, $seed)` returns the folder prefix under `theme/` for this compile.
3. If the new prefix equals `assemblePath()` (non-seeding builder), the old folder is deleted first.
4. Compiled styles, scripts and assets are copied.
5. On success, `saveSeed($salesChannelId, $themeId, $seed)` persists the seed; later `assemblePath()` calls resolve to the new folder. The theme config cache tag is invalidated.

In 6.7 all path-builder members are abstract, so a custom builder must declare all four:

```php
class MyThemePathBuilder extends AbstractThemePathBuilder
{
    public function getDecorated(): AbstractThemePathBuilder { /* ... */ }
    public function assemblePath(string $salesChannelId, string $themeId): string { /* ... */ }
    public function generateNewPath(string $salesChannelId, string $themeId, string $seed): string { /* ... */ }
    public function saveSeed(string $salesChannelId, string $themeId, string $seed): void { /* ... */ }
}
```

Implementations shipped:

- `Shopware\Storefront\Theme\SeedingThemePathBuilder` (default): stores the seed per sales channel in system config key `storefront.themeSeed` (system config is cached and supports per-sales-channel values); path is a hash of themeId + salesChannelId + seed.
- `Shopware\Storefront\Theme\MD5ThemePathBuilder`: ignores the seed (`saveSeed()` is a no-op, `generateNewPath()` returns `assemblePath()`), always the same path per theme/sales channel. Intended for PaaS or setups that cannot recompile at runtime, and for tests.

Select the builder with the bundle config `storefront.theme.theme_path_builder_id` (default `SeedingThemePathBuilder::class`).

Theme assets are stored in a separate folder named by `themeId`, shared across sales channels instead of duplicated per compiled folder.

Unused theme folders are removed by the scheduled task `DeleteThemeFilesTask`: folders not referenced by any `theme_sales_channel` mapping and whose files are older than 24 hours are deleted.

## Essential identifiers

- `Shopware\Storefront\Theme\AbstractThemePathBuilder`
- `SeedingThemePathBuilder`, `MD5ThemePathBuilder`
- `generateNewPath()`, `saveSeed()`, `assemblePath()`, `getDecorated()`
- `storefront.themeSeed` (system config key)
- `storefront.theme.theme_path_builder_id`
- `DeleteThemeFilesTask`

## Gotchas

- Changed asset URLs require invalidating Storefront HTTP cache; CDNs (e.g. Fastly) may serve stale pages that reference the old folder for a while, which is why old folders are not deleted immediately.
- The seed was deliberately not stored as an extra column in `theme_sales_channel`: the DAL does not allow extra columns in mapping definitions and rewrites mappings with `REPLACE INTO`.
- A copy-temp-folder-then-move alternative was rejected: moves are not atomic on S3/Google Cloud Storage, need per-file operations (cost), and do not fix requests during compilation.
- On PaaS/Upsun the compile runs in the `build` step without DB access, so the seeding builder (which writes the seed to the DB) cannot be used there; use the non-seeding builder.

## Version notes

- ADR plan: `generateNewPath()`/`saveSeed()` were added in 6.5 as concrete `@deprecated` methods with a BC default (no-op / `assemblePath()`), to become abstract in 6.6. In 6.7.13.0 they are abstract.
- ADR described deletion via a delayed queue message (`DeleteThemeFilesMessage`, configurable delay default 15 min). In 6.7.13.0 that message is `@deprecated` (removal 6.8.0) in favor of the scheduled task, and the `file_delete_delay` option is deprecated with no effect.

## Code check (6.7.13.0)
- confirmed `AbstractThemePathBuilder::generateNewPath()` — abstract, docs: concrete deprecated default method — vendor/shopware/storefront/Theme/AbstractThemePathBuilder.php:28
- confirmed `AbstractThemePathBuilder::saveSeed()` — abstract in 6.7 — vendor/shopware/storefront/Theme/AbstractThemePathBuilder.php:34
- confirmed `AbstractThemePathBuilder::assemblePath()` — abstract — vendor/shopware/storefront/Theme/AbstractThemePathBuilder.php:22
- confirmed `AbstractThemePathBuilder::getDecorated()` — abstract, also required — vendor/shopware/storefront/Theme/AbstractThemePathBuilder.php:14
- confirmed `storefront.themeSeed` — seed stored in system config per sales channel — vendor/shopware/storefront/Theme/SeedingThemePathBuilder.php:13
- confirmed `MD5ThemePathBuilder::saveSeed()` — no-op, seed ignored — vendor/shopware/storefront/Theme/MD5ThemePathBuilder.php:26
- confirmed `theme_path_builder_id` — defaults to SeedingThemePathBuilder — vendor/shopware/storefront/DependencyInjection/Configuration.php:27
- confirmed `generateNewPath` — compiler calls it with a random seed, then saveSeed after copy — vendor/shopware/storefront/Theme/ThemeCompiler.php:93
- deprecated `DeleteThemeFilesMessage` — removed in 6.8.0, replaced by scheduled task — vendor/shopware/storefront/Theme/Message/DeleteThemeFilesMessage.php:19
- deprecated `file_delete_delay` — docs: configurable delay default 15 min; now no effect, default 900 — vendor/shopware/storefront/DependencyInjection/Configuration.php:29
