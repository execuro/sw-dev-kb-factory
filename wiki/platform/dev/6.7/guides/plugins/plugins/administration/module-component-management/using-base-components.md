---
id: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/using-base-components.md
title: Using Base Components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/using-base-components.html
sourceHash: 34e231abb060327b9e178bde75d3244b946c6349
codeCheckedAgainst: "6.7.13.0"
keywords: ["mt-text-field", "sw-text-field", "component registry", "Component Library", "base components", "global vue components", "administration template", "twig template", "meteor components", "use shopware component"]
summary: Shopware Administration base components are globally registered via the component registry and usable in any plugin template without importing them.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md"]
---
## What it is

The Administration ships tailored Vue components that are registered in the `component registry` (a map of all components) and then registered as global Vue components during the Administration boot process. Because they are global, any Administration template can use them by tag name, without importing them.

## When to use

- You build a plugin component or module template and want a standard input, card, grid etc. instead of writing your own.
- To register your own components into the registry, see [Add custom component](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md).

## Key steps / config

1. Find the component you need in the Component Library (`https://component-library.shopware.com/`), which shows what each component does and looks like, plus its props and slots.
2. Use it by tag name in your component's Twig template (the docs' example file is `<plugin-root>/src/Resources/app/administration/app/src/component/example-component/example.html.twig`). For a text input, the installed core uses the Meteor `mt-text-field`:

```html
<div>
    <mt-text-field />
</div>
```

3. Continue with [Writing templates](platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md) to learn how to write templates and include them in your components.

## Essential identifiers

- `component registry`
- `mt-text-field`
- Component Library: `https://component-library.shopware.com/`

## Gotchas

- The docs' example uses `sw-text-field` (a text input with extras such as inheritance support). In 6.7 that component is only a wrapper that auto-switches between the legacy field and `mt-text-field`, is marked `@private`, and is deprecated for removal in 6.8.0 — use `mt-text-field` in new templates.
- No import is needed: registration happens globally at boot.

## Version notes

- 6.7: `sw-text-field` is deprecated (`tag:v6.8.0`, replacement `mt-text-field`); the legacy implementation lives on as `sw-text-field-deprecated`.

## Code check (6.7.13.0)
- deprecated `sw-text-field` — wrapper marked "@deprecated tag:v6.8.0 - Will be removed, use mt-text-field instead" — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-text-field/index.ts:10
- confirmed `mt-text-field` — used as the text input in core module templates — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-product-feature-sets/page/sw-settings-product-feature-sets-detail/sw-settings-product-feature-sets-detail.html.twig:60
- unverified `Component Library` — external site, outside the vendor code roots
