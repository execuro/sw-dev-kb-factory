---
docType: developer
id: platform/dev/6.6/guides/plugins/apps/content/cms/add-custom-cms-blocks.md
sourceHash: 60537bdbc40d6097a599056eb2df22840f6da6a8
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/content/cms/add-custom-cms-blocks.html
title: Add custom CMS blocks
version: "6.6"
versions:
  - "6.6"
keywords: ["cms.xml", "CMS block", "preview.html", "styles.css", "sw-cms-preview", "sw-cms-block", "sw-cms-slot", "sw_extends", "cms-1.0.xsd", "block category", "block slots", "storefront twig block"]
summary: "Custom CMS blocks from an app are declared in cms.xml, styled via preview.html/styles.css, and rendered via a storefront twig block."
lastBuilt: 2026-09-15
---
## What it is

Explains how apps add custom CMS blocks (available since Shopware 6.4.4.0) by shipping a `cms.xml` plus per-block preview/style/twig files, unlike the plugin-based CMS block system.

## When to use

When an app needs to offer a new Shopping Experiences (CMS) building block that merchants can place in a CMS layout, including in Shopware cloud stores.

## Key steps / config

Directory layout for a block, e.g. `swag-image-text-reversed`:

```text
Resources
├── app/storefront/src/scss/base.scss
├── cms/blocks/swag-image-text-reversed/
│   ├── preview.html
│   └── styles.css
├── views/storefront/block/cms-block-swag-image-text-reversed-component.html.twig
└── cms.xml
```

Define the block in `cms.xml`, validated against `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Cms/Schema/cms-1.0.xsd`:

```xml
<cms>
  <blocks>
    <block>
      <name>swag-image-text-reversed</name>
      <category>text-image</category>
      <label>...</label>
      <slots>
        <slot name="left" type="text"><config>...</config></slot>
      </slots>
      <default-config>...</default-config>
    </block>
  </blocks>
</cms>
```

`<name>` must be a unique technical name; `<category>` picks a block category; `<label>` is translatable; `<default-config>` sets defaults; `<slots>` declares the elements the block shows. The preview template goes in `Resources/cms/blocks/<name>/preview.html` and must be pure HTML — no Twig or Sass — since it is sanitized against tags/attributes that could inject scripts. Preview/editor CSS uses class patterns `sw-cms-preview-<name>` (sidebar preview), `sw-cms-block-<name>-component` (editor), and `sw-cms-slot-<slotName>` per slot. The storefront twig template at `Resources/views/storefront/block/cms-block-<name>-component.html.twig` can extend an existing block template, e.g. `{% sw_extends '@Storefront/storefront/block/cms-block-image-text.html.twig' %}`. Blocks from an app are registered automatically at runtime — no separate registration step is needed. Slot element types and their config options are found in the Administration's `sw-cms` module source under `elements`/`blocks`.

## Essential identifiers

- `cms.xml`, `entities`-style schema `cms-1.0.xsd`
- `preview.html`, `styles.css`
- `sw-cms-preview-<name>`, `sw-cms-block-<name>-component`, `sw-cms-slot-<name>`
- `sw_extends`
- `<name>`, `<category>`, `<label>`, `<default-config>`, `<slots>`

## Gotchas

The preview template only supports plain HTML; templating engines and preprocessors are stripped/sanitized. App-provided blocks register automatically, unlike plugin blocks which require explicit registration.
