---
id: platform/hubs/rule-builder.md
title: rule builder
summary: Rule Builder hub: rule system concepts, custom rule and app rule-condition guides, ADRs, and merchant rule usage for 6.6 and 6.7.
keywords: ["rule builder", "rule system", "Rule", "RuleScope", "custom rules", "shopware.rule.definition", "RuleConfig", "ScriptRule", "app rule conditions", "availability rule", "promotions", "dynamic access", "flow builder", "rules reference"]
members: [platform/dev/6.6/concepts/extensions/apps-concept.md, platform/dev/6.6/concepts/framework/rules.md, platform/dev/6.6/guides/plugins/apps/app-scripts/cart-manipulation.md, platform/dev/6.6/guides/plugins/apps/rule-builder/_index.md, platform/dev/6.6/guides/plugins/plugins/api/multi-inventory.md, platform/dev/6.6/guides/plugins/plugins/framework/_index.md, platform/dev/6.6/guides/plugins/plugins/framework/rule/_index.md, platform/dev/6.6/guides/plugins/plugins/framework/rule/add-custom-rules.md, platform/dev/6.6/products/community-edition.md, platform/dev/6.6/resources/guidelines/code/context-rules-rule-systems.md, platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md, platform/dev/6.6/resources/references/adr/2022-02-21-rule-scripting-in-apps.md, platform/dev/6.6/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md, platform/dev/6.6/resources/references/adr/2025-01-29-make-rule-classes-final.md, platform/dev/6.6/resources/references/core-reference/rules-reference.md, platform/dev/6.7/concepts/framework/rule-system/_index.md, platform/dev/6.7/concepts/framework/rule-system/rule-concepts.md, platform/dev/6.7/concepts/framework/rule-system/rule-evaluation.md, platform/dev/6.7/guides/development/troubleshooting/rules-reference.md, platform/dev/6.7/guides/plugins/apps/app-scripts/cart-manipulation.md, platform/dev/6.7/guides/plugins/apps/rule-builder/_index.md, platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md, platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-rule-between-operator.md, platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-rule-container.md, platform/dev/6.7/guides/plugins/plugins/architecture/context-rules-rule-systems.md, platform/dev/6.7/guides/plugins/plugins/framework/rule/_index.md, platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md, platform/dev/6.7/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.md, platform/dev/6.7/resources/references/adr/2021-11-02-preparing-data-for-rule-evaluation.md, platform/dev/6.7/resources/references/adr/2022-02-21-rule-scripting-in-apps.md, platform/dev/6.7/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md, platform/dev/6.7/resources/references/adr/2025-01-29-make-rule-classes-internal.md, platform/func/extensions/advanced-search.md, platform/func/extensions/cms-extensions.md, platform/func/extensions/customproducts.md, platform/func/extensions/dynamiccontent.md, platform/func/features/cms-rules.md, platform/func/features/dynamic-access.md, platform/func/features/multi-inventory.md, platform/func/features/rule-builder-preview.md, platform/func/features/share-rules.md, platform/func/marketing/promotions.md, platform/func/migration-en/magento-firststeps.md, platform/func/migration-en/magento-keywords.md, platform/func/migration-en/shopware-6-first-steps.md, platform/func/migration-en/what-is-migrated.md, platform/func/saas/payment.md, platform/func/settings/Business-Events.md, platform/func/settings/Flow-Builder.md, platform/func/settings/Paymentmethods.md, platform/func/settings/custom-fields.md, platform/func/settings/rules.md, platform/func/settings/shop/subscriptions.md, platform/func/settings/shop/warehouses.md, platform/func/settings/tags.md, platform/func/shopware-6-de/Catalogues/Dynamicproductgroups.md, platform/func/shopware-6-de/saas/Shipping.md, platform/func/tutorials-and-faq/dynamic-access-example-configuration.md, platform/func/tutorials-and-faq/flow-builder-example-flows.md, platform/func/tutorials-and-faq/payment-methods-for-several-countries.md, platform/func/tutorials-and-faq/promotions-example.md, platform/func/tutorials-and-faq/rule-builder-example-rules.md, platform/func/tutorials-and-faq/tags-examples.md]
lastBuilt: 2026-10-21
---

# Rule Builder

The Rule Builder is Shopware's condition system. A `Rule` is matched against a `RuleScope` (cart, line item, flow or checkout scope), and the result drives availability of payment and shipping methods, promotions, price matrices, CMS block visibility, Dynamic Access, Flow Builder conditions and more. Come to this hub when you need to add or change a rule condition (plugin or app), understand how rules are stored and evaluated, find the list of built-in rule classes, or tell a merchant how to configure rules. Developer pages are split by version (`dev/6.6`, `dev/6.7`). Merchant pages under `platform/func` are not versioned.

