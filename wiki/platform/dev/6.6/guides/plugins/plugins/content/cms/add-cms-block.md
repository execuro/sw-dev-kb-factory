---
id: platform/dev/6.6/guides/plugins/plugins/content/cms/add-cms-block.md
title: Add CMS block
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/cms/add-cms-block.html"
sourceHash: "21164e6d29df63685665a8e6d10f5194adcb759f"
keywords: ["registerCmsBlock", "cmsService", "cms block", "sw-cms", "Shopping Experiences", "defaultConfig", "previewComponent", "sw_extends", "cms-block", "main.js", "text-image block", "block category"]
summary: "Guide to registering a custom CMS block via cmsService.registerCmsBlock, its Vue component/preview, and its Storefront Twig template."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to create a custom CMS block via a plugin: registering it in the Administration, building its rendering and preview Vue components, and providing its Storefront Twig representation.

## When to use
Use when a plugin needs a new reusable layout block for the "Shopping Experiences" (CMS) module beyond the blocks Shopware ships (`commerce`, `form`, `image`, `sidebar`, `text-image`, `text`, `video` categories).

## Key steps / config
1. Place a `main.js` entry point at `<plugin root>/src/Resources/app/administration/src` and import the new block's `index.js`.
2. Recreate the core directory structure under `<plugin root>/src/Resources/app/administration/src/module/sw-cms/blocks/<category>/<block-name>/`.
3. In `index.js`, call `Shopware.Service('cmsService').registerCmsBlock({...})` with a config object:
```js
Shopware.Service('cmsService').registerCmsBlock({
    name: '...',
    category: '...',
    label: '...',
    component: 'sw-cms-block-...',
    previewComponent: 'sw-cms-preview-...',
    defaultConfig: { /* margins, sizingMode, ... */ },
    slots: { left: 'text', right: 'image' }
});
```
4. Register the block's Vue component (`Shopware.Component.register('sw-cms-block-<name>', { template })`) with a Twig template using `<slot name="...">` matching the `slots` config, plus an `.scss` file.
5. Register the preview component the same way, with a simplified static template.
6. Add a Storefront template at `<plugin root>/src/Resources/views/storefront/block/cms-block-<name>.html.twig`, e.g. extending an existing block: `{% sw_extends '@Storefront/storefront/block/cms-block-image-text.html.twig' %}`.
7. Rebuild the Administration with `./bin/build-administration.sh` or, in a platform-only setup, `composer run build:js:admin`.

## Essential identifiers
- `Shopware.Service('cmsService').registerCmsBlock()`
- `Shopware.Component.register()`
- Config keys: `name`, `label`, `category`, `component`, `previewComponent`, `defaultConfig`, `slots`
- Twig tag `{% sw_extends %}`
- CSS class convention `is--boxed` (from `sizingMode: 'boxed'`)

## Gotchas
The component name must be `sw-cms-block-` followed by the block's `name` property. The Administration and Storefront directory structures must mirror the core's structure exactly for auto-discovery to work.
