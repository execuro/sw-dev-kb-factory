---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/listing-service.md
title: Listing service
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/listing-service.html
sourceHash: 633ef0c36aec859ae1e84db52209a35025fc371d
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "listing service", "grid", "pagination", "filtering", "SearchStruct", "CompanyFilterStruct", "GridRepository", "GridHelper", "fetchList", "fetchTotalCount", "getGridState", "extractSearchDataInStoreFront"]
summary: "B2B Suite listing pattern: SearchStruct for filter/sort/paging, GridRepository repositories with fetchList/fetchTotalCount, GridHelper grid state."
lastBuilt: 2026-09-15
---
## What it is

The listing service is a recurring B2B Suite pattern for semi-automated listing, filtering, sorting and pagination. The B2B Suite ships without an ORM, so it uses shared implementations: a `SearchStruct` data container, a repository implementing `GridRepository`, and a `GridHelper` that binds request data and builds grid state.

## When to use

When building a B2B Suite module that lists records in the storefront with filters, search terms, sorting and pagination.

## Key steps / config

1. **Search struct.** `Shopware\B2B\Common\Repository\SearchStruct` moves requested filter, sorting and pagination data from the HTTP request to the repository/query. Public properties:

```php
class SearchStruct
{
    public array $filters = [];          // Filter[]
    public int $limit;
    public int $offset;
    public string $orderBy;
    public string $orderDirection = 'ASC';
    public string $searchTerm;
}
```

A specialised variant is `CompanyFilterStruct` (used by the Company module).

2. **Repository.** Implement `Shopware\B2B\Common\Controller\GridRepository`, which requires:
   - `getMainTableAlias(): string`
   - `getFullTextSearchFields(): array` (string[])
   - `getAdditionalSearchResourceAndFields(): array`

   Additionally handle the search struct and provide a list and a total count of accessible records, e.g. `fetchList(OwnershipContext $context, ContactSearchStruct $searchStruct): array` and `fetchTotalCount(OwnershipContext $context, ContactSearchStruct $contactSearchStruct): int`. There is no service layer on top; consumers call the repository directly because this is storage-engine specific.

3. **Grid helper.** `Shopware\B2B\Common\Controller\GridHelper`:
   - `extractSearchDataInStoreFront(Request $request, SearchStruct $struct): void` binds request data to the struct.
   - `getGridState(Request $request, SearchStruct $struct, array $data, int $maxPage, int $currentPage): array` returns the canonical grid state array consumed by the frontend.

   `Request` here is `Shopware\B2B\Common\MvcExtension\Request`.

## Essential identifiers

- `Shopware\B2B\Common\Repository\SearchStruct`
- `Shopware\B2B\Common\Controller\GridRepository`
- `Shopware\B2B\Common\Controller\GridHelper`
- `Shopware\B2B\Common\MvcExtension\Request`
- `Shopware\B2B\Common\Filter\Filter`
- `Shopware\B2B\Company\Framework\CompanyFilterStruct\ContactSearchStruct`
- `Shopware\B2B\StoreFrontAuthentication\Framework\OwnershipContext`

## Code check (6.7.13.0)
- unverified `Shopware\B2B\Common\Repository\SearchStruct` — B2B Suite package not installed; not in vendor/shopware core/storefront/administration
- unverified `Shopware\B2B\Common\Controller\GridRepository` — B2B Suite package not installed
- unverified `GridRepository::getMainTableAlias()` — B2B Suite package not installed; required members taken from docs only
- unverified `Shopware\B2B\Common\Controller\GridHelper` — B2B Suite package not installed
- unverified `GridHelper::getGridState()` — B2B Suite package not installed
