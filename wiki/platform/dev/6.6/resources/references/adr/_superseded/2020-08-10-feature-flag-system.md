---
id: platform/dev/6.6/resources/references/adr/_superseded/2020-08-10-feature-flag-system.md
title: Feature flag system
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/_superseded/2020-08-10-feature-flag-system.html
sourceHash: b0616c57599777a08f31a9308678c22727d80bf3
keywords: ["feature.yaml", "FEATURE_XXX_XXX", "NEXT-733", "FEATURE-NEXT-1797", "feature flag", "superseded", "config/packages/feature.yaml", "shopware.feature.flags", "workflow"]
summary: "Superseded ADR: original feature-flag mechanism - flags declared in feature.yaml, referenced in code as FEATURE_XXX_XXX."
lastBuilt: 2026-09-15
---
## What it is

This is a superseded ADR describing the original Shopware feature-flag system, added to toggle code for incomplete features and kept robust and safe against partially-configured flags. The document states it is superseded by a later ADR on feature flags for major versions.

## When to use

Historical reference only, for understanding the original flag-declaration mechanism this superseded ADR describes; consult the current feature-flags-for-major-versions ADR for present-day guidance.

## Key steps / config

A feature flag is added by editing `/Core/Framework/Resources/config/packages/feature.yaml`:

```yaml
shopware:
    ....
    feature:
        flags:
            - NEXT-733
            - FEATURE-NEXT-1797
            - FEATURE_NEXT_1797
```

- The flag must reference an issue.
- The full flag name is always `FEATURE_XXX_XXX`; the `FEATURE_` prefix is hard-coded and need not be repeated in the config entry.
- In code, the flag is always referenced by its full name, `FEATURE_XXX_XXX`.
- After the feature is completed, the flag's config entry and every code reference must be deleted in the same merge request that removes the replaced old code.

## Essential identifiers

- `/Core/Framework/Resources/config/packages/feature.yaml`
- `FEATURE_XXX_XXX`

## Gotchas

The mechanism relies on developer discipline: it does not prevent typos or lost code when a flag is removed, since every occurrence must be found and cleaned up manually.
