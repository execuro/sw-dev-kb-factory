---
id: platform/dev/6.6/resources/references/administration-reference/mixins.md
title: Mixins
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/administration-reference/mixins.html
sourceHash: b61b3c444ad6c0deb831fb22e6398a491668006c
keywords: ["mixin", "Vue mixin", "discard-detail-page-changes", "form-field", "generic-condition", "listing mixin", "notification mixin", "placeholder mixin", "position mixin", "remove-api-error", "rule-container", "salutation mixin", "sw-inline-snippet", "validation mixin"]
summary: "Reference table of Shopware Administration mixins: discard-detail-page-changes, form-field, listing, notification, validation, and more."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.6/guides/plugins/plugins/administration/mixins-directives/using-mixins.md", "platform/dev/6.6/guides/plugins/plugins/administration/mixins-directives/add-mixins.md"]
---
## What it is
This is an overview of the mixins provided by the Shopware 6 Administration. They behave like normal Vue mixins, differing only in registration and how they are included in a component.

## Key steps / config
| Mixin | Description |
|---|---|
| `discard-detail-page-changes` | Resets entity changes (including associations) on page leave or when the entity id changes. |
| `form-field` | Provides common functionality between form fields. |
| `generic-condition` | (no description given). |
| `listing` | Used in almost all listing pages, e.g. to track the current page. |
| `notification` | Simplifies creating notifications in the administration. |
| `placeholder` | Provides a function to localize placeholders. |
| `position` | Helpers to work with position integers. |
| `remove-api-error` | Removes API errors, e.g. after the user corrects an invalid input. |
| `rule-container` | Common functions shared between `sw-condition-or-container` and `sw-condition-and-container`. |
| `salutation` | Common adapter for the `salutation` filter. |
| `sw-inline-snippet` | Makes it possible to use snippets inline. |
| `user-settings` | (no description given). |
| `validation` | Validates inputs in various form fields. |

## Essential identifiers
- `discard-detail-page-changes`
- `form-field`
- `listing`
- `notification`
- `rule-container`
- `validation`
