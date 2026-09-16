---
id: platform/dev/6.7/resources/references/adr/2026-06-24-sales-channel-business-timezone.md
title: Sales-channel business timezone
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-06-24-sales-channel-business-timezone.html
sourceHash: 92a95bdb24b31057bd256605582a6d9113c46c2a
codeCheckedAgainst: "6.7.13.0"
keywords: ["businessTimeZone", "business_time_zone", "renderWithTimezoneOverride", "getBusinessTimeZone", "TwigEnvironment", "twig.date.timezone", "sales channel timezone", "document timezone", "mail timezone", "utc", "adr"]
summary: "Optional SalesChannel businessTimeZone renders documents/mails via TwigEnvironment::renderWithTimezoneOverride; NULL falls back to Twig default from 6.8"
lastBuilt: 2026-09-15
---
## What it is

An ADR (2026-06-24, area after-sales) adding an optional `businessTimeZone` field to sales channels. When set, it is the merchant-controlled timezone for server-side rendering of sales-channel output such as documents (and, per the ADR, mails), instead of whatever timezone the entry point happens to use (browser cookie in Storefront, user profile in Administration, UTC fallback elsewhere — see issue #15139).

## When to use

- Documents or other server-rendered sales-channel output show dates in UTC or in a timezone that depends on where the render was triggered (Storefront request, Administration, message queue).
- Writing a renderer that must apply one sales channel's timezone to a single Twig render.

## Key steps / config

1. Set `businessTimeZone` on the sales channel (DB column `business_time_zone`, a `TimeZoneField`, ApiAware, since 6.7.13.0). In the Administration it is an input on the sales channel detail base view.
2. Render through Shopware's Twig environment `Shopware\Core\Framework\Adapter\Twig\TwigEnvironment`, passing the timezone for that one call:

```php
return $this->twig->renderWithTimezoneOverride(
    $view,
    $parameters,
    $salesChannelContext->getSalesChannel()->getBusinessTimeZone(),
);
```

`renderWithTimezoneOverride(string|TemplateWrapper $name, array $context = [], \DateTimeZone|string|null $timezone = null)` sets the Twig `CoreExtension` timezone, renders, and restores the previous timezone in a `finally` block. An empty string is treated as `null`.

## Essential identifiers

- `businessTimeZone` / `business_time_zone` (sales channel field/column)
- `SalesChannelEntity::getBusinessTimeZone()` / `setBusinessTimeZone()`
- `TwigEnvironment::renderWithTimezoneOverride()`
- `TwigEnvironment::overrideTimezone()` (runtime override that remembers the originally configured timezone)
- `twig.date.timezone` (Twig default timezone config)

## Gotchas

- In 6.7 with `NULL`, `renderWithTimezoneOverride` just calls `render()` — existing behavior (including UTC fallback) is unchanged.
- In the installed 6.7.13.0 code, only the document template renderers (`Checkout/Document` and `Checkout/DocumentV2`) call `renderWithTimezoneOverride`; no mail renderer call site was found.
- A required field with a `UTC` default was rejected: UTC is the reported bug, and a backfill would override installations that configure `twig.date.timezone`.

## Version notes

- 6.7 (from 6.7.13.0): field is optional and opt-in; `NULL` keeps previous rendering.
- 6.8 (`v6.8.0.0` feature flag in code): with `NULL`, rendering falls back to Twig's configured default timezone captured before runtime overrides (e.g. the Storefront browser-timezone listener), so documents render identically regardless of entry point; the browser-timezone cookie no longer affects document rendering.

## Code check (6.7.13.0)
- confirmed `TwigEnvironment::renderWithTimezoneOverride()` — temporarily sets CoreExtension timezone and restores it — vendor/shopware/core/Framework/Adapter/Twig/TwigEnvironment.php:67
- confirmed `v6.8.0.0` — NULL falls back to configuredTimezone only when this flag is active — vendor/shopware/core/Framework/Adapter/Twig/TwigEnvironment.php:73
- confirmed `TwigEnvironment::overrideTimezone()` — keeps originally configured timezone as fallback — vendor/shopware/core/Framework/Adapter/Twig/TwigEnvironment.php:51
- confirmed `businessTimeZone` — TimeZoneField, ApiAware, Since 6.7.13.0 — vendor/shopware/core/System/SalesChannel/SalesChannelDefinition.php:127
- confirmed `SalesChannelEntity::getBusinessTimeZone()` — returns ?string — vendor/shopware/core/System/SalesChannel/SalesChannelEntity.php:1030
- confirmed `business_time_zone` — VARCHAR(255) column added by migration — vendor/shopware/core/Migration/V6_7/Migration1782308630AddBusinessTimeZoneToSalesChannel.php:27
- corrected `renderWithTimezoneOverride` — docs: used for documents and mails; only document renderers call it — vendor/shopware/core/Checkout/DocumentV2/Template/DocumentTemplateRenderer.php:78
- confirmed `sw_sales_channel_detail_base_general_input_business_time_zone` — Administration input block — vendor/shopware/administration/Resources/app/administration/src/module/sw-sales-channel/view/sw-sales-channel-detail-base/sw-sales-channel-detail-base.html.twig:228
- unverified `twig.date.timezone` — Symfony TwigBundle configuration, out of scope
