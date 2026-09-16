# `gap-08` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `gap-08` · `gap` · `Gap` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-92-100` |
| Core version | `6.7.13.0` |

**Query:** How do I set up a Nuxt project with Shopware Composable Frontends against my shop's Store API — endpoint, access token, and why do I get HTTP 412?

**Expected answer — every fact an answer must contain:**

1. States that the corpus has no Composable Frontends setup guide — no Nuxt module configuration, no endpoint or access-token instructions, and no page mentioning 412 — because that material lives on the separate `developer.shopware.com/frontends/` site, which is not part of the ingested docs; the only Composable Frontends page in the corpus covers PaaS Native deployment.  `[docs-only]`
2. Names only what the corpus really holds as related material — the Store API concept page (which defers to the external reference) and the `sw-access-key` / `GET /store-api/context` material in the integrations-API flow and B2B Suite pages — and states no `nuxt.config.ts` option or env-var name as documented.  `[docs-only]`
3. Does not present a 412 explanation as documented. If it explains 412 at all, it must match the code (verified in 6.7.13.0): the Store API lives under `/store-api`, authenticates a sales-channel access key in the `sw-access-key` header, and returns 412 `FRAMEWORK__ROUTING_SALES_CHANNEL_NOT_FOUND` when that key is well-formed but is not a sales-channel key or matches no **active** sales channel — a missing header is 401 and a malformed key is 403, not 412.  `[code: Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:70-125]`

