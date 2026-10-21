---
id: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md
title: Add Custom Components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/add-custom-component.html
sourceHash: f5c21d8a539dc8e46c361ee4ca11bcea3e3eeb5c
codeCheckedAgainst: "6.7.15.1"
keywords: ["Shopware.Component.register", "Shopware.Component.wrapComponentConfig", "ComponentFactory", "main.js", "index.js", "template", "hello-world.html.twig", "custom component", "vue component", "async component", "dynamic import", "options api", "administration plugin"]
summary: Register a custom Administration Vue component from a plugin with Shopware.Component.register (async import preferred) and wrapComponentConfig.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md", "platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/_index.md"]
---
## What it is

How a plugin registers its own Administration component using the Options API and the `ComponentFactory` exposed as `Shopware.Component`. The example builds a `hello-world` component that renders "Hello world!".

## When to use

You need a new reusable component, or a `page` component for a custom module route, in the Administration. If you build a page for your own module, the source recommends setting up the module first.

## Key steps / config

1. Entry point: `<plugin root>/src/Resources/app/administration/src/main.js`.
2. Choose a path (recommendation, not a requirement, mirroring core conventions):
   - page for a module: `<plugin-root>/src/Resources/app/administration/src/module/<your module's name>/page/<your component name>`
   - general component: `<plugin-root>/src/Resources/app/administration/src/component/<name of your plugin>/<name of your component>` — example: `.../src/component/custom-component/hello-world`
3. Create `index.js` in that directory and wire it up from `main.js`.

Asynchronous loading (preferred — loaded only when used). In `main.js`:

```javascript
Shopware.Component.register('hello-world', () => import('./component/custom-component/hello-world'));
```

and `index.js` only exports the config, wrapped for type support:

```javascript
import template from './hello-world.html.twig';

export default Shopware.Component.wrapComponentConfig({
    template,
});
```

Synchronous loading: `main.js` does `import './component/custom-component/hello-world';` and `index.js` calls `Shopware.Component.register('hello-world', { template: '<h2>Hello world!</h2>' });` directly.

4. Define the template via the `template` property — inline for tiny cases, otherwise a `hello-world.html.twig` file imported into `index.js`. `template` (shorthand) equals `template: template` when the variable has the property's name.
5. Use it in any Administration template as `<hello-world></hello-world>`.

## Essential identifiers

- `Shopware.Component.register(name, configOrImportFn)`
- `Shopware.Component.wrapComponentConfig(config)`
- `template` property
- `main.js`, `index.js`, `hello-world.html.twig`

## Gotchas

- `wrapComponentConfig` takes only the configuration object; the docs' long-template example passes the name as first argument, which does not match the installed code (it is an alias of Vue's `defineComponent`). The name is given to `Component.register`.
- `Component.register` aborts with a warning if the name is empty or already registered, and if the resolved config has no `template` (and no render function).
- Synchronous loading slows down Administration load time; prefer the dynamic import.

## Version notes

- Since Shopware 6.7.16.0 a component can also be written as a native Vue [Single File Component](platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/_index.md) (experimental); see the [SFC tutorial](platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/tutorial/_index.md) and [Build your own component](platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/tutorial/build-your-own-component.md). The Options API registration remains the stable path.

## Code check (6.7.15.1)
- confirmed `Shopware.Component.register` — maps to `AsyncComponentFactory.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:135
- confirmed `Shopware.Component.wrapComponentConfig` — exposed on the global object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:139
- corrected `wrapComponentConfig` — docs: called as `wrapComponentConfig('hello-world', {...})`; code aliases `defineComponent`, config-only — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:38
- confirmed `componentConfiguration` — may be an object or a function (dynamic import, ES module `default` unwrapped) — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:495
- confirmed `componentRegistry.has` — duplicate component name aborts registration — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:484
- confirmed `config.template` — required unless functional/render, else warning and abort — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:527
