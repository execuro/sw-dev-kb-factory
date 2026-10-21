---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/advanced/remove-unnecessary-js-plugin.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md
  - platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md
sourceHash: 72ac892a37fa15fd8e387e7337e67b06a356901c
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/advanced/remove-unnecessary-js-plugin.html
title: Remove JavaScript Plugin
version: "6.7"
versions:
  - "6.7"
keywords: ["PluginManager.deregister", "PluginManager.getPluginList", "window.PluginManager", "OffCanvasCart", "[data-off-canvas-cart]", "main.js", "remove js plugin", "unregister javascript plugin", "disable core storefront plugin", "storefront javascript", "offcanvas cart"]
summary: Remove a registered Storefront JS plugin such as OffCanvasCart from a plugin's main.js via window.PluginManager.deregister(name, selector).
lastBuilt: 2026-10-21
---
## What it is

How a Shopware plugin excludes (deregisters) an existing Storefront JavaScript plugin, for example a Core plugin that would interfere with your own code. The Storefront's `PluginManager` keeps a registry of plugins by name and selector; removing an entry stops it from being initialised.

## When to use

- A Core (or third-party) Storefront JS plugin conflicts with your own JavaScript and should not run at all.
- You want to test a page without a specific plugin, e.g. disable the offcanvas cart.

To change a plugin's behaviour instead of removing it, see [Override existing JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md) or [Reacting to JavaScript events](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md).

## Key steps / config

1. Have a plugin installed (see the plugin base guide); a custom JS plugin setup helps but is not required.
2. In `<plugin root>/src/Resources/app/storefront/src/main.js` add one line, using the plugin name and the selector it was registered with:

```javascript
// <plugin root>/src/Resources/app/storefront/src/main.js
window.PluginManager.deregister('OffCanvasCart', '[data-off-canvas-cart]');
```

3. Rebuild the Storefront. The offcanvas cart should no longer open.
4. Verify in the browser devtools console with `PluginManager.getPluginList()` — `OffCanvasCart` should no longer be listed.

The Core registers this plugin in the Storefront `main.js` as `PluginManager.register('OffCanvasCart', () => import(...), '[data-off-canvas-cart]')`, which is where name and selector come from.

## Essential identifiers

- `window.PluginManager` — global Storefront plugin manager
- `PluginManager.deregister(pluginName, selector)` — removes a plugin registration
- `PluginManager.getPluginList()` — returns the names of all registered plugins
- `OffCanvasCart` / `[data-off-canvas-cart]` — example plugin name and selector

## Gotchas

- In the installed code, `deregister` first looks for the name+selector pair; if that pair is not registered but the name is, it deletes the plugin by name only. If the name is not registered at all it logs `The plugin "<name>" is not registered.` and returns `false`.
- The change only takes effect after the Storefront JavaScript is rebuilt.

## Code check (6.7.15.1)
- confirmed `PluginManager::deregister()` — static wrapper delegating to the instance — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:851
- confirmed `deregister()` — falls back to delete-by-name, warns when name unknown — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:101
- confirmed `PluginManager::getPluginList()` — returns registry keys — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:880
- confirmed `window.PluginManager` — exposed globally — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:971
- confirmed `OffCanvasCart` — registered with selector `[data-off-canvas-cart]` — vendor/shopware/storefront/Resources/app/storefront/src/main.js:60
