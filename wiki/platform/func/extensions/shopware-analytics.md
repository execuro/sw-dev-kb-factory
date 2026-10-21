---
id: platform/func/extensions/shopware-analytics.md
title: Shopware Analytics
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/shopware-analytics
sourceHash: c3001b5c688ae830e8cb8c36959d8188bef9d4bac1dcdf017771845441937486
revision:
  current: true
  range: "2.10.0 - 2.12.0"
  swMax: "2.12.0"
  swMin: "2.10.0"
keywords: ["shopware analytics", "SwagAnalytics", "storefront tracking", "dashboard analytics", "app:url-change:resolve", "core.app.shopId", "conversion rate", "top search terms", "unique visitors", "page views", "copilot metrics", "event tracking", "statistiken"]
summary: Shopware Analytics extension - metrics in Dashboard > Analytics, storefront event tracking, Copilot metrics, troubleshooting and event payload keys.
lastBuilt: 2026-10-20
---
## What it is

Shopware Analytics is an extension that adds shop analyses under **Dashboard > Analytics**. It requires data sharing, calculates backend metrics from shop entities (orders, customers, payments) and storefront metrics from event tracking sent to Shopware-operated servers.

## When to use

Use this page to learn which metrics exist and how they are calculated, how to switch on storefront tracking, how to add Copilot-created metrics to dashboards, and how to fix activation errors (app URL change, staging copies).

## Key steps / config

- App versions: Shopware 6.5 uses app 1.4.x; Shopware 6.6 and higher uses 2.4.x.
- Filters: sales channel, country, customer group, customer account type (guest or registered), order status, payment status, delivery status; time period top right.
- Storefront tracking: open settings (top right), activate sales channels under **Storefront data tracking**, set up the cookie management tool via the **Setup guide**, then empty the cache under **Settings > System > Caches & Indices**. Introduced in app 2.4.0 / 1.4.0; standard storefronts only (composable/headless planned).
- Each statistic can be exported as CSV from its `...` menu.
- Copilot metrics (Shopware 6.7.9.0 or later): Dashboard > Analytics, Copilot button, describe the data, review, Approve; then **Move to dashboard**. A new dashboard must be renamed before another can be created. Needs Copilot Data Assistant plus Analytics; Copilot Data Insights and Agentic are part of Shopware Intelligence+ (ten free requests per month).

Backend metrics: Total sales, Orders, Average order value, Payment methods, Customers, New Customers, Discounts and promotions, Sales by manufacturer, Sales by country, Product sales, Shipping methods, Sales by channel (top five channels shown, rest grouped as "Others"). Storefront metrics: Page views, Unique visitors, Conversion rate (converted sessions / total sessions * 100; a session ends after 30 minutes of inactivity or a user change), Top search terms.

Top search terms are normalized before storing: control and zero-width characters removed, whitespace collapsed and trimmed, lowercased (`Red Shoes` becomes `red shoes`). Terms are skipped if empty after normalization or over 100 bytes. Not supported: stemming, accent normalization, typo correction, synonyms, Unicode normalization, stop-word removal.

Troubleshooting commands:

```
bin/console app:url-change:resolve
php bin/console app:url-change:resolve reinstall-apps
```

Event payload (always sent): `context.app`, `context.locale`, `context.page.*` (`path`, `referrer`, `search`, `title`, `url`), `context.screen.*`, `context.timestamp`, `context.timezone`, `context.userAgent`, `properties`, `timestamp`, `trackingId`, `type` (`page` | `track` | `identify`), `anonymousId`. Logged-in customers add `customer.customerGroupName`, `customer.customerGroupId`, `customer.guest`. Page views add `properties.category`, `properties.name`, `properties.path`, `properties.url`, plus `properties.storefrontAction`, `properties.storefrontCmsPageType`, `properties.storefrontController`, `properties.storefrontRoute`. Track events carry `eventName` (e.g. `order:created`) and `orderId`.

## Essential identifiers

- `SwagAnalytics` (app name), `APP_URL`, `core.app.shopId` (in the `system_config` table)
- `bin/console app:url-change:resolve`, strategy `reinstall-apps`
- Entities read: `order`, `order_line_item`, `order_transaction`, `order_delivery`, `order_address`, `order_customer`, `customer`, `customer_address`, `currency`, `payment_method`, `shipping_method`, `sales_channel`, `product`, `product_manufacturer`, `promotion`, `country`, `state_machine_state`

## Gotchas

- Some calculations run on the shop itself; large data volumes can affect performance.
- `App registration for 'SwagAnalytics' failed: The app url changed`: Shopware stops app requests when `APP_URL` differs from the one used to generate the shop ID. Resolve with `bin/console app:url-change:resolve` or the Administration modal.
- Missing activation buttons in settings: the shop cannot reach the App Server (local or restricted staging). Enable external communication, deactivate and reactivate Analytics, retry.
- Error `Shop is not active` on a staging copy: `core.app.shopId` in `system_config` was copied from live. Run `php bin/console app:url-change:resolve reinstall-apps` in the live document root, then reinstall the extension.
- Heavily customized shops may show inaccurate figures; correctness is only ensured for the standard setup.
- Conversion rate and Top search terms data is not read from the shop; it is stored on servers operated by Shopware.

## Version notes

Copilot integration needs Shopware 6.7.9.0; Top search terms needs 6.7.11.0 (older versions show an update notice).
