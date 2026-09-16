---
id: platform/func/settings/system/shopwareaccount.md
title: Shopwareaccount
docType: functional
version: "6.5"
versions:
  - "6.5"
  - "6.6"
  - "6.7"
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/system/shopwareaccount
sourceHash: d364fddfb5570be30af1fcaa8022229e739017a7a18a1095e1408624ffc20603
revision:
  current: true
  range: "6.0.0 - 6.3.4.1"
  swMin: "6.0.0"
  swMax: "6.3.4.1"
keywords: ["Shopware account", "license host", "self-hosted store", "domain verification", "verification checksum", "Settings > System", "booked plugins", "subscriptions"]
summary: "Self-hosted-only setting linking a Shopware 6 installation to a Shopware account via the License host field for booked plugins/subscriptions."
lastBuilt: "2026-09-15"
---

## What it is

This configuration, under **Settings > System**, links a self-hosted Shopware 6 installation to a Shopware account, granting access to booked plugins or subscriptions. It does not apply to Shopware 6 SaaS.

## When to use

Use it after registering a domain in the Shopware account, to connect that domain to the running installation.

## Key steps / config

1. Enter the host domain in the **License host** field, exactly matching the domain registered in the Shopware account (including a `www.` prefix if that was used when registering).
2. If the domain has not yet been verified, enter the verification checksum shown when the domain was added in the Shopware account.

## Essential identifiers

- Menu path: **Settings > System**
- Field: License host

## Gotchas

The License host value must match the registered domain exactly, including any `www.` prefix, or the connection fails.
