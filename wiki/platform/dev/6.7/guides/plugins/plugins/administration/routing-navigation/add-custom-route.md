---
id: platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md
title: Add Custom Route
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/routing-navigation/add-custom-route.html
sourceHash: 5c3964a08c06d7b0184f91e71970e57bfaa24a85
codeCheckedAgainst: "6.7.13.0"
keywords: ["administration route", "custom route", "Shopware.Module.register", "routes", "component", "path", "meta", "parentPath", "dynamic parameter", "back button", "vue router", "routePrefixName", "routePrefixPath"]
summary: Define Administration routes in a module's routes object - route name/path derivation from module id, dynamic params, meta.parentPath back button.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md", "platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md"]
---
## What it is

How to add routes to a Shopware 6 Administration module. Administration routes are Vue Router routes, declared in the `routes` property of the object passed to `Shopware.Module.register()`.

## When to use

When a plugin module needs its own pages (list, detail, create) reachable by URL, optionally with dynamic parameters and a "back" button to a parent route.

## Key steps / config

1. In the module registration, add a `routes` object. Each key is the route's name; each value is a route config with:
   - `component` — name of the component rendered for this route (the factory remaps it to `components.default`).
   - `path` — the path segment used in the browser.
2. Name and URL are derived from the module id: dashes in the id become dots for the name and slashes for the path. Module `custom-module` with route key `overview` and `path: 'overview'` gives name `custom.module.overview` and URL `/custom/module/overview` (relative to the Administration URL). The module factory lets `routePrefixName` / `routePrefixPath` in the manifest replace these derived prefixes; a route with `coreRoute: true` is not prefixed.
3. Dynamic parameters go into `path`, e.g. `path: 'detail/:id'`.
4. `meta` carries extra route info. `meta.parentPath` names the parent route (full dotted name) and renders a "back" button top-left linking to it, using the module icon.

```javascript
Shopware.Module.register('swag-example', {
    color: '#ff3d58',
    icon: 'default-shopping-paper-bag-product',
    title: 'My custom module',
    description: 'Manage your custom module here.',
    routes: {
        list: { component: 'swag-example-list', path: 'list' },
        detail: {
            component: 'sw-example-detail',
            path: 'detail/:id',
            meta: { parentPath: 'swag.example.list' }
        }
    },
});
```

For rendering your own component on the route see [Add custom component](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md).

## Essential identifiers

- `Shopware.Module.register`
- `routes`, `component`, `path`, `meta`, `meta.parentPath`
- `routePrefixName`, `routePrefixPath`, `coreRoute`
- Name pattern `<module id with dashes as dots>.<route key>`, e.g. `swag.example.list`

## Gotchas

- The source's longer example names its first route `overview` but points `parentPath` at `swag.example.list`; per the code the name is the module prefix plus the route key, so `parentPath` must match an existing key (the snippet above uses `list` for consistency).
- The module id must contain at least one dash (`[namespace]-[name]`), otherwise registration is aborted.
- A module with neither `routes` nor `routeMiddleware` is not registered.
- Child routes declared under `children` get the name `<parent name>.<child key>` and the path `<parent path>/<child path>`.

## Code check (6.7.13.0)
- confirmed `ModuleFactory.registerModule` — backs `Shopware.Module.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:123
- confirmed `routeKey` — route name is `${routePrefixName}.${routeKey}`; docs example key `overview` vs parentPath `swag.example.list` mismatch — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:222
- confirmed `routePrefixName` — defaults to module id split on dashes joined by dots — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:219
- confirmed `routePrefixPath` — path `/${routePrefixPath}/${route.path}`, default id joined by slashes — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:225
- confirmed `coreRoute` — core routes skip path prefixing — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:228
- confirmed `component` — remapped to `components.default` — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:406
- confirmed `moduleId` — must match `[namespace]-[name]` (at least one dash) — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:182
- confirmed `routeMiddleware` — module without `routes` and without it is rejected — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:202
- confirmed `parentPath` — used in core detail route meta, e.g. `sw.product.index` — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:193
- confirmed `children` — child name `${parent name}.${key}`, path `${parent path}/${child path}` — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:385
