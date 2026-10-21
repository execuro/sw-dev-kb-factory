---
id: platform/dev/6.7/resources/references/adr/2023-11-29-toggle-feature-flag-on-demand.md
title: Make feature flags toggleable on demand
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-11-29-toggle-feature-flag-on-demand.html
sourceHash: 26f82f3af35133067419e75756fab61a237bc5ed
codeCheckedAgainst: "6.7.15.1"
keywords: ["FeatureFlagRegistry", "feature.flags", "feature:enable", "feature:disable", "feature:list", "BeforeFeatureFlagToggleEvent", "FeatureFlagToggledEvent", "FeatureFlagController", "/api/_action/feature-flag", "toggleable", "feature toggle", "runtime feature flag", "app_config"]
summary: "ADR: runtime-toggleable feature flags via FeatureFlagRegistry, stored under feature.flags, with Admin API routes and feature:enable/disable CLI."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2023-11-29) making feature flags toggleable at runtime. Previously flags lived only in `feature.yaml` and environment variables and needed a restart; now their state can also be stored in the key-value storage (default: `app_config` table) and toggled via Admin API or CLI.

## When to use

- Enabling/disabling an experimental or beta feature in a running shop, in tests or in CI/CD pipelines.
- A plugin registering its own flags or reacting before/after a toggle.

## Key steps / config

1. Storage: flags are persisted under key `feature.flags` (`FeatureFlagRegistry::STORAGE_KEY`) as a map of flag name to config (`name`, `default`, `active`, ...). Plugins can add their own flags there.
2. Boot: `Shopware\Core\Framework\Framework::boot()` gets `Shopware\Core\Framework\Feature\FeatureFlagRegistry` from the container and calls `register()`, which merges `feature.yaml` flags with stored non-major flags and passes them to `Feature::registerFeatures()`. With the toggle disabled or no database connection, only static flags are registered.
3. Runtime toggling is controlled by `shopware.feature_toggle.enable` (default `true`).
4. Only flags with `toggleable: true` can be toggled:

```yaml
shopware:
  feature:
    flags:
      - name: EXAMPLE_FEATURE
        default: false
        major: false
        toggleable: true
```

5. Admin API (`Shopware\Core\Framework\Api\Controller\FeatureFlagController`, ACL `api_feature_flag_toggle`):
   - `POST /api/_action/feature-flag/enable/{feature}` — route `api.action.feature-flag.enable`, 204, clears cache
   - `POST /api/_action/feature-flag/disable/{feature}` — route `api.action.feature-flag.disable`, 204, clears cache
   - `GET /api/_action/feature-flag` — route `api.action.feature-flag.load`, registered flags with current `active` state
6. CLI: `bin/console feature:enable <feature>`, `bin/console feature:disable <feature>`, `bin/console feature:list`.
7. Events: `enable()`/`disable()` dispatch `Shopware\Core\Framework\Feature\Event\BeforeFeatureFlagToggleEvent` before and `Shopware\Core\Framework\Feature\Event\FeatureFlagToggledEvent` after storing the state and calling `Feature::setActive()`.

## Essential identifiers

- `FeatureFlagRegistry` (`register()`, `enable()`, `disable()`, `STORAGE_KEY`)
- `feature.flags`, `toggleable`, `shopware.feature_toggle.enable`
- `FeatureFlagController`; routes `api.action.feature-flag.enable` / `.disable` / `.load`
- `BeforeFeatureFlagToggleEvent`, `FeatureFlagToggledEvent`
- `feature:enable`, `feature:disable`, `feature:list`

## Gotchas

- The toggle is meant for experimental/beta features, not major ones. In the installed code the gate is `toggleable`, not `major` alone — some major flags (e.g. `ACCESSIBILITY_TWEAKS`) are toggleable.
- Toggling an unregistered or non-toggleable flag, or any flag while `shopware.feature_toggle.enable` is off, throws a `FeatureException` instead of returning silently.
- Stored flags override environment variables.
- ADR snippets differ from shipped code: `registry()` is `register()`, `Feature::toggle()` is `Feature::setActive()`, and enable/disable do not share the route name `api.action.feature-flag.toggle`.

## Code check (6.7.15.1)
- confirmed `FeatureFlagRegistry::STORAGE_KEY` — value `feature.flags` — vendor/shopware/core/Framework/Feature/FeatureFlagRegistry.php:21
- corrected `FeatureFlagRegistry::register()` — docs: `registry()`; merges static and stored non-major flags — vendor/shopware/core/Framework/Feature/FeatureFlagRegistry.php:36
- confirmed `FeatureFlagRegistry` — fetched and registered in `Framework::boot()` — vendor/shopware/core/Framework/Framework.php:172
- corrected `toggleable` — docs: only major check; code requires `toggleable` and throws — vendor/shopware/core/Framework/Feature/FeatureFlagRegistry.php:89
- corrected `Feature::setActive()` — docs: `Feature::toggle()` — vendor/shopware/core/Framework/Feature/FeatureFlagRegistry.php:102
- confirmed `feature_toggle.enable` — default `true` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:697
- corrected `api.action.feature-flag.enable` — docs: enable/disable both named `api.action.feature-flag.toggle` — vendor/shopware/core/Framework/Api/Controller/FeatureFlagController.php:31
- confirmed `api.action.feature-flag.load` — GET /api/_action/feature-flag — vendor/shopware/core/Framework/Api/Controller/FeatureFlagController.php:67
- confirmed `BeforeFeatureFlagToggleEvent` — dispatched before toggling — vendor/shopware/core/Framework/Feature/FeatureFlagRegistry.php:99
- confirmed `FeatureFlagToggledEvent` — dispatched after toggling — vendor/shopware/core/Framework/Feature/FeatureFlagRegistry.php:104
