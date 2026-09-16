---
id: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-module.md
title: Add custom module
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/module-component-management/add-custom-module.html
sourceHash: d51e04f10ec91b1f7ff2cc1c6b954f78531f1cd9
keywords: ["custom module", "Shopware.Module.register", "module.factory", "main.js", "routes", "navigation", "snippets", "settingsItem", "index.js", "swag-example", "module type plugin", "de-DE en-GB"]
summary: How to create a new Administration module with Shopware.Module.register, configure it, and register menu, routes and snippets.
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.md
  - platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md
  - platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-component.md
  - platform/dev/6.6/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md
---
## What it is

Explains how each Administration module lives in its own directory under `module`, and walks through creating, configuring, and registering a new custom module for a plugin.

## When to use

Use this when a plugin needs an entirely new module (a self-contained feature area with its own routes, menu entry, and translations) rather than extending an existing one.

## Key steps / config

1. Create `<plugin root>/src/Resources/app/administration/src/module/swag-example/index.js` and import it from `main.js`:

```javascript
import './module/swag-example';
```

2. Register the module with `Shopware.Module.register('swag-example', { ... })` (internally calls `ModuleFactory.registerModule`, but plugins should not call that directly).
3. Configure basics: `color` (e.g. `#ff3d58`), `icon` (e.g. `regular-shopping-bag`), `title`, `description`. `routes` (an object of route configs) and `navigation` (menu entries) are covered by dedicated guides.
4. Set `type: 'plugin'` and a unique `name`. Only `type: 'plugin'` and `type: 'core'` exist; `plugin` is the only value module.factory branches on, so it is convention rather than validated.
5. Add translations via a `snippets` object keyed by locale (`de-DE`, `en-GB`), or split into `snippet/de-DE.json` / `snippet/en-GB.json` files:

```json
{
    "swag-example": {
        "general": {
            "mainMenuItemGeneral": "My custom module"
        }
    }
}
```

6. Build with `./bin/build-administration.sh` or, in a platform contribution setup, `composer run build:js:admin`. Output is minified to `<plugin root>/src/Resources/public/administration/js/<plugin-name>.js`.
7. Optional: link the module into Settings via `settingsItem` (`group`, `icon`, `to`, `name`, `id`, `label`, `iconComponent`); `group` must be `shop`, `system`, or `plugins`.

Final module shape (structure only):

```javascript
Shopware.Module.register('swag-example', {
    type: 'plugin',
    name: 'Example',
    title: '...',
    description: '...',
    color: '#ff3d58',
    icon: 'regular-shopping-bag',
    snippets: { 'de-DE': deDE, 'en-GB': enGB },
    routes: { list: {}, detail: {}, create: {} },
    navigation: [{ label: '...', path: 'swag.example.list' }]
});
```

## Essential identifiers

- `Shopware.Module.register(name, config)`
- `ModuleFactory.registerModule`
- `type`, `name`, `title`, `description`, `color`, `icon`, `snippets`, `routes`, `navigation`, `settingsItem`
- `settingsItem.group` values: `shop`, `system`, `plugins`

## Gotchas

Shopware requires an `index.js` for each module. The module's title falls back to a Vuei18n translation key, so an unresolved snippet key is printed as-is until snippets are added. The plugin must be activated for the built JS to load.
