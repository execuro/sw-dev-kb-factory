---
id: platform/func/extensions/custom-popups-und-notifications.md
title: Custom Popups Und Notifications
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/custom-popups-und-notifications
sourceHash: 6e4502fe39ecc6a12ba0c5f9151d539131a41175da55f5bd59de3a186a1941de
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["custom popups", "notifications", "consent popup", "banner", "info popup", "newsletter registration popup", "Extensions My Extensions", "marquee", "cookie consent"]
summary: "Free extension adding a consent popup, banner, info popup and newsletter registration popup to inform or engage storefront visitors."
lastBuilt: 2026-09-15
---
## What it is
Custom Popups & Notifications is a free store extension that lets merchants show customers promotional or informational popups and banners: a consent popup, a banner, an info popup, and a newsletter registration popup.

## When to use
Use when you want to display store-wide announcements, request cookie/consent confirmation, or promote newsletter sign-up without custom development.

## Key steps / config
- Install: download for free from the Store, then install and configure under Extensions > My Extensions > Custom Popups & Notifications.
- Consent Popup fields: Sales channel, Show consent modal, Title, Description, Button label. The popup opens immediately on store visit and must be actively confirmed by the customer.
- Banner fields: Show banner, Banner is closable, Background color, Font color, Display as marquee (scrolling ticker instead of fixed text), Text. Displayed in the upper area of the storefront.
- Info Popup fields: Show info popup, Blur popup background, Popup title, Popup text, Popup image. Displayed to customers directly when the store is opened.
- Newsletter registration popup fields: Show newsletter registration popup, Show name input field, Headline, Text, Submit button text. Lets customers register for the newsletter directly from the popup.
- Each of the four elements (Consent Popup, Banner, Info Popup, Newsletter registration popup) is configured independently, per sales channel, and can be enabled or disabled via its own "Show ..." toggle.

## Essential identifiers
- Menu path: `Extensions > My Extensions > Custom Popups & Notifications`
- Configurable elements: `Consent Popup`, `Banner`, `Info Popup`, `Newsletter registration popup`

## Gotchas
- The consent popup must be actively confirmed by the customer before it disappears, unlike the banner and info popup, which are purely informational.
- The banner's "Display as marquee" option changes fixed text into a moving ticker; leaving it off keeps the text static.
