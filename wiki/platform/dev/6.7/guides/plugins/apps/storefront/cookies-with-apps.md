---
id: platform/dev/6.7/guides/plugins/apps/storefront/cookies-with-apps.md
title: Add Cookies to the Consent Manager
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/storefront/cookies-with-apps.html
sourceHash: 65c969bae1370303533138e93a1c1b2b3c92b08d
codeCheckedAgainst: "6.7.13.0"
keywords: ["cookies", "cookie consent", "consent manager", "manifest.xml", "snippet-name", "snippet-description", "cookie group", "entries", "cookie.groupMarketing", "cookie.groupRequired", "cookie.groupStatistical", "cookie.groupComfortFeatures", "app cookies", "gdpr", "AppCookieCollectListener"]
summary: "App manifest cookies section: register cookies and cookie groups in the Storefront consent manager, incl. standard groups like cookie.groupMarketing"
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/app-base-guide.md", "platform/dev/6.7/resources/references/app-reference/manifest-reference.md", "platform/dev/6.7/guides/plugins/plugins/storefront/advanced/reacting-to-cookie-consent-changes.md", "platform/dev/6.7/resources/references/app-reference/script-reference/script-hooks-reference.md"]
---
## What it is

How an app registers its own cookies (single or grouped) in the Storefront cookie consent manager via a `<cookies>` section in `manifest.xml`. No `setup` section or app server is needed for this.

## When to use

Your app sets cookies in the Storefront (tracking, marketing, payment provider) and customers must be able to consent to them, either individually, as an app-specific group, or inside one of Shopware's standard groups.

## Key steps / config

1. Add a `<cookies>` element to `manifest.xml` (schema `manifest-3.0.xsd`; the docs reference `https://raw.githubusercontent.com/shopware/shopware/refs/tags/v6.7.4.0/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`). It accepts any mix of `<cookie>` and `<group>` children.
2. A single `<cookie>` takes these children (any order):
   - `cookie` (required) — technical cookie name stored in the cookie jar.
   - `snippet-name` (required) — label; preferably a Storefront snippet key.
   - `snippet-description` (optional) — description; preferably a snippet key.
   - `value` (optional) — fixed value set when the customer accepts. If unset, Shopware does not set/unset the cookie but passes it to the update event.
   - `expiration` (optional, integer days) — if unset, the cookie expires with the session.
3. A `<group>` takes `snippet-name` (required), `snippet-description` (optional) and `entries`, which holds `<cookie>` elements.
4. To place cookies into a built-in group, use its snippet name as the group's `snippet-name`: `cookie.groupRequired`, `cookie.groupComfortFeatures`, `cookie.groupStatistical`, `cookie.groupMarketing`.

```xml
<cookies>
    <group>
        <snippet-name>cookie.groupMarketing</snippet-name>
        <snippet-description>...</snippet-description>
        <entries>
            <cookie>
                <cookie>myapp_conversion_tracking</cookie>
                <snippet-name>myapp.cookie.conversionTracking</snippet-name>
                <value>1</value>
                <expiration>90</expiration>
            </cookie>
        </entries>
    </group>
</cookies>
```

## Essential identifiers

- `manifest.xml` elements: `cookies`, `cookie`, `group`, `entries`, `snippet-name`, `snippet-description`, `value`, `expiration`
- Standard group snippet names: `cookie.groupRequired`, `cookie.groupComfortFeatures`, `cookie.groupStatistical`, `cookie.groupMarketing`
- `Shopware\Core\Framework\App\Cookie\AppCookieCollectListener` — adds cookies of active apps to the collected cookie groups

## Gotchas

- Cookies without `value` are not set automatically; react to consent changes in Storefront JavaScript (see [Reacting to cookie consent changes](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/reacting-to-cookie-consent-changes.md)).
- Manifest cookies are shown in all sales channels. Groups are matched by `snippet-name`; an app group whose `snippet-name` equals an existing group is merged into it.
- Only cookies of active apps are collected.
- Changes to cookie definitions in `manifest.xml` alter the consent configuration hash and trigger a re-consent prompt for customers.
- Prefer snippet keys over literal strings for names/descriptions so shop owners can translate them.

## Version notes

- The docs describe a `cookie-group-collect` app script hook (Shopware 6.7.14.0+) to remove own groups/entries conditionally, e.g. a script at `Resources/scripts/cookie-group-collect/*.twig` using `hook.cookieGroups.get('<snippet-name>')` and `group.entries.remove('<cookie name>')`, with `services.store`/`services.config` for conditions. This hook is not present in the installed 6.7.13.0; older versions ignore scripts for unknown hooks, so the cookies are always shown.

## Code check (6.7.13.0)
- confirmed `cookies` — manifest element, choice of `cookie`/`group` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:481
- confirmed `snippet-name` — required child of `cookie` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:494
- confirmed `value` — optional (minOccurs 0) — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:497
- confirmed `expiration` — optional, xs:int — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:498
- corrected `entries` — docs: required on `group`; XSD declares minOccurs 0 — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:505
- confirmed `cookie.groupMarketing` — standard group snippet constant (also groupRequired/Statistical/ComfortFeatures) — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:31
- confirmed `AppCookieCollectListener::__invoke()` — collects cookies of active apps — vendor/shopware/core/Framework/App/Cookie/AppCookieCollectListener.php:36
- confirmed `snippet_name` — groups looked up/merged by snippet name — vendor/shopware/core/Framework/App/Cookie/AppCookieCollectListener.php:57
- absent `cookie-group-collect` — script hook not in the installed code index (docs: introduced 6.7.14.0)
