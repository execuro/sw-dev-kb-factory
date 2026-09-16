---
id: platform/dev/6.7/guides/plugins/plugins/storefront/advanced/remove-unnecessary-js-plugin.md
title: Remove JavaScript Plugin
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/advanced/remove-unnecessary-js-plugin.html
sourceHash: 72ac892a37fa15fd8e387e7337e67b06a356901c
codeCheckedAgainst: "6.7.13.0"
keywords: ["PluginManager.deregister", "PluginManager.getPluginList", "window.PluginManager", "OffCanvasCart", "[data-off-canvas-cart]", "main.js", "remove javascript plugin", "unregister storefront plugin", "disable core js plugin", "storefront javascript"]
summary: "Remove a registered Storefront JS plugin (e.g. OffCanvasCart) from your plugin's main.js with window.PluginManager.deregister(name, selector)."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md"]
---
## What it is

How a Shopware plugin excludes (unregisters) an existing Storefront JavaScript plugin, e.g. a core plugin that would interfere with your own code.

## When to use

A core or third-party JS plugin conflicts with your implementation and you want it not to be initialised at all, rather than overriding it (see [Override existing JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md)).

## Key steps / config

1. Add one line to your plugin's Storefront entry file `<plugin root>/src/Resources/app/storefront/src/main.js`, passing the plugin name and the selector it was registered with:
   ```javascript
   window.PluginManager.deregister('OffCanvasCart', '[data-off-canvas-cart]');
   ```
   Core registers this plugin as `PluginManager.register('OffCanvasCart', () => import(...), '[data-off-canvas-cart]')`.
2. Rebuild the Storefront. The off-canvas cart should no longer open.
3. Verify in the browser console with `PluginManager.getPluginList()` — `OffCanvasCart` should no longer be listed.

## Essential identifiers

- `window.PluginManager.deregister(pluginName, selector)`
- `PluginManager.getPluginList()`
- `OffCanvasCart`, selector `[data-off-canvas-cart]`
- `<plugin root>/src/Resources/app/storefront/src/main.js`

## Gotchas

- `deregister` looks up the name/selector pair first; if that pair is not registered but the name is, the plugin is deleted by name alone. If the name is not registered at all, it logs a console warning (`The plugin "..." is not registered.`) and returns `false`.
- Changes take effect only after rebuilding the Storefront JavaScript.

## Code check (6.7.13.0)
- confirmed `PluginManager::deregister()` — signature `deregister(pluginName, selector = document)` — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:96
- confirmed `PluginManager.deregister()` — static facade `deregister(pluginName, selector)` — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:678
- confirmed `PluginManager.getPluginList()` — returns registry keys — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:143
- confirmed `OffCanvasCart` — registered in core main.js with `[data-off-canvas-cart]` — vendor/shopware/storefront/Resources/app/storefront/src/main.js:59
