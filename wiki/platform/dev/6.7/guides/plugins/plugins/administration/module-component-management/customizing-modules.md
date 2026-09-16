---
id: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md
title: Customize Modules
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/customizing-modules.html
sourceHash: db7cf7d122d633292f1965cb1383809afe225d8e
codeCheckedAgainst: "6.7.13.0"
keywords: ["routeMiddleware", "Shopware.Module.register", "currentRoute.children", "parentPath", "sw.product.detail", "main.js", "administration module", "customize module", "add child route", "vue router", "route middleware", "extend existing module routes"]
summary: Administration modules cannot be overridden; add or change routes of an existing module by registering a new module with a routeMiddleware in main.js.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md"]
---
## What it is

In the Administration core, each feature (customers, orders, settings, ...) is a `module`. Modules themselves cannot be overridden directly; this page shows the one supported way to change an existing module's routes: register a new module whose `routeMiddleware` edits routes while the Vue router is set up.

## When to use

- You need to add or change routes of an existing module, e.g. add a tab (child route) to the product detail page.
- To change components inside existing modules, use [Customizing components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md) instead.

## Key steps / config

1. In `<plugin root>/src/Resources/app/administration/src/main.js`, register a new module with `Shopware.Module.register(...)`.
2. Give it a `routeMiddleware(next, currentRoute)` function. The module factory accepts a module that has no `routes` as long as it provides a `routeMiddleware` function; the middleware is registered with the router middleware helper.
3. Inside, match `currentRoute.name`, push a child route into `currentRoute.children`, then call `next(currentRoute)`.

```javascript
Shopware.Module.register('my-new-custom-route', {
    routeMiddleware(next, currentRoute) {
        if (currentRoute.name === 'sw.product.detail') {
            currentRoute.children.push({
                name: 'sw.product.detail.custom',
                path: '/sw/product/detail/:id/custom',
                component: 'sw-product-detail-custom',
                meta: { parentPath: 'sw.product.index' }
            });
        }
        next(currentRoute);
    }
});
```

A full tab example is in [Add tab to existing module](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md); new standalone routes are covered in [Adding a route](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md).

## Essential identifiers

- `Shopware.Module.register`
- `routeMiddleware(next, currentRoute)`
- `currentRoute.name`, `currentRoute.children`
- `meta.parentPath`
- `sw.product.detail` (existing route), `sw-product-detail-custom` (your component)

## Gotchas

- Module settings such as `color`, `icon` and `navigation` of an existing module are fixed by design and cannot be changed.
- The docs text calls it `routeMiddleWare` in prose; the actual manifest key is `routeMiddleware` (lower-case `w`).
- Always call `next(currentRoute)`, otherwise the route is not passed on.

## Code check (6.7.13.0)
- confirmed `routeMiddleware` — optional manifest key typed `(next, currentRoute) => void` — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:92
- confirmed `module.routeMiddleware` — a module without routes is accepted if it has a routeMiddleware — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:202
- confirmed `middlewareHelper.use` — the routeMiddleware function is registered as router middleware — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:266
- confirmed `parentPath` — router factory reads `to.meta.parentPath` — vendor/shopware/administration/Resources/app/administration/src/core/factory/router.factory.js:193
- confirmed `sw-product` — core module whose `detail` route yields `sw.product.detail` — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:117
