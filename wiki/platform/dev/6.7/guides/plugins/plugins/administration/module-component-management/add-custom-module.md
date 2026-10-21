---
id: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md
title: Add Custom Module
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/add-custom-module.html
sourceHash: 6c47f402f1e6f09a621b79c45a7b9381a6282e56
codeCheckedAgainst: "6.7.15.1"
keywords: ["Shopware.Module.register", "registerModule", "ModuleFactory", "module.factory", "settingsItem", "navigation", "routes", "snippets", "type: plugin", "swag-example", "administration module", "custom module", "menu entry", "admin-build"]
summary: Register a custom Administration module with Shopware.Module.register - id format, type, color/icon, routes, navigation, snippets, settingsItem.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md"]
---
## What it is

How a plugin registers its own Administration module (`swag-example`) via `Shopware.Module.register()`, a wrapper around `ModuleFactory.registerModule` on the [global Shopware object](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md): directory layout, manifest keys, snippets, settings link and build.

## When to use

You need a new section in the Administration (list/detail/create pages) for your plugin's data, optionally linked from the Settings area.

## Key steps / config

1. Create `<plugin root>/src/Resources/app/administration/src/module/swag-example/index.js` — each module needs an `index.js`.
2. Load it from the entry point `main.js`: `import './module/swag-example';`
3. Register in `index.js` with `Shopware.Module.register(<moduleId>, <manifest>)`. The id must have the form `[namespace]-[name]` (contain a `-`) and be unique, otherwise registration is aborted.
4. Manifest keys: `type` (`'plugin'` for third-party; also the default when omitted), `name`, `title` (browser title, snippet key), `description` (shown as empty state), `color` (accent color, e.g. `#ff3d58`), `icon` (e.g. `regular-shopping-bag`; not the menu-entry icon), `snippets`, `routes`, `navigation`, optional `settingsItem`.
5. `routes` is mandatory (or a `routeMiddleware`); a module without a valid route is not registered. Each route key becomes the route name `<id segments joined by .>.<key>` and the path is prefixed with `/<id segments joined by />/` — so `list` in `swag-example` is `swag.example.list` at `/swag/example/list`. Details: [Add a custom route](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md).
6. `navigation` must be an array; for `type: 'plugin'` every entry needs a `parent` (first-level plugin entries are dropped) and a `label`; plugin positions are offset by 1000. Details: [Add a menu entry](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.md).
7. Snippets: keys are prefixed by the extension name, e.g. `swag-example.general.mainMenuItemGeneral`. Store them in `snippet/de-DE.json` and `snippet/en-GB.json` in the module directory and pass them via `snippets`.

```javascript
import deDE from './snippet/de-DE';
import enGB from './snippet/en-GB';

Shopware.Module.register('swag-example', {
    type: 'plugin',
    name: 'Example',
    title: 'swag-example.general.mainMenuItemGeneral',
    description: 'sw-property.general.descriptionTextModule',
    color: '#ff3d58',
    icon: 'regular-shopping-bag',
    snippets: { 'de-DE': deDE, 'en-GB': enGB },
    routes: {
        list: { component: 'swag-example-list', path: 'list' },
        detail: { component: 'swag-example-detail', path: 'detail/:id', meta: { parentPath: 'swag.example.list' } },
        create: { component: 'swag-example-create', path: 'create', meta: { parentPath: 'swag.example.list' } }
    },
    navigation: [{ label: 'swag-example.general.mainMenuItemGeneral', color: '#ff3d58', path: 'swag.example.list', icon: 'regular-shopping-bag', parent: '<parent menu id>', position: 100 }]
});
```

Snippet file shape: `{ "swag-example": { "general": { "mainMenuItemGeneral": "...", "descriptionTextModule": "..." } } }`.

8. Settings link (optional): `settingsItem` (object or array) with `group`, `icon`, `to` (route name), optional `name`/`id`/`label` (fallbacks from the module's `name`, id and `title`) and `iconComponent`. `group` + `to` + (`icon` or `iconComponent`) are required, otherwise the entry is dropped. Valid `group` values: `general`, `localization`, `customer`, `commerce`, `content`, `automation`, `system`, `account`, `plugins`.
9. Build (plugin must be active): `shopware-cli project admin-build` (template) or `composer run build:js:admin` (platform contribution setup). For a plugin "AdministrationNewModule" the output is `<plugin root>/src/Resources/public/administration/js/administration-new-module.js` — ship it; it is copied to `<shopware root>/public/bundles/administration/administrationnewmodule/administration/js/administration-new-module.js`.

## Essential identifiers

- `Shopware.Module.register`, `ModuleFactory.registerModule` (`module.factory.ts`)
- manifest: `type`, `name`, `title`, `description`, `color`, `icon`, `snippets`, `routes`, `navigation`, `settingsItem`
- route meta: `parentPath`
- `shopware-cli project admin-build`, `composer run build:js:admin`

## Gotchas

- The docs' final example has a `navigation` entry without `parent`; the installed `registerModule` rejects such entries for plugin modules, so the menu entry would not appear.
- The docs list only `shop`, `system`, `plugins` as `settingsItem.group`; `shop` is not in the installed type.
- A successful build only compiles assets; the module still needs its `main.js` import, registration, routes/components and snippets wired correctly at runtime.
- Further reading: [custom service](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md), [snippets](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-snippets.md), [customizing modules](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md), [data handling](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md), [ACL rules](platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md).

## Code check (6.7.15.1)
- confirmed `Shopware.Module.register` — maps to `ModuleFactory.registerModule` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:128
- corrected `type` — docs: pure convention; code defaults it to `'plugin'` and branches on it for navigation — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:161
- confirmed `splitModuleId` — id must match `[namespace]-[name]`, else abort — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:182
- confirmed `routes` — required unless `routeMiddleware`, else abort — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:202
- confirmed `route.name` — built from id segments joined by `.` plus route key — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:222
- corrected `navigationEntry.parent` — docs example omits it; plugin entries without it are dropped — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:293
- confirmed `navigationEntry.position` — plugin positions offset by 1000 — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:319
- corrected `settingsItem.group` — docs: shop, system, plugins — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:67
- confirmed `settingsItem.iconComponent` — group, to and icon or iconComponent required — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:518
- confirmed `snippets` — module snippets merged per locale key — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:492