**Official reference URL:** https://developer.shopware.com/frontends/resources/troubleshooting.html — outside the ingested corpus
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The Store API path prefix is `/store-api` | `Framework/Routing/StoreApiRouteScope.php:15-18` | `final public const ALLOWED_PATH = 'store-api';` |
| Concrete route shape | `System/SalesChannel/SalesChannel/ContextRoute.php:21` | `#[Route(path: '/store-api/context', name: 'store-api.context', methods: ['GET'])]` |
| The access token is the sales-channel access key in the `sw-access-key` header | `PlatformRequest.php:18-21` | `public const HEADER_ACCESS_KEY = 'sw-access-key';` |
| The key is the Required `access_key` field on the sales channel | `System/SalesChannel/SalesChannelDefinition.php:131` | `(new StringField('access_key', 'accessKey'))->addFlags(new Required())` |
| Sales-channel keys are prefixed `SWSC`; other prefixes are user/integration/product-export | `Framework/Api/Util/AccessKeyHelper.php:12-25` | `private const SALES_CHANNEL_IDENTIFIER = 'SWSC';` |
| 412 is `SalesChannelNotFoundException`, code `FRAMEWORK__ROUTING_SALES_CHANNEL_NOT_FOUND` | `Framework/Routing/Exception/SalesChannelNotFoundException.php:15-28` | `return Response::HTTP_PRECONDITION_FAILED;` |
| Three throw sites: wrong key origin, no matching row, empty id | `Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:78-82,113-125` | `if ($origin !== 'sales-channel') { throw ApiException::salesChannelNotFound(); }` |
| The lookup requires `active = 1` — a correct key on a deactivated channel is 412 | `Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:100-111` | `->where('sales_channel.access_key = :accessKey')->andWhere('sales_channel.active = :active')` |
| A missing `sw-access-key` header is 401, not 412 | `Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:70-76` | `throw ApiException::unauthorized('header', sprintf('Header "%s" is required.', …));` |
| A malformed key (unknown prefix) is 403 | `Framework/Api/ApiException.php:381-388` | `Response::HTTP_FORBIDDEN, self::API_INVALID_ACCESS_KEY_EXCEPTION` |
| Maintenance mode is 503, not 412 | `Framework/Api/ApiException.php:399-406` | `Response::HTTP_SERVICE_UNAVAILABLE, self::API_SALES_CHANNEL_MAINTENANCE_MODE` |
| Further 412s after authentication: invalid or unavailable `sw-language-id`, invalid `sw-currency-id` | `System/SalesChannel/Context/ContextFactory.php:100-109`, `System/SalesChannel/SalesChannelException.php:144-151,193-198` | `throw SalesChannelException::providedLanguageNotAvailable($current, $availableLanguageIds);` |
| Hitting a non-Store-API-scoped route under `/store-api` is also 412 | `Framework/Routing/Exception/InvalidRouteScopeException.php:15-23` | `Response::HTTP_PRECONDITION_FAILED, parent::INVALID_ROUTE_SCOPE` |
| `sw-context-token` is optional for most routes; when required its absence is 400 | `Framework/Routing/SalesChannelRequestContextResolver.php:44-50` | `$request->headers->set(PlatformRequest::HEADER_CONTEXT_TOKEN, Random::getAlphanumericString(32));` |
| Browser calls work out of the box: CORS is answered with `Access-Control-Allow-Origin: *` | `Framework/Api/EventListener/CorsListener.php:48-69` | `$response->headers->set('Access-Control-Allow-Origin', '*');` |
| A headless sales-channel type id exists | `Defaults.php:27` | `public const SALES_CHANNEL_TYPE_API = 'f183ee5650cf4bdb8a774337575067a6';` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Shopware core contains anything about Nuxt / Composable Frontends project setup | absent | `vendor/shopware` holds only core, storefront, administration, deployment-helper; a case-insensitive grep for `composable` returns nothing. Composable Frontends lives in the separate `shopware/frontends` JS repository, so no PHP source can confirm or contradict its config keys |
| 412 means "missing access token" | absent | Missing header is 401, malformed key is 403 — `Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:70-82` |
| A CORS configuration step is needed on the Shopware side | absent | `CorsListener` is registered unconditionally and hard-codes `*`; no origin allow-list parameter exists — `Framework/DependencyInjection/api.xml:17` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| The listener names its own integration test (stripped from the dist package) | `Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:29` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Frontends troubleshooting page frames 412 as "the specified accessToken is incorrect"; also documents CORS and the `createShopwareContext` unimport error | 6.6 + 6.7 era | open | https://developer.shopware.com/frontends/resources/troubleshooting.html |
| Breaking change: `shopwareEndpoint` must point exactly at `/store-api/`, not the shop root | frontends major | open | https://github.com/shopware/frontends/discussions/965 |
| Forum: 412 persisted until the sales-channel access key was used instead of integration credentials | 6.x | closed | https://forum.shopware.com/t/shopware6-store-api-aufruf-412-error-precondition-failed/105494 |
| At least three naming schemes for the Nuxt option/env names in circulation (`endpoint`/`accessToken`, `shopwareEndpoint`/`shopwareAccessToken`, `NUXT_PUBLIC_SHOPWARE_SHOPWARE_*`) | 2024 onwards | closed | https://github.com/shopware/frontends/issues/665, /issues/1682 |
| Starter-template installs themselves broke (workspace URL / babel errors) | 2026-04/05 | closed | https://github.com/shopware/frontends/issues/2431 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Which class produces 412 for a bad `sw-access-key`, and with what error code? | code | `SalesChannelAuthenticationListener` → `SalesChannelNotFoundException`, `FRAMEWORK__ROUTING_SALES_CHANNEL_NOT_FOUND`. Fact 3 |
| Is a valid key on an inactive channel also 412? Is a missing/malformed key? | code | Inactive → 412; missing header → 401; malformed → 403. Fact 3 |
| Where does the key live, and is a headless sales channel required? | code | `sales_channel.access_key`; any active sales channel's `SWSC` key authenticates — the headless type id exists but is not a precondition |
| Does core ship CORS for `/store-api`? | code | Yes, `Access-Control-Allow-Origin: *`, unconditional |
| Authoritative `@shopware/nuxt-module` option names and whether the endpoint needs `/store-api/` | not settled — out of repository | The JS packages are outside the corpus and outside core. No fact asserts an option name; fact 2 forbids stating one as documented |
| Does the 6.6 authentication listener differ from 6.7? | not settled | Only 6.7.13.0 was read. Fact 3 therefore states the 412 semantics as verified for 6.7.13.0 rather than for both pins |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| 412 "usually means … the specified `accessToken` is incorrect or not correct for the specified `endpoint`" | as quoted | https://developer.shopware.com/frontends/resources/troubleshooting.html (live, outside the corpus) | partially — code shows 412 covers a key of the wrong origin, an inactive/absent sales channel, an invalid language/currency id and a wrong route scope; a *missing* key is 401 and a malformed one 403 |
| Shop connection is configured under `runtimeConfig.public.shopware` with `endpoint` and `accessToken` | "endpoint: \"https://your-shop.shopware.store/store-api\", accessToken: \"your-access-token\"," | https://developer.shopware.com/frontends/introduction/templates/vue-starter-template.html (live, outside the corpus) | unconfirmable — nothing in core relates to Nuxt config |
| Env equivalents `NUXT_PUBLIC_SHOPWARE_ENDPOINT` / `NUXT_PUBLIC_SHOPWARE_ACCESS_TOKEN` | as quoted | same page | unconfirmable — and community reports at least two other naming schemes |
| The Store API access key is found in the Administration when editing a sales channel | "**`sw-access-key`**: The access key for the Store API can be found in the Administration when editing a SalesChannel." | `products/extensions/b2b-suite/guides/core/store-api.md` | yes — `sales_channel.access_key` |
| Store API requests use `sw-access-key`, not `sw-access-token`; `/store-api/context` is called with GET | as quoted | `guides/development/integrations-api/flows/create-product.md` | yes — `PlatformRequest.php:18-21`, `ContextRoute.php:21` |
| Composable Frontends is Shopware's headless frontend implementation based on the Store API | "Shopware provides [Composable Frontends](/frontends/) as a headless frontend implementation based on the Store API." | `concepts/api/store-api.md` | n/a — defers to the external site |

