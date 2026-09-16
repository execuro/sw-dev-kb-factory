---
id: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/_index.md
title: JavaScript
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/
sourceHash: 314ecb2ed7a1aea48ac18a3ad1d9fa5ce6282260
codeCheckedAgainst: "6.7.13.0"
keywords: ["storefront javascript", "js plugins", "PluginManager", "PluginBaseClass", "custom javascript", "override javascript", "javascript events", "script tag", "store api fetch", "plugin reference", "storefront helpers"]
summary: Section index for Storefront JavaScript guides - custom JS plugins, overriding plugins, events, script tags, Store API fetching, plugin/helper reference.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/plugin-reference.md"]
---
## What it is

Index of the Storefront JavaScript section: extending and customizing the Storefront with JavaScript plugins — creating custom plugins, overriding existing functionality, reacting to events, loading external scripts, and interacting with the Store API.

## When to use

Start here when a Shopware plugin needs client-side behaviour in the Storefront and you need to pick the right guide.

## Key steps / config

Guides in this section:

- [Add Custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md) — write a plugin class and register it in the plugin's `main.js`.
- [Add JavaScript as Script Tag](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-javascript-as-script-tag.md) — load external/separate scripts through Twig blocks.
- [Fetching Data with JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/fetching-data-with-javascript.md) — call the Store API from Storefront JavaScript.
- [Override Existing JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/override-existing-javascript.md) — change behaviour of core Storefront plugins.
- [Reacting to JavaScript events](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/reacting-to-javascript-events.md) — listen to events emitted by Storefront plugins.

Reference:

- [Storefront Plugins and Helper](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/plugin-reference.md) — the plugins and helpers shipped with the Storefront.

## Essential identifiers

In the installed Storefront, the plugin system is exposed globally as `window.PluginManager` (registration) and `window.PluginBaseClass` (base class for plugins); the core registers its own plugins in `Resources/app/storefront/src/main.js`.

## Code check (6.7.13.0)
- confirmed `PluginManager` — exposed on window — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:798
- confirmed `PluginBaseClass` — exposed on window — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:799
- confirmed `PluginManager.register` — core plugin registration in main.js — vendor/shopware/storefront/Resources/app/storefront/src/main.js:100
