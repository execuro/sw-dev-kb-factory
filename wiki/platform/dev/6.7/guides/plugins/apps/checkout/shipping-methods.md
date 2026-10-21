---
id: platform/dev/6.7/guides/plugins/apps/checkout/shipping-methods.md
title: Shipping Methods
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/checkout/shipping-methods.html
sourceHash: 89ef96c339571da6a74a57cffc12d5cc0ede7c12
codeCheckedAgainst: "6.7.15.1"
keywords: ["shipping-methods", "shipping-method", "delivery-time", "tracking-url", "manifest.xml", "manifest-3.0.xsd", "app shipping method", "shipping", "delivery time unit", "versandart", "app manifest", "checkout"]
summary: Declaring app shipping methods in manifest.xml via shipping-methods/shipping-method, with delivery-time, icon, active, position and tracking-url.
lastBuilt: 2026-10-21
---
## What it is

Apps can add shipping methods to a shop declaratively through the `<shipping-methods>` block of the app `manifest.xml`. Introduced in 6.5.7.0 as an experimental feature; the docs state the functionality and API may still change.

## When to use

You are building an app (not a plugin) and want the shop to get one or more shipping methods on app install, with an initial delivery time, description, icon, position and tracking URL.

## Key steps / config

1. Use the manifest schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/Framework/App/Manifest/Schema/manifest-3.0.xsd`.
2. Add one `<shipping-method>` per method inside `<shipping-methods>`. Required children: `<identifier>`, `<name>`, `<delivery-time>`.
3. `<delivery-time>` requires `<id>` (a UUID, generate once and never change), `<name>` (translatable), `<min>`, `<max>` (integers) and `<unit>` — one of `hour`, `day`, `week`, `month`, `year`.
4. Optional children: `<description>` (translatable via `lang`), `<icon>` (path relative to `manifest.xml`, e.g. `assets/icons/yourIcon.png`), `<active>` (`true`/`false`, default `false`), `<position>` (int, default `1`), `<tracking-url>` (translatable).

```xml
<shipping-methods>
    <shipping-method>
        <identifier>NameOfYourFirstShippingMethod</identifier>
        <name>First shipping method</name>
        <name lang="de-DE">Erste Versandmethode</name>
        <delivery-time>
            <id>c8864e36a4d84bd4a16cc31b5953431b</id>
            <name>From 2 to 4 days</name>
            <min>2</min><max>4</max><unit>day</unit>
        </delivery-time>
        <description>...</description>
        <icon>assets/icons/yourIcon.png</icon>
        <active>true</active>
        <tracking-url>https://www.yourtrackingurl.com</tracking-url>
        <position>2</position>
    </shipping-method>
</shipping-methods>
```

The installed code derives the shipping method's `technicalName` as `shipping_<appName>_<identifier>`.

## Essential identifiers

- `<shipping-methods>`, `<shipping-method>`, `<identifier>`, `<delivery-time>`, `<tracking-url>`, `<position>`, `<active>`, `<icon>`
- `Shopware\Core\Framework\App\Manifest\Xml\ShippingMethod\ShippingMethod`
- `ShippingMethodLifecycleHandler` (persists app shipping methods on install/update)

## Gotchas

- Keep `<identifier>` stable. On app update, methods no longer in the manifest are deactivated (`active => false`) by the installed code; the docs say "deactivate or delete".
- Once a method exists, an app update does not overwrite `name`, `description`, `icon`, `position`, `active` or `deliveryTime` — the merchant owns them. The docs state this for description and icon; the code applies it to all six.
- Changing the delivery time `<id>` creates a new delivery time.
- The icon is only imported on first install, and only if the file exists in the app and a MIME type can be detected.
- `<tracking-url>` is translatable in the installed code (`lang` attribute), which the docs do not mention.

## Version notes

Available since 6.5.7.0, marked experimental in the docs.

## Code check (6.7.15.1)
- confirmed `ShippingMethod::REQUIRED_FIELDS` — identifier, name, deliveryTime are required — vendor/shopware/core/Framework/App/Manifest/Xml/ShippingMethod/ShippingMethod.php:17
- confirmed `tracking-url` — translatable like name and description — vendor/shopware/core/Framework/App/Manifest/Xml/ShippingMethod/ShippingMethod.php:26
- confirmed `ShippingMethodEntity::POSITION_DEFAULT` — default position 1 — vendor/shopware/core/Checkout/Shipping/ShippingMethodEntity.php:34
- confirmed `active` — xs:boolean, default false — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:588
- confirmed `delivery-time-unit` — pattern hour|day|week|month|year — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:554
- confirmed `delivery-time` — requires id, name, min, max, unit — vendor/shopware/core/Framework/App/Manifest/Schema/manifest-3.0.xsd:559
- confirmed `technicalName` — built as shipping_<appName>_<identifier> — vendor/shopware/core/Framework/App/Lifecycle/Handler/ShippingMethodLifecycleHandler.php:78
- corrected `ShippingMethodLifecycleHandler::deactivateOldShippingMethods()` — docs: removed methods are deactivated or deleted; code only deactivates — vendor/shopware/core/Framework/App/Lifecycle/Handler/ShippingMethodLifecycleHandler.php:132
- confirmed `ShippingMethodLifecycleHandler::persist()` — existing methods keep name/description/icon/position/active/deliveryTime on update — vendor/shopware/core/Framework/App/Lifecycle/Handler/ShippingMethodLifecycleHandler.php:54
