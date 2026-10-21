---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/administration-reference/mixins.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md
  - platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md
sourceHash: 7fb3c141e4e2c3f5fff09ff79610dfd32241cd89
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/administration-reference/mixins.html
title: Mixins
version: "6.7"
versions:
  - "6.7"
keywords: ["mixins", "vue mixin", "Mixin.getByName", "Shopware.Mixin.register", "notification", "listing", "validation", "sw-form-field", "ruleContainer", "discard-detail-page-changes", "user-settings", "admin shared logic"]
summary: Mixins registered by the 6.7 Administration (notification, listing, validation, sw-form-field, ruleContainer...) and the exact names for Mixin.getByName.
lastBuilt: 2026-10-21
---
## What it is

Overview of the mixins the Shopware 6 Administration provides. They behave like Vue mixins; they differ only in registration (`Shopware.Mixin.register('<name>', ...)`) and in how a component includes them (`mixins: [Shopware.Mixin.getByName('<name>')]`). Source files live in `src/app/mixin/*.mixin.ts`.

## When to use

When an admin component needs common behaviour (notifications, listing pagination, validation, form-field handling) and you want to reuse core logic. See [using mixins in plugins](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/using-mixins.md) and [registering mixins](platform/dev/6.7/guides/plugins/plugins/administration/mixins-directives/add-mixins.md).

## Key steps / config

```js
Shopware.Component.register('my-component', {
    mixins: [
        Shopware.Mixin.getByName('notification'),
        Shopware.Mixin.getByName('listing'),
    ],
});
```

Registered names (pass these to `getByName`; it throws if the name is not registered):

| Name | Description |
|---|---|
| `discard-detail-page-changes` | Resets entity changes (including associations) on page leave or when the entity ID changes; called with entity names |
| `sw-form-field` | Common form-field behaviour, name handling and inheritance support |
| `generic-condition` | Reusable logic for generic rule/condition UI components |
| `listing` | Used in listing pages, e.g. tracks the current page |
| `notification` | Creates admin notifications |
| `placeholder` | Localizes placeholders |
| `position` | Helpers for position integers |
| `remove-api-error` | Removes API errors after the user corrects an input |
| `ruleContainer` | Shared functions of `sw-condition-or-container` and `sw-condition-and-container` |
| `salutation` | Adapter for the `salutation` filter |
| `sw-inline-snippet` | Inline snippet usage |
| `user-settings` | Access and manage the current user's personal settings |
| `validation` | Input validation in form fields |

Also registered in 6.7.15.1 but not in the docs table: `notification-translation`, `translate-with-fallback`.

## Essential identifiers

- `Shopware.Mixin.register()`, `Shopware.Mixin.getByName()`
- `sw-form-field`, `ruleContainer`, `listing`, `notification`, `validation`, `discard-detail-page-changes`

## Gotchas

- The docs name the form-field mixin `form-field` (and list it twice) and the rule container mixin `rule-container`. Those are file names; the registered names are `sw-form-field` and `ruleContainer`. `getByName('form-field')` or `getByName('rule-container')` throws "The mixin ... is not registered."
- The docs' links point to the v6.6.9.0 tag on GitHub; file names are unchanged in 6.7.

## Code check (6.7.15.1)
- corrected `sw-form-field` — docs: `form-field` — vendor/shopware/administration/Resources/app/administration/src/app/mixin/form-field.mixin.ts:11
- corrected `ruleContainer` — docs: `rule-container` — vendor/shopware/administration/Resources/app/administration/src/app/mixin/rule-container.mixin.ts:13
- confirmed `discard-detail-page-changes` — registered, takes entity names — vendor/shopware/administration/Resources/app/administration/src/app/mixin/discard-detail-page-changes.mixin.ts:19
- confirmed `listing` — registered name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/listing.mixin.ts:22
- confirmed `notification` — registered name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification.mixin.ts:15
- confirmed `validation` — registered name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/validation.mixin.ts:13
- confirmed `user-settings` — registered name — vendor/shopware/administration/Resources/app/administration/src/app/mixin/user-settings.mixin.ts:37
- confirmed `Mixin.getByName()` — throws for unregistered names — vendor/shopware/administration/Resources/app/administration/src/core/factory/mixin.factory.ts:53
- confirmed `notification-translation` — extra mixin not in docs — vendor/shopware/administration/Resources/app/administration/src/app/mixin/notification-translation.mixin.ts:20
- confirmed `translate-with-fallback` — extra mixin not in docs — vendor/shopware/administration/Resources/app/administration/src/app/mixin/translate-with-fallback.mixin.ts:20
