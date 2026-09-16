---
id: platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md
title: Add Plugin Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.html
sourceHash: 008bbb27d32f4a2c520dc7745ed956b64aa25623
codeCheckedAgainst: "6.7.13.0"
keywords: ["config.xml", "config.xsd", "input-field", "card", "component", "cache-relevant", "defaultValue", "sw-entity-single-select", "sw-media-field", "system config", "plugin settings", "plugin configuration", "ConfigReader"]
summary: "Plugin config.xml: cards, input-field types, cache-relevant attribute, defaultValue, options and allowed admin components, checked against config.xsd."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/use-plugin-configuration.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

A plugin defines its Administration configuration page declaratively in `src/Resources/config/config.xml`. Shopware renders it dynamically — no custom Administration module needed — and stores values in the system config.

## When to use

When a plugin needs merchant-editable settings. To read the values in code, see [Use plugin configuration](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/use-plugin-configuration.md).

## Key steps / config

1. Create `<plugin root>/src/Resources/config/config.xml` with the schema location set (enables IDE auto-completion):

```xml
<config xmlns:xsi="…XMLSchema-instance"
        xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/SystemConfig/Schema/config.xsd">
    <card>
        <title>Minimal configuration</title>
        <title lang="de-DE">…</title>
        <input-field type="bool" cache-relevant="true">
            <name>showBadge</name>
            <label>…</label>
            <defaultValue>true</defaultValue>
        </input-field>
    </card>
</config>
```

2. **Cards**: `<config>` needs at least one `<card>`; organise fields in cards, each with a `<title>`.
3. **Translatable elements** (`<title>`, `<label>`, `<placeholder>`, `<helpText>`, option `<name>`) take a `lang` attribute, default `en-GB`, pattern `xx-XX`.
4. **`<input-field>`**: `<name>` must be the first child; it is the technical key, unique across all input fields, pattern `[a-zA-Z][a-zA-Z0-9]*`.
5. **`type` attribute** (default `text`): `text`, `textarea`, `text-editor`, `url`, `password`, `int`, `float`, `bool`, `checkbox`, `datetime`, `date`, `time`, `colorpicker`, `single-select`, `multi-select`, `price`.
6. **Field settings** after `<name>`:
   - `<label>`, `<placeholder>`, `<helpText>` — translatable.
   - `<defaultValue>` — imported into the database on plugin install and update; cast via `Symfony\Component\Config\Util\XmlUtils`.
   - `<disabled>`, `<required>`, `<copyable>` — boolean only; `copyable` for `text` and its extensions.
   - `<minLength>`/`<maxLength>` for `text`, `url`, `password`; `<min>`/`<max>` for `int`, `float`.
   - `<options>` for `single-select`/`multi-select`: each `<option>` has an `<id>` and one or more `<name>`.
7. **`cache-relevant="true"`** (on `<input-field>` or `<component>`) marks a value that changes cached Storefront output; saving it triggers the broader system-config cache invalidation for the sales channel. Leave it unset for credentials, internal values, timestamps.
8. **Advanced `<component name="…">`**: `name` attribute is required and must match an Administration component; `<name>` first, all other child elements are passed as props. Supported: `sw-entity-single-select`, `sw-entity-multi-id-select`, `sw-media-field`, `sw-text-editor`, `sw-snippet-field`.

```xml
<component name="sw-entity-single-select">
    <name>exampleMailTemplate</name>
    <entity>mail_template</entity>
    <label-property>description</label-property>
</component>
```

9. Enter values in the Administration under **Extensions → My extensions → Plugins → Configure**, tab **Configuration**.

## Essential identifiers

- `src/Resources/config/config.xml`
- `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/SystemConfig/Schema/config.xsd`
- `<card>`, `<input-field>`, `<component>`, `<options>`/`<option>`
- `cache-relevant`, `defaultValue`, `disabled`, `required`, `copyable`, `minLength`, `maxLength`, `min`, `max`, `label-property`
- `Shopware\Core\System\SystemConfig\Util\ConfigReader`
- `Shopware\Core\Content\MailTemplate\MailTemplateDefinition`

## Gotchas

- The docs state a field `<name>` must be at least 4 characters; the installed `config.xsd` only enforces the pattern `[a-zA-Z][a-zA-Z0-9]*`, with no length restriction.
- `sw-entity-single-select` shows the entity `name` by default; entities without one (e.g. `mail_template`) need `<label-property>` (here `description`), otherwise the select stays empty.
- `sw-snippet-field` does not write system config; it edits translations for the given `<snippet>` key.
- Marking many fields `cache-relevant` turns routine saves into broad cache invalidations.
- The schema also accepts `type="price"`, which the docs table does not list.

## Version notes

- `cache-relevant` exists since 6.7.12.0. From 6.8.0.0, system config writes no longer invalidate caches by default, so fields affecting cached Storefront output need the attribute.
- `sw-snippet-field` is available from 6.3.4.0.

## Code check (6.7.13.0)
- confirmed `card` — config root requires at least one card — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:6
- confirmed `cache-relevant` — boolean attribute on input-field and component — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:39
- confirmed `cacheRelevant` — attribute parsed by ConfigReader — vendor/shopware/core/System/SystemConfig/Util/ConfigReader.php:213
- corrected `name` — docs: at least 4 characters; XSD has pattern only — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:86
- corrected `price` — docs: type list omits price; XSD enumerates it — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:58
- confirmed `uniqueInputFieldName` — input-field names unique across cards — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:9
- confirmed `defaultValue` — parsed with type-aware casting — vendor/shopware/core/System/SystemConfig/Util/ConfigReader.php:245
- confirmed `copyable` — copyable/disabled/required parsed as booleans — vendor/shopware/core/System/SystemConfig/Util/ConfigReader.php:324
- confirmed `SystemConfigService::savePluginConfiguration()` — writes plugin config defaults, called on install/update — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:373
- confirmed `sw-entity-single-select` — in allowed component list of ConfigValidator — vendor/shopware/core/Framework/App/Validation/ConfigValidator.php:19
