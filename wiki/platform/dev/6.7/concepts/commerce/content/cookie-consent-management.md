---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/concepts/commerce/content/cookie-consent-management.md
sourceHash: a030236eceac757798c19b39f559397e8d6cd5fa
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/content/cookie-consent-management.html
title: Cookie Consent Management
version: "6.7"
versions: ["6.7"]
keywords: ["cookie consent", "gdpr", "cookie banner", "cookie-config-hash", "cookie-preference", "CookieEntry", "CookieGroup", "CookieProvider", "store-api.cookie.groups", "cookie.groupRequired", "cookie.groupStatistical", "re-consent", "cookie groups"]
summary: Shopware cookie consent - four cookie groups, CookieEntry/CookieGroup structs, per-language config hash re-consent, Store API cookie-groups route.
lastBuilt: 2026-10-21
---
## What it is

Shopware's cookie consent system collects cookie definitions from core, plugins and apps, exposes them (with a configuration hash) via the Store API, and lets the Storefront consent UI store user choices. When the cookie configuration changes, the hash changes and the user is asked to consent again. Shop owners remain responsible for actual GDPR compliance.

## When to use

- Adding cookies from a plugin or app and choosing the right category.
- Building a headless/custom frontend that needs the cookie configuration and hash.
- Understanding why the consent banner reappears after a plugin update.

## Key steps / config

Components:

1. Internal cookie collection service in the `Shopware\Core\Content\Cookie\Service` namespace — builds the four default groups, then dispatches a collect event and a script hook so plugins and apps can add or change groups and entries.
2. Store API route `GET /store-api/cookie-groups` (route name `store-api.cookie.groups`) — returns the cookie groups, the configuration hash (string) and the language ID.
3. Storefront component — `cookie-configuration.plugin.js` / `cookie-permission.plugin.js` manage UI and preferences.
4. Configuration hash — compared per language on each visit.

Categories (snippet keys used as group technical names):

| Group | Key |
|---|---|
| Technically required (cannot be disabled) | `cookie.groupRequired` |
| Comfort functions (video, chat, social) | `cookie.groupComfortFeatures` |
| Marketing (pixels, remarketing, affiliate) | `cookie.groupMarketing` |
| Statistics and tracking (analytics, A/B) | `cookie.groupStatistical` |

Hash mechanism:

- The hash is computed from all groups and entries (technical name, required flag, name, description, value, expiration, cookie name, hidden flag), sorted deterministically.
- The browser stores it in the `cookie-config-hash` cookie as an object keyed by language ID: `{"<languageId>":"<hash>"}`.
- If the stored hash for the current language differs, all non-essential cookies are removed and consent is requested again; if it matches, stored preferences apply.
- The hash changes when cookies are added/modified/removed, groups are restructured, or descriptions/settings change.

System cookies:

| Cookie | Purpose | Lifetime |
|---|---|---|
| `cookie-preference` | Stores consent choices | 30 days |
| `cookie-config-hash` | Tracks config changes per language | 30 days |

Protected (never removed during re-consent): `session-*` and `timezone`.

Extension: plugins add cookies with an event listener; apps declare cookies in `manifest.xml`; custom scripts in the Storefront can react to consent-change events.

## Essential identifiers

- `Shopware\Core\Content\Cookie\Struct\CookieEntry` — single cookie definition
- `Shopware\Core\Content\Cookie\Struct\CookieGroup` — group of related cookies
- `Shopware\Core\Content\Cookie\SalesChannel\CookieRoute` / `AbstractCookieRoute`
- `GET /store-api/cookie-groups`
- `cookie-preference`, `cookie-config-hash`

## Gotchas

- The docs write the endpoint as `/store-api/cookie/groups`; the installed route path is `/store-api/cookie-groups`.
- `CookieRoute` is marked `@experimental stableVersion:v6.8.0` in the installed code — its contract may still change.
- The collection service `CookieProvider` is `@internal` and its legacy cookie conversion branch is marked `@deprecated tag:v6.8.0`; do not depend on it directly — use the collect event or app manifest instead.
- Domains separate cookies per browser; the language-ID key only matters when several languages share one domain.
- Check consent before loading third-party scripts, setting marketing cookies, or collecting analytics.

## Version notes

- The cookie-hash/re-consent functionality and the Store API cookie-groups endpoint are available from Shopware 6.7.3.0.
- The legacy Storefront cookie provider conversion inside `CookieProvider` is slated for removal in 6.8.0.

## Code check (6.7.15.1)
- corrected `CookieRoute::getCookieGroups()` — docs: GET /store-api/cookie/groups; route path is /store-api/cookie-groups — vendor/shopware/core/Content/Cookie/SalesChannel/CookieRoute.php:40
- confirmed `CookieEntry` — struct class exists — vendor/shopware/core/Content/Cookie/Struct/CookieEntry.php:14
- confirmed `CookieGroup` — struct class exists — vendor/shopware/core/Content/Cookie/Struct/CookieGroup.php:18
- confirmed `SNIPPET_NAME_COOKIE_GROUP_REQUIRED` — value cookie.groupRequired, alongside groupStatistical/groupComfortFeatures/groupMarketing — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:30
- confirmed `COOKIE_ENTRY_CONFIG_HASH_COOKIE` — value cookie-config-hash — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:34
- deprecated `CookieProvider` — legacy cookie conversion branch marked @deprecated tag:v6.8.0 — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:59
- confirmed `CookieRoute` — marked experimental, stableVersion v6.8.0 — vendor/shopware/core/Content/Cookie/SalesChannel/CookieRoute.php:25
- confirmed `cookie-preference` — Storefront preference cookie name — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-configuration.plugin.js:56
- confirmed `defaultCookieExpiration` — default 30 days — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-configuration.plugin.js:53
- confirmed `timezone` — session- and timezone are the protected prefixes — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-configuration.plugin.js:419
