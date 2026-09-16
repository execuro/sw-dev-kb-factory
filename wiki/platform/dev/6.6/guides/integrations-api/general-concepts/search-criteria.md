---
id: platform/dev/6.6/guides/integrations-api/general-concepts/search-criteria.md
title: Search Criteria
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/integrations-api/general-concepts/search-criteria.html
sourceHash: dfa1a37f6db36c9b8f406d17eb03d24b860fcdd9
keywords: ["search criteria", "DAL criteria", "associations", "includes", "apiAlias", "ids", "total-count-mode", "filter", "post-filter", "query", "term", "sort", "aggregations", "grouping", "SearchRanking"]
summary: "Reference for the JSON search-criteria body accepted by POST endpoints: associations, includes, filter, sort, aggregations, grouping."
lastBuilt: "2026-09-15"
---
## What it is

Documents the **search criteria** JSON object accepted by API endpoints that use `POST` and take criteria as a JSON body. It takes the same arguments as a DAL criteria; some endpoints accept additional parameters not covered here.

## When to use

Use this when building or debugging a request against an endpoint that receives a criteria object, e.g. to filter, sort, paginate, or aggregate a search result.

## Key steps / config

A typical criteria object:

```json
{
  "limit": 10,
  "associations": { "manufacturer": {}, "propertyIds": {}, "cover": {} },
  "includes": { "product": ["id", "name", "cover"] }
}
```

Parameters:

- `associations` — loads additional (nested) data for an entity, similar to a SQL join; accepts nested criteria per association.
- `includes` — restricts the returned fields; every response carries an `apiAlias` field identifying the entity/type used as the includes key.
- `ids` — a plain list of ids for a simple lookup.
- `total-count-mode` — `0` (default, no total, fastest, avoids `SQL_CALC_FOUND_ROWS`), `1` (exact total, used for exact pagination), `2` (only whether a next page exists, good for infinite scroll).
- `page`/`limit` — pagination; `page` is 1-indexed.
- `filter` — filters results and aggregations, same filter types as the DAL; see the filters reference.
- `post-filter` — same as `filter` but does not affect aggregations (useful for facet displays).
- `query` — weighted search; each entry has a `score` and a `query` filter, results carry `extensions.search._score`. Do not combine with `term`.
- `term` — text search using the entity's `SearchRanking` weighting; results formatted like `query`.
- `sort` — array of `{ field, order }`, plus optional `naturalSorting: true` and `type: "count"` (`ORDER BY COUNT({field}) {order}`, introduced in Shopware 6.4.12.0).
- `aggregations` — computes metadata (e.g. `avg`) on the fly; aggregation types match the DAL aggregations reference.
- `grouping` — an array of field names to group the result by (e.g. one result per manufacturer).

## Essential identifiers

- `associations`, `includes`, `ids`, `total-count-mode`, `page`, `limit`, `filter`, `post-filter`, `query`, `term`, `sort`, `aggregations`, `grouping`
- `apiAlias` (response field), `_score` under `extensions.search`
- `SearchRanking` (entity-definition flag used by `term`)

## Gotchas

- Do not use `term` and `query` together.
- When filtering on nested/association fields (e.g. `transactions.stateMachineState.technicalName`), fetch that association in `associations` first.
- `total-count-mode: 1` is performance-intensive because it forces `SQL_CALC_FOUND_ROWS`.

## Version notes

The `count` sort `type` was introduced with Shopware 6.4.12.0 and is not available in prior versions.
