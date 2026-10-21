---
id: platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md
title: Using Mixins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/mixins-directives/using-mixins.html
sourceHash: 537f329a6b41061dfc5bc97e56eec50a7fd65bc0
codeCheckedAgainst: "6.7.15.1"
keywords: ["Mixin.getByName", "mixins", "mixin registry", "notification", "createNotificationSuccess", "Component.register", "Shopware.Mixin", "administration mixin", "shared component logic", "vue mixin", "composables", "plugin administration"]
summary: Include an existing Administration mixin in a plugin component via Mixin.getByName in the mixins array, e.g. the notification mixin.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/mixins.md", "platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/displaying-user-feedback.md", "platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/roadmap.md"]
---
## What it is

How to use an existing Shopware Administration mixin inside a plugin component. Mixins behave as in Vue; only registration and inclusion differ: they are fetched from Shopware's mixin registry by name instead of being imported.

## When to use

You need shared component logic that the Administration already provides as a mixin (for example, showing notifications) in an Options API component registered by your plugin. The predefined mixins are listed in [Mixins reference](platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/mixins.md); to write your own, see [Adding mixins](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md).

## Key steps / config

1. Destructure `Component` and `Mixin` from the global `Shopware` object.
2. Fetch the mixin from the registry with `Mixin.getByName('<name>')` and put it into the component's `mixins` array.
3. Call the mixin's methods via `this` — the `notification` mixin provides `createNotificationSuccess` and siblings.

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

For choosing between notifications and snackbars, see [Displaying user feedback](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/displaying-user-feedback.md).

## Essential identifiers

- `Shopware.Mixin.getByName` — registry lookup
- `Shopware.Mixin.register` — registry registration (used by core mixins)
- `notification` — mixin name
- `createNotificationSuccess` — method added by the `notification` mixin
- `mixins` — component option

## Gotchas

- A Single File Component cannot use mixins. The experimental SFC system is adding composables for the commonly used mixins; see [Composables replacing mixins](platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/roadmap.md).
- Mixins are the stable way to share component logic in Options API components today.

## Code check (6.7.15.1)
- confirmed `Mixin.getByName` — exposed on the global Shopware object, mapped to `MixinFactory.getByName` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:188
- confirmed `Mixin.register` — mapped to `MixinFactory.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:187
- confirmed `notification` — core mixin registered under this name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:15
- confirmed `createNotificationSuccess` — method of the notification mixin — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:22
- confirmed `Component.register` — mapped to `AsyncComponentFactory.register` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:135
