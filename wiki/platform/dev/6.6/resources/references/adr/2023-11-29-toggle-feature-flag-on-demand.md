---
id: platform/dev/6.6/resources/references/adr/2023-11-29-toggle-feature-flag-on-demand.md
title: Make feature flags toggleable on demand
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-11-29-toggle-feature-flag-on-demand.html"
sourceHash: 26f82f3af35133067419e75756fab61a237bc5ed
keywords: ["FeatureFlagRegistry", "feature.yaml", "app_config", "feature flag", "FeatureFlagController", "BeforeFeatureFlagToggleEvent", "FeatureFlagToggledEvent", "bin/console feature:enable", "bin/console feature:disable", "bin/console feature:list", "feature.flags", "key value storage"]
summary: "ADR: feature flags become toggleable at runtime via database storage, Admin API and CLI, in addition to `feature.yaml`/env vars."
lastBuilt: 2026-09-15
---
## What it is
Architecture decision record introducing on-demand toggling of non-major feature flags via the database, a new Admin API, and CLI commands, instead of requiring an environment-variable change and restart.

## When to use
Relevant when a plugin or the platform needs to enable/disable an experimental feature at runtime, or when integrating with the feature-flag toggle events.

## Key steps / config
- Feature flags stored under the `feature.flags` key in `app_config` (or the configured key-value storage) merge with the static `feature.yaml` definitions.
- All activated flags register on `Framework::boot` via `FeatureFlagRegistry::register`.
- `FeatureFlagRegistry::registry` merges static and stored flags, filtering out flags marked `major` from the stored set (major flags cannot be toggled).
- New Admin API routes: `POST /api/_action/feature-flag/enable/{feature}`, `POST /api/_action/feature-flag/disable/{feature}`, `GET /api/_action/feature-flag`.
- `FeatureFlagRegistry::enable`/`disable` persist the new state and dispatch `BeforeFeatureFlagToggleEvent` before, and `FeatureFlagToggledEvent` after, toggling.
- CLI: `bin/console feature:enable FEATURE_EXAMPLE`, `bin/console feature:disable FEATURE_EXAMPLE`, `bin/console feature:list`.

## Essential identifiers
- `FeatureFlagRegistry::register`, `FeatureFlagRegistry::registry`, `FeatureFlagRegistry::enable`, `FeatureFlagRegistry::disable`
- `BeforeFeatureFlagToggleEvent`, `FeatureFlagToggledEvent`
- `feature.flags` key in `app_config`
- `bin/console feature:enable`, `bin/console feature:disable`, `bin/console feature:list`

## Gotchas
Only non-major feature flags may be toggled on demand; major feature flags cannot be toggled via the stored/database mechanism. Runtime toggling via the database overrides the environment-variable value when the flag is present there. External plugins can add their own flags to the `feature.flags` key in the key-value storage (e.g. the `app_config` table).
