---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/listing-service.md
title: Listing service
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/listing-service.html
sourceHash: 633ef0c36aec859ae1e84db52209a35025fc371d
codeCheckedAgainst: "6.7.15.1"
keywords: ["SearchStruct", "GridRepository", "GridHelper", "CompanyFilterStruct", "ContactSearchStruct", "OwnershipContext", "fetchList", "fetchTotalCount", "getGridState", "extractSearchDataInStoreFront", "b2b suite", "listing", "filtering", "pagination", "grid"]
summary: "B2B Suite listing pattern: SearchStruct carries filter/sort/paging data, repositories implement GridRepository, GridHelper builds grid state."
lastBuilt: 2026-10-21
---
## What it is

A repeating pattern in the B2B Suite for semi-automated listing and filtering. The B2B Suite ships without an ORM, so it provides common implementations to avoid duplication: a `SearchStruct` data container, repositories implementing `GridRepository`, and a `GridHelper` that binds request data and builds the grid state for the frontend. The source page links a downloadable `B2bAcl` example plugin.

## When to use

When building a B2B Suite module that lists records with filtering, sorting, full-text search and pagination in the storefront.

## Key steps / config

1. **Search struct** — `Shopware\B2B\Common\Repository\SearchStruct` moves requested filter, sorting and pagination data from the HTTP request to the repository/query. Public properties:

```php
class SearchStruct
{
    /** @var Filter[] */
    public array $filters = [];
    public int $limit;
    public int $offset;
    public string $orderBy;
    public string $orderDirection = 'ASC';
    public string $searchTerm;
}
```

   A more specialised struct is `CompanyFilterStruct` (see the Company storefront module).

2. **Repository** — implement `Shopware\B2B\Common\Controller\GridRepository`, which requires:
   - `getMainTableAlias(): string`
   - `getFullTextSearchFields(): array` (returns `string[]`)
   - `getAdditionalSearchResourceAndFields(): array`

   It must also handle the `SearchStruct` data and provide a list of items plus a total count of all accessible records, e.g. `fetchList(OwnershipContext $context, ContactSearchStruct $searchStruct): array` and `fetchTotalCount(OwnershipContext $context, ContactSearchStruct $contactSearchStruct): int` (`Shopware\B2B\StoreFrontAuthentication\Framework\OwnershipContext`, `Shopware\B2B\Company\Framework\CompanyFilterStruct\ContactSearchStruct`).

3. **Grid helper** — `Shopware\B2B\Common\Controller\GridHelper`:
   - `extractSearchDataInStoreFront(Request $request, SearchStruct $struct): void` binds HTTP request data to the struct.
   - `getGridState(Request $request, SearchStruct $struct, array $data, int $maxPage, int $currentPage): array` returns the canonical grid state array consumed by the frontend.

   `Request` here is `Shopware\B2B\Common\MvcExtension\Request`.

## Essential identifiers

- `Shopware\B2B\Common\Repository\SearchStruct`
- `Shopware\B2B\Common\Controller\GridRepository`
- `Shopware\B2B\Common\Controller\GridHelper`
- `Shopware\B2B\Common\MvcExtension\Request`
- `CompanyFilterStruct`, `ContactSearchStruct`, `OwnershipContext`

## Gotchas

- Listing is storage-engine specific, so there is no service abstraction over it: every consumer accesses the repository directly.

## Code check (6.7.15.1)
- unverified `GridRepository` — B2B Suite plugin interface (`Shopware\B2B`), not in the installed core/storefront/administration code
- unverified `SearchStruct` — B2B Suite plugin class, out of scope of the installed code
- unverified `GridHelper` — B2B Suite plugin class, out of scope of the installed code
- unverified `OwnershipContext` — B2B Suite plugin class, out of scope of the installed code
- unverified `CompanyFilterStruct` — B2B Suite plugin class, out of scope of the installed code
