---
id: platform/dev/6.7/resources/references/adr/2020-09-08-custom-field-label-loading-in-storefront.md
title: CustomField label loading in storefront
docType: developer
version: "6.7"
versions:
  - "6.7"
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-09-08-custom-field-label-loading-in-storefront.html
sourceHash: 393d8d20894404af6ed5561d0c04a29ba5f66fe5
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom field label", "custom fields", "custom_field.written", "CustomFieldSubscriber", "translationKey", "customFields.", "snippet", "snippet set", "storefront translation", "label translations", "adr", "storefront"]
summary: "ADR: on custom_field.written a subscriber creates snippets customFields.<name> in every snippet set from the field's label, for use in the Storefront."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2020-09-08): custom field labels are made available in the Storefront as snippets, not by attaching labels to every loaded entity (which would cost performance for labels templates rarely use).

## When to use

- Showing a custom field's label in a Storefront template.
- Understanding where `customFields.*` snippets in the snippet sets come from.

## Key steps / config

Installed implementation: `Shopware\Core\System\Snippet\Subscriber\CustomFieldSubscriber` (marked `@internal`).

1. It listens on `custom_field.written` (`customFieldIsWritten`) and `custom_field.deleted` (`customFieldIsDeleted`).
2. For each write result that is an **insert** and whose payload has a non-empty `config.label`, it creates one snippet per snippet set:
   - `translationKey`: `customFields.` followed by the custom field's technical `name`
   - value: the label for the snippet set's ISO (e.g. `en-GB`), falling back to the technical name when that locale has no label
   - author `System`, and `custom_fields` holding `custom_field_id`
3. Existing keys are updated on duplicate (value overwritten).
4. On deletion, snippets whose `custom_fields.custom_field_id` matches the deleted ids are removed.

Payload shape the subscriber reads:

```json
{
  "name": "my_field",
  "config": { "label": { "en-GB": "...", "de-DE": "..." } }
}
```

The resulting snippet key (`customFields.my_field`) can then be used like any other snippet in Storefront templates.

## Essential identifiers

- `custom_field.written`, `custom_field.deleted`
- `CustomFieldSubscriber`
- `customFields.<technical name>` snippet `translationKey`

## Gotchas

- Snippets are created only when a custom field is inserted; updating an existing field's label does not update the snippets.
- A custom field without `config.label` gets no snippet.
- If no snippet sets exist, nothing is written.

## Code check (6.7.13.0)
- confirmed `custom_field.written` — subscribed to customFieldIsWritten — vendor/shopware/core/System/Snippet/Subscriber/CustomFieldSubscriber.php:37
- confirmed `custom_field.deleted` — subscribed to customFieldIsDeleted — vendor/shopware/core/System/Snippet/Subscriber/CustomFieldSubscriber.php:38
- confirmed `CustomFieldSubscriber` — internal subscriber in the Snippet package — vendor/shopware/core/System/Snippet/Subscriber/CustomFieldSubscriber.php:21
- confirmed `OPERATION_INSERT` — snippets only created on insert — vendor/shopware/core/System/Snippet/Subscriber/CustomFieldSubscriber.php:51
- confirmed `customFields.` — translation key prefix plus technical name — vendor/shopware/core/System/Snippet/Subscriber/CustomFieldSubscriber.php:108
- confirmed `translationKey` — snippet field mapped to translation_key — vendor/shopware/core/System/Snippet/SnippetDefinition.php:57
- confirmed `CUSTOM_FIELD_WRITTEN_EVENT` — constant value custom_field.written — vendor/shopware/core/System/CustomField/CustomFieldEvents.php:10
