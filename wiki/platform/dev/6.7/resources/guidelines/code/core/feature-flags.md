---
id: platform/dev/6.7/resources/guidelines/code/core/feature-flags.md
title: Feature Flags
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/feature-flags.html
sourceHash: 457e651ff1e7b94ecbe4fee00a22c7d5fbebcdaa
codeCheckedAgainst: "6.7.13.0"
keywords: ["feature flag", "feature toggle", "major flag", "FEATURE_ALL", "Feature::isActive", "Feature::ifActive", "Feature::triggerDeprecationOrThrow", "Feature::skipTestIfActive", "DisabledFeatures", "feature.yaml", "breaking change", "deprecation", "v6.8.0.0", "feature.isActive", "twig feature()"]
summary: "Feature flags: .env toggles, FEATURE_ALL modes, Feature::isActive/ifActive/triggerDeprecationOrThrow, DisabledFeatures in unit tests, admin and Twig usage."
lastBuilt: 2026-09-15
---
## What it is

Core guideline on feature flags: code hidden behind a flag can be merged to trunk before it is finished, and major flags (`v6.8.0.0` style) let breaking changes land early without being active. Covers toggling flags, using them in PHP, tests, administration, storefront and plugins.

## When to use

When adding or guarding a breaking change, writing tests that depend on a flag state, hiding admin modules/config fields behind a flag, or making a plugin support several Shopware majors.

## Key steps / config

**Toggle a flag** in `.env`; dots are not allowed in env names, so use underscores:
```
V6_5_0_0=1
```
**Groups via `FEATURE_ALL`** (as implemented in `Shopware\Core\Framework\Feature::isActive()`):
- `1`, `minor`, or any truthy value except `false` → all non-major flags.
- `major` (`Feature::ALL_MAJOR`) → all major flags.
- A flag set explicitly in the environment always wins over `FEATURE_ALL`.
- Otherwise the flag's `default` from `feature.yaml` applies (`name`, `default`, `major`, `toggleable` keys).

**PHP** (`use Shopware\Core\Framework\Feature;`):
- `Feature::isActive('v6.5.0.0')` — condition; put the old behaviour inside the `if (!Feature::isActive(...))` block so removal is easy.
- `Feature::ifActive('v6.5.0.0', function () use ($request) { ... })` / `Feature::ifNotActive(...)` — closure form.
- `Feature::triggerDeprecationOrThrow('v6.5.0.0', 'Class is deprecated, use ... instead')` — throws if the major flag is active (or unknown when flags are registered), otherwise emits a deprecation.

**Planning API changes**: annotate a planned break for the next major with a contract-change attribute (not `@deprecated`); for legacy uses detectable at runtime keep old behaviour and call `Feature::triggerDeprecationOrThrow()` only for the incompatible use. Framework-invoked methods are exempt. Use `vX.Y.Z` versions, parameter names without `$`, `::class` references.

**Tests**:
- Unit suite (`Shopware\Tests\Unit\` namespace): the PHPUnit feature-flag test extension sets every registered flag active per test; disable flags with `#[DisabledFeatures(['v6.5.0.0'])]` (`Shopware\Core\Test\Annotation\DisabledFeatures`) rather than `Feature::fake()`.
- Integration suite: flag state comes from the job; `#[DisabledFeatures]` there throws a runtime error. Use `Feature::skipTestIfActive('v6.5.0.0', $this)` / `Feature::skipTestIfInActive(...)`, also in `setUp()`.

**Administration**:
```javascript
Module.register('sw-awesome', { flag: 'v6.5.0.0', ... });
inject: ['feature'], // this.feature.isActive(flag)
```
Template: `v-if="feature.isActive('v6.5.0.0')"`. In `config.xml`, an input field accepts a `flag` child element (`<flag>v6.5.0.0</flag>`).

**Storefront**: JS `import Feature from 'src/helper/feature.helper';` then `Feature.isActive('v6.5.0.0')`; Twig `{% if feature('v6.5.0.0') %}`.

**Plugins**: major flags stay after release, so plugins can query them as a version switch instead of `version_compare`.

## Essential identifiers

- `Shopware\Core\Framework\Feature`: `isActive`, `ifActive`, `ifNotActive`, `triggerDeprecationOrThrow`, `skipTestIfActive`, `skipTestIfInActive`, `fake`, `getAll`
- `FEATURE_ALL`, `Feature::ALL_MAJOR`, `feature.yaml`
- `Shopware\Core\Test\Annotation\DisabledFeatures`
- Twig function `feature`; admin service `feature`; `src/helper/feature.helper`

## Gotchas

- `Feature::ifActiveCall()` from the source does not exist; use `Feature::ifActive()` with a closure.
- Own plugin flags: the source's `Feature::setRegisteredFeatures()` does not exist. The installed API is `Feature::registerFeature()` / `Feature::registerFeatures()`, both marked `@internal` — the source itself warns this may break at any time.
- The source says plugin suites can extend `#[DisabledFeatures]` handling via `FeatureFlagExtension::addTestNamespace()`; the code-index scan flagged `addTestNamespace` absent, although a static method of that name is declared on the PHPUnit `FeatureFlagExtension` class — verify before relying on it.
- The planned-change attributes (`ParameterTypeNarrowing`, `CallSiteCompatibilityChange`, `ExtenderCompatibilityChange`, `BecomesAbstract`, `NewRequiredParameter`, `ParameterRemoval`, `NewOptionalParameter`) under `Shopware\Core\Framework\Deprecation\BCChange` are not in the installed 6.7.13.0 code.

## Version notes

- Trunk-era text (two majors in flight, `FEATURE_ALL=v6.8.0.0` per-major lanes, a `majorVersion` key in `feature.yaml`) is not implemented in 6.7.13.0: `Feature::isActive()` knows only truthy/`major` modes, and the integration-major job runs with `FEATURE_ALL=major`.

## Code check (6.7.13.0)
- absent `Shopware\Core\Framework\Deprecation\BCChange` — attribute namespace not in installed code
- absent `ifActiveCall` — no such Feature method; closure-based ifActive exists
- absent `setRegisteredFeatures` — installed API is the internal registerFeatures
- absent `addTestNamespace` — flagged by index scan; a static method of this name is declared on the PHPUnit FeatureFlagExtension
- unverified `majorVersion` — feature.yaml key; no reader found in installed core, trunk-only per source
- corrected `FEATURE_ALL` — docs: `v6.8.0.0` value selects major flags up to that version; code has only truthy/major modes — vendor/shopware/core/Framework/Feature.php:145
- confirmed `Feature::ifActive()` — runs closure when flag active — vendor/shopware/core/Framework/Feature.php:178
- confirmed `Feature::triggerDeprecationOrThrow()` — throws when major flag active — vendor/shopware/core/Framework/Feature.php:267
- confirmed `Feature::skipTestIfActive()` — marks test skipped when flag active — vendor/shopware/core/Framework/Feature.php:247
- confirmed `DisabledFeatures` — final attribute class with features array — vendor/shopware/core/Test/Annotation/DisabledFeatures.php:12
