---
id: platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-block.md
title: Add CMS block
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/add-cms-block.html
sourceHash: 4fbc3212e033c5289596aab18e640ded3f86cbec
codeCheckedAgainst: "6.7.15.1"
keywords: ["cms block", "registerCmsBlock", "cmsService", "shopping experiences", "slots", "cms-block-image-text-reversed", "previewComponent", "defaultConfig", "cms-section-block-container.html.twig", "block.slots.getSlot", "sw_include", "layout designer", "custom block"]
summary: Register a custom CMS block with cmsService.registerCmsBlock and render its slots in a Storefront cms-block-*.html.twig template.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md", "platform/dev/6.7/guides/plugins/plugins/content/cms/add-cms-element.md"]
---
## What it is

How a plugin adds a custom CMS block to Shopping Experiences. In the CMS hierarchy (Page, Section, Block, Slot, Element) a block is a reusable layout unit that arranges named slots; each slot holds exactly one element. Blocks define structure, elements provide content. Example used: `image-text-reversed`, a mirror of the built-in `image-text` block. See [Shopping Experiences concept](platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md).

## When to use

When the layout designer (Content > Shopping Experience) needs a new arrangement of slots not covered by the built-in categories (Text, Images, Text & Images, Commerce, Video, Form, Sidebar).

## Key steps / config

Recommended plugin layout: `<plugin root>/src/Resources/app/administration/src/module/sw-cms/blocks/<category>/<block-name>/` with `index.js`, `component/` and `preview/`.

1. Import the block in `main.js`: `import './module/sw-cms/blocks/text-image/image-text-reversed';`
2. Register it (block `index.js` imports `./component` and `./preview`):

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

`slots` maps slot name to element type. `category` is one of `text`, `image`, `text-image`, `commerce`, `form`, `video`, `sidebar`.

3. Block component: `Shopware.Component.register('cms-block-image-text-reversed', { template })` — the template must contain a `<slot name="...">` for every slot defined in step 2.
4. Preview component `cms-block-preview-image-text-reversed`: thumbnail in the sidebar; may use `Shopware.Filter.getByName('asset')` to show a static image.
5. Storefront template at `<plugin root>/src/Resources/views/storefront/block/cms-block-image-text-reversed.html.twig` (prefix `cms-block-` + block `name` + `.html.twig`):

```twig
{% set element = block.slots.getSlot('left') %}
{% sw_include '@Storefront/storefront/element/cms-element-' ~ element.type ~ '.html.twig' with { 'element': element } %}
```

To render all slots, loop `{% for slotName, slot in block.slots %}` and include per `slot.type`.

## Essential identifiers

- `Shopware.Service('cmsService').registerCmsBlock()`
- `src/Storefront/Resources/views/storefront/section/cms-section-block-container.html.twig` (loads `cms-block-<type>.html.twig`)
- `block.slots.getSlot()`, `sw_include`
- `CmsBlockDefinition` (fields available on `block`)
- `\Shopware\Core\Content\Cms\SalesChannel\SalesChannelCmsPageLoader::load`
- Core block code: `src/Administration/Resources/app/administration/src/module/sw-cms/blocks/`, `src/Storefront/Resources/views/storefront/block/`

## Gotchas

- `registerCmsBlock()` silently returns `false` and registers nothing when `name` or `component` is missing, or when `flag` is `false`.
- Clear the Storefront cache after adding new templates.
- The section container includes the block template with `ignore missing`, so a misnamed file renders nothing instead of erroring.

## Code check (6.7.15.1)
- confirmed `CmsService::registerCmsBlock()` — rejects config without `name`/`component` or with `flag === false` — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/service/cms.service.ts:177
- confirmed `CmsBlockConfig` — `category`, `previewComponent`, `slots` optional; `defaultConfig` typed as required — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/service/cms.service.ts:66
- confirmed `@Storefront/storefront/block/cms-block-` — section container includes `cms-block-` ~ `block.type` with `ignore missing` — vendor/shopware/storefront/Resources/views/storefront/section/cms-section-block-container.html.twig:88
- confirmed `CmsSlotCollection::getSlot()` — backs `block.slots.getSlot()` — vendor/shopware/core/Content/Cms/Aggregate/CmsSlot/CmsSlotCollection.php:40
- confirmed `block.slots.getSlot` — built-in `image-text` block uses the same getSlot/sw_include pattern — vendor/shopware/storefront/Resources/views/storefront/block/cms-block-image-text.html.twig:5
- confirmed `CmsBlockDefinition` — entity `cms_block` — vendor/shopware/core/Content/Cms/Aggregate/CmsBlock/CmsBlockDefinition.php:32
- confirmed `SalesChannelCmsPageLoader::load()` — core page loading entry — vendor/shopware/core/Content/Cms/SalesChannel/SalesChannelCmsPageLoader.php:44
- confirmed `asset` — admin filter used by the preview component — vendor/shopware/administration/Resources/app/administration/src/app/filter/asset.filter.ts:5
