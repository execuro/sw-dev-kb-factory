---
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/displaying-user-feedback.md
title: Displaying User Feedback
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/displaying-user-feedback.html
sourceHash: d98ef5f6503151283a224dbee2b21d853b73da6d
codeCheckedAgainst: "6.7.15.1"
keywords: ["createNotificationSuccess", "Mixin.getByName('notification')", "snackbarService", "addSnackbar", "removeSnackbar", "notification", "snackbar", "toast", "user feedback", "meteor snackbar", "success message"]
summary: Show Administration user feedback via the notification mixin (createNotificationSuccess) or the snackbarService (addSnackbar/removeSnackbar, 6.7.14.0+).
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md
---
## What it is

How a plugin gives feedback after an action in the Administration: either a notification (via the `notification` mixin) or a global Meteor snackbar (via `snackbarService`).

## When to use

| Use | When |
|---|---|
| Notification | Feedback needs a title, actions, or should be kept as a system notification. |
| Snackbar | Brief, non-blocking confirmation of a completed action. |

## Key steps / config

### Notifications

Add the mixin and call one of its methods:

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

The mixin also provides `createNotificationInfo`, `createNotificationWarning` and `createNotificationError`; each sets the matching `variant` and a default title, which your config overrides. Mixin usage in general: [Using Mixins](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md).

### Snackbars

```javascript
const snackbarService = Shopware.Service('snackbarService');
const snackbar = snackbarService.addSnackbar({
    message: 'The settings have been saved.',
    variant: 'success',
});
snackbarService.removeSnackbar(snackbar.id);
```

`addSnackbar()` returns the snackbar object including its generated `id`; pass that id to `removeSnackbar()` to dismiss it before its duration expires.

## Essential identifiers

- `Mixin.getByName('notification')`
- `createNotificationSuccess(config)` (plus `createNotificationInfo`, `createNotificationWarning`, `createNotificationError`)
- `Shopware.Service('snackbarService')`
- `snackbarService.addSnackbar({ message, variant })`
- `snackbarService.removeSnackbar(id)`

## Version notes

- `snackbarService` is available from Shopware 6.7.14.0.

## Code check (6.7.15.1)
- confirmed `Mixin.getByName` — exposed on the global Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:188
- confirmed `notification` — mixin registered under this name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:15
- confirmed `createNotificationSuccess()` — sets variant success and default title, config overrides — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:22
- confirmed `snackbarService` — registered as a service provider — vendor/shopware/administration/Resources/app/administration/src/app/main.ts:177
- confirmed `SnackbarService::addSnackbar()` — takes config without id, returns Snackbar — vendor/shopware/administration/Resources/app/administration/src/app/service/snackbar.service.ts:11
- confirmed `SnackbarService::removeSnackbar()` — takes the snackbar id — vendor/shopware/administration/Resources/app/administration/src/app/service/snackbar.service.ts:15
- confirmed `useMeteorSnackbar` — service delegates to the Meteor snackbar composable — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-snackbar.ts:12
