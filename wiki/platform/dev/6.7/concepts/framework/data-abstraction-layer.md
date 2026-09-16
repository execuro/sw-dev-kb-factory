---
id: platform/dev/6.7/concepts/framework/data-abstraction-layer.md
title: Data Abstraction Layer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/data-abstraction-layer.html
sourceHash: fc959a20f1fe58e304b629c78876fd36dd569e7a
codeCheckedAgainst: "6.7.13.0"
keywords: ["dal", "data abstraction layer", "EntityRepository", "product.repository", "Context", "criteria", "translations", "_translation", "translated", "versioning", "version_id", "inheritance", "EntityIndexer", "ProductIndexer", "orm"]
summary: DAL concept - EntityRepository via DI, three-level translation fallback, entity versioning (version_id), Context, parent/child inheritance, indexers.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/concepts/framework/translations/plain-vs-translated-fields.md"]
---
## What it is

Shopware uses no ORM but a thin data abstraction layer (DAL) built for its needs; developers access the database through pre-defined interfaces. Concepts such as Criteria resemble Doctrine. The DAL provides CRUD via repositories, translations with fallback, versioning, context-dependent behavior, parent/child inheritance and write-time indexing.

## When to use

When a plugin needs to read or write entities, when reasoning about translated/inherited values, versioned records (`*_version_id` columns), or why data is precomputed by indexers.

## Key steps / config

**CRUD:** use an `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository` (methods include `search`, `create`, `update`, `upsert`, `delete`, `createVersion`, `merge`, each taking a `Context`). Obtain it from the [DI container](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md) by constructor injection:

```php
public function __construct(EntityRepository $productRepository)
{
    $this->productRepository = $productRepository;
}
```

With autowiring and matching type/argument name it is injected automatically; otherwise wire the service id `<entity>.repository` explicitly:

```php
$services->set(Swag\ExamplePlugin\Service\DalExampleService::class)
    ->args([service('product.repository')]);
```

**Translations:** reads resolve three language levels — current language, optional parent language, system language (final fallback; every entity has a translation there). The context carries this as its language id chain. Translations are stored in a table named like the entity table plus suffix `_translation`. Every translatable property is exposed twice: the plain field for the current language (may be `null`) and under `translated` with inheritance applied. Prefer `translated` in storefront/sales-channel contexts; use the plain field in Admin/CRUD flows. See [Plain vs translated entity fields](platform/dev/6.7/concepts/framework/translations/plain-vs-translated-fields.md).

**Versioning:** multiple versions of an entity can exist; all assigned data is duplicated into the new version (previews, publishing, campaigns). Versionable entities have the compound key `id`, `version_id`; foreign keys to versioned records use two columns, e.g. `product_id` + `product_version_id`.

**Context:** `Shopware\Core\Framework\Context` (`core/Framework/Context.php`) holds request-level configuration (e.g. currency, language chain) and changes CRUD behavior; switching the storefront currency changes the context currency ID.

**Inheritance:** parent/child inheritance lets variants inherit fields and whole associations (e.g. categories, images) from the parent product.

**Indexing:** data is read far more often than written, so work is shifted to write time via the Entity Indexer pattern (`EntityIndexer`); writing a product triggers `ProductIndexer`, which precomputes data for reads.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`
- `product.repository` (pattern `<entity>.repository`)
- `Shopware\Core\Framework\Context`
- `_translation` table suffix, `translated` property
- `version_id`, `product_version_id`
- `EntityIndexer`, `ProductIndexer`

## Gotchas

- A completely new entity cannot be created in a non-live version: a live version must exist before deriving a new version ("drafting" a new entity is not possible).
- The linked ER diagram in the docs depicts Shopware 6.6.5.0, not the installed version; export a fresh model from your database if exact tables matter.

## Code check (6.7.13.0)
- confirmed `EntityRepository` — DAL repository class — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:36
- confirmed `EntityRepository::createVersion()` — versioning API on the repository — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:161
- confirmed `product.repository` — repository service id is entity name plus `.repository` — vendor/shopware/core/Framework/DataAbstractionLayer/DefinitionInstanceRegistry.php:23
- confirmed `Context` — core/Framework/Context.php exists as a Struct — vendor/shopware/core/Framework/Context.php:17
- confirmed `Context::$languageIdChain` — translation fallback chain defaults to system language — vendor/shopware/core/Framework/Context.php:50
- confirmed `_translation` — translation table name suffix — vendor/shopware/core/Framework/DataAbstractionLayer/AttributeEntityCompiler.php:296
- confirmed `Entity::$translated` — translated values exposed on entities — vendor/shopware/core/Framework/DataAbstractionLayer/Entity.php:21
- confirmed `version_id` — VersionField storage name — vendor/shopware/core/Framework/DataAbstractionLayer/Field/VersionField.php:16
- confirmed `ProductIndexer` — extends EntityIndexer — vendor/shopware/core/Content/Product/DataAbstractionLayer/ProductIndexer.php:34
- confirmed `ProductDefinition::isInheritanceAware()` — product is inheritance-aware (variants) — vendor/shopware/core/Content/Product/ProductDefinition.php:98
