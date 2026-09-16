# `dev-65` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-65` · `dev` · `Admin API` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0942-62-71` |
| Core version | `6.7.13.0` |

**Query:** What can I put in the JSON body of `POST /api/search/{entity}` for filtering, associations, sorting, aggregations and getting an exact total count?

**Expected answer — every fact an answer must contain:**

1. For a POST the whole criteria is read from the JSON body, and the accepted top-level keys are exactly `ids`, `total-count-mode`, `limit`, `page`, `includes`, `excludes`, `filter`, `grouping`, `post-filter`, `query`, `term`, `sort`, `aggregations`, `associations`, `fields`. `filter` and `post-filter` take the DAL filter objects (`equals`, `equalsAny`, `equalsAll`, `contains`, `prefix`, `suffix`, `range`, `until`, `since`, `multi`, `and`, `or`, `not`, `nand`, `nor`) through the same parser, but `post-filter` restricts only the result rows — the aggregation query clones the criteria and calls `resetPostFilters()`, so post-filters never narrow aggregation counts while regular filters do. `sort` is either a list of `{field, order, naturalSorting, type}` objects (`type: "count"` yields a CountSorting) or a comma-separated string with `-` for descending, and `aggregations` is a list of objects each with a unique `name`, a `type` (`avg`, `max`, `min`, `stats`, `sum`, `count`, `range`, `entity`, `filter`, `histogram`, `terms`) and a `field` unless the type is `filter`; results come back under the top-level `aggregations` key by name. `[code: Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:40, :86, :284; Framework/DataAbstractionLayer/Search/Parser/AggregationParser.php:225; Framework/DataAbstractionLayer/Dbal/EntityAggregator.php:143]`
2. `associations` is an **object keyed by the association's property name** whose value is a full nested criteria parsed recursively against the referenced definition (a bare list of names silently adds nothing; the minimal form is `{"manufacturer": {}}`), and a property that is not an AssociationField throws `associationNotFound`. A nested `filter`, `sort` and `limit` reach the generated SQL only for **to-many** associations; on a **to-one** (ManyToOne/OneToOne) association they are silently ignored — the to-one path reads only the nested `associations` and never `getFilters()`/`getSorting()`/`getLimit()`. In 6.7 the one-to-many limit+sort path uses `ROW_NUMBER() OVER (PARTITION BY … ORDER BY …)`, which only landed in 6.7.13.0; on 6.7.12.0 and earlier the limited+sorted one-to-many association could come back in the wrong order, and the many-to-many limited path still counts in mapping-table order rather than in the requested sorting. `[code: Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:229; Framework/DataAbstractionLayer/Dbal/EntityReader.php:559, :1109, :1331]`
3. `total-count-mode` accepts both the strings `none` / `exact` / `next-pages` and the integers `0` / `1` / `2`; the default is `none` (0), so without it the reported total is just the number of rows on the current page. Only `exact` (1) gives a trustworthy total: it resets order and limit and runs a second `COUNT(*)` over the subquery (not `SQL_CALC_FOUND_ROWS`). `next-pages` (2) fetches `limit * 6 + 1` rows and slices back, so its total is capped at roughly six pages ahead. Unknown strings and out-of-range integers fall back to `none` silently, with no error. The total lands in the top-level `total` for `application/json` and in `meta.total` (with `meta.totalCountMode`) for `application/vnd.api+json`. `[code: Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:58, :120; Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:191, :203]`

