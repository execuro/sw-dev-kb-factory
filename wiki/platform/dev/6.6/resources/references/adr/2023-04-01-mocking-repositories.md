---
id: platform/dev/6.6/resources/references/adr/2023-04-01-mocking-repositories.md
title: Mocking repositories
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-04-01-mocking-repositories.html
sourceHash: 2d16fdd9b25d35c9730c69fe8a89e5672dab67a7
keywords: ["StaticEntityRepository", "EntityRepository", "EntitySearchResult", "IdSearchResult", "AggregationResultCollection", "EntityCollection", "mocking", "unit testing", "PHPUnit", "search", "searchIds", "core testing"]
summary: "ADR: introduces StaticEntityRepository to fake EntityRepository search/searchIds results without boilerplate mocks."
lastBuilt: 2026-09-15
---
## What it is
An architecture decision record introducing `StaticEntityRepository`, a stub that simplifies faking `EntityRepository::search`/`searchIds` results in tests.

## When to use
Relevant when writing unit tests for a class that depends on an `EntityRepository` and needs to fake `search()` or `searchIds()` return values.

## Key steps / config
- Previously, faking a search result required manually constructing `EntitySearchResult` and mocking `EntityRepository`:
```php
$result = new EntitySearchResult('my-entity', 1, new EntityCollection([]), null, new Criteria(), Context::createDefaultContext());
$entityRepository = $this->createMock(EntityRepository::class);
$entityRepository->expects(static::once())->method('search')->willReturn($result);
```
- Solution: `\Shopware\Tests\Unit\Common\Stubs\DataAbstractionLayer\StaticEntityRepository`, constructed with an array of `EntitySearchResults`, `EntityCollections`, or `AggregationResultCollection` values that are returned in order for each `search`/`searchIds` call:
```php
$repository = new StaticEntityRepository([
    new UnitCollection([new UnitEntity(), new UnitEntity()])
]);
$class = new SomeCoreClass($repository);
```
- Also supports passing `AggregationResultCollection`, a full `EntitySearchResult`, a plain array of ids (for `searchIds`), or `IdSearchResult` entries in the constructor array, one per expected call.

## Essential identifiers
- `StaticEntityRepository`
- `EntityRepository`
- `EntitySearchResult`
- `IdSearchResult`
- `AggregationResultCollection`
