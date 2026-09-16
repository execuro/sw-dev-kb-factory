---
id: platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-block.md
title: Add CMS block
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/add-cms-block.html
sourceHash: 4fbc3212e033c5289596aab18e640ded3f86cbec
codeCheckedAgainst: "6.7.13.0"
keywords: ["add cms block", "shopping experiences", "registerCmsBlock", "cmsService", "cms-block-", "block.slots.getSlot", "sw_include", "cms-section-block-container.html.twig", "SalesChannelCmsPageLoader", "CmsBlockDefinition", "slots", "layout designer", "custom block"]
summary: Custom Shopware 6.7 CMS block - cmsService.registerCmsBlock in the admin, block and preview components, cms-block- Storefront template.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md", "platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md"]
---
## What it is

A CMS block is the reusable layout unit of Shopping Experiences: it defines how elements are arranged in named **slots** (each slot holds exactly one element). Hierarchy: Page → Section → Block → Slots → Elements. Blocks define structure, elements provide content. The guide adds an `image-text-reversed` block (text left, image right) in the Administration and Storefront. Architecture background: [Shopping Experiences concept](platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md).

## When to use

You need a new layout option in Content → Shopping Experiences beyond the built-in blocks (e.g. the core `image-text` block). For new content primitives see [Add CMS element](platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md).

## Key steps / config

Plugin layout: `<plugin root>/src/Resources/app/administration/src/module/sw-cms/blocks/text-image/image-text-reversed/` with `index.js`, `component/` and `preview/` (each an `index.js` plus twig/scss).

1. Import the block in `main.js`: `import './module/sw-cms/blocks/text-image/image-text-reversed';`
2. Register it in the block's `index.js` (after importing `./component` and `./preview`):

```js
Shopware.Service('cmsService').registerCmsBlock({
    name: 'image-text-reversed',
    category: 'text-image',
    label: 'cms.blocks.imageTextReversed.label',
    component: 'cms-block-image-text-reversed',
    previewComponent: 'cms-block-preview-image-text-reversed',
    defaultConfig: { marginBottom: '20px', /* marginTop, marginLeft, marginRight */ sizingMode: 'boxed' },
    slots: { left: 'text', right: 'image' },
});
```

   `name` and `component` are mandatory (registration returns `false` without them). `category` values in the sidebar: `favorite`, `text`, `image`, `video`, `text-image`, `commerce`, `sidebar`, `form`, `html`. A slot value is an element type string or an object `{ type, default: { config, data } }`.
3. Register the block component (`Shopware.Component.register('cms-block-image-text-reversed', …)`) whose template contains a `<slot name="…">` for every slot key.
4. Register the preview component `cms-block-preview-image-text-reversed` (thumbnail in the sidebar; can use `Shopware.Filter.getByName('asset')` for a static image).
5. Storefront: add `<plugin root>/src/Resources/views/storefront/block/cms-block-image-text-reversed.html.twig` (prefix `cms-block-` + block `name` + `.html.twig`); clear the Storefront cache.

```twig
{% set element = block.slots.getSlot('left') %}
{% sw_include '@Storefront/storefront/element/cms-element-' ~ element.type ~ '.html.twig' with { 'element': element } %}
{% for slotName, slot in block.slots %}…{% endfor %}
```

## Essential identifiers

- `Shopware.Service('cmsService').registerCmsBlock()`
- Storefront loader `src/Storefront/Resources/views/storefront/section/cms-section-block-container.html.twig`
- `block.slots.getSlot()`, `sw_include`, template prefix `cms-block-`
- `\Shopware\Core\Content\Cms\SalesChannel\SalesChannelCmsPageLoader::load`
- `CmsBlockDefinition` (fields of the `block` variable)
- Core block code: `src/Administration/Resources/app/administration/src/module/sw-cms/blocks/`, `src/Storefront/Resources/views/storefront/block/`

## Gotchas

- Include every slot defined in `slots` in the admin component template; they are used for configuring elements.
- The Storefront loader includes `cms-block-` + block type with `ignore missing`, so a misnamed template renders nothing instead of failing.

## Code check (6.7.13.0)
- confirmed `CmsService.registerCmsBlock()` — returns false without `name`/`component` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/service/cms.service.ts:177
- confirmed `CmsBlockConfig.slots` — string or `{ type, default }` object — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/service/cms.service.ts:80
- corrected `cmsBlockCategories` — docs: 7 categories; sidebar also has `favorite` and `html` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/component/sw-cms-sidebar/index.ts:163
- confirmed `image-text` — core block in category `text-image` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/blocks/text-image/image-text/index.ts:17
- confirmed `cms-block-` — loader includes `cms-block-` ~ block.type — vendor/shopware/storefront/Resources/views/storefront/section/cms-section-block-container.html.twig:88
- confirmed `CmsSlotCollection::getSlot()` — backs `block.slots.getSlot()` — vendor/shopware/core/Content/Cms/Aggregate/CmsSlot/CmsSlotCollection.php:40
- confirmed `SalesChannelCmsPageLoader::load()` — core page loading — vendor/shopware/core/Content/Cms/SalesChannel/SalesChannelCmsPageLoader.php:44
- confirmed `CmsBlockDefinition` — block entity definition — vendor/shopware/core/Content/Cms/Aggregate/CmsBlock/CmsBlockDefinition.php:29
