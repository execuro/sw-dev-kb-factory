---
id: platform/dev/6.6/guides/plugins/apps/custom-data/custom-fields.md
title: Custom fields
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/custom-data/custom-fields.html
sourceHash: 389e1099736858772dcd26d240e731abcbdb27d0
keywords: ["custom fields", "custom field set", "manifest.xml", "related-entities", "vendor prefix", "float field", "placeholder", "min", "max", "steps", "Shopware Administration"]
summary: "Documents registering custom field sets and fields (e.g. float) in an app's manifest.xml, including naming and vendor-prefix rules."
lastBuilt: "2026-09-15"
---
## What it is

Custom fields let you add your own fields to existing Shopware data records; users can edit their values from within the Shopware Administration. Apps register their custom field sets in the manifest file.

## When to use

Use custom fields when your app needs to attach simple extra data to existing entities without creating new tables, and wants merchants to be able to edit that data in the Administration.

## Key steps / config

Custom fields are organised into sets, configured with:

- `name`: a technical name for the set
- `label`: label text, which can also carry per-language translations
- `related-entities`: the entities the set applies to
- `fields`: the field definitions themselves

A field element can carry further properties, e.g. a float field:

```html
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

## Essential identifiers

- `name`, `label`, `related-entities`, `fields` (custom field set)
- `<float>` field with `label`, `help-text`, `position`, `placeholder`, `min`, `max`, `steps`
- manifest custom field set registration

## Gotchas

Custom field and custom field set names are global, so they must always carry a vendor prefix (e.g. `swag` for "Shopware AG") to keep them unique — this applies both to the set name and to each field name.
