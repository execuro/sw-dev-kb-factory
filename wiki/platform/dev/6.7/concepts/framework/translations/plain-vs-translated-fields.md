---
id: platform/dev/6.7/concepts/framework/translations/plain-vs-translated-fields.md
title: Plain vs translated entity fields
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/translations/plain-vs-translated-fields.html
sourceHash: e53f520c1f356cb6a5dcb8e26362e07922ef4e76
codeCheckedAgainst: "6.7.13.0"
keywords: ["translated", "entity.translated.field", "getTranslation", "language inheritance", "plain field", "translation fallback", "sw-language-id", "languageIdChain", "EntityRepository", "twig translated", "null translation", "parent language"]
summary: entity.field (stored value for current language, may be null) vs entity.translated.field (resolved via language inheritance) in DAL, APIs, Twig.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/data-abstraction-layer.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-translations.md", "platform/dev/6.7/guides/development/integrations-api/request-headers.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/field-inheritance.md"]
---
## What it is

Every translatable entity field can be read in two forms — via the DAL (`EntityRepository`), Admin API, Store API or Twig (storefront, documents, mail):

- `salesChannel.name` — the **plain** value stored for the current context language only; may be `null`.
- `salesChannel.translated.name` — the **resolved** value after walking the language inheritance chain.

The pattern applies to all translatable fields (`product.name`, `category.description`, custom fields on the `translated` object). Both exist because the DAL serves the CRUD-style Admin API and Administration, where editors must see what is actually stored for a language versus what a customer sees after fallbacks.

## When to use

- Displaying or sending a value (Storefront Twig, document/mail templates including merchant-edited ones, Store API clients, headless frontends, sales-channel PHP): use `translated`.
- Editing per-language data (Administration forms/listings, Admin API integrations writing or diffing language-specific payloads, "override vs inherit" logic): use the plain field, where `null` means "not set in this language; inherit from the parent language".

## Key steps / config

Resolution example with chain `EN (root) → DE → AT`, stored names EN `SalesChannel`, DE `Verkaufskanal`, AT `null`:

| Context | `salesChannel.name` | `salesChannel.translated.name` |
|---|---|---|
| AT | `null` | `Verkaufskanal` (from DE) |
| AT, DE also `null` | `null` | `SalesChannel` (EN root) |
| DE | `Verkaufskanal` | `Verkaufskanal` |

When the current language has its own value, plain and translated are equal. The DAL resolves at most three levels when reading: current language, optional parent language, system language (see [Data Abstraction Layer](platform/dev/6.7/concepts/framework/data-abstraction-layer.md)).

Display (Twig):

```twig
{{ salesChannel.translated.name }}
{{ product.translated.name }}
{{ product.translated.customFields.my_field }}
```

PHP in sales-channel context:

```php
$name = $salesChannel->getTranslation('name'); // resolved via inheritance
// Not: $salesChannel->getName(); // plain, current language only (may be null)
```

Admin JS:

```js
salesChannel.name;            // language-specific stored value, may be null
salesChannel.translated.name; // resolved preview
```

API payloads (Admin and Store API) contain the plain fields plus a nested `translated` object. The `sw-language-id` request header selects which language the plain fields refer to; `translated` still applies inheritance for missing values.

## Essential identifiers

- `entity.field` vs `entity.translated.field`
- `Entity::getTranslation()`
- `sw-language-id` header (`PlatformRequest::HEADER_LANGUAGE_ID`)
- `Context::getLanguageIdChain()`

## Gotchas

- Reading the plain field for display yields empty labels for languages that inherit their value — integrations that only display data should always read `translated`.
- Translated custom fields are reached through the `translated` object (`product.translated.customFields.my_field`).

## Code check (6.7.13.0)
- confirmed `Entity::getTranslation()` — returns translated[$field] or null — vendor/shopware/core/Framework/DataAbstractionLayer/Entity.php:144
- confirmed `Entity::$translated` — array holding resolved values — vendor/shopware/core/Framework/DataAbstractionLayer/Entity.php:21
- confirmed `SalesChannelEntity::getName()` — nullable plain getter — vendor/shopware/core/System/SalesChannel/SalesChannelEntity.php:295
- confirmed `sw-language-id` — PlatformRequest::HEADER_LANGUAGE_ID value — vendor/shopware/core/PlatformRequest.php:20
- confirmed `Context::getLanguageIdChain()` — chain used for translation resolution — vendor/shopware/core/Framework/Context.php:167
- confirmed `systemFallbackLanguageId` — Admin API chain is current, parent, system language (max three) — vendor/shopware/core/Framework/Routing/ApiRequestContextResolver.php:196
