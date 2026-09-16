---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/core/listing-service.md
title: Listing service
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/core/listing-service.html"
sourceHash: 633ef0c36aec859ae1e84db52209a35025fc371d
keywords: ["listing service", "SearchStruct", "GridRepository", "GridHelper", "CompanyFilterStruct", "b2b suite", "grid", "filter", "repository", "getMainTableAlias", "getFullTextSearchFields", "fetchList"]
summary: "B2B Suite listing pattern: SearchStruct carries filters/paging, GridRepository fetches lists, GridHelper builds grid state for the frontend."
lastBuilt: "2026-09-15"
---
## What it is
Describes the repeating "listing service" pattern the B2B Suite uses for semi-automated listing and filtering, since the suite ships without an ORM.

## Key steps / config
The `Shopware\B2B\Common\Repository\SearchStruct` carries filter/sort/pagination data from the HTTP request to the repository:

```php
class SearchStruct
{
    public array $filters = [];
    public int $limit;
    public int $offset;
    public string $orderBy;
    public string $orderDirection = 'ASC';
    public string $searchTerm;
}
```

A repository must implement `Shopware\B2B\Common\Controller\GridRepository` with three methods:

```php
class Repository implements GridRepository
{
    public function getMainTableAlias(): string;
    public function getFullTextSearchFields(): array;
    public function getAdditionalSearchResourceAndFields(): array;
}
```

The repository is also responsible for consuming a `SearchStruct` (or a more specific one, such as `CompanyFilterStruct`) to produce `fetchList(OwnershipContext $context, ...): array` and `fetchTotalCount(OwnershipContext $context, ...): int`. There is no additional service abstraction — callers access the repository directly.

`Shopware\B2B\Common\Controller\GridHelper` binds HTTP request data onto a `SearchStruct` via `extractSearchDataInStoreFront(Request $request, SearchStruct $struct): void` and builds the frontend grid state via `getGridState(Request $request, SearchStruct $struct, array $data, int $maxPage, int $currentPage): array`.

## Essential identifiers
- `Shopware\B2B\Common\Repository\SearchStruct`
- `Shopware\B2B\Common\Controller\GridRepository`
- `Shopware\B2B\Common\Controller\GridHelper`
- `CompanyFilterStruct`
