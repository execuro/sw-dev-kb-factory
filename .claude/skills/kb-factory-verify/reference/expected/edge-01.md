# `edge-01` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `edge-01` · `edge` · `Trap` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-82-91` |
| Core version | `6.7.13.0` |

**Query:** How do I configure Shopware 6's built-in GraphQL API for the Store API?

**Expected answer — every fact an answer must contain:**

1. States plainly that Shopware 6 ships no GraphQL API in either 6.6 or 6.7: no GraphQL route, route scope, schema generator or configuration key exists in core, storefront or administration, and no GraphQL library is installed. `[code: absent — Framework/Api/ApiDefinition/Generator/ contains only OpenAPI/entity-schema generators]`
2. Names the real interface: the Store API is a plain HTTP/REST API served by Symfony routes under the `store-api` route scope, whose paths are prefixed `/store-api/...`. `[code: Framework/Routing/StoreApiRouteScope.php:15-18]`
3. Invents no configuration step, flag, bundle or package for GraphQL, and if it names a machine-readable schema it names OpenAPI 3 — the only format Shopware generates for the Store API (`StoreApiGenerator::FORMAT = 'openapi-3'`, exposed at `/api/_info/openapi3.json`). `[code: Framework/Api/ApiDefinition/Generator/StoreApiGenerator.php:33]`

**Trap:** There is no GraphQL API; the Store API is REST/JSON with an OpenAPI schema.

**Official reference URL:** none — this feature does not exist, so there is nothing to cross-check. A discover agent that invents setup steps for it has fabricated content and fails this case regardless of source.
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Store API routes are Symfony routes carrying the `store-api` route scope, under `/store-api/...` | `Content/Product/SalesChannel/Listing/ProductListingRoute.php:29,58-60` | `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])] … path: '/store-api/product-listing/{categoryId}'` |
| The Store API scope is the literal `store-api` and allows only that path prefix | `Framework/Routing/StoreApiRouteScope.php:15-18` | `final public const ID = 'store-api';` / `final public const ALLOWED_PATH = 'store-api';` |
| The only schema format generated for the Store API is OpenAPI 3 | `Framework/Api/ApiDefinition/Generator/StoreApiGenerator.php:33-60` | `final public const FORMAT = 'openapi-3';` |
| Schema discovery is an OpenAPI JSON route | `Framework/Api/Controller/InfoController.php:68-69` | `path: '/api/_info/openapi3.json'` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Shopware 6 ships a configurable built-in GraphQL API | absent | Case-insensitive recursive grep for `graphql` over `vendor/shopware/{core,storefront,administration}` returns one file only: a minified admin JS bundle containing a highlight.js syntax definition (`name:"GraphQL",aliases:["gql"]`). No PHP class, route, controller, service, bundle or config key. `grep -i graphql` over `vendor/shopware/*/composer.json`, `Framework/Resources/config/` and `composer.lock` returns nothing — no GraphQL library is installed. |
| A GraphQL endpoint, schema, resolver or route scope exists in 6.6 | absent | GitHub code search `graphql repo:shopware/shopware path:src/Core` returns `total_count: 0`. |
| A GraphQL schema generator exists alongside `StoreApiGenerator` | absent | `Framework/Api/ApiDefinition/Generator/` contains only `BundleSchemaPathCollection.php`, `CachedEntitySchemaGenerator.php`, `EntitySchemaGenerator.php`, `OpenApi/`, `OpenApi3Generator.php`, `OpenApiFileLoader.php`, `Schema/`, `StoreApiGenerator.php`. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _none recorded_ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Shopware's own SwagGraphQL is a POC for "a very early Shopware 6.0 state", unmaintained, repo archived read-only 2024-08-07 | 6.0 POC, untested on 6.6/6.7 | closed | https://github.com/shopwareArchive/SwagGraphQL |
| SwagGraphQLMesh is a separate Shopware Labs experiment, not a core feature | unclear | open | https://github.com/shopwareLabs/SwagGraphQLMesh |
| Vendor write-ups state Shopware has no official GraphQL API and point at the community POC | unclear | open | https://solution25.com/en/understanding-graphql-and-rest-apis-in-shopware/ |
| 6.7 Store API contract work is JSON/OpenAPI-schema driven, no GraphQL mentioned | 6.7 | open | https://github.com/shopware/shopware/issues/15270 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Any GraphQL schema, resolver or graphql-php dependency in 6.6/6.7 source? | code lane absence check + GitHub search over `src/Core` | None. Not installed, not referenced. |
| Any bundle or config key toggling a GraphQL endpoint? | code lane grep over `Framework/Resources/config/` and composer manifests | None. |
| Does the 6.7 Store API contract generator emit only OpenAPI/JSON? | code lane `StoreApiGenerator.php:33-60` and generator directory listing | Yes — OpenAPI 3 only. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Shopware exposes exactly two functional APIs, neither named GraphQL | "Two functional APIs are available… **Store API**… **Admin API**" | `developer/concepts/api/index.md` | yes — Store API scope and routes exist; no GraphQL surface exists |
| Both APIs use HTTP and exchange JSON payloads | "Both APIs use HTTP and exchange JSON payloads." | `developer/concepts/api/index.md` | yes — Symfony HTTP routes under `/store-api/` |
| The Store API exposes business logic as HTTP routes consumed as JSON, documented via a REST-style reference | "Core business logic is exposed through HTTP routes…" | `developer/concepts/api/store-api.md` | yes |
| No documentation page is named for GraphQL | absence established by `Glob` over both clones plus a live re-read of the concepts/API page | `developer/concepts/api/index.md` | consistent with code |

Doc-lane caveat: the clones are gitignored, so that lane's recursive `Grep` returned nothing corpus-wide. Its absence-of-a-*page* finding rests on `Glob` plus live re-fetch and stands; absence of an incidental *mention* inside an unread page is not established. The lane also recorded that a Composable Frontends CMS-integration page mentions an adapter calling "a REST API, GraphQL API, SDK, or internal service" — that wording is about the third-party CMS the adapter talks to, not a Shopware GraphQL API, and it does not bear on the facts.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| _none — the documentation and the code agree that the Store API is HTTP/JSON and that no GraphQL API exists_ | — | — |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States plainly that Shopware has no built-in GraphQL API (nothing found in the source). | rewritten | Same conclusion, now backed by a code absence check over both the installed 6.7 tree and the upstream 6.6/trunk source, and the version scope is stated. |
| Names the real interface — the REST/JSON Store API (`/store-api/...`), optionally citing the Store API concept page if read. | rewritten | The "optionally citing … if read" clause is a tolerance clause; removed. The route scope and path prefix are now the checkable content. |
| Invents no configuration steps, flags or packages. | rewritten | Kept, and extended with the one schema format code actually generates (OpenAPI 3) so an answer naming an "introspection endpoint" fails. |
