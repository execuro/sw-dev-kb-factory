---
id: platform/dev/6.6/concepts/commerce/catalog/sales-channels.md
title: Sales Channels
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/commerce/catalog/sales-channels.html
sourceHash: 1fcfcfd0cbaf7fe5ced93941ad1b5da8ceb963fc
keywords: ["sales channel", "sales channels", "multi-store", "storefront", "api consumer", "feed export", "social channel", "sales channel domain", "access key", "locale", "currency", "snippet set"]
summary: "Sales channels run several stores from one Shopware instance; domains set language, currency and snippet set per URL; API clients use an access key."
lastBuilt: 2026-09-15
---
## What it is

A sales channel is the Shopware concept for operating multiple separate stores from a single Shopware instance. Each sales channel can be configured independently by:

- Channel type: Storefront, API consumer, feed export, social channels
- Appearance: themes, for Storefront sales channels
- Payment methods
- Languages
- Currencies
- Domains
- Prices
- Products and categories

## When to use

Use this page when you need to understand how one installation serves several customer-facing shops, how a request is mapped to the right store (by URL or by access key), or how per-domain language and currency defaults are resolved.

## Key steps / config

### Store separation

- Sales channels give a *logical* separation of the stores customers see. They are not separated in the backend: any admin user can still see orders, products, prices, and so on from every sales channel.
- Sales channels are usually identified by their URL.
- Clients without a URL (mobile applications, integrations with other distribution channels such as social media platforms) identify the correct sales channel with an *access key* when they call the API.

### Domains

A sales channel can have multiple associated domain configurations. A domain resolves pre-configured currency, snippet set and language based on the route. Example set-up from the source:

| Domain | Locale | Language | Currency |
|---|---|---|---|
| `https://example.com/` | `en-GB` | British English | Pounds |
| `https://example.com/de` | `de-DE` | German | Euro |
| `https://example.es/` | `es-ES` | Spanish | Euro |

The same host can carry several domains distinguished by path (`/` vs. `/de`), and different hosts can belong to the same sales channel.

## Essential identifiers

- Sales channel types: Storefront, API consumer, feed export, social channel
- Sales channel access key (identifies headless/API clients)
- Sales channel domain (maps URL to locale, language, currency, snippet set)

## Gotchas

- Sales channels do not restrict admin visibility: backend users see data from all sales channels, so they are not a tenant or permission boundary.
- Themes apply only to Storefront-type sales channels.
- A client without a URL cannot be resolved by domain; it must send the access key.
