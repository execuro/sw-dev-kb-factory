---
id: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/_index.md
title: Modules and Components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/
sourceHash: 2229f6bd7e64e330d822a0c5e06d0f1a42cf57ba
codeCheckedAgainst: "6.7.15.1"
keywords: ["modules", "components", "administration module", "vue component", "Shopware.Component.register", "Shopware.Component.override", "Shopware.Component.extend", "Shopware.Module.register", "custom field", "base components", "customize component", "plugin administration"]
summary: Index of guides for creating, extending and customizing Administration modules and Vue components in a plugin.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-field.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md"]
---
## What it is

Overview page for the guides on creating, extending and customizing Administration modules and Vue components from a plugin.

## When to use

Pick the matching sub-guide:

- [Add custom input field to an existing component](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-field.md)
- [Add custom components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md)
- [Add custom module](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md)
- [Customize components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md)
- [Customize modules](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-modules.md)
- [Use base components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/using-base-components.md)

## Essential identifiers

The installed global `Shopware` object exposes the entry points these guides use: `Shopware.Component.register`, `Shopware.Component.extend`, `Shopware.Component.override` and `Shopware.Module.register`.

## Code check (6.7.15.1)
- confirmed `Shopware.Module.register` — maps to `ModuleFactory.registerModule` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:128
- confirmed `Shopware.Component.register` — maps to `AsyncComponentFactory.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:135
- confirmed `Shopware.Component.extend` — maps to `AsyncComponentFactory.extend` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:136
- confirmed `Shopware.Component.override` — maps to `AsyncComponentFactory.override` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:137
