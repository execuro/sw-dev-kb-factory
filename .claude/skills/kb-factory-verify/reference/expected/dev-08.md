# `dev-08` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-08` · `dev` · `DAL` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-2-11` |
| Core version | `6.7.13.0` |

**Query:** In a plugin service, what is the Shopware 6 equivalent of Doctrine's `findBy()` — how do I read products with filters, associations and sorting?

**Expected answer — every fact an answer must contain:**

1. Inject the auto-generated repository by the service id `<entity_name>.repository` (e.g. `product.repository`), built by `EntityCompilerPass` as `$instance->getEntityName() . '.repository'`; the constructor argument must be typed `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository` — in 6.7 `EntityRepositoryInterface` no longer exists anywhere in `vendor/shopware/`, so the old interface type hint is a fatal. `[code: Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:67-95]` `[code: Framework/DataAbstractionLayer/DefinitionInstanceRegistry.php:38-46]`
2. There is no Doctrine-style `findBy()`/`findOneBy()`/`find()`: the only read path is `$repository->search(Criteria $criteria, Context $context): EntitySearchResult`, refined with `$criteria->addFilter(new EqualsFilter('name', 'Example'))` (variadic, fluent), `$criteria->addAssociation('productReviews')` (a dotted string path only — use `$criteria->getAssociation('productReviews')` to filter/sort/limit inside the association) and `$criteria->addSorting(new FieldSorting('createdAt', FieldSorting::ASCENDING))` (only `FieldSorting` instances are accepted). Primary keys go in the constructor, `new Criteria($ids)`; entities are taken with `->getEntities()`. `[code: Framework/DataAbstractionLayer/EntityRepository.php:62-68]` `[code: Framework/DataAbstractionLayer/Search/Criteria.php:126-140,240-267,276-283,311-334]`
3. `searchIds()` is the hydration-free id-only variant and is mandatory for ManyToMany mapping entities: `MappingEntityDefinition::getCollectionClass()`/`getEntityClass()` throw `MappingEntityClassesException` unconditionally, and every `search()` path hits one of them. Sorting carries no implicit tie-breaker — the DAL emits one `ORDER BY` term per supplied `FieldSorting` and adds no primary-key term, so a paginated read sorted on a non-unique column (`createdAt`) can return the same row twice; `RepositoryIterator` pages by offset and only appends an `autoIncrement` sorting when the definition has an `AutoIncrementField`. `[code: Framework/DataAbstractionLayer/MappingEntityDefinition.php:11-19]` `[code: Framework/DataAbstractionLayer/Dbal/CriteriaQueryBuilder.php:106-154]` `[code: Framework/DataAbstractionLayer/Dbal/Common/RepositoryIterator.php:49-52,105-119]`

