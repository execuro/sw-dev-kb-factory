---
id: platform/hubs/feature-flag.md
title: "Feature Flag"
summary: "How Shopware's feature-flag system works: env/DB toggles, related ADRs, experimental/BC annotations, and areas historically gated behind flags."
keywords: ["feature flag", "feature.yaml", "FEATURE_ALL", "Feature::isActive", "experimental annotation", "backward compatibility", "deprecation", "toggle feature flag", "accessibility", "document system v2", "storefront scss", "vue compat mode", "stock management", "insider previews"]
members: ["platform/dev/6.6/guides/hosting/configurations/shopware/stock.md", "platform/dev/6.6/guides/plugins/plugins/content/stock/_index.md", "platform/dev/6.6/resources/accessibility/storefront/_index.md", "platform/dev/6.6/resources/guidelines/code/backward-compatibility.md", "platform/dev/6.6/resources/references/adr/2022-01-05-add-feature-flag-support-for-storefront-scss.md", "platform/dev/6.6/resources/references/adr/2022-10-20-deprecation-handling-during-phpunit-test-execution.md", "platform/dev/6.6/resources/references/adr/2023-05-10-experimental-features.md", "platform/dev/6.6/resources/references/adr/2023-09-06-feature-property-for-experimental-anotation.md", "platform/dev/6.6/resources/references/adr/2023-11-29-toggle-feature-flag-on-demand.md", "platform/dev/6.6/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.md", "platform/dev/6.6/resources/references/adr/2025-01-01-remove-asterisk-next-to-every-price.md", "platform/dev/6.6/resources/references/adr/_superseded/2020-08-10-feature-flag-system.md", "platform/dev/6.6/resources/references/adr/_superseded/2020-08-19-handling-feature-flags.md", "platform/dev/6.6/resources/references/adr/_superseded/2021-01-21-deprecation-strategy.md", "platform/dev/6.7/concepts/commerce/checkout-concept/document/_index.md", "platform/dev/6.7/guides/development/accessibility/_index.md", "platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md", "platform/dev/6.7/guides/plugins/plugins/checkout/documents/_index.md", "platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/_index.md", "platform/dev/6.7/resources/guidelines/code/core/feature-flags.md", "platform/dev/6.7/resources/references/adr/2022-01-05-add-feature-flag-support-for-storefront-scss.md", "platform/dev/6.7/resources/references/adr/2023-09-06-feature-property-for-experimental-anotation.md", "platform/dev/6.7/resources/references/adr/2023-11-29-toggle-feature-flag-on-demand.md", "platform/dev/6.7/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.md", "platform/dev/6.7/resources/references/adr/2024-07-31-add-more-unit-tests-namespaces-to-featureflag-extension.md", "platform/dev/6.7/resources/references/adr/2025-01-31-move-flow-execution-after-business-process.md", "platform/func/tutorials-and-faq/insider-previews.md"]
lastBuilt: "2026-09-15"
---

Come here instead of grepping directly whenever a task involves gating code behind a
feature flag, deciding whether an `@experimental`/`@deprecated` annotation needs a matching
flag, toggling a flag at runtime, or figuring out which Storefront/Admin area is (or was)
still hidden behind one. The member set spans the mechanism itself (ADRs on how flags are
declared, toggled and tested) and the concrete features that have used flags (stock
handling, accessibility, document generation v2, Vue 3 migration).

## Mechanism (ADRs, cross-version)

