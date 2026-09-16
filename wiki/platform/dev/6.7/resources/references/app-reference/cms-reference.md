---
id: platform/dev/6.7/resources/references/app-reference/cms-reference.md
title: CMS Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/cms-reference.html
sourceHash: 5fca70b5cda0d80c3f38a92f66d2dea5c9770776
codeCheckedAgainst: "6.7.13.0"
keywords: ["cms.xml", "cms-1.0.xsd", "cms block", "shopping experiences", "app cms", "block", "slots", "slot", "config-value", "default-config", "sizing-mode", "CmsExtensions", "layout block"]
summary: "Reference for an app's Resources/cms.xml: CMS blocks with name, category, labels, slots with config-value entries, and default-config margins/sizing."
lastBuilt: 2026-09-15
---
## What it is

Annotated example of the `cms.xml` file an app uses to register custom CMS (Shopping Experiences) blocks for the Administration. The installed core loads it from `Resources/cms.xml` in the app and validates it against `cms-1.0.xsd`.

## When to use

When an app needs to provide its own layout blocks composed of existing CMS elements (e.g. `image-gallery`, `buy-box`, `youtube-video`) with preset slot configuration and default spacing.

## Key steps / config

1. Create `Resources/cms.xml` in the app, root `<cms>` with schema location `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Cms/Schema/cms-1.0.xsd` (declared via `xsi:noNamespaceSchemaLocation`).
2. Add one `<block>` per block inside `<blocks>`, with children in this order: `name`, `category`, one or more `label` (optional `lang`, default `en-GB`), `slots`, `default-config`.
3. Each `<slot>` needs `name` and `type` attributes (type = CMS element) and a `<config>` with at least one `<config-value name source value>`.

```xml
<cms>
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
      <default-config>margin-top/-bottom/-left/-right, sizing-mode, background-color</default-config>
    </block>
  </blocks>
</cms>
```

## Essential identifiers

- `Resources/cms.xml`, `cms-1.0.xsd`
- Elements: `blocks`, `block`, `name`, `category`, `label`, `slots`, `slot`, `config`, `config-value`, `default-config`
- `default-config` children: `margin-bottom`, `margin-top`, `margin-left`, `margin-right`, `sizing-mode`, `background-color`
- Slot types used in the example: `manufacturer-logo`, `image-gallery`, `buy-box`, `form`, `image`, `youtube-video`

## Gotchas

- `category` is an enumeration: `commerce`, `form`, `image`, `sidebar`, `text`, `text-image`, `video`.
- `sizing-mode` accepts only `boxed` or `full_width`.
- Block `name` must be unique within `blocks`, and slot `name` unique within a block (XSD unique constraints).
- `slots` and `default-config` are required elements of a block (all `default-config` children are optional); `config-value` requires all three attributes `name`, `source`, `value`.

## Code check (6.7.13.0)
- confirmed `Resources/cms.xml` — file path read by the CMS block lifecycle handler — vendor/shopware/core/Framework/App/Lifecycle/Handler/CmsBlockLifecycleHandler.php:42
- confirmed `cms-1.0.xsd` — schema used to validate the file — vendor/shopware/core/Framework/App/Cms/CmsExtensions.php:16
- confirmed `uniqueBlockName` — block names must be unique — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:12
- confirmed `category` — enumeration commerce/form/image/sidebar/text/text-image/video — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:31
- confirmed `slots` — required block child with unique slot names — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:60
- confirmed `default-config` — required block child — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:66
- confirmed `config-value` — name/source/value attributes all required — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:125
- confirmed `sizingMode` — allowed values boxed, full_width — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:149
- confirmed `lang` — label language attribute, default en-GB — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:138
