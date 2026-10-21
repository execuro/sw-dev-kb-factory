---
id: platform/dev/6.7/concepts/framework/data-abstraction-layer.md
title: Data Abstraction Layer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/data-abstraction-layer.html
sourceHash: fc959a20f1fe58e304b629c78876fd36dd569e7a
codeCheckedAgainst: "6.7.15.1"
keywords: ["dal", "data abstraction layer", "EntityRepository", "product.repository", "Context", "criteria", "orm", "translations", "_translation", "versioning", "version_id", "inheritance", "EntityIndexer", "ProductIndexer", "database access"]
summary: "DAL concept: Shopware's thin non-ORM database layer - EntityRepository via DI, translation fallback, versioning, Context, parent-child inheritance, indexers."
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/concepts/framework/translations/plain-vs-translated-fields.md"]
---
## What it is

Shopware uses no ORM but a thin abstraction layer, the Data Abstraction Layer (DAL), built for Shopware's needs. Developers access the database through pre-defined interfaces; concepts such as Criteria resemble Doctrine and other ORMs. The DAL also implements translations, versioning, context-dependent behavior, parent-child inheritance and indexing.

## When to use

Read this when you need database access in a plugin or service, or need to understand how translations, versions, the `Context` and variant inheritance affect what a DAL read or write returns.

## Key steps / config

CRUD goes through an `EntityRepository` - the recommended way to interface with the DAL or the database in general (`search()`, `searchIds()`, `aggregate()`, `update()`, ...).

Get the repository from the DI container via constructor injection:

```php
// <plugin root>/src/Service/DalExampleService.php
public function __construct(EntityRepository $productRepository)
{
    $this->productRepository = $productRepository;
}
```

With autowiring (correct type and argument name) it is injected automatically; otherwise wire the `product.repository` service explicitly:

```php
// <plugin root>/src/Resources/config/services.php
$services->set(Swag\ExamplePlugin\Service\DalExampleService::class)
    ->args([service('product.repository')]);
```

See [dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md).

**Translations** - on read/search three language levels are searched: current language, optional parent language (useful for dialects), then the system language chosen at installation (final fallback; every entity has a translation in it). Translations live in a separate table named like the base table plus suffix `_translation`. Every translatable property is exposed twice: the plain field for the current language (may be `null`) and under `translated` with inheritance applied. Prefer `translated` in storefront/sales-channel contexts, the plain field in Admin/CRUD flows. See [plain vs translated fields](platform/dev/6.7/concepts/framework/translations/plain-vs-translated-fields.md).

**Versioning** - multiple versions of an entity can be stored (previews, publishing, campaigns); all data of the entity is duplicated under the new version. Versionable entities have a compound key `id`, `version_id`; foreign keys to versioned records are two columns, e.g. `product_id` and `product_version_id`.

**Context** - `core/Framework/Context.php`, instantiated once per request, carries shop configuration (e.g. currency, language chain, version) and changes DAL CRUD behavior; switching currency in the storefront changes the context currency ID.

**Inheritance** - parent-child inheritance lets variants inherit fields and whole associations (e.g. categories, images) from the parent product.

**Indexing** - reads vastly outnumber writes, so the DAL spends more effort on write via the entity indexer pattern: writing a product triggers the product indexer, which precomputes aggregations for fast reads.

## Essential identifiers

- `EntityRepository`, service id `product.repository`
- `Context` (`core/Framework/Context.php`)
- `_translation` table suffix, `translated` field
- `version_id`, `product_version_id`
- `EntityIndexer`, `ProductIndexer`

## Gotchas

- A completely new entity cannot be created in a non-live version: a live version must exist before a new version can be derived (no "draft first, then publish").
- The plain translatable field can be `null` when no value is stored for the current language; use `translated` to get the fallback value.

## Code check (6.7.15.1)
- confirmed `EntityRepository` — repository class with `search()`/`searchIds()`/`aggregate()`/`update()` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:37
- confirmed `EntityRepository::search()` — takes `Criteria` and `Context` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:66
- confirmed `product.repository` — service id injected via `service('product.repository')` — vendor/shopware/core/Content/DependencyInjection/flow.php:349
- confirmed `Context` — lives at `Framework/Context.php` — vendor/shopware/core/Framework/Context.php:18
- confirmed `Context::getLanguageIdChain()` — language fallback chain — vendor/shopware/core/Framework/Context.php:168
- confirmed `Context::getCurrencyId()` — context currency — vendor/shopware/core/Framework/Context.php:147
- confirmed `_translation` — translation definition entity name suffix — vendor/shopware/core/Framework/DataAbstractionLayer/AttributeTranslationDefinition.php:21
- confirmed `EntityDefinition::TRANSLATED_FIELD` — value `translated` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:35
- confirmed `_version_id` — reference version column naming — vendor/shopware/core/Framework/DataAbstractionLayer/Field/ReferenceVersionField.php:28
- confirmed `ProductIndexer` — extends `EntityIndexer` — vendor/shopware/core/Content/Product/DataAbstractionLayer/ProductIndexer.php:34
