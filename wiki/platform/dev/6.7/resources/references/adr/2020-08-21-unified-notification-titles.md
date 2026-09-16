---
id: platform/dev/6.7/resources/references/adr/2020-08-21-unified-notification-titles.md
title: Notification titles are pre-defined and make use of the global namespace
docType: developer
version: "6.7"
versions:
  - "6.7"
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-08-21-unified-notification-titles.html
sourceHash: 283254870b47f8e47ee2e9100adbfc1373068d30
codeCheckedAgainst: "6.7.13.0"
keywords: ["notification", "notification title", "notification mixin", "createNotificationError", "createNotificationSuccess", "createNotificationInfo", "createNotificationWarning", "global.default.error", "global.default.success", "administration", "snippets", "adr"]
summary: "ADR: admin notification titles come from the notification mixin (global.default.success/error/info/warning); modules pass only a translated message."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2020-08-21): Administration notification titles are pre-defined centrally in the `notification` mixin and use the global snippet namespace, so a module only supplies the notification message.

## When to use

- Showing success, error, info or warning notifications from an Administration component.
- Deciding which snippets a module needs for its notifications (message only, no title).

## Key steps / config

The four notification types double as titles: Success (green outline), Error (red outline), Info (blue outline), Warning (orange outline).

1. Use the `notification` mixin (`Mixin.getByName('notification')`), registered in `src/app/mixin/notification.mixin.ts` (the ADR names `notification.mixin.js`; the installed file is TypeScript).
2. Call the method for the type; each sets `variant` and a default `title` snippet key, then spreads your config over it:
   - `createNotificationSuccess` — `global.default.success`
   - `createNotificationError` — `global.default.error`
   - `createNotificationInfo` — `global.default.info`
   - `createNotificationWarning` — `global.default.warning`
3. Pass only a translated `message`:

```js
this.createNotificationError({
    message: this.$tc('sw-module.messageError')
});
```

4. Add one message snippet per snippet file (en-GB and de-DE), e.g. `"messageError": "Meaningful error message."`.

## Essential identifiers

- `notification` mixin, `notification.mixin.ts`
- `createNotificationSuccess`, `createNotificationError`, `createNotificationInfo`, `createNotificationWarning`
- `global.default.success`, `global.default.error`, `global.default.info`, `global.default.warning`

## Gotchas

- Avoid passing raw errors as the message (`message: err`); messages should be translatable, precise and not repeat the title ("Error").
- Success notifications should carry useful information, e.g. counters; use info/warning to flag ongoing work or things needing a closer look.
- Because the config is spread after the defaults, a custom `title` still overrides the preset. The ADR advises against it except for very good reasons.
- The `createSystemNotification*` variants set `system: true` but no default title.

## Version notes

- Introduced in 6.3: superfluous title definitions and snippets were removed (listed in CHANGELOG-6.3.md).

## Code check (6.7.13.0)
- confirmed `notification` — mixin registered under this name in notification.mixin.ts (docs say .js) — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:13
- confirmed `createNotificationSuccess` — default title global.default.success — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:20
- confirmed `createNotificationInfo` — default title global.default.info — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:30
- confirmed `createNotificationWarning` — default title global.default.warning — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:40
- confirmed `createNotificationError` — default title global.default.error, config spread after it — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:50
- confirmed `global.default.error` — preset title key — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:53
- confirmed `global.default.success` — preset title key — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:23
- confirmed `createSystemNotificationError` — sets system true without default title — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:90
