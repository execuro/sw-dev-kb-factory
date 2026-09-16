---
id: platform/dev/6.6/guides/plugins/plugins/administration/mixins-directives/add-mixins.md
title: Adding Mixins
docType: developer
version: "6.6"
versions: ["6.6"]
relatedPages: ["platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/using-utils.md"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/mixins-directives/add-mixins.html
sourceHash: cdae5d7b23622b7e009b49a1f7f0a84591efc89c
keywords: ["Mixin.register", "Mixin.getByName", "mixins", "Vue mixin", "Administration mixin", "mixin registry", "plugin mixin", "component mixin", "main.js import order"]
summary: "Register an Administration mixin with Mixin.register, import it before components, then attach it via Mixin.getByName."
lastBuilt: "2026-09-15"
---
## What it is

This guide explains how to add a new Administration mixin for a plugin. Mixins behave like standard Vue mixins, differing only in how they are registered and included in a component.

## When to use

Use this when shared behavior needs to be reused across multiple Administration components in a plugin, following the same pattern as Vue mixins but registered through Shopware's mixin registry.

## Key steps / config

Register a mixin with `Mixin.register`, adapting a standard Vue mixin:

```javascript
// <administration root>/mixins/swag-basic-example.js
const { Mixin } = Shopware;

Mixin.register('swag-basic-mixin', {
    created: function () {
        this.hello()
    },
    methods: {
        hello: function () {
            console.log('hello from mixin!')
        }
    }
});
```

Import the mixin file in `main.js` before importing the plugin's components:

```javascript
// <administration root>/src/main.js
import '<administration root>/mixins/swag-basic-example.js'
// importing components...
```

Retrieve the registered mixin with `Mixin.getByName` and add it to a component's `mixins` array:

```javascript
// <administration root>/components/swag-basic-example/index.js
const { Component, Mixin } = Shopware;

Component.register('swag-basic-example', {
    mixins: [
        Mixin.getByName('swag-basic-mixin')
    ],
});
```

The same `Mixin.getByName` pattern applies to mixins Shopware itself provides, not just custom ones.

## Essential identifiers

- `Mixin.register()` — registers a mixin under a name in the Administration's mixin registry.
- `Mixin.getByName()` — retrieves a registered mixin to add to a component's `mixins` array.
- `main.js` import order — the mixin file must be imported before the components that use it.

## Gotchas

- The mixin file must be imported in `main.js` before importing components, or the mixin is not yet registered when the component tries to use it.