Version notes: the same topics exist in both developer versions, so pick the page matching the target version. Cart manipulation, the app Rule Builder index, rule scripting in apps, rule condition field abstraction and the plugin rule index each appear in both 6.6 and 6.7 as separate pages. The 6.6 ADR "Make Rule classes final" is covered in 6.7 as "Make Rule classes internal" (`@final` in 6.7; a few config-driven rules such as `ZipCodeRule` stay open). The rules reference is a core reference in 6.6 and a troubleshooting-section page in 6.7. Business Events are superseded by Flow Builder. The Advanced Search extension page is superseded by Advanced Search 2.0. Several merchant pages are plan-gated (Evolve, Rise, Beyond), as noted in their descriptions.

## Developer: 6.6

- [Apps](platform/dev/6.6/concepts/extensions/apps-concept.md) — app system overview: manifest, webhooks, Admin API.
- [Rules](platform/dev/6.6/concepts/framework/rules.md) — rule system concept: `Rule` objects matched against a `RuleScope`.
- [Cart manipulation](platform/dev/6.6/guides/plugins/apps/app-scripts/cart-manipulation.md) — app scripts on the cart hook, including rule-based gating.
- [Rule Builder](platform/dev/6.6/guides/plugins/apps/rule-builder/_index.md) — apps extending the Rule Builder with custom conditions.
- [Multi Inventory](platform/dev/6.6/guides/plugins/plugins/api/multi-inventory.md) — commercial Warehouse/WarehouseGroup entities and Admin API endpoints.
- [Framework](platform/dev/6.6/guides/plugins/plugins/framework/_index.md) — plugin Framework landing page including rules.
- [Rule](platform/dev/6.6/guides/plugins/plugins/framework/rule/_index.md) — plugin guide index for the Rule Builder.
- [Add custom rules](platform/dev/6.6/guides/plugins/plugins/framework/rule/add-custom-rules.md) — PHP `Rule` class tagged `shopware.rule.definition` plus an Administration component.
- [Community Edition](platform/dev/6.6/products/community-edition.md) — Community Edition components, mentions the rule builder.
- [Context Rules & Rule Systems](platform/dev/6.6/resources/guidelines/code/context-rules-rule-systems.md) — coding rules: no database queries in a rule.
- [Differentiator cluster for Shopware plugins or apps](platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md) — Store release criteria clusters.
- [Rule Scripting in apps](platform/dev/6.6/resources/references/adr/2022-02-21-rule-scripting-in-apps.md) — ADR: `ScriptRule` and `app_script_condition`.
- [Rule condition field abstraction](platform/dev/6.6/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md) — ADR: `Rule::getConfig()` returning `RuleConfig`.
- [Make Rule classes final](platform/dev/6.6/resources/references/adr/2025-01-29-make-rule-classes-final.md) — ADR: most Rule classes final, six exceptions.
- [Rules Reference](platform/dev/6.6/resources/references/core-reference/rules-reference.md) — catalogue of built-in rule condition classes.

## Developer: 6.7

- [Rule system](platform/dev/6.7/concepts/framework/rule-system/_index.md) — generic rule system overview and where it is used.
- [Rule concepts](platform/dev/6.7/concepts/framework/rule-system/rule-concepts.md) — `Rule::match()`, container rules, `RuleConfig`, `RuleConstraints`.
- [Rule evaluation](platform/dev/6.7/concepts/framework/rule-system/rule-evaluation.md) — storage as `rule`/`rule_condition`, `RuleValidator`, `CartRuleLoader`.
- [Rules Reference](platform/dev/6.7/guides/development/troubleshooting/rules-reference.md) — core rule classes plus B2B employee rules.
- [Cart Manipulation](platform/dev/6.7/guides/plugins/apps/app-scripts/cart-manipulation.md) — cart hook app scripts (6.7 counterpart).
- [Rule Builder](platform/dev/6.7/guides/plugins/apps/rule-builder/_index.md) — app `rule-conditions` in `manifest.xml`, evaluated by `ScriptRule`.
- [Add Custom Rule Conditions](platform/dev/6.7/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md) — `rule-condition` plus Twig script.
- [useRuleBetweenOperator()](platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-rule-between-operator.md) — admin composable for between operators.
- [useRuleContainer()](platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-rule-container.md) — admin composable for custom condition containers.
- [Rule System Extension Architecture](platform/dev/6.7/guides/plugins/plugins/architecture/context-rules-rule-systems.md) — mandatory rules for custom conditions.
- [Rule](platform/dev/6.7/guides/plugins/plugins/framework/rule/_index.md) — plugin guide index for rules.
- [Add Custom Rules](platform/dev/6.7/guides/plugins/plugins/framework/rule/add-custom-rules.md) — PHP rule plus `ruleConditionDataProviderService` registration.
- [Import ACL privileges from other roles](platform/dev/6.7/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.md) — ADR on admin privilege mapping; only tangentially tagged rule builder.
- [Preparing data for rule evaluation](platform/dev/6.7/resources/references/adr/2021-11-02-preparing-data-for-rule-evaluation.md) — ADR: rules use `RuleScope` data only.
- [Rule Scripting in apps](platform/dev/6.7/resources/references/adr/2022-02-21-rule-scripting-in-apps.md) — ADR, same topic as the 6.6 page.
- [Rule condition field abstraction](platform/dev/6.7/resources/references/adr/2022-05-23-rule-condition-field-abstraction.md) — ADR, same topic as the 6.6 page.
- [Make Rule classes internal](platform/dev/6.7/resources/references/adr/2025-01-29-make-rule-classes-internal.md) — ADR: core Rule classes closed to extension.

