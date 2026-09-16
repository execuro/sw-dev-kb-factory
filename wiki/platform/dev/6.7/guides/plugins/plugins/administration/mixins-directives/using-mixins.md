---
id: platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md
title: Using Mixins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/mixins-directives/using-mixins.html
sourceHash: 3f07fbea746dab7611eb372b6f8ef42d5ee03c34
codeCheckedAgainst: "6.7.13.0"
keywords: ["Mixin.getByName", "notification", "createNotificationSuccess", "Shopware.Mixin", "mixins", "existing mixin", "notification mixin", "Component.register", "administration plugin", "user feedback", "vue mixin"]
summary: "Inject an existing Administration mixin into a plugin component via Mixin.getByName, e.g. the notification mixin providing createNotificationSuccess."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/mixins.md", "platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/displaying-user-feedback.md"]
---
## What it is

How a plugin component uses one of the mixins shipped with the Shopware 6 Administration. Mixins behave as in Vue; they are only registered in, and fetched by name from, a global registry.

## When to use

You want built-in Administration behaviour (e.g. user notifications) inside your own component. The list of predefined mixins is in the [mixins reference](platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/mixins.md); to write your own, see [Adding Mixins](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md).

## Key steps / config

1. Find the mixin name in the reference.
2. Fetch it with `Mixin.getByName` and add it to the component's `mixins` array; its methods become available on `this`:

```js
const { Component, Mixin } = Shopware;

Component.register('swag-basic-example', {
    mixins: [Mixin.getByName('notification')],
    methods: {
        greet() {
            this.createNotificationSuccess({ title: 'Greetings' });
        },
    },
});
```

The `notification` mixin forwards to the `notification` Pinia store (`Shopware.Store.get('notification')`). `createNotificationSuccess` sets `variant: 'success'` and a default title `global.default.success`, which your config overrides. Choosing between notifications and snackbars is covered in [Displaying user feedback](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/displaying-user-feedback.md).

## Essential identifiers

- `Shopware.Mixin.getByName(name)`
- `notification` mixin: `createNotification`, `createNotificationSuccess`, `createNotificationInfo`
- `Shopware.Component.register`

## Gotchas

- `Mixin.getByName` throws `The mixin "<name>" is not registered.` for an unknown or not-yet-registered name.

## Code check (6.7.13.0)
- confirmed `Mixin.getByName` — exposed on Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:175
- confirmed `getByName` — throws when the mixin is not registered — vendor/shopware/administration/Resources/app/administration/src/core/factory/mixin.factory.ts:53
- confirmed `notification` — mixin registered under this name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:13
- confirmed `createNotification` — delegates to the notification store — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:16
- confirmed `createNotificationSuccess` — variant success, default title global.default.success — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:20
- confirmed `createNotificationInfo` — info variant helper — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:30
- confirmed `Component.register` — exposed on Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:130
