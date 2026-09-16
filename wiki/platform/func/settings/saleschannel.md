---
id: platform/func/settings/saleschannel.md
title: Saleschannel
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/saleschannel
sourceHash: 8a4ea1ad672cf039f21f0101ff75b36ad675c2cfc018d5fd963a84e75115d82e
revision:
  current: true
  range: "6.7.7.0 - 6.7.11.1"
  swMin: "6.7.7.0"
  swMax: "6.7.11.1"
keywords: ["sales channel", "bind customers to sales channel", "headless sales channel", "hreflang", "sales channel domains", "TRUSTED_PROXIES", "API access ID", "maintenance mode", "sales channel theme", "Google Analytics 4", "AI Copilot", "agentic files", "llms.txt", "agents.md", "ai-catalog.json"]
summary: How Shopware sales channels are created, configured (navigation, domains, payment/shipping, hreflang, API access, theme, analytics) and managed.
lastBuilt: 2026-09-15
---
## What it is

A sales channel connects a Shopware store to a distribution channel — the storefront, comparison portals, social shopping integrations, or a headless API-only channel. Sales channels are created and managed from the **Sales Channel** menu item in the Administration.

## When to use

Use this when adding a new storefront/headless channel, configuring its navigation/domains/payment/shipping, binding customers to it, or enabling analytics/AI features per channel.

## Key steps / config

- **Customer assignment**: **Shop > Log-in/sign-up > Bind customers to Sales Channel** restricts customer login to the sales channel they registered in; a customer using the same email in two channels with this active is treated as two separate customer records.
- **Add a sales channel**: click the plus icon next to **Sales Channel**; choose between an HTML storefront channel, a headless (API-only) channel, or a product comparison export.
- **General settings**: Name, Mark as favourite, Entry point main/footer/service navigation, Navigation levels, Customer group (default for new/anonymous visitors), Countries, Languages, Standard units of measurement.
- **Payment and shipping**: available payment methods + default, available shipping methods + default, available currencies + default, tax calculation method.
- **Hreflang**: marks language versions for search engines to avoid duplicate-content penalties; requires selecting a default domain as fallback.
- **Domains** (self-hosted): each domain has its own URL, language, currency, snippet set, and unit system, added via **Add Domain**; (cloud) a default URL is auto-generated, with custom domains added the same way after being registered under Settings > System > Domains. Proxy setups need the proxy IP recorded via the `TRUSTED_PROXIES` env entry in `.env` for IP whitelisting to work.
- **API access**: generates an API Access ID for the channel.
- **Status**: temporarily disable the channel, enable maintenance mode (shows only the maintenance layout), and whitelist IPs for access during maintenance.
- **Analytics**: Google Analytics 4 via a Measurement/Tracking ID; toggles for Activate Google Analytics, Anonymise IP, Track orders, Enhanced Conversions, Track offcanvas cart. Tracked events include files such as `add-to-cart.event.js`, `begin-checkout.event.js`, `purchase.event.js`, `view-item.event.js`.
- **Agentic files**: per-channel toggles to publish `llms.txt` (content overview for AI systems), `agents.md` (agent client guidance), and `ai-catalog.json` (Agentic Resource Discovery catalog).

## Essential identifiers

Env var `TRUSTED_PROXIES`; agentic files `llms.txt`, `agents.md`, `ai-catalog.json`; tracked event files (`*.event.js`) listed above.

## Gotchas

- The preinstalled Headless sales channel should never be deleted, since many extensions (including the B2B Suite) depend on it; it can instead be hidden by marking other channels as favourites.
- A domain should be stored with only one protocol (https or http) to avoid duplicate content; on cloud instances, server-side forwarding always routes traffic via https.
