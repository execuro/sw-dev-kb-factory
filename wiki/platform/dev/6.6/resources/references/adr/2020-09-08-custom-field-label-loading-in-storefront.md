---
id: "platform/dev/6.6/resources/references/adr/2020-09-08-custom-field-label-loading-in-storefront.md"
title: "CustomField label loading in storefront"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-09-08-custom-field-label-loading-in-storefront.html"
sourceHash: "393d8d20894404af6ed5561d0c04a29ba5f66fe5"
keywords: ["custom_field.written event", "customFields. snippet prefix", "translationKey", "custom field label", "storefront snippets", "snippet set", "custom field subscriber", "DAL", "performance"]
summary: "ADR: a subscriber on custom_field.written adds label snippets prefixed customFields.<technicalName> so storefront templates can show custom field labels."
lastBuilt: "2026-09-15"
---
## What it is

This ADR explains how custom field labels are made available to the storefront, so third-party developers and templates can display them, without attaching the label to every loaded entity — the rejected alternative was considered a heavy performance leak, since the labels are often not even used in the template.

## When to use

Relevant when a storefront template or third-party extension needs a custom field's human-readable label rather than just its technical name.

## Key steps / config

- A subscriber listens on the `custom_field.written` event.
- On write, it adds a snippet to all snippet sets containing the given label translations of the custom field.
- The snippet's `translationKey` is prefixed with `customFields.`, followed by the technical name of the custom field (for example `customFields.my_custom_field`).
- Because the label becomes a normal snippet, it can be resolved in storefront templates the same way any other snippet is resolved, without loading it onto the entity itself.

## Essential identifiers

- `custom_field.written` event
- `customFields.` translation key prefix

## Gotchas

Inserting a custom field always creates a new snippet entry with the given label translations — a deliberate trade-off to avoid attaching labels to every loaded entity (rejected as a performance risk), at the cost of extra snippet rows being created on every custom field write.
