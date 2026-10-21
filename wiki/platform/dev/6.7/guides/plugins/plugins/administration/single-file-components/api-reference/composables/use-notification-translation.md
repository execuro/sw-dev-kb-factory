---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-notification-translation.md
title: useNotificationTranslation()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-notification-translation.html
sourceHash: e89fad0d727ca1006324c846f08435c68fb0a2e9
codeCheckedAgainst: "6.7.15.1"
keywords: ["useNotificationTranslation", "shopware:composables", "notification-translation mixin", "getTranslatedTitle", "getTranslatedMessage", "NotificationType", "snippet key", "sanitize", "notification rendering", "composable"]
summary: "Admin composable useNotificationTranslation(): translates notification title/message snippet keys and sanitizes the message to a small HTML allow-list."
lastBuilt: 2026-10-21
---
## What it is

`useNotificationTranslation()` is the Administration composable with the rendering helpers the notification components share. It replaces the `notification-translation` mixin.

## When to use

Rendering a notification's title or message in a Composition API component, where the value may be either a snippet key or a plain string.

## Key steps / config

```ts
import { useNotificationTranslation } from 'shopware:composables';

const { getTranslatedTitle, getTranslatedMessage } = useNotificationTranslation();
```

- `getTranslatedTitle(notification)` — translates `notification.title` if it is a known snippet key, otherwise returns it unchanged; returns `''` if there is no title.
- `getTranslatedMessage(notification)` — same for `notification.message`, then sanitizes the result. Allowed tags: `a`, `b`, `i`, `u`, `strong`, `em`, `br`; allowed attributes: `href`, `target`.

## Essential identifiers

- `useNotificationTranslation`, `getTranslatedTitle`, `getTranslatedMessage`, `NotificationType`
- `notification-translation` mixin

## Gotchas

- A notification message may carry a link, but no other markup survives sanitizing.
- Translation comes from `useI18n()`, so the composable must run inside a component setup.
- In 6.7.15.1 the file is marked `@private` and `@experimental stableVersion:v6.9.0`.

## Code check (6.7.15.1)
- confirmed `useNotificationTranslation` — default export returning both helpers — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-notification-translation.ts:23
- confirmed `getTranslatedTitle()` — uses `i18n.te`/`i18n.t`, falls back to the raw string — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-notification-translation.ts:31
- confirmed `getTranslatedMessage()` — sanitizes via `Sanitizer.sanitize` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-notification-translation.ts:39
- confirmed `ALLOWED_TAGS` — a, b, i, u, strong, em, br — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-notification-translation.ts:47
- confirmed `ALLOWED_ATTR` — href and target only — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-notification-translation.ts:56
- confirmed `@experimental` — experimental, stableVersion v6.9.0 — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-notification-translation.ts:4
- confirmed `notification-translation` — mixin name of the Options API predecessor — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification-translation.mixin.ts:20
- unverified `shopware:composables` — import alias not defined inside the administration `src` tree; build-level alias, out of scope
