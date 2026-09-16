---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/apps/checkout/shipping-methods.md
sourceHash: 23feec5661e32ddd6434552375b8c59204c27c01
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/checkout/shipping-methods.html
title: Shipping Methods
version: "6.7"
versions:
  - "6.7"
keywords: ["shipping-methods", "shipping-method", "delivery-time", "tracking-url", "app shipping method", "delivery method", "versandart", "manifest.xml", "ShippingMethodLifecycleHandler", "technicalName", "lieferzeit"]
summary: "Declare app shipping methods in manifest.xml <shipping-methods>: identifier, name, required delivery-time, description, icon, active, tracking-url, position."
lastBuilt: 2026-09-15
---
## What it is

The `<shipping-methods>` section of an app's `manifest.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`) creates shipping methods in the shop when the app is installed or updated. Introduced in 6.5.7.0 as an experimental feature; the docs state API and functionality may change.

## When to use

An app needs to ship its own shipping methods (e.g. carrier integrations) with a default delivery time, icon, tracking URL and checkout position.

## Key steps / config

Minimal definition — `identifier`, `name` and `delivery-time` are required:

```xml
<shipping-methods>
    <shipping-method>
        <identifier>NameOfYourFirstShippingMethod</identifier>
        <name>First shipping method</name>
        <name lang="de-DE">Erste Versandmethode</name>
        <delivery-time>
            <id>c8864e36a4d84bd4a16cc31b5953431b</id>
            <name>From 2 to 4 days</name>
            <min>2</min>
            <max>4</max>
            <unit>day</unit>
        </delivery-time>
        <description lang="de-DE">...</description>
        <icon>assets/icons/yourIcon.png</icon>
        <active>true</active>
        <tracking-url>...</tracking-url>
        <position>2</position>
    </shipping-method>
</shipping-methods>
```

- `delivery-time`: `id` (UUID, generate once), translatable `name`, integer `min`/`max`, `unit` one of `hour`, `day`, `week`, `month`, `year`.
- `name`, `description`, `tracking-url` are translatable via the `lang` attribute.
- `icon`: path relative to `manifest.xml` (e.g. `assets/icons/yourIcon.png`).
- `active`: `true`/`false`, default `false`.
- `position`: checkout display order, default `1`.
- Core stores each method with `technicalName` `shipping_<appName>_<identifier>`.

## Essential identifiers

- `<shipping-methods>`, `<shipping-method>`, `<identifier>`, `<name>`, `<delivery-time>` (`<id>`, `<min>`, `<max>`, `<unit>`), `<description>`, `<icon>`, `<active>`, `<tracking-url>`, `<position>`
- `Shopware\Core\Framework\App\Manifest\Xml\ShippingMethod\ShippingMethod`
- `Shopware\Core\Framework\App\Lifecycle\Handler\ShippingMethodLifecycleHandler`

## Gotchas

- Keep `<identifier>` stable: methods are matched by identifier on update. Methods no longer in the manifest are **deactivated** (`active: false`) on app update, not deleted, in 6.7.13.0.
- Do not change the delivery time `id` — changing it creates a new delivery time.
- For an already existing method, an app update does not overwrite `name`, `description`, `icon`, `position`, `active` or `delivery-time` — the merchant owns them after installation. `tracking-url` is still written on update.

## Code check (6.7.13.0)
- confirmed `shipping-method` — XSD choice of identifier, name, description, active, delivery-time, icon, position, tracking-url — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:570
- confirmed `active` — boolean, default false — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:575
- confirmed `delivery-time-unit` — hour|day|week|month|year — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:541
- confirmed `ShippingMethod::REQUIRED_FIELDS` — identifier, name, deliveryTime — vendor/shopware/core/Framework/App/Manifest/Xml/ShippingMethod/ShippingMethod.php:17
- confirmed `ShippingMethodEntity::POSITION_DEFAULT` — default position 1 — vendor/shopware/core/Checkout/Shipping/ShippingMethodEntity.php:31
- confirmed `technicalName` — `shipping_%s_%s` from app name and identifier — vendor/shopware/core/Framework/App/Lifecycle/Handler/ShippingMethodLifecycleHandler.php:78
- corrected `ShippingMethodLifecycleHandler::deactivateOldShippingMethods()` — docs: removed methods are deactivated or deleted; code only deactivates — vendor/shopware/core/Framework/App/Lifecycle/Handler/ShippingMethodLifecycleHandler.php:132
- confirmed `ShippingMethodLifecycleHandler::persist()` — existing methods keep name/description/icon/position/active/deliveryTime (unset at line 92) — vendor/shopware/core/Framework/App/Lifecycle/Handler/ShippingMethodLifecycleHandler.php:54
