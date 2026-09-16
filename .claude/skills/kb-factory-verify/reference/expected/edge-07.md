# `edge-07` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `edge-07` · `edge` · `Trap` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-82-91` |
| Core version | `6.7.13.0` |

**Query:** How do I set up Shopware PWA as the storefront for a Shopware 6.7 shop?

**Expected answer — every fact an answer must contain:**

1. States that a 6.7 installation contains no PWA surface whatsoever — a word-boundary search for `pwa` over `vendor/shopware/core`, `vendor/shopware/storefront` and `vendor/shopware/administration` returns zero matches, and no PWA route such as `/store-api/pwa/page` and no aggregated page-resolution endpoint exists in the Store API — so it gives no 6.7 PWA installation steps.  `[code: composer.json:7-10]`
2. Gives the actual 6.7 headless setup instead: a sales channel of the API type (`Defaults::SALES_CHANNEL_TYPE_API`, which core excludes from SEO URL generation) consumed over the Store API with the `sw-access-key` header plus an `sw-context-token`, the Twig Storefront being a separate optional bundle that a headless setup simply does not use.  `[code: Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:71-75]`
3. Names Composable Frontends as the documented headless frontend implementation on top of the Store API, which the current docs direct developers to instead of extending the default Storefront.  `[docs-only]`

**Trap:** The premise is dead. 6.7 ships nothing PWA-related (code), the Shopware PWA repository and the SwagShopwarePwa backend plugin are archived upstream with 6.6 as the last listed version (community), and the only PWA page still reachable is under the archived v6.5 docs. (A plain `grep pwa` matches "shopware" in every file — the search has to be word-boundary.)

**Official reference URL:** https://developer.shopware.com/docs/concepts/api/store-api.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The headless integration surface is the Store API — 80 core files declare a `/store-api` route, all bound to the store-api scope | `Framework/Routing/StoreApiRouteScope.php:15-19` | `final public const ID = 'store-api'; final public const ALLOWED_PATH = 'store-api';` |
| A headless sales channel is one with the API type id | `Defaults.php:27` | `public const SALES_CHANNEL_TYPE_API = 'f183ee5650cf4bdb8a774337575067a6';` |
| Core treats API-type sales channels as having no own URLs — SEO URL generation filters them out | `Content/Seo/SeoUrlUpdater.php:61` | `$criteria->addFilter(new NandFilter([new EqualsFilter('typeId', Defaults::SALES_CHANNEL_TYPE_API)]));` |
| A client drives the Store API with a context token and may pin language/currency by header | `PlatformRequest.php:18-21` | `HEADER_CONTEXT_TOKEN = 'sw-context-token'; … HEADER_LANGUAGE_ID; HEADER_CURRENCY_ID` |
| The access key header is required by the Store API authentication listener | `Framework/Api/EventListener/Authentication/SalesChannelAuthenticationListener.php:71-75` | `'Header "%s" is required.', PlatformRequest::HEADER_ACCESS_KEY` |
| The Twig storefront is a separate optional bundle (`shopware/storefront`), not part of core | `storefront/Storefront.php:21` | `class Storefront extends Bundle implements ThemeInterface` |
| This project registers the Storefront bundle for all environments; nothing else frontend-facing | `config/bundles.php:20` | `Shopware\Storefront\Storefront::class => ['all' => true],` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| 6.7 ships, requires or references a "Shopware PWA" frontend | absent | A word-boundary, case-insensitive grep for `pwa` over all `.php/.xml/.json/.yaml/.twig` files in `vendor/shopware/{core,storefront,administration}` returns zero matches. `vendor/shopware` contains only administration, core, deployment-helper, storefront; the project requires only those four packages (`composer.json:7-10`). |
| A PWA support plugin (e.g. a `/store-api/pwa/page` route set) exists in this installation | absent | No such route anywhere under `vendor/shopware`; `custom/plugins` and `custom/static-plugins` are both empty. |
| Core provides an aggregated page endpoint a PWA-style client would call instead of composing Store API routes | absent | Every `/store-api` route in core is a resource route (product, product-listing, checkout, account, …). Page resolution lives in the Storefront bundle's PageLoaders, Twig-side, not Store API. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _none found_ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| The Shopware PWA repository is archived and read-only ("Shopware PWA is not maintained anymore"), pointing to frontends.shopware.com | predates 6.6 | closed | https://github.com/vuestorefront/shopware-pwa |
| SwagShopwarePwa, the backend plugin PWA required, is deprecated; its version table stops at 6.6 (0.5.* → 6.6), no 6.7 row | 6.6 last listed | closed | https://github.com/shopware/SwagShopwarePwa |
| The `@shopware-pwa/*` npm packages were formally deprecated in favour of `@shopware/*` | unclear | closed | https://github.com/shopware/frontends/issues/1406 |
| Users hit build failures from the stale package names during the transition | unclear | closed | https://github.com/shopware/frontends/issues/1380 |
| PWA compatibility was chased release-by-release well before 6.7 (6.5 only via canary plus a specific PR) | 6.5 | closed | https://github.com/shopware/frontends/issues/215 |
| The PWA product page is only reachable under the archived v6.5 docs tree | 6.5 | closed | https://developer.shopware.com/docs/v6.5/products/pwa.html |
| Headless sales channels reported as still gapped for Composable Frontends (SEO URLs, sitemap) | 6.7-era | closed | https://github.com/shopware/shopware/issues/19685 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does the 6.7 branch contain any PWA integration surface at all? | code lane, word-boundary grep over all three bundles | None — zero matches, no PWA route, no plugin installed. |
| What sales channel types does 6.7 define, and is there a headless/API type? | `Defaults.php:27` | Yes — `SALES_CHANNEL_TYPE_API`; core excludes it from SEO URL generation. |
| Does 6.7 expose the page-resolution endpoint PWA relied on? | code lane, all `/store-api` routes in core | No — every store-api route is a resource route; page resolution is Storefront-side. |
| Is `seoUrls` included on Store API responses by default, or only with `sw-include-seo-urls`? | not settled | No lane examined the header constant. Not load-bearing — no fact claims anything about SEO URL exposure; the SEO-URL finding used here is the SeoUrlUpdater filter, which is cited. |
| Was the Store API caching layer removed in 6.7? | not settled | No lane examined it. Not load-bearing — no fact claims anything about caching. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Composable Frontends is the documented headless frontend implementation on the Store API | "Shopware provides [Composable Frontends](/frontends/) as a headless frontend implementation based on the Store API." | `developer/concepts/api/store-api.md` | no — an external product, outside this source tree; admitted as `[docs-only]` context, uncontradicted by code |
| Developers building headless frontends should follow the Composable Frontends guide rather than extend the Storefront | "Visit the Composable Frontends guide … when building headless frontends instead of extending the default Storefront" | `developer/guides/plugins/plugins/storefront/index.md` | no — same |
| The Store API enables headless frontends such as SPAs or native apps | "It enables headless frontends (such as SPAs or native apps) to consume Shopware functionality via JSON over HTTP." | `developer/concepts/api/store-api.md` | yes |
| Composable frontends deploy on PaaS as `kind: cfe`, Node.js, port 3000 | "Composable frontend applications must listen on port `3000`." | `developer/products/paas/shopware/composable-frontends/index.md` | not applicable — PaaS deployment detail, outside the source tree |
| The archived v6.5 page still presents Shopware PWA as a usable base and states no deprecation | "you can use **Shopware PWA** as a base…" | https://developer.shopware.com/docs/v6.5/products/pwa.html (live) | contradicted for 6.7 — no PWA component exists |

