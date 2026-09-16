---
id: platform/hubs/rule-builder.md
title: rule builder
summary: "Rule Builder: core Rule/RuleScope system, app/plugin extension points, and merchant-facing conditions across settings and features."
keywords: ["rule builder", "rule system", "RuleScope", "custom rule", "conditions", "rule conditions", "flow builder", "dynamic access", "promotions", "shipping methods", "payment methods", "warehouses", "cart manipulation", "app scripts"]
members: ["platform/dev/6.6/concepts/extensions/apps-concept.md", "platform/dev/6.6/concepts/framework/rules.md", "platform/dev/6.6/guides/plugins/apps/app-scripts/cart-manipulation.md", "platform/dev/6.6/guides/plugins/apps/rule-builder/_index.md", "platform/dev/6.6/guides/plugins/plugins/api/multi-inventory.md", "platform/dev/6.6/guides/plugins/plugins/framework/_index.md", "platform/dev/6.6/guides/plugins/plugins/framework/rule/_index.md", "platform/dev/6.6/guides/plugins/plugins/framework/rule/add-custom-rules.md", "platform/dev/6.6/products/community-edition.md", "platform/dev/6.6/resources/guidelines/code/context-rules-rule-systems.md", "platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md", "platform/dev/6.6/resources/references/adr/2022-02-21-rule-scripting-in-apps.md", "platform/dev/6.6/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md", "platform/dev/6.6/resources/references/adr/2025-01-29-make-rule-classes-final.md", "platform/dev/6.6/resources/references/core-reference/rules-reference.md", "platform/dev/6.7/concepts/framework/rule-system/_index.md", "platform/dev/6.7/concepts/framework/rule-system/rule-concepts.md", "platform/dev/6.7/guides/development/troubleshooting/rules-reference.md", "platform/dev/6.7/guides/plugins/apps/app-scripts/cart-manipulation.md", "platform/dev/6.7/guides/plugins/apps/rule-builder/_index.md", "platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md", "platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/add-rule-assignment-configuration.md", "platform/dev/6.7/guides/plugins/plugins/architecture/context-rules-rule-systems.md", "platform/dev/6.7/guides/plugins/plugins/framework/rule/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md", "platform/dev/6.7/resources/references/adr/2021-11-02-preparing-data-for-rule-evaluation.md", "platform/dev/6.7/resources/references/adr/2022-02-21-rule-scripting-in-apps.md", "platform/dev/6.7/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md", "platform/dev/6.7/resources/references/adr/2025-01-29-make-rule-classes-internal.md", "platform/func/catalogues/products.md", "platform/func/extensions/advanced-search.md", "platform/func/extensions/cms-extensions.md", "platform/func/extensions/customproducts.md", "platform/func/extensions/dynamiccontent.md", "platform/func/features/cms-rules.md", "platform/func/features/dynamic-access.md", "platform/func/features/multi-inventory.md", "platform/func/features/rule-builder-preview.md", "platform/func/features/share-rules.md", "platform/func/marketing/promotions.md", "platform/func/migration-en/magento-firststeps.md", "platform/func/migration-en/magento-keywords.md", "platform/func/migration-en/shopware-6-first-steps.md", "platform/func/migration-en/what-is-migrated.md", "platform/func/saas/payment.md", "platform/func/settings/Business-Events.md", "platform/func/settings/Flow-Builder.md", "platform/func/settings/Paymentmethods.md", "platform/func/settings/custom-fields.md", "platform/func/settings/rules.md", "platform/func/settings/shop/subscriptions.md", "platform/func/settings/shop/warehouses.md", "platform/func/settings/tags.md", "platform/func/shopware-6-de/Catalogues/Dynamicproductgroups.md", "platform/func/shopware-6-de/saas/Shipping.md", "platform/func/shopware-services/bundles.md", "platform/func/tutorials-and-faq/dynamic-access-example-configuration.md", "platform/func/tutorials-and-faq/flow-builder-example-flows.md", "platform/func/tutorials-and-faq/payment-methods-for-several-countries.md", "platform/func/tutorials-and-faq/promotions-example.md", "platform/func/tutorials-and-faq/rule-builder-example-rules.md", "platform/func/tutorials-and-faq/tags-examples.md"]
lastBuilt: "2026-09-15"
---

Shopware's Rule Builder lets a `Rule` class match a `RuleScope` (sales channel, customer
group, line items, cart amount, checkout) to drive availability, pricing, content
visibility and automation across the platform. Come here instead of grepping directly when
you need to trace how a condition on the Admin UI's Rule Builder maps to core `Rule`
classes, how apps/plugins add custom conditions, or which merchant-facing feature
(promotions, shipping, payment methods, dynamic access, flows) consumes a rule.

## Developer — 6.6

