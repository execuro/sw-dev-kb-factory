---
id: platform/dev/6.7/resources/references/adr/2022-01-20-feature-flags-for-major-versions.md
title: Feature flags for major versions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-01-20-feature-flags-for-major-versions.html
sourceHash: 414854f9fbeb9d4247d2d9916a1890177909eaaf
codeCheckedAgainst: "6.7.15.1"
keywords: ["feature flag", "major version flag", "v6.8.0.0", "Shopware\\Core\\Framework\\Feature", "Feature::isActive", "Feature::ifActive", "Feature::triggerDeprecationOrThrow", "Feature::skipTestIfActive", "feature.yaml", "breaking changes", "deprecation", ".env"]
summary: "ADR: major-version feature flags (v6.x.0.0) hide upcoming breaks; how to toggle them via .env and check them in PHP, tests, admin, Storefront, config.xml."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-01-20, area: core) that establishes major-version feature flags (named like `v6.5.0.0`) to hide code for the next major release, so breaking changes can be merged into trunk early without being active. Code checks flags through the static methods of `Shopware\Core\Framework\Feature`.

## When to use

You prepare core or plugin code for the next Shopware major, need to switch a major flag on locally, or want one plugin version to support several majors (major flags remain after their release and act as a version switch, an alternative to PHP's `version_compare`).

## Key steps / config

**Activate a flag** in `.env`; dots are not allowed in env names, so use underscores (`Feature::normalizeName()` upper-cases and maps `.`, `:`, `-` to `_`):

```bash
V6_8_0_0=1
```

**PHP** (`use Shopware\Core\Framework\Feature;`):

```php
Feature::ifActive('v6.8.0.0', function () use ($request) { /* new code */ });
if (Feature::isActive('v6.8.0.0')) { /* new code */ }
Feature::triggerDeprecationOrThrow('v6.8.0.0', 'Class is deprecated, use ... instead');
Feature::skipTestIfActive('v6.8.0.0', $this); // in tests, also usable in setUp()
```

**Administration** — hide a whole module with `flag`:

```js
Module.register('sw-awesome', { flag: 'v6.8.0.0', /* ... */ });
```

In components, `inject: ['feature']` and call `this.feature.isActive(flag)`; in templates use `v-if="feature.isActive('v6.8.0.0')"`.

**config.xml** — toggle a config input field with a `<flag>` element inside `<input-field>` (the ADR also shows a `flag="..."` attribute):

```xml
<input-field type="bool">
  <name>showTitleField</name>
  <flag>v6.8.0.0</flag>
</input-field>
```

**Storefront** — JS: `import Feature from 'src/helper/feature.helper';` then `Feature.isActive('v6.8.0.0')`; Twig: `{% if feature('v6.8.0.0') %}...{% endif %}`.

## Essential identifiers

- `Shopware\Core\Framework\Feature`: `isActive()`, `ifActive()`, `triggerDeprecationOrThrow()`, `skipTestIfActive()`
- `v6.8.0.0` / env `V6_8_0_0`
- Admin `Module.register(..., { flag })`, injected `feature` service
- Storefront `src/helper/feature.helper`, Twig `feature()`
- config.xml `<flag>`

## Gotchas

- Only hide code meant for the next major behind a major flag.
- The ADR's examples use `v6.5.0.0`; that flag and `v6.6.0.0`/`v6.7.0.0` are already default-on and not toggleable in 6.7 — use `v6.8.0.0` for upcoming breaks.

## Version notes

- The ADR says core has a single flag `v6.5.0.0`. In 6.7.15.1, `feature.yaml` registers `v6.5.0.0`, `v6.6.0.0`, `v6.7.0.0` (default true) and `v6.8.0.0` (default false), all `major: true`, plus further named feature flags.

## Code check (6.7.15.1)
- confirmed `Feature::isActive()` — static check, env value outranks FEATURE_ALL — vendor/shopware/core/Framework/Feature.php:139
- confirmed `Feature::ifActive()` — runs closure when active — vendor/shopware/core/Framework/Feature.php:192
- confirmed `Feature::skipTestIfActive()` — skips TestCase when flag active — vendor/shopware/core/Framework/Feature.php:261
- confirmed `Feature::triggerDeprecationOrThrow()` — signature adds optional introducedIn/silentUntil — vendor/shopware/core/Framework/Feature.php:281
- confirmed `Feature::normalizeName()` — maps `.`/`:`/`-` to `_` and upper-cases — vendor/shopware/core/Framework/Feature.php:42
- corrected `v6.5.0.0` — docs: the only core feature flag; now default true, not toggleable — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:4
- confirmed `v6.8.0.0` — major flag, default false — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:16
- confirmed `flag` — admin module skipped when Shopware.Feature.isActive(flag) is false — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:505
- confirmed `feature` — Twig function registered — vendor/shopware/core/Framework/Adapter/Twig/Extension/FeatureFlagExtension.php:36
- confirmed `isActive` — Storefront Feature helper static method — vendor/shopware/storefront/Resources/app/storefront/src/helper/feature.helper.js:71
