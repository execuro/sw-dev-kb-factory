---
id: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md
title: Customizing Components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/customizing-components.html
sourceHash: e4a29439c23ba55f6df1a2d73518b085b047e02e
codeCheckedAgainst: "6.7.15.1"
keywords: ["Component.override", "Component.extend", "overrideComponentSetup", "createExtendableSetup", "$super", "{% parent %}", "twig block", "override component", "extend component", "composition api", "options api", "sw_dashboard_index_content_intro_content_headline", "main.js"]
summary: "Override/extend Administration components with Component.override/extend, Twig blocks, $super and experimental overrideComponentSetup."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/tutorial/your-first-override.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/using-base-components.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-snippets.md"]
---
## What it is

How a plugin changes an existing Administration component: `Shopware.Component.override()` (modifies the existing component in place) or `Shopware.Component.extend()` (creates a new component based on an existing one), TwigJS block overrides in templates, `this.$super()` for methods/computed properties, and the experimental Composition API extension system (`Shopware.Component.overrideComponentSetup`).

## When to use

- Replace or add markup inside a core component's template (e.g. the dashboard headline).
- Change or wrap a method/computed property of a core component.
- Derive a new component from an existing one under a new name.
- Override a component written with the Composition API (`createExtendableSetup`), where Options API overrides only run through a compatibility shim.

## Key steps / config

1. **Override** (same name, behaviour replaced/merged):
   ```javascript
   import template from './sw-dashboard-index.html.twig';
   Shopware.Component.override('sw-dashboard-index', { template });
   ```
   First argument = component to override; second = object with the overridden properties.
2. **Extend** (new component): `Shopware.Component.extend('<new-name>', '<existing-name>', { template })`, then render `<new-name>` in any template.
3. **Template blocks**: redeclare a block by name to replace it; use `{% parent %}` inside it to render the original markup:
   ```twig
   {% block sw_dashboard_index_content_intro_content_headline %}
       {% parent %}
       <h1>Welcome to a customized component</h1>
   {% endblock %}
   ```
4. **Methods / computed**: redeclaring under `methods`/`computed` replaces the inherited logic; call `this.$super('onInput')` (or the computed name) inside to run the original first.
5. **Loading**: place the override in e.g. `<plugin root>/src/Resources/app/administration/src/sw-dashboard-index-override/index.js` and import it from `<plugin root>/src/Resources/app/administration/src/main.js` (`import './sw-dashboard-index-override/';`). `main.js` in that directory is picked up automatically.
6. **Composition API (experimental)**:
   ```javascript
   Shopware.Component.overrideComponentSetup()('componentName', (previousState, props, context) => {
       // previousState: public state/methods; props; setup context
       return { /* new or replaced properties and methods */ };
   });
   ```
   The core makes a component extendable with `Shopware.Component.createExtendableSetup({ props, context, name }, () => ({ public: {...}, private: {...} }))`. Mutate `previousState` (e.g. push to a ref'd array) and return `{}`, or return replacements; keep refs reactive. For typed props: `overrideComponentSetup<typeof Component>()(...)`.

## Essential identifiers

- `Shopware.Component.override`, `Shopware.Component.extend`
- `this.$super('<name>')`, `{% block %}`, `{% parent %}`
- `Shopware.Component.overrideComponentSetup`, `Shopware.Component.createExtendableSetup`
- `previousState._private` (private setup state)
- `sw_dashboard_index_content_intro_content_headline` (block in `sw-dashboard-index`)

## Gotchas

- `extend()` creates a new component; `override()` changes the existing one everywhere it is used.
- Composition API system: only overrides, no extend (do that natively). Multiple plugins' overrides apply in registration order. Accessing `_private` has no TS support and is not recommended for production.
- Overriding a Composition API component with Options API patterns activates a compatibility shim that logs a deprecation warning asking to migrate to `overrideComponentSetup()`.
- The source's examples use `sw-text-field`; in 6.7.15.1 that component is `@deprecated tag:v6.8.0` in favour of `mt-text-field` — pick a non-deprecated target.
- Only TwigJS block extending/overriding is used in the Administration; no other TwigJS feature.

## Version notes

- The Composition API extension system is experimental; its API may change, no release date for it becoming standard. The Options API factory system remains supported and is the one to use for Options API components.
- The source mentions an experimental Single File Component alternative (`.override.vue` with `<sw-block extends>`) "since Shopware 6.7.16.0" — newer than the checked 6.7.15.1.

## Code check (6.7.15.1)
- confirmed `Shopware.Component.override` — maps to `AsyncComponentFactory.override` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:137
- confirmed `Shopware.Component.extend` — maps to `AsyncComponentFactory.extend(componentName, extendComponentName, config)` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:136
- confirmed `override` — signature `(componentName, componentConfiguration, overrideIndex = null)` — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:609
- confirmed `overrideComponentSetup` — curried `overrideComponentSetup<T>()(componentName, override)` pushing to an overrides map — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:507
- confirmed `createExtendableSetup` — options `{ name, props, context? }` plus setup returning `{ public, private }` — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:257
- confirmed `_private` — private setup values grouped under `previousState._private` — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system/index.ts:198
- confirmed `$super` — handled for methods and computed refs in the Options/Composition shim — vendor/shopware/administration/Resources/app/administration/src/app/adapter/options-composition-shim.ts:418
- confirmed `sw_dashboard_index_content_intro_content_headline` — block exists in the dashboard template — vendor/shopware/administration/Resources/app/administration/src/module/sw-dashboard/page/sw-dashboard-index/sw-dashboard-index.html.twig:13
- deprecated `sw-text-field` — `@deprecated tag:v6.8.0`, use `mt-text-field` — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-text-field/index.ts:10
- confirmed `MtTextField` — registered globally as a Meteor component — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:447
