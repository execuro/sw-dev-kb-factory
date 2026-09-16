---
id: platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/add-custom-component.md
title: Add custom component
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/module-component-management/add-custom-component.html
sourceHash: 4b2439f8cc0972bfeec870dc4cc31206065d7e00
keywords: ["custom component", "Shopware.Component.register", "wrapComponentConfig", "main.js", "asynchronous loading", "synchronous loading", "index.js", "template", "component path", "hello-world", "administration component"]
summary: How to create and register a custom Administration Vue component, load it sync or async, and give it a Twig template.
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/administration/templates-styling/writing-templates.md
  - platform/dev/6.6/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md
  - platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-components.md
---
## What it is

Explains how to register a custom Vue component with a plugin in the Shopware 6 Administration, using a "Hello world!" example component.

## When to use

Use this when building a new reusable component (or a page component for a custom module route) rather than overriding or extending an existing one.

## Key steps / config

1. Decide the component's path convention: page components go under `<plugin-root>/src/Resources/app/administration/src/module/<module name>/page/<component name>`; general reusable components go under `<plugin-root>/src/Resources/app/administration/src/component/<plugin name>/<component name>`.
2. Register the component from `main.js`, preferring asynchronous (dynamic import) loading:

```javascript
Shopware.Component.register('hello-world', () => import('./component/custom-component/hello-world'));
```

Or synchronously by importing the file directly in `main.js` and registering inside its own `index.js`.

3. In the component's `index.js`, use `wrapComponentConfig` (async) or `Shopware.Component.register` (sync) with a `template` property:

```javascript
export default Shopware.Component.wrapComponentConfig({
    template: '<h2>Hello world!</h2>'
});
```

4. For larger markup, move the template to a separate `.html.twig` file and `import template from 'hello-world.html.twig'`, passing `template` (or the `template` shorthand) into the config.
5. Use the component as `<hello-world></hello-world>` in any other Administration template.

## Essential identifiers

- `Shopware.Component.register(name, definitionOrLoader)`
- `Shopware.Component.wrapComponentConfig(config)`
- `main.js` entry point, must live under `<plugin root>/src/Resources/app/administration/src`
- `index.js` component entry file

## Gotchas

Placing components under `component`/`module/.../page` following core conventions is a recommendation, not a hard requirement.
