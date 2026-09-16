---
id: platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/adding-directives.md
title: Using Directives
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/mixins-directives/adding-directives.html
sourceHash: 1f0cf9d176da2ac9057a4900e8bdc08c651f1115
codeCheckedAgainst: "6.7.13.0"
keywords: ["Directive.register", "Shopware.Directive", "directives", "v-focus", "custom directive", "global directive", "local directive", "mounted", "Component.register", "main.js", "vue 3"]
summary: "Register Administration directives globally via Shopware.Directive.register (imported in main.js) or locally in a component's directives option."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md"]
---
## What it is

How to register custom Vue directives in the Shopware 6 Administration, either globally through the directive registry on the [Shopware object](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md) or locally on a single component.

## When to use

A plugin needs custom DOM behaviour on elements (the example focuses an input when it appears) — globally for many components, or scoped to one component.

## Key steps / config

**Global** — e.g. `<plugin-root>/src/Resources/app/administration/app/src/directive/focus.js`, then import that file in your `main.js`:

```js
const { Directive } = Shopware;

Directive.register('focus', {
    mounted(el) {
        el.focus();
    },
});
```

**Local** — on the component (`.../component/swag-basic-example/index.js`):

```js
Shopware.Component.register('swag-basic-example', {
    directives: {
        focus: {
            mounted(el) { el.focus(); },
        },
    },
});
```

**Use** in the component template (`swag-basic-example.html.twig`): an input element with the attribute `v-focus=""`.

At application start the Vue adapter hands every entry of the directive registry to the Vue app as a global directive; `Directive.getByName('focus')` reads one back.

## Essential identifiers

- `Shopware.Directive.register(name, directive)`
- `Shopware.Directive.getByName(name)`
- `directives: {}` component option (local registration)
- `v-focus` (usage of a directive named `focus`)

## Gotchas

- The directive must be in the component's scope — registered globally or locally on that component — before it is used.
- `Directive.register` returns `false` and logs a warning when the name is empty or already registered; the existing directive is kept.
- The docs copy the Vue 2 example with the `inserted` hook. The 6.7 Administration runs Vue 3 directive hooks (`beforeMount`, `mounted`, `unmounted`); Shopware's own directives use `mounted`/`beforeMount`.

## Code check (6.7.13.0)
- confirmed `Directive.register` — maps to DirectiveFactory.registerDirective — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:185
- confirmed `Directive.getByName` — maps to DirectiveFactory.getDirectiveByName — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:186
- confirmed `registerDirective` — returns false with warning on empty or duplicate name — vendor/shopware/administration/Resources/app/administration/src/core/factory/directive.factory.ts:24
- confirmed `initDirectives` — registry entries passed to the Vue app's directive() — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:712
- corrected `mounted` — docs: Vue 2 `inserted` hook — vendor/shopware/administration/Resources/app/administration/src/app/directive/autofocus.directive.ts:6
- confirmed `beforeMount` — Vue 3 hook used by the tooltip directive — vendor/shopware/administration/Resources/app/administration/src/app/directive/tooltip.directive.ts:581
- confirmed `Component.register` — exposed on Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:130
