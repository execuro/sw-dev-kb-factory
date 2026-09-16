---
id: platform/dev/6.7/guides/development/testing/store/cookies-and-privacy.md
title: Cookies and privacy
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/cookies-and-privacy.html
sourceHash: ae491c9538cfc46e83562d15b7d77465f3f42648
codeCheckedAgainst: "6.7.13.0"
keywords: ["cookie consent manager", "cookies", "technically required", "marketing", "comfort features", "cookie.groupRequired", "cookie.groupMarketing", "cookie.groupComfortFeatures", "CookieGroupCollectEvent", "dsgvo", "gdpr", "subprocessor", "store review"]
summary: "Store rules for extension cookies: register in the Cookie Consent Manager, optional and unchecked by default, correct category; declare DSGVO subprocessors."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md"]
---
## What it is

Store review requirements for how an extension registers cookies in the Storefront Cookie Consent Manager and declares processing of personal data under DSGVO.

## When to use

When an extension sets cookies from the shop URL or processes customer personal data and is to be published in the Shopware Store.

## Key steps / config

1. Register every cookie in the Cookie Consent Manager (see [Add cookie to manager](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md)). In the installed code, cookie groups are collected via `Shopware\Core\Content\Cookie\Event\CookieGroupCollectEvent`, whose `$cookieGroupCollection` extensions add to.
2. Cookies must be optional; classify one as technically required only if the shop truly cannot run without it.
3. All cookies must appear unchecked by default in the Storefront cookie configuration, unless law and product behavior require otherwise.
4. Assign each cookie to one category. The Store review names three; the matching core snippet keys are:
   - Technically required — `cookie.groupRequired` (strictly necessary cookies only)
   - Marketing — `cookie.groupMarketing` (the Store page lists analytics/data collection here)
   - Comfort features — `cookie.groupComfortFeatures` (anything else needed for a specific feature)
5. Example: a pop-up reminder cookie is not technically required; use Comfort features or tie it to the session cookie.
6. If personal data of merchants or end customers is processed under Art. 28 DSGVO, enter the data processor under **Subprocessor** and further processors under **Further subprocessors** in the Shopware Account; mention external services that transmit personal data in the description.

## Essential identifiers

- `CookieGroupCollectEvent`
- `cookie.groupRequired`, `cookie.groupMarketing`, `cookie.groupComfortFeatures`
- `CookieGroup::$isRequired` (defaults to `false`)

## Gotchas

- The 6.7.13.0 core also defines a fourth default group, `cookie.groupStatistical`, which the Store page does not mention.
- The Storefront `CookieProviderInterface` is deprecated for 6.8.0; use `CookieGroupCollectEvent` to introduce cookies.

## Code check (6.7.13.0)
- confirmed `cookie.groupRequired` — technically required group snippet key — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:28
- confirmed `cookie.groupComfortFeatures` — comfort features group snippet key — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:30
- confirmed `cookie.groupMarketing` — marketing group snippet key — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:31
- corrected `cookie.groupStatistical` — docs: only three categories (Technically required, Marketing, Comfort features) — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:29
- confirmed `CookieGroupCollectEvent` — event dispatched to collect cookie groups — vendor/shopware/core/Content/Cookie/Event/CookieGroupCollectEvent.php:15
- confirmed `CookieGroup::$isRequired` — groups are not required by default — vendor/shopware/core/Content/Cookie/Struct/CookieGroup.php:20
- deprecated `CookieProviderInterface` — removed in 6.8.0, replaced by CookieGroupCollectEvent — vendor/shopware/storefront/Framework/Cookie/CookieProviderInterface.php:12
