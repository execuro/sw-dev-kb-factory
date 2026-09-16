---
id: platform/func/extensions/shopware-analytics.md
docType: functional
title: Shopware Analytics
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/shopware-analytics
sourceHash: e1d81ba49497070b3bf6386cc31f5abf1a7a6fcb5c50157c285380487622c294
revision:
  current: true
  range: "1.9.1 - 1.9.1"
  swMax: "1.9.1"
  swMin: "1.9.1"
keywords: ["Shopware Analytics", "SwagAnalytics", "Dashboard > Analytics", "storefront tracking", "event tracking", "top search terms", "conversion rate", "core.app.shopId", "app:url-change:resolve", "sharing data", "backend metrics", "storefront metrics", "search term normalization", "Caches & Indices"]
summary: "Shopware Analytics app adds order/customer/storefront metrics under Dashboard > Analytics, driven by shared shop data and optional event tracking."
lastBuilt: "2026-09-15"
---
## What it is

Shopware Analytics is an app (`SwagAnalytics`) that adds order, customer, payment and storefront analytics under **Dashboard > Analytics**. It requires sharing shop data with Shopware and is available in two app-version lines: 1.4.x for Shopware 6.5 and 2.4.x for Shopware 6.6 and higher.

## When to use

Use it to review sales, order, customer and storefront behavior metrics (e.g. conversion rate, top search terms, sales by manufacturer/country/channel) without a separate BI tool.

## Key steps / config

- **Time period** selector (top right): fixed ranges (yesterday, last 6 months, current year, etc.) or a custom period.
- **Filter**: sales channel, country, customer group, customer account type (guest/registered), order status, payment status, delivery status.
- **Storefront tracking**: from app versions 2.4.0/1.4.0, event-tracking-based KPIs are available for standard storefronts (composable/headless frontends planned). Enable/disable per sales channel under **Storefront data tracking**, and configure a cookie management tool via the **Setup guide**; after (de)activating, clear the cache under **Settings > System > Caches & Indices**.
- Each statistic has an **...** context menu action: **Export as CSV**.
- **Top search terms** normalizes queries before storing: strips invalid/zero-width characters, collapses whitespace, trims, lowercases. Terms are excluded if empty after normalization, only whitespace/invalid characters, or over 100 bytes. No stemming, accent normalization, typo correction, synonym recognition, Unicode normalization or stop-word removal is applied. This metric requires Shopware **6.7.11.0** or higher; older versions show the metric with a notice to update.
- Backend metrics: Total sales, Orders, Average order value, Payment methods, Customers, New Customers, Discounts and promotions, Sales by manufacturer, Sales by country, Product sales, Shipping methods, Sales by channel (gross).
- Storefront metrics: Page views, Unique visitors, Conversion rate (= converted sessions / total sessions * 100; a session ends after 30 minutes of inactivity), Top search terms.
- Event data sent per event includes context fields such as `context.app`, `context.locale`, `context.page.path`, `context.page.referrer`, `context.page.search`, `context.page.title`, `context.page.url`, `context.screen.*`, `context.timestamp`, `context.timezone`, `context.userAgent`, `context.userAgentData`, `properties`, `timestamp`, `trackingId`, `type`, `anonymousId`; logged-in customers also send `customer.customerGroupName`, `customer.customerGroupId`, `customer.guest`. Storefront integration adds `properties.storefrontAction`, `properties.storefrontCmsPageType`, `properties.storefrontController`, `properties.storefrontRoute`.

## Essential identifiers

- App: `SwagAnalytics`
- Admin path: **Dashboard > Analytics**
- Config entry: `core.app.shopId` (`system_config` table)
- CLI: `bin/console app:url-change:resolve reinstall-apps`

## Gotchas

Large data volumes calculated on-instance can affect system performance. If `APP_URL` changes, Shopware stops sending requests to installed apps to prevent data corruption; resolve via the `bin/console app:url-change:resolve` command or the admin's url-change modal. On staging environments copied 1:1 from production, the shared `core.app.shopId` entry can cause connection problems — run `php bin/console app:url-change:resolve reinstall-apps` on the live system to regenerate the ID, then reinstall Analytics. Storefront tracking activation buttons can be missing if the environment cannot reach the App Server (e.g. restricted staging). No DPA is required for Shopware Analytics since it does not process personal data (only data listed in the Data Use Agreement, under GDPR Art. 28).

## Version notes

Top search terms requires Shopware 6.7.11.0 or higher; on older versions the metric is shown with an update notice instead of data.