Docs coverage verdict: **split**. Inside the ingested corpus the topic is **not covered** — the only Composable Frontends page is a PaaS Native deployment guide and the Store API concept page defers to an external reference; a grep for `412` across the developer clone returns no match. The topic *is* covered on the separate `developer.shopware.com/frontends/` site, which is in neither clone; the docs lane fetched those pages live, so their quotes are not from a pinned snapshot and they carry no Shopware version. That is why the facts above are scoped to the corpus.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The frontends troubleshooting page attributes 412 solely to a wrong or mismatched `accessToken` | 412 has at least four distinct causes: a well-formed key of the wrong origin, no matching **active** sales channel, an invalid or unavailable `sw-language-id` / `sw-currency-id`, and a wrong route scope. A missing key is 401; a malformed key is 403; maintenance mode is 503 | `Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:70-125` |
| No corpus page mentions that CORS needs handling for a local Nuxt dev server | Core answers preflights unconditionally with `Access-Control-Allow-Origin: *`; note `sw-currency-id` is absent from the allowed-header list while `sw-language-id` is present | `Framework/Api/EventListener/CorsListener.php:48-69` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States that the source has no Composable Frontends setup guide (no Nuxt module configuration, endpoint or access-token instructions) and that the closest page only covers PaaS deployment. | rewritten | Confirmed by the docs lane, but scoped explicitly to the ingested corpus and extended with the reason (the material lives on the separate frontends site) and with the fact that no corpus page mentions 412 at all. |
| Names the Store API concept page or the sales-channel/API-access material actually read as the only related content, without inventing Nuxt configuration keys. | rewritten | The docs lane found more related corpus material than the old fact allowed for — the integrations-API flow page documents `sw-access-key` and `GET /store-api/context`, and a B2B Suite page says where the key is found. The Nuxt-key prohibition is kept and sharpened to "as documented". |
| Does not explain the 412 error from memory as if it were documented. | rewritten | Kept the prohibition, but the code lane settled what 412 actually is, so the fact now also requires any explanation given to match the code. Without that, an answer could satisfy the old fact while stating the common wrong cause ("missing access token", which is in fact 401). |
