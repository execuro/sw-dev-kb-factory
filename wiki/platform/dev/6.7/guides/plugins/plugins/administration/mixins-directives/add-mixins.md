---
id: platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md
title: Adding Mixins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/mixins-directives/add-mixins.html
sourceHash: 79d57223232ca198ebb51a216d80a15b81921b42
codeCheckedAgainst: "6.7.13.0"
keywords: ["Mixin.register", "Mixin.getByName", "Shopware.Mixin", "swag-basic-mixin", "mixins", "custom mixin", "register mixin", "main.js", "Component.register", "administration plugin", "vue mixin"]
summary: "Register a custom Administration mixin with Shopware.Mixin.register, import it in main.js before components, inject via Mixin.getByName in mixins."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-utils.md"]
---
## What it is

How a plugin adds its own Administration mixin. Mixins behave as in Vue; only registration (a global mixin registry) and inclusion in a component (looked up by name) differ.

## When to use

You have component logic (lifecycle hooks, methods) to share across several of your plugin's Administration components. For Shopware's built-in mixins see [Using Mixins](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md).

## Key steps / config

1. Register the mixin under a unique name in the mixin registry (e.g. `<administration root>/mixins/swag-basic-example.js`):

```js
const { Mixin } = Shopware;

Mixin.register('swag-basic-mixin', {
    created() { this.hello(); },
    methods: {
        hello() { console.log('hello from mixin!'); },
    },
});
```

2. Import the mixin file in the plugin's `main.js` **before** importing components that use it:

```js
import '<administration root>/mixins/swag-basic-example.js';
// importing components...
```

3. Inject it into a component by name:

```js
const { Component, Mixin } = Shopware;

Component.register('swag-basic-example', {
    mixins: [Mixin.getByName('swag-basic-mixin')],
});
```

The same `Mixin.getByName` call works for Shopware-provided mixins.

## Essential identifiers

- `Shopware.Mixin.register(name, mixin)` — returns the registered mixin
- `Shopware.Mixin.getByName(name)`
- `Shopware.Component.register`
- Example name: `swag-basic-mixin`

## Gotchas

- Import order matters: `Mixin.getByName` throws `The mixin "<name>" is not registered.` if the component file is evaluated before the mixin file registered it.
- Registering a name that already exists does not overwrite: the factory logs a warning ("Please select a unique name for your mixin") and returns the previously registered mixin — prefix names with your plugin/vendor.

## Code check (6.7.13.0)
- confirmed `Mixin.register` — exposed on Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:174
- confirmed `Mixin.getByName` — exposed on Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:175
- confirmed `register` — duplicate name warns and returns the existing mixin — vendor/shopware/administration/Resources/app/administration/src/core/factory/mixin.factory.ts:34
- confirmed `getByName` — throws when the mixin is not registered — vendor/shopware/administration/Resources/app/administration/src/core/factory/mixin.factory.ts:53
- confirmed `Component.register` — exposed on Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:130
