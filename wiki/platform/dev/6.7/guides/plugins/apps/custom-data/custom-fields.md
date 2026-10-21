---
id: platform/dev/6.7/guides/plugins/apps/custom-data/custom-fields.md
title: Custom Data Fields
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/custom-data/custom-fields.html
sourceHash: f7500b57aa133456475c48b4d05975f32eca64e7
codeCheckedAgainst: "6.7.15.1"
keywords: ["custom fields", "custom-fields.xml", "Resources/config/custom-fields.xml", "custom-field-set", "related-entities", "manifest.xml", "custom-fields", "app custom fields", "vendor prefix", "float field", "zusatzfelder", "custom field set"]
summary: "App custom field sets: define in Resources/config/custom-fields.xml (since 6.7.13.0); inline manifest custom-fields is deprecated, removed in 6.8."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/resources/references/app-reference/manifest-reference.md", "platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md", "platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md"]
---
## What it is

How an app registers custom field sets so that extra fields appear on existing data records and can be edited in the Administration. Custom fields are organised in sets (see [custom fields](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/_index.md)).

## When to use

When an app needs to attach simple additional values to core entities (e.g. products, orders) rather than defining a new entity.

## Key steps / config

1. Create `Resources/config/custom-fields.xml` at the root of the app (available since 6.7.13.0). The content of `<custom-fields>` has the same format as the old inline manifest section. The same file format exists for [plugins](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md).
2. Define one or more `<custom-field-set>` elements with:
   - `name` — technical name of the set
   - `label` — set label, translatable via `lang`
   - `related-entities` — entities the set is used on
   - `fields` — the field definitions
3. Configure field properties inside `<fields>`, e.g. a float field:

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

   Common elements for all field types in the schema: `label`, `help-text`, `required`, `position`, `allow-customer-write`, `allow-cart-expose`, `include-in-search`. Float `steps` defaults to `0.1`.
4. Install or update the app; the lifecycle reads `Resources/config/custom-fields.xml` if present.

## Essential identifiers

- `Resources/config/custom-fields.xml`, `<custom-fields>`
- `<custom-field-set>`: `name`, `label`, `related-entities`, `fields`
- field type `<float>` with `placeholder`, `min`, `max`, `steps`

## Gotchas

- Custom field and set names are global: always use a vendor prefix (e.g. `swag_`) on the set name and on every field name.
- If both `Resources/config/custom-fields.xml` and an inline `<custom-fields>` section in `manifest.xml` exist, the separate file wins; inline-only triggers a deprecation.
- The step element is named `steps` (plural).

## Version notes

- 6.7.13.0: `Resources/config/custom-fields.xml` introduced; inline `<custom-fields>` in `manifest.xml` deprecated, to be removed in 6.8.0.0. Full manifest structure: [Manifest reference](platform/dev/6.7/resources/references/app-reference/manifest-reference.md).

## Code check (6.7.15.1)
- confirmed `custom-fields.xml` — app lifecycle prefers `Resources/config/custom-fields.xml` — vendor/shopware/core/Framework/App/Lifecycle/Handler/CustomFieldLifecycleHandler.php:38
- confirmed `Feature::triggerDeprecationOrThrow()` — inline manifest custom fields deprecated for v6.8.0.0 — vendor/shopware/core/Framework/App/Lifecycle/Handler/CustomFieldLifecycleHandler.php:43
- confirmed `custom-fields` — inline element still accepted in manifest schema — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:69
- confirmed `custom-field-set` — set element in standalone schema — vendor/shopware/core/System/CustomField/Schema/custom-fields-1.0.xsd:14
- confirmed `related-entities` — set child element — vendor/shopware/core/System/CustomField/Schema/custom-fields-1.0.xsd:18
- confirmed `fields` — set child element — vendor/shopware/core/System/CustomField/Schema/custom-fields-1.0.xsd:19
- confirmed `float` — field type element — vendor/shopware/core/System/CustomField/Schema/custom-fields-1.0.xsd:26
- confirmed `steps` — float step element, default 0.1 — vendor/shopware/core/System/CustomField/Schema/custom-fields-1.0.xsd:68
- confirmed `placeholder` — float field element — vendor/shopware/core/System/CustomField/Schema/custom-fields-1.0.xsd:67
- confirmed `help-text` — common field element — vendor/shopware/core/System/CustomField/Schema/custom-fields-1.0.xsd:46
