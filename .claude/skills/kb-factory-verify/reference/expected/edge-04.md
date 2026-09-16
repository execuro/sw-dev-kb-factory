# `edge-04` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `edge-04` · `edge` · `Trap` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-82-91` |
| Core version | `6.7.13.0` |

**Query:** How do I fetch products with `GET /sales-channel-api/v3/product` on Shopware 6.7?

**Expected answer — every fact an answer must contain:**

1. States that no `/sales-channel-api` route exists in 6.6 or 6.7 and that no alias or redirect maps it onto the Store API — the customer-facing surface is the Store API, whose route scope allows the single path `store-api`.  `[code: Framework/Routing/StoreApiRouteScope.php:15-19]`
2. Gives the product listing endpoint as `GET|POST /store-api/product` (route `store-api.product.search`), with no `/v3/` or any other version segment, and states this is the same path on 6.6 and on 6.7.  `[code: Content/Product/SalesChannel/ProductListRoute.php:35-40]`
3. States that the call is authenticated with the `sw-access-key` header carrying the sales channel access key; a missing header raises an unauthorized API exception.  `[code: Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:71-75]`

**Trap:** The query's path is doubly obsolete — both the `sales-channel-api` prefix and the `/v3/` version segment. Neither exists in 6.6 or 6.7; an answer that explains "how to call it" is wrong.

