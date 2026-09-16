---
id: platform/hubs/custom-fields.md
title: "Custom fields"
summary: "Navigation hub for custom fields and custom entities across apps, plugins, storefront, migration and merchant docs."
keywords: ["custom fields", "custom field set", "custom data", "custom entities", "manifest.xml", "app system", "administration extension", "storefront custom fields", "data handling", "database migrations", "rule builder", "magento migration", "uninstallation", "differentiator cluster"]
members: ["platform/dev/6.6/guides/plugins/apps/administration/_index.md", "platform/dev/6.6/guides/plugins/apps/custom-data/_index.md", "platform/dev/6.6/guides/plugins/apps/custom-data/custom-fields.md", "platform/dev/6.6/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md", "platform/dev/6.6/guides/plugins/apps/starter/product-translator.md", "platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md", "platform/dev/6.6/guides/plugins/plugins/checkout/_index.md", "platform/dev/6.6/guides/plugins/plugins/framework/_index.md", "platform/dev/6.6/guides/plugins/plugins/framework/custom-field/_index.md", "platform/dev/6.6/guides/plugins/plugins/storefront/using-custom-fields-storefront.md", "platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md", "platform/dev/6.6/resources/guidelines/trouble-shoting.md", "platform/dev/6.6/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md", "platform/dev/6.6/resources/references/app-reference/manifest-reference.md", "platform/dev/6.7/guides/development/testing/store/installation-and-cleanup.md", "platform/dev/6.7/guides/plugins/apps/administration/_index.md", "platform/dev/6.7/guides/plugins/apps/custom-data/_index.md", "platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md", "platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md", "platform/dev/6.7/guides/plugins/plugins/database/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md", "platform/dev/6.7/guides/plugins/plugins/storefront/howto/using-custom-fields-storefront.md", "platform/dev/6.7/resources/references/adr/2020-09-08-custom-field-label-loading-in-storefront.md", "platform/func/migration-en/Migrationprocess.md", "platform/func/migration-en/magento-firststeps.md", "platform/func/migration-en/magento-keywords.md", "platform/func/settings/custom-fields.md", "platform/func/tutorials-and-faq/changing-a-template.md"]
lastBuilt: "2026-09-15"
---

This hub covers custom fields and custom entities: extra per-entity attributes stored on
core tables (or in fully custom entities), how apps and plugins register and consume them
via manifest files or PHP, how they surface in the Administration and Storefront, and
related lifecycle/migration/troubleshooting concerns. Come here instead of grepping
directly when the question spans more than one of: app manifest registration, plugin PHP
registration, Administration rendering, Storefront rendering, or migration/uninstall
handling of custom field data.

## Developer — Shopware 6.6

- [Administration](platform/dev/6.6/guides/plugins/apps/administration/_index.md) — apps extend the Administration only via manifest modules, custom fields, action buttons and CMS blocks.
- [Custom Data](platform/dev/6.6/guides/plugins/apps/custom-data/_index.md) — overview of custom fields vs. custom entities for apps.
- [Custom fields](platform/dev/6.6/guides/plugins/apps/custom-data/custom-fields.md) — registering custom field sets/fields inline in an app's manifest.xml.
- [Add custom rule conditions](platform/dev/6.6/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md) — app rule conditions in manifest.xml, including custom-field-backed conditions for the Rule Builder.
- [Starter Guide - Read and write data](platform/dev/6.6/guides/plugins/apps/starter/product-translator.md) — Symfony app-bundle tutorial reading/writing product data (custom fields included) via webhooks and the Admin API.
- [Using custom fields](platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md) — render an entity's custom fields in an Administration module via `sw-custom-field-set-renderer`.
- [Checkout](platform/dev/6.6/guides/plugins/plugins/checkout/_index.md) — checkout plugin guides overview, referencing custom fields among checkout customizations.
- [Framework](platform/dev/6.6/guides/plugins/plugins/framework/_index.md) — plugin Framework landing page listing custom fields alongside DAL, events, rules and flow builder.
- [Custom Fields](platform/dev/6.6/guides/plugins/plugins/framework/custom-field/_index.md) — landing page for adding custom fields to entities via Administration or API.
- [Add custom field in the storefront](platform/dev/6.6/guides/plugins/plugins/storefront/using-custom-fields-storefront.md) — render a custom field's value and translated snippet in Storefront templates/forms.
- [Differentiator cluster for Shopware plugins or apps](platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md) — Store release criteria that reference custom fields among other extension mechanisms.
- [Troubleshooting](platform/dev/6.6/resources/guidelines/trouble-shoting.md) — fixes for slow dynamic product groups and cache invalidation, including custom-field filters.
- [Implement app system inside platform](platform/dev/6.6/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md) — ADR migrating the app-system plugin into core, defining webhook/action-button/custom-field extension points.
- [Manifest Reference](platform/dev/6.6/resources/references/app-reference/manifest-reference.md) — full manifest.xml reference, including the custom fields section.

