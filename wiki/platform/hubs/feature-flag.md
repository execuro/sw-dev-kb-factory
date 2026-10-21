---
id: platform/hubs/feature-flag.md
title: feature flag
summary: "Navigation for Shopware feature flags: major-version flags, toggling, SCSS checks, experimental annotations, and flag-gated features."
keywords: ["feature flag", "feature.yaml", "major version flag", "ACCESSIBILITY_TWEAKS", "STOCK_HANDLING", "DISABLE_VUE_COMPAT", "@experimental", "feature:enable", "Feature::isActive", "FLOW_EXECUTION_AFTER_BUSINESS_PROCESS", "DOCUMENT_GENERATION_REWORK", "deprecation"]
members: ["platform/dev/6.6/guides/hosting/configurations/shopware/stock.md", "platform/dev/6.6/guides/plugins/plugins/content/stock/_index.md", "platform/dev/6.6/resources/accessibility/storefront/_index.md", "platform/dev/6.6/resources/guidelines/code/backward-compatibility.md", "platform/dev/6.6/resources/references/adr/2022-01-05-add-feature-flag-support-for-storefront-scss.md", "platform/dev/6.6/resources/references/adr/2022-10-20-deprecation-handling-during-phpunit-test-execution.md", "platform/dev/6.6/resources/references/adr/2023-05-10-experimental-features.md", "platform/dev/6.6/resources/references/adr/2023-09-06-feature-property-for-experimental-anotation.md", "platform/dev/6.6/resources/references/adr/2023-11-29-toggle-feature-flag-on-demand.md", "platform/dev/6.6/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.md", "platform/dev/6.6/resources/references/adr/2025-01-01-remove-asterisk-next-to-every-price.md", "platform/dev/6.6/resources/references/adr/_superseded/2020-08-10-feature-flag-system.md", "platform/dev/6.6/resources/references/adr/_superseded/2020-08-19-handling-feature-flags.md", "platform/dev/6.6/resources/references/adr/_superseded/2021-01-21-deprecation-strategy.md", "platform/dev/6.7/guides/development/accessibility/_index.md", "platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md", "platform/dev/6.7/resources/references/adr/2022-01-05-add-feature-flag-support-for-storefront-scss.md", "platform/dev/6.7/resources/references/adr/2022-01-20-feature-flags-for-major-versions.md", "platform/dev/6.7/resources/references/adr/2023-05-10-experimental-features.md", "platform/dev/6.7/resources/references/adr/2023-09-06-feature-property-for-experimental-anotation.md", "platform/dev/6.7/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.md", "platform/dev/6.7/resources/references/adr/2025-01-31-move-flow-execution-after-business-process.md", "platform/func/tutorials-and-faq/documentv2.md"]
lastBuilt: 2026-10-21
---
# feature flag

Feature flags in Shopware hide unfinished or breaking code (declared in `feature.yaml`, activated via `.env`, checked with `Feature::isActive()` in PHP, `feature()` in Twig and SCSS), and several named flags gate specific features. Come here to find how flags are declared, toggled and tested, how they relate to `@experimental` and deprecation annotations, and which concrete flags exist (`STOCK_HANDLING`, `ACCESSIBILITY_TWEAKS`, `DISABLE_VUE_COMPAT`, `FLOW_EXECUTION_AFTER_BUSINESS_PROCESS`, `DOCUMENT_GENERATION_REWORK`).

Lifecycle notes: the three `_superseded` ADRs describe the original flag and deprecation workflow and are superseded by "Feature flags for major versions" (6.7). In 6.7.15.1, `ACCESSIBILITY_TWEAKS` and `DISABLE_VUE_COMPAT` are still declared but no code reads them; the changes they gated are the 6.7 default.

## Developer 6.7

