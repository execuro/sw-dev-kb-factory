---
id: platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md
title: Custom Data Fields
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/custom-data/custom-fields.html
sourceHash: f7500b57aa133456475c48b4d05975f32eca64e7
codeCheckedAgainst: "6.7.13.0"
keywords: ["Resources/config/custom-fields.xml", "custom-field-set", "related-entities", "custom-fields-1.0.xsd", "manifest.xml", "custom fields", "app custom fields", "zusatzfelder", "field set", "placeholder", "steps", "vendor prefix", "deprecation"]
summary: Apps register custom field sets in Resources/config/custom-fields.xml (since 6.7.13.0); inline manifest.xml custom fields are deprecated until 6.8.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/resources/references/app-reference/manifest-reference.md", "platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md", "platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md"]
---
## What it is

How an app adds custom fields (organised in custom field sets) to existing Shopware records, editable by users in the Administration. Since 6.7.13.0 the sets are defined in a dedicated `Resources/config/custom-fields.xml` file of the app; the same file format exists for [plugins](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md).

## When to use

Your app needs to store extra scalar data on core entities (products, customers, orders …) rather than a new entity. For general custom field concepts see [custom fields](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md).

## Key steps / config

1. Create `Resources/config/custom-fields.xml` in the app (root element `<custom-fields>`, validated against the core `custom-fields-1.0.xsd`). It is read on app install and update.
2. Declare one or more `<custom-field-set>` elements with:
   - `name` — technical set name (unique within the file; use a vendor prefix)
   - `label` — translatable, repeatable with `lang`
   - `related-entities` — the entities the set is attached to
   - `fields` — the field definitions
   - optional attribute `global` (default `false`)
   ```xml
   <custom-fields>
     <custom-field-set>
       <name>swag_example_set</name>
       <label>…</label>
       <related-entities>…</related-entities>
       <fields>…</fields>
     </custom-field-set>
   </custom-fields>
   ```
3. Field element types: `int`, `float`, `text`, `text-area`, `bool`, `datetime`, `single-select`, `multi-select`, `single-entity-select`, `multi-entity-select`, `color-picker`, `media-selection`, `price`. Each needs a `name` attribute; common children are `label`, `help-text`, `required`, `position`, `allow-customer-write`, `allow-cart-expose`, `include-in-search`.
4. Type-specific properties, e.g. a float field:
   ```xml
   <float name="swag_test_float_field">
       <label>Test float field</label>
       <label lang="de-DE">Test-Kommazahlenfeld</label>
       <help-text>This is an float field.</help-text>
       <position>2</position>
       <placeholder>Enter an float...</placeholder>
       <min>0.5</min>
       <max>1.6</max>
       <steps>0.2</steps>
   </float>
   ```
   For `float`, `steps` defaults to `0.1`; for `int`, to `1`.

## Essential identifiers

- `Resources/config/custom-fields.xml`
- `<custom-field-set>`, `name`, `label`, `related-entities`, `fields`
- `placeholder`, `min`, `max`, `steps`

## Gotchas

- Custom field names are global: prefix both the set name and every field name with a vendor prefix (e.g. `swag`).
- When both `Resources/config/custom-fields.xml` and an inline `<custom-fields>` section in `manifest.xml` exist, the separate file wins and the inline section is ignored.
- Only an inline definition present: a deprecation is triggered (or an exception, depending on the deprecation mode).

## Version notes

- 6.7.13.0: `Resources/config/custom-fields.xml` introduced for apps; inline `<custom-fields>` in `manifest.xml` deprecated, to be removed in 6.8.0.0. Full manifest structure: [Manifest reference](platform/dev/6.7/resources/references/app-reference/manifest-reference.md).

## Code check (6.7.13.0)
- confirmed `custom-fields.xml` — Resources/config file preferred over inline manifest definition — vendor/shopware/core/Framework/App/Lifecycle/Handler/CustomFieldLifecycleHandler.php:38
- deprecated `inline custom-fields` — manifest element marked for removal in v6.8.0 — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:68
- confirmed `triggerDeprecationOrThrow` — fired only when the inline manifest definition is used — vendor/shopware/core/Framework/App/Lifecycle/Handler/CustomFieldLifecycleHandler.php:43
- confirmed `custom-fields-1.0.xsd` — schema used by CustomFieldXmlLoader — vendor/shopware/core/System/CustomField/CustomFieldXmlLoader.php:15
- confirmed `custom-field-set` — set name unique per file — vendor/shopware/core/System/CustomField/Schema/custom-fields-1.0.xsd:6
- confirmed `related-entities` — child of custom-field-set — vendor/shopware/core/System/CustomField/Schema/custom-fields-1.0.xsd:18
- confirmed `global` — custom-field-set attribute, default false — vendor/shopware/core/System/CustomField/Schema/custom-fields-1.0.xsd:21
- confirmed `steps` — float type, default 0.1 — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:325
- confirmed `placeholder` — translatable float/int property — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:324
