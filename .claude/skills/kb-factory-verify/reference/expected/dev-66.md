# `dev-66` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-66` · `dev` · `Admin API` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0942-62-71` |
| Core version | `6.7.13.0` |

**Query:** Which request headers change Admin API behaviour for language, entity version, parent-child inheritance and skipping flow triggers during a bulk import?

**Expected answer — every fact an answer must contain:**

1. `sw-language-id` sets the context language (empty or missing falls back to the system language) and is expanded into the chain *requested → its parent → system fallback*; a non-UUID or unknown id raises `languageNotFound` rather than falling back silently. `sw-version-id` selects the entity version and defaults to the live version — unlike the language header it is taken unvalidated.  `[code: Framework/Routing/ApiRequestContextResolver.php:114]` · `[code: Framework/Routing/ApiRequestContextResolver.php:95]`
2. `sw-inheritance` switches on `considerInheritance` (parent-child, e.g. variants inheriting from the parent product) by **presence alone** — any value, including `0` or `false`, enables it; there is no way to disable inheritance by sending a falsy value.  `[code: Framework/Routing/ApiRequestContextResolver.php:124]`
3. `sw-skip-trigger-flow` must carry a truthy value (`true`, `1`, `yes`, `on` — it is read with `FILTER_VALIDATE_BOOLEAN`); it adds `Context::SKIP_TRIGGER_FLOW`, which makes `FlowDispatcher` return before any flow is created or executed. It is resolved for every `/api` route, not only `POST /api/_action/sync`.  `[code: Framework/Routing/ApiRequestContextResolver.php:68]` · `[code: Content/Flow/Dispatching/FlowDispatcher.php:52]`