## Merchant

Rule Builder usage and features:

- [Rules](platform/func/settings/rules.md) — components, conditions, operators, preview, assignments, JSON export/import.
- [Rule Builder Preview](platform/func/features/rule-builder-preview.md) — test a rule against concrete orders.
- [Share Rules](platform/func/features/share-rules.md) — export and import rules between systems.
- [Cms Rules](platform/func/features/cms-rules.md) — show or hide content blocks by rule.
- [Dynamic Access](platform/func/features/dynamic-access.md) — restrict categories, products, variants, landing pages.
- [Multi Inventory](platform/func/features/multi-inventory.md) — warehouses and warehouse groups.
- [Warehouses](platform/func/settings/shop/warehouses.md) — warehouse settings (Beyond plan).
- [Subscriptions](platform/func/settings/shop/subscriptions.md) — recurring-order plans with Rule/Flow Builder triggers.
- [Promotions](platform/func/marketing/promotions.md) — Promotions module with Rule Builder conditions.
- [Payment](platform/func/saas/payment.md) — payment methods per sales channel.
- [Paymentmethods](platform/func/settings/Paymentmethods.md) — payment method settings and availability rules.
- [Shipping](platform/func/shopware-6-de/saas/Shipping.md) — shipping methods, availability rules, price matrices.
- [Dynamicproductgroups](platform/func/shopware-6-de/Catalogues/Dynamicproductgroups.md) — rule-based product groups.
- [Custom Fields](platform/func/settings/custom-fields.md) — custom field sets usable in rules.
- [Tags](platform/func/settings/tags.md) — tags used in rules and flows.
- [Flow Builder](platform/func/settings/Flow-Builder.md) — triggers, rule conditions, actions.
- [Business Events](platform/func/settings/Business-Events.md) — event-to-email assignments; superseded by Flow Builder.

Extensions:

- [Advanced Search](platform/func/extensions/advanced-search.md) — Evolve-plan search extension; superseded by Advanced Search 2.0.
- [Cms Extensions](platform/func/extensions/cms-extensions.md) — Evolve-plan CMS extension with rule-builder block visibility.
- [Customproducts](platform/func/extensions/customproducts.md) — Rise-plan product templates with options and surcharges.
- [Dynamiccontent](platform/func/extensions/dynamiccontent.md) — Evolve-plan Dynamic Access extension.

Tutorials:

- [Rule Builder Example Rules](platform/func/tutorials-and-faq/rule-builder-example-rules.md) — worked rules for shipping, payment, discounts.
- [Payment Methods For Several Countries](platform/func/tutorials-and-faq/payment-methods-for-several-countries.md) — billing country availability rule.
- [Promotions Example](platform/func/tutorials-and-faq/promotions-example.md) — promotion recipes.
- [Dynamic Access Example Configuration](platform/func/tutorials-and-faq/dynamic-access-example-configuration.md) — visibility by billing country or order count.
- [Flow Builder Example Flows](platform/func/tutorials-and-faq/flow-builder-example-flows.md) — sample flows.
- [Tags Examples](platform/func/tutorials-and-faq/tags-examples.md) — tag-based rules and groups.

Migration guides (Rule Builder mentioned as migrated or manually reviewed data):

- [Magento Firststeps](platform/func/migration-en/magento-firststeps.md) — Magento to Shopware 6 first steps.
- [Magento Keywords](platform/func/migration-en/magento-keywords.md) — Magento to Shopware terminology.
- [Shopware 6 First Steps](platform/func/migration-en/shopware-6-first-steps.md) — Shopware 6 to Shopware 6 migration.
- [What Is Migrated](platform/func/migration-en/what-is-migrated.md) — Shopware 5 to Shopware 6 migration.
