---
id: platform/dev/6.7/guides/plugins/plugins/administration/_index.md
title: Administration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/
sourceHash: a708d2ce05ad5bc3c218fabf109d3716d425b07e
codeCheckedAgainst: "6.7.13.0"
keywords: ["administration", "admin plugin", "backend ui", "custom module", "vue components", "acl", "Shopware.Module.register", "Shopware.Component.register", "Shopware.Store", "pinia", "vuex", "meteor admin sdk", "webpack"]
summary: Entry point for extending the Shopware 6.7 Administration from a plugin - module, routes, components, data, ACL, services, templates, state in order.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/using-base-components.md"]
---
## What it is

Section overview for customizing and extending the Shopware Administration (backend UI) from a plugin: adding modules, routes, components, services, permissions and UI logic. It lays out the recommended order in which to work through the Administration plugin guides.

## When to use

You are writing a plugin that changes or extends the Administration. Typical cases: a custom module, routes and navigation entries, Vue components, repository/API data, ACL permissions, injected services, template and styling customizations. For stable cross-version extension points usable by both apps and plugins, use the [Meteor Admin SDK](platform/dev/6.7/guides/plugins/apps/administration/meteor-admin-sdk.md) instead.

## Key steps / config

Developer workflow for a plugin:

1. [Add a custom module](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md) (registered via `Shopware.Module.register`) and a [menu entry](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-menu-entry.md).
2. [Add custom routes](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/add-custom-route.md).
3. [Add custom components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md) (`Shopware.Component.register`) and [use base components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/using-base-components.md).
4. Connect [data](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md) — repositories or [API requests](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/making-api-requests.md).
5. Handle permissions and [add ACL rules](platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md).
6. [Inject services](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/injecting-services.md) (`Shopware.Service`) and [extend services](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/extending-services.md).
7. [Customize templates](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md) and [add custom styles](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md).
8. Manage state with Pinia stores (`Shopware.Store`); the older Vuex approach is covered in [using Vuex state](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-vuex-state.md).

Advanced topics: [mixins and directives](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md) (`Shopware.Mixin`, `Shopware.Directive`) and [extending webpack](platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/extending-webpack.md).

## Essential identifiers

- `Shopware.Module.register`
- `Shopware.Component.register`
- `Shopware.Service`
- `Shopware.Store`
- `Shopware.Mixin`, `Shopware.Directive`

## Gotchas

- The Vuex-based global `Shopware.State` is deprecated in the installed code (removal planned for 6.8.0); new plugin code should use `Shopware.Store` (Pinia).

## Version notes

- 6.7: Pinia (`Shopware.Store`) is the state API; `Shopware.State` carries `@deprecated tag:v6.8.0`.

## Code check (6.7.13.0)
- confirmed `Shopware.Module.register` — maps to ModuleFactory.registerModule — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:123
- confirmed `Shopware.Component.register` — maps to AsyncComponentFactory.register — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:130
- confirmed `Shopware.Store` — Pinia store instance on the global object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:171
- deprecated `Shopware.State` — Vuex state factory, removed in v6.8.0, use Store — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:169
- confirmed `Shopware.Mixin` — mixin registry on the global object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:173
- confirmed `Shopware.Directive` — directive registry on the global object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:184
- confirmed `Shopware.Service` — ServiceFactory on the global object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:208
- unverified `Meteor Admin SDK` — separate npm package, not located in the checked vendor roots
