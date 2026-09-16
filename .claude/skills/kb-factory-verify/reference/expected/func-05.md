# `func-05` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `func-05` · `func` · `Merchant` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-1011-find-cases-that-are-not` |
| Core version | `6.7.13.0` |

**Query:** How do I set up a sales channel — storefront versus headless type, domains, languages and currencies — and where do I get its API access key?

**Expected answer — every fact an answer must contain:**

1. The channel type is a hardcoded type UUID on the sales channel; 6.7.13.0 ships four — Storefront, API (headless), Product comparison and Agentic commerce. The type does not relax any requirement: `typeId`, `languageId`, `customerGroupId`, `currencyId`, `paymentMethodId`, `shippingMethodId`, `countryId`, `navigationCategoryId` and `accessKey` are Required for every type, languages/currencies/countries/payment/shipping are many-to-many sets on top of those single defaults, and the default language must be a member of the assigned language list (`SYSTEM__NO_GIVEN_DEFAULT_LANGUAGE_ID`, `SYSTEM__CANNOT_DELETE_DEFAULT_LANGUAGE_ID`) for all four types. `[code: Defaults.php:27-33; System/SalesChannel/SalesChannelDefinition.php:108-117,131,141-146; System/SalesChannel/Validation/SalesChannelValidator.php:31-41,118-126]`
2. A domain binds one URL to exactly one language, one currency and one snippet set — all Required on `sales_channel_domain` — so several languages or currencies mean several domains, not one domain with a list. Only Storefront-type channels are served by the storefront: the domain loader inner-joins `sales_channel_domain` and `snippet_set` and filters on `type_id = SALES_CHANNEL_TYPE_STOREFRONT AND sales_channel.active`. A headless channel needs no domain at all; its clients pick language and currency per request with the `sw-language-id` / `sw-currency-id` headers. `[code: System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:63-67; Storefront/Framework/Routing/DomainLoader.php:76-84; PlatformRequest.php:20-21]`
3. The API access key is the channel's own `access_key` column, sent in the `sw-access-key` header on every store-api request that does not opt out with `auth_required=false`; it is prefixed `SWSC` (any other origin is rejected with `salesChannelNotFound` before the database is queried) and, unlike a user or integration key, it has **no** secret counterpart. It is not generated automatically on write: a fresh value is fetched from `GET /api/_action/access-key/sales-channel` and written to the channel. Resolution is a direct SQL lookup on `sales_channel.access_key` that also enforces maintenance mode and the IP allowlist. `[code: PlatformRequest.php:19; Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:59-113; Framework/Api/Util/AccessKeyHelper.php:13-16,27-34; Framework/Api/Controller/AccessKeyController.php:45-55]`

**Trap:** The preinstalled Headless sales channel should not be deleted — extensions including the B2B Suite depend on it `[docs-only]`; and the merchant page's `TRUSTED_PROXIES` remark is the only place the credential is called an "API Access ID", while code and developer docs call it the access key.

**Official reference URL:** https://docs.shopware.com/en/shopware-6-en/settings/saleschannel
<!-- expected:end -->

## Evidence — code (decisive)

Paths are relative to `vendor/shopware/core`, except `Storefront/…` which is relative to `vendor/shopware/storefront`.

