---
id: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md
title: Customizing Components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/customizing-components.html
sourceHash: e89e79cc5f7c4e35bd50eedb5801b09e021ddc90
codeCheckedAgainst: "6.7.13.0"
keywords: ["customize component", "Shopware.Component.override", "Shopware.Component.extend", "$super", "twig block", "parent", "overrideComponentSetup", "createExtendableSetup", "composition api", "options api", "sw-dashboard-index", "sw_dashboard_index_content_intro_content_headline", "extend admin component", "_private"]
summary: Override or extend Administration components (Component.override/extend, Twig blocks, $super) and the experimental overrideComponentSetup Composition API.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/writing-templates.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/adding-snippets.md", "platform/dev/6.7/guides/plugins/plugins/administration/templates-styling/add-custom-styles.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/using-base-components.md"]
---
## What it is

How to change existing Shopware 6 Administration components from a plugin: `Shopware.Component.override()` (modify in place), `Shopware.Component.extend()` (new component based on an existing one), TwigJS block overrides, `this.$super()` for methods/computed properties, and the experimental Composition API extension system (`overrideComponentSetup`, `createExtendableSetup`).

## When to use

You need to change markup or logic of a core component (Options API) or of a component built with `createExtendableSetup` (Composition API) without copying it.

## Key steps / config

1. **Override** (changes the existing component everywhere):

```javascript
import template from './sw-dashboard-index.html.twig';
Shopware.Component.override('sw-dashboard-index', { template });
```

2. **Extend** (new component name, base stays untouched): `Shopware.Component.extend('sw-custom-field', '<existing-component>', { template })`, then use `<sw-custom-field></sw-custom-field>`.
3. **Template blocks** (TwigJS is only used for block extending/overriding): redeclare a block to replace it; put `{% parent %}` inside to keep the original markup.

```twig
{% block sw_dashboard_index_content_intro_content_headline %}
    <h1>Welcome to a customized component</h1>
{% endblock %}
```

4. **Methods / computed**: redefine under `methods` or `computed` in the override/extend config to replace; call `this.$super('onInput')` (or `this.$super('<computedName>')`) inside to run the inherited implementation first.
5. **Loading**: place the override e.g. in `<plugin root>/src/Resources/app/administration/src/sw-dashboard-index-override/index.js` and import it from `main.js`: `import './sw-dashboard-index-override/';`.
6. **Composition API (experimental)** — only for components made extendable with `createExtendableSetup`; note the extra `()`:

```javascript
Shopware.Component.overrideComponentSetup()('sw-product-list', (previousState, props, context) => {
    // previousState: public state/methods; previousState._private: private ones
    return { pageSize: ref(50) };
});
```

   The component side: `setup: (props, context) => Shopware.Component.createExtendableSetup({ props, context, name: 'originalComponent' }, () => ({ public: { ... }, private: { ... } }))`. The returned object's properties replace/add to the component's public API; existing methods remain callable via `previousState`. For typed props use `overrideComponentSetup<typeof ImportedComponent>()`.

## Essential identifiers

- `Shopware.Component.override(name, config)`, `Shopware.Component.extend(newName, baseName, config)`
- `this.$super(name)`, `{% parent %}`
- `Shopware.Component.overrideComponentSetup()`, `Shopware.Component.createExtendableSetup`
- `previousState`, `previousState._private`
- `sw-dashboard-index`, block `sw_dashboard_index_content_intro_content_headline`

## Gotchas

- `extend()` registers a new component; `override()` changes the original for all usages.
- Replacing a method without `this.$super()` drops the inherited logic entirely.
- The source's examples extend `sw-text-field` (with `onInput()` and `stringRepresentation`); in 6.7.13 `sw-text-field` is a wrapper deprecated for removal in 6.8 (use `mt-text-field`), so pick a non-deprecated base.
- `createExtendableSetup`'s setup function must return at least a `public` or `private` object, otherwise it throws.
- Composition API system is experimental; its API may change. Only overrides are possible there — extending is not supported (do it natively with the Composition API). Multiple overrides apply in registration order. Private properties (`_private`) have no TS support and are not meant for production.
- The dashboard headline block currently renders `{{ welcomeMessage }}`, not a `$tc()` call as the source describes.

## Version notes

- Options API override/extend remains fully supported. Long term, the Composition API system is planned to become the standard and the Options API extension system to be deprecated once components are migrated; the installed code marks the Composition API functions `@experimental stableVersion:v6.8.0`.

## Code check (6.7.13.0)
- confirmed `AsyncComponentFactory.override` — exposed as `Shopware.Component.override` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:132
- confirmed `AsyncComponentFactory.extend` — exposed as `Shopware.Component.extend` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:131
- confirmed `extendComponentName` — extend takes new name, base name, config — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:550
- confirmed `$super` — Options API `this.$super(name, ...args)` on extended/overridden components — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:919
- confirmed `overrideComponentSetup` — curried, experimental stableVersion v6.8.0 — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system.ts:422
- confirmed `createExtendableSetup` — experimental; setup must return public or private — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system.ts:177
- confirmed `_private` — private setup results exposed on previousState — vendor/shopware/administration/Resources/app/administration/src/app/adapter/composition-extension-system.ts:297
- confirmed `sw_dashboard_index_content_intro_content_headline` — block exists; renders welcomeMessage — vendor/shopware/administration/Resources/app/administration/src/module/sw-dashboard/page/sw-dashboard-index/sw-dashboard-index.html.twig:13
- deprecated `sw-text-field` — deprecated tag:v6.8.0, use mt-text-field — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-text-field/index.ts:10
