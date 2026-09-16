---
id: "platform/dev/6.6/guides/plugins/plugins/storefront/remove-unnecessary-js-plugin.md"
title: "Remove Javascript plugin"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/remove-unnecessary-js-plugin.html"
sourceHash: "7abb7927f329544d1cb3f77b1c639ba6b94ac6e3"
keywords: ["PluginManager.deregister", "PluginManager.getPluginList", "OffCanvasCart", "remove javascript plugin", "unregister plugin", "storefront javascript", "main.js", "javascript plugin manager", "off-canvas cart", "deregister plugin", "storefront build"]
summary: "Shows how to unregister a Core storefront JS plugin with window.PluginManager.deregister() from a custom plugin's main.js."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to unregister (remove) a Shopware Core JavaScript plugin from the storefront using a custom plugin, so it no longer runs.

## When to use
Use this when a Core storefront JavaScript plugin interferes with custom functionality and needs to be excluded, for example when replacing or disabling a default UI behavior such as the off-canvas cart.

## Key steps / config
To remove a JavaScript plugin, call `window.PluginManager.deregister()` with the plugin's registered name and its selector, inside the custom plugin's `main.js` file:

```javascript
// <plugin root>/src/Resources/app/storefront/src/main.js
window.PluginManager.deregister('OffCanvasCart', '[data-off-canvas-cart]');
```

The example targets the `OffCanvasCart` plugin as a test case that is easy to inspect. After rebuilding the Storefront, the off-canvas cart should no longer be able to open. To verify the deregistration, open the browser devtools console and run `PluginManager.getPluginList()`, which lists all currently registered JavaScript plugins — `OffCanvasCart` should no longer appear in that list once deregistered.

The guide assumes a running plugin is already installed (see the plugin base guide) and, while not mandatory, familiarity with adding custom JavaScript plugins beforehand helps, since deregistering happens from the same `main.js` entry point normally used to register custom JavaScript plugins. Related storefront guides mentioned as next steps cover overriding existing JavaScript and reacting to JavaScript events.

## Essential identifiers
- `window.PluginManager.deregister(name, selector)` — removes a registered JavaScript plugin
- `window.PluginManager.getPluginList()` — lists all currently registered JavaScript plugins
- `OffCanvasCart` — example Core plugin name used to demonstrate deregistration
- `main.js` — storefront plugin entry file where deregistration is called

## Gotchas
The Storefront must be rebuilt after adding the deregistration call before the change takes effect in the browser.
