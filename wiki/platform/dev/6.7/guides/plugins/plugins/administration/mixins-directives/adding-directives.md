---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/adding-directives.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md
sourceHash: 1f0cf9d176da2ac9057a4900e8bdc08c651f1115
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/mixins-directives/adding-directives.html
title: Using Directives
version: "6.7"
versions:
  - "6.7"
keywords: ["directive", "Directive.register", "Shopware.Directive", "v-focus", "directives", "custom directive", "global directive", "local directive", "mounted", "inserted", "DirectiveFactory", "vue 3"]
summary: Register Administration Vue directives globally with Shopware.Directive.register or locally via a component's directives option; 6.7 uses Vue 3 hooks.
lastBuilt: 2026-10-21
---
## What it is

Directives in the Administration work as in any Vue application. The guide shows two scopes: global registration through the Shopware object's directive registry, and local registration on a single component.

## When to use

You need custom DOM behavior (e.g. focusing an input) in Administration templates of your plugin. The registry lives on the global object, see [The Shopware object](platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md).

## Key steps / config

Global registration, e.g. in `<plugin-root>/src/Resources/app/administration/app/src/directive/focus.js`, then import that file in your `main.js`:

```javascript
const { Directive } = Shopware;

Directive.register('focus', {
    mounted(el) {
        el.focus();
    },
});
```

Local registration on one component, e.g. `swag-basic-example`:

```javascript
Shopware.Component.register('swag-basic-example', {
    directives: {
        focus: {
            mounted(el) { el.focus(); },
        },
    },
});
```

Use it in the component template as a normal Vue directive:

```html
<input type="text" v-focus="">
```

The directive object is a Vue 3 directive (`ObjectDirective` or `FunctionDirective`), so the element-inserted hook is `mounted`.

## Essential identifiers

- `Shopware.Directive.register(name, directive)`
- `Shopware.Directive.getByName(name)`
- `directives` component option (local scope)
- `v-focus` — usage of a directive registered as `focus`
- `mounted` — Vue 3 directive hook

## Gotchas

- The directive must be in the component's scope — registered globally or locally on that component — or it cannot be used.
- The source's example (copied from the Vue 2 docs) uses the `inserted` hook. The installed Administration types directives as Vue 3 directives, whose hooks are `created`/`beforeMount`/`mounted`/...; core directives such as `autofocus` use `mounted`.
- Registering a name that already exists, or an empty name, only logs a warning and returns `false`; the existing directive stays.

## Code check (6.7.15.1)
- confirmed `Directive.register` — maps to DirectiveFactory.registerDirective — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:198
- confirmed `Directive.getByName` — maps to DirectiveFactory.getDirectiveByName — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:199
- confirmed `DirectiveFactory::registerDirective()` — accepts Vue FunctionDirective/ObjectDirective, rejects duplicate names — vendor/shopware/administration/Resources/app/administration/src/core/factory/directive.factory.ts:24
- corrected `inserted` — docs: inserted hook; core directives use the Vue 3 `mounted` hook — vendor/shopware/administration/Resources/app/administration/src/app/directive/autofocus.directive.ts:6
- confirmed `Component.register` — exposed on the Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:135
