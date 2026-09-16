---
id: "platform/dev/6.6/resources/references/adr/2020-08-14-merchant-registration.md"
title: "Merchant registration"
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-08-14-merchant-registration.html"
sourceHash: "2f53e129ad4d754e9842b2bca1aef46338c3b4ec"
keywords: ["merchant registration", "customer group registration", "requestedGroupId", "StoreApiRoute", "seo-url route", "customer-group-registration config endpoint", "desired customer group", "shop owner acceptance", "headless sales channel", "customer registration endpoint"]
summary: "ADR: merchant registration is implemented generically as customer-group registration, approved/declined by the shop operator via requestedGroupId."
lastBuilt: "2026-09-15"
---
## What it is

This ADR describes the design for merchant registration in Shopware 6, implemented generically as a customer-group registration mechanism rather than a merchant-specific feature, since the core does not react to "merchant" customer groups in any special way.

## When to use

Applies when building or extending a storefront/headless flow where customers register into a specific customer group via a dedicated URL and require shop-owner approval before being switched to that group.

## Key steps / config

- The shop owner enables customer group registration for a customer group and generates a URL; this URL is shared with customers via footer, social media, or mails.
- The customer registers on an individual registration page reachable via that URL.
- The customer account is created immediately in the default customer group — registration is not blocked pending approval.
- The shop operator accepts or declines the merchant registration from the admin's customer module, which is extended with an accept/decline button.
- On acceptance, the customer's group is switched and the stored "desired customer group" is reset to zero.
- Implementation stores an additional foreign key (desired customer group) on the customer, considered by the `StoreApiRoute` and persisted with the customer.
- Headless frontend flow: resolve the URL via the seo-url store API route to obtain the foreign key, call the customer-group-registration config endpoint with that foreign key to fetch the form configuration, then submit the registration to the customer registration endpoint including `requestedGroupId`.

## Essential identifiers

- `StoreApiRoute`
- `requestedGroupId`
- customer-group-registration config endpoint
- seo-url store API route
- customer registration endpoint

## Gotchas

Registration always creates a customer account even if the group-change request is later declined by the shop operator — the account itself is not held back pending approval.
