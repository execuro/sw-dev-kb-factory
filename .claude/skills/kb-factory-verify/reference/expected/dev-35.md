# `dev-35` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-35` · `dev` · `Administration` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-32-41` |
| Core version | `6.7.13.0` (admin pins `@shopware-ag/meteor-admin-sdk` 6.9.0) |

**Query:** How do I load entities from the Admin API inside an Administration component using the repository factory and a Criteria?

**Expected answer — every fact an answer must contain:**

1. Inject the factory with `inject: ['repositoryFactory']`, build the repository with `this.repositoryFactory.create('product')` (signature `create(entityName, route = '', options = {})`), and call `search(criteria)`. The API context is **optional**: `search`, `get`, `searchIds` and `save` default it to `Shopware.Context.api`, and passing it explicitly only matters when overriding language/version. Version boundary inside 6.7: at 6.7.13.0 `search` takes exactly `(criteria, context)`; the cache options `{ cacheKey: unknown[], ttl, forceReload }` arrive at 6.7.14.0 and are silently ignored on earlier patches.  `[code: administration package — src/app/init/repository.init.ts:63-70, src/core/data/repository-factory.data.ts:41-62, src/core/data/repository.data.ts:107-149]`
2. Criteria comes from `const { Criteria } = Shopware.Data;` — in 6.7 that is a bare re-export of the Meteor Admin SDK's Criteria (pinned 6.9.0), not an administration-local class. `new Criteria()` is valid and yields `page = 1, limit = null`; `new Criteria(page, limit)` sets both. The chainable instance methods `setPage`, `setLimit`, `setTerm`, `setIds`, `addFilter(Criteria.equals('active', true))`, `addSorting(Criteria.sort('name', 'DESC'))` and `addAssociation('manufacturer')` all exist and return `this`; `addAssociation` splits a dot-path into a nested Criteria per segment and still returns the **root** criteria, so `getAssociation(path)` is what reaches the nested one.  `[code: administration package — src/core/data/criteria.data.ts:1-8, package.json:58]` `[code: shopware/meteor packages/admin-sdk/src/data/Criteria.ts @ tag @shopware-ag/meteor-admin-sdk@6.9.0]`
3. The search is ACL-checked server-side before it runs: `ApiController::resolveSearch()` calls `AclCriteriaValidator::validate()`, which requires `<entity>:read` **and recurses into every association the criteria touches**, throwing `ApiException::missingPrivileges()` → HTTP 403 `FRAMEWORK__MISSING_PRIVILEGE_ERROR` listing all of them. Registering the privilege in the Administration alone does not satisfy it.  `[code: Framework/Api/Controller/ApiController.php:445-469]` `[code: Framework/Api/Acl/AclCriteriaValidator.php:31-55]` `[code: Framework/Api/Exception/MissingPrivilegeException.php:30-33]`

**Trap:** `setTotalCountMode` takes `0` (none), `1` (exact) and `2` (pagination). The SDK constructor defaults to `1`, while the server-side `Criteria` defaults to `0` — the exact count an admin listing gets comes from the SDK default. Mode `2` is documented as `limit * 5 + 1` in both the SDK and core doc comments, but `EntitySearcher::addTotalCountMode()` actually fetches `limit * 6 + 1` rows; only the pagination-link maths uses `* 5 + 1`.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.html
<!-- expected:end -->

## Evidence — code (decisive)

Source version `6.7.13.0`. Administration paths are relative to `vendor/shopware/administration/Resources/app/administration/`; core paths to `vendor/shopware/core`.