## Developer — Shopware 6.7

- [Uninstallation and data cleanup](platform/dev/6.7/guides/development/testing/store/installation-and-cleanup.md) — Store review rules for keeping vs. deleting custom fields and other data on uninstall.
- [Administration](platform/dev/6.7/guides/plugins/apps/administration/_index.md) — same extension model as 6.6 (modules, custom fields, action buttons, CMS blocks).
- [Custom Data](platform/dev/6.7/guides/plugins/apps/custom-data/_index.md) — overview of custom fields vs. custom entities for apps in 6.7.
- [Custom Data Fields](platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md) — since 6.7.13.0, apps register custom field sets in `Resources/config/custom-fields.xml`; inline manifest.xml registration (the 6.6 approach) is deprecated until 6.8.
- [Data Handling and Processing](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/_index.md) — index of Administration data-handling guides, including custom fields.
- [Using Custom Fields](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md) — 6.7 update of the `sw-custom-field-set-renderer` guide (same topic as the 6.6 version above, refreshed for current APIs).
- [Database](platform/dev/6.7/guides/plugins/plugins/database/_index.md) — plugin database overview covering migrations, including custom-field-related schema/media changes.
- [Framework](platform/dev/6.7/guides/plugins/plugins/framework/_index.md) — 6.7 Framework index listing custom fields alongside caching, DAL, events, rules and flow builder.
- [Custom Fields](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md) — landing page for custom fields as extra entity data.
- [Add Custom Field](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md) — add custom field support to a plugin entity via `EntityCustomFieldsTrait`/`CustomFields` and define sets via `custom-fields.xml` or repository.
- [Add Custom Field in the Storefront](platform/dev/6.7/guides/plugins/plugins/storefront/howto/using-custom-fields-storefront.md) — 6.7 version of the storefront custom-field rendering guide (moved under a `howto/` path vs. the 6.6 version above); also covers writing customer custom fields via `StoreApiCustomFieldMapper`.
- [CustomField label loading in storefront](platform/dev/6.7/resources/references/adr/2020-09-08-custom-field-label-loading-in-storefront.md) — ADR: on `custom_field.written`, a subscriber creates `customFields.<name>` snippets in every snippet set for Storefront display.

## Merchant

- [Migrationprocess](platform/func/migration-en/Migrationprocess.md) — preparing a Shopware 5 to 6 migration, including the connection settings that carry custom field data.
- [Magento Firststeps](platform/func/migration-en/magento-firststeps.md) — migrating a Magento shop, including how Magento attributes map to custom fields.
- [Magento Keywords](platform/func/migration-en/magento-keywords.md) — Magento-to-Shopware terminology dictionary, including the custom fields mapping.
- [Custom Fields](platform/func/settings/custom-fields.md) — merchant-facing reference for custom field sets, field types, storefront exposure and Store API visibility.
- [Changing A Template](platform/func/tutorials-and-faq/changing-a-template.md) — deriving a storefront theme and showing custom fields/snippets in overridden Twig templates.
</content>
