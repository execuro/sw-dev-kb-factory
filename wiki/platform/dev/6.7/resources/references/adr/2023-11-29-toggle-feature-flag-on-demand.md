---
id: platform/dev/6.7/resources/references/adr/2023-11-29-toggle-feature-flag-on-demand.md
title: Make feature flags toggleable on demand
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-11-29-toggle-feature-flag-on-demand.html
sourceHash: 26f82f3af35133067419e75756fab61a237bc5ed
codeCheckedAgainst: "6.7.13.0"
keywords: ["FeatureFlagRegistry", "feature.flags", "feature:enable", "feature:disable", "feature:list", "BeforeFeatureFlagToggleEvent", "FeatureFlagToggledEvent", "/api/_action/feature-flag", "shopware.feature_toggle.enable", "toggleable", "feature flag", "feature toggle", "app_config", "experimental features"]
summary: "ADR: feature.yaml flags merged with DB-stored flags (key feature.flags); toggle toggleable, non-major flags via Admin API or bin/console feature:enable."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2023-11-29): feature flags can be toggled at runtime, not only via environment variables. Static flags from `feature.yaml` are merged with flags stored in the key-value storage (default: `app_config` table) under key `feature.flags`, and can be switched via Admin API or CLI.

## When to use

- Enabling/disabling an experimental/beta feature flag in a running shop without redeploying.
- A plugin registering its own flags or reacting to flag toggles.

## Key steps / config

1. `Shopware\Core\Framework\Feature\FeatureFlagRegistry::register()` is called in `Framework::boot()`. If `shopware.feature_toggle.enable` is false it registers only the static flags (`%shopware.feature.flags%`); otherwise it loads `FeatureFlagRegistry::STORAGE_KEY` (`feature.flags`) from `AbstractKeyValueStorage`, JSON-decodes strings, drops stored flags with `major` true, `array_merge`s static + stored and calls `Feature::registerFeatures()`. On a DBAL exception (no database) it falls back to static flags.
2. Toggle via Admin API (all require auth and ACL privilege `api_feature_flag_toggle`; enable/disable also clear the cache and return 204):
   - `POST /api/_action/feature-flag/enable/{feature}` — route `api.action.feature-flag.enable`
   - `POST /api/_action/feature-flag/disable/{feature}` — route `api.action.feature-flag.disable`
   - `GET /api/_action/feature-flag` — route `api.action.feature-flag.load`, returns registered flags with their current `active` state
3. Or via CLI: `bin/console feature:enable <feature>`, `bin/console feature:disable <feature>`, `bin/console feature:list`.
4. `FeatureFlagRegistry::enable()`/`disable()` throw if toggling is disabled, the flag is not registered, or the flag lacks `toggleable: true`; otherwise they store the flag with `static` and `active`, call `Feature::setActive()`, and dispatch `BeforeFeatureFlagToggleEvent` before and `FeatureFlagToggledEvent` after.

Flag definition shape in `feature.yaml`:

```yaml
shopware:
  feature:
    flags:
      - name: EXAMPLE_FEATURE
        default: true
        major: false
        toggleable: true
```

## Essential identifiers

- `Shopware\Core\Framework\Feature\FeatureFlagRegistry` (`register`, `enable`, `disable`, `STORAGE_KEY`)
- `Shopware\Core\Framework\Api\Controller\FeatureFlagController`
- `Shopware\Core\Framework\Feature\Event\BeforeFeatureFlagToggleEvent`, `Shopware\Core\Framework\Feature\Event\FeatureFlagToggledEvent`
- `feature:enable`, `feature:disable`, `feature:list`
- `shopware.feature_toggle.enable`, `feature.flags`, `toggleable`

## Gotchas

- Major flags cannot be toggled with stored flags; the ADR stresses toggling is for experimental/beta features only, not major ones.
- Stored flags override the environment variables for that flag.
- External plugins can add their own flags to the `feature.flags` key in the key-value storage.
- The ADR's sample code uses `FeatureFlagRegistry::registry`, `Feature::toggle` and the route name `api.action.feature-flag.toggle` for both actions; the installed code differs (see Code check).

## Code check (6.7.13.0)
- corrected `FeatureFlagRegistry::register()` — docs: method `registry()` — vendor/shopware/core/Framework/Feature/FeatureFlagRegistry.php:36
- confirmed `FeatureFlagRegistry::STORAGE_KEY` — value `feature.flags` — vendor/shopware/core/Framework/Feature/FeatureFlagRegistry.php:21
- corrected `toggleable` — docs: only a `major` check; code rejects flags without `toggleable` true — vendor/shopware/core/Framework/Feature/FeatureFlagRegistry.php:89
- corrected `Feature::setActive()` — docs: `Feature::toggle` — vendor/shopware/core/Framework/Feature/FeatureFlagRegistry.php:102
- confirmed `BeforeFeatureFlagToggleEvent` — dispatched before storing — vendor/shopware/core/Framework/Feature/FeatureFlagRegistry.php:99
- confirmed `FeatureFlagToggledEvent` — dispatched after toggling — vendor/shopware/core/Framework/Feature/FeatureFlagRegistry.php:104
- corrected `api.action.feature-flag.enable` — docs: `api.action.feature-flag.toggle` for enable and disable — vendor/shopware/core/Framework/Api/Controller/FeatureFlagController.php:31
- confirmed `api.action.feature-flag.load` — GET `/api/_action/feature-flag`, ACL `api_feature_flag_toggle` — vendor/shopware/core/Framework/Api/Controller/FeatureFlagController.php:67
- confirmed `shopware.feature_toggle.enable` — default `true`, gates runtime toggling — vendor/shopware/core/Framework/DependencyInjection/flag.xml:10
- confirmed `feature:enable` — CLI command exists (also `feature:disable`, `feature:list`) — vendor/shopware/core/Framework/Feature/Command/FeatureEnableCommand.php:19
