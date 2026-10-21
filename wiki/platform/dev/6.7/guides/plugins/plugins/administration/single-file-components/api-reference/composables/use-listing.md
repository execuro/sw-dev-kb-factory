---
id: platform/dev/6.7/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-listing.md
title: useListing()
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/single-file-components/api-reference/composables/use-listing.html
sourceHash: a5adbdd1d2932a85f36d63ca2e780f251f495da9
codeCheckedAgainst: "6.7.15.1"
keywords: ["useListing", "shopware:composables", "listing mixin", "getList", "getMainListingParams", "onPageChange", "onSearch", "disableRouteParams", "addQueryScores", "pagination", "sorting", "admin list page", "composable"]
summary: "Admin composable useListing(): pagination, sorting, search term, filters and selection for list pages, synced to the route; replaces the listing mixin."
lastBuilt: 2026-10-21
---
## What it is

`useListing()` is the Administration composable (Composition API) that owns the state of a list page: pagination, sorting, search term, active filters and selection. Pagination, sorting and the term are kept in sync with the route query (they survive reload and browser back); selection and filter criteria are not. It replaces the `listing` mixin.

## When to use

Building or migrating an Administration list page (data grid with paging/sorting/search) to the Composition API instead of `Mixin.getByName('listing')`. Use `disableRouteParams: true` for a list inside a modal or tab that should not write its state to the URL.

## Key steps / config

1. Import from `shopware:composables` and pass your loader as `getList` (the only mandatory option). The composable calls it whenever listing state changes — it owns the state, you own the request.
2. Optionally pass `filters` (a callback returning `ListingFilter[]`) and initial values: `page`, `limit`, `total`, `sortBy`, `sortDirection`, `naturalSorting`, `term`, `selection`, `disableRouteParams`, `searchConfigEntity`, `entitySearchable`, `freshSearchTerm`, `storeKey`, `filterCriteria`. Installed defaults: `page` 1, `limit` 25, `sortDirection` `'ASC'`, `sortBy` `null`, `entitySearchable` true.
3. In the loader, read the state refs and write `total` back:

```ts
import { useListing } from 'shopware:composables';

const { page, limit, total, term, onPageChange, onSearch } = useListing({
    getList: () => loadProducts(),
});

async function loadProducts(): Promise<void> {
    const criteria = new Criteria(page.value, limit.value);
    if (term.value) { criteria.setTerm(term.value); }
    const result = await productRepository.search(criteria);
    total.value = result.total ?? 0;
}
```

4. Bind the returned handlers to the data grid: `onPageChange`, `onSearch`, `onSort`, `onSortColumn`, `onSwitchFilter`, `onRefresh`, `updateSelection`, `resetListing`, `updateCriteria`; use `addQueryScores(term, criteria)` for search ranking.

Returned state refs: `page`, `limit`, `total`, `sortBy`, `sortDirection`, `naturalSorting`, `term`, `selection`, `filterCriteria`, `disableRouteParams`, `searchConfigEntity`, `entitySearchable`, `freshSearchTerm`, `previousRouteName`, `storeKey`. Derived: `maxPage`, `selectionCount`, `selectionArray`, `currentSortBy`, `routeName`, `searchRankingFields`. Helpers: `getMainListingParams()` (current `page`/`limit`/`term`/sorting from the route query, or from state when `disableRouteParams` is set), `updateData`, `updateRoute`, `isValidTerm`, `parseBooleanQueryParams`.

## Essential identifiers

- `useListing` (default export of `src/app/composables/use-listing.ts`), `UseListingOptions`, `UseListingReturn`, `ListingFilter`
- `getList`, `filters`, `disableRouteParams`, `searchConfigEntity`, `storeKey`
- `getMainListingParams()`, `addQueryScores()`, `updateCriteria()`, `onSortColumn()`
- `listing` mixin (the Options API predecessor)

## Gotchas

- The first load runs in `onMounted()`, not `created()` as in the mixin, because `getList` can only close over bindings declared after the call returns. A page that relied on data existing before the first render must be checked.
- `onSwitchFilter` only toggles the filter's `active` flag and resets `page` to 1; it does not call `getList` itself.
- Changes to `selection` are written to the `shopwareApps` and `swBulkEdit` stores' `selectedIds`; leaving the route clears them unless the target is a `sw.bulk.edit.*` route.
- In 6.7.15.1 the file is marked `@private` and `@experimental stableVersion:v6.9.0`, so the signature may still change.

## Code check (6.7.15.1)
- confirmed `useListing` — default-exported function taking `UseListingOptions` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-listing.ts:111
- confirmed `UseListingOptions` — `getList` required, all other options optional — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-listing.ts:39
- confirmed `UseListingReturn` — refs, computeds and handlers as documented — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-listing.ts:59
- confirmed `limit` — defaults to 25, `page` to 1 — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-listing.ts:116
- confirmed `getMainListingParams()` — returns state when `disableRouteParams` is set, else route query — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-listing.ts:207
- confirmed `addQueryScores()` — builds search-ranking queries via `searchRankingService` — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-listing.ts:314
- confirmed `onMounted` — initial load runs on mount — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-listing.ts:413
- confirmed `@experimental` — marked experimental, stableVersion v6.9.0 — vendor/shopware/administration/Resources/app/administration/src/app/composables/use-listing.ts:4
- confirmed `listing` — mixin name registered for the Options API predecessor — vendor/shopware/administration/Resources/app/administration/src/app/mixin/listing.mixin.ts:22
- unverified `shopware:composables` — import alias not defined inside the administration `src` tree; build-level alias, out of scope
