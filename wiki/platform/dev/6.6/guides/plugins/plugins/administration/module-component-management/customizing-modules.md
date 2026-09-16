---
id: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-modules.md
title: Customize modules
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/module-component-management/customizing-modules.html
sourceHash: f17ad8f973bc5ca4d0f74605ff8ba35a7a8562e3
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-components.md
  - platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-new-tab.md
  - platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md
keywords: ["module", "Shopware.Module.register", "routeMiddleware", "customize module", "administration module", "module directory", "add tab", "currentRoute.children", "sw.product.detail", "routeMiddleware next", "administration routes", "main.js"]
summary: Modules in the Administration cannot be overridden directly; add or change their routes with a new module's routeMiddleware in main.js.
lastBuilt: "2026-09-15"
---
## What it is

In the Administration core code, each `module` is a directory that encapsulates a whole feature — the guide gives customer, order and settings modules as examples. This page explains what parts of an existing module can and cannot be customized, and how to add or change a module's routes when they can't.

## When to use

Use this when a plugin needs to change how an existing Administration module behaves at the routing level — for example, adding a new tab to a page such as the product detail view. It does not apply to changing a module's fixed settings, and it is not the guide to follow if you only need to customize an already-defined component inside a module; that is covered by the separate customizing-components guide.

## Key steps / config

Module settings like `color`, `icon` and `navigation` are fixed by design and cannot be changed, and modules themselves cannot be directly overridden. To add or change a module's routes — for instance to add a tab to a page — register a new module and implement a `routeMiddleware` function, then add the change to the plugin's `main.js`:

```javascript
// <plugin root>/src/Resources/app/administration/src/main.js
Shopware.Module.register('my-new-custom-route', {
    routeMiddleware(next, currentRoute) {
        if (currentRoute.name === 'sw.product.detail') {
            currentRoute.children.push({
                name: 'sw.product.detail.custom',
                path: '/sw/product/detail/:id/custom',
                component: 'sw-product-detail-custom',
                meta: {
                    parentPath: "sw.product.index"
                }
            });
        }
        next(currentRoute);
    }
});
```

`routeMiddleware` is scanned while the Vue router is being set up; when the current route's `name` matches the target (`sw.product.detail` in the example), a new child route is pushed onto `currentRoute.children` — here `sw.product.detail.custom`, pointing at the `sw-product-detail-custom` component and carrying a `meta.parentPath` back to `sw.product.index`. The middleware must always call `next(currentRoute)` to hand the route back to the router.

## Essential identifiers

- `Shopware.Module.register(name, { routeMiddleware })` — registers a module and its route middleware.
- `routeMiddleware(next, currentRoute)` — the function signature used to inspect and mutate the routing tree before it is applied.
- `currentRoute.children.push(...)` — the mechanism used to add a new child route to an existing route.
- `sw.product.detail` — the example route name matched by the middleware.

## Gotchas

Because modules cannot be overridden directly, the only supported way to change a module's routes (including adding tabs) is via a separate module's `routeMiddleware`, not by editing the original module's configuration.
