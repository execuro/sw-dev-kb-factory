---
id: platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.md
title: Add Menu Entry
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.html
sourceHash: 02f1b9945a5a2c38fc18059deccf8e190dcb8edc
codeCheckedAgainst: "6.7.15.1"
keywords: ["navigation", "menu entry", "main menu", "admin menu", "Shopware.Module.register", "parent", "sw-catalogue", "sw-manufacturer", "position", "label", "nested menu", "sidebar", "first level menu"]
summary: "Admin menu entries via a module's navigation array (id, label, path, parent, position); plugin entries must set a parent such as sw-catalogue."
lastBuilt: 2026-10-21
---
## What it is

A module's menu entry in the Administration main menu is declared in the `navigation` key of the module configuration passed to `Shopware.Module.register`. It is an array of objects, each linking a menu item to one of the module's routes.

## When to use

When a plugin module needs to be opened from the Administration main menu, nested under an existing category such as Catalogues.

## Key steps / config

1. In `<plugin root>/src/Resources/app/administration/src/module/swag-example/index.js`, add `navigation` to the module configuration:
   ```javascript
   Shopware.Module.register('swag-plugin', {
       // ...routes etc.
       navigation: [{
           id: 'swag-custommodule-list',
           label: 'CustomModule',
           color: '#ff3d58',
           path: 'swag.custommodule.list',
           icon: 'default-shopping-paper-bag-product',
           parent: 'sw-catalogue',
           position: 100
       }]
   });
   ```
2. Keys:
   - `label` — text shown for the entry; required.
   - `path` — full name of one of your module's routes: module id with dashes as dots plus route key (`swag-example` + `index` → `swag.example.index`).
   - `parent` — id of the menu entry to append to; required for plugin modules.
   - `id` — node id in the menu tree; other entries can use it as their `parent`.
   - `color`, `icon` — theme color and icon of the entry (may differ from the module's own).
   - `position` — higher values sort further down.
3. Find a parent id in the `navigation` of the core module's `index.js` (e.g. `sw-catalogue` in `sw-product`, `sw-manufacturer` in `sw-manufacturer`). Nesting depth is unlimited; using `sw-manufacturer` as parent places the item on the third level.

## Essential identifiers

- `navigation` (array) in `Shopware.Module.register`
- keys `id`, `label`, `path`, `parent`, `position`, `color`, `icon`
- parent ids `sw-catalogue`, `sw-manufacturer`

## Gotchas

- Plugin entries without `parent` are dropped at registration ("Navigation entries from plugins are not allowed on the first level"). The Shopware Store also rejects plugins that add first-level menu entries.
- An entry without `label` is dropped.
- For plugin modules the factory adds 1000 to `position` (or sets 1000 if none), so plugin items sort after core items.
- The docs say an `id` is required to show up; the menu tree actually uses `id` and falls back to `path` as the node identifier. Setting `id` is still needed if other entries should nest under yours by id.

## Code check (6.7.15.1)
- confirmed `navigation` — manifest key, array of entries — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:99
- confirmed `parent` — plugin entries without `parent` are filtered out — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:293
- confirmed `label` — entries without a label are filtered out — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:312
- confirmed `position` — plugin entries get +1000 or default 1000 — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:319
- confirmed `Navigation` — keys id, path, label, position, color, icon, parent — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:53
- corrected `nodeIdentifier` — docs: entry needs an `id` to show up; tree uses `id` or falls back to `path` — vendor/shopware/administration/Resources/app/administration/src/core/helper/flattree.helper.js:67
- confirmed `sw-catalogue` — navigation id in sw-product module — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:265
- confirmed `sw-manufacturer` — navigation id in sw-manufacturer module — vendor/shopware/administration/Resources/app/administration/src/module/sw-manufacturer/index.js:68
