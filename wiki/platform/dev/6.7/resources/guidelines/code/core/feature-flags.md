---
id: platform/dev/6.7/resources/guidelines/code/core/feature-flags.md
title: Feature Flags
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/feature-flags.html
sourceHash: e90f53d27c255849ff7c0162af4ebc2aa3f9adad
codeCheckedAgainst: "6.7.15.1"
keywords: ["feature flags", "feature toggle", "major flag", "FEATURE_ALL", "V6_8_0_0", "Feature::isActive", "Feature::triggerDeprecationOrThrow", "silentUntil", "shopware.feature", "feature.yaml", "DisabledFeatures", "Feature::skipTestIfActive", "BCChange", "deprecation", "feature.helper"]
summary: "Core guideline for Shopware feature flags: .env activation, FEATURE_ALL modes, service tags, Feature helpers in PHP, tests, admin, storefront and plugins."
lastBuilt: 2026-10-21
---
## What it is

The Shopware core coding guideline for feature flags: code hidden behind a flag can be merged into trunk before it is finished, which is how breaking changes for the next major are merged early without being active. Major flags (e.g. `v6.5.0.0`, `v6.8.0.0`) stay registered after their release, so plugins can also use them as a version switch instead of `version_compare`.

## When to use

- You prepare a breaking change or deprecation for the next major in core or a plugin.
- You need to run, test or pin code paths for a specific flag state (PHP, tests, administration, storefront, `config.xml`).

## Key steps / config

**Activate a flag** in `.env`; dots become underscores: `V6_5_0_0=1`. An explicit env value always wins over `FEATURE_ALL`. In 6.7.15.1, `FEATURE_ALL` has modes: any truthy value (`1`, `minor`) enables non-major flags; `FEATURE_ALL=major` enables major flags; `FEATURE_ALL=v6.8.0.0` enables only major flags arriving in that major or earlier.

**Registering a flag** in core `feature.yaml` (installed shape, `major` is a boolean):

```yaml
      - name: v6.8.0.0
        default: false
        major: true
        toggleable: false
```

**Services**: tag a service with `shopware.feature` and a required `flag` attribute; `FeatureFlagCompilerPass` removes the definition while that flag is inactive.

**PHP helpers** (`Shopware\Core\Framework\Feature`), always with the four-part ID (`v6.8.0.0`; the three-part `tag:v6.8.0` is the deprecation release label):

- `Feature::isActive('v6.5.0.0')` — put the old behaviour inside `if (!Feature::isActive(...))` so the flag is easy to remove later.
- `Feature::ifActive('v6.5.0.0', function () { ... })`, `Feature::ifNotActive(...)`.
- `Feature::triggerDeprecationOrThrow('v6.5.0.0', $message)` — throws when the flag is active, otherwise emits a deprecation; silence internal legacy calls with `Feature::silent($flag, $closure)`.
- Announce a deprecation whose replacement ships behind a later major with `silentUntil`:

```php
Feature::triggerDeprecationOrThrow(
    'v6.9.0.0',
    Feature::deprecatedMethodMessage(self::class, __METHOD__, 'v6.9.0.0', 'getDocumentFiles()'),
    silentUntil: 'v6.8.0.0',
);
```

Until `v6.8.0.0` is active the call returns silently; such a deprecation may name a major flag that is not registered yet.

**Planned API breaks** use attributes from the `Shopware\Core\Framework\Deprecation\BCChange` namespace, e.g. `#[ParameterTypeNarrowing(version: 'v6.8.0', parameterName: 'id', newType: 'string')]` — not deprecations; the current API stays usable. For `BecomesAbstract`, `NewRequiredParameter`, `ParameterRemoval`, `ParameterTypeNarrowing` call `Feature::triggerDeprecationOrThrow()` only for the incompatible legacy use. Do not use `@deprecated reason:*` for this.

**Tests**: in unit tests current major flags are active; test legacy behaviour with `#[DisabledFeatures(['v6.5.0.0'])]` (`Shopware\Core\Test\Annotation\DisabledFeatures`) instead of `Feature::fake()`. The attribute has no effect in the integration suite; use `Feature::skipTestIfActive('v6.5.0.0', $this)` / `Feature::skipTestIfInActive()` there (also in `setUp()`).

**Administration**: `Module.register('sw-awesome', { flag: 'v6.5.0.0', ... })`; in components `inject: ['feature']` and `this.feature.isActive(flag)`; in templates `v-if="feature.isActive('v6.5.0.0')"`. In `config.xml`, add a `flag` (attribute or `<flag>v6.5.0.0</flag>` element) to an `input-field`.

**Storefront**: JS `import Feature from 'src/helper/feature.helper'` then `Feature.isActive('v6.5.0.0')`; Twig `{% if feature('v6.5.0.0') %}`.

## Essential identifiers

- `Shopware\Core\Framework\Feature` — `isActive`, `ifActive`, `ifNotActive`, `silent`, `triggerDeprecationOrThrow`, `deprecatedMethodMessage`, `skipTestIfActive`, `skipTestIfInActive`, `fake`
- `FEATURE_ALL`, `V6_8_0_0`, `feature.yaml`
- service tag `shopware.feature`, `FeatureFlagCompilerPass`
- `Shopware\Core\Test\Annotation\DisabledFeatures`
- Twig function `feature()`, storefront `src/helper/feature.helper`

## Gotchas

- Not in 6.7.15.1 (the docs describe newer trunk): `Feature::ifActiveCall()`, `Feature::throwIfActive()`, `FeatureFlagCompilerPass::ALIASES_TO_REMOVE`, `FeatureFlagExtension::addTestNamespace()`, the `shopware.inactiveFeature` tag, `#[ClassMoved]` with `ClassAliasRegistry::ALIASES`, and the `major: v6.8.0.0` sub-feature syntax.
- Plugin flags via `Feature::setRegisteredFeatures()` do not exist in 6.7.15.1; the installed registration API is `Feature::registerFeature()`/`registerFeatures()`, marked `@internal`. The docs already call plugin flags internal and breakable.
- Do not branch on `Feature::isActive()` in a PHP service configuration file — it runs before the feature registry is initialized.
- `FEATURE_ALL=1` is not a release state; it also activates unrelated experimental features.

## Code check (6.7.15.1)
- absent `Shopware\Core\Framework\Deprecation\BCChange\ClassMoved` — no such attribute in the installed BCChange namespace
- absent `ifActiveCall` — Feature has ifActive/ifNotActive only
- absent `setRegisteredFeatures` — installed API is registerFeature/registerFeatures (@internal)
- absent `ALIASES_TO_REMOVE` — FeatureFlagCompilerPass only handles the shopware.feature tag
- absent `throwIfActive` — not a Feature method in 6.7.15.1
- absent `addTestNamespace` — not on the PHPUnit FeatureFlagExtension
- absent `shopware.inactiveFeature` — no compiler pass or tag handling for it
- confirmed `shopware.feature` — tagged services removed while flag inactive — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/FeatureFlagCompilerPass.php:22
- corrected `FEATURE_ALL` — docs: any truthy value enables every flag; code: truthy = minor flags, major/v6.8.0.0 = major flags — vendor/shopware/core/Framework/Feature.php:131
- corrected `major` — docs: omit for majors, sub-feature major: v6.8.0.0; installed feature.yaml uses boolean major: true — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:18
