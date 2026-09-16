---
id: platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/overriding-routes.md
title: Override Existing Routes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/routing-navigation/overriding-routes.html
sourceHash: 18b3a01750f9de975a52427ba50a5351fb940142
codeCheckedAgainst: "6.7.13.0"
keywords: ["override route", "replace admin route", "routeMiddleware", "Shopware.Module.register", "sw.product.detail", "sw.product.detail.base", "sw-product-detail-base", "privilege", "product.viewer", "product.editor", "acl", "route children"]
summary: Override or replace existing Administration routes by registering a module with routeMiddleware that edits currentRoute.children, e.g. route privileges.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md", "platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md"]
---
## What it is

How a plugin changes or replaces routes defined by core Administration modules (each core module lives in a `module` directory and defines its own routes). The mechanism is a module's `routeMiddleware`, which receives each registered route and can modify it before it is added to the router.

## When to use

When you need to alter an existing route — for example change the ACL privilege a route requires, or point it at your own component — without editing core code. Other module customizations are covered in [Customizing modules](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md).

## Key steps / config

1. In `<plugin root>/src/Resources/app/administration/src/main.js`, register a new module that only implements `routeMiddleware`.
2. Match the parent route by `currentRoute.name`, locate the child in `currentRoute.children` (an array at this point), replace it, then call `next(currentRoute)`:

```javascript
Shopware.Module.register('my-new-custom-route', {
    routeMiddleware(next, currentRoute) {
        if (currentRoute.name === 'sw.product.detail') {
            const childIndex = currentRoute.children.findIndex(child => child.name === 'sw.product.detail.base');
            currentRoute.children[childIndex] = {
                name: 'sw.product.detail.base',
                component: 'sw-product-detail-base',
                path: 'base',
                meta: { parentPath: 'sw.product.index', privilege: 'product.editor' }
            };
        }
        next(currentRoute);
    }
});
```

This changes the privilege required for `sw.product.detail.base` from `product.viewer` to `product.editor`; the rest of the route config stays as in core.

## Essential identifiers

- `Shopware.Module.register`, `routeMiddleware(next, currentRoute)`
- `sw.product.detail`, `sw.product.detail.base`, `sw-product-detail-base`, `sw.product.index`
- `meta.privilege`: `product.viewer`, `product.editor`

## Gotchas

- The source snippet calls a bare `Module.register`; in plugin code use `Shopware.Module.register` (or destructure `Module` from `Shopware` first).
- A module with only `routeMiddleware` and no `routes` is valid; its id still needs a dash (`[namespace]-[name]`).
- The middleware runs for every top-level module route, so guard on `currentRoute.name` and always call `next(currentRoute)`.
- Replacing the child object replaces the whole config — copy over every key you want to keep. See [ACL rules](platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md) for privileges and [Add custom route](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md) for route config.

## Code check (6.7.13.0)
- confirmed `ModuleFactory.registerModule` — exposed as `Shopware.Module.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:123
- confirmed `routeMiddleware` — typed `(next, currentRoute)` on the module manifest — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:92
- confirmed `routeMiddleware` — module with only a middleware is registered (no routes needed) — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:265
- confirmed `middlewareHelper.go` — called for each non-child module route — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:457
- confirmed `routeDefinition.children` — children object converted to an array before middleware — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:368
- confirmed `sw.product.detail.base` — core child route name — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:186
- confirmed `sw-product-detail-base` — component of detail `base` child, path `base` — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:197
- confirmed `product.viewer` — privilege of detail `base` child in core — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:201
- confirmed `sw.product.index` — `parentPath` of detail `base` child — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:200
