---
id: platform/dev/6.7/resources/references/adr/2023-04-01-mocking-repositories.md
title: Mocking repositories
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-04-01-mocking-repositories.html
sourceHash: 2d16fdd9b25d35c9730c69fe8a89e5672dab67a7
codeCheckedAgainst: "6.7.13.0"
keywords: ["StaticEntityRepository", "Shopware\\Core\\Test\\Stub\\DataAbstractionLayer\\StaticEntityRepository", "EntitySearchResult", "IdSearchResult", "AggregationResultCollection", "EntityCollection", "EntityRepository", "mock repository", "unit test", "fake search result", "phpunit", "adr"]
summary: "ADR: StaticEntityRepository test stub fakes EntityRepository search/searchIds results from a queued list of collections, search results, aggregations or ids."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (ADR, 2023) introducing a test stub, `StaticEntityRepository`, that replaces PHPUnit mocks of `EntityRepository`. Instead of building empty `EntitySearchResult`/`IdSearchResult` objects and wiring `createMock(EntityRepository::class)` expectations, you pass the results the repository should return.

## When to use

- Unit testing a class that depends on an `EntityRepository` and calls `search()` or `searchIds()`.
- You want to assert on write payloads (`create`, `update`, `upsert`, `delete`) without a database.

## Key steps / config

1. Use the installed class `Shopware\Core\Test\Stub\DataAbstractionLayer\StaticEntityRepository` (it extends `EntityRepository`, so it can be injected wherever a repository is typed).
2. Pass an ordered list of results to the constructor. Every `search()` or `searchIds()` call consumes the next entry (`array_shift`):

```php
$repository = new StaticEntityRepository([
    new UnitCollection([new UnitEntity(), new UnitEntity()]),        // search()
    new AggregationResultCollection([new AvgResult('some-aggregation', 12.0)]),
    [Uuid::randomHex(), Uuid::randomHex()],                           // searchIds()
    new IdSearchResult(0, [], new Criteria(), Context::createDefaultContext()),
]);
$class = new SomeCoreClass($repository);
```

3. Accepted entry types, as the installed `search()`/`searchIds()` handle them:
   - an `EntityCollection` (or a plain array of entities), wrapped into a search result with total = count;
   - an `AggregationResultCollection`, wrapped into a search result with an empty collection;
   - a prebuilt search result object, returned as is;
   - for `searchIds()`: an `IdSearchResult`, or a flat array of id strings;
   - a callable receiving `(Criteria, Context)` that returns any of the above, useful for asserting on the criteria.
   Anything else throws `RuntimeException('Invalid mock repository configuration')`.
4. Optional second constructor argument: an `EntityDefinition`; it sets the entity name (otherwise `mock`) and primary keys for write results. `getDefinition()` throws when none is set.
5. Write calls are recorded in the public `$creates`, `$updates`, `$upserts`, `$deletes` arrays; `getPayloads(StaticEntityRepository::CREATE)` (or `UPDATE`/`UPSERT`/`DELETE`) returns them flattened.

## Essential identifiers

- `Shopware\Core\Test\Stub\DataAbstractionLayer\StaticEntityRepository`
- `StaticEntityRepository::getPayloads()`, `StaticEntityRepository::CREATE`
- `IdSearchResult`, `AggregationResultCollection`, `EntityCollection`, `EntityRepository`

## Gotchas

- The ADR names the stub `\Shopware\Tests\Unit\Common\Stubs\DataAbstractionLayer\StaticEntityRepository`; the installed code ships it in core as `Shopware\Core\Test\Stub\DataAbstractionLayer\StaticEntityRepository`.
- `EntitySearchResult` is marked `@deprecated tag:v6.8.0`: it will stop extending `EntityCollection`, and its constructor drops the `$entity` parameter and reorders the rest. Tests that construct it directly (as the ADR's "before" example does) will need changes; queuing an `EntityCollection` avoids that.
- Entries are consumed in call order across both `search()` and `searchIds()`, so the list order must match the calls in the code under test.

## Code check (6.7.13.0)
- corrected `StaticEntityRepository` — docs: namespace Shopware\Tests\Unit\Common\Stubs; installed in Shopware\Core\Test\Stub\DataAbstractionLayer — vendor/shopware/core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:31
- confirmed `StaticEntityRepository::__construct()` — takes array searches plus optional EntityDefinition — vendor/shopware/core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:64
- confirmed `StaticEntityRepository::search()` — shifts next entry, wraps collections/aggregations — vendor/shopware/core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:87
- confirmed `StaticEntityRepository::searchIds()` — accepts IdSearchResult or flat id array — vendor/shopware/core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:120
- confirmed `StaticEntityRepository::getPayloads()` — returns recorded write payloads per operation — vendor/shopware/core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:215
- deprecated `EntitySearchResult` — class hierarchy and constructor change in v6.8.0 — vendor/shopware/core/Framework/DataAbstractionLayer/Search/EntitySearchResult.php:25
- confirmed `IdSearchResult` — constructor used by stub with count, ids, criteria, context — vendor/shopware/core/Framework/DataAbstractionLayer/Search/IdSearchResult.php:17
- confirmed `AggregationResultCollection` — accepted queue entry — vendor/shopware/core/Framework/DataAbstractionLayer/Search/AggregationResult/AggregationResultCollection.php:13
