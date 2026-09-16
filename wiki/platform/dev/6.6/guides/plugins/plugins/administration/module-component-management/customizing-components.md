---
id: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-components.md
title: Customizing components
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/module-component-management/customizing-components.html
sourceHash: 0e42bca3fc2af65b9c3a650d397b6e8ec4d1f65e
keywords: ["Component.override", "Component.extend", "this.$super", "twig block", "parent tag", "sw-text-field", "overrideComponentSetup", "createExtendableSetup", "Composition API extension", "onInput", "sw-dashboard-index", "Options API"]
summary: How to override or extend Administration components (template, methods, computed) via the Options API, plus the experimental Composition API extension system.
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/administration/templates-styling/adding-snippets.md
  - platform/dev/6.6/guides/plugins/plugins/administration/templates-styling/writing-templates.md
  - platform/dev/6.6/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md
  - platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/using-base-components.md
---
## What it is

Explains how to override and extend existing Administration components to change their content and behavior, both with the classic Options API factory methods and the newer, experimental Composition API extension system.

## When to use

Use this when modifying an existing core or third-party component's template, methods, or computed properties, instead of building a brand-new component.

## Key steps / config

- `Component.override()` replaces a component's previous behavior; `Component.extend()` creates a new component based on an existing one.

```JS
Shopware.Component.override('sw-text-field', { template });
```

```JS
Shopware.Component.extend('sw-custom-field', 'sw-text-field', { template });
```

- Twig `block`/`{% parent %}` let you replace or append to a component's markup:

```twig
{% block card_content %}
    {% parent %}
    <div class="card-custom-content">...</div>
{% endblock %}
```

- Extend a method/computed and call the original with `this.$super('methodName')`:

```JS
Shopware.Component.extend('sw-custom-field', 'sw-text-field', {
    methods: {
        onInput() {
            const superCallResult = this.$super('onInput');
        }
    }
});
```

- Real-world block override example: overriding `sw_dashboard_index_content_intro_content_headline` in `sw-dashboard-index`, registered via `Shopware.Component.override('sw-dashboard-index', { template })` and imported in `main.js`.

- Experimental Composition API extension system: `Shopware.Component.createExtendableSetup` makes a component extendable (mainly core-team usage); `Shopware.Component.overrideComponentSetup()('componentName', (previousState, props, context) => ({ ... }))` lets plugins override it. Only overriding is supported here, not extending. Private properties are reachable via `previousState._private`.

## Essential identifiers

- `Shopware.Component.override(name, config)`
- `Shopware.Component.extend(newName, baseName, config)`
- `this.$super(methodName)`
- `Shopware.Component.createExtendableSetup(...)`
- `Shopware.Component.overrideComponentSetup()(componentName, callback)`
- `{% parent %}` twig tag

## Gotchas

The Composition API extension system is experimental; the Options API system remains fully supported for now but is expected to eventually be deprecated as components migrate to the Composition API. With `overrideComponentSetup`, multiple plugins can override the same component, and overrides apply in registration order. Accessing `_private` properties has no TypeScript support and is not recommended for production use.

## Version notes

Shopware 6 is introducing the Composition API extension system as a future migration path away from the Options API extension system; no removal has happened yet per the source.