| fact | citation | excerpt |
| --- | --- | --- |
| Four sales channel type constants | `Defaults.php:27-33` | `SALES_CHANNEL_TYPE_API` … `SALES_CHANNEL_TYPE_STOREFRONT` … `SALES_CHANNEL_TYPE_PRODUCT_COMPARISON` … `SALES_CHANNEL_TYPE_AGENTIC_COMMERCE` |
| Full set of required defaults, independent of type | `System/SalesChannel/SalesChannelDefinition.php:108-117,131` | `(new FkField('navigation_category_id', …))->addFlags(new ApiAware(), new Required())` / `(new StringField('access_key', 'accessKey'))->addFlags(new Required())` |
| Many-to-many sets on top of the scalar defaults | `System/SalesChannel/SalesChannelDefinition.php:141-146` | `new ManyToManyAssociationField('currencies', …), new ManyToManyAssociationField('languages', …), new ManyToManyAssociationField('countries', …)` |
| Default language must be in the language list | `System/SalesChannel/Validation/SalesChannelValidator.php:31-41` | `SYSTEM__NO_GIVEN_DEFAULT_LANGUAGE_ID` / `SYSTEM__CANNOT_DELETE_DEFAULT_LANGUAGE_ID` |
| …for all four types | `System/SalesChannel/Validation/SalesChannelValidator.php:118-126` | `return $typeId === Defaults::SALES_CHANNEL_TYPE_STOREFRONT \|\| … SALES_CHANNEL_TYPE_AGENTIC_COMMERCE;` |
| A domain pins url + language + currency + snippet set | `System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:63-67` | All four fields carry `new Required()` |
| Storefront serves only active Storefront-type channels with a domain and snippet set | `Storefront/Framework/Routing/DomainLoader.php:76-84` | `$query->where('sales_channel.type_id = UNHEX(:typeId)'); $query->andWhere('sales_channel.active');` |
| Trailing slash is normalised in domain matching | `Storefront/Framework/Routing/DomainLoader.php:58-59` | `CONCAT(TRIM(TRAILING '/' FROM domain.url), '/')` |
| Access key header and its enforcement | `PlatformRequest.php:19`; `Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:59-89` | `HEADER_ACCESS_KEY = 'sw-access-key'` / `if (!$request->attributes->get('auth_required', true)) { return; }` |
| `SWSC` prefix decides the key origin | `Framework/Api/Util/AccessKeyHelper.php:13-16,20-24,36-45`; listener `:80-84` | `SALES_CHANNEL_IDENTIFIER = 'SWSC'` / `if ($origin !== 'sales-channel') { throw ApiException::salesChannelNotFound(); }` |
| No secret counterpart for a sales channel key | `Framework/Api/Util/AccessKeyHelper.php:27-34`; `Framework/Api/Controller/AccessKeyController.php:45-55` | `return new JsonResponse(['accessKey' => AccessKeyHelper::generateAccessKey('sales-channel')]);` |
| Where a fresh key comes from | `Framework/Api/Controller/AccessKeyController.php:45-55` | `path: '/api/_action/access-key/sales-channel'`, `methods: [Request::METHOD_GET]` |
| Key resolves the channel by SQL and enforces maintenance mode | `Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:86-113` | `$this->handleMaintenanceMode($request, $salesChannelData);` / `->where('sales_channel.access_key = :accessKey')` |
| Headless clients choose language/currency per request | `PlatformRequest.php:20-21` | `HEADER_LANGUAGE_ID = 'sw-language-id'; HEADER_CURRENCY_ID = 'sw-currency-id';` |
| The admin proxy reuses the channel's own key | `Framework/Api/Controller/SalesChannelProxyController.php:292` | `$subrequest->headers->set(PlatformRequest::HEADER_ACCESS_KEY, $salesChannel->getAccessKey());` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| The access key is generated automatically when a sales channel is written | absent | `getDefaults()` supplies only `taxCalculationType` and `homeEnabled`; `access_key` is Required with no default and no generating subscriber — `System/SalesChannel/SalesChannelDefinition.php:91-97,131` |
| A headless sales channel needs a domain | absent | Domains are required only by storefront routing; the store-api resolves the channel from the access key — `Storefront/Framework/Routing/DomainLoader.php:76-84` |
| A sales channel key has a secret access key like an integration | absent | Only the user and integration endpoints return `secretAccessKey` — `Framework/Api/Controller/AccessKeyController.php:45-55` vs `:27-42` |
| The type restricts which fields must be filled | absent | All Required flags are unconditional; a headless channel still needs `navigationCategoryId`, `countryId`, `paymentMethodId`, `shippingMethodId` — `System/SalesChannel/SalesChannelDefinition.php:108-118` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| How core tests create a channel and authenticate against the store-api | `Framework/Test/TestCaseBase/SalesChannelApiTestBehaviour.php:188,284` |
| The storefront's failure mode when no domain matches the host | `Storefront/Framework/Routing/DomainNotMappedListener.php:33` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| 'Copy API key' button does not work without a secure clipboard context | 6.7.8.0 | closed | https://github.com/shopware/shopware/issues/15624 |
| Product comparison channel creation fails with `SYSTEM__NO_GIVEN_DEFAULT_CURRENCY_ID` | 6.7.14.0 trunk | closed | https://github.com/shopware/shopware/issues/20111 |
| Product comparison channel save fails with `SYSTEM__CANNOT_UPDATE_DEFAULT_LANGUAGE_ID` | 6.7 | closed | https://github.com/shopware/shopware/issues/19322 |
| Agentic Commerce channel cannot be saved; shows unused Country fields in cloud | 6.7 | closed | https://github.com/shopware/shopware/issues/19348 |
| Language switch redirects unpredictably when several domains share a language (domains sorted by UUID) | 6.7 era | open | https://github.com/shopware/shopware/issues/13020 |
| Store API HTTP cache ignored `sw-access-key` with CACHE_REWORK enabled | 6.7 (feature-flagged) | closed | https://github.com/shopware/shopware/issues/16634 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Which type IDs exist in 6.7? | code | Four, including Agentic commerce — fact 1 |
| Is a domain required for a headless channel? | code | No — domains are a storefront-routing requirement only |
| Which field holds the key, how is it generated, where is it read? | code | `sales_channel.access_key`, generated via `AccessKeyHelper` behind `GET /api/_action/access-key/sales-channel`, read from the `sw-access-key` header |
| Is there an equivalent membership validation for the default *currency*? | not settled | Only the language validation was read; no fact above asserts currency-list membership |
| Domain resolution order when several domains share a language | not settled | Not traced; no fact above asserts an ordering |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Create a storefront, a headless (API-only) or a product comparison channel | "you can choose whether you want to create a new **Sales Channel with HTML storefront** or a **headless sales channel** that only provides an API interface." | merchant `settings/saleschannel/v1-5-2-0.md` | partially — code ships four types; the docs list three |
| A domain carries its own URL, language, currency, snippet set and unit system | "each with its own **virtual URL**, **language**, **currency**, **snippet set** and its own **unit system**." | merchant `settings/saleschannel/v1-5-2-0.md` | yes for url/language/currency/snippet set (all Required); the unit system field was not read |
| A domain's language is chosen from the channel's assigned languages | "you can choose from all the languages that were assigned to the sales channel in the basic settings above." | merchant `settings/saleschannel/v1-5-2-0.md` | not checked as a constraint — only the default-language membership rule was read |
| The API access section generates an "API Access ID" | "Here you can generate an API Access ID for this sales channel." | merchant `settings/saleschannel/v1-5-2-0.md` | yes for the endpoint; the name diverges — code calls it the access key |
| The key goes in the `sw-access-key` header | "Use the access key in the `sw-access-key` header when calling the Store API" | developer `guides/development/integrations-api/flows/create-product.md` | yes — `PlatformRequest.php:19` |
| Generating a new key invalidates the old one | "Be aware that generating a new key invalidates the old one." | developer `guides/development/integrations-api/flows/create-product.md` | consistent with a single `access_key` column resolved by SQL, but the admin save path was not read |
| A disabled channel is inaccessible to visitors and the API | "It is then temporarily inaccessible for visitors and the API." | merchant `settings/saleschannel/v1-5-2-0.md` | yes for the storefront (`sales_channel.active` in the domain loader) and for maintenance handling at store-api authentication |
| The preinstalled Headless channel should never be deleted | "Many extensions use this particular iteration of a headless channel - among them our B2B-Suite." | merchant `settings/saleschannel/v1-5-2-0.md` | no — retained as `[docs-only]` operational context |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| Three channel types on creation (storefront, headless, product comparison) | Four type constants ship in 6.7.13.0, including `SALES_CHANNEL_TYPE_AGENTIC_COMMERCE` | `Defaults.php:27-33` |
| The credential is an "API Access ID" (merchant page), an "API access key" (developer guide), an "access key" (concept page) | One field: `sales_channel.access_key`, header `sw-access-key`, prefix `SWSC`, no secret counterpart | `Framework/Api/Util/AccessKeyHelper.php:13-16,27-34` |
| The docs present the key as generated for the channel in the admin | The key is not generated on write; it must be fetched from `GET /api/_action/access-key/sales-channel` and written to the Required `access_key` field | `System/SalesChannel/SalesChannelDefinition.php:91-97,131`; `Framework/Api/Controller/AccessKeyController.php:45-55` |
| The docs describe channel setup as type-dependent | No Required flag is type-dependent; a headless channel still needs navigation category, country, payment and shipping defaults | `System/SalesChannel/SalesChannelDefinition.php:108-118` |
| Merchant page states IP whitelisting behind a proxy needs `TRUSTED_PROXIES` in `.env` | Not checked in this round; removed from the facts rather than carried as an unverified aside | — |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| A sales channel is created via the **+** next to **Sales Channel**, choosing HTML storefront, headless (API-only), or product comparison. | replaced | The type list is incomplete for 6.7: code ships four type constants including Agentic commerce. The new fact also states what the type does *not* change — every Required field applies to every type. |
| **Domains** (self-hosted) each carry their own virtual URL, language, currency, snippet set and unit system; on cloud a domain is auto-generated and custom domains must first be set up under **Settings > System > Domains**. (The page's `TRUSTED_PROXIES` remark is outdated for 6.6+, where `SYMFONY_TRUSTED_PROXIES` applies — not scored.) | replaced | The domain half is kept and backed by the four Required fields plus the storefront domain loader. The parenthetical was a tolerance clause ("not scored") about a point no lane verified, so it is removed; cloud domain provisioning is not verifiable from source and is dropped. |
| The **API access** section generates an API Access ID; the preinstalled Headless sales channel must never be deleted because extensions including the B2B-Suite depend on it. | replaced | "API Access ID" is doc-only naming for `sales_channel.access_key`; the new fact states the mechanism a usable answer needs (header, `SWSC` prefix, no secret, not auto-generated, maintenance/IP enforcement). The Headless-channel warning is retained as a `[docs-only]` trap. |
