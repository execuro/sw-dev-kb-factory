---
id: platform/dev/6.7/resources/references/app-reference/cms-reference.md
title: CMS Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/cms-reference.html
sourceHash: 5fca70b5cda0d80c3f38a92f66d2dea5c9770776
codeCheckedAgainst: "6.7.15.1"
keywords: ["cms.xml", "cms-1.0.xsd", "cms block", "app cms block", "shopping experiences", "slot", "config-value", "default-config", "sizing-mode", "text-image", "category", "layout block"]
summary: Reference for an app's Resources/cms.xml - defining CMS blocks with name, category, labels, slots with config-value entries and default-config.
lastBuilt: 2026-10-21
---
## What it is

The reference example for `cms.xml`, the file in which an app declares its own CMS (Shopping Experiences) blocks. Each block gets a technical name, a category, translatable labels, a set of named slots pointing to CMS element types, and a default block configuration.

## When to use

When an app should add custom blocks to the Administration's CMS layout editor, and you need the exact XML structure the installer validates.

## Key steps / config

1. Place the file at `Resources/cms.xml` inside the app; it is read during app install/update and validated against `cms-1.0.xsd`.
2. Reference the schema: `xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Cms/Schema/cms-1.0.xsd"`.
3. Inside `<blocks>`, each `<block>` needs, in this order: `name`, `category`, one or more `label`, `slots`, `default-config`.

```xml
<cms xmlns:xsi="..." xsi:noNamespaceSchemaLocation="...cms-1.0.xsd">
  <blocks>
    <block>
      <name>my-first-block</name>
      <category>text-image</category>
      <label>First block from app</label>
      <label lang="de-DE">Erster Block einer App</label>
      <slots>
        <slot name="left" type="manufacturer-logo">
          <config><config-value name="display-mode" source="static" value="cover"/></config>
        </slot>
      </slots>
      <default-config><margin-top>20px</margin-top><sizing-mode>boxed</sizing-mode></default-config>
    </block>
```

- `category` must be one of `commerce`, `form`, `image`, `sidebar`, `text`, `text-image`, `video`.
- `label` without `lang` defaults to `en-GB`; `lang` follows the `xx-XX` pattern (e.g. `de-DE`).
- Each `slot` requires `name` and `type` (a CMS element type such as `image-gallery`, `buy-box`, `form`, `image`, `youtube-video`) and a `config` with at least one `config-value`.
- `config-value` requires all three attributes `name`, `source`, `value` (example settings: `display-mode`, `min-height`, `background-color`).
- `default-config` accepts `margin-bottom`, `margin-top`, `margin-left`, `margin-right`, `sizing-mode` (`boxed` or `full_width`) and `background-color`, all optional.

## Essential identifiers

- `Resources/cms.xml`
- `cms-1.0.xsd`
- Elements: `cms`, `blocks`, `block`, `name`, `category`, `label`, `slots`, `slot`, `config`, `config-value`, `default-config`
- Default-config keys: `margin-bottom`, `margin-top`, `margin-left`, `margin-right`, `sizing-mode`, `background-color`

## Gotchas

- Block `name` values must be unique within the file, and slot `name` values must be unique within a block — the schema enforces both.
- The source example prefixes the XML with a `// cms.xml` comment line; that is a filename hint only, not valid XML.

## Code check (6.7.15.1)
- confirmed `Resources/cms.xml` — file location read by the CMS block lifecycle handler — vendor/shopware/core/Framework/App/Lifecycle/Handler/CmsBlockLifecycleHandler.php:42
- confirmed `uniqueBlockName` — block names unique per file — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:12
- confirmed `category` — enumerated values incl. `text-image` — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:31
- confirmed `uniqueSlotName` — slot names unique per block — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:61
- confirmed `default-config` — required element of every block — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:66
- confirmed `sizing-mode` — optional default-config key — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:81
- confirmed `config-value` — at least one per slot config, attributes name/source/value required — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:125
- confirmed `lang` — defaults to en-GB — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:138
- confirmed `full_width` — second allowed sizing mode besides boxed — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:152
