---
id: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md
title: Add Custom JavaScript
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/add-custom-javascript.html
sourceHash: 8a2f7d9d051e0055b327c54ae7d568dd00f3ebc6
codeCheckedAgainst: "6.7.15.1"
keywords: ["PluginBaseClass", "PluginManager.register", "main.js", "init()", "static options", "data-example-plugin", "data-example-plugin-options", "replace_recursive", "async plugin", "dynamic import", "shopware-cli project storefront-build", "composer run build:js:storefront", "storefront js plugin", "custom javascript"]
summary: Write a Storefront JS plugin extending PluginBaseClass, register it in main.js (sync, selector-bound or async), configure it via data-*-options, build it.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md"]
---
## What it is

How to write and register your own Storefront JavaScript plugin: a vanilla ES6 class extending the Storefront plugin base class, registered in the global `PluginManager`, optionally bound to a DOM selector, loaded async, and configured from Twig via data options. The example plugin alerts when the user scrolls to the bottom of the page.

## When to use

You need custom interactivity in the Storefront from a Shopware plugin. Requires a running plugin, file access and the command line to build the Storefront.

## Key steps / config

1. **Plugin class** in `<plugin root>/src/Resources/app/storefront/src/example-plugin/example-plugin.plugin.js`. Take the base class from the window and implement `init()` (entry point; plugins initialize on `DOMContentLoaded`):

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

2. **Register** in the entry file `<plugin root>/src/Resources/app/storefront/src/main.js` (loaded automatically):

```javascript
import ExamplePlugin from './example-plugin/example-plugin.plugin';
const PluginManager = window.PluginManager;
PluginManager.register('ExamplePlugin', ExamplePlugin);                           // every page
PluginManager.register('ExamplePlugin', ExamplePlugin, '[data-example-plugin]');  // bound to selector
PluginManager.register('ExamplePlugin', () => import('./example-plugin/example-plugin.plugin'), '[data-example-plugin]'); // async
```

   With a selector, the plugin runs only if at least one matching element exists; `this.el` is the bound element. A dynamic import makes the plugin async automatically: it is not bundled into the main JS and is downloaded on demand when the selector is found on the page.

3. **Place the selector in markup** by overriding a block, e.g. `base_main_inner` of `@Storefront/storefront/page/content/index.html.twig` in `<plugin root>/src/Resources/views/storefront/page/content/index.html.twig`; after `{{ parent() }}` add a `template` element with the `data-example-plugin` attribute. This activates it on every content page (homepage, category listings).

4. **Configure via data options**: defaults live in `static options`; templates override them with `data-{plugin-name-in-kebab-case}-options` (here `data-example-plugin-options`) holding a JSON object. Product detail pages are rendered from `@Storefront/storefront/page/content/product-detail.html.twig`, whose `base_main_inner` block can be extended:

```twig
{% sw_extends '@Storefront/storefront/page/content/product-detail.html.twig' %}
{% set examplePluginOptions = { text: "Are you not interested in this product?" } %}
{% block base_main_inner %}
    {{ parent() }}
    <template data-example-plugin data-example-plugin-options="{{ examplePluginOptions|json_encode|escape('html_attr') }}"></template>
{% endblock %}
```

   Best practice: keep options in a Twig variable so other plugins can extend them.

5. **Modify existing options** of a core plugin with the `replace_recursive` Twig filter inside the overridden block, then call `{{ parent() }}`:

```twig
{% block element_product_slider_slider %}
    {% set productSliderOptions = productSliderOptions|replace_recursive({ slider: { mouseDrag: true } }) %}
    {{ parent() }}
{% endblock %}
```

6. **Build**: `shopware-cli project storefront-build` (project template) or `composer run build:js:storefront` (platform contribution setup). The compiled file lands in `<plugin root>/src/Resources/app/storefront/dist/storefront/js/<plugin-name>/<plugin-name>.js` and is detected automatically; ship it with the plugin.

## Essential identifiers

- `window.PluginBaseClass`, `window.PluginManager`, `PluginManager.register(name, classOrImportFn, selector)`
- `init()`, `this.el`, `static options`, `this.options`
- `<plugin root>/src/Resources/app/storefront/src/main.js`
- `data-example-plugin`, `data-example-plugin-options`
- `replace_recursive`
- `shopware-cli project storefront-build`, `composer run build:js:storefront`

## Gotchas

- The docs extend `@Storefront/storefront/page/product-detail/index.html.twig` and its block `page_product_detail_content`; neither exists in 6.7 - use `page/content/product-detail.html.twig` instead.
- `<plugin-name>` in the dist path is the plugin technical name converted to kebab-case (e.g. `SwagExample` to `swag-example`); the file is only registered if it exists.
- The entry file may also be `main.ts`; if both exist, `main.ts` wins.
- A plugin without its own `init()` logs a warning and does nothing.
- Registering the same plugin name and selector twice logs "already registered" and is ignored.
- A normal (static) import always includes the plugin in the JS on all pages; use the dynamic import to load it only where its selector appears.

## Code check (6.7.15.1)
- confirmed `PluginBaseClass` — exposed as window.PluginBaseClass — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:972
- confirmed `PluginManager::register()` — signature (pluginName, pluginClass, selector = document, options) — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:839
- confirmed `PluginManagerSingleton::register()` — class without prototype (import fn) is stored as async; duplicate name+selector warns — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:79
- confirmed `Plugin::init()` — base implementation only warns that init is not defined — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:36
- confirmed `app/storefront/src/main.js` — entry file, checked after main.ts — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:187
- confirmed `/Resources/app/storefront/dist/storefront/js/%s/%s.js` — compiled script path keyed by kebab-case asset name — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:131
- confirmed `replace_recursive` — used by core templates to merge plugin options — vendor/shopware/storefront/Resources/views/storefront/element/cms-element-image-gallery.html.twig:139
- confirmed `base_main_inner` — block in content/product-detail.html.twig — vendor/shopware/storefront/Resources/views/storefront/page/content/product-detail.html.twig:7
- absent `page_product_detail_content` — block not defined in any installed template
- absent `@Storefront/storefront/page/product-detail/index.html.twig` — template not present; product-detail folder only has meta.html.twig
