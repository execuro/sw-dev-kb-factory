---
id: platform/func/tutorials-and-faq/basic-setup.md
title: Basic Setup
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/basic-setup
sourceHash: 3a9202ee625c5ed4bcef3d54a75369d11d1e569e2c83f44ae3b7510d8bda0ae7
revision: {current: true, range: "6.1.0 - 6.3.5.2", swMax: "6.3.5.2", swMin: "6.1.0"}
keywords: ["basic setup", "information pages", "footer navigation", "service menu", "category tree", "shopping experiences", "entry point", "footer.serviceHotlineHeadline", "footer.serviceHotline", "shop pages", "imprint", "privacy policy", "terms and conditions"]
summary: "How to build footer/service-menu info pages (imprint, privacy, T&C) via categories and shopping experiences; assign as sales-channel entry points."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to set up the legal/information pages (imprint, privacy policy, terms and conditions) that Shopware does not create automatically during installation, using categories and shopping experiences.

## When to use
When a new shop needs footer and service-menu information pages, or when assigning shop pages for terms/conditions, revocation notice, shipping/payment info and privacy.

## Key steps / config
1. Create a category structure for the menus: use the **"..."** context-menu button, **new category after** for "Footernavigation", then **new subcategory** repeatedly (e.g. "Shopservice" and its children). Activate every created category, including the top category.
2. Assign a shopping-experience layout (shop-page type) to each category via **Layout** / **Layout assignment**. Default layouts exist for Imprint, Privacy Policy and Terms and Conditions and can be edited directly.
3. In the sales channel's **General Settings**, set the **entry point for the footer navigation** and, optionally, a separate **entry point for the service navigation** (defaults to showing the service menu under the footer menu).
4. The footer shows menus in 3 columns; the first entry is the service hotline, customizable via the text modules `footer.serviceHotlineHeadline` and `footer.serviceHotline`. More than 2 own footer columns adds an extra row.
5. For links to information pages (privacy in registration, T&C/revocation in checkout): create shop pages under **Contents > Shopping Experiences**, then assign them under **Settings > Basic information** in the **shop pages** section.

## Essential identifiers
- Text modules: `footer.serviceHotlineHeadline`, `footer.serviceHotline`
- Admin paths: **Contents > Shopping Experiences**, **Settings > Basic information > shop pages**, sales channel **General Settings**

## Gotchas
The top category in the menu structure must be active, or the whole substructure will not display.
