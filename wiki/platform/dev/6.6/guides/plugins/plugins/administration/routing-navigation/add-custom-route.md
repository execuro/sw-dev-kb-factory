---
id: platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md
title: Add custom route
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/routing-navigation/add-custom-route.html
sourceHash: 86ed2658b4405cc75a42c41aed8e6498586143e6
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-component.md
  - platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/add-custom-service.md
  - platform/dev/6.6/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md
keywords: ["route", "routes property", "Vue Router", "administration route", "custom.module.overview", "route name", "route path", "meta parentPath", "dynamic parameter", "module.register", "administration", "component key"]
summary: How to define a routes object with name, component and path on a Shopware Administration module, including meta.parentPath and dynamic route parameters.
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to create a route from scratch for a Shopware 6 Administration module. Administration routes work like any other Vue Router route; a module declares them under its `routes` property.

## When to use

Use this when a plugin module needs a new page inside the Administration — for example a list or detail view reachable at its own URL — rather than reusing an existing route. It is the starting point referenced by other guides that build on routing, such as adding menu entries, adding custom components, and overriding existing routes.

## Key steps / config

Add a `routes` property to the module configuration; it is an object of route configuration objects keyed by route name. Each route configuration needs a `component` (the component shown for that route) and a `path` (the URL fragment used for the route):

```javascript
routes: {
    overview: {
        component: 'sw-product-list',
        path: 'overview'
    },
},
```

The route's full name is built from the module's id plus the key inside `routes`, with dashes converted to dots — for a module id `custom-module` this example results in the full route name `custom.module.overview` and the URL `/custom/module/overview` relative to the Administration's default URL.

Routes can also carry dynamic parameters and metadata, shown here on a second, `detail` route added to the same module:

```javascript
Shopware.Module.register('swag-example', {
    color: '#ff3d58',
    icon: 'default-shopping-paper-bag-product',
    title: 'My custom module',
    description: 'Manage your custom module here.',
    routes: {
        overview: {
            component: 'swag-example-list',
            path: 'overview'
        },
        detail: {
            component: 'sw-example-detail',
            path: 'detail/:id',
            meta: {
                parentPath: 'swag.example.list'
            }
        }
    },
});
```

The `path: 'detail/:id'` segment is a dynamic parameter carrying the record's ID. The `meta.parentPath` value links back to the list route and follows the pattern `<bundle-name>.<name of the route>` — dots here, not dashes — so the parent of the `detail` route above is `swag.example.list`; setting it causes a "back" button to appear on the detail page, using the module's icon, that navigates to that parent route.

## Essential identifiers

- `routes` — the module configuration property holding all route definitions.
- `component` / `path` — the two required keys on each route configuration object.
- `meta.parentPath` — links a route back to its logical parent route for the back-button UI.
- `custom.module.overview` — example of the generated full route name (module id dashes become dots).

## Gotchas

Route names are derived by replacing dashes with dots automatically, so a module id like `custom-module` never appears with dashes in the resulting route name — do not hand-write a dashed route name expecting it to match.
