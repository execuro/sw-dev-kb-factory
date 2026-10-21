---
id: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md
title: Customize Modules
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/customizing-modules.html
sourceHash: db7cf7d122d633292f1965cb1383809afe225d8e
codeCheckedAgainst: "6.7.15.1"
keywords: ["Shopware.Module.register", "routeMiddleware", "currentRoute.children", "sw.product.detail", "customize module", "module routes", "add child route", "add tab", "vue router", "main.js", "administration module"]
summary: "Core modules can't be overridden; use Module.register with routeMiddleware to add child routes to existing routes like sw.product.detail."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md"]
---
## What it is

How a plugin changes an existing Administration module. A module (under `module/` in the Administration core) is an encapsulated feature unit such as customers, orders or settings. Modules themselves cannot be overridden; module settings like `color`, `icon` and `navigation` are fixed. Route changes are made by registering a new module that carries a `routeMiddleware`.

## When to use

You need to add or change routes of a core module, for example adding a tab (child route) to the product detail page. For changing the components inside a module, see [Customizing components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md).

## Key steps / config

In `<plugin root>/src/Resources/app/administration/src/main.js`, register a new module whose `routeMiddleware(next, currentRoute)` inspects each route while the Vue router is set up and pushes a child route onto the matching one:

```javascript
Shopware.Module.register('my-new-custom-route', {
    routeMiddleware(next, currentRoute) {
        if (currentRoute.name === 'sw.product.detail') {
            currentRoute.children.push({
                name: 'sw.product.detail.custom',
                path: '/sw/product/detail/:id/custom',
                component: 'sw-product-detail-custom',
                meta: { parentPath: 'sw.product.index' },
            });
        }
        next(currentRoute);
    },
});
```

Always call `next(currentRoute)` so the route continues to be registered. A full tab example is in [Add tab to existing module](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md); adding a standalone route is in [Adding a route](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md).

## Essential identifiers

- `Shopware.Module.register(moduleId, manifest)`
- `routeMiddleware(next, currentRoute)`
- `currentRoute.name`, `currentRoute.children`
- `sw.product.detail` (route name of module `sw-product`, route key `detail`)
- `meta.parentPath`

## Gotchas

- The module id must be unique and follow `[namespace]-[name]` (at least one `-`); otherwise registration is aborted with a warning.
- A module without `routes` and without a `routeMiddleware` is not registered; a middleware-only module is valid.
- Route names are derived from the module id: dashes become dots, then `.<routeKey>` is appended (`sw-product` + `detail` = `sw.product.detail`).

## Code check (6.7.15.1)
- confirmed `Shopware.Module.register` — maps to `ModuleFactory.registerModule` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:128
- confirmed `routeMiddleware` — manifest option `(next, currentRoute) => void` — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:92
- confirmed `routeMiddleware` — registered via `middlewareHelper.use()` when it is a function — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:265
- confirmed `routeMiddleware` — module without routes or middleware is aborted — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:202
- confirmed `modules.has` — duplicate module id aborts registration — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:170
- confirmed `splitModuleId` — id must match `[namespace]-[name]` — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:182
- confirmed `route.name` — built as `${routePrefixName}.${routeKey}` from the dotted module id — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:222
- confirmed `sw-product` — core module whose `detail` route yields `sw.product.detail` — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:118
