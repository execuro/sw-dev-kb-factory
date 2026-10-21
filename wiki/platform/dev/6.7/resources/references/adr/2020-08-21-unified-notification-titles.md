---
id: platform/dev/6.7/resources/references/adr/2020-08-21-unified-notification-titles.md
title: Notification titles are pre-defined and make use of the global namespace
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-08-21-unified-notification-titles.html
sourceHash: 283254870b47f8e47ee2e9100adbfc1373068d30
codeCheckedAgainst: "6.7.15.1"
keywords: ["admin notification", "notification title", "notification.mixin", "createNotificationError", "createNotificationSuccess", "createNotificationInfo", "createNotificationWarning", "useNotification", "global.default.error", "global.default.success", "snippets", "toast message", "administration", "adr"]
summary: "ADR: admin notification titles default to global snippets (global.default.error etc.) in the notification mixin; callers pass only a message."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2020-08-21) for the Shopware administration: notification titles are no longer defined per module. The `notification` mixin sets a global default title per notification type, so a notification only needs a translatable message.

## When to use

- You create success, error, info or warning notifications in an administration module or plugin.
- You are deciding whether to add a title snippet for a notification (normally: don't).

## Key steps / config

The four notification types double as titles: `Success` (green outline), `Error` (red), `Info` (blue), `Warning` (orange). In 6.7.15.1 the mixin file is `src/app/mixin/notification.mixin.ts` and each helper pre-fills `variant` and `title`, then spreads your config over it:

| Method | Default title snippet |
|---|---|
| `createNotificationSuccess` | `global.default.success` |
| `createNotificationError` | `global.default.error` |
| `createNotificationInfo` | `global.default.info` |
| `createNotificationWarning` | `global.default.warning` |

Create an error notification with only a message:

```js
this.createNotificationError({
    message: this.$tc('sw-module.messageError')
});
```

Add one message snippet per snippet file (en-GB and de-DE):

```json
"messageError": "Meaningful error message.",
```

Avoid passing a raw error as message (`message: err`).

The same helpers are exposed by the `useNotification()` composable (`src/app/composables/use-notification.ts`), which the mixin's own comment says duplicates it.

## Essential identifiers

- `notification` mixin — `src/app/mixin/notification.mixin.ts`
- `createNotificationSuccess`, `createNotificationError`, `createNotificationInfo`, `createNotificationWarning`
- `useNotification` composable
- `global.default.success`, `global.default.error`, `global.default.info`, `global.default.warning`

## Gotchas

- Messages should be translatable, precise and not redundant — the title already says "Error", so describe what actually went wrong.
- Use success notifications with useful content (e.g. counters); use info and warning to inform about ongoing things or things needing attention.
- Because your config is spread after the defaults, passing `title` still overrides the preset. The ADR advises against it except for very good reasons.
- Superfluous title snippets were removed when this was introduced (listed in CHANGELOG-6.3.md).

## Version notes

The ADR names the file `notification.mixin.js`; in 6.7.15.1 it is TypeScript (`notification.mixin.ts`). Mixins are legacy in the 6.7 administration; the `useNotification` composable carries the same defaults.

## Code check (6.7.15.1)
- corrected `notification` — docs: mixin in `notification.mixin.js`; installed mixin is registered in `notification.mixin.ts` — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:15
- confirmed `createNotificationSuccess` — default title `global.default.success` — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:22
- confirmed `createNotificationInfo` — default title `global.default.info` — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:32
- confirmed `createNotificationWarning` — default title `global.default.warning` — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:42
- confirmed `createNotificationError` — default title `global.default.error`, config spread after defaults — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:52
- confirmed `global.default.error` — set as title before `...config` — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:55
- confirmed `useNotification` — composable with the same helpers — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-video-cover.ts:55
- confirmed `createNotificationError` — composable defines the same helper with default title — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-notification.ts:60
- confirmed `error` — global default snippet "Error" — vendor/shopware/administration/Resources/app/administration/src/app/snippet/en.json:35
