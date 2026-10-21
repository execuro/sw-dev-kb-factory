---
id: platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/overriding-routes.md
title: Override Existing Routes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/routing-navigation/overriding-routes.html
sourceHash: 18b3a01750f9de975a52427ba50a5351fb940142
codeCheckedAgainst: "6.7.15.1"
keywords: ["routeMiddleware", "Module.register", "sw.product.detail", "sw.product.detail.base", "sw-product-detail-base", "product.viewer", "product.editor", "override route", "replace admin route", "route privilege", "vue router", "administration module", "acl"]
summary: Override or replace an existing Administration route (e.g. change its required ACL privilege) via a routeMiddleware in a plugin module.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md
  - platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md
  - platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md
  - platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md
---
## What it is

How a plugin changes or fully replaces a route defined by an existing Administration module (for example, `sw.product.detail.base`) by registering its own module with a `routeMiddleware` function. Each core module lives in a `module` directory and defines routes; a `routeMiddleware` receives each module route before it is handed to the Vue Router and may rewrite it.

## When to use

- You need to change the ACL privilege a core route requires.
- You want to swap the component or meta data of an existing route, or replace the route entirely with your own.

For other module customisations see [Customizing modules](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md); for module basics see [Add custom module](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md).

## Key steps / config

1. In `<plugin root>/src/Resources/app/administration/src/main.js`, register a new module with `Module.register()`. The module id must have the `[namespace]-[name]` format. It needs no `routes` of its own — a module with only a `routeMiddleware` is accepted.
2. Implement `routeMiddleware(next, currentRoute)`: check `currentRoute.name`, modify the route (or its `children`), then call `next(currentRoute)`.

```javascript
Module.register('my-new-custom-route', {
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

This example raises the privilege of `sw.product.detail.base` from `product.viewer` to `product.editor`; the rest of the route stays the same. The middleware runs once per top-level module route when the module routes are collected for the router, so child routes are reached through the parent (`sw.product.detail`).

## Essential identifiers

- `Module.register` (`Shopware.Module.register`)
- `routeMiddleware(next, currentRoute)`
- Route names `sw.product.detail`, `sw.product.detail.base`, `sw.product.index`
- Component `sw-product-detail-base`
- Route `meta.privilege`, `meta.parentPath`
- Privileges `product.viewer`, `product.editor`

## Gotchas

- Always call `next(currentRoute)`; the middleware receives every module route, so guard on `currentRoute.name`.
- When replacing a child route, repeat every field you want to keep (`name`, `component`, `path`, `meta`) — the object is replaced, not merged.
- ACL details: [Add ACL rules](platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md); route basics: [Add custom route](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md).

## Code check (6.7.15.1)
- confirmed `routeMiddleware` — optional module option typed `(next, currentRoute) => void` — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:92
- confirmed `routeMiddleware` — module without `routes` is accepted if it has a routeMiddleware — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:202
- confirmed `routeMiddleware` — function is registered on the module middleware helper — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:266
- confirmed `getModuleRoutes` — middleware runs for each non-child module route at route collection — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:17
- confirmed `Module.register` — maps to ModuleFactory.registerModule — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:128
- confirmed `[namespace]-[name]` — module id format enforced at registration — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:185
- confirmed `sw.product.detail.base` — redirect target of the product detail route — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:185
- confirmed `sw-product-detail-base` — component of the detail `base` child route — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:196
- confirmed `product.viewer` — default privilege of the detail `base` child route — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:200
- confirmed `sw.product.index` — parentPath of the detail base child route — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/index.js:199