**Official reference URL:** https://developer.shopware.com/docs/concepts/api/store-api.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Product list endpoint is `GET\|POST /store-api/product`, route `store-api.product.search`, no version segment | `Content/Product/SalesChannel/ProductListRoute.php:35-40` | `#[Route(path: '/store-api/product', name: 'store-api.product.search', methods: [GET, POST], …)]` |
| The sales-channel-facing route scope is `store-api` and the only path it allows is `store-api` | `Framework/Routing/StoreApiRouteScope.php:15-19` | `final public const ID = 'store-api'; final public const ALLOWED_PATH = 'store-api';` |
| ProductListRoute is bound to the store-api scope at class level | `Content/Product/SalesChannel/ProductListRoute.php:17` | `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])]` |
| Store API auth uses the `sw-access-key` header; missing header → unauthorized | `Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:71-75` | `throw ApiException::unauthorized(… 'Header "%s" is required.', PlatformRequest::HEADER_ACCESS_KEY)` |
| The header constant is `sw-access-key` | `PlatformRequest.php:19` | `public const HEADER_ACCESS_KEY = 'sw-access-key';` |
| `sales-channel` survives only as a Context source discriminator, not as a URL prefix | `Framework/Api/Context/ContextSource.php:8` | `#[DiscriminatorMap(… 'sales-channel' => SalesChannelApiSource::class …)]` |
| 6.6 (tag v6.6.10.0) already exposes the same `/store-api/product` path | `github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Content/Product/SalesChannel/ProductListRoute.php` | `#[Route(path: '/store-api/product', name: 'store-api.product.search', …)]` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A `/sales-channel-api/v3/product` endpoint on 6.6 or 6.7 | absent | Grep for `sales-channel-api` across `vendor/shopware/` returns only the ContextSource DiscriminatorMap, the AdminSalesChannelApiSource type string and prose comments; no route, scope or controller declares such a path. GitHub code search for `"sales-channel-api/v3"` in shopware/shopware returns 0 results. |
| Any `/vN/` version segment in 6.7 API routes | absent | `ApiRouteScope` allows only `api` (plus `sw-domain-hash.html`), `StoreApiRouteScope` only `store-api`; Grep `/v3/` across `Framework/`, `Content/`, `System/` returns nothing (`Framework/Routing/ApiRouteScope.php:15-18`). |
| An alias or redirect mapping sales-channel-api paths onto store-api | absent | No alias/redirect route in either tree; v6.6.10.0 `ProductListRoute` declares one path and no second Route attribute. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Store API test helper builds a storefront sales channel with an access key, not a versioned URL | `Framework/Test/TestCaseBase/SalesChannelApiTestBehaviour.php:186` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| UPGRADE-6.3 notes announce the Sales Channel API deprecated in favour of the Store API, removal scheduled for 6.4.0.0 | 6.3 → 6.4 | closed | https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.3.md |
| Archived Shopware PWA README still says it talks "through the SalesChannel-API", keeping the obsolete name in circulation | unclear | closed | https://github.com/vuestorefront/shopware-pwa |
| Forum threads: 404s after upgrade traced to legacy/wrong base paths | 6.4 | open | https://forum.shopware.com/t/api-migration-from-5-4-to-6-4-3-0-not-working/89767 |
| Store API 404s also have unrelated causes (route attribute removed from a decorator) | 6.6 / 6.7 | closed | https://github.com/shopware/shopware/issues/17552 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does any 6.7 route still register a `/sales-channel-api` path? | code lane, Grep over `vendor/shopware/` | No. Only the ContextSource discriminator string survives. |
| Is there a redirect/alias/BC shim mapping the old path onto `/store-api/product`? | code lane, both trees + v6.6.10.0 | None found. |
| Is the 6.7 product listing route GET or POST, and does it carry a version segment? | `Content/Product/SalesChannel/ProductListRoute.php:35-40` | `GET` and `POST`; no version segment. |
| Does the route require `sw-access-key`? | `SalesChannelAuthenticationListener.php:71-75` | Yes; missing header → unauthorized exception. |
| What exactly does UPGRADE-6.4.md say about the removal? | not settled | No lane read UPGRADE-6.4.md; the release in which the prefix was dropped is not pinned from source. Not load-bearing: absence in both 6.6 and 6.7 is established. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The docs know exactly two HTTP APIs, Store API and Admin API; no `sales-channel-api` | "Two functional APIs are available … **Store API** … **Admin API**" | `developer/concepts/api/index.md` | yes — no sales-channel-api route exists |
| The product endpoint is called as `/store-api/product` with a `sw-access-key` header | `curl -s "http://127.0.0.1:8000/store-api/product" -H "sw-access-key: YOUR_ACCESS_KEY"` | `developer/guides/development/integrations-api/index.md` | yes |
| API versioning in the URL was removed: `/api/v{VERSION}/product` → `/api/product` | "All route URLs are changed from `/api/v{VERSION}/product` to `/api/product`." | `developer/resources/references/adr/2020-12-02-removing-api-version.md` | partly — code confirms no version segment exists; the release pin is not confirmable from source |
| Versioned and unversioned URLs coexisted only between 6.3.5.0 and 6.4.0.0 | "Beginning with 6.3.5.0 both route URLs are accessible … before and until the release of 6.4.0.0" | same ADR | not confirmed — no changelog in the dist tree |
| The only pages mentioning `sales-channel-api` are 2020 ADRs treating it as a live API | "Some routes for the sales-channel-api and the store-api depend on a sales-channel-context-token" | `developer/resources/references/adr/2020-07-02-implement-sales-channel-context-token-requirement.md` | contradicted for 6.6/6.7 — the API no longer exists |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The 2020 ADRs still present `sales-channel-api` as a live API alongside `store-api`, and no current page states when or how it was removed | No route, scope or controller under `/sales-channel-api` exists in 6.6 or 6.7; the string survives only as a Context source discriminator | `Framework/Api/Context/ContextSource.php:8` |
| The versioning ADR pins the change to 6.3.5.0 / 6.4.0.0 | Source shows only that no version segment exists in 6.6 or 6.7; the dist tree carries no changelog to pin the release | `Framework/Routing/ApiRouteScope.php:15-18` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States that the version segment was removed from API routes starting with 6.4.0.0 (`/api/v3/...` → `/api/...`), so `/v3/` routes do not exist on 6.6/6.7. | rewritten | The `6.4.0.0` pin comes from a 2020 ADR and is not confirmable from source (no changelog in the dist tree). The load-bearing, code-backed part — no version segment in 6.6 or 6.7 — is kept in fact 2. |
| States that the customer-facing endpoints are the Store API under `/store-api/...` (no `/sales-channel-api/` in current docs). | rewritten | Kept and strengthened: the basis is the route scope and the route attribute, not the absence of the term from the docs; the absence of an alias/redirect is added. |
| Invents no `/sales-channel-api` route or version prefix for 6.7. | merged into fact 1 | The absence is now stated positively with its code citation rather than as a meta-requirement on the answer. |
| _(new)_ | added | The `sw-access-key` requirement: without it a caller cannot tell a wrong path from a rejected call, which is the practical part of the answer. |