- [Apps](platform/dev/6.6/concepts/extensions/apps-concept.md) — the app system (manifest, webhooks, Admin API) that can extend the Rule Builder.
- [Rules](platform/dev/6.6/concepts/framework/rules.md) — core concept: `Rule` objects matched against `RuleScope` to drive cart behavior.
- [Cart manipulation](platform/dev/6.6/guides/plugins/apps/app-scripts/cart-manipulation.md) — app-script cart hook, including rule-based gating of cart mutations.
- [Rule Builder](platform/dev/6.6/guides/plugins/apps/rule-builder/_index.md) — apps extending the Rule Builder with custom conditions/actions.
- [Multi Inventory](platform/dev/6.6/guides/plugins/plugins/api/multi-inventory.md) — commercial Warehouse/WarehouseGroup feature integrating with the Rule builder for stock rules.
- [Framework](platform/dev/6.6/guides/plugins/plugins/framework/_index.md) — plugin Framework landing page covering DAL, events, and rules.
- [Rule](platform/dev/6.6/guides/plugins/plugins/framework/rule/_index.md) — Rule Builder landing page for plugin developers.
- [Add custom rules](platform/dev/6.6/guides/plugins/plugins/framework/rule/add-custom-rules.md) — PHP `Rule` class registered as `shopware.rule.definition`, plus admin condition component.
- [Community Edition](platform/dev/6.6/products/community-edition.md) — product overview naming the rule builder among core CE features.
- [Context Rules & Rule Systems](platform/dev/6.6/resources/guidelines/code/context-rules-rule-systems.md) — coding guideline: no DB queries in a rule, scope-only data access.
- [Differentiator cluster for Shopware plugins or apps](platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md) — Store release criteria referencing the Rule Builder as a differentiator.
- [Rule Scripting in apps](platform/dev/6.6/resources/references/adr/2022-02-21-rule-scripting-in-apps.md) — ADR: generic `ScriptRule` backed by `app_script_condition` and manifest constraints.
- [Rule condition field abstraction](platform/dev/6.6/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md) — ADR: `Rule::getConfig()`/`RuleConfig` for a generic admin condition component.
- [Make Rule classes final](platform/dev/6.6/resources/references/adr/2025-01-29-make-rule-classes-final.md) — ADR marking almost all core `Rule` classes final, six exceptions.
- [Rules Reference](platform/dev/6.6/resources/references/core-reference/rules-reference.md) — catalogue of built-in rule condition classes by domain.

## Developer — 6.7

- [Rule system](platform/dev/6.7/concepts/framework/rule-system/_index.md) — overview of the cross-domain rule system and the Admin Rule Builder.
- [Rule concepts](platform/dev/6.7/concepts/framework/rule-system/rule-concepts.md) — `Rule::match(RuleScope)`, container rules (And/Or/Not), operators, `RuleComparison`, `RuleConfig`, `RuleConstraints`.
- [Rules Reference](platform/dev/6.7/guides/development/troubleshooting/rules-reference.md) — condition classes by domain (cart, customer, container, date/time, currency, B2B); successor to the 6.6 core-reference page.
- [Cart Manipulation](platform/dev/6.7/guides/plugins/apps/app-scripts/cart-manipulation.md) — app-script `services.cart` API including rule-based checks; 6.7 counterpart of the 6.6 cart-manipulation guide.
- [Rule Builder](platform/dev/6.7/guides/plugins/apps/rule-builder/_index.md) — apps extending the Rule Builder via manifest-declared, Twig-scripted conditions; 6.7 counterpart of the 6.6 apps rule-builder page.
- [Add Custom Rule Conditions](platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md) — `rule-condition` in `manifest.xml`, constraint fields, boolean Twig scripts using `compare`.
- [Add Rule Assignment Configuration](platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/add-rule-assignment-configuration.md) — overriding `sw-settings-rule-detail-assignments` to add a custom assignment card.
- [Rule System Extension Architecture](platform/dev/6.7/guides/plugins/plugins/architecture/context-rules-rule-systems.md) — custom rule contract: deterministic, no DB/side effects, `CartRuleScope`/`LineItemScope`; 6.7 counterpart of the 6.6 guideline.
- [Rule](platform/dev/6.7/guides/plugins/plugins/framework/rule/_index.md) — Rule Builder landing page for plugins; 6.7 counterpart of the 6.6 page.
- [Add Custom Rules](platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md) — extending `Rule`, `shopware.rule.definition`, admin `addCondition`/awareness config; 6.7 counterpart of the 6.6 guide.
- [Preparing data for rule evaluation](platform/dev/6.7/resources/references/adr/2021-11-02-preparing-data-for-rule-evaluation.md) — ADR: rules read only `RuleScope` data; prefer `FkField`/`ManyToManyIdField` over extra Criteria associations.
- [Rule Scripting in apps](platform/dev/6.7/resources/references/adr/2022-02-21-rule-scripting-in-apps.md) — same ADR as the 6.6 copy (`ScriptRule`/`app_script_condition`).
- [Rule condition field abstraction](platform/dev/6.7/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md) — same ADR as the 6.6 copy (`RuleConfig`/`sw-condition-generic`).
- [Make Rule classes internal](platform/dev/6.7/resources/references/adr/2025-01-29-make-rule-classes-internal.md) — supersedes "Make Rule classes final": most core `Rule` classes are now closed/internal, not just final; only zip-code, line-item-type and promotion-code rules stay open.