**Trap:** The query deliberately uses the Doctrine term `findBy()`. Shopware 6 ships no ORM; the answer must be `EntityRepository::search()` with a `Criteria` object, not a Doctrine repository method.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/reading-data.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The read API is `search(Criteria, Context): EntitySearchResult`; `Context` is mandatory and separate from the criteria. | `Framework/DataAbstractionLayer/EntityRepository.php:62-68` | `public function search(Criteria $criteria, Context $context): EntitySearchResult` |
| `searchIds(): IdSearchResult` is the id-only variant; `aggregate(): AggregationResultCollection` returns aggregations only. | `Framework/DataAbstractionLayer/EntityRepository.php:71,87` | `public function searchIds(Criteria $criteria, Context $context): IdSearchResult` |
| Fetch-by-primary-key is the Criteria constructor's first argument, a nullable array of ids, validated. | `Framework/DataAbstractionLayer/Search/Criteria.php:126-140` | `public function __construct(?array $ids = null, protected int $nestingLevel = 0)` |
| `addFilter(Filter ...$queries): self` is variadic and fluent; shipped filters include Equals, EqualsAny, Contains, Range, Multi/And/Or/Nand/Nor/Not/XOr, Prefix, Suffix. | `Framework/DataAbstractionLayer/Search/Criteria.php:260-267` | `public function addFilter(Filter ...$queries): self` |
| `EqualsFilter(string $field, string\|bool\|float\|int\|null $value)` — scalar only, `@final`. | `Framework/DataAbstractionLayer/Search/Filter/EqualsFilter.php:8-17` | `protected readonly string\|bool\|float\|int\|null $value` |
| `RangeFilter(string $field, array $parameters)` keyed by LTE/LT/GTE/GT; any other key throws. | `Framework/DataAbstractionLayer/Search/Filter/RangeFilter.php:13-42` | `throw DataAbstractionLayerException::invalidRangeFilterParams(...)` |
| `addSorting(FieldSorting ...$sorting): self`; `FieldSorting(string $field, string $direction = ASCENDING, bool $naturalSorting = false)`, ASC/DESC consts. | `Framework/DataAbstractionLayer/Search/Criteria.php:276-283` ; `Search/Sorting/FieldSorting.php:12-20` | `public function addSorting(FieldSorting ...$sorting): self` |
| `addAssociation(string $path)` splits on `.` and creates one nested Criteria per segment; `getAssociation(string $path): Criteria` returns that nested Criteria, which is how you filter/sort/limit inside an association. | `Framework/DataAbstractionLayer/Search/Criteria.php:311-334`, `:240-258` | `$criteria = $criteria->getAssociation($part);` |
| Pagination is `setLimit()`/`setOffset()`; the total is governed by `setTotalCountMode()` — NONE=0 (default, fastest), EXACT=1, NEXT_PAGES=2. | `Framework/DataAbstractionLayer/Search/Criteria.php:38-51,408-429` | `final public const TOTAL_COUNT_MODE_NONE = 0;` |
| Idiomatic result access is `->search(...)->getEntities()`; `getTotal(): int` gives the count. | `Framework/DataAbstractionLayer/Search/EntitySearchResult.php:101,109` ; `Content/Product/Cart/ProductGateway.php:43` | `return $this->repository->search($criteria, $context)->getEntities();` |
| `EntitySearchResult` still extends `EntityCollection` in 6.7 but that is deprecated for 6.8. | `Framework/DataAbstractionLayer/Search/EntitySearchResult.php:16,25` | `@deprecated tag:v6.8.0 reason:class-hierarchy-change` |
| The repository is injected as the generic `EntityRepository`, autowired by argument name; core pins the collection in a docblock. | `Content/Product/SalesChannel/CrossSelling/ProductCrossSellingRoute.php:44-52` | `@param EntityRepository<ProductCrossSellingCollection> $crossSellingRepository` |
| For products, `SalesChannelRepository::search(Criteria, SalesChannelContext)` is the separate sales-channel-aware read; plain `EntityRepository::search` takes a `Context` and does no sales-channel processing. | `System/SalesChannel/Entity/SalesChannelRepository.php:34,54` | `public function search(Criteria $criteria, SalesChannelContext $salesChannelContext): EntitySearchResult` |
| A standalone context comes from `Context::createDefaultContext()` (defaults to `SystemSource`). | `Framework/Context.php:119-124` | `public static function createDefaultContext(?ContextSource $source = null): self` |
| **Deep:** the repository service id is `getEntityName() . '.repository'`, registered public by `EntityCompilerPass` from services tagged `shopware.entity.definition`, class `EntityRepository`, with an alias for argument autowiring. | `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:67-95` | `$repositoryId = $instance->getEntityName() . '.repository';` |
| **Deep:** the runtime side resolves the same map; `DefinitionInstanceRegistry::getRepository()` asserts `instanceof EntityRepository`. | `Framework/DataAbstractionLayer/DefinitionInstanceRegistry.php:23,38-46,160` | `'product' => 'product.repository'` |
| **Deep:** `MappingEntityDefinition` throws on both entity-class accessors, and both `search()` branches (empty result, and `EntityReader::read()`) call `getCollectionClass()`; `searchIds()` touches neither. | `Framework/DataAbstractionLayer/MappingEntityDefinition.php:11-19` ; `EntityRepository.php:252` ; `Dbal/EntityReader.php:86` | `throw new MappingEntityClassesException();` |
| **Deep:** `RepositoryIterator::fetch()` returns null when the result has no ids and advances strictly by offset; the constructor appends `FieldSorting('autoIncrement', ASC)` only when `hasAutoIncrement()`. Identical in 6.6. | `Framework/DataAbstractionLayer/Dbal/Common/RepositoryIterator.php:49-52,105-119` | `$this->criteria->setOffset((int) $this->criteria->getOffset() + (int) $this->criteria->getLimit());` |
| **Deep:** `CriteriaQueryBuilder::build()` passes exactly `$criteria->getSorting()` to `addSortings()` and appends nothing; `EntitySearcher` adds only LIMIT/OFFSET. | `Framework/DataAbstractionLayer/Dbal/CriteriaQueryBuilder.php:80,106-154` ; `Dbal/EntitySearcher.php:71-89` | `$this->addSortings($definition, $criteria, $criteria->getSorting(), $query, $context);` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `EntityRepository` offers Doctrine-style `findBy()`/`findOneBy()`/`find()`. | absent | The full public surface is getDefinition, search, aggregate, searchIds, update, upsert, create, delete, createVersion, merge, clone. `Framework/DataAbstractionLayer/EntityRepository.php:54-182` |
| `addSorting()` accepts an arbitrary object or an array like `['name' => 'ASC']`. | absent | Signature is `addSorting(FieldSorting ...$sorting)`; anything else is a TypeError. `Search/Criteria.php:276` |
| `EntityRepository` is extendable for custom query helpers. | absent | Class is `@final`, constructor `@internal`. `EntityRepository.php:30-42` |
| The DAL adds a primary-key tie-breaker to the generated ORDER BY. | absent | `addSortings()` emits one ORDER BY per supplied FieldSorting and nothing else; no `FieldSorting('id')` anywhere under `Framework/DataAbstractionLayer`. `Dbal/CriteriaQueryBuilder.php:106-154` |
| `Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface` exists in 6.7. | absent | File does not exist; `grep -rn EntityRepositoryInterface vendor/shopware/` returns no matches. |
| `RepositoryIterator::fetch()` uses an id/auto-increment cursor like `fetchIds()`. | absent | `fetch()` contains only the offset advance; the cursor `RangeFilter` lives solely in `fetchIds()`. `Dbal/Common/RepositoryIterator.php:105-119` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Canonical filter + sort + association read, then `getEntities()`. | `Content/Product/SalesChannel/CrossSelling/ProductCrossSellingRoute.php:129-141` |
| Read products by id with nested associations. | `Content/Product/Cart/ProductGateway.php:32-43` |
| Filtering and limiting inside an association via `getAssociation()`. | `Content/Category/Service/CategoryBreadcrumbBuilder.php:209-218` |
| Sorting inside an association. | `Content/Shared/MailFlow/DataProvider/OrderProvider.php:50` |
| `fetch()` pages by offset (offset asserted to grow per iteration); repositories fetched by `<entity>.repository`. | shopware/shopware `tests/integration/Core/Framework/DataAbstractionLayer/Dbal/RepositoryIteratorTest.php::testIteratedSearch` |
| `fetch()` with a caller sorting uses offset pagination. | same file, `::testFetchWithSortingUsesOffsetPagination` |
| The auto-increment cursor path of `fetchIds()` and its termination guarantee. | same file, `::testFetchIdAutoIncrement` / `::testFetchIdsIsNotRunningInfinitely` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Upgrade note: the `$criteria` parameter was removed from `Criteria::addAssociation()`; use `getAssociation()`. Older posts still show the two-argument form. | 6.1 onwards | merged | https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.1.md |
| Forum: official developer-training plugin example fails — `EntityRepositoryInterface` type hint yields a TypeError; fixed by type-hinting `EntityRepository`. | unclear (6.5+) | closed | https://forum.shopware.com/t/entityrepositoryinterface-error-when-applying-shopware-6-developer-training-plugin/99783 |
| Product search filtered on `visibilities.salesChannelId` returns total 0 under a non-live version context. | 6.7.13.1 | closed | https://github.com/shopware/shopware/issues/19790 |
| Paginating a product search sorted by `createdAt` returns the same product on two pages. | 6.0 era, open concern for non-unique sort fields | closed | https://github.com/shopware/shopware/issues/7465 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Exact signature of `addAssociation()` / `getAssociation()` in 6.7. | code lane | `addAssociation(string $path)` only; `getAssociation(string $path): Criteria` returns the nested Criteria. `Search/Criteria.php:240-258,311-334` |
| Does `Criteria::__construct()` still accept an id array? | code lane | Yes, `?array $ids`, validated. `Search/Criteria.php:126-140` |
| 6.7 signatures of `search()`/`searchIds()`/`aggregate()`. | code lane | `(Criteria, Context)` returning EntitySearchResult / IdSearchResult / AggregationResultCollection. `EntityRepository.php:62-68,71,87` |
| Is `EntityRepositoryInterface` still present in 6.7? | deep pass | Removed; zero matches across `vendor/shopware/`. The forum TypeError is explained, but the fact enters from code, not from the report. |
| Does the DAL add a deterministic tie-breaker to ORDER BY (issue #7465)? | deep pass | No. `CriteriaQueryBuilder::addSortings()` emits only the supplied sortings; `EntitySearcher` adds only LIMIT/OFFSET. `Dbal/CriteriaQueryBuilder.php:106-154` |
| Is `SalesChannelRepository` a separate class in 6.7? | code lane | Yes — `search(Criteria, SalesChannelContext)`. `System/SalesChannel/Entity/SalesChannelRepository.php:34,54` |
| Which filter classes exist and what is the `RangeFilter` key format? | code lane | Filter directory listing; LTE/LT/GTE/GT keys, others throw. `Search/Filter/RangeFilter.php:13-42` |
| Is the repository service id exactly `<entity_name>.repository`? | deep pass | Yes, built by `EntityCompilerPass`. `Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:67-95` |
| Can a mapping entity be read with `search()`? | deep pass | No — `MappingEntityDefinition` throws on both entity-class accessors; `searchIds()` is hydration-free. `MappingEntityDefinition.php:11-19` |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Shopware 6 has no ORM, only a thin DAL. | "Shopware 6 uses no ORM but rather a thin Data Abstraction Layer" | `developer/guides/plugins/plugins/framework/data-handling/reading-data.md` | yes — no find/findBy/findOneBy on `EntityRepository` |
| Repositories are auto-generated per entity, service id `entity_name.repository`. | "The repository's service name follows this pattern: `entity_name.repository`" | same page | yes — `EntityCompilerPass.php:67-95` |
| The injected type is `EntityRepository`; `search()` takes a Criteria and a Context. | "$products = $this->productRepository->search(new Criteria(), $context);" | same page | yes — `EntityRepository.php:62-68` |
| `search()` returns an `EntitySearchResult` containing the collection. | "will be an instance of an `EntitySearchResult`" | same page | yes — `EntitySearchResult.php:101,109` |
| The Criteria constructor accepts an array of IDs. | "The `Criteria` object accepts an array of IDs to search for as a constructor parameter." | same page | yes — `Search/Criteria.php:126-140` |
| Filtering uses `EqualsFilter` via `addFilter`. | "you can apply filters to the `Criteria` object, such as an `EqualsFilter`" | same page | yes — `Search/Criteria.php:260-267` |
| `EntitySearchResult` extends `EntityCollection` and is iterable. | "Since the `EntitySearchResult` is extending the `EntityCollection`, which is iterable" | same page | partly — true in 6.7, deprecated for 6.8 |
| Filters combine with `OrFilter`/`AndFilter`/`NandFilter`. | "you can combine filters using the `OrFilter` or the `AndFilter`" | same page | yes — filter directory listing |
| `addPostFilter` excludes the filter from the aggregation result. | "you don't want those filters to apply to the aggregation result" | same page | not checked by the code lane |
| Associations load with `addAssociation`, paths chain with dots. | "you can chain the association key" | same page | yes — `Search/Criteria.php:311-334` |
| `getAssociation()` returns the association's own Criteria for filtering. | "which basically returns its own `Criteria` object" | same page | yes — `Search/Criteria.php:240-258` |
| An association-scoped filter restricts only the loaded association rows. | "only matching reviews are added to the dataset then" | same page | consistent with `CategoryBreadcrumbBuilder.php:209-218`; not separately proven |
| ManyToMany mapping entities cannot be read with `search()`; use `searchIds()`. | "you **cannot** read those mapping entities using the `search()` method" | same page | yes — `MappingEntityDefinition.php:11-19` |
| Aggregations are added with `addAggregation` and read via `getAggregations()->get(name)`. | "$rating = $products->getAggregations()->get('avg-rating');" | same page | partly — `aggregate()` exists; accessor not separately read |
| Paging/sorting use `setLimit`, `setOffset`, `addSorting(new FieldSorting(...))`. | "The `FieldSorting` can be found here: …\\Search\\Sorting\\FieldSorting" | same page | yes — `Search/Criteria.php:276-283,408-429` |
| `RepositoryIterator` batches large result sets; `fetch()` returns null when exhausted. | "the `RepositoryIterator` will return a batch of data … with each iteration" | same page | yes — `Dbal/Common/RepositoryIterator.php:105-119` |
| `RepositoryIterator` requires a deterministic sorting or rows duplicate/skip. | "you must ensure that your sorting means that there's only one correct way to order your results" | same page | yes — the iterator pages by offset and the DAL adds no tie-breaker |
| Available fields are discoverable from the entity definition class. | "All available fields can be found in the entities' respective definition" | same page | not checked by the code lane |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| `EntitySearchResult` extends `EntityCollection`, so a `foreach` over the search result is the idiomatic access. | True in 6.7 but carries `@deprecated tag:v6.8.0 reason:class-hierarchy-change`; core reads `->search(...)->getEntities()`. | `Search/EntitySearchResult.php:16,25` ; `Content/Product/Cart/ProductGateway.php:43` |
| The example injects `private EntityRepository $productRepository` without saying whether the class is generic or per-entity. | One generic `@final` class for every entity; the collection is pinned only in a docblock, e.g. `@param EntityRepository<ProductCrossSellingCollection>`. | `EntityRepository.php:30-42` ; `ProductCrossSellingRoute.php:44-52` |
| The page's mapping-entity code sample names `product_category.repository` while the prose says mapping entities cannot be read with `search()` — a reader skimming code alone gets the opposite of the rule. | The repository service does exist for the mapping entity; it is `search()` that throws, `searchIds()` works. | `MappingEntityDefinition.php:11-19` ; `Dbal/EntityReader.php:86` |
| The docs' deterministic-sorting warning is framed as a `RepositoryIterator` caveat. | It applies to any paginated `search()`: the DAL appends no primary-key tie-breaker at all, and the iterator supplies one only for definitions with an `AutoIncrementField`. | `Dbal/CriteriaQueryBuilder.php:106-154` ; `Dbal/Common/RepositoryIterator.php:49-52` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Inject the generated repository by the service id `<entity_name>.repository` (e.g. `product.repository`); the constructor argument is typed `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`. | rewritten | Confirmed and tagged; extended with the id-generating compiler pass and with the code-proven absence of `EntityRepositoryInterface` in 6.7, which is the failure a plugin author actually hits. |
| Read with `$repository->search(new Criteria(), $context)`, which returns an `EntitySearchResult`; refine it with `$criteria->addFilter(new EqualsFilter('name', 'Example name'))`, `$criteria->addAssociation('productReviews')` and `$criteria->addSorting(new FieldSorting('createdAt', FieldSorting::ASCENDING))`. | rewritten | Confirmed and tagged; extended with the absence of any `findBy()` equivalent (the case's trap), the single-string signature of `addAssociation()` vs `getAssociation()`, and `getEntities()` as the result access. |
| Mapping entities of a ManyToMany association (e.g. `ProductCategoryDefinition`) cannot be read with `search()` — use `searchIds()`; and `RepositoryIterator` requires a deterministic sort (add `id` as secondary sort) or rows are skipped or duplicated across batches. | rewritten | Mapping-entity half confirmed by `MappingEntityDefinition.php:11-19`. The parenthetical "add `id` as secondary sort" is not what the code does: no lane found any `FieldSorting('id')` in the DAL, and the tie-breaker the iterator supplies is `autoIncrement`, only when the definition has an `AutoIncrementField`. Replaced with the code-proven statement that no implicit tie-breaker exists for any paginated `search()`. |