The docs lane also reported that a Grep for "PWA" across the clone returned no matches. That Grep is not
evidence: the docs clones are gitignored, so the lane's recursive Grep returned zero matches corpus-wide.
No fact rests on it — fact 3 rests on pages the lane actually read and quoted, and fact 1 on code.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The archived v6.5 documentation page, still live, recommends Shopware PWA as the base for a decoupled storefront and carries no deprecation notice | A 6.7.13.0 installation contains no PWA code, no PWA route and no PWA dependency; `vendor/shopware` holds only administration, core, deployment-helper and storefront | `composer.json:7-10` |
| Current docs name Composable Frontends as the headless path but document it in a separate documentation set | Core exposes only the Store API resource routes and the API-type sales channel; no Shopware-shipped headless frontend exists in the source tree | `Framework/Routing/StoreApiRouteScope.php:15-19` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States that Shopware PWA is in maintenance mode and that no 6.7 documentation page exists for it. | rewritten | "Maintenance mode" is a community signal (the repository is in fact archived and read-only) and community never becomes a fact here; and the absence of a documentation page is weaker than what code shows. Fact 1 now states the code absence: no PWA surface anywhere in a 6.7 installation. |
| Names Composable Frontends as the recommended path for a decoupled storefront on the Store API. | kept, retagged `[docs-only]` | Composable Frontends is an external product; no code finding can confirm it. Admitted as intent/context, uncontradicted by code. |
| Invents no PWA installation steps for 6.7. | merged into fact 1 | Restated as the code-cited absence rather than a meta-requirement on the answer. |
| _(new)_ | added | The positive 6.7 headless setup — API-type sales channel, Store API, `sw-access-key` plus `sw-context-token`, Storefront as an optional bundle — is what makes an answer usable rather than merely correct in its refusal. |
| _(trap and reference URL)_ | corrected | The old trap said PWA was "documented only under 6.6" and the reference URL pointed at `/docs/v6.6/products/pwa.html`; the docs lane found the page under the archived **v6.5** tree and the 6.6 page was not established to exist. The reference URL now points at the current Store API concept page. |
