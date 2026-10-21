---
id: platform/dev/6.7/guides/development/integrations-api/search-criteria.md
title: Search Criteria
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/integrations-api/search-criteria.html
sourceHash: d906673d1b68144404039286f3323c11d8c3c290
codeCheckedAgainst: "6.7.15.1"
keywords: ["search criteria", "associations", "includes", "apiAlias", "total-count-mode", "post-filter", "aggregations", "grouping", "naturalSorting", "RequestCriteriaBuilder", "_score", "pagination", "filter", "sort", "search api"]
summary: "JSON search criteria for API POST search endpoints: associations, includes, total-count-mode, pagination, filters, sorting, aggregations, grouping."
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md", "platform/dev/6.7/guides/development/troubleshooting/dal-reference/filters-reference.md", "platform/dev/6.7/guides/development/troubleshooting/dal-reference/aggregations-reference.md"]
---
## What it is

"Search criteria" is the JSON body that `POST` search endpoints of the Admin API and Store API accept. It takes the same arguments as a DAL `Criteria` (see [Reading data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md)) and is parsed by `RequestCriteriaBuilder`. Some endpoints accept extra, endpoint-specific parameters that are not covered here.

## When to use

- Querying entities over the API with filters, sorting, pagination, joins or facets.
- Reducing response payloads (`includes`) or computing statistics (`aggregations`) in the same request.

## Key steps / config

Typical skeleton:

```json
{
  "limit": 10,
  "page": 1,
  "total-count-mode": 1,
  "associations": { "manufacturer": {}, "options": { "associations": { "group": {} } } },
  "includes": { "product": ["id", "translated", "cover"], "media": ["url"] },
  "filter": [{ "type": "equals", "field": "active", "value": true }],
  "sort": [{ "field": "name", "order": "ASC", "naturalSorting": true }],
  "aggregations": [{ "name": "average-price", "type": "avg", "field": "price" }]
}
```

| Parameter | Usage |
|---|---|
| `associations` | Load related data (like a SQL join). Key = association property name; value = nested criteria (`limit`, `filter`, `sort`, ...) |
| `includes` | Restrict output fields per `apiAlias`, e.g. `"product": ["id", "name"]` |
| `ids` | Limit the search to a list of IDs |
| `total-count-mode` | `0`/`none` (default, no total), `1`/`exact` (exact total, costly), `2`/`next-pages` (only whether a next page exists, fits infinite scroll) |
| `page`, `limit` | Pagination; `page` is 1-indexed |
| `filter` | Filters results and aggregations; same filter types as the DAL ([Filters Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/filters-reference.md)); combine with `{"type": "multi", "operator": "and"/"or", "queries": [...]}` |
| `post-filter` | Like `filter`, but does not affect aggregations (facets) |
| `query` | Weighted queries: list of `{ "score": <n>, "query": <any filter> }`; matching scores sum to `_score` |
| `term` | Free-text search using the entity's `SearchRanking` field weighting |
| `sort` | List of `{ field, order, naturalSorting?, type? }`; `type: "count"` sorts by association count (`ORDER BY COUNT(field)`) |
| `aggregations` | DAL aggregations computed on the fly ([Aggregations Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/aggregations-reference.md)) |
| `grouping` | List of fields to group by, e.g. `["active"]` (one product per manufacturer, ...) |

The `_score` of `query`/`term` searches is returned per record in `extensions.search._score`.

## Essential identifiers

- Payload keys: `associations`, `includes`, `ids`, `total-count-mode`, `page`, `limit`, `filter`, `post-filter`, `query`, `term`, `sort`, `aggregations`, `grouping`
- `apiAlias` (entity name such as `product`, `product_manufacturer`, `order_line_item`, used as `includes` key)
- `Shopware\Core\Framework\DataAbstractionLayer\Search\RequestCriteriaBuilder`
- `Criteria::TOTAL_COUNT_MODE_NONE` / `TOTAL_COUNT_MODE_EXACT` / `TOTAL_COUNT_MODE_NEXT_PAGES` (0/1/2)
- `CountSorting` (sort `type: "count"`), `naturalSorting`

## Gotchas

- When filtering on nested values, e.g. `transactions.stateMachineState.technicalName` on orders, also load those relations in `associations`.
- Do not combine `term` with `query`.
- `includes` only filters the output. The full entity is still loaded in the backend.
- The docs explain total-count-mode costs via MySQL `SQL_CALC_FOUND_ROWS`. The installed code does not use it: the exact mode runs a separate total count, and `next-pages` fetches extra rows up to a next-pages limit.
- Out-of-range numeric `total-count-mode` values (not 0 to 2) and unknown strings fall back to `0` (none).
- In `query`, an entry without `score` defaults to a score of `1`.
- The code also accepts an `excludes` key (the response-shaping counterpart of `includes`) and a `fields` key (see partial data loading), which this page does not document.

## Version notes

- Sort `type: "count"` was introduced in Shopware 6.4.12.0.

## Code check (6.7.15.1)
- confirmed `RequestCriteriaBuilder::KNOWN_FIELDS` — lists all documented keys plus excludes and fields — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:40
- confirmed `RequestCriteriaBuilder::addTotalCountMode()` — numeric 0-2 or none/exact/next-pages, else none — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:114
- confirmed `Criteria::TOTAL_COUNT_MODE_NONE` — value 0 — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:43
- absent `SQL_CALC_FOUND_ROWS` — named in docs, not used anywhere in the installed code
- confirmed `CountSorting` — chosen when sort type is count — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:290
- confirmed `naturalSorting` — optional sort flag, default false — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:281
- confirmed `score` — query entry score, defaults to 1 — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:209
- confirmed `Criteria::SCORE_FIELD` — value _score — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:38
- confirmed `search` — score data added as search extension — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:308
- confirmed `excludes` — undocumented response-shaping key, must be an array — vendor/shopware/core/Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:178
