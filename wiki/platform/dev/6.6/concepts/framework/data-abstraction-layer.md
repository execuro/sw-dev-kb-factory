---
id: platform/dev/6.6/concepts/framework/data-abstraction-layer.md
title: Data Abstraction Layer
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/framework/data-abstraction-layer.html
sourceHash: 2447b4c082cdd284ddbe6bd248bbdca83d9d52ba
keywords: ["dal", "data abstraction layer", "entityrepository", "criteria", "product.repository", "context", "translation", "versioning", "inheritance", "entity indexer", "product indexer", "_translation", "version_id"]
summary: "Explains the DAL: EntityRepository CRUD, translation fallback levels, versioning, product/variant inheritance, and indexing."
lastBuilt: "2026-09-15"
---
## What it is

Shopware uses no ORM but a thin data abstraction layer (DAL) that lets developers access the database via pre-defined interfaces, with concepts like Criteria familiar from Doctrine or other ORMs.

## When to use

Relevant when reading/writing entity data from a plugin, understanding translation fallback, versioning entities, product/variant inheritance, or how indexing affects read performance.

## Key steps / config

An `EntityRepository` is the recommended way to interact with the DAL. Get it from the Dependency Injection Container (DIC) via constructor injection:

```php
// <plugin root>/src/Service/DalExampleService.php
public function __construct (EntityRepository $productRepository)
{
    $this->productRepository = $productRepository;
}
```

With correct service autowiring this is automatic; alternatively configure the `product.repository` service explicitly:

```html
// <plugin root>src/Resources/config/service.xml
<service id="Swag\ExamplePlugin\Service\DalExampleService">
    <argument type="service" id="product.repository"/>
</service>
```

Translation fallback (three levels checked on read/search): 1) Current language, 2) Parent language (optional, configurable), 3) System language (selected at installation, guaranteed fallback). Translations for a record are stored in a separate table named `<table>_translation`.

Versioning: lets an entity have multiple versions; entities that are versionable have a compound key `id`, `version_id`, and foreign keys pointing to a versioned record consist of two columns, e.g. `product_id` and `product_version_id`. A live version is always required before deriving a new version from it; you cannot create a brand-new entity directly in a non-default version.

Context: `core/Framework/Context.php` defines shop configuration and is instantiated once per request; it can change DAL CRUD behavior (e.g. currency toggling changes the context currency ID).

Inheritance: a parent-child system lets variants inherit records, properties, or associations from the parent product when not explicitly assigned.

Indexing: writes trigger the corresponding Entity Indexer (e.g. the Product Indexer runs when a product record is written), pre-selecting aggregations to optimize the more-frequent reads.

## Essential identifiers

- `EntityRepository` — DAL interface for CRUD
- `product.repository` — explicit service id for the product repository
- `core/Framework/Context.php` — request-scoped context class
- `_translation` — table suffix for entity translations
- `id`, `version_id`, `product_version_id` — versioning columns

## Gotchas

Draft-then-publish is not (yet) possible: you cannot create a new entity directly in a non-live version — a live version must exist first.
