---
id: platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/mixins.md
title: Mixins
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/administration-reference/mixins.html
sourceHash: 7fb3c141e4e2c3f5fff09ff79610dfd32241cd89
codeCheckedAgainst: "6.7.13.0"
keywords: ["mixins", "Mixin.getByName", "Mixin.register", "sw-form-field", "listing", "notification", "validation", "placeholder", "discard-detail-page-changes", "remove-api-error", "user-settings", "generic-condition", "vue mixin", "administration"]
summary: "Reference of Shopware 6.7 Administration mixins (listing, notification, sw-form-field, validation, ...) with their registered names for Mixin.getByName."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md", "platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md"]
---
## What it is

An overview of the mixins provided by the Shopware Administration. They behave like Vue mixins, but are registered with `Shopware.Mixin.register('<name>', ...)` and included in a component by name through `Mixin.getByName('<name>')` in the component's `mixins` array. Core mixins live in `src/app/mixin/*.mixin.ts`.

## When to use

When a component needs shared Administration behaviour (listing pagination, notifications, form-field helpers, validation) and you need the exact registered name. See [Using mixins](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md) and [Adding mixins](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md).

## Key steps / config

```js
mixins: [
    Mixin.getByName('notification'),
    Mixin.getByName('listing'),
],
```

Registered names in the installed 6.7 Administration:

| Name | Purpose |
|---|---|
| `discard-detail-page-changes` | Resets entity changes (incl. associations) on page leave or entity ID change; registered as a function taking entity names. |
| `sw-form-field` | Common form-field behaviour (name handling, inheritance support). File is `form-field.mixin.ts`. |
| `generic-condition` | Base logic for generic rule condition components. |
| `listing` | Listing pages, e.g. tracks the current page. |
| `notification` | Creates Administration notifications. |
| `notification-translation` | Not in the docs table; registered in `notification-translation.mixin.ts`. |
| `placeholder` | Localizes placeholders. |
| `position` | Helpers for position integers. |
| `remove-api-error` | Removes API errors after the user corrects an input. |
| `rule-container` | Shared functions of `sw-condition-or-container` and `sw-condition-and-container`. |
| `salutation` | Adapter for the `salutation` filter. |
| `sw-inline-snippet` | Inline snippets. |
| `user-settings` | Access to the current user's personal settings. |
| `validation` | Input validation in form fields. |

## Essential identifiers

- `Shopware.Mixin.register`, `Mixin.getByName`
- `sw-form-field`, `listing`, `notification`, `validation`, `placeholder`, `position`, `discard-detail-page-changes`, `remove-api-error`, `rule-container`, `salutation`, `sw-inline-snippet`, `user-settings`, `generic-condition`

## Gotchas

- The docs table calls the form-field mixin `form-field` (and lists it twice). The installed code registers it as `sw-form-field`; core components call `Mixin.getByName('sw-form-field')`.
- The docs link to the v6.6.9.0 sources; the 6.7 folder also contains `translate-with-fallback` and `rule-between-operator` (the latter marked `@private`).

## Code check (6.7.13.0)
- corrected `sw-form-field` — docs: `form-field` — vendor/shopware/administration/Resources/app/administration/src/app/mixin/form-field.mixin.ts:11
- confirmed `discard-detail-page-changes` — registered as factory taking entity names — vendor/shopware/administration/Resources/app/administration/src/app/mixin/discard-detail-page-changes.mixin.ts:19
- confirmed `listing` — registered name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/listing.mixin.ts:20
- confirmed `notification` — registered name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:13
- confirmed `validation` — registered name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/validation.mixin.ts:11
- confirmed `generic-condition` — registered name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/generic-condition.mixin.ts:50
- confirmed `user-settings` — registered name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/user-settings.mixin.ts:13
- confirmed `remove-api-error` — registered name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/remove-api-error.mixin.ts:14
- confirmed `notification-translation` — extra mixin not in docs — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification-translation.mixin.ts:18
- confirmed `getByName` — mixin factory lookup function — vendor/shopware/administration/Resources/app/administration/src/core/factory/mixin.factory.ts:53
