---
id: platform/dev/6.7/resources/references/adr/2020-09-08-custom-field-label-loading-in-storefront.md
title: CustomField label loading in storefront
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-09-08-custom-field-label-loading-in-storefront.html
sourceHash: 393d8d20894404af6ed5561d0c04a29ba5f66fe5
codeCheckedAgainst: "6.7.15.1"
keywords: ["custom fields", "custom_field.written", "customFields.", "translationKey", "snippets", "snippet set", "CustomFieldSubscriber", "custom field label", "storefront translation", "trans filter", "adr"]
summary: "ADR: custom field labels become storefront snippets with key customFields.<technical name>, written to every snippet set on custom_field.written."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2020-09-08, area: storefront) on how custom field labels are made available in the Storefront. Attaching the labels to every loaded entity was rejected because it costs performance and the labels are rarely used in templates. Instead, a subscriber on the `custom_field.written` event writes the label translations as snippets into all snippet sets.

## When to use

When a Storefront template or theme needs to show the human-readable label of a custom field, and you want to know which snippet key to use and when that snippet is created.

## Key steps / config

- Snippet key: `customFields.` followed by the custom field's technical name, e.g. a custom field named `my_field` yields the snippet `customFields.my_field`.
- The snippets are created by `Shopware\Core\System\Snippet\Subscriber\CustomFieldSubscriber` listening on `custom_field.written`.
- In the installed code, only insert write results whose payload has a non-empty `config.label` produce snippets. One snippet is written per snippet set; the value is the label for the set's ISO code from `config.label`, falling back to the technical name when that locale is missing. The snippet's `author` is `System`.
- The same subscriber listens on `custom_field.deleted` and removes the snippets belonging to the deleted custom field.

## Essential identifiers

- `custom_field.written` (`CustomFieldEvents::CUSTOM_FIELD_WRITTEN_EVENT`)
- `customFields.<technical name>` snippet translation key
- `Shopware\Core\System\Snippet\Subscriber\CustomFieldSubscriber`

## Gotchas

- Inserting a custom field always creates new snippets with the given label translations.
- Only inserts are handled: updating the label of an existing custom field does not rewrite the snippets through this subscriber.

## Code check (6.7.15.1)
- confirmed `custom_field.written` — constant CUSTOM_FIELD_WRITTEN_EVENT — vendor/shopware/core/System/CustomField/CustomFieldEvents.php:10
- confirmed `CustomFieldSubscriber::getSubscribedEvents()` — maps custom_field.written to customFieldIsWritten — vendor/shopware/core/System/Snippet/Subscriber/CustomFieldSubscriber.php:42
- confirmed `CustomFieldSubscriber::customFieldIsWritten()` — only OPERATION_INSERT results with config.label — vendor/shopware/core/System/Snippet/Subscriber/CustomFieldSubscriber.php:42
- confirmed `customFields.` — translation_key prefix plus custom field name — vendor/shopware/core/System/Snippet/Subscriber/CustomFieldSubscriber.php:111
- confirmed `CustomFieldSubscriber::customFieldIsDeleted()` — removes snippets on custom_field.deleted — vendor/shopware/core/System/Snippet/Subscriber/CustomFieldSubscriber.php:81
