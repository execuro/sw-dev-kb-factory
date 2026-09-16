---
id: platform/dev/6.6/guides/plugins/apps/storefront/cookies-with-apps.md
title: Add cookies to the consent manager
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/storefront/cookies-with-apps.html
sourceHash: 98a1eda8b28c33e981606bb755d01bed0dbe716c
keywords: ["cookie consent manager", "manifest.xml", "cookies section", "cookie element", "group element", "snippet-name", "snippet-description", "expiration", "cookie group", "Storefront snippet", "cookie consent", "app"]
summary: "Apps register cookies with the Storefront consent manager via a cookies section in manifest.xml, optionally grouped."
lastBuilt: "2026-09-15"
---
## What it is

This page explains how an app registers cookies with the Storefront's cookie consent manager by adding a `cookies` section to the app's `manifest.xml`, without needing a `setup` section since it requires no own server.

## When to use

Use this when an app sets its own cookies and needs the customer to be able to accept or reject them through the consent manager, individually or grouped.

## Key steps / config

Add a `cookies` section with `cookie` elements to `manifest.xml`:

```xml
<manifest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-2.0.xsd">
    <meta>...</meta>
    <cookies>
        <cookie>
            <cookie>my-cookie</cookie>
            <snippet-name>...</snippet-name>
            <snippet-description>...</snippet-description>
            <value>...</value>
            <expiration>1</expiration>
        </cookie>
    </cookies>
</manifest>
```

Each `cookie` element supports:

- `cookie` (required): the technical name used to store the cookie in the customer's cookie jar.
- `snippet-name` (required): label shown in the consent manager, preferably a Storefront snippet key for translations.
- `value` (optional): fixed value set when the customer accepts; if unset, Shopware does not set the cookie's active state itself but still passes it to the update event.
- `expiration` (optional): cookie lifetime in days; if unset, the cookie expires with the session.
- `snippet-description` (optional): description shown in the consent manager, preferably a snippet key.

Multiple cookies can be combined under a `groups` section inside `cookies`. A `group` element has `snippet-name` (required), `entries` (required, a collection of `cookie` elements) and `snippet-description` (optional).

Since `cookie` elements without a `value` are not set automatically by Shopware, JavaScript must react to cookie consent changes to actually apply the cookie.

## Essential identifiers

- `manifest.xml` `<cookies>` section — declares an app's cookies.
- `<cookie>`, `<group>`, `<entries>` — child elements for individual and grouped cookies.
- `snippet-name`, `snippet-description`, `value`, `expiration` — cookie element attributes.

## Gotchas

- Without a `value` element, the cookie is not set/updated automatically by Shopware — the app's JavaScript must react to the consent-change event itself.
- Without an `expiration` element, the cookie expires with the session.
