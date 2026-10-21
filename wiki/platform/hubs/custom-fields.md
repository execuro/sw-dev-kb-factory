---
id: platform/hubs/custom-fields.md
title: "custom fields"
summary: "Navigation for custom fields: plugin and app definitions, Administration and Storefront usage, label loading ADR, merchant setup."
keywords: ["custom fields", "custom field set", "custom-fields.xml", "manifest.xml", "custom_field_set", "sw-custom-field-set-renderer", "CustomFieldTypes", "app custom data", "storefront snippets", "entity extension", "zusatzfelder"]
members: ["platform/dev/6.6/guides/plugins/apps/administration/_index.md", "platform/dev/6.6/guides/plugins/apps/custom-data/_index.md", "platform/dev/6.6/guides/plugins/apps/custom-data/custom-fields.md", "platform/dev/6.6/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md", "platform/dev/6.6/guides/plugins/apps/starter/product-translator.md", "platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md", "platform/dev/6.6/guides/plugins/plugins/checkout/_index.md", "platform/dev/6.6/guides/plugins/plugins/framework/_index.md", "platform/dev/6.6/guides/plugins/plugins/framework/custom-field/_index.md", "platform/dev/6.6/guides/plugins/plugins/storefront/using-custom-fields-storefront.md", "platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md", "platform/dev/6.6/resources/guidelines/trouble-shoting.md", "platform/dev/6.6/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md", "platform/dev/6.6/resources/references/app-reference/manifest-reference.md", "platform/dev/6.7/guides/development/testing/store/installation-and-cleanup.md", "platform/dev/6.7/guides/plugins/apps/custom-data/_index.md", "platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md", "platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md", "platform/dev/6.7/guides/plugins/plugins/checkout/_index.md", "platform/dev/6.7/guides/plugins/plugins/database/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md", "platform/dev/6.7/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md", "platform/dev/6.7/resources/references/adr/2020-09-08-custom-field-label-loading-in-storefront.md", "platform/func/migration-en/Migrationprocess.md", "platform/func/migration-en/magento-firststeps.md", "platform/func/migration-en/magento-keywords.md", "platform/func/settings/custom-fields.md", "platform/func/tutorials-and-faq/changing-a-template.md"]
lastBuilt: 2026-10-21
---

Custom fields are extra typed data fields attached to entities such as products, customers or orders. They are grouped into custom field sets (the `custom_field_set` entity) and can be managed in the Administration or through the API. Come here when the question is about defining custom fields (plugin or app), rendering them in the Administration or Storefront, or how they are labelled and cleaned up. Many other members only mention custom fields as one topic among several; they are listed for completeness.

Lifecycle note for apps: in 6.7 the app custom field sets are defined in `Resources/config/custom-fields.xml` (since 6.7.13.0). The inline `custom-fields` section of `manifest.xml`, which the 6.6 pages describe, is deprecated and removed in 6.8.

## Developer: 6.7

Custom field definition (plugins)
- [Custom Fields](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md) — overview of typed custom fields and field types.
- [Add Custom Field](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md) — entity trait, `CustomFields` DAL field, JSON column, sets via `custom-fields.xml` or repository.
- [Framework](platform/dev/6.7/guides/plugins/plugins/framework/_index.md) — index of framework guides including custom fields.
- [Database](platform/dev/6.7/guides/plugins/plugins/database/_index.md) — migrations, including a media custom field case.

Custom field definition (apps)
- [Custom Data](platform/dev/6.7/guides/plugins/apps/custom-data/_index.md) — custom fields on core tables versus custom entities.
- [Custom Data Fields](platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md) — `custom-fields.xml`, vendor prefix, deprecation of the manifest variant.

Usage in Administration and Storefront
- [Data Handling and Processing](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/_index.md) — Administration data handling overview.
- [Using Custom Fields](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md) — `sw-custom-field-set-renderer` with the `custom_field_set` repository.
- [Checkout](platform/dev/6.7/guides/plugins/plugins/checkout/_index.md) — checkout plugin guides touching custom fields.

Reference and rules
- [CustomField label loading in storefront](platform/dev/6.7/resources/references/adr/2020-09-08-custom-field-label-loading-in-storefront.md) — ADR: labels as snippets `customFields.<technical name>`.
- [Implement app system inside platform](platform/dev/6.7/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md) — ADR listing custom fields as an app extension point.
- [Uninstallation and data cleanup](platform/dev/6.7/guides/development/testing/store/installation-and-cleanup.md) — Store rules for removing custom fields on uninstall.

## Developer: 6.6

- [Custom Fields](platform/dev/6.6/guides/plugins/plugins/framework/custom-field/_index.md) — landing page for plugin custom fields.
- [Framework](platform/dev/6.6/guides/plugins/plugins/framework/_index.md) — framework section index.
- [Custom Data](platform/dev/6.6/guides/plugins/apps/custom-data/_index.md) — app data storage overview.
- [Custom fields](platform/dev/6.6/guides/plugins/apps/custom-data/custom-fields.md) — field sets in the app `manifest.xml`.
- [Administration](platform/dev/6.6/guides/plugins/apps/administration/_index.md) — app Administration extension via manifest.
- [Add custom rule conditions](platform/dev/6.6/guides/plugins/apps/rule-builder/add-custom-rule-conditions.md) — app rule conditions.
- [Starter Guide - Read and write data](platform/dev/6.6/guides/plugins/apps/starter/product-translator.md) — Symfony app-bundle webhook tutorial.
- [Using custom fields](platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-custom-fields.md) — Administration rendering.
- [Add custom field in the storefront](platform/dev/6.6/guides/plugins/plugins/storefront/using-custom-fields-storefront.md) — Twig output and snippet labels.
- [Checkout](platform/dev/6.6/guides/plugins/plugins/checkout/_index.md) — checkout guides overview.
- [Manifest Reference](platform/dev/6.6/resources/references/app-reference/manifest-reference.md) — all `manifest.xml` sections.
- [Implement app system inside platform](platform/dev/6.6/resources/references/adr/2020-08-12-implement-app-system-inside-platform.md) — near-duplicate of the 6.7 ADR of the same name.
- [Differentiator cluster for Shopware plugins or apps](platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md) — Store release criteria.
- [Troubleshooting](platform/dev/6.6/resources/guidelines/trouble-shoting.md) — slow dynamic product groups and cache invalidation.

## Merchant

- [Custom Fields](platform/func/settings/custom-fields.md) — field sets, field types, Store API and cart exposure.
- [Changing A Template](platform/func/tutorials-and-faq/changing-a-template.md) — showing custom fields in themes and documents.
- [Migrationprocess](platform/func/migration-en/Migrationprocess.md) — Shopware 5 to 6 migration setup.
- [Magento Firststeps](platform/func/migration-en/magento-firststeps.md) — Magento migration and attribute mapping.
- [Magento Keywords](platform/func/migration-en/magento-keywords.md) — Magento to Shopware terminology.
