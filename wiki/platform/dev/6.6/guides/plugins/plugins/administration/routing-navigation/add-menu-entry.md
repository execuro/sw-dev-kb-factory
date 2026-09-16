---
id: platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.md
title: Add menu entry
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.html
sourceHash: cf007a06ff76ba820264d7535ba2eb6f2544e803
keywords: ["menu entry", "navigation key", "Shopware.Module.register", "module configuration", "navigation array", "parent property", "menu nesting", "sw-catalogue", "admin menu", "administration navigation", "menu position", "module navigation id"]
summary: How to define a navigation array on a Shopware Administration module to add a menu entry, including its parent, icon and nesting.
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to add a menu entry for a Shopware 6 Administration module so that the module can be opened from the main menu. The menu entry is configured via the `navigation` key on the module configuration passed to `Shopware.Module.register`.

## When to use

Use this once a module and its routes already exist and it needs to be reachable from the Administration's navigation menu, rather than only via a direct URL. The guide explicitly does not cover creating the plugin or module itself — it assumes a plugin base and, ideally, an existing custom module are already in place.

## Key steps / config

`navigation` takes an array of objects, each configuring a menu entry connected to a route of the module:

```javascript
// <plugin root>/src/Resources/app/administration/src/module/swag-example/index.js
navigation: [{
    label: 'CustomModule',
    color: '#ff3d58',
    path: 'swag.custommodule.list',
    icon: 'default-shopping-paper-bag-product',
    parent: 'sw-catalogue',
    position: 100
}]
```

The configurable keys are: `label` (the text shown for the entry), `color` (the module's theme color, which may differ from the module's own color), `path` (which configured route to open, composed of the module id and path name with dashes converted to dots), `icon` (an optional icon overriding the module's default, useful when a module has several menu entries), and `position` (higher values sort the entry lower in the menu).

Because plugin modules are not allowed to add entries at the first level of the main menu, the `parent` property must point at the id of the category the entry should be nested under, and the entry itself needs its own `id` to be shown in the rendered navigation:

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

Parent ids can be found in the `navigation` property of another module's `index.js`, inside its `Module.register` call, and the `parent` can itself be nested to any depth — for example a menu entry using `sw-manufacturer` as its `parent` ends up on the third menu level.

## Essential identifiers

- `navigation` — the module configuration array holding menu entry definitions.
- `label`, `color`, `path`, `icon`, `parent`, `position`, `id` — the fields of a navigation entry object.
- `sw-catalogue` — example parent category id used to nest a menu entry.

## Gotchas

Plugins that create a menu entry on the first level of the main menu are rejected from the Shopware Store, so `parent` must always reference an existing category or module id rather than being omitted.
