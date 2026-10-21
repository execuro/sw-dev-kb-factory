---
id: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/using-base-components.md
title: Using Base Components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/using-base-components.html
sourceHash: 34e231abb060327b9e178bde75d3244b946c6349
codeCheckedAgainst: "6.7.15.1"
keywords: ["base components", "component registry", "getComponentRegistry", "global vue components", "mt-text-field", "sw-text-field", "meteor components", "component library", "administration template", "twig template"]
summary: "All Administration components are globally registered via the component registry, so base components can be used directly in any plugin template."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md"]
---
## What it is

How to use the Administration's own (base) components inside plugin templates. Every Administration component is first registered in the `component registry` (a map of all components), which is registered to Vue during the Administration boot process as global Vue components — so they are available in every Administration template without importing them.

## When to use

You build a plugin component or module page and want to reuse existing UI elements (form fields, buttons, cards) instead of writing your own. To register your own components to the registry, see [Add custom component](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md).

## Key steps / config

1. Look up the component, its props and slots in the Component Library (`https://component-library.shopware.com/`).
2. Use the tag directly in your component's Twig template, e.g. in `<plugin-root>/src/Resources/app/administration/src/component/example-component/example.html.twig`:
   ```html
   <div>
       <mt-text-field />
   </div>
   ```
3. Continue with [Writing templates](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md) to include templates in your components.

## Essential identifiers

- `component registry` — `Shopware.Component.getComponentRegistry()`
- `Shopware.Component.register` (how components enter the registry)
- `mt-text-field` — globally registered Meteor text input

## Gotchas

- The source's example uses `sw-text-field`; in 6.7.15.1 it is a deprecated wrapper (`@deprecated tag:v6.8.0`, "use mt-text-field instead") that switches between the old field and `mt-text-field`.
- Meteor components (`mt-*`) are registered globally by the Vue adapter in addition to the registry components.
- The source's example file path contains `app/administration/app/src/...`; the plugin entry directory used elsewhere is `src/Resources/app/administration/src`.

## Code check (6.7.15.1)
- confirmed `getComponentRegistry` — exposed on `Shopware.Component` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:141
- confirmed `Shopware.Component.register` — maps to `AsyncComponentFactory.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:135
- deprecated `sw-text-field` — `@deprecated tag:v6.8.0`, use `mt-text-field` — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-text-field/index.ts:10
- confirmed `MtTextField` — registered as a global Meteor component — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:447
