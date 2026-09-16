---
id: platform/dev/6.7/concepts/commerce/content/cookie-consent-management.md
title: Cookie Consent Management
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/content/cookie-consent-management.html
sourceHash: a030236eceac757798c19b39f559397e8d6cd5fa
codeCheckedAgainst: "6.7.13.0"
keywords: ["cookie consent", "gdpr", "cookie-config-hash", "cookie-preference", "store-api/cookie-groups", "CookieEntry", "CookieGroup", "CookieGroupCollectEvent", "cookie.groupRequired", "cookie.groupComfortFeatures", "cookie.groupMarketing", "cookie.groupStatistical", "re-consent", "cookie banner"]
summary: Shopware 6.7 cookie consent concept - four cookie groups, per-language cookie-config-hash re-consent, Store API cookie groups route, protected cookies.
lastBuilt: 2026-09-15
---
## What it is

Concept page for Shopware's cookie consent system: cookie definitions from core, plugins and apps are collected by a cookie provider service, exposed with a configuration hash via the Store API, and managed in the Storefront by a consent UI that re-prompts users when the configuration changes. The hash and re-consent functionality exists since Shopware 6.7.3.0.

## When to use

- Deciding which consent group a new cookie belongs to.
- Building a headless or custom frontend that must read cookie groups and track consent per language.
- Understanding why users see the cookie banner again after a plugin or app changed cookies.

## Key steps / config

Flow: the Storefront fetches cookie groups (with hash and language ID), compares the hash stored for the current language, shows the banner if it differs, otherwise applies stored preferences; after the user chooses, preferences and hash are stored.

Cookie groups (technical names):

| Group | Technical name |
|---|---|
| Technically required (cannot be disabled) | `cookie.groupRequired` |
| Comfort functions (video platforms, chat, social) | `cookie.groupComfortFeatures` |
| Marketing (pixels, remarketing, conversion) | `cookie.groupMarketing` |
| Statistics and tracking (analytics, A/B tests) | `cookie.groupStatistical` |

Configuration hash:

1. Calculated server-side from all cookie groups and entries (technical names, names, descriptions, values, expiration, hidden flag).
2. Stored in the browser cookie `cookie-config-hash` as an object keyed by language ID: `{"<languageId>":"<hash>"}`.
3. On each visit, compared against the stored hash for the current language.
4. If different, all non-essential cookies are removed and consent is requested again.

The hash changes when cookies are added, modified or removed, groups are restructured, or descriptions or settings change.

System cookies:

| Cookie | Purpose | Lifetime |
|---|---|---|
| `cookie-preference` | user's consent choices | 30 days |
| `cookie-config-hash` | configuration changes per language | 30 days |

Protected (never removed, even on re-consent): `session-*`, `timezone`.

Store API route `GET /store-api/cookie-groups` (route name `store-api.cookie.groups`) returns cookie groups, the hash as a string, and the language ID. Headless frontends store them in `cookie-config-hash` in the same language-ID-keyed shape.

Extension points:

- Plugins add cookies with an event listener on `CookieGroupCollectEvent`.
- Apps define cookies in `manifest.xml`.
- Custom Storefront scripts can react to consent change events.

Structured definitions: `CookieEntry` (single cookie), `CookieGroup` (group of related cookies). Use a group when several cookies serve one purpose (e.g. a YouTube group); use an individual cookie for a standalone purpose needing granular control.

## Essential identifiers

- `Shopware\Core\Content\Cookie\Struct\CookieEntry`, `Shopware\Core\Content\Cookie\Struct\CookieGroup`
- `Shopware\Core\Content\Cookie\Event\CookieGroupCollectEvent`
- `cookie.groupRequired`, `cookie.groupComfortFeatures`, `cookie.groupMarketing`, `cookie.groupStatistical`
- `cookie-config-hash`, `cookie-preference`
- `GET /store-api/cookie-groups`

## Gotchas

- The docs page names the Store API endpoint `GET /store-api/cookie/groups`; the installed route is `/store-api/cookie-groups`. `/cookie/groups` is the Storefront route `frontend.cookie.groups`.
- The Store API cookie route class is annotated experimental with stable version v6.8.0 in the 6.7 code.
- `Shopware\Storefront\Framework\Cookie\CookieProviderInterface` (array-based legacy provider) is deprecated for 6.8.0; use `CookieGroupCollectEvent` instead.
- Only truly essential cookies belong in `cookie.groupRequired`; check consent before loading third-party scripts or setting marketing or analytics cookies.
- Shop owners remain responsible for legal GDPR compliance; the system only provides technical support.

## Version notes

- 6.7.3.0: cookie-hash re-consent functionality and the Store API cookie groups endpoint introduced.
- 6.8.0: removal of the legacy `CookieProviderInterface` and stabilisation of the Store API route are announced in code.

## Code check (6.7.13.0)
- corrected `/store-api/cookie-groups` — docs: GET /store-api/cookie/groups — vendor/shopware/core/Content/Cookie/SalesChannel/CookieRoute.php:40
- confirmed `frontend.cookie.groups` — Storefront route on /cookie/groups — vendor/shopware/storefront/Controller/CookieController.php:73
- confirmed `cookie.groupRequired` — required group technical name — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:28
- confirmed `cookie.groupStatistical` — statistics group — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:29
- confirmed `cookie.groupComfortFeatures` — comfort group — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:30
- confirmed `cookie.groupMarketing` — marketing group — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:31
- confirmed `cookie-config-hash` — required hash cookie entry — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:32
- confirmed `cookie-preference` — required entry, expiration 30 — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:108
- confirmed `CookieEntry` — struct for a single cookie — vendor/shopware/core/Content/Cookie/Struct/CookieEntry.php:14
- deprecated `CookieProviderInterface` — removed in 6.8.0, use CookieGroupCollectEvent — vendor/shopware/storefront/Framework/Cookie/CookieProviderInterface.php:12
