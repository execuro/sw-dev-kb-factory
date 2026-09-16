---
id: platform/func/saas/basic-information.md
title: Basic information
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/saas/basic-information"
sourceHash: "23272e199d5300c62d31f6397e05fb49312325a3b7102c9afc75f21462443e97"
revision: { current: true, range: "current", swMax: null, swMin: null }
keywords: ["basic information", "Settings > Shop > Basic information", "shop name", "shop owner email", "email sender address", "family friendly shop", "isFamilyFriendly", "shop pages", "shop page layout", "accept all cookies", "contact form required fields", "sales channel settings"]
summary: "Shop-wide and per-sales-channel basic settings: shop name, owner contact, custom sender domain, shop page layouts, and privacy options."
lastBuilt: "2026-09-15"
---
## What it is
This page documents the **Basic information** settings screen where shop-wide identity, contact, shop page layouts, and privacy/security options are configured, globally or per sales channel.

## When to use
Use this when setting up a shop's name, owner contact details, sender email domain, "family friendly" flag, shop page layouts, or cookie/contact-form privacy options.

## Key steps / config
Under **Settings > Shop > Basic information**, select a **sales channel** to scope the settings, then configure:
- **Shop name**, **Shop owner's email address**, **Email sender address** (requires a custom domain to be set up).
- **Family friendly shop** toggle — when active, sets the meta tag `isFamilyFriendly` for search engines.
- **Shop owner's address** and **Shop owner's bank information**.

**Shop pages** section defines the shop page layout used within storefront modal windows for: GTC pages, cancellation policies, shipping and payment methods, data protection pages, imprint, missing pages (404: page not found), maintenance, contact pages, and newsletter pages.

**Security and Privacy** section:
- **Show "accept all cookies" button** — displays a button in the storefront to accept all cookies.
- **First name in contact forms required** — makes the "First name" field mandatory on submit.
- **Last name in contact forms required** — makes the "Last name" field mandatory on submit.
- **Phone number in contact forms required** — makes the "Phone number" field mandatory on submit.

## Essential identifiers
- Admin path: **Settings > Shop > Basic information**.
- Meta tag: `isFamilyFriendly`.
