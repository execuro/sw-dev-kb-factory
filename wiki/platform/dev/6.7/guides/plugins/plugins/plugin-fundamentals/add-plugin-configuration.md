---
id: platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md
title: Add Plugin Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.html
sourceHash: 008bbb27d32f4a2c520dc7745ed956b64aa25623
codeCheckedAgainst: "6.7.15.1"
keywords: ["config.xml", "config.xsd", "input-field", "card", "component", "cache-relevant", "defaultValue", "sw-entity-single-select", "sw-media-field", "sw-snippet-field", "single-select", "system config", "plugin settings", "configuration page"]
summary: Define a plugin settings page in src/Resources/config/config.xml - cards, input-field types, options, components and the cache-relevant attribute.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/use-plugin-configuration.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

A plugin declares its Administration configuration page in `src/Resources/config/config.xml`. Shopware renders the form dynamically and stores values in the system config; no custom Administration module is needed. Reading values is covered in [Use plugin configuration](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/use-plugin-configuration.md).

## When to use

Your plugin needs merchant-editable settings (API keys, toggles, selects, product/media pickers) under **Extensions > My extensions > Plugins > Configure**.

## Key steps / config

1. Create `<plugin root>/src/Resources/config/config.xml` (plugin from the [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).
2. Point the root `<config>` element at the schema via `xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/SystemConfig/Schema/config.xsd"` (the `xmlns:xsi` attribute carries the standard XML Schema instance namespace). This gives IDE completion.
3. Add at least one `<card>` with a `<title>` and at least one `<input-field>`:

```xml
<config xmlns:xsi="..." xsi:noNamespaceSchemaLocation="...config.xsd">
    <card>
        <title>Minimal configuration</title>
        <title lang="de-DE">...</title>
        <input-field type="bool" cache-relevant="true">
            <name>showBadge</name>
            <label>...</label>
            <defaultValue>true</defaultValue>
        </input-field>
        <component name="sw-entity-single-select">
            <name>exampleProduct</name>
            <entity>product</entity>
        </component>
    </card>
</config>
```

4. Save, refresh the Administration, open the plugin's **Configure** action and fill the **Configuration** tab.

### Input fields

- `<name>` must come first, is not translatable, must be unique, and must match `[a-zA-Z][a-zA-Z0-9]*`.
- `type` attribute defaults to `text`. Allowed values in the schema: `text`, `textarea`, `text-editor`, `url`, `password`, `int`, `float`, `bool`, `checkbox`, `datetime`, `date`, `time`, `colorpicker`, `single-select`, `multi-select`, `price`.
- Common settings: `<label>`, `<placeholder>`, `<helpText>` (translatable via `lang`, default `en-GB`), `<defaultValue>` (imported on install/update, cast with `Symfony\Component\Config\Util\XmlUtils`), `<disabled>`, `<required>` (booleans).
- `<copyable>` (boolean) for `text`-like types; `<minLength>`/`<maxLength>` for `text`, `url`, `password`; `<min>`/`<max>` for `int`, `float`.
- `single-select`/`multi-select` take `<options>` with one or more `<option>`, each holding an `<id>` and a translatable `<name>`.

### Components

`<component name="...">` renders an Administration component; it needs `<name>` first, and all other child elements are passed as props. Components listed: `sw-entity-single-select`, `sw-entity-multi-id-select`, `sw-media-field`, `sw-text-editor`, `sw-snippet-field` (edits snippet translations for `<snippet>`, stores nothing in system config). For entities without a `name` field (e.g. `mail_template`), set `<label-property>description</label-property>`; see `Shopware\Core\Content\MailTemplate\MailTemplateDefinition`.

### Cache-relevant fields

Set `cache-relevant="true"` on `<input-field>` or `<component>` when the value affects cached Storefront output (templates, controllers, page loaders). A change then triggers the broader system config cache invalidation for the sales channel. Leave it unset for credentials, timestamps and internal values; overuse causes broad cache invalidations.

## Essential identifiers

- `src/Resources/config/config.xml`, `config.xsd`
- `<card>`, `<title>`, `<input-field>`, `<component>`, `<name>`, `<options>`, `<option>`
- `type`, `lang`, `cache-relevant` attributes
- `defaultValue`, `disabled`, `required`, `copyable`, `minLength`, `maxLength`, `min`, `max`, `label-property`
- `sw-entity-single-select`, `sw-entity-multi-id-select`, `sw-media-field`, `sw-text-editor`, `sw-snippet-field`

## Gotchas

- The docs state field names need at least 4 characters; the installed schema's `name` type only enforces the pattern `[a-zA-Z][a-zA-Z0-9]*`, with no length facet.
- The five-component allow-list lives in `ConfigValidator`, which is `@internal` to the app system; it validates app manifests, where custom `<component>` elements are blocked because they could execute code in the Administration.
- The schema declares a unique constraint on `card/input-field/name`.

## Version notes

- `cache-relevant` is available from 6.7.12.0. From 6.8.0.0, system config writes no longer invalidate caches by default, so fields affecting cached Storefront output need the attribute.
- `sw-snippet-field` is available from 6.3.4.0.

## Code check (6.7.15.1)
- confirmed `config` — root element holding one or more `card` elements — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:3
- confirmed `uniqueInputFieldName` — input-field names must be unique — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:9
- confirmed `cache-relevant` — boolean attribute on `input-field` (and `component`, line 31) — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:39
- confirmed `cacheRelevant` — ConfigReader maps the attribute via XmlUtils::phpize — vendor/shopware/core/System/SystemConfig/Util/ConfigReader.php:213
- confirmed `type` — input-field type defaults to `text` — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:38
- corrected `price` — docs: type table omits it; schema enumerates it as a valid type — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:58
- confirmed `lang` — translatable strings default to `en-GB` — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:64
- corrected `[a-zA-Z][a-zA-Z0-9]*` — docs: name at least 4 characters; schema has only this pattern — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:86
- confirmed `option` — requires `id` and translatable `name` — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:80
- corrected `ConfigValidator::ALLOWED_APP_CONFIGURATION_COMPONENTS` — docs: components Shopware supports by default; code applies it to apps only (@internal) — vendor/shopware/core/Framework/App/Validation/ConfigValidator.php:18