## Merchant

- [Products](platform/func/catalogues/products.md) — product edit mask; advanced pricing tab uses the Rule Builder.
- [Advanced Search](platform/func/extensions/advanced-search.md) — Elasticsearch extension referencing Rule Builder-driven boosting; superseded by Advanced Search 2.0.
- [Cms Extensions](platform/func/extensions/cms-extensions.md) — Evolve-plan extension adding rule-builder block visibility to Shopping Experiences.
- [Customproducts](platform/func/extensions/customproducts.md) — Rise-plan product individualization with rule-builder-gated surcharges.
- [Dynamiccontent](platform/func/extensions/dynamiccontent.md) — Evolve-plan Dynamic Access extension hiding content via Rule Builder rules.
- [Cms Rules](platform/func/features/cms-rules.md) — Rule Builder controlling visibility of shop content blocks.
- [Dynamic Access](platform/func/features/dynamic-access.md) — Rule Builder restricting categories/products/variants/landing pages by customer group.
- [Multi Inventory](platform/func/features/multi-inventory.md) — multi-warehouse stock feature using the Rule Builder for availability; merchant counterpart of the 6.6 dev Multi Inventory guide.
- [Rule Builder Preview](platform/func/features/rule-builder-preview.md) — preview mode for testing a rule against concrete orders.
- [Share Rules](platform/func/features/share-rules.md) — exporting/importing Rule Builder rules between systems via JSON.
- [Promotions](platform/func/marketing/promotions.md) — Promotions module conditions configured through the Rule Builder.
- [Magento Firststeps](platform/func/migration-en/magento-firststeps.md) — Magento migration guide noting Rule Builder as a manual-review area.
- [Magento Keywords](platform/func/migration-en/magento-keywords.md) — Magento-to-Shopware terminology including Rule Builder mapping.
- [Shopware 6 First Steps](platform/func/migration-en/shopware-6-first-steps.md) — Shopware-to-Shopware migration overview; Rule Builder rules are migrated data.
- [What Is Migrated](platform/func/migration-en/what-is-migrated.md) — Shopware 5→6 migration; Rule Builder-related manual mapping notes.
- [Payment](platform/func/saas/payment.md) — assigning payment methods per sales channel using Rule Builder availability rules.
- [Business Events](platform/func/settings/Business-Events.md) — legacy event-to-email mapping with optional Rule Builder conditions; superseded by Flow Builder.
- [Flow Builder](platform/func/settings/Flow-Builder.md) — automation triggers/conditions/actions, condition step powered by the Rule Builder.
- [Paymentmethods](platform/func/settings/Paymentmethods.md) — configuring payment methods including Rule Builder availability rules.
- [Custom Fields](platform/func/settings/custom-fields.md) — custom field sets usable as Rule Builder conditions.
- [Rules](platform/func/settings/rules.md) — the Rule Builder itself: components, conditions, operators, preview mode, assignments, sharing.
- [Subscriptions](platform/func/settings/shop/subscriptions.md) — recurring-order subscriptions using Rule/Flow Builder triggers.
- [Warehouses](platform/func/settings/shop/warehouses.md) — warehouse groups feeding Rule Builder-based availability.
- [Tags](platform/func/settings/tags.md) — tag management referenced by Rule Builder/Flow Builder conditions.
- [Dynamicproductgroups](platform/func/shopware-6-de/Catalogues/Dynamicproductgroups.md) — dynamic product groups built from Rule Builder conditions.
- [Shipping](platform/func/shopware-6-de/saas/Shipping.md) — shipping methods with Rule Builder availability rules and price matrices.
- [Bundles](platform/func/shopware-services/bundles.md) — Product Bundles feature with Rule Builder-driven bundle item rules.
- [Dynamic Access Example Configuration](platform/func/tutorials-and-faq/dynamic-access-example-configuration.md) — worked Rule Builder examples for Dynamic Access.
- [Flow Builder Example Flows](platform/func/tutorials-and-faq/flow-builder-example-flows.md) — sample flows combining Flow Builder actions with Rule Builder conditions.
- [Payment Methods For Several Countries](platform/func/tutorials-and-faq/payment-methods-for-several-countries.md) — how-to using the billing-country Rule Builder condition for geoblocking.
- [Promotions Example](platform/func/tutorials-and-faq/promotions-example.md) — worked promotion examples using Rule Builder conditions.
- [Rule Builder Example Rules](platform/func/tutorials-and-faq/rule-builder-example-rules.md) — worked Rule Builder examples for shipping, payment, and cart-value rules.
- [Tags Examples](platform/func/tutorials-and-faq/tags-examples.md) — worked tag examples including Rule Builder/Flow Builder combinations.
</content>
