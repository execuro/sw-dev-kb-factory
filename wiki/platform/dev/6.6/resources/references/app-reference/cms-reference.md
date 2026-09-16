---
id: platform/dev/6.6/resources/references/app-reference/cms-reference.md
title: CMS Reference
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/app-reference/cms-reference.html
sourceHash: 5fca70b5cda0d80c3f38a92f66d2dea5c9770776
keywords: ["cms.xml", "cms reference", "cms blocks", "app cms schema", "cms-1.0.xsd", "block category", "block slot", "config-value", "default-config", "app manifest cms", "block label", "text-image"]
summary: "Reference for an app's cms.xml, defining custom CMS blocks with slots, config values and default-config."
lastBuilt: 2026-09-15
---
## What it is

This page shows the structure of an app's `cms.xml` file, which registers custom CMS blocks (with slots and default configuration) that become available in the Shopware CMS/Layout Designer.

## Key steps / config

The `cms.xml` root element is `<cms>` and validates against a schema at `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Cms/Schema/cms-1.0.xsd`. Each `<block>` defines a `<name>`, `<category>`, one or more `<label>` (optionally with `lang` attribute, e.g. `lang="de-DE"`), a `<slots>` list, and a `<default-config>`.

```xml
<cms xsi:noNamespaceSchemaLocation="...cms-1.0.xsd">
  <blocks>
    <block>
      <name>my-first-block</name>
      <category>text-image</category>
      <label>...</label>
      <slots>
        <slot name="left" type="manufacturer-logo">
          <config>
            <config-value name="display-mode" source="static" value="cover"/>
          </config>
        </slot>
      </slots>
      <default-config>
        <margin-bottom>20px</margin-bottom>
        <sizing-mode>boxed</sizing-mode>
        <background-color>#000</background-color>
      </default-config>
    </block>
  </blocks>
</cms>
```

Each `<slot>` has a `name` and `type` (e.g. `manufacturer-logo`, `image-gallery`, `buy-box`, `form`, `image`, `youtube-video`); each `<config-value>` has `name`, `source` (e.g. `static`) and `value`. `<default-config>` supports keys such as `margin-bottom`, `margin-top`, `margin-left`, `margin-right`, `sizing-mode`, `background-color`.

## Essential identifiers

- `cms.xml`
- `<cms>`, `<blocks>`, `<block>`, `<name>`, `<category>`, `<label>`, `<slots>`, `<slot>`, `<config>`, `<config-value>`, `<default-config>`
- Schema: `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Cms/Schema/cms-1.0.xsd`
