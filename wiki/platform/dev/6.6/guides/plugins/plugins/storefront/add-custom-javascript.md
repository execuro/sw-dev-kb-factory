---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-javascript.md
title: Add custom Javascript
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-custom-javascript.html
sourceHash: 09c2d4ed8e114c2efe15128f951ba7d774a4b538
keywords: ["custom javascript", "PluginBaseClass", "PluginManager.register", "main.js", "storefront plugin js", "static options", "data-example-plugin", "async plugin", "replace_recursive", "build-storefront.sh", "storefront.js"]
summary: "How to write, register, bind, and configure a Storefront JavaScript plugin extending PluginBaseClass, including async loading."
lastBuilt: "2026-09-15"
---
## What it is

Explains how to write a Storefront JavaScript plugin (vanilla ES6 class extending the base `Plugin` class), register it, bind it to DOM elements, and configure it via template options.

## When to use

When adding client-side interactivity to the Storefront that should load through Shopware's JS plugin system rather than ad-hoc scripts.

## Key steps / config

- Create the plugin file under `<plugin root>/src/Resources/app/storefront/src/<plugin-name>/<plugin-name>.plugin.js`, extending `PluginBaseClass` and implementing `init()` (called on `DOMContentLoaded`):

```javascript
const { PluginBaseClass } = window;

export default class ExamplePlugin extends PluginBaseClass {
    init() {
        window.addEventListener('scroll', this.onScroll.bind(this));
    }
    onScroll() { /* ... */ }
}
```

- Register in `<plugin root>/src/Resources/app/storefront/src/main.js` (auto-loaded by Shopware):

```javascript
import ExamplePlugin from './example-plugin/example-plugin.plugin';
const PluginManager = window.PluginManager;
PluginManager.register('ExamplePlugin', ExamplePlugin);
```

- Optionally bind to a CSS selector so the plugin only runs where the selector matches: `PluginManager.register('ExamplePlugin', ExamplePlugin, '[data-example-plugin]')`; use `this.el` inside the plugin to access the bound element.
- Register asynchronously (excluded from the main `storefront.js` bundle, downloaded on demand) by passing a dynamic import: `PluginManager.register('ExamplePlugin', () => import('./example-plugin/example-plugin.plugin'), '[data-example-plugin]')`.
- Define a static `options` object with defaults, overridable per-template via a `data-{plugin-name-in-kebab-case}-options` attribute containing a JSON object:

```javascript
export default class ExamplePlugin extends PluginBaseClass {
    static options = { text: 'Seems like there\'s nothing more to see here.' };
    init() { /* ... */ }
}
```

- Override existing template option variables (e.g. core-provided ones) with the `replace_recursive` Twig filter:

```twig
{% set productSliderOptions = productSliderOptions|replace_recursive({
    slider: { mouseDrag: true }
}) %}
```

- Compiled JS is written to `<plugin root>/src/Resources/app/storefront/dist/storefront/js/<plugin-name>/<plugin-name>.js` and must ship with the plugin.
- Rebuild the Storefront to apply changes: `./bin/build-storefront.sh` (or `composer run build:js:storefront` for a platform/contribution setup).

## Essential identifiers

- `PluginBaseClass`, `init()`
- `PluginManager.register()`
- `main.js`
- `static options`
- `replace_recursive` Twig filter
- `./bin/build-storefront.sh`, `composer run build:js:storefront`

## Gotchas

A synchronously-imported JS plugin is always included in the bundled `storefront.js` on every page; only a dynamic-import registration is treated as async and downloaded on demand when its bound selector is present on the page.
