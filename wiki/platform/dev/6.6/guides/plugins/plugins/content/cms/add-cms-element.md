---
id: platform/dev/6.6/guides/plugins/plugins/content/cms/add-cms-element.md
title: Add CMS element
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/cms/add-cms-element.html"
sourceHash: "d1e1dd02fc6d92859dfd5a697b34fda75b9a9133"
keywords: ["registerCmsElement", "cmsService", "cms element", "configComponent", "previewComponent", "initElementConfig", "cms-element mixin", "sw-cms-el", "cms-element", "defaultConfig", "custom element", "snippet"]
summary: "Guide to registering a custom CMS element via cmsService.registerCmsElement, its component/config/preview parts, and Storefront rendering."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to create a new CMS element (using an embedded Dailymotion video as the example) via a plugin: registering it, building its main, preview and configuration Vue components, and its Storefront Twig rendering.

## When to use
Use when a plugin needs a content element type not shipped by Shopware core, to be placed inside CMS blocks and configured by shop managers in the "Shopping Experiences" module.

## Key steps / config
1. Import the element's `index.js` from the plugin's `main.js`.
2. Call `Shopware.Service('cmsService').registerCmsElement({...})` with config keys: `name`, `label` (snippet key), `component`, `configComponent`, `previewComponent`, `defaultConfig`, optional `hidden`, `removable`:
```js
Shopware.Service('cmsService').registerCmsElement({
    name: 'dailymotion',
    label: 'sw-cms.elements.customDailymotionElement.label',
    component: 'sw-cms-el-dailymotion',
    configComponent: 'sw-cms-el-config-dailymotion',
    previewComponent: 'sw-cms-el-preview-dailymotion',
    defaultConfig: { dailyUrl: { source: 'static', value: '' } }
});
```
3. Add a snippet file per language (e.g. `snippet/de-DE.json`, `snippet/en-GB.json`) providing the `label` translation:
```json
{ "sw-cms": { "elements": { "customDailymotionElement": { "label": "..." } } } }
```
4. Build the preview component (`Shopware.Component.register('sw-cms-el-preview-...', { template })`) with a simple static Twig template and `.scss`.
5. Build the main component with the `cms-element` mixin, calling `this.initElementConfig('<name>')` in `created()`, reading configured values via `this.element.config.<key>.value`.
6. Build the config component, also using the `cms-element` mixin and `initElementConfig`, with a `v-model` bound field (e.g. `<sw-text-field v-model="dailyUrl" @update:value="onElementUpdate">`) that emits an `element-update` event.
7. Add the Storefront Twig template at `<plugin root>/src/Resources/views/storefront/element/cms-element-<name>.html.twig`.
8. Install/rebuild: `bin/console plugin:install --activate SwagBasicExample`, then `./bin/build-administration.sh` or `composer run build:js:admin`.

## Essential identifiers
- `Shopware.Service('cmsService').registerCmsElement()`
- Mixin `cms-element`, method `initElementConfig()`
- Config keys: `name`, `label`, `component`, `configComponent`, `previewComponent`, `defaultConfig`, `hidden`, `removable`
- `element-update` event

## Gotchas
`component`, `configComponent`, and `previewComponent` must all exist before the element works, even though they're referenced by name before being created. The Storefront implementation is separate from the Administration one and must be added explicitly for the element to render on the frontend.
