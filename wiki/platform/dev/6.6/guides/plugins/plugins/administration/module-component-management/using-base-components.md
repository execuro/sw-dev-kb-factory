---
id: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/using-base-components.md
title: Using base components
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/module-component-management/using-base-components.html
sourceHash: 9deb569b3c81d96af4c1c3c33d89692f3cd030ae
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-component.md
  - platform/dev/6.6/guides/plugins/plugins/administration/templates-styling/writing-templates.md
keywords: ["base component", "component registry", "sw-text-field", "Component Library", "Vue global component", "administration boot process", "component inheritance", "Shopware components", "template slots", "component props", "administration", "writing templates"]
summary: How to reuse Shopware's tailored Vue components from the component registry, such as sw-text-field, in plugin templates.
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to use Shopware's own tailored Vue components — the ones already built into the Administration — inside a plugin's own templates. All of these components are made accessible via the `component registry`, so a plugin does not need to write its own version of common UI elements.

## When to use

Use this whenever a plugin template needs a standard Administration UI element (an input, a field, etc.) instead of hand-rolling the markup. It complements the separate guide on registering custom components to the `component registry`, which is linked for developers who want to build and register their own components rather than reuse existing ones.

## Key steps / config

First, find the component to use: all Shopware 6 Administration components are listed in the Component Library, which documents what each component does and looks like, which props it accepts, and which slots it exposes. All of these components are registered to the `component registry` — a map of components that get registered to Vue globally during the Administration's boot process — so they are accessible from any template in the Administration.

To use one, simply reference it by its tag name in a template, the same way as any other Vue component:

```html
// <plugin-root>/src/Resources/app/administration/app/src/component/example-component/example.html.twig
<div>
    <sw-text-field />
</div>
```

`sw-text-field` renders a plain `text` input but, being a Shopware base component, also supports extra functionality such as inheritance that a raw `<input>` would not have.

## Essential identifiers

- `component registry` — the map of all Administration components, registered globally to Vue during boot.
- `sw-text-field` — the example base component used in the guide, a text input field.
- Component Library — the catalog site listing every base component with its props and slots.

## Gotchas

Base components are registered as global Vue components, so they can be dropped into any Administration template without an explicit local import or registration step — unlike a locally scoped custom component or directive.
