---
id: platform/dev/6.6/resources/references/adr/2023-01-10-atomic-theme-compilation.md
title: Atomic theme compilation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-01-10-atomic-theme-compilation.html"
sourceHash: 4755ad34d782ff73c25b1cda97d5455d57a2524d
keywords: ["AbstractThemePathBuilder", "generateNewPath", "saveSeed", "assemblePath", "system_config", "theme_sales_channel", "theme compilation", "atomic compile", "seed", "Platform.sh", "immutable deploys", "storefront themes"]
summary: "Documents seeded, per-compile theme folders via AbstractThemePathBuilder to make theme compilation atomic and avoid broken storefronts."
lastBuilt: "2026-09-15"
---
## What it is

ADR documenting Shopware 6's move to atomic theme compilation: instead of always compiling a theme into the same folder (which could leave the storefront broken mid-compile or after a failed compile), each compilation writes to a new folder identified by a generated seed, and the storefront only switches to it once compilation succeeds.

## When to use

Relevant when investigating a broken storefront during or after theme compilation, when implementing a custom `AbstractThemePathBuilder`, or when tuning how long old compiled theme folders are retained after a new compile.

## Key steps / config

- Problem: theme compilation always wrote into the same physical folder, which is deleted and recreated at the start of compilation; if compilation crashed, some files were missing and the storefront broke. A second edge case: a request hitting the store while compilation was still in progress could also see a broken storefront.
- Decision: compile into a new folder per compilation, named using a generated seed, and keep serving the old, complete theme folder until the new compilation finishes successfully.
- `AbstractThemePathBuilder` is extended with two new methods that custom implementations must provide:

```php
public function generateNewPath(string $salesChannelId, string $themeId, string $seed): string
public function saveSeed(string $salesChannelId, string $themeId, string $seed): void
```

- The compiler generates a random seed, calls `generateNewPath()` with it to get the target folder for the compilation, and — only after a successful compile — calls `saveSeed()`; subsequent calls to the existing `assemblePath()` method then take the new seed into account.
- The `seed` is stored in the `system_config` table (already cached and supports per-sales-channel values); storing it instead in the `theme_sales_channel` mapping table and reading it in `RequestTransformer` was discarded because the DAL does not support additional columns on mapping definitions (it uses `REPLACE INTO`, which would reset them on every write).
- Old theme folders are not deleted immediately, since CDN cache invalidation (e.g. Fastly) can lag; deletion is instead queued with a configurable delay (default 15 minutes, max SQS delay), so the old folder stays available for up to one hour after a new theme compiles successfully.
- Theme assets are moved out of the per-sales-channel compiled folder into a separate folder keyed by `themeId`, so they are no longer duplicated per sales channel.

## Essential identifiers

- `AbstractThemePathBuilder`
- `AbstractThemePathBuilder::generateNewPath()`
- `AbstractThemePathBuilder::saveSeed()`
- `AbstractThemePathBuilder::assemblePath()`
- `system_config` table
- `theme_sales_channel` mapping table

## Gotchas

`generateNewPath()` and `saveSeed()` are added as concrete methods with a default (backwards-compatible) implementation that ignores the seed — `saveSeed()` is a no-op and `generateNewPath()` just calls the existing `assemblePath()` — so old custom `AbstractThemePathBuilder` implementations keep working but do not get the seeding fix until they implement both methods themselves. On Platform.sh, the theme compile runs during the `build` step where there is no DB connection, so the default `system_config`-based seeding cannot be used there; Platform.sh instead gets an `AbstractThemePathBuilder` implementation that ignores the seed and always returns the same path (same behavior as before this change), and because Platform.sh uses immutable deploys, recompiling at runtime isn't possible anyway — a new deployment is required instead.

## Version notes

Both new `AbstractThemePathBuilder` methods are non-abstract (deprecated, default no-op) as introduced by this ADR, and become abstract — i.e. mandatory to implement in custom implementations — in the Shopware 6.6 major version.