**Official reference URL:** https://developer.shopware.com/docs/guides/development/integrations-api/request-headers.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The header names are PlatformRequest constants: sw-language-id, sw-currency-id, sw-inheritance, sw-version-id, sw-skip-trigger-flow, sw-include-seo-urls, sw-include-search-info | `PlatformRequest.php:20` | `public const HEADER_INHERITANCE = 'sw-inheritance';\npublic const HEADER_SKIP_TRIGGER_FLOW = 'sw-skip-trigger-flow';` |
| All context headers are consumed in `ApiRequestContextResolver::resolve`, which runs for every route whose scope implements ApiContextRouteScopeDependant — ApiRouteScope does, so this covers all `/api` routes including `/api/_action/sync` | `Framework/Routing/ApiRequestContextResolver.php:55` | `$context = new Context($this->resolveContextSource($request), [], $params['currencyId'], $languageIdChain, $params['versionId'] ?? Defaults::LIVE_VERSION, …` |
| sw-language-id sets the context language; empty or missing falls back to `Defaults::LANGUAGE_SYSTEM` | `Framework/Routing/ApiRequestContextResolver.php:114` | `$languageId = $request->headers->get(PlatformRequest::HEADER_LANGUAGE_ID, '');\nif ($languageId !== '') {` |
| A non-system language id becomes the chain [requested, parent, system fallback]; a non-UUID or unknown id throws `RoutingException::languageNotFound` | `Framework/Routing/ApiRequestContextResolver.php:187` | `if ($languageId === null \|\| !Uuid::isValid($languageId)) { throw RoutingException::languageNotFound($languageId); }` |
| sw-version-id sets the context version id, defaulting to `Defaults::LIVE_VERSION`, read straight from the header | `Framework/Routing/ApiRequestContextResolver.php:95` | `'versionId' => $request->headers->get(PlatformRequest::HEADER_VERSION_ID),` |
| Version ids are created at `POST /api/_action/version/{entity}/{id}`, merged and deleted by sibling routes, which do validate the UUID | `Framework/Api/Controller/ApiController.php:113` | `#[Route(path: '/api/_action/version/{entity}/{id}', name: 'api.createVersion',` |
| sw-inheritance is a presence check — any value enables `considerInheritance` | `Framework/Routing/ApiRequestContextResolver.php:124` | `if ($request->headers->has(PlatformRequest::HEADER_INHERITANCE)) { $parameters['considerInheritance'] = true; }` |
| considerInheritance defaults to false and is what makes the DAL resolve parent values for `Inherited` fields | `Framework/DataAbstractionLayer/Dbal/EntityDefinitionQueryHelper.php:762` | `if (!$field->is(Inherited::class) \|\| !$context->considerInheritance()) {` |
| sw-skip-trigger-flow is parsed with FILTER_VALIDATE_BOOLEAN — only truthy values add `Context::SKIP_TRIGGER_FLOW` | `Framework/Routing/ApiRequestContextResolver.php:68` | `$skipTriggerFlow = filter_var($request->headers->get(PlatformRequest::HEADER_SKIP_TRIGGER_FLOW, 'false'), \FILTER_VALIDATE_BOOLEAN);` |
| FlowDispatcher still dispatches the event but returns before creating or executing any flow when the state is set | `Content/Flow/Dispatching/FlowDispatcher.php:52` | `\|\| $event->getContext()->hasState(Context::SKIP_TRIGGER_FLOW)) { return $event; }` |
| ImportExport sets the same state internally for its own bulk imports | `Content/ImportExport/ImportExport.php:115` | `$context->addState(Context::SKIP_TRIGGER_FLOW);` |
| For bulk writes via `POST /api/_action/sync`, three further headers control indexing: indexing-behavior, indexing-skip, indexing-only (the latter two comma-separated) | `Framework/Api/Controller/SyncController.php:45` | `$indexingSkips = array_values(array_filter(explode(',', (string) $request->headers->get(PlatformRequest::HEADER_INDEXING_SKIP, ''))));` |
| Only `disable-indexing` and `use-queue-indexing` are honoured as indexing-behavior; anything else is ignored | `Framework/Api/Sync/SyncService.php:53` | `&& \in_array($behavior->getIndexingBehavior(), [EntityIndexerRegistry::DISABLE_INDEXING, EntityIndexerRegistry::USE_INDEXING_QUEUE], true)` |
| Those literals and the `indexer-skip` / `indexer-only` context extensions | `Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:26` | `final public const USE_INDEXING_QUEUE = 'use-queue-indexing';\nfinal public const DISABLE_INDEXING = 'disable-indexing';` |
| sw-version-id, sw-language-id and sw-context-token are echoed back on the response | `Framework/Api/EventListener/ResponseHeaderListener.php:17` | `private const HEADERS = [PlatformRequest::HEADER_VERSION_ID, PlatformRequest::HEADER_LANGUAGE_ID, PlatformRequest::HEADER_CONTEXT_TOKEN];` |
| sw-include-search-info with value `0` adds `Criteria::STATE_DISABLE_SEARCH_INFO` (deprecated, default flips in 6.8) | `Framework/DataAbstractionLayer/Search/RequestCriteriaBuilder.php:90` | `// @deprecated tag:v6.8.0 - switch the default to 0` |
| sw-app-integration-id / sw-app-user-id change the resolved AdminApiSource only for a privileged caller | `Framework/Routing/ApiRequestContextResolver.php:134` | `if ($appIntegrationId !== '' && $this->userAppIntegrationHeaderPrivileged($userId, $appIntegrationId)) {` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| sw-skip-trigger-flow is a CORS-allowed header | absent | The CorsListener allow/expose list carries sw-language-id, sw-version-id, sw-inheritance, indexing-behavior, sw-include-seo-urls, sw-context-token, sw-access-key and the MCP headers — sw-skip-trigger-flow, indexing-skip and indexing-only are not listed, so a browser cross-origin call cannot send them — `Framework/Api/EventListener/CorsListener.php:50` |
| sw-inheritance accepts a boolean value | absent | No filter_var or value comparison for HEADER_INHERITANCE exists in core; `sw-inheritance: 0` enables inheritance — `Framework/Routing/ApiRequestContextResolver.php:124` |
| sw-version-id is validated | absent | The value goes into the context unchecked — no `Uuid::isValid`, no lookup, unlike sw-language-id and the `/api/_action/version/*` routes. A malformed id surfaces as a DAL/DBAL failure or an empty result — `Framework/Routing/ApiRequestContextResolver.php:95` |
| indexing-skip / indexing-only work on ordinary entity writes | absent | Outside tests the only readers are SyncController and IndexingController; plain POST/PATCH on `/api/{entity}` does not read them — `Framework/Api/Controller/IndexingController.php:35` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Absent sw-skip-trigger-flow leaves the state off; value `'true'` adds `Context::SKIP_TRIGGER_FLOW` | upstream trunk `tests/integration/Core/Framework/Routing/ApiRequestContextResolverTest.php` @ `ee66a4c` |
| Empty sw-language-id / sw-currency-id fall back to the system defaults rather than erroring | same file @ `ee66a4c` |
| An empty sw-app-integration-id is ignored; the source stays a plain AdminApiSource | same file @ `ee66a4c` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| _None found._ The lane ran eight searches (GitHub issues, rate-limited and retried narrower, plus web search) and returned `nothing-found`. | — | — | — |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Exact header spellings on 6.7 | `PlatformRequest.php:20` | sw-language-id, sw-currency-id, sw-inheritance, sw-version-id, sw-skip-trigger-flow, plus indexing-behavior / indexing-skip / indexing-only |
| Which of them the Admin API resolver actually reads | `Framework/Routing/ApiRequestContextResolver.php:55` | All the context headers, for every route under ApiRouteScope |
| Is sw-inheritance a presence check or a truthy value? | `ApiRequestContextResolver.php:124` | Presence only |
| What value does sw-skip-trigger-flow need, and does it apply beyond `/api/_action/sync`? | `ApiRequestContextResolver.php:68` | A FILTER_VALIDATE_BOOLEAN-truthy value; resolved for every `/api` route, not just sync |
| Does sw-version-id still switch the version context on 6.7? | `ApiRequestContextResolver.php:95` | Yes, defaulting to `Defaults::LIVE_VERSION`, unvalidated |
| Is indexing-behavior recognised, and with which values? | `Framework/Api/Sync/SyncService.php:53` | Yes on `/api/_action/sync`: only `disable-indexing` and `use-queue-indexing` |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The API returns entities in the system language by default; `sw-language-id` changes this | "By default, the API returns entities in the system language." | `integrations-api/request-headers.md` | yes — `ApiRequestContextResolver.php:114` |
| With `sw-language-id` set to a language lacking a translation, the plain field is `null`; use the nested `translated` object | "The resulting field `product.name` will be `null`." | `integrations-api/request-headers.md` | **not examined** — the code lane read the resolver, not translation field resolution |
| `sw-version-id` selects which version of an entity the API returns | "To tell the API which version to return, the header `sw-version-id` must be included" | `integrations-api/request-headers.md` | yes |
| Parent-child inheritance is off by default; sending `sw-inheritance` turns it on | "the header `sw-inheritance` must be sent along with the request" | `integrations-api/request-headers.md` | yes — and the code shows presence alone suffices |
| `sw-skip-trigger-flow` prevents flows from being triggered, shown on `POST /api/_action/sync` with value `1` | "you can pass the `sw-skip-trigger-flow` header" | `integrations-api/request-headers.md` | yes — and the code shows it is not limited to the sync route |
| `sw-currency-id` selects the currency for prices; `sw-include-seo-urls` adds SEO URLs | — | `integrations-api/request-headers.md` | header names confirmed at `PlatformRequest.php:20`; their effects were not the subject of this case |
| `sw-app-integration-id` / `sw-app-user-id` change permission resolution | "It overrides the default behavior and uses the privileges provided by the app." | `integrations-api/request-headers.md` | yes, with the code-shown restriction that the caller must be privileged — `ApiRequestContextResolver.php:134` |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The page shows `sw-inheritance: 1` and never states which values count as "set" | Presence alone enables inheritance — `sw-inheritance: 0` or `false` also enables it, and there is no way to switch it off by value | `Framework/Routing/ApiRequestContextResolver.php:124` |
| `sw-skip-trigger-flow` is presented as a sync-API header, with value `1` | It is resolved for every `/api` route by the context resolver, and its value is parsed with FILTER_VALIDATE_BOOLEAN, so `false` / `0` leave flows enabled | `Framework/Routing/ApiRequestContextResolver.php:68` |
| No page states that `sw-version-id` is validated or what happens to a malformed value | The header is taken unchecked, in contrast with `sw-language-id`, which throws `languageNotFound` | `Framework/Routing/ApiRequestContextResolver.php:95`, `:187` |
| No page mentions CORS restrictions on these headers | `sw-skip-trigger-flow`, `indexing-skip` and `indexing-only` are absent from the CORS allow list, so a browser cross-origin request cannot send them | `Framework/Api/EventListener/CorsListener.php:50` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| `sw-language-id returns entities in a specific language, and a translatable plain field stays null unless an explicit translation exists — use the nested translated object for display.` | rewritten | The header's effect is confirmed (`ApiRequestContextResolver.php:114`), but the null-plain-field clause is an unconfirmed doc claim about translation field resolution, which no code finding covers; it is behaviour, not intent, so it does not enter as `[docs-only]`. Replaced with the code-shown fallback chain, the system-language default and the `languageNotFound` error, and merged with the `sw-version-id` statement |
| `sw-inheritance: 1 makes the API consider parent-child inheritance (e.g. product variants), and sw-version-id selects the entity version to return.` | rewritten | Both halves confirmed, but the code shows `sw-inheritance` is a bare presence check — `0` and `false` also enable it (`ApiRequestContextResolver.php:124`), which the `: 1` phrasing hides. `sw-version-id` moved into fact 1 with the code-shown absence of validation |
| `sw-skip-trigger-flow: 1 skips flow triggers during bulk imports via POST /api/_action/sync.` | rewritten | Confirmed, but two code-shown points were missing: the value is parsed with FILTER_VALIDATE_BOOLEAN, so a falsy value leaves flows enabled (`ApiRequestContextResolver.php:68`), and the header is resolved for every `/api` route rather than only the sync route (`ApiRequestContextResolver.php:55`) |
