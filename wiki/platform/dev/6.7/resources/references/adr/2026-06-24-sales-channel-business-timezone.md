---
id: platform/dev/6.7/resources/references/adr/2026-06-24-sales-channel-business-timezone.md
title: Sales-channel business timezone
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-06-24-sales-channel-business-timezone.html
sourceHash: 92a95bdb24b31057bd256605582a6d9113c46c2a
codeCheckedAgainst: "6.7.15.1"
keywords: ["businessTimeZone", "business_time_zone", "getBusinessTimeZone", "renderWithTimezoneOverride", "TwigEnvironment", "twig.date.timezone", "sales channel timezone", "document timezone", "mail timezone", "utc", "server-side rendering", "browser timezone cookie"]
summary: "Optional sales channel businessTimeZone field, applied to document rendering via TwigEnvironment::renderWithTimezoneOverride; NULL fallback changes in 6.8."
lastBuilt: 2026-10-21
---
## What it is

An ADR (2026-06-24, area: after-sales) adding an optional `businessTimeZone` field to sales channels. When set, it is the merchant-controlled timezone for server-side rendering of sales-channel output such as documents and mails. Persisted dates stay in UTC; the Storefront can set Twig's default timezone from the browser timezone cookie and the Administration formats with the user's profile timezone, so server-rendered documents previously had no consistent timezone and could fall back to UTC (issue #15139).

## When to use

- Documents (invoices, delivery notes) or other server-rendered output show times in UTC or in a timezone that depends on where rendering was triggered.
- Writing code that renders a Twig template for a sales channel and must apply the channel's business timezone.

## Key steps / config

1. Set the sales channel's `businessTimeZone` (DB column `business_time_zone`, a timezone field exposed via the API and in the Administration sales channel detail base view). It is nullable.
2. Render through Shopware's Twig environment with the override, which sets Twig's timezone for that one call and restores the previous value afterwards:

```php
return $this->twig->renderWithTimezoneOverride(
    $view,
    $parameters,
    $salesChannelContext->getSalesChannel()->getBusinessTimeZone(),
);
```

3. Leave the field `NULL` to keep existing behaviour in 6.7; existing sales channels and templates are unchanged.

## Essential identifiers

- `businessTimeZone` / `business_time_zone` on `SalesChannelDefinition` / `SalesChannelEntity`
- `SalesChannelEntity::getBusinessTimeZone()`
- `TwigEnvironment::renderWithTimezoneOverride()` (`Shopware\Core\Framework\Adapter\Twig\TwigEnvironment`)
- `twig.date.timezone` (Twig's configured default timezone)

## Gotchas

- An empty string passed as timezone is treated like `NULL`.
- In 6.7.15.1 the only callers of `renderWithTimezoneOverride` are the two document template renderers (Document and DocumentV2); no mail renderer call was found, so mails are not yet covered by the code.
- Rejected alternative: a required field with a `UTC` default backfilled by migration — `UTC` is the reported bug, and the backfill would override installs that set `twig.date.timezone`. Customer-timezone rendering stays a possible separate feature.

## Version notes

- 6.7: opt-in; `NULL` keeps the current render behaviour (including any runtime override from the Storefront browser-timezone listener).
- 6.8: with `NULL`, `renderWithTimezoneOverride` falls back to Twig's configured default timezone captured before runtime overrides, so documents render in the same timezone from a Storefront request, the Administration or the message queue, and the browser-timezone cookie no longer affects document rendering. In code this is gated by the `v6.8.0.0` major flag.

## Code check (6.7.15.1)
- confirmed `businessTimeZone` — `TimeZoneField('business_time_zone', 'businessTimeZone')`, ApiAware, since 6.7.13.0 — vendor/shopware/core/System/SalesChannel/SalesChannelDefinition.php:130
- confirmed `SalesChannelEntity::getBusinessTimeZone()` — returns `?string` — vendor/shopware/core/System/SalesChannel/SalesChannelEntity.php:1030
- confirmed `TwigEnvironment::renderWithTimezoneOverride()` — `(name, context, DateTimeZone|string|null timezone)`, restores previous timezone in `finally` — vendor/shopware/core/Framework/Adapter/Twig/TwigEnvironment.php:81
- confirmed `TwigEnvironment::$configuredTimezone` — used as NULL fallback only when `v6.8.0.0` is active — vendor/shopware/core/Framework/Adapter/Twig/TwigEnvironment.php:88
- confirmed `TwigEnvironment::overrideTimezone()` — runtime override that remembers the configured timezone; called by the Storefront date request listener — vendor/shopware/core/Framework/Adapter/Twig/TwigEnvironment.php:65
- confirmed `renderWithTimezoneOverride` — document renderer passes the sales channel business timezone — vendor/shopware/core/Checkout/Document/Twig/DocumentTemplateRenderer.php:83
- confirmed `businessTimeZone` — Administration sales channel detail binds the field — vendor/shopware/administration/Resources/app/administration/src/module/sw-sales-channel/view/sw-sales-channel-detail-base/sw-sales-channel-detail-base.html.twig:231
- unverified `twig.date.timezone` — TwigBundle configuration, vendor/symfony, out of scope
