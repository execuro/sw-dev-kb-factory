---
id: platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/_index.md
title: Routing and Navigation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/routing-navigation/
sourceHash: 73eec8aee2b2886a0be8ca624e5fa8b0252a94cb
codeCheckedAgainst: "6.7.15.1"
keywords: ["routing", "navigation", "admin routes", "menu entry", "tabs", "overriding routes", "Shopware.Module.register", "routes", "routeMiddleware", "vue router", "administration", "main menu"]
summary: "Index of Administration guides on routing and navigation: custom routes, menu entries, new tabs on existing modules, and overriding routes."
lastBuilt: 2026-10-21
---
## What it is

Landing page for the Administration guides on adding and managing routes, main-menu entries and tabs in plugin modules. It lists four guides:

- Add Custom Route — define the `routes` of a module (route name, `component`, `path`, `meta`).
- Add Menu Entry — the `navigation` array of a module and how entries are nested under a parent.
- Add New Tab (Add Tab to Existing Module) — extend a core detail page with an extra tab and register its child route.
- Overriding Routes — replacing or adjusting existing Administration routes.

## When to use

Start here when a plugin needs to make an Administration module reachable (route plus menu entry) or add a view to an existing core page.

## Key steps / config

All three mechanisms the sub-guides cover are keys of the module manifest passed to `Shopware.Module.register(moduleId, manifest)`:

- `routes` — object of route configs; the final route name is the module id with dashes turned into dots plus the route key.
- `navigation` — array of menu entries; plugin entries must set `parent`.
- `routeMiddleware(next, currentRoute)` — hook called for routes, used to inject child routes into core modules (the tab guide's approach).

A module needs either `routes` or a `routeMiddleware`, otherwise registration is aborted.

## Essential identifiers

- `Shopware.Module.register`
- `routes`, `navigation`, `routeMiddleware`

## Code check (6.7.15.1)
- confirmed `registerModule` — `Shopware.Module.register` maps to `ModuleFactory.registerModule` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:128
- confirmed `routeMiddleware` — manifest key `(next, currentRoute)` — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:92
- confirmed `navigation` — manifest key, array of entries — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:99
- confirmed `routes` — module without `routes` or `routeMiddleware` is rejected — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:202
- confirmed `parent` — plugin navigation entries without `parent` are dropped — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:293
