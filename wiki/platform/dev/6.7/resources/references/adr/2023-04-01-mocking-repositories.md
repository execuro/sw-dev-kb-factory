---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2023-04-01-mocking-repositories.md
sourceHash: 2d16fdd9b25d35c9730c69fe8a89e5672dab67a7
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-04-01-mocking-repositories.html
title: Mocking repositories
version: "6.7"
versions:
  - "6.7"
keywords: ["StaticEntityRepository", "mock repository", "repository stub", "unit test", "EntityRepository", "EntitySearchResult", "IdSearchResult", "AggregationResultCollection", "EntityCollection", "search", "searchIds", "phpunit", "fake search result"]
summary: "ADR: StaticEntityRepository stub fakes EntityRepository search/searchIds results in unit tests without building EntitySearchResult by hand."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (dated 2023-01-04, area core) about unit-testing classes that depend on an `EntityRepository`. Mocking a repository's `search` or `searchIds` call used to require building an empty `EntitySearchResult` or `IdSearchResult` by hand, which means a lot of boilerplate when faking database results. The decision adds a stub repository, `StaticEntityRepository`, that is constructed with the results it should return.

## When to use

When writing a PHPUnit unit test for a service that receives an `EntityRepository` and calls `search()` or `searchIds()`, and you want to feed it fixed results instead of configuring a `createMock(EntityRepository::class)` with `->method('search')->willReturn($result)`.

## Key steps / config

1. Instantiate the stub with a list of results, one per expected call, and inject it in place of the real repository:

```php
use Shopware\Core\Test\Stub\DataAbstractionLayer\StaticEntityRepository;

$repository = new StaticEntityRepository([
    new UnitCollection([new UnitEntity(), new UnitEntity()]),
]);
$class = new SomeCoreClass($repository);
$class->foo();
```

2. Each `search()` call shifts the next entry off the list. Accepted entries per the installed code:
   - an `EntitySearchResult` — returned as-is;
   - an `EntityCollection` (or a plain array of entities, wrapped into one) — wrapped into an `EntitySearchResult`;
   - an `AggregationResultCollection` — returned as an `EntitySearchResult` with an empty collection and these aggregations;
   - a callable receiving `Criteria`, `Context` (and the repository) that returns one of the above.
3. Each `searchIds()` call also shifts the next entry: an `IdSearchResult` is returned as-is; a flat array of ids such as `[Uuid::randomHex(), Uuid::randomHex()]` is turned into an `IdSearchResult`.
4. Anything else makes the stub throw `Invalid mock repository configuration`.

## Essential identifiers

- `Shopware\Core\Test\Stub\DataAbstractionLayer\StaticEntityRepository`
- `StaticEntityRepository::search()`, `StaticEntityRepository::searchIds()`
- `EntitySearchResult`, `IdSearchResult`, `EntityCollection`, `AggregationResultCollection`

## Gotchas

- The ADR names the class `\Shopware\Tests\Unit\Common\Stubs\DataAbstractionLayer\StaticEntityRepository`; in 6.7 it lives in `Shopware\Core\Test\Stub\DataAbstractionLayer`.
- Results are consumed in order; queue one entry per call the code under test makes.
- Besides what the ADR describes, the installed stub records `create`/`update`/`upsert`/`delete` payloads, accepts an optional `EntityDefinition` as second constructor argument, and offers `addSearch()` and a static `of()` factory.

## Code check (6.7.15.1)
- corrected `StaticEntityRepository` — docs: namespace Shopware\Tests\Unit\Common\Stubs; code: Shopware\Core\Test\Stub — vendor/shopware/core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:33
- confirmed `StaticEntityRepository::__construct()` — takes `$searches` plus optional definition — vendor/shopware/core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:68
- confirmed `StaticEntityRepository::search()` — shifts next entry; handles result, collection, aggregations — vendor/shopware/core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:110
- confirmed `AggregationResultCollection` — wrapped into an EntitySearchResult — vendor/shopware/core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:133
- confirmed `StaticEntityRepository::searchIds()` — IdSearchResult or flat id array — vendor/shopware/core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:143
- confirmed `StaticEntityRepository::addSearch()` — appends further results — vendor/shopware/core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:230
- confirmed `StaticEntityRepository::of()` — static factory — vendor/shopware/core/Test/Stub/DataAbstractionLayer/StaticEntityRepository.php:101
