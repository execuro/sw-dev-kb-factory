---
id: platform/dev/6.7/resources/references/adr/2022-01-20-feature-flags-for-major-versions.md
title: Feature flags for major versions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-01-20-feature-flags-for-major-versions.html
sourceHash: 1254c1b076806c7d11b88b61aaf660a303973498
codeCheckedAgainst: "6.7.13.0"
keywords: ["Feature::isActive", "Feature::ifActive", "Feature::triggerDeprecationOrThrow", "Feature::skipTestIfActive", "Shopware\\Core\\Framework\\Feature", "v6.5.0.0", "V6_5_0_0", "major feature flag", "feature toggle", "feature.helper", "feature.yaml", "deprecation", "adr"]
summary: "ADR: major-version feature flags (v6.x.0.0) hide next-major breaks; toggle via .env and check in PHP, tests, Admin, config.xml and Storefront."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record: Shopware hides code for the next major version behind a major feature flag named after the version (the ADR uses `v6.5.0.0`) and checks it through the static methods of `Shopware\Core\Framework\Feature`. Flags stay registered after the release, so plugins can use them as a version switch instead of `version_compare`.

## When to use

- Merging breaking changes early without activating them.
- Preparing a plugin for the next major, or supporting several majors with one plugin version.
- Deprecating code paths with an exception once the major flag is active.

## Key steps / config

**Activate in `.env`** — dots are not allowed in env names, use underscores (the code normalises `.`, `:` and `-` to `_` and uppercases):

```bash
V6_5_0_0=1
```

**PHP** (`use Shopware\Core\Framework\Feature;`):

- `Feature::isActive('v6.5.0.0')` — condition.
- `Feature::ifActive('v6.5.0.0', function () { /* ... */ });` — run a closure only when active.
- `Feature::triggerDeprecationOrThrow('v6.5.0.0', 'Class is deprecated, use ... instead');` — throws when the flag is active, otherwise emits a deprecation.

**Tests**: `Feature::skipTestIfActive('v6.5.0.0', $this);` (also usable in `setUp()`); `Feature::skipTestIfInActive()` is the inverse.

**Administration**:

```javascript
Module.register('sw-awesome', { flag: 'v6.5.0.0' /* ... */ });
// component
inject: ['feature'],
featureIsActive(flag) { return this.feature.isActive(flag); },
```

In templates: `v-if="feature.isActive('v6.5.0.0')"`.

**config.xml** — add a `flag` child element to an input field:

```xml
<input-field type="bool">
  <name>showTitleField</name>
  <flag>v6.5.0.0</flag>
</input-field>
```

**Storefront JS**: `import Feature from 'src/helper/feature.helper';` then `Feature.isActive('v6.5.0.0')`.

**Storefront Twig**: `{% if feature('v6.5.0.0') %}...{% endif %}`.

## Essential identifiers

- `Shopware\Core\Framework\Feature` — `isActive()`, `ifActive()`, `triggerDeprecationOrThrow()`, `skipTestIfActive()`
- `V6_5_0_0` (env var form of `v6.5.0.0`)
- Admin `Module.register(..., { flag })`, injected `feature` service
- `src/helper/feature.helper` (Storefront JS)
- Twig function `feature()`
- config.xml `<flag>` element

## Gotchas

- `triggerDeprecationOrThrow()` also throws when the flag name is not registered, so pass an existing major flag.
- `isActive()` warns about unknown feature names outside `prod`.
- `FEATURE_ALL=major` activates all major flags; `FEATURE_ALL=1`/`minor` only non-major ones. A flag set explicitly in the environment always wins.

## Version notes

The ADR names `v6.5.0.0` and `v6.6.0.0`. In the installed 6.7 core, `feature.yaml` registers `v6.5.0.0`, `v6.6.0.0` and `v6.7.0.0` with `default: true` (not toggleable) and `v6.8.0.0` with `default: false` — the flag for upcoming breaks is now `v6.8.0.0`.

## Code check (6.7.13.0)
- confirmed `Feature::isActive()` — static, env value wins over FEATURE_ALL — vendor/shopware/core/Framework/Feature.php:128
- confirmed `Feature::ifActive()` — runs closure when flag active — vendor/shopware/core/Framework/Feature.php:178
- confirmed `Feature::skipTestIfActive()` — marks test skipped when active — vendor/shopware/core/Framework/Feature.php:247
- corrected `Feature::triggerDeprecationOrThrow()` — docs: throws only for active flag; code: also throws for an unregistered flag — vendor/shopware/core/Framework/Feature.php:270
- confirmed `Feature::normalizeName()` — replaces `.`, `:`, `-` with `_`, uppercases — vendor/shopware/core/Framework/Feature.php:34
- corrected `v6.5.0.0` — docs: only core major flag; code: v6.5.0.0 to v6.8.0.0 registered, v6.8.0.0 default false — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:4
- confirmed `flag` — admin module registration skipped when flag inactive — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:510
- confirmed `isActive` — admin feature service method — vendor/shopware/administration/Resources/app/administration/src/app/service/feature.service.ts:20
- confirmed `isActive` — Storefront feature.helper static method — vendor/shopware/storefront/Resources/app/storefront/src/helper/feature.helper.js:71
- confirmed `feature` — Twig function registered by FeatureFlagExtension — vendor/shopware/core/Framework/Adapter/Twig/Extension/FeatureFlagExtension.php:37