| fact | citation | excerpt |
| --- | --- | --- |
| `repositoryFactory` is a registered application service provider, so `inject: ['repositoryFactory']` (or `Shopware.Service('repositoryFactory')`) obtains it | `src/app/init/repository.init.ts:63-70` | `Shopware.Application.addServiceProvider('repositoryFactory', () => { return new RepositoryFactory(hydrator, changesetGenerator, entityFactory, httpClient, errorResolver); });` |
| `create(entityName, route = '', options = {})` derives the route from the entity name (underscores → hyphens) and looks up the `EntityDefinition` | `src/core/data/repository-factory.data.ts:41-62` | `if (!route) { route = \`/${entityName.replace(/_/g, '-')}\`; } const definition = Shopware.EntityDefinition.get(entityName);` |
| `search(criteria, context = Shopware.Context.api)` POSTs the parsed criteria to `/search<route>` and hydrates an EntityCollection — the context argument is defaulted, not required | `src/core/data/repository.data.ts:121-137` | `search(criteria: Criteria, context = Shopware.Context.api): Promise<EntityCollection<EntityName>> {` |
| At 6.7.14.0 the signature gains cache options in the second **and** third position, wrapped in `runCachedRead()` → `Shopware.Service('cacheService').query()`; `get()` gains a fourth parameter | `github:shopware/shopware …/src/core/data/repository.data.ts @ refs/tags/v6.7.14.0` | `type RepositoryCacheOptions = { cacheKey: unknown[]; ttl?: number; forceReload?: boolean; };` |
| `get(id, context, criteria)` wraps `search()`: it builds `new Criteria(1, 1)` when none is given, calls `setIds([id])`, and can return `null` | `src/core/data/repository.data.ts:142-149` | `criteria = criteria \|\| new Criteria(1, 1); criteria.setIds([id]); … return result.get(id);` |
| `searchIds(criteria, context)` POSTs to `/search-ids<route>` and returns a raw IdSearchResult without hydration | `src/core/data/repository.data.ts:107-119` | `let url = \`/search-ids${this.route}\`;` |
| The bearer token and the language / currency / version / inheritance headers are built from `Shopware.Context.api` by `buildHeaders` — never set by hand | `src/core/data/repository.data.ts:654-690` | `Authorization: \`Bearer ${context.authToken.access}\`, … 'sw-language-id': context.languageId,` |
| `Criteria` is not an administration-local class in 6.7: `criteria.data.ts` re-exports the Meteor Admin SDK's Criteria | `src/core/data/criteria.data.ts:1-8` | `import Criteria from '@shopware-ag/meteor-admin-sdk/es/data/Criteria'; export default Criteria;` |
| The SDK version pinned for that Criteria implementation | `package.json:58` | `"@shopware-ag/meteor-admin-sdk": "6.9.0",` |
| Criteria is reached in component code as `const { Criteria } = Shopware.Data;` | `src/core/shopware.ts:262`; `src/core/data/index.js:6,19` | `public Data = data;` / `import Criteria from './criteria.data'; … Criteria,` |
| SDK 6.9.0 constructor: `constructor(page = defaultPage, limit = defaultLimit)` over module-level mutable defaults `1` / `null`, changeable via the exported `setDefaultValues()` — so `new Criteria()` is valid and emits a page but no limit | `github:shopware/meteor packages/admin-sdk/src/data/Criteria.ts @ refs/tags/@shopware-ag/meteor-admin-sdk@6.9.0` | `let defaultPage: null\|number = 1; let defaultLimit: null\|number = null;` |
| SDK 6.9.0: `setPage`, `setLimit`, `addFilter`, `addAggregation`, `addAssociation` all exist and return `this`; `addAssociation` splits a dot-path per segment and returns the root criteria | same file | `addAssociation(path: string): this { const parts = path.split('.'); let criteria = this; parts.forEach((part) => { criteria = criteria.getAssociation(part); }); return this; }` |
| SDK 6.9.0 statics: `Criteria.equals(field, value)` and `Criteria.sort(field, order = 'ASC', naturalSorting = false)` | same file | `static equals(field, value) { return { type: 'equals', field, value }; }` · `static sort(field, order = 'ASC', naturalSorting = false): Sorting` |
| SDK 6.9.0 `TotalCountMode`: `NO_TOTAL_COUNT = 0`, `EXACT_TOTAL_COUNT = 1`, `PAGINATION_TOTAL_COUNT = 2`; the constructor defaults to `EXACT_TOTAL_COUNT` | same file | `export const enum TotalCountMode { 'NO_TOTAL_COUNT' = 0, 'EXACT_TOTAL_COUNT' = 1, /* Fetches limit * 5 + 1 … */ 'PAGINATION_TOTAL_COUNT' = 2, }` |
| `setTotalCountMode` clamps out-of-range values to `null`; its non-number guard is ineffective because the assignment that follows is unconditional | same file | `setTotalCountMode(mode) { if (typeof mode !== 'number') { this.totalCountMode = null; } this.totalCountMode = (mode < 0 \|\| mode > 2) ? null : mode; return this; }` |
| Server-side `Criteria` defaults to `TOTAL_COUNT_MODE_NONE` (0) — the opposite of the SDK default | `Framework/DataAbstractionLayer/Search/Criteria.php:88` | `protected int $totalCountMode = self::TOTAL_COUNT_MODE_NONE;` |
| Mode 2 actually fetches `limit * 6 + 1` rows and slices back to the limit, although both doc comments say `limit * 5 + 1` | `Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:103-105,190-196` | `$query->setMaxResults((int) $criteria->getLimit() * 6 + 1);` |
| Only the pagination links use the documented `limit * 5 + 1` | `Framework/Api/Response/Type/JsonFactoryBase.php:79-89` | `case Criteria::TOTAL_COUNT_MODE_NEXT_PAGES: … $maxFetchCount = $limit * 5 + 1;` |
| On the wire `total-count-mode` also accepts the names `none` / `exact` / `next-pages`; out-of-range or unknown values fall back to NONE | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:114-126` | `$criteria->setTotalCountMode(self::TOTAL_COUNT_MODE_MAPPING[$totalCountMode] ?? Criteria::TOTAL_COUNT_MODE_NONE);` |
| ACL is validated before the repository runs: `resolveSearch()` calls `AclCriteriaValidator::validate()` and throws on any missing privilege | `Framework/Api/Controller/ApiController.php:278-287,445-469` | `$nested = $this->criteriaValidator->validate($definition->getEntityName(), $criteria, $context); … if ($permissions !== []) { throw ApiException::missingPrivileges($permissions); }` |
| The validator requires `<entity>:read` and recurses into every association of the criteria | `Framework/Api/Acl/AclCriteriaValidator.php:31-55` | `$privilege = $entity . ':' . AclRoleDefinition::PRIVILEGE_READ; … foreach ($criteria->getAssociations() as $field => $nested) { … }` |
| `AdminApiSource::isAllowed()` short-circuits only for an admin user; otherwise it is an `in_array` over resolved permissions | `Framework/Api/Context/AdminApiSource.php:73-80` | `if ($this->isAdmin) { return true; } return \in_array($privilege, $this->permissions, true);` |
| The failure is HTTP 403 `FRAMEWORK__MISSING_PRIVILEGE_ERROR` listing the missing privileges | `Framework/Api/Exception/MissingPrivilegeException.php:13-33` | `public function getStatusCode(): int { return Response::HTTP_FORBIDDEN; }` |
| Canonical in-tree usage: repository in a computed, criteria in a computed with `new Criteria(page, limit)` + `setTerm` + `addSorting`, `search()` in a method assigning `total` and items | `src/module/sw-settings-tag/page/sw-settings-tag-list/index.js:8,14-18,57-59,83-100,253-262` | `tagCriteria() { const criteria = new Criteria(this.page, this.limit); criteria.setTerm(this.term); … criteria.addSorting(sorting); return criteria; }` |
| A repository can be created with options — `useSync` routes `save()` to the sync API; `sw-app-integration-id` and `compatibility` influence headers | `src/core/data/repository.data.ts:156-158,654-656` | `if (this.options.useSync === true) { return this.saveWithSync(entity, context);` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `Repository.search()` accepts cache options (`cacheKey`, `ttl`) at 6.7.13.0 | absent | The on-disk signature is `search(criteria, context)` posting directly through `httpClient`; there is no third parameter, no `RepositoryCacheOptions`, no `runCachedRead`, no `cacheService`. The feature first appears at v6.7.14.0 — `src/core/data/repository.data.ts:124-137` |
| Mode 2 fetches `limit * 5 + 1` rows | contradicted by implementation | Both doc comments (SDK 6.9.0, `Criteria.php:48`) and `JsonFactoryBase` say `limit * 5 + 1`, but `EntitySearcher::addTotalCountMode()` sets `maxResults` to `limit * 6 + 1` — `Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:190-196` |
| `RepositoryFactory.create` validates the entity name | indirect | No validation branch; `create()` calls `Shopware.EntityDefinition.get(entityName)` and dereferences `definition.entity`, so an unknown name fails inside `EntityDefinition.get` — `src/core/data/repository-factory.data.ts:50-56` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Shopware's own 6.7.14.0 release notes show `…create('currency').search(criteria, Shopware.Context.api, { cacheKey: […], ttl: … })` — a third options argument the older guides do not mention | 6.7.14.0 | merged | https://github.com/shopware/shopware/releases/tag/v6.7.14.0 |
| A Criteria requesting a nested association that loops back to the searched entity leaves that association `null` on the primary record in the JSON:API response, while `included` has it | 6.6.6.0 | closed | https://github.com/shopware/shopware/issues/5711 |
| Reading a custom entity through the Admin API returns 403 `FRAMEWORK__MISSING_PRIVILEGE_ERROR` (`ce_ravioli:read`) although the docs say separate permissions are not required | 6.6.10.4 | closed | https://github.com/shopware/shopware/issues/9991 |
| `listing.mixin.ts` sets `filterCriteria` before the route update; the `$route` watcher clears it and returns without calling `getList()`, so the first search goes out with no filters | 6.7.10.2 | open | https://github.com/shopware/shopware/issues/19749 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is `inject: ['repositoryFactory']` still the supported path in 6.7? | code lane | Settled: yes — registered service provider, `src/app/init/repository.init.ts:63-70` |
| What are `repositoryFactory.create()`'s parameters in 6.7? | code lane | Settled: `(entityName, route = '', options = {})` |
| Is the `context` argument still required? | code lane | Settled: no — it defaults to `Shopware.Context.api` |
| Does `search()` accept a third options argument (cacheKey/ttl)? | deep pass | Settled with a version boundary: no at 6.7.13.0, yes from 6.7.14.0, where `cacheKey` is an **array**. Stated inside fact 1 |
| Which Criteria constructor arguments are required, and is `new Criteria()` still valid? | deep pass | Settled: valid — defaults `page = 1`, `limit = null`, from module-level mutable defaults. Fact 2 |
| Does a repository read require the entity's `:read` privilege server-side (issue 9991)? | deep pass | Settled: yes, enforced in `AclCriteriaValidator` before the repository runs, recursing into associations. Fact 3 |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The repository service is injected via the BottleJS DI container | "which can be injected with a [BottleJS] dependency injection container" | `…/using-data-handling.md` | yes in effect — `src/app/init/repository.init.ts:63-70` |
| `repositoryFactory.create('<entity>')` returns a repository for that entity | "The `create` function can be used to create a repository for a single entity" | same page | yes — `src/core/data/repository-factory.data.ts:41-62` |
| `create`'s third options parameter has only one option, `version` | "There are no other options." | same page | **no** — `useSync`, `compatibility` and `sw-app-integration-id` are read from options (`src/core/data/repository.data.ts:156-158,654-656`) |
| Every repository function requires both the API context and a Criteria | "Each repository function requires the API `context` and `criteria` class" | same page | **no** — context is defaulted (`src/core/data/repository.data.ts:121-137`) |
| `const { Criteria } = Shopware.Data;` is how Criteria is obtained | quoted verbatim | same page | yes — `src/core/shopware.ts:262`; `src/core/data/index.js:6,19` |
| The Criteria API includes `setPage`, `setLimit`, `setTerm`, `setIds`, `setTotalCountMode`, `addFilter`, `addSorting`, `addAggregation`, `addAssociation`, `getAssociation` | "criteria.setPage(1); criteria.setLimit(10); …" | same page | yes — all confirmed in SDK 6.9.0 `Criteria.ts` by the deep pass |
| `setTotalCountMode` takes 0 / 1 / 2 with the described semantics | "2 - fetches limit * 5 + 1" | same page | partly — the modes and their names are confirmed, but mode 2 fetches `limit * 6 + 1` rows in `EntitySearcher` |
| A single entity is loaded with `repository.get(id, context[, criteria])` | "provides loading of a single resource from the Admin API" | same page | yes — `src/core/data/repository.data.ts:142-149` |
| Change tracking sends only changed properties; entities are stateless after save | "A manual update is mandatory." | same page | not examined |
| Multiple entities are deleted with `syncDeleted(ids)` | "To delete multiple entities at once use the `syncDeleted` method" | same page | not examined |

Docs-lane internal contradictions worth noting: `using-data-handling.md` says every repository function requires the context while `making-api-requests.md` calls `search(criteria)` with none; the page names `core/data/criteria.data.ts` as the Criteria source in prose but links to the Meteor admin-SDK `Criteria.ts`; most examples use `new Criteria()` with no arguments while others use `new Criteria(1, 500)`, and the page never states whether the arguments are required — the deep pass settles that they are not.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| Each repository function *requires* the API context | The context parameter defaults to `Shopware.Context.api` on `search`, `get`, `searchIds` and `save` | `src/core/data/repository.data.ts:107-158` |
| `create()`'s options object has only a `version` option | Options also carry `useSync`, `compatibility` and `sw-app-integration-id` | `src/core/data/repository.data.ts:156-158,654-656` |
| Criteria lives in `src/core/data/criteria.data.ts` in the Administration | That file is a bare re-export of `@shopware-ag/meteor-admin-sdk/es/data/Criteria`; the implementation ships in the SDK package (pinned 6.9.0) | `src/core/data/criteria.data.ts:1-8`; `package.json:58` |
| Total-count mode 2 "fetches limit * 5 + 1" | `EntitySearcher::addTotalCountMode()` sets `maxResults` to `limit * 6 + 1` and slices back to the limit; only the pagination-link maths uses `* 5 + 1` | `Framework/DataAbstractionLayer/Dbal/EntitySearcher.php:190-196`; `Framework/Api/Response/Type/JsonFactoryBase.php:79-89` |
| The docs do not mention ACL for a component-side repository read | The read is refused with 403 unless `<entity>:read` and every associated entity's `:read` are granted | `Framework/Api/Acl/AclCriteriaValidator.php:31-55` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Inject the factory with `inject: ['repositoryFactory']`, build the repository with `this.repositoryFactory.create('product')`, and pass `Shopware.Context.api` as the second argument to `search`, `get`, `save` and `delete`. | rewritten | Injection and `create()` confirmed; the "pass the context" clause is disproved — every one of those methods defaults it (`repository.data.ts:107-158`). Rewriting also lets the fact carry the 6.7.13.0 → 6.7.14.0 signature boundary the deep pass established. |
| Criteria is configured with `setPage`, `setLimit`, `setTerm`, `addFilter(Criteria.equals('product.active', true))`, `addSorting(Criteria.sort('product.name', 'DESC'))` and `addAssociation('manufacturer')`. | rewritten | Every method confirmed in SDK 6.9.0, but the fact omitted what decides usability: Criteria is the SDK's class, not an admin-local one; `new Criteria()` is valid with `limit = null`; and `addAssociation` on a dot-path returns the root, not the nested criteria. |
| `setTotalCountMode` takes `0` for no total count, `1` for the exact total count and `2` for `limit * 5 + 1`. | moved to the trap, corrected | The modes are confirmed, but `limit * 5 + 1` is the doc comment, not the behaviour: `EntitySearcher` fetches `limit * 6 + 1`. The SDK/server default disagreement (1 vs 0) is the other half of the correction. Displaced from the facts by the ACL finding, which decides whether the call works at all. |
| _(new)_ | added | The server-side ACL validation is load-bearing and the old set missed it entirely: without `<entity>:read` — and `:read` on every association in the criteria — the documented call returns 403 (`AclCriteriaValidator.php:31-55`). |
