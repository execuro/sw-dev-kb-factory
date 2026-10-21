---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md
  - platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-filter.md
  - platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/using-utils.md
sourceHash: 79d57223232ca198ebb51a216d80a15b81921b42
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/mixins-directives/add-mixins.html
title: Adding Mixins
version: "6.7"
versions:
  - "6.7"
keywords: ["mixin", "Mixin.register", "Mixin.getByName", "mixin registry", "MixinFactory", "mixins", "main.js", "Component.register", "administration plugin", "shared component logic", "vue mixin"]
summary: Register a custom Administration mixin with Shopware.Mixin.register, import it in main.js before components, and inject it via Mixin.getByName.
lastBuilt: 2026-10-21
---
## What it is

How to add your own Administration mixin in a plugin. Mixins behave as in Vue; only registration and inclusion differ: a mixin is stored under a name in Shopware's mixin registry and fetched from there by components.

## When to use

You want to share lifecycle hooks or methods between several Administration components of your plugin. For the mixins Shopware already provides, see [Using Mixins](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md).

## Key steps / config

1. Register the mixin under a unique name with `Mixin.register(name, mixin)`, e.g. in `<administration root>/mixins/swag-basic-example.js`:

```javascript
const { Mixin } = Shopware;

Mixin.register('swag-basic-mixin', {
    created() { this.hello(); },
    methods: {
        hello() { console.log('hello from mixin!'); },
    },
});
```

2. Import that file in `<administration root>/src/main.js` **before** importing your components:

```javascript
import '<administration root>/mixins/swag-basic-example.js'
// importing components...
```

3. Inject it into a component with `Mixin.getByName`:

```javascript
const { Component, Mixin } = Shopware;

Component.register('swag-basic-example', {
    mixins: [Mixin.getByName('swag-basic-mixin')],
});
```

The same `Mixin.getByName` call works for Shopware's own mixins.

## Essential identifiers

- `Shopware.Mixin.register(name, mixin)`
- `Shopware.Mixin.getByName(name)`
- `Shopware.Component.register`
- `main.js` — plugin Administration entry point

## Gotchas

- Import order matters: the mixin file must be loaded before the components that call `Mixin.getByName`, because `getByName` throws `The mixin "<name>" is not registered.` for an unknown name.
- Names must be unique: registering an existing name only logs a warning and returns the already registered mixin — your new definition is ignored.

## Code check (6.7.15.1)
- confirmed `Mixin.register` — exposed on the Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:187
- confirmed `Mixin.getByName` — exposed on the Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:188
- confirmed `MixinFactory::register()` — duplicate name warns and returns existing mixin — vendor/shopware/administration/Resources/app/administration/src/core/factory/mixin.factory.ts:34
- confirmed `MixinFactory::getByName()` — throws when the mixin is not registered — vendor/shopware/administration/Resources/app/administration/src/core/factory/mixin.factory.ts:53
- confirmed `Component.register` — exposed on the Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:135
