---
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/displaying-user-feedback.md
title: Displaying User Feedback
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/displaying-user-feedback.html
sourceHash: d98ef5f6503151283a224dbee2b21d853b73da6d
codeCheckedAgainst: "6.7.13.0"
keywords: ["createNotificationSuccess", "Mixin.getByName('notification')", "notification mixin", "snackbarService", "addSnackbar", "removeSnackbar", "useSnackbar", "snackbar", "notification", "toast", "user feedback", "administration"]
summary: "Show Administration feedback via the notification mixin (createNotificationSuccess) or, from 6.7.14.0, snackbarService.addSnackbar/removeSnackbar."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md"]
---
## What it is

How a plugin gives feedback in the Shopware 6.7 Administration after an action: system notifications via the `notification` mixin, or brief Meteor snackbars.

## When to use

| Use | When |
|---|---|
| Notification | Feedback needs a title, actions, or should be kept as a system notification. |
| Snackbar | Brief, non-blocking confirmation of a completed action. |

## Key steps / config

Notifications — add the mixin to the component and call a `createNotification*` method:

```javascript
const { Component, Mixin } = Shopware;

Component.register('swag-basic-example', {
    mixins: [Mixin.getByName('notification')],
    methods: {
        greet() {
            this.createNotificationSuccess({ title: 'Settings saved' });
        },
    },
});
```

In the installed code, `createNotificationSuccess(config)` merges `config` over defaults `variant: 'success'` and `title: 'global.default.success'`, then calls `createNotification`, which forwards to the `notification` store. Sibling methods such as `createNotificationInfo` exist in the same mixin. Mixin usage in general: platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md.

## Essential identifiers

- `Mixin.getByName('notification')`
- `createNotificationSuccess`, `createNotificationInfo`, `createNotification`

## Gotchas

- `Mixin.getByName` throws if the mixin name is not registered.
- Snackbar service (docs): `Shopware.Service('snackbarService')` is not registered in the installed 6.7.13.0 Administration. The docs state it is available from 6.7.14.0. Usage per docs:

```javascript
const snackbarService = Shopware.Service('snackbarService');
const snackbar = snackbarService.addSnackbar({ message: '...', variant: 'success' });
snackbarService.removeSnackbar(snackbar.id); // dismiss before duration expires
```

- On 6.7.13.0, core's own upload-status component instead uses `useSnackbar()` imported from `@shopware-ag/meteor-component-library`, calling `addSnackbar(config)` and `removeSnackbar(id)` on its result.

## Version notes

- Snackbar service: docs say available from Shopware 6.7.14.0; not present in 6.7.13.0.

## Code check (6.7.13.0)
- confirmed `Mixin.getByName` — global exposes MixinFactory.getByName — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:175
- confirmed `getByName` — throws when mixin not registered — vendor/shopware/administration/Resources/app/administration/src/core/factory/mixin.factory.ts:53
- confirmed `notification` — mixin registered under this name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:13
- confirmed `createNotificationSuccess` — defaults variant success, title global.default.success — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:20
- confirmed `createNotification` — forwards to notification store — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:16
- unverified `snackbarService` — no registration found in installed 6.7.13.0 administration src; docs: from 6.7.14.0
- confirmed `useSnackbar` — core imports it from @shopware-ag/meteor-component-library — vendor/shopware/administration/Resources/app/administration/src/app/component/utils/sw-upload-status/index.ts:2
- confirmed `addSnackbar` — called on useSnackbar() result — vendor/shopware/administration/Resources/app/administration/src/app/component/utils/sw-upload-status/index.ts:329
- confirmed `removeSnackbar` — called with snackbar item id — vendor/shopware/administration/Resources/app/administration/src/app/component/utils/sw-upload-status/index.ts:319
