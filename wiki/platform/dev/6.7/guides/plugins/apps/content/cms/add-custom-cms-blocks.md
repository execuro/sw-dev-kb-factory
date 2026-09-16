---
id: platform/dev/6.7/guides/plugins/apps/content/cms/add-custom-cms-blocks.md
title: Add Custom CMS Blocks
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/content/cms/add-custom-cms-blocks.html
sourceHash: 416ccbb6fb2bbd1bd7957da23cc7faeba19f7501
codeCheckedAgainst: "6.7.13.0"
keywords: ["cms.xml", "cms block", "app cms block", "shopping experiences", "preview.html", "styles.css", "cms-1.0.xsd", "default-config", "slots", "sw_extends", "cms-block-image-text.html.twig", "layout block"]
summary: Define custom CMS blocks from an app via Resources/cms.xml with preview.html, styles.css per block and a Storefront Twig template; auto-registered.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-block.md", "platform/dev/6.7/guides/plugins/apps/app-base-guide.md"]
---
## What it is

How an app adds custom CMS (Shopping Experiences) blocks by declaring them in `Resources/cms.xml`, with an Administration preview per block and a Storefront Twig template. Available since Shopware 6.4.4.0. Plugin-based CMS blocks are the alternative, but those are not available in Shopware cloud stores.

## When to use

You build an app (see [App Base Guide](platform/dev/6.7/guides/plugins/apps/app-base-guide.md)) and need a new layout block in the CMS editor that combines existing CMS elements, for example a reversed `image-text` block. For plugin blocks see [add a CMS block from a plugin](platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-block.md).

## Key steps / config

1. Directory layout in the app:
   - `Resources/cms.xml`
   - `Resources/cms/blocks/<block-name>/preview.html` and `styles.css` (directory name must match the block's `<name>`)
   - `Resources/views/storefront/block/cms-block-<block-name>-component.html.twig`
   - optional Storefront styling in `Resources/app/storefront/src/scss/base.scss`
2. Define blocks in `cms.xml` (skeleton, values elided):

```xml
<cms xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Cms/Schema/cms-1.0.xsd">
  <blocks><block>
    <name>swag-image-text-reversed</name>
    <category>text-image</category>
    <label>...</label><label lang="de-DE">...</label>
    <slots>
      <slot name="left" type="text"><config>
        <config-value name="vertical-align" source="static" value="top"/>
      </config></slot>
    </slots>
    <default-config><margin-top>20px</margin-top><sizing-mode>boxed</sizing-mode></default-config>
  </block></blocks>
</cms>
```

   - `<name>`: unique technical name; `<category>`: one of `commerce`, `form`, `image`, `sidebar`, `text`, `text-image`, `video`; `<label>`: translatable (default `en-GB`); `<slots>`: each slot has a unique `name` and a `type` referring to a shipped CMS element; `<default-config>`: `margin-top/right/bottom/left`, `sizing-mode` (`boxed` or `full_width`), `background-color`.
   - Slot `config` depends on the element `type`; check each element's `index.js` under the Administration's `module/sw-cms/elements` directory.
3. `preview.html`: pure HTML only; `styles.css` styles both the sidebar preview and the editor block. Editor CSS class patterns: `sw-cms-block-${block.name}-component`, per slot `sw-cms-slot-${slot.name}`.
4. No registration code: app blocks are registered automatically at runtime (persisted on app install/update, loaded in the Administration from the `api/app-system/cms/blocks` endpoint).
5. Storefront: template `cms-block-${block.name}-component.html.twig`, e.g. `{% sw_extends '@Storefront/storefront/block/cms-block-image-text.html.twig' %}`.

## Essential identifiers

- `Resources/cms.xml`, `cms-1.0.xsd`
- `preview.html`, `styles.css`
- `sw-cms-block-${block.name}-component`, `sw-cms-slot-${slot.name}`
- `cms-block-${block.name}-component.html.twig`
- `@Storefront/storefront/block/cms-block-image-text.html.twig`

## Gotchas

- No Twig or Sass for the preview; the preview is sanitized, so script tags and Vue bindings such as `:src="assetFilter(...)"` are stripped.
- App blocks via `cms.xml` can only use elements shipped by Shopware; fully custom elements need the Meteor Admin SDK approach.
- Block names must be unique within `cms.xml` (enforced by the schema); slot names must be unique within a block.
- The schema element order is fixed: `name`, `category`, `label`, `slots`, `default-config` (all required).

## Version notes

- Available starting with Shopware 6.4.4.0.

## Code check (6.7.13.0)
- confirmed `Resources/cms.xml` — lifecycle handler only processes blocks if the file exists — vendor/shopware/core/Framework/App/Lifecycle/Handler/CmsBlockLifecycleHandler.php:42
- confirmed `cms-1.0.xsd` — schema used to validate cms.xml — vendor/shopware/core/Framework/App/Cms/CmsExtensions.php:16
- confirmed `uniqueBlockName` — block names unique per file — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:12
- confirmed `text-image` — one of seven allowed categories — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:54
- confirmed `default-config` — required block child — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:66
- confirmed `full_width` — sizing-mode allows boxed or full_width — vendor/shopware/core/Framework/App/Cms/Schema/cms-1.0.xsd:152
- confirmed `preview.html` — loaded from cms/blocks/<name> — vendor/shopware/core/Framework/App/Cms/BlockTemplateLoader.php:20
- confirmed `styles.css` — loaded from cms/blocks/<name> — vendor/shopware/core/Framework/App/Cms/BlockTemplateLoader.php:37
- confirmed `app-system/cms/blocks` — Administration fetches app blocks at runtime — vendor/shopware/administration/Resources/app/administration/src/core/service/api/app-cms-blocks.service.js:20
- confirmed `api.app_system.cms.blocks` — API route serving app blocks — vendor/shopware/core/Framework/App/Api/AppCmsController.php:33
