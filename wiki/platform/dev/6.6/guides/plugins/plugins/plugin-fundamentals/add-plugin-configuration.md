---
id: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md
title: Add plugin configuration
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceHash: 9839d5cdc55344c359020e675aae453b9a98484a
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.html
keywords: ["config.xml", "plugin configuration", "card", "input-field", "component", "sw-entity-single-select", "sw-entity-multi-id-select", "sw-media-field", "sw-text-editor", "sw-snippet-field", "ConfigValidator", "defaultValue", "single-select", "multi-select"]
summary: "Defines plugin config pages via a config.xml with card/input-field elements rendered in the Administration."
lastBuilt: "2026-09-15"
---
## What it is

A guide on creating a plugin configuration page rendered in the Administration by declaring a `config.xml` file, without templating knowledge.

## When to use

Use this to expose merchant-editable settings for a plugin (text fields, selects, media pickers, etc.) without building a custom admin module.

## Key steps / config

1. Create `Resources/config/config.xml` at the plugin root:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/SystemConfig/Schema/config.xsd">
    <card>
        <title>Minimal configuration</title>
        <input-field>
            <name>example</name>
        </input-field>
    </card>
</config>
```

2. Each `<card>` needs one `<title>` and at least one `<input-field>`. Titles/labels/help texts are translatable via a `lang` attribute (default `en-GB`).
3. `<input-field>` requires a `<name>` (unique, min. 4 chars, regex `[a-zA-Z][a-zA-Z0-9]*`); `type` controls rendering: `text`, `textarea`, `text-editor`, `url`, `password`, `int`, `float`, `bool`, `checkbox`, `datetime`, `date`, `time`, `colorpicker`, `single-select`, `multi-select`. Common settings: `label`, `placeholder`, `helpText`, `defaultValue`, `disabled`, `required`, `copyable`, `minLength`/`maxLength`, `min`/`max`, `options`.
4. For advanced fields, use `<component name="componentName">`, e.g.:

```xml
<component name="sw-entity-single-select">
    <name>exampleProduct</name>
    <entity>product</entity>
    <label>Choose a product for the plugin configuration</label>
</component>
```

Supported components (per the `ConfigValidator` class): `sw-entity-single-select`, `sw-entity-multi-id-select`, `sw-media-field`, `sw-text-editor`, `sw-snippet-field`.

## Essential identifiers

- `config.xml` schema: `xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/SystemConfig/Schema/config.xsd"`
- `<card>`, `<title>`, `<input-field>`, `<name>`, `<component name="...">`
- `sw-entity-single-select`, `sw-entity-multi-id-select`, `sw-media-field`, `sw-text-editor`, `sw-snippet-field`

## Gotchas

`<disabled>`, `<required>` and `<copyable>` only accept boolean values; the `sw-snippet-field` component (available from 6.3.4.0 onward) does not store values in system config but changes snippet translations instead.

## Version notes

The `sw-snippet-field` component is only available from Shopware 6.3.4.0 onward.
