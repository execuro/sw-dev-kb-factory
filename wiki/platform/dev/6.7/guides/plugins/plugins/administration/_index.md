---
id: platform/dev/6.7/guides/plugins/plugins/administration/_index.md
title: Administration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/
sourceHash: 3a1409dd09f13a0be47065aa108492f589de6e73
codeCheckedAgainst: "6.7.15.1"
keywords: ["administration plugin", "admin extension", "Shopware.Module.register", "Shopware.Component.register", "Shopware.Store", "pinia", "vuex", "meteor admin sdk", "single file components", "acl", "admin module", "admin workflow"]
summary: Entry page for extending the Shopware Administration from a plugin, with the recommended workflow from module and route to components, data, ACL and state.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md"]
---
## What it is

Overview of the Administration section of the plugin guides: how a plugin adds modules, routes, components, services, permissions and UI logic to the Shopware backend interface, and in which order to approach it.

## When to use

You extend the Administration from a plugin, e.g. adding a custom module, registering routes and navigation entries, creating Vue components, working with repositories/API data, handling ACL permissions, injecting services, or customizing templates and styling. For stable cross-version extension points, apps and plugins can use the [Meteor Admin SDK](platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md).

## Key steps / config

Recommended workflow:

1. [Add a custom module](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md) (`Shopware.Module.register`) and a [menu entry](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.md).
2. [Add custom routes](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md).
3. [Add custom components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md) (`Shopware.Component.register` / `extend` / `override`) and [use base components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/using-base-components.md).
4. Connect [data](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md) via repositories or [API requests](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/making-api-requests.md).
5. Handle permissions and [add ACL rules](platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md).
6. [Inject services](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/injecting-services.md) and [extend services](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/extending-services.md).
7. [Customize templates](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md) and [add custom styles](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md).
8. Manage state with Pinia through `Shopware.Store` ([Pinia guide](platform/dev/6.7/guides/upgrades-migrations/administration/pinia.md)).
9. Optional: the experimental [Single File Component extension system](platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/_index.md) and its [tutorial](platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/tutorial/_index.md).

Advanced: [mixins and directives](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md), [extending webpack](platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/extending-webpack.md).

## Essential identifiers

- `Shopware.Module.register`
- `Shopware.Component.register`, `Shopware.Component.extend`, `Shopware.Component.override`
- `Shopware.Store` (Pinia)

## Gotchas

- Step 8 of the docs also offers [Vuex](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-vuex-state.md); in the installed code the Vuex-based `Shopware.State` is deprecated (`tag:v6.8.0`, "use Store instead") — use `Shopware.Store`.
- The Options API with TwigJS templates remains the stable way; native Vue Single File Components are experimental.

## Version notes

- Single File Components as an alternative to the Options API/TwigJS: available since 6.7.16.0 per the docs (experimental).
- `Shopware.State` (Vuex) is scheduled for removal in 6.8.0.

## Code check (6.7.15.1)
- confirmed `Shopware.Module.register` — maps to `ModuleFactory.registerModule` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:128
- confirmed `Shopware.Component.register` — maps to `AsyncComponentFactory.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:135
- confirmed `Shopware.Component.extend` — maps to `AsyncComponentFactory.extend` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:136
- confirmed `Shopware.Component.override` — maps to `AsyncComponentFactory.override` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:137
- deprecated `Shopware.State` — Vuex state factory, `@deprecated tag:v6.8.0`, use Store — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:182
- confirmed `Shopware.Store` — Pinia store instance — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:184
- confirmed `Shopware.Component.registerOverrideComponent` — private mounting hook for override SFCs present in 6.7.15.1 — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:159
- unverified `Single File Components` — docs: available since 6.7.16.0; release version not derivable from code