**Official reference URL:** https://developer.shopware.com/docs/guides/development/integrations-api/search-criteria.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `POST /api/search/{entity}` is generated for every DAL entity and dispatched to `ApiController::search`; `search-ids` and `aggregate` are siblings on the same parser | `Framework/Api/Route/ApiRouteLoader.php:109` | `$route = new Route('/api/search/' . $resourceName . '{path}');` |
| The accepted top-level keys are `KNOWN_FIELDS`: ids, total-count-mode, limit, page, includes, excludes, filter, grouping, post-filter, query, term, sort, aggregations, associations, fields | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:40` | `final public const KNOWN_FIELDS = [ 'ids', 'total-count-mode', 'limit', … 'fields', ];` |
| For POST the whole criteria is read from the JSON body; only GET reads query parameters | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:86` | `$criteria = $this->fromArray($request->request->all(), $criteria, $definition, $context);` |
| Filter types: equals, nand, nor, not, and, or, multi, contains, prefix, suffix, range, until, since, equalsAll, equalsAny; `filter` and `post-filter` use the same parser | `Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:55` | `case 'equals': … case 'multi': … case 'equalsAny':` |
| Aggregations skip post-filters: the aggregator clones the criteria and calls `resetPostFilters()` before building the query, while the searcher merges filters and post-filters into the WHERE | `Framework/DataAbstractionLayer/Dbal/EntityAggregator.php:143`, `EntitySearcher.php:71` | `$clone = clone $criteria; … $clone->resetPostFilters();` |
| The product-listing `reduce-aggregations` switch exists only because post-filters do not reach aggregations | `Content/Product/SalesChannel/Listing/Processor/AggregationListingProcessor.php:103` | `if (RequestParamHelper::get($request, 'reduce-aggregations') === null) {` |
| Aggregation types: avg, max, min, stats, sum, count, range, entity, filter, histogram, terms; each needs a unique `name` and a `field` unless type is `filter` | `Framework/DataAbstractionLayer/Search/Parser/AggregationParser.php:225` | `switch ($type) { case 'avg': return new AvgAggregation($name, $field);` |
| Aggregation names must not contain `?` or `:`; a missing `field` is a validation error | `Framework/DataAbstractionLayer/Search/Parser/AggregationParser.php:202` | `if (str_contains($name, '?') \|\| str_contains($name, ':')) {` |
| `range` needs `ranges`, `entity` needs `definition`, `filter` needs a `filter` list plus a nested `aggregation`, `histogram` needs `interval` | `Framework/DataAbstractionLayer/Search/Parser/AggregationParser.php:239` | `if (!isset($aggregation['ranges'])) { … 'The aggregation should contain "ranges".'` |
| `sort` takes objects `{field, order, type, naturalSorting}` or a comma-separated string with `-` prefix; `type: 'count'` yields CountSorting | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:284` | `$class = strcasecmp((string) $type, 'count') === 0 ? CountSorting::class : FieldSorting::class;` |
| A sort entry without a string `field` throws invalidSortQuery at `/sort/<index>` | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:276` | `throw DataAbstractionLayerException::invalidSortQuery(…, '/sort/' . $i);` |
| `associations` is an object keyed by property name; each value is parsed recursively as a full criteria (maxLimit null) against the referenced definition | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:229`, `:243` | `$nested = $criteria->getAssociation($propertyName); $this->parse($association, $nested, $ref, $context, null);` |
| A non-association property throws associationNotFound; a translations association has its limit forced to null | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:236` | `if (!$field instanceof AssociationField) { throw FrameworkException::associationNotFound(…` |
| **(deep)** A nested filter on a one-to-many association reaches the SQL: the nested Criteria is handed to `_read()` → `fetch()` → `CriteriaQueryBuilder::build()`, which merges filters and post-filters into an `andWhere()` | `Framework/DataAbstractionLayer/Dbal/EntityReader.php:559-581`, `CriteriaQueryBuilder.php:68-100` | `$fieldCriteria = $criteria->getAssociation($association->getPropertyName()); … if ($fieldCriteria->getLimit() === null) { $this->loadOneToManyWithoutPagination(` |
| **(deep)** Many-to-many: `isAssociationRestricted()` returns true when the nested criteria carries offset/limit/sorting/filters, routing to `loadManyToManyWithCriteria()`, which builds through `criteriaQueryBuilder->build()` | `Framework/DataAbstractionLayer/Dbal/EntityReader.php:453-478, 1286-1304` | `if ($this->isAssociationRestricted($criteria, $association->getPropertyName())) {` |
| **(deep)** A nested limit on a one-to-many routes to `fetchPaginatedOneToManyMapping()`, which ranks rows per parent with `ROW_NUMBER() OVER (PARTITION BY <fk> ORDER BY <criteria sortings>, <pk>)` and restricts to offset+1..offset+limit | `Framework/DataAbstractionLayer/Dbal/EntityReader.php:1109-1190` | `"ROW_NUMBER() OVER (PARTITION BY {$sqlAccessor} ORDER BY {$windowOrderBy}) as id_count"` |
| **(deep)** That window-function rewrite exists in v6.7.13.0 but not in v6.7.0.0/10.0/11.0/12.0 or v6.6.10.6, which still use the `@n:=IF(@c=…)` session-variable counter (commits #17644, #17703) | git refs compared against `EntityReader.php:1146-1153` | `v6.7.12.0: grep -c ROW_NUMBER -> 0` |
| **(deep)** The many-to-many limited path was not rewritten: `buildManyToManyLimitQuery()` counts in mapping-table order and the nested sorting is reset before the outer `GROUP_CONCAT(... ORDER BY …)` | `Framework/DataAbstractionLayer/Dbal/EntityReader.php:986-1026, 1235-1260` | `// order by is handled in group_concat … $fieldCriteria->resetSorting();` |
| **(deep)** `includes` is keyed by the struct's `apiAlias`: `filterDecodedFields()` takes `$struct->getApiAlias()` and `propertyAllowed()` looks up `$includes[$alias]`; `Entity::getApiAlias()` returns the entity name (`product`, `product_manufacturer`) | `Framework/Api/Serializer/JsonEntityEncoder.php:104-125, 197-207`; `Framework/DataAbstractionLayer/Entity.php:217-237` | `$alias = $struct->getApiAlias(); … if (isset($includes[$alias])) { return \in_array($property, $includes[$alias], true); }` |
| `total-count-mode` accepts both `none`/`exact`/`next-pages` and `0`/`1`/`2`; unknown values silently fall back to NONE | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:58`, `:120` | `private const TOTAL_COUNT_MODE_MAPPING = ['none' => …, 'exact' => …, 'next-pages' => …];` |
| NONE=0, EXACT=1, NEXT_PAGES=2, Criteria default NONE | `Framework/DataAbstractionLayer/Search/Criteria.php:40` | `protected int $totalCountMode = self::TOTAL_COUNT_MODE_NONE;` |
| Exact total runs a second `COUNT(*)` over the unsorted, unlimited subquery; other modes return `count($data)` | `Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:203` | `$total = new QueryBuilder($this->connection); $total->select('COUNT(*)')` |
| next-pages fetches `limit*6+1` rows, so its total is capped ~six pages ahead | `Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:191` | `$query->setMaxResults((int) $criteria->getLimit() * 6 + 1);` |
| `application/json` returns top-level `total` and `aggregations`; `application/vnd.api+json` returns `meta.total` and `meta.totalCountMode` | `Framework/Api/Response/Type/Api/JsonType.php:78`, `JsonApiType.php:86` | `$response = ['total' => $searchResult->getTotal(), 'data' => $decoded];` |
| `ids` is mutually exclusive with paging — limit, page and total-count-mode are skipped and limit set to null | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:135` | `$criteria->setLimit(null);` |
| `limit` must be numeric and > 0; above the configured max yields QueryLimitExceededException | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:427` | `if ($maxLimit > 0 && $limit > $maxLimit) {` |
| The Admin API uses the `api.request_criteria_builder` service wired with `%shopware.api.max_limit%` | `Framework/DependencyInjection/data-abstraction-layer.php:260`, `api.xml:43` | `param('shopware.api.max_limit'),` |
| `query` is a list of score queries (`query`, optional `score` default 1, `scoreField`); `term` is a plain text search | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:202` | `$criteria->addQuery(new ScoreQuery($parsedQuery, $score, $scoreField));` |
| `includes`/`excludes` must be arrays and are stripped at encoding level; `fields` controls what the DAL loads | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:168` | `throw DataAbstractionLayerException::expectedArrayWithType('includes', …` |
| Every criteria passes ApiCriteriaValidator — non-ApiAware fields raise ApiProtectionException, Runtime fields RuntimeFieldInCriteriaException | `Framework/DataAbstractionLayer/Search/ApiCriteriaValidator.php:45` | `if ($flag === null) { throw new ApiProtectionException($accessor); }` |
| Criteria errors are collected in a SearchRequestException and thrown together with JSON pointers | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:260` | `$searchException->tryToThrow();` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Unknown keys in the search body are rejected | absent | `parse()` reads only the keys it knows via isset(); KNOWN_FIELDS is not enforced as a whitelist — `RequestCriteriaBuilder.php:131` |
| `associations` may be a list of association names | absent | The loop skips any value that is not an array, so `["manufacturer"]` adds nothing; the minimal form is `{"manufacturer": {}}` — `RequestCriteriaBuilder.php:229` |
| An unrecognised `total-count-mode` raises an error | absent | Unknown strings and out-of-range integers fall back to NONE silently — `RequestCriteriaBuilder.php:120` |
| POST search reads criteria from the query string too | absent | Query parameters and `_criteria` are read only for GET — `RequestCriteriaBuilder.php:78` |
| A filter/sorting/limit on a **to-one** association's nested criteria restricts that association | absent | `loadToOne()` reads only `getAssociations()` and returns early when empty; `joinBasic()`'s many-to-one branch uses the nested criteria only to widen the select list. The restriction is neither applied nor rejected — silently ignored — `EntityReader.php:1331-1352` |
| Unknown `includes` keys are validated or rejected | absent | `ResponseFields::validateFields()` only checks each value is an array; a misspelled alias key matches nothing and the object is returned in full — `System/SalesChannel/Api/ResponseFields.php:55-87` |
| A dated changelog entry documents the 6.7.13.0 association limit+sort fix | absent | No matching entry in `changelog/_unreleased` at v6.7.13.0; traceable only via commits #17644 and #17703 |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| A real POST body combining page, limit, exact total count, multi-field sort, nested multi/range/equals/equalsAny filters and a score query; asserts `meta.total` | upstream trunk `tests/integration/Core/Framework/Api/Controller/ApiControllerSearchTest.php` @ `ee66a4c` |
| A histogram aggregation with a nested sum aggregation, returned under the top-level `aggregations` key by name | same file @ `ee66a4c` |
| Deeply nested associations as objects keyed by property name, each with its own `associations` object | same file @ `ee66a4c` |
| A nested filter on a one-to-many association really restricts the loaded collection | `tests/integration/Core/Framework/DataAbstractionLayer/Reader/EntityReaderTest.php:1180-1270` @ v6.7.13.0 (`testLoadOneToManySupportsFilter`) |
| limit + sorting on a one-to-many returns the correct top-N in the requested order | same file `:1405-1474` (`testLoadOneToManySupportsSortingAndPagination`) |
| limit + sorting + filter with a cross-entity sort — the #12441 shape | same file `:2735-2775` (`testOneToManyPaginationRespectsCrossEntitySort`) |
| `includes` map keyed by apiAlias, with a second alias for the nested type | `tests/unit/Core/Framework/Api/Serializer/JsonEntityEncoderTest.php:161-184` @ v6.7.13.0 |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| A filter on an association's criteria was dropped from the generated SQL entirely; closed not_planned, not fixed | 6.4.17.2 | closed | https://github.com/shopware/shopware/issues/2922 |
| limit + sorting + filter on an association criteria silently drops the limit depending on the sorted field; priority/high, closed completed Feb 2026 | 6.6.10.6 | closed | https://github.com/shopware/shopware/issues/12441 |
| Self-referential nested associations missing from JSON:API responses | unclear | closed | https://github.com/shopware/shopware/issues/5711 |
| `includes` ignored before 6.2 (`source` was the predecessor) | pre-6.2 | closed | https://forum.shopware.com/t/admin-api-includes/66985 |
| Admin posts `total-count-mode: 1` with deeply nested associations; OOM on large association sets | 6.6/6.7 era | closed | https://github.com/shopware/shopware/issues/11823 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Which top-level keys does the parser accept in 6.7? | `RequestCriteriaBuilder.php:40` | KNOWN_FIELDS, 15 entries |
| Accepted values of `total-count-mode`? | `RequestCriteriaBuilder.php:58`, `Criteria.php:40` | Strings none/exact/next-pages and integers 0/1/2; unknown values silently become NONE |
| Is mode 1 the only trustworthy total, and what is in mode 2's total? | `EntitySearcher.php:191`, `:203` | Yes — mode 1 runs a real COUNT(*); mode 2 caps at limit*6+1 rows |
| Does `sort` accept objects and a plain string? | `RequestCriteriaBuilder.php:276`, `:284` | Both |
| Is `associations` an object keyed by name, and is the legacy list form accepted? | `RequestCriteriaBuilder.php:229` | Object only; a list of names silently adds nothing |
| Which aggregation types exist and where do results land? | `AggregationParser.php:225`, `JsonType.php:78` | Eleven types; top-level `aggregations` keyed by name |
| Is the association-level filter actually applied to the association query in 6.7 (#2922)? | `EntityReader.php:559-581`, `CriteriaQueryBuilder.php:68-100`, `EntityReader.php:1331-1352` | Applied for to-many (both one-to-many and many-to-many); silently ignored for to-one — that is the real drop case behind the report |
| Was the #12441 limit-drop fixed on 6.7? | `EntityReader.php:1109-1190`, git refs v6.7.0.0…v6.7.12.0 | Fixed in 6.7.13.0 by the `ROW_NUMBER()` rewrite (#17644, #17703); still defective on 6.7.12.0 and earlier, and the many-to-many limited path is unchanged |
| Is `includes` keyed by the response type's apiAlias? | `JsonEntityEncoder.php:104-125, 197-207`, `Entity.php:217-237` | Yes; an unknown alias key silently filters nothing |
| Does `post-filter` really leave aggregations unfiltered in 6.7? | `EntityAggregator.php:143-170`, `EntitySearcher.php:71` | Yes — `resetPostFilters()` on the aggregation clone; regular filters do restrict aggregations |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The criteria parameters are associations, includes, ids, total-count-mode, page, limit, filter, post-filter, query, term, sort, aggregations, grouping | parameter table | `integrations-api/search-criteria.md` | partly — code also accepts `excludes` and `fields` |
| Associations are keyed by property name and may carry nested criteria (limit, filter, sort) | "The parameter's key is the association's property name in the entity." | `integrations-api/search-criteria.md` | partly — true for to-many; on a to-one association the nested limit/filter/sort are silently ignored (`EntityReader.php:1331-1352`) |
| `post-filter` works like `filter` but does not apply to aggregations | "Works the same as `filter`; however, they don't apply to aggregations." | `integrations-api/search-criteria.md` | yes — `EntityAggregator.php:143` |
| total-count-mode 0/1/2 with 0 the default | "`0 [default]` - No total is determined." | `integrations-api/search-criteria.md` | yes — plus the string forms |
| Exact total uses MySQL `SQL_CALC_FOUND_ROWS` | "Here, you have to use `SQL_CALC_FOUND_ROWS`." | `integrations-api/search-criteria.md` | **no** — a second `COUNT(*)` query is run |
| `sort` entries take field/order/naturalSorting/type, `count` being the only type | parameter list | `integrations-api/search-criteria.md` | yes |
| `includes` is keyed by `apiAlias` | "All response types include an `apiAlias` field…" | `integrations-api/search-criteria.md` | yes — `JsonEntityEncoder.php:104-125` |
| `includes` is post-output processing while `fields` restricts at database level | "the complete entity or data is loaded on the backend and then filtered" | `integrations-api/partial-data-loading.md` | yes |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| Exact total counting uses `SQL_CALC_FOUND_ROWS` | A second `COUNT(*)` query over the unsorted, unlimited subquery | `Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:203` |
| `total-count-mode` takes 0, 1, 2 | Both the integers and the strings `none` / `exact` / `next-pages`; anything else falls back to NONE without an error | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:58`, `:120` |
| The criteria vocabulary is the documented 13-entry table (with `fields` documented on a separate page) | KNOWN_FIELDS has 15 entries including `excludes` and `fields`; surplus keys are ignored rather than rejected | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:40`, `:131` |
| Mode 2 "determines whether there is a next page" | It fetches `limit*6+1` rows, so the reported total is capped roughly six pages ahead | `Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:191` |
| Nested criteria on an association let you "perform a sort or apply filters within the association", without qualification | Only to-many associations honour a nested filter/sort/limit; on a to-one association they are read only for further nested associations and otherwise silently ignored | `Framework/DataAbstractionLayer/Dbal/EntityReader.php:1331-1352` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| `` `total-count-mode` is `0` (default, no total), `1` (exact total via `SQL_CALC_FOUND_ROWS`, performance-intensive) or `2` (whether a next page exists). `` | replaced | Code disproves `SQL_CALC_FOUND_ROWS` — exact mode runs a second `COUNT(*)` (`EntitySearcher.php:203`) — and the fact omitted the accepted string forms and mode 2's `limit*6+1` cap |
| `` `includes` restricts returned fields keyed by the response type's `apiAlias` (e.g. `product`), while `associations` loads related data and accepts a nested criteria per association. `` | replaced | The apiAlias keying is confirmed (`JsonEntityEncoder.php:104-125`) but the associations half was incomplete: it omitted that the value must be an object keyed by property name (a list of names adds nothing) and that a nested filter/sort/limit is silently ignored on to-one associations |
| `` `post-filter` behaves like `filter` but is not applied to aggregations. `` | retained, extended | Confirmed at `EntityAggregator.php:143` (`resetPostFilters()` on the aggregation clone); folded into fact 1 together with the filter/sort/aggregation vocabulary |
