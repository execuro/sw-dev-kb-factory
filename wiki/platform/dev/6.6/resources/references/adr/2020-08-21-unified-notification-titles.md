---
id: "platform/dev/6.6/resources/references/adr/2020-08-21-unified-notification-titles.md"
title: "Notification titles are pre-defined and make use of the global namespace"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-08-21-unified-notification-titles.html"
sourceHash: "283254870b47f8e47ee2e9100adbfc1373068d30"
keywords: ["notification.mixin.js", "createNotificationError", "notification titles", "Success", "Error", "Info", "Warning", "sw-module.messageError", "administration notifications", "global namespace", "snippet", "notification mixin"]
summary: "ADR: administration notification titles are supplied globally by notification.mixin.js; modules only provide a translated message snippet."
lastBuilt: "2026-09-15"
---
## What it is

This ADR unifies administration notification titles by defining them centrally, instead of requiring each module to invent its own title text, which had led to inconsistent notification appearances.

## When to use

Relevant when implementing or reviewing a notification (`createNotificationError` and the success/info/warning equivalents) in the Shopware administration — it determines what belongs in the message versus the title.

## Key steps / config

- A global default title per notification type is implemented in `notification.mixin.js` (path: `/shopware/src/Administration/Resources/app/administration/src/app/mixin/notification.mixin.js`).
- Superfluous per-module title definitions and their snippets are removed.
- The four supported notification types are `Success` (green outline), `Error` (red outline), `Info` (blue outline), `Warning` (orange outline) — each already has its title supplied by the mixin.
- Modules now only provide a message, e.g.:
```js
this.createNotificationError({
    message: this.$tc('sw-module.messageError')
});
```
- Only one snippet key per notification is needed per language file (en-GB and de-DE), e.g. `"messageError": "Meaningful error message."`.
- It remains technically possible to override the mixin's title default with an individual title, but this is discouraged and reserved for exceptional cases, since it works against the unified-titles design.

## Essential identifiers

- `notification.mixin.js`
- `createNotificationError`

## Gotchas

Avoid passing a raw caught error object as the message (`message: err`) — messages should be translatable, precise, and non-redundant; an error notification's title already says "Error", so the message should explain what went wrong rather than repeat it. Success notifications should carry useful information (e.g. counters); info/warning notifications should keep users informed about ongoing conditions.
