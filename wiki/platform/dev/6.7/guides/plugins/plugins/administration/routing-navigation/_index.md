---
id: platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/_index.md
title: Routing and Navigation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/routing-navigation/
sourceHash: 73eec8aee2b2886a0be8ca624e5fa8b0252a94cb
codeCheckedAgainst: "6.7.13.0"
keywords: ["administration routing", "admin navigation", "menu entry", "admin tab", "override route", "Shopware.Module.register", "routes", "navigation", "routeMiddleware", "vue router", "registerModule"]
summary: Index of Administration routing guides - custom routes, menu entries, tabs on existing modules, overriding core routes via routeMiddleware.
lastBuilt: 2026-09-15
---
## What it is

Overview page of the Shopware 6.7 Administration "Routing and Navigation" guides. It groups four how-tos for plugin developers working with Administration routes, menu entries and tabs:

- Add Custom Route — define the `routes` object of a module.
- Add Menu Entry — define the `navigation` array of a module.
- Add New Tab — add a tab to an existing module page (e.g. product detail) and register its child route.
- Overriding Routes — change or replace existing core routes.

## When to use

Start here when a plugin needs a new Administration page reachable by URL, a menu item that opens it, an extra tab on a core detail page, or a change to an existing core route (for example its required ACL privilege).

## Key steps / config

All four topics go through the same registration call, `Shopware.Module.register(moduleId, manifest)`, implemented by `registerModule()` in the Administration module factory. The manifest keys involved are:

- `routes` — object of route configs; each key becomes part of the route name (`<module id with dashes as dots>.<key>`) and the path is prefixed with `/<module id with dashes as slashes>/`.
- `navigation` — array of menu entries (`id`, `label`, `path`, `parent`, `position`, `color`, `icon`, `privilege`).
- `routeMiddleware(next, currentRoute)` — function called with each registered top-level route, used to add or replace child routes of existing modules.

A module must have `routes` or a `routeMiddleware`, otherwise registration is aborted with a warning.

## Essential identifiers

- `Shopware.Module.register`
- `routes`, `navigation`, `routeMiddleware`
- `registerModule` (module factory)

## Code check (6.7.13.0)
- confirmed `ModuleFactory.registerModule` — exposed as `Shopware.Module.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:123
- confirmed `routeMiddleware` — optional `(next, currentRoute)` manifest function — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:92
- confirmed `navigation` — optional array of `Navigation` entries — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:99
- confirmed `routes` — module without `routes` and without `routeMiddleware` is rejected — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:202
- confirmed `route.name` — built as `${routePrefixName}.${routeKey}` — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:222
- confirmed `middlewareHelper.go` — middleware runs for each top-level module route — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:457
