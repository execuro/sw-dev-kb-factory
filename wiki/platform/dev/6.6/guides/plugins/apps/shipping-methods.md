---
id: platform/dev/6.6/guides/plugins/apps/shipping-methods.md
title: Shipping methods
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/shipping-methods.html
sourceHash: 828df45c8b12bd85850cf335b15d2eeb865922c9
keywords: ["shipping-methods", "shipping-method", "delivery-time", "manifest.xml", "identifier", "tracking-url", "position", "active", "icon", "experimental feature", "6.5.7.0"]
summary: "Experimental manifest schema for defining shipping methods and their delivery times directly in an app's manifest.xml."
lastBuilt: "2026-09-15"
---
## What it is
An experimental (since 6.5.7.0) manifest-based mechanism for apps to add shipping methods to a shop, subject to change during development.

## When to use
Use when an app needs to provision shipping methods (with delivery time estimates, icons, tracking URLs) without a plugin.

## Key steps / config
Minimal manifest configuration:

```xml
<manifest xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-2.0.xsd">
    <shipping-methods>
        <shipping-method>
            <identifier>NameOfYourFirstShippingMethod</identifier>
            <name>First shipping method</name>
            <delivery-time>
                <id>c8864e36a4d84bd4a16cc31b5953431b</id>
                <name>From 2 to 4 days</name>
                <min>2</min>
                <max>4</max>
                <unit>day</unit>
            </delivery-time>
        </shipping-method>
    </shipping-methods>
</manifest>
```

`delivery-time` unit accepts `hour`, `day`, `week`, `month`, `year`. The `<identifier>` must remain unchanged — Shopware deactivates/deletes shipping methods no longer present in the manifest during app updates. The delivery-time `<id>` should be generated once and never changed (changing it creates a new delivery time). Extended fields: localized `<name lang="de-DE">`, `<description>` (and localized variants), `<icon>` (path relative to `manifest.xml`, e.g. `assets/icons/yourIcon.png`), `<active>` (`true`/`false`, default `false`), `<tracking-url>`, `<position>` (default `1`).

## Essential identifiers
- `shipping-methods`, `shipping-method`, `delivery-time` (manifest elements)
- `identifier`, `name`, `min`, `max`, `unit`, `icon`, `active`, `tracking-url`, `position`

## Gotchas
The manifest cannot modify the description or icon after the app has been installed — only the merchant can change them thereafter. Changing the shipping method `identifier` or the delivery-time `id` causes Shopware to treat them as new entities.

## Version notes
Available since Shopware 6.5.7.0 as an experimental feature; the functionality and API are subject to change.
