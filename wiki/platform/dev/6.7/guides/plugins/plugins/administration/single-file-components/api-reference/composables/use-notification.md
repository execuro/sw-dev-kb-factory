---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-notification.md
title: useNotification()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-notification.html
sourceHash: f8b7c2e563c31ace40ab886b51b88d878e7cd02c
codeCheckedAgainst: "6.7.15.1"
keywords: ["useNotification", "shopware:composables", "notification mixin", "createNotification", "createNotificationSuccess", "createNotificationError", "createSystemNotification", "NotificationType", "notification center", "toast", "growl", "composable"]
summary: "Admin composable useNotification(): createNotification* and createSystemNotification* helpers for Administration notifications; replaces the notification mixin."
lastBuilt: 2026-10-21
---
## What it is

`useNotification()` is the Administration composable that creates the notifications shown in the top right of the Administration. It replaces the `notification` mixin.

## When to use

Showing success/info/warning/error feedback from a Composition API component, e.g. after a save or a failed request.

## Key steps / config

```ts
import { useNotification } from 'shopware:composables';

const { createNotificationSuccess } = useNotification();

createNotificationSuccess({ message: 'Margin recalculated' });
```

Returned functions:

- `createNotificationSuccess`, `createNotificationInfo`, `createNotificationWarning`, `createNotificationError` — set the variant and a default title (`global.default.success` / `.info` / `.warning` / `.error`); passing `message` is enough. Your config is spread last, so it can override both.
- `createSystemNotification` (sets `system: true` only) and `createSystemNotificationSuccess`, `createSystemNotificationInfo`, `createSystemNotificationWarning`, `createSystemNotificationError` — set `system: true` and the variant, but no default title.
- `createNotification(notification)` — the base call all others use; delegates to the `notification` store's `createNotification`.

## Essential identifiers

- `useNotification`, `createNotification`, `NotificationType`
- `createNotificationSuccess`, `createNotificationInfo`, `createNotificationWarning`, `createNotificationError`
- `createSystemNotification`, `createSystemNotificationSuccess`, `createSystemNotificationInfo`, `createSystemNotificationWarning`, `createSystemNotificationError`
- `notification` mixin

## Gotchas

- Only `createNotification()` returns a value: the id of the created notification, or `null` for a success notification or one without a `message`.
- Every notification except a success one is also kept in the notification center.
- A notification without `message` is dropped with a debug warning.
- In 6.7.15.1 the file is marked `@private` and `@experimental stableVersion:v6.9.0`.

## Code check (6.7.15.1)
- confirmed `useNotification` — default export returning the ten documented functions — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-notification.ts:20
- confirmed `createNotification()` — delegates to `Shopware.Store.get('notification').createNotification` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-notification.ts:33
- confirmed `createNotificationSuccess()` — variant `success`, default title `global.default.success` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-notification.ts:36
- confirmed `createSystemNotificationSuccess()` — sets `system: true` and variant, no title — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-notification.ts:68
- confirmed `createSystemNotification()` — sets only `system: true` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-notification.ts:100
- confirmed `notificationStore.createNotification()` — returns `null` without `message` — vendor/shopware/administration/Resources/app/administration/src/app/store/notification.store.ts:254
- confirmed `notificationStore.createNotification()` — success variant returns `null`, not stored in the center — vendor/shopware/administration/Resources/app/administration/src/app/store/notification.store.ts:253
- confirmed `@experimental` — experimental, stableVersion v6.9.0 — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-notification.ts:4
- confirmed `notification` — mixin name of the Options API predecessor — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:15
- unverified `shopware:composables` — import alias not defined inside the administration `src` tree; build-level alias, out of scope
