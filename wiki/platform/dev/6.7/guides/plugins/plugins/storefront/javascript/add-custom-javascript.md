---
id: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md
title: Add Custom JavaScript
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/add-custom-javascript.html
sourceHash: 8a2f7d9d051e0055b327c54ae7d568dd00f3ebc6
codeCheckedAgainst: "6.7.13.0"
keywords: ["storefront javascript plugin", "js plugin", "PluginBaseClass", "PluginManager", "PluginManager.register", "main.js", "init", "static options", "data-options", "replace_recursive", "async plugin", "dynamic import", "shopware-cli project storefront-build", "build:js:storefront"]
summary: Write a Storefront JS plugin extending PluginBaseClass, register it in main.js via PluginManager.register (sync/async, selector), pass data-*-options, build.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md", "platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md"]
---
## What it is

How to write a Storefront JavaScript plugin (an ES6 class extending the Storefront plugin base class), register it with the `PluginManager`, bind it to DOM elements, configure it from Twig, and build/ship it.

## When to use

You need custom interactive behaviour in the Storefront from a Shopware plugin. Requires a running plugin, command-line access to build the Storefront, and ES6 knowledge. Follow-ups: [reacting to JavaScript events](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md), [overriding existing JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md).

## Key steps / config

1. **Create the plugin class** under `<plugin root>/src/Resources/app/storefront/src/`, e.g. `example-plugin/example-plugin.plugin.js`. The base class is exposed globally as `window.PluginBaseClass`:
   ```javascript
   const { PluginBaseClass } = window;
   export default class ExamplePlugin extends PluginBaseClass {
       static options = { text: 'Seems like there\'s nothing more to see here.' };
       init() {
           window.addEventListener('scroll', this.onScroll.bind(this));
       }
       onScroll() { /* ... alert(this.options.text) ... */ }
   }
   ```
   Implement `init()` — the base class calls it once on construction; without an override it only logs a warning. An optional `update()` hook exists. `this.el` is the bound DOM element, `this.options` the merged options.
2. **Register in the entry file** `<plugin root>/src/Resources/app/storefront/src/main.js` (a `main.ts` there takes precedence if both exist):
   ```javascript
   import ExamplePlugin from './example-plugin/example-plugin.plugin';
   const PluginManager = window.PluginManager;
   PluginManager.register('ExamplePlugin', ExamplePlugin, '[data-example-plugin]');
   ```
   Signature: `register(pluginName, pluginClass, selector = document, options = {})`. Without a selector the plugin runs on `document` on every page; with one, only where a matching element exists.
3. **Async plugin**: pass a dynamic import instead of the class:
   `PluginManager.register('ExamplePlugin', () => import('./example-plugin/example-plugin.plugin'), '[data-example-plugin]');`
   A value without a `prototype` (an arrow function) is treated as async; it is not bundled into the main JS and is downloaded only when the selector matches on the page.
4. **Add the DOM element** in a template (see [customizing templates](platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md)), e.g. `<plugin root>/src/Resources/views/storefront/page/content/index.html.twig` extending `@Storefront/storefront/page/content/index.html.twig`, block `base_main_inner`: after `{{ parent() }}` add `<template data-example-plugin></template>`. Active on content pages such as home and category listings.
5. **Override options from Twig** with `data-{plugin-name-in-kebab-case}-options` (here `data-example-plugin-options`) containing JSON. Use a Twig variable so other plugins can extend it. For product detail pages extend `@Storefront/storefront/page/content/product-detail.html.twig`:
   ```twig
   {% sw_extends '@Storefront/storefront/page/content/product-detail.html.twig' %}
   {% set examplePluginOptions = { text: "Are you not interested in this product?" } %}
   {% block base_main_inner %}
       {{ parent() }}
       <template data-example-plugin data-example-plugin-options="{{ examplePluginOptions|json_encode|escape('html_attr') }}"></template>
   {% endblock %}
   ```
   Options are deep-merged in order: static `options`, constructor options, `data-*-config`, `data-*-options`.
6. **Modify existing options** of a core template variable with the `replace_recursive` Twig filter, inside the block before `{{ parent() }}`:
   ```twig
   {% block element_product_slider_slider %}
       {% set productSliderOptions = productSliderOptions|replace_recursive({ slider: { mouseDrag: true } }) %}
       {{ parent() }}
   {% endblock %}
   ```
7. **Build**: `shopware-cli project storefront-build` (project template) or `composer run build:js:storefront` (platform contribution setup). The compiled file is expected at `<plugin root>/src/Resources/app/storefront/dist/storefront/js/<plugin-name>/<plugin-name>.js` and is picked up automatically if it exists — ship it with the plugin.

## Essential identifiers

- `window.PluginBaseClass`, `window.PluginManager`
- `PluginManager.register(pluginName, pluginClass, selector, options)`
- `init()`, `update()`, `static options`, `this.el`, `this.options`
- `data-<plugin-name>-options`, `data-<plugin-name>-config`
- Entry `src/Resources/app/storefront/src/main.js`; output `dist/storefront/js/<plugin-name>/<plugin-name>.js`
- Twig filter `replace_recursive`; blocks `base_main_inner`, `element_product_slider_slider`

## Gotchas

- `<plugin-name>` in the dist path is the plugin's technical name converted camelCase to snake_case with `_` replaced by `-`, e.g. `SwagExample` -> `swag-example`.
- The docs extend `@Storefront/storefront/page/product-detail/index.html.twig`, block `page_product_detail_content`; neither exists in the installed 6.7.13 Storefront (product detail uses `page/content/product-detail.html.twig`).
- Registering the same name + selector twice only logs "already registered" and is ignored.
- Invalid JSON in `data-*-options` is logged as an error and ignored.

## Code check (6.7.13.0)
- confirmed `PluginBaseClass` — exposed on window — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:799
- confirmed `register` — (pluginName, pluginClass, selector = document, options = {}) — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:74
- confirmed `prototype` — class without prototype registered as async — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:81
- confirmed `init` — default only warns; must be overridden — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:36
- confirmed `_getOptionsFromDataAttribute` — reads data-<dashed-name>-options as JSON — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:130
- confirmed `main.js` — entry file detected, main.ts checked first — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:186
- confirmed `dist/storefront/js` — script path used if file exists — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:131
- confirmed `getAssetName` — snake_case with dashes — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfiguration.php:243
- confirmed `replace_recursive` — Twig filter — vendor/shopware/core/Framework/Adapter/Twig/Filter/ReplaceRecursiveFilter.php:18
- corrected `base_main_inner` — docs: page_product_detail_content in page/product-detail/index.html.twig — vendor/shopware/storefront/Resources/views/storefront/page/content/product-detail.html.twig:7
