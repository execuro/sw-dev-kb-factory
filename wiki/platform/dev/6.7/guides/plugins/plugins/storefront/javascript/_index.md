---
id: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/_index.md
title: JavaScript
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/
sourceHash: 314ecb2ed7a1aea48ac18a3ad1d9fa5ce6282260
codeCheckedAgainst: "6.7.15.1"
keywords: ["storefront javascript", "js plugin", "PluginManager", "PluginBaseClass", "main.js", "override javascript", "javascript events", "script tag", "fetch", "store api", "plugin reference", "helper"]
summary: Index of Storefront JavaScript guides - custom JS plugins, overriding plugins, events, script tags, fetching data, and the plugin/helper reference.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/plugin-reference.md"]
---
## What it is

Section index for extending and customizing the Storefront with JavaScript plugins: creating custom plugins, overriding existing functionality, reacting to events, loading external scripts, and interacting with the Store API. Storefront JS plugins are classes extending the global `PluginBaseClass` and registered through the global `PluginManager`.

## When to use

Entry point when you need to pick the right Storefront JavaScript guide for a plugin task.

## Key steps / config

Guides in this section:

- [Add Custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md) - write a plugin class and register it in `main.js`.
- [Add JavaScript as Script Tag](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-javascript-as-script-tag.md) - load a separate script via a Twig block instead of the compiled bundle.
- [Fetching Data with JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/fetching-data-with-javascript.md) - request data from inside a plugin with `fetch`.
- [Override Existing JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md) - replace or extend core Storefront plugins.
- [Reacting to JavaScript events](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md) - subscribe to events emitted by Storefront plugins.

Reference: [Storefront Plugins and Helper](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/plugin-reference.md).

## Code check (6.7.15.1)
- confirmed `PluginManager` — exposed on window for plugin registration — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:971
- confirmed `PluginBaseClass` — exposed on window as the plugin base class — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:972
- confirmed `app/storefront/src/main.js` — plugin entry file picked up automatically — vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:187