- [Feature flags for major versions](platform/dev/6.7/resources/references/adr/2022-01-20-feature-flags-for-major-versions.md) — `v6.x.0.0` flags, `.env` toggling, `Feature` methods, Admin `flag`, config.xml `<flag>`.
- [Add feature flag support for Storefront SCSS](platform/dev/6.7/resources/references/adr/2022-01-05-add-feature-flag-support-for-storefront-scss.md) — `feature()` SCSS function and `$sw-features` map; near-duplicate of the 6.6 page, with a code check.
- [Experimental features](platform/dev/6.7/resources/references/adr/2023-05-10-experimental-features.md) — `@experimental stableVersion` and the BC promise; near-duplicate of 6.6, with a code check.
- [Add Feature property to `@experimental` annotation](platform/dev/6.7/resources/references/adr/2023-09-06-feature-property-for-experimental-anotation.md) — `feature:<ALL_CAPS>` property; notes the validator only requires `stableVersion`.
- [Disable Vue compat mode per component level](platform/dev/6.7/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.md) — `compatConfig: Shopware.compatConfig`; flag no longer read in 6.7.
- [Move flow execution after business process](platform/dev/6.7/resources/references/adr/2025-01-31-move-flow-execution-after-business-process.md) — `FLOW_EXECUTION_AFTER_BUSINESS_PROCESS` buffers flows until request, message or command end.
- [Accessibility](platform/dev/6.7/guides/development/accessibility/_index.md) — WCAG 2.1 AA responsibility and testing with `ACCESSIBILITY_TWEAKS`.
- [Storefront Accessibility](platform/dev/6.7/guides/development/accessibility/storefront-accessibility.md) — release approach, former opt-in flag, adapting `sw_extends` overrides, a11y testing.

## Developer 6.6

- [Make feature flags toggleable on demand](platform/dev/6.6/resources/references/adr/2023-11-29-toggle-feature-flag-on-demand.md) — `FeatureFlagRegistry`, Admin API routes, `bin/console feature:enable`, `feature:disable`, `feature:list`.
- [Add feature flag support for Storefront SCSS](platform/dev/6.6/resources/references/adr/2022-01-05-add-feature-flag-support-for-storefront-scss.md) — 6.6 copy of the SCSS `feature()` ADR.
- [Experimental features](platform/dev/6.6/resources/references/adr/2023-05-10-experimental-features.md) — 6.6 copy of the `@experimental` ADR.
- [Add Feature property to `@experimental` annotation](platform/dev/6.6/resources/references/adr/2023-09-06-feature-property-for-experimental-anotation.md) — 6.6 copy of the `feature` property ADR.
- [Disable Vue compat mode per component level](platform/dev/6.6/resources/references/adr/2024-03-11-disable-vue-compat-mode-per-component-level.md) — 6.6 copy; `DISABLE_VUE_COMPAT` activates the opt-out.
- [Remove the asterisk next to every price and replace it with actual text](platform/dev/6.6/resources/references/adr/2025-01-01-remove-asterisk-next-to-every-price.md) — price display change gated by `ACCESSIBILITY_TWEAKS` until v6.7.0.
- [Deprecation handling during PHPUnit test execution](platform/dev/6.6/resources/references/adr/2022-10-20-deprecation-handling-during-phpunit-test-execution.md) — `SYMFONY_DEPRECATIONS_HELPER`, `@DisableFeatures` replacing `@ActiveFeatures`.
- [Backward Compatibility](platform/dev/6.6/resources/guidelines/code/backward-compatibility.md) — `@deprecated`, `@feature-deprecated`, `@major-deprecated`, `@internal` rules.
- [Storefront](platform/dev/6.6/resources/accessibility/storefront/_index.md) — 6.6 accessibility rollout behind `ACCESSIBILITY_TWEAKS`, default in v6.7.0.
- [Stock](platform/dev/6.6/guides/hosting/configurations/shopware/stock.md) — `STOCK_HANDLING` and `shopware.stock.enable_stock_management`.
- [Stock](platform/dev/6.6/guides/plugins/plugins/content/stock/_index.md) — plugin-area index for stock allocation under `STOCK_HANDLING`.

## Developer 6.6, superseded ADRs

- [Feature flag system](platform/dev/6.6/resources/references/adr/_superseded/2020-08-10-feature-flag-system.md) — original `feature.yaml` declaration, `FEATURE_XXX_XXX` naming.
- [Handling feature flags](platform/dev/6.6/resources/references/adr/_superseded/2020-08-19-handling-feature-flags.md) — what must sit behind a flag: routes, definitions, services.
- [Deprecation strategy](platform/dev/6.6/resources/references/adr/_superseded/2021-01-21-deprecation-strategy.md) — trunk-based minor vs major workflow and annotations.

## Merchant

- [Documentv2](platform/func/tutorials-and-faq/documentv2.md) — enable `DOCUMENT_GENERATION_REWORK` in `.env`, configure and create order documents.
