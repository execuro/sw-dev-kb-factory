---
id: platform/dev/6.6/guides/plugins/plugins/administration/mixins-directives/using-mixins.md
title: Using Mixins
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/mixins-directives/using-mixins.html
sourceHash: a93db9edae2bc85170f17aff4ada7f9d4b9d7df4
relatedPages:
  - platform/dev/6.6/resources/references/administration-reference/mixins.md
  - platform/dev/6.6/guides/plugins/plugins/administration/mixins-directives/add-mixins.md
keywords: ["mixin", "Mixin.getByName", "notification mixin", "administration mixin", "mixins registry", "createNotificationSuccess", "Vue mixin", "Component.register", "mixins array", "administration", "reuse component logic"]
summary: How to look up an existing Administration mixin with Mixin.getByName and add it to a component's mixins array in Shopware 6.
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to use an existing mixin inside a Shopware 6 Administration plugin component. Mixins in the Administration behave like ordinary Vue mixins — they bundle reusable component options such as methods and lifecycle hooks — but they differ from plain Vue in how they are registered and pulled into a component. The guide assumes the reader already understands Vue mixins in general and links to Vue's own mixin documentation for that background.

## When to use

Use this approach whenever a plugin component needs behavior that a built-in Administration mixin already provides, instead of reimplementing it. The example given is the `notification` mixin, which supplies helper methods for showing notifications to the user in the Administration UI. Before writing this code, the developer is expected to have already found the mixin they need — the guide points to the reference list of predefined Administration mixins, and to a separate guide for creating custom mixins if none of the existing ones fit.

## Key steps / config

Retrieve the mixin definition from the mixin registry using `Mixin.getByName`, destructured together with `Component` from the global `Shopware` object, and add it to the component's `mixins` array when calling `Component.register`:

```javascript
// <administration root>/components/swag-basic-example/index.js
const { Component, Mixin } = Shopware;

Component.register('swag-basic-example', {
    mixins: [
        Mixin.getByName('notification')
    ],

    methods: {
        greet: function () {
            this.createNotificationSuccess({ title: 'Greetings' })
        }
    }
});
```

Once the `notification` mixin is mixed in, its methods — such as `createNotificationSuccess` used above to trigger a success notification with a `title` option — become available directly on the component instance, exactly as with any other Vue mixin.

## Essential identifiers

- `Shopware.Mixin.getByName(name)` — looks up a registered mixin definition by its name, here `'notification'`.
- `Shopware.Component.register(name, { mixins: [...] })` — the `mixins` array option that wires a fetched mixin into a component.
- `createNotificationSuccess({ title })` — a method contributed to the component by the `notification` mixin.

## Version notes

The guide notes that mixins in the Shopware 6 Administration are functionally the same as standard Vue mixins; only the registration/lookup mechanism (`Mixin.getByName` plus the `mixins` array on `Component.register`) is Shopware-specific rather than a version-specific detail.
