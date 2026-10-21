---
id: platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md
title: Add Custom Route
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/routing-navigation/add-custom-route.html
sourceHash: 5c3964a08c06d7b0184f91e71970e57bfaa24a85
codeCheckedAgainst: "6.7.15.1"
keywords: ["routes", "Shopware.Module.register", "parentPath", "meta", "route name", "dynamic route parameter", "detail/:id", "vue router", "admin route", "back button", "routePrefixName", "routePrefixPath", "coreRoute"]
summary: "Admin module routes: the routes object (component, path, meta.parentPath), how route names/URLs derive from the module id, and dynamic :id params."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md", "platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md"]
---
## What it is

Administration routes are Vue Router routes declared in the `routes` property of a module registered with `Shopware.Module.register`. Each key of `routes` is a route configuration with a `component` (registered component name to render) and a `path`; the module factory derives the full route name and URL from the module id.

## When to use

When a plugin module needs pages (list, detail, create) reachable in the Administration, or when a detail page needs a dynamic id and a "back" button to its list.

## Key steps / config

1. Add `routes` to the module manifest; the key becomes the route's short name:
   ```javascript
   Shopware.Module.register('swag-example', {
       color: '#ff3d58',
       icon: 'default-shopping-paper-bag-product',
       title: 'My custom module',
       description: 'Manage your custom module here.',
       routes: {
           overview: { component: 'swag-example-list', path: 'overview' },
           detail: {
               component: 'sw-example-detail',
               path: 'detail/:id',
               meta: { parentPath: 'swag.example.overview' }
           }
       }
   });
   ```
2. Naming: the full route name is `<module id with dashes replaced by dots>.<route key>` and the URL is `/<module id with dashes replaced by slashes>/<path>`. Module `custom-module` + key `overview` gives `custom.module.overview` at `/custom/module/overview`. `routePrefixName` / `routePrefixPath` in the manifest override the prefixes; routes with `coreRoute: true` keep their path unprefixed.
3. Dynamic parameters: use Vue Router syntax in `path`, e.g. `detail/:id`.
4. `meta.parentPath` holds the full name of the parent route; `sw-page` uses it to render a back button (with the module icon) on the top left.
5. Render your own component on the route — see [Add custom component](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md).

## Essential identifiers

- `Shopware.Module.register(moduleId, manifest)`
- `routes.<key>.component`, `routes.<key>.path`, `routes.<key>.meta.parentPath`
- `routePrefixName`, `routePrefixPath`, `coreRoute`

## Gotchas

- `parentPath` must match an existing full route name. The source example points to `swag.example.list` although its list route key is `overview`; with that manifest the real name is `swag.example.overview`.
- The module id must have at least two dash-separated parts (`[namespace]-[name]`), otherwise registration is aborted.
- Related guides: [Add custom service](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md), [Customizing modules](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md), [Add ACL rules](platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md).

## Code check (6.7.15.1)
- confirmed `registerModule` — `Shopware.Module.register` maps to `ModuleFactory.registerModule` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:128
- confirmed `routePrefixName` — default prefix is module id split on `-` joined with `.` — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:219
- confirmed `route.name` — rewritten to `${routePrefixName}.${routeKey}` — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:222
- confirmed `routePrefixPath` — path rewritten to `/<prefix>/<path>` unless `coreRoute` — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:225
- confirmed `coreRoute` — core routes are not nested — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:228
- confirmed `[namespace]-[name]` — module id format check — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:185
- confirmed `parentPath` — read from `$route.meta.parentPath` by sw-page — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-page/index.js:231
