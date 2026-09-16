---
id: platform/dev/6.7/guides/development/integrations-api/search-criteria.md
title: Search Criteria
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/search-criteria.html
sourceHash: 008a9652b4e6191324e20a3f7978368860095347
codeCheckedAgainst: "6.7.13.0"
keywords: ["search criteria", "RequestCriteriaBuilder", "total-count-mode", "post-filter", "includes", "associations", "aggregations", "grouping", "naturalSorting", "apiAlias", "_score", "SearchRanking", "pagination", "api filter", "count sorting"]
summary: "JSON criteria body for POST search endpoints: associations, includes, ids, total-count-mode, filter, query, term, sort, aggregations, grouping."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md", "platform/dev/6.7/guides/development/troubleshooting/dal-reference/filters-reference.md", "platform/dev/6.7/guides/development/troubleshooting/dal-reference/aggregations-reference.md"]
---
## What it is

"Search criteria" is the JSON body that `POST` search endpoints accept. It takes the same arguments as a DAL `Criteria` (see [reading data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md)); on the server the payload is parsed into a `Criteria` object by `Shopware\Core\Framework\DataAbstractionLayer\Search\RequestCriteriaBuilder`. Individual endpoints may require extra parameters not covered here.

## When to use

When calling API search endpoints and you need to load associations, trim response fields, paginate, filter, score, sort, aggregate or group results in a single request.

## Key steps / config

Top-level parameters (all read by `RequestCriteriaBuilder`):

| Parameter | Usage |
|---|---|
| `associations` | Load related entities; key = association property name; value = nested criteria (own `limit`, `filter`, `sort`, ...) |
| `includes` | Restrict output fields per `apiAlias`, e.g. `"product": ["id", "name"]` |
| `ids` | Limit the search to a list of IDs |
| `total-count-mode` | `0` none (default), `1` exact total, `2` "is there a next page" |
| `page` / `limit` | Pagination; `page` is 1-indexed |
| `filter` | Filters result and aggregations (DAL filter types) |
| `post-filter` | Filters the result but not aggregations (facets) |
| `query` | Weighted queries: each entry has `score` + `query` (any filter type) |
| `term` | Text search using the entity's `SearchRanking` field flags |
| `sort` | List of `{ field, order, naturalSorting, type }`; `type: "count"` sorts by association count |
| `aggregations` | On-the-fly aggregations (DAL aggregation types) |
| `grouping` | List of fields to group records by |

Skeleton:

```json
{
  "page": 1, "limit": 10, "total-count-mode": 1,
  "associations": { "manufacturer": {}, "options": { "associations": { "group": {} } } },
  "includes": { "product": ["id", "name", "cover"], "media": ["url"] },
  "filter": [{ "type": "multi", "operator": "and", "queries": [{ "type": "equals", "field": "active", "value": true }] }],
  "query": [{ "score": 500, "query": { "type": "contains", "field": "name", "value": "..." } }],
  "sort": [{ "field": "name", "order": "ASC", "naturalSorting": true }, { "field": "products.id", "order": "DESC", "type": "count" }],
  "aggregations": [{ "name": "average-price", "type": "avg", "field": "price" }],
  "grouping": ["active"]
}
```

- `total-count-mode` also accepts the string aliases `none`, `exact`, `next-pages`; out-of-range numbers fall back to none.
- `query` scores are summed and returned per record in `extensions.search._score`; a `query` entry without `score` defaults to score `1`.
- Every response object carries `apiAlias` (entity name such as `product`, `product_manufacturer`, `order_line_item`); use that name as the key in `includes`, including for associations.
- Filter/aggregation type details: [Filters Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/filters-reference.md), [Aggregations Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/aggregations-reference.md).

## Essential identifiers

- `RequestCriteriaBuilder`, `Criteria`
- `Criteria::TOTAL_COUNT_MODE_NONE` / `TOTAL_COUNT_MODE_EXACT` / `TOTAL_COUNT_MODE_NEXT_PAGES`
- `associations`, `includes`, `excludes`, `fields`, `ids`, `total-count-mode`, `page`, `limit`, `filter`, `post-filter`, `query`, `term`, `sort`, `aggregations`, `grouping`
- `naturalSorting`, `type: "count"` (`CountSorting`), `extensions.search._score`, `apiAlias`

## Gotchas

- When filtering on nested values (e.g. `transactions.stateMachineState.technicalName`), also request that path in `associations`.
- Do not combine `term` and `query` in one request.
- Mode `1` (exact) runs an additional `COUNT(*)` query and is the expensive one; use `0` when no pagination is shown and `2` for infinite scrolling.
- The installed builder also knows `excludes` and `fields`, which the docs page does not describe.

## Version notes

- Sorting with `type: "count"` was introduced in Shopware 6.4.12.0.

## Code check (6.7.13.0)
- confirmed `RequestCriteriaBuilder::KNOWN_FIELDS` — lists ids, total-count-mode, limit, page, includes, excludes, filter, grouping, post-filter, query, term, sort, aggregations, associations, fields — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:40
- confirmed `Criteria::$totalCountMode` — defaults to TOTAL_COUNT_MODE_NONE (0) — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:88
- confirmed `Criteria::TOTAL_COUNT_MODE_NEXT_PAGES` — value 2 — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:50
- confirmed `TOTAL_COUNT_MODE_MAPPING` — string aliases none/exact/next-pages accepted — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:58
- corrected `Criteria::TOTAL_COUNT_MODE_EXACT` — docs: exact mode uses SQL_CALC_FOUND_ROWS; code wraps the query in a COUNT(*) subquery — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:203
- confirmed `score` — query entries read `score` (default 1) and optional `scoreField` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:209
- confirmed `naturalSorting` — sort entries read `order` (default asc), `naturalSorting`, `type` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:281
- confirmed `CountSorting` — sort `type: "count"` selects CountSorting — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:290
- confirmed `search` — score data attached as `search` extension — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:276
- confirmed `SearchRanking` — field flag class used by term search — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/SearchRanking.php:11
