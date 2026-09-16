---
id: platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/overriding-routes.md
title: Override existing routes
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/routing-navigation/overriding-routes.html
sourceHash: f19c7f3dad8c457fdd0c96c9d2b6b8c8e1ee59a4
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-module.md
  - platform/dev/6.6/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md
keywords: ["routeMiddleware", "override route", "Module.register", "administration route", "sw.product.detail.base", "route privilege", "product.editor", "product.viewer", "currentRoute.children", "administration module", "ACL"]
summary: How to override or change an existing Administration route's config, such as its required privilege, by registering a new module with a routeMiddleware.
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to override or change an existing Shopware 6 Administration route — for example to change the privileges a route requires, or to replace it with a custom one. As with customizing modules, each module lives in a `module` directory and defines routes that can be extended via `routeMiddleware`.

## When to use

Use this when an existing route's configuration needs to change — such as tightening or loosening the ACL privilege required to access it — rather than adding an entirely new route. It builds on a basic understanding of what modules are and requires familiarity with Vue and the Vue Router.

## Key steps / config

Create a new module and implement a `routeMiddleware` in its `main.js`. The middleware finds the target child route inside `currentRoute.children` and replaces it in place:

```javascript
// <plugin root>/src/Resources/app/administration/src/main.js
Module.register('my-new-custom-route', {
    routeMiddleware(next, currentRoute) {
        if (currentRoute.name === 'sw.product.detail') {
            const childIndex = currentRoute.children.findIndex(child => child.name === 'sw.product.detail.base');

            currentRoute.children[childIndex] = {
                name: 'sw.product.detail.base',
                component: 'sw-product-detail-base',
                path: 'base',
                meta: {
                    parentPath: 'sw.product.index',
                    privilege: 'product.editor'
                }
            }
        }
        next(currentRoute);
    }
});
```

The middleware first checks whether `currentRoute.name` matches `sw.product.detail`, then locates the index of the `sw.product.detail.base` child route with `findIndex`, and overwrites that array entry with a new route configuration object that keeps the same `name`, `component` and `path` but changes `meta.privilege` from `product.viewer` to `product.editor`. The rest of the route's configuration is left unchanged in this example. As with any `routeMiddleware`, `next(currentRoute)` must still be called to pass the (possibly modified) route back to the router.

## Essential identifiers

- `routeMiddleware(next, currentRoute)` — the module hook used to intercept and rewrite routes during router setup.
- `currentRoute.children.findIndex(...)` — locates the child route to replace.
- `meta.privilege` — the ACL privilege key on a route's `meta`, changed here from `product.viewer` to `product.editor`.
- `sw.product.detail.base` — the example route name being overridden.

## Gotchas

Overriding a route this way replaces the whole child route entry at that array index, so any field not explicitly re-specified (name, component, path, meta) must be repeated in the replacement object or it is lost — the example keeps `name`, `component` and `path` unchanged only because they are written out again.
