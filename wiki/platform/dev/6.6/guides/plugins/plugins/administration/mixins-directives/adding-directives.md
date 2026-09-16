---
id: platform/dev/6.6/guides/plugins/plugins/administration/mixins-directives/adding-directives.md
title: Using Directives
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/mixins-directives/adding-directives.html
sourceHash: 1f0cf9d176da2ac9057a4900e8bdc08c651f1115
keywords: ["directive", "Directive.register", "v-focus", "custom directive", "Vue directive", "administration", "global scope", "local scope", "Shopware object", "component directives", "inserted hook", "focus.js"]
summary: How to register a custom Vue directive globally via Shopware.Directive.register or locally on a single component in the Shopware 6 Administration.
lastBuilt: "2026-09-15"
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/the-shopware-object.md
---
## What it is

This page explains how to add custom Vue directives to the Shopware 6 Administration. Directives behave exactly as they do in any standard Vue application; the guide covers registering a directive globally so it is available everywhere, and registering one locally so it is scoped to a single component. It points to the upstream Vue documentation on custom directives for the general Vue concepts, since Shopware does not reimplement that mechanism.

## When to use

Reach for this guide when a plugin needs custom DOM-level behavior that isn't naturally expressed as a component or a filter — the example given is a directive that focuses an input element when it is inserted into the DOM. Use global registration when the directive must be usable from any template in the Administration; use local registration when it should only be available inside one specific component.

## Key steps / config

To register a directive globally, destructure `Directive` from the `Shopware` object and call `Directive.register`, passing a name and an object with Vue directive hooks such as `inserted`:

```javascript
// <plugin-root>/src/Resources/app/administration/app/src/directive/focus.js
const { Directive } = Shopware;

Directive.register('focus', {
    inserted: function (el) {
        el.focus();
    }
});
```

That file then has to be imported from the plugin's `main.js` so it is bundled and executed during boot; after that the directive can be used in templates like any built-in Vue directive, e.g. `v-focus`.

To register a directive locally instead, add a `directives` key to the object passed to `Shopware.Component.register`, with the directive name mapped to the same kind of hook object:

```javascript
// <plugin-root>/src/Resources/app/administration/app/src/component/swag-basic-example/index.js
Shopware.Component.register('swag-basic-example', {
    directives: {
        focus: {
            inserted: function (el) {
                el.focus();
            }
        }
    }
});
```

The directive is then only usable inside that component's own template, for example via `<input type="text" v-focus="">`.

## Essential identifiers

- `Shopware.Directive.register(name, definition)` — global directive registration.
- `Shopware.Component.register(name, { directives: { ... } })` — component-scoped `directives` option for local registration.
- `inserted` — the Vue directive lifecycle hook used in both examples.
- `v-focus` — the directive name as used in a template once registered.

## Gotchas

A locally registered directive is only available inside the component that declares it in its `directives` option; using it in another component's template without registering it there (or globally) fails, because the directive is not in that component's scope.
