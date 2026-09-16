---
id: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md
title: Add Custom Module
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/add-custom-module.html
sourceHash: 6c47f402f1e6f09a621b79c45a7b9381a6282e56
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom module", "Shopware.Module.register", "ModuleFactory", "registerModule", "settingsItem", "navigation", "routes", "snippets", "type plugin", "admin menu entry", "settings page", "main.js", "shopware-cli project admin-build", "composer run build:js:admin"]
summary: Shopware.Module.register config for an Administration module - id format, routes, plugin navigation parent, snippets, settingsItem, build
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-snippets.md"]
---
## What it is

How a plugin registers its own Administration module (e.g. `swag-example`): directory layout, `Shopware.Module.register()` configuration (type, name, title, description, color, icon, routes, navigation, snippets, `settingsItem`) and building the Administration assets. `Shopware.Module.register` is the plugin-facing wrapper of `ModuleFactory.registerModule` on the [global `Shopware` object](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md).

## When to use

A plugin needs its own Administration area with routes and a menu entry, or a page linked into the Settings section.

## Key steps / config

1. Create `<plugin root>/src/Resources/app/administration/src/module/swag-example/index.js` and load it from `main.js` with `import './module/swag-example';` — the module is unknown until imported.
2. Register the module. First argument: the module id, which must have the format `[namespace]-[name]` (at least one `-`) and be unique; second: the config object.
3. Config keys:
   - `type`: `'plugin'` for third-party modules (`'core'` for core); defaults to `'plugin'` if omitted.
   - `name` (unique), `title` (browser title, snippet key), `description` (shown in empty states), `color` (primary accent, e.g. `#ff3d58`), `icon` (e.g. `regular-shopping-bag`; not the menu entry icon).
   - `routes`: object keyed by route key; required (or a `routeMiddleware`) or registration aborts. Route names become `<id with - replaced by .>.<routeKey>` (e.g. `swag.example.list`), paths are prefixed `/swag/example/`.
   - `navigation`: array of entries with `label` and `path`/`id`/`link`; for `type: 'plugin'` each entry needs a `parent`.
   - `snippets`: object per locale (`de-DE`, `en-GB`), merged into the Administration translations; keys are prefixed with the extension name, e.g. `swag-example.general.mainMenuItemGeneral`.
4. Skeleton (routes/navigation details in [add a custom route](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md) and [add a menu entry](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.md)):

```javascript
import deDE from './snippet/de-DE';
import enGB from './snippet/en-GB';

Shopware.Module.register('swag-example', {
    type: 'plugin', name: 'Example',
    title: 'swag-example.general.mainMenuItemGeneral',
    description: 'swag-example.general.descriptionTextModule',
    color: '#ff3d58', icon: 'regular-shopping-bag',
    snippets: { 'de-DE': deDE, 'en-GB': enGB },
    routes: { list: { component: 'swag-example-list', path: 'list' },
        detail: { component: 'swag-example-detail', path: 'detail/:id', meta: { parentPath: 'swag.example.list' } } },
    navigation: [{ label: 'swag-example.general.mainMenuItemGeneral', path: 'swag.example.list', parent: '<parent menu id>', position: 100 }],
});
```

   Snippet file `snippet/en-GB.json`: `{ "swag-example": { "general": { "mainMenuItemGeneral": "...", "descriptionTextModule": "..." } } }`.
5. Settings link: add `settingsItem` (object or array) with `group`, `to` (route name, e.g. `swag.plugin.list`) and `icon` or `iconComponent`; `id`, `name`, `label` fall back to the module id, `name` and `title`. Valid `group` values: `general`, `localization`, `customer`, `commerce`, `content`, `automation`, `system`, `account`, `plugins`.
6. Build (plugin must be active): `shopware-cli project admin-build` (project template) or `composer run build:js:admin` (platform contribution setup). Output for plugin "AdministrationNewModule": `<plugin root>/src/Resources/public/administration/js/administration-new-module.js`; ship it with the plugin — it is copied to `<shopware root>/public/bundles/administrationnewmodule/administration/js/administration-new-module.js`.

## Essential identifiers

- `Shopware.Module.register`, `ModuleFactory.registerModule`
- Config: `type`, `name`, `title`, `description`, `color`, `icon`, `routes`, `navigation`, `snippets`, `settingsItem`
- `settingsItem`: `group`, `to`, `icon`, `iconComponent`, `id`, `name`, `label`
- `shopware-cli project admin-build`, `composer run build:js:admin`

## Gotchas

- The source's final example has a `navigation` entry without `parent`; for `type: 'plugin'` the installed code drops such entries with the warning "Navigation entries from plugins are not allowed on the first level". Plugin entry positions are also offset by 1000.
- The source lists `settingsItem.group` options as 'shop', 'system', 'plugins'; the installed type allows the nine groups listed above ('shop' is not among them).
- A `settingsItem` lacking `group`, `to`, or both `icon` and `iconComponent` is not registered.
- `display: false` in the config skips registration; a duplicate id also aborts.
- The source says snippet files load automatically from the `snippet` folder; the module factory itself only reads the `snippets` config key, so pass the imported files there as in the example.
- A successful build only compiles assets; the module still needs the `main.js` import, registration, routes/components and snippets wired correctly.
- The source's `description` example uses `sw-property.general.descriptionTextModule` (a core key); use your own key.

## Code check (6.7.13.0)
- confirmed `ModuleFactory.registerModule` — exposed as `Shopware.Module.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:123
- confirmed `module.type` — defaults to `'plugin'` when omitted — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:161
- confirmed `[namespace]-[name]` — module id must contain a hyphen or registration aborts — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:185
- confirmed `routes` — required unless `routeMiddleware` is set — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:202
- confirmed `routePrefixName` — route name is id segments joined by `.` plus route key — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:219
- corrected `navigationEntry.parent` — docs: plugin navigation example without `parent`; code rejects it for plugins — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:293
- corrected `group` — docs: 'shop', 'system', 'plugins'; code allows general, localization, customer, commerce, content, automation, system, account, plugins — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:67
- confirmed `settingsItem.iconComponent` — group, to and icon or iconComponent required — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:523
- confirmed `manifest.snippets` — per-locale snippet objects merged from module config — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:487
- unverified `composer run build:js:admin` — platform root composer.json, out of scope
