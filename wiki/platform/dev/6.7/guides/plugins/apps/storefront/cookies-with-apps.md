---
id: platform/dev/6.7/guides/plugins/apps/storefront/cookies-with-apps.md
title: Add Cookies to the Consent Manager
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/storefront/cookies-with-apps.html
sourceHash: 65c969bae1370303533138e93a1c1b2b3c92b08d
codeCheckedAgainst: "6.7.15.1"
keywords: ["manifest.xml cookies", "cookie consent manager", "cookie group", "snippet-name", "snippet-description", "cookie-group-collect", "CookieGroupCollectHook", "cookie.groupMarketing", "cookie.groupRequired", "app cookies", "gdpr consent", "app script hook"]
summary: Declare app cookies and cookie groups in manifest.xml, assign them to standard groups, and hide them per sales channel via the cookie-group-collect hook.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/commerce/content/cookie-consent-management.md", "platform/dev/6.7/resources/references/app-reference/manifest-reference.md", "platform/dev/6.7/resources/references/app-reference/script-reference/script-hooks-reference.md", "platform/dev/6.7/guides/plugins/plugins/storefront/advanced/reacting-to-cookie-consent-changes.md"]
---
## What it is

How an app registers its own cookies (single or grouped) in the Storefront cookie consent manager through a `<cookies>` section in `manifest.xml`, and how it can remove them conditionally with an app script. No `<setup>` section or app server is needed for this. Background: [Cookie Consent Management Concept](platform/dev/6.7/concepts/commerce/content/cookie-consent-management.md).

## When to use

- Your app sets cookies in the Storefront and they must be consentable.
- You want several cookies to be accepted at once (a group), or placed in a built-in Shopware group.
- A cookie is only relevant under conditions (e.g. a payment method active in the current sales channel).

## Key steps / config

1. Add `<cookies>` to `manifest.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/refs/tags/v6.7.4.0/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`). It may contain `<cookie>` and `<group>` elements in any order:

```xml
<cookies>
    <group>
        <snippet-name>example-app-with-cookies.cookie-group.name</snippet-name>
        <snippet-description>...</snippet-description>
        <entries>
            <cookie>
                <cookie>my-cookie</cookie>
                <snippet-name>example-app-with-cookies.my-cookie.name</snippet-name>
                <snippet-description>...</snippet-description>
                <value>...</value>
                <expiration>1</expiration>
            </cookie>
        </entries>
    </group>
</cookies>
```

2. `<cookie>` children: `cookie` (required, technical cookie name), `snippet-name` (required, label; use a Storefront snippet key for translations), `value` (optional, fixed value set on accept), `expiration` (optional, integer days), `snippet-description` (optional).
3. `<group>` children: `snippet-name` (label), `entries` (collection of `<cookie>` elements), `snippet-description` (optional).
4. To put cookies into a standard group, use a built-in snippet name as the group `snippet-name`: `cookie.groupRequired`, `cookie.groupComfortFeatures`, `cookie.groupStatistical`, `cookie.groupMarketing`.
5. To hide cookies conditionally, add a script under `Resources/scripts/cookie-group-collect/` (e.g. `filter-payment-cookies.twig`). Groups are indexed by `snippet-name`, entries by cookie name:

```twig
{% if services.store.search('payment_method', criteria).total == 0 %}
    {% set group = hook.cookieGroups.get('myapp.cookie-group.name') %}
    {% if group is not null and group.entries is not null %}
        {% do group.entries.remove('myapp_payment_cookie') %}
    {% endif %}
{% endif %}
```

The script runs after all extensions' cookies are collected, so manifest entries are already present. `services.store` searches the current sales channel. App payment method handler identifiers follow `app\{AppName}_{identifier}`. Usable services include `services.config`, `services.repository`, `services.store`.

## Essential identifiers

- `<cookies>`, `<cookie>`, `<group>`, `<entries>`, `<snippet-name>`, `<snippet-description>`, `<value>`, `<expiration>`
- `cookie.groupRequired`, `cookie.groupComfortFeatures`, `cookie.groupStatistical`, `cookie.groupMarketing`
- Hook `cookie-group-collect` (`Shopware\Core\Content\Cookie\Hook\CookieGroupCollectHook`), `hook.cookieGroups`

## Gotchas

- A cookie without `<value>` is not set active/inactive by Shopware; it is only passed to the update event and you must react in JavaScript ([reacting to consent changes](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/reacting-to-cookie-consent-changes.md)).
- Without `<expiration>` the cookie expires with the session.
- Manifest cookies are shown in all sales channels unless removed by the hook script.
- Prefer Storefront snippet keys over literal strings for names/descriptions so shop owners can translate them.
- Any change to cookie definitions in `manifest.xml` is detected via the configuration hash mechanism and triggers re-consent for visitors.

## Version notes

- `cookie-group-collect` exists since 6.7.14.0. Older versions ignore scripts for unknown hooks, so the app stays installable there and the cookies are always shown.

## Code check (6.7.15.1)
- confirmed `cookies` — XSD complexType allows `cookie` and `group` children in any order — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:494
- confirmed `snippet-name` — required child of `cookie` (no minOccurs) — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:507
- confirmed `expiration` — optional, typed `xs:int` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:511
- corrected `entries` — docs: required in `group`; XSD declares it `minOccurs="0"` — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:518
- confirmed `cookie.groupMarketing` — `CookieProvider::SNIPPET_NAME_COOKIE_GROUP_MARKETING` — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:33
- confirmed `cookie.groupRequired` — `CookieProvider::SNIPPET_NAME_COOKIE_GROUP_REQUIRED` — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:30
- confirmed `cookie-group-collect` — `CookieGroupCollectHook::HOOK_NAME` — vendor/shopware/core/Content/Cookie/Hook/CookieGroupCollectHook.php:30
- confirmed `CookieGroupCollectHook` — `@since 6.7.14.0` — vendor/shopware/core/Content/Cookie/Hook/CookieGroupCollectHook.php:26
- confirmed `CookieGroupCollectHook::getCookieGroups()` — exposes the `CookieGroupCollection` as `hook.cookieGroups` — vendor/shopware/core/Content/Cookie/Hook/CookieGroupCollectHook.php:43
- confirmed `CookieGroupCollectHook::getServiceIds()` — repository, system config and sales-channel repository facades — vendor/shopware/core/Content/Cookie/Hook/CookieGroupCollectHook.php:53
