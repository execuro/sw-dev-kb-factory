---
id: platform/dev/6.7/concepts/framework/translations/plain-vs-translated-fields.md
title: Plain vs translated entity fields
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/translations/plain-vs-translated-fields.html
sourceHash: e53f520c1f356cb6a5dcb8e26362e07922ef4e76
codeCheckedAgainst: "6.7.15.1"
keywords: ["translated", "getTranslation", "getTranslated", "sw-language-id", "languageIdChain", "translated.name", "plain field", "language inheritance", "translation fallback", "parent language", "dal translations", "twig translated"]
summary: Difference between entity.field (stored value for the context language, may be null) and entity.translated.field (resolved via language inheritance).
lastBuilt: 2026-10-20
relatedPages:
  - platform/dev/6.7/concepts/framework/data-abstraction-layer.md
  - platform/dev/6.7/guides/development/integrations-api/request-headers.md
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-translations.md
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/field-inheritance.md
---
## What it is

Translatable entity data read via the DAL (`EntityRepository`), Admin API, Store API or Twig (storefront, documents, mail) exposes each translatable field twice:

- `salesChannel.name` — the **plain** value stored for the current context language only (may be `null`).
- `salesChannel.translated.name` — the **resolved** value after walking the language inheritance chain.

This applies to every translatable field (`product.name`, `category.description`, custom fields on `translated`, ...).

## When to use

Deciding which variant to read when displaying data versus editing per-language translations.

## Key steps / config

Example chain `EN (root) → DE → AT`, stored names EN `SalesChannel`, DE `Verkaufskanal`, AT unset:

| Context | `salesChannel.name` | `salesChannel.translated.name` |
|---|---|---|
| AT | `null` | `Verkaufskanal` (from DE) |
| AT, DE also empty | `null` | `SalesChannel` (EN root) |
| DE | `Verkaufskanal` | `Verkaufskanal` |

The DAL resolves up to three language levels: current language, optional parent language, system language ([DAL — Translations](platform/dev/6.7/concepts/framework/data-abstraction-layer.md)).

**Display (storefront Twig, documents/mails, Store API, headless, sales-channel PHP):** use `translated`.

```twig
{{ salesChannel.translated.name }}
{{ product.translated.customFields.my_field }}
```

```php
$name = $salesChannel->getTranslation('name'); // resolved via inheritance
// Not: $salesChannel->getName(); // plain value, may be null
```

**Editing (Administration forms, Admin API diffs, override-vs-inherit logic):** use the plain field — `null` means "not set in this language; inherit from parent".

API payloads (Admin and Store API) contain plain fields plus a nested `translated` object; the [`sw-language-id`](platform/dev/6.7/guides/development/integrations-api/request-headers.md) header selects which language the plain fields refer to, while `translated` still applies inheritance. See also [Adding data translations](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-translations.md) and [Field inheritance](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/field-inheritance.md).

## Essential identifiers

`translated`, `Entity::getTranslation()`, `Entity::getTranslated()`, `sw-language-id`

## Gotchas

Reading the plain field for display yields empty labels for languages that inherit from a parent.

## Code check (6.7.15.1)
- confirmed `Entity::$translated` — array holding resolved values — vendor/shopware/core/Framework/DataAbstractionLayer/Entity.php:21
- confirmed `Entity::getTranslation()` — returns `translated[$field]` or null — vendor/shopware/core/Framework/DataAbstractionLayer/Entity.php:144
- confirmed `Entity::getTranslated()` — returns the translated array — vendor/shopware/core/Framework/DataAbstractionLayer/Entity.php:136
- confirmed `ApiRequestContextResolver::getLanguageIdChain()` — chain is language, parent, system fallback — vendor/shopware/core/Framework/Routing/ApiRequestContextResolver.php:52
- confirmed `EntityDefinitionQueryHelper::buildTranslationChain()` — one override join per chain level — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/EntityDefinitionQueryHelper.php:587
- confirmed `PlatformRequest::HEADER_LANGUAGE_ID` — `sw-language-id` — vendor/shopware/core/PlatformRequest.php:20
