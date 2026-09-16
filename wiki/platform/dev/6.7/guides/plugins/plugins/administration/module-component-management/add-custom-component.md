---
id: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-component.md
title: Add Custom Components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/add-custom-component.html
sourceHash: abe002af76e72a12c08c2f36d4faf59f7feefe93
codeCheckedAgainst: "6.7.13.0"
keywords: ["Shopware.Component.register", "Shopware.Component.wrapComponentConfig", "ComponentFactory", "main.js", "index.js", "custom component", "vue component", "administration component", "async component", "template", "hello-world.html.twig", "admin plugin"]
summary: Register a custom Vue component in the Administration from a plugin via Shopware.Component.register (async import preferred) and wrapComponentConfig.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md", "platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/add-shortcuts.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md"]
---
## What it is

How a plugin registers its own Vue component in the Shopware 6 Administration using the component factory (`ComponentFactory`) exposed as `Shopware.Component`, with the example component `hello-world` printing "Hello world!".

## When to use

You need a new Administration component — either a page for your module's custom route or a reusable component used by other components — rather than [customizing an existing one](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md).

## Key steps / config

1. Entry point: `main.js` in `<plugin root>/src/Resources/app/administration/src`.
2. Location (recommendation, not a requirement):
   - page for a module: `<plugin-root>/src/Resources/app/administration/src/module/<your module's name>/page/<your component name>`
   - general component: `<plugin-root>/src/Resources/app/administration/src/component/<name of your plugin>/<name of your component>` (example: `component/custom-component/hello-world/index.js`)
3. Register in `main.js` — asynchronous loading is preferred (loaded only when used):

```javascript
Shopware.Component.register('hello-world', () => import('./component/custom-component/hello-world'));
```

   and `index.js` exports the config object (a module `default` export is unwrapped by the factory):

```javascript
import template from 'hello-world.html.twig';

export default Shopware.Component.wrapComponentConfig({
    template,
});
```

4. Synchronous alternative: `import './component/custom-component/hello-world';` in `main.js`, and `index.js` calls `Shopware.Component.register('hello-world', { template: '<h2>Hello world!</h2>' })` itself.
5. Use it in any Administration template as `<hello-world></hello-world>`. For larger templates put the markup in `hello-world.html.twig` next to the component and import it.

## Essential identifiers

- `Shopware.Component.register(name, config | () => import(...))`
- `Shopware.Component.wrapComponentConfig(config)`
- `main.js`, `index.js`, `template`

## Gotchas

- `wrapComponentConfig` only adds TypeScript support/`this` context (it is Vue's `defineComponent`); it takes the config object only. The docs' long-template example passing `'hello-world'` as first argument does not match the installed signature.
- A component needs a `template` (or a `render` function / `functional`); otherwise registration warns and the component is not built.
- Component names must be unique: registering an already registered name only logs a warning and returns `false`.
- The `{ template }` shorthand works only when the imported variable is named exactly `template`.

## Code check (6.7.13.0)
- confirmed `Shopware.Component.register` — global alias for AsyncComponentFactory.register — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:130
- corrected `Shopware.Component.wrapComponentConfig` — docs: also called as wrapComponentConfig('hello-world', {...}); alias of Vue defineComponent taking the config only — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:134
- confirmed `componentRegistry.has` — duplicate names warn and return false — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:483
- confirmed `awaitedConfigResult?.default` — ES module default export is unwrapped — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:506
- confirmed `config.template` — required unless functional or render function — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:525
- unverified `main.js` — plugin entry discovery lives in the build tooling, not checked
