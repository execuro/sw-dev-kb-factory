---
id: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/_index.md
title: Modules and Components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/
sourceHash: 2229f6bd7e64e330d822a0c5e06d0f1a42cf57ba
codeCheckedAgainst: "6.7.13.0"
keywords: ["administration modules", "vue components", "Shopware.Component.register", "Shopware.Component.override", "Shopware.Component.extend", "Shopware.Module.register", "wrapComponentConfig", "custom module", "custom component", "customize component", "base components", "admin extension"]
summary: Index of Administration guides for creating, extending and customizing modules and Vue components in a Shopware 6.7 plugin.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-field.md"]
---
## What it is

Section index for Administration guides on creating, extending and customizing Administration modules and Vue components from a plugin. The source page is only a list of links to the six sub-guides.

## When to use

Start here when a plugin has to add UI to the Shopware 6.7 Administration and you need to pick the right guide: a new module (own menu entry and routes), a new component, a change to an existing component or module, or use of the shipped base components.

## Key steps / config

Sub-guides in this section:

- [Add Custom Fields](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-field.md): add an input field to an existing component by overriding it and extending one of its Twig blocks.
- [Add Custom Components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md): register a new component with `Shopware.Component.register`.
- [Add Custom Modules](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md): register a module with `Shopware.Module.register` (routes, navigation, snippets, settings item).
- [Customize Components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md): `Shopware.Component.override` / `Shopware.Component.extend`, Twig block overrides, and the experimental Composition API override system.
- [Customize Modules](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md)
- [Use Base Components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/using-base-components.md)

The plugin's Administration code always starts from `<plugin root>/src/Resources/app/administration/src/main.js`.

## Essential identifiers

- `Shopware.Component.register`, `Shopware.Component.extend`, `Shopware.Component.override`, `Shopware.Component.wrapComponentConfig`
- `Shopware.Module.register`

## Code check (6.7.13.0)
- confirmed `ModuleFactory.registerModule` — exposed as `Shopware.Module.register` on the global object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:123
- confirmed `AsyncComponentFactory.register` — exposed as `Shopware.Component.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:130
- confirmed `AsyncComponentFactory.extend` — exposed as `Shopware.Component.extend` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:131
- confirmed `AsyncComponentFactory.override` — exposed as `Shopware.Component.override` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:132
- confirmed `AsyncComponentFactory.wrapComponentConfig` — exposed as `Shopware.Component.wrapComponentConfig` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:134
