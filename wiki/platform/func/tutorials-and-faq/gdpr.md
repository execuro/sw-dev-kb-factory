---
id: platform/func/tutorials-and-faq/gdpr.md
title: Gdpr
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/gdpr
sourceHash: b5a8b49f1143054e354cb21fa08ca09caefd5b263e29b2cb7c2bb21ed263ba7a
revision: {current: true, range: "6.3.0", swMax: null, swMin: null}
keywords: ["GDPR", "personal data", "customer data", "IP addresses", "order_customer", "log_entry", "version_commit_data", "newsletter_recipient", "privacy policy", "cookie consent manager", "import/export", "general.privacyNotice", "expire_days", "shopware.yaml"]
summary: "Overview of personal data Shopware 6 stores (customer, orders, IPs, cookies), where, and how to export/delete it and configure privacy/cart-retention settings."
lastBuilt: "2026-09-15"
---
## What it is
A summary of what personal data Shopware 6 processes and stores, where it lives, and how the shop supports GDPR obligations (structured export, deletion, privacy-policy integration).

## When to use
When drafting a privacy policy or directory of processing activities for a Shopware store, or when needing to locate, export or delete personal data.

## Key steps / config
- Personal data locations: customer data in tables prefixed `customer*` (viewable under **Customers > Overview**); order data (including customer IP and referrer) in tables prefixed `order*` (**Orders > Overview**); newsletter signups in table `newsletter_recipient` (**Marketing > Newsletter Recipients**); form submissions emailed per shopping-experience form config; product reviews under **Catalogs > Reviews**; admin users under **Settings > User Management**; API access data retrievable via the Rest-API.
- IP addresses are stored by default in four places: `order_customer` (customer IP per order), `customer` (IP of the last order), `log_entry` (backend user activity), and `version_commit_data` (order-processing usage data).
- Cookies: session cookie (login/cart state), CSRF cookie, and a timezone cookie; only IDs are stored client-side, with data mapping done server-side.
- Structured data output: use the **Import/Export** function to export a customer's relevant data (CSV/XML), or query the `customer_*` tables directly via SQL.
- Deleting personal data: use the customer module in the admin (removes linked data automatically) and the newsletter module to remove recipients; Shopware provides admin-driven deletion of personal data on customer request.
- Privacy policy integration: a default Shopping Experience page "privacy" is linked in checkout/forms by default; select a custom one under **Settings > Shop > Basic information**. The registration text module `general.privacyNotice` links to it.
- Cookie Consent Manager: includes default Shopware cookies plus cookies from installed plugins; can be reopened via a link with destination `/cookie/offcanvas` added as a Link-type category (External).
- Abandoned shopping carts are deleted automatically; default retention is 120 days, configurable via `config/packages/shopware.yaml`:
```yaml
shopware:
  cart:
    expire_days: 1
```

## Essential identifiers
Tables: `customer*`, `order*`, `newsletter_recipient`, `order_customer`, `log_entry`, `version_commit_data`. Config key: `shopware.cart.expire_days`. Text module: `general.privacyNotice`. Link path: `/cookie/offcanvas`.

## Gotchas
Not all personal data processing is covered by this article — installed plugins can extend data storage, so each shop must be evaluated individually for additional personal data processing.
