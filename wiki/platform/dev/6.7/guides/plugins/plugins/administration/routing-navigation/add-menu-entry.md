---
id: platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.md
title: Add Menu Entry
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.html
sourceHash: 02f1b9945a5a2c38fc18059deccf8e190dcb8edc
codeCheckedAgainst: "6.7.13.0"
keywords: ["admin menu entry", "main menu", "navigation", "Shopware.Module.register", "parent", "sw-catalogue", "sw-manufacturer", "position", "label", "menu nesting", "sidebar item", "plugin menu"]
summary: Add an Administration menu entry via the module navigation array - id, label, path, parent category; plugins cannot add first-level entries.
lastBuilt: 2026-09-15
---
## What it is

How to add a menu entry to the Shopware 6 Administration main menu for a plugin module, using the `navigation` key of the module registration.

## When to use

When a custom Administration module (registered with `Shopware.Module.register`) needs a clickable entry in the main menu that opens one of its routes.

## Key steps / config

1. Register the module in `<plugin root>/src/Resources/app/administration/src/module/swag-example/index.js` with `Shopware.Module.register('swag-plugin', { ... })`.
2. Add a `navigation` array; each object is one menu entry pointing to a route of the module:

```javascript
navigation: [{
    id: 'swag-custommodule-list',
    label: 'CustomModule',
    color: '#ff3d58',
    path: 'swag.custommodule.list',
    icon: 'default-shopping-paper-bag-product',
    parent: 'sw-catalogue',
    position: 100
}]
```

| Key | Meaning |
|---|---|
| `id` | Entry id; other entries reference it as `parent`. |
| `label` | Text shown for the entry (required — entries without it are dropped). |
| `color` | Theme color of the entry; may differ from the module color. |
| `path` | Route name: module id with dashes as dots plus route key, e.g. `swag-example` + `index` = `swag.example.index`. |
| `icon` | Separate icon, useful with several entries per module. |
| `parent` | `id` of the menu entry to nest under (required for plugin modules). |
| `position` | Higher value = lower in the list. |

3. Find valid parent ids in the `navigation` of core modules' `index.js` (e.g. `sw-catalogue` in `sw-product`, `sw-manufacturer` in `sw-manufacturer`).

## Essential identifiers

- `Shopware.Module.register`, `navigation`
- `id`, `label`, `color`, `path`, `icon`, `parent`, `position`
- Parent ids `sw-catalogue`, `sw-manufacturer`

## Gotchas

- Plugin modules may not add first-level entries: an entry of a `plugin`-type module without `parent` is filtered out with the warning "Navigation entries from plugins are not allowed on the first level." The Shopware Store also rejects plugins with first-level menu entries.
- `navigation` must be an array, otherwise module registration is aborted.
- For plugin modules the factory adds 1000 to `position` (or sets 1000 if none), so plugin entries sort after core entries.
- The source says nesting depth is unlimited; the 6.7 menu supports at most three levels — an entry nested on level 4 or deeper is removed with a console error. Using `sw-manufacturer` as `parent` puts the entry on level 3.

## Code check (6.7.13.0)
- confirmed `navigation` — must be an array, else registration aborted — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:285
- confirmed `parent` — plugin entries without it are dropped (no first level) — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:293
- confirmed `label` — entries without a label are dropped — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:312
- confirmed `position` — plugin entries get `+= 1000` (default 1000) — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:319
- confirmed `id` — declared as required `string` on `Navigation` — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:56
- corrected `levelThreeParent` — docs: infinite depth nesting; menu supports up to three levels, deeper entries removed — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-admin-menu/index.js:114
- confirmed `sw-catalogue` — core parent navigation id — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:266
- confirmed `sw-manufacturer` — navigation id with parent `sw-catalogue` — vendor/shopware/administration/Resources/app/administration/src/module/sw-manufacturer/index.js:68