- [Toggle feature flags on demand (6.6)](platform/dev/6.6/resources/references/adr/2023-11-29-toggle-feature-flag-on-demand.md) and its updated [6.7 counterpart](platform/dev/6.7/resources/references/adr/2023-11-29-toggle-feature-flag-on-demand.md) — flags become toggleable at runtime via DB storage (`app_config`/`feature.flags`), Admin API and `bin/console feature:enable`/`feature:disable`/`feature:list`, in addition to `feature.yaml`/env vars.
- [Experimental features (6.6)](platform/dev/6.6/resources/references/adr/2023-05-10-experimental-features.md) — introduces `@experimental` for classes/methods/UI not covered by the BC promise, with a required `stableVersion`.
- [Add Feature property to `@experimental` annotation (6.6)](platform/dev/6.6/resources/references/adr/2023-09-06-feature-property-for-experimental-anotation.md) and its [6.7 counterpart](platform/dev/6.7/resources/references/adr/2023-09-06-feature-property-for-experimental-anotation.md) — `@experimental` annotations must also name a `feature:<ALL_CAPS_NAME>`, linking the code to its flag.
- [Add feature flag support for Storefront SCSS (6.6)](platform/dev/6.6/resources/references/adr/2022-01-05-add-feature-flag-support-for-storefront-scss.md) and its [6.7 counterpart](platform/dev/6.7/resources/references/adr/2022-01-05-add-feature-flag-support-for-storefront-scss.md) — a global `feature()` SCSS function reads a `$sw-features` map compiled by `ThemeCompiler`/webpack, so SCSS can branch on flags the way Twig already does via `Feature::getAll`/`config_js_features.json`.
- [Disable Vue compat mode per component level (6.6)](platform/dev/6.6/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.md) and its [6.7 counterpart](platform/dev/6.7/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.md) — Administration components opt out of Vue 2 compat mode individually via `DISABLE_VUE_COMPAT`/`Shopware.compatConfig`, instead of a global switch.
- [Deprecation handling during PHPUnit test execution](platform/dev/6.6/resources/references/adr/2022-10-20-deprecation-handling-during-phpunit-test-execution.md) — `SYMFONY_DEPRECATIONS_HELPER` with an `ignoreFile`, and `@DisableFeatures` replacing `@ActiveFeatures` for internal deprecations.
- [Backward Compatibility](platform/dev/6.6/resources/guidelines/code/backward-compatibility.md) — the `@deprecated`/`@feature-deprecated`/`@major-deprecated`/`@internal` annotation rules that feature flags plug into.
- [Feature Flags (6.7 guideline)](platform/dev/6.7/resources/guidelines/code/core/feature-flags.md) — the current developer-facing reference: `.env` toggles, `FEATURE_ALL` modes, `Feature::isActive`/`ifActive`/`triggerDeprecationOrThrow`, `DisabledFeatures` in unit tests, and Twig's `feature()`.
- [Add more unit tests namespaces to FeatureFlag extension (6.7)](platform/dev/6.7/resources/references/adr/2024-07-31-add-more-unit-tests-namespaces-to-featureflag-extension.md) — plugins can allowlist their test namespace so major flags are active in their own PHPUnit suite.
- [Move flow execution after business process (6.7)](platform/dev/6.7/resources/references/adr/2025-01-31-move-flow-execution-after-business-process.md) — flow execution buffered and deferred, gated by `FLOW_EXECUTION_AFTER_BUSINESS_PROCESS`.

## Superseded mechanism ADRs (6.6, historical)

- [Feature flag system](platform/dev/6.6/resources/references/adr/_superseded/2020-08-10-feature-flag-system.md) — the original mechanism (flags declared in `feature.yaml`, referenced as `FEATURE_XXX_XXX`); superseded by the toggle-on-demand ADR above.
- [Handling feature flags](platform/dev/6.6/resources/references/adr/_superseded/2020-08-19-handling-feature-flags.md) — original rules for what must sit behind a flag (routes, entity definitions, services); superseded.
- [Deprecation strategy](platform/dev/6.6/resources/references/adr/_superseded/2021-01-21-deprecation-strategy.md) — original trunk-based deprecation workflow (major/minor flags, `FEATURE::triggerDeprecated`); superseded by the Backward Compatibility guideline above.

## Features that used flags

- [Stock (hosting config, 6.6)](platform/dev/6.6/guides/hosting/configurations/shopware/stock.md) — the `STOCK_HANDLING` flag for the rewritten stock system and `shopware.stock.enable_stock_management` to disable it.
- [Stock plugin area (6.6)](platform/dev/6.6/guides/plugins/plugins/content/stock/_index.md) — index for allocating/tracking product stock, gated behind `STOCK_HANDLING`.
- [Storefront accessibility (6.6)](platform/dev/6.6/resources/accessibility/storefront/_index.md) — rollout of WCAG 2.1 AA/BITV 2.0 changes behind `ACCESSIBILITY_TWEAKS`, on by default from v6.7.0.
- [Accessibility section overview (6.7)](platform/dev/6.7/guides/development/accessibility/_index.md) and [Storefront Accessibility (6.7)](platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md) — the current developer guide/checklist for the same `ACCESSIBILITY_TWEAKS`-gated rollout.
- [Remove the asterisk next to every price (6.6 ADR)](platform/dev/6.6/resources/references/adr/2025-01-01-remove-asterisk-next-to-every-price.md) — one concrete accessibility change gated by `ACCESSIBILITY_TWEAKS` until v6.7.0.
- [Document (v2) concept (6.7)](platform/dev/6.7/concepts/commerce/checkout-concept/document/_index.md) — the experimental Document System rework behind `DOCUMENT_GENERATION_REWORK`.
- [Documents plugin guide entry (6.7)](platform/dev/6.7/guides/plugins/plugins/checkout/documents/_index.md) — choose between the legacy document system and Document System v2.
- [Document System v2 plugin guides (6.7)](platform/dev/6.7/guides/plugins/plugins/checkout/documents/v2/_index.md) — index of v2-specific guides, still experimental in 6.7.

## Merchant

- [Insider Previews](platform/func/tutorials-and-faq/insider-previews.md) — merchant-facing Admin Help menu toggle (6.6.8.1-6.6.10.5) for trying beta features gated by the same flag mechanism, after enabling anonymized data sharing.
</content>
