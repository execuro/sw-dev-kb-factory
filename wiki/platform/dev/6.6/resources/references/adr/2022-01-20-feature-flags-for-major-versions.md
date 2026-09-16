---
id: platform/dev/6.6/resources/references/adr/2022-01-20-feature-flags-for-major-versions.md
title: Feature flags for major versions
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-01-20-feature-flags-for-major-versions.html
sourceHash: 1254c1b076806c7d11b88b61aaf660a303973498
keywords: ["feature flags", "Feature class", "Feature::ifActive", "Feature::isActive", "Feature::triggerDeprecationOrThrow", "Feature::skipTestIfActive", "Module.register flag", "feature.isActive", "major version flag", "v6.5.0.0", "env variable feature flag"]
summary: ADR on using major-version feature flags like v6.5.0.0 to merge unfinished breaking changes early, toggled via env vars and the Feature class.
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record establishing feature flags for hiding upcoming major-version breaking changes behind a flag (e.g. `v6.5.0.0`) so they can be merged into trunk before being switched active.

## When to use
Relevant when preparing a breaking change ahead of the next major release, in PHP, JS/admin, storefront, templates, tests, or plugins.

## Key steps / config
Activate a flag via `.env` (dots aren't allowed in env var names, so underscores are used):

```bash
V6_5_0_0=1
```

PHP usage:

```php
use Shopware\Core\Framework\Feature;

Feature::ifActive('v6.5.0.0', function() use ($request) { /* ... */ });
if (Feature::isActive('v6.5.0.0')) { /* ... */ }
Feature::triggerDeprecationOrThrow('v6.5.0.0', 'Class is deprecated, use ... instead');
```

Tests:

```php
Feature::skipTestIfActive('v6.5.0.0', $this);
```

Admin module gating:

```javascript
Module.register('sw-awesome', {
    flag: 'v6.5.0.0',
    ...
});
```

Admin Vue component: inject `'feature'` and call `this.feature.isActive(flag)`; in templates `v-if="feature.isActive('v6.5.0.0')"`. In `config.xml`, add a `<flag>` element to an `<input-field>`.

Storefront JS:

```javascript
import Feature from 'src/helper/feature.helper';
if (Feature.isActive('v6.5.0.0')) { /* ... */ }
```

Storefront Twig: `{% if feature('v6.5.0.0') %} ... {% endif %}`.

## Essential identifiers
- `Feature::ifActive()`, `Feature::isActive()`, `Feature::triggerDeprecationOrThrow()`, `Feature::skipTestIfActive()`
- `Module.register()` `flag` option
- storefront `feature.helper` / Twig `feature()`
- `v6.5.0.0`, `v6.6.0.0` (major feature flags)

## Gotchas
- Major feature flags remain available after the corresponding release, so they can also serve as an alternative to `version_compare` for version switching, including in plugins.
- Plugins can query these major flags themselves to prepare for the next major or to support multiple Shopware major versions from a single plugin version.
