---
id: platform/func/saas/delete-the-hubspot-cookie.md
title: Delete The Hubspot Cookie
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/saas/delete-the-hubspot-cookie"
sourceHash: "cd457c7acec1bfb111c8770b2c28e065a10174ee1a881638889935cef90455f9"
revision: { current: true, range: "current", swMax: null, swMin: null }
keywords: ["LiveChat", "hubspot cookie", "messagesUtk", "browser console", "developer tools", "storage inspector", "web inspector", "cookie removal", "Chrome", "Firefox", "Safari", "SaaS chat"]
summary: "How to remove the messagesUtk cookie in Chrome, Firefox, or Safari to re-enter your email in the SaaS LiveChat."
lastBuilt: "2026-09-15"
---
## What it is
This page documents how to remove the browser cookie that ties the SaaS environment's LiveChat to a mistyped email address, so the correct email can be entered again.

## When to use
Use this when the LiveChat asks for an email address you mistyped, preventing correct recognition; removing the cookie lets you re-enter the address.

## Key steps / config
- **Chrome**: open the browser console for the administration tab (F12, or the menu items icon > **More Tools** > **Developer Tools**). Switch to the **Cookies** tab, find the entry named `messagesUtk`, right-click it, and select **Remove Cookie**.
- **Firefox**: open the browser console (Shift+F9, or the three-dashes menu > **Web Developer** > **Storage Inspector**). In the **storage** tab, open **Cookies** for the administration's domain, select the `messagesUtk` entry, right-click, and select the delete entry (labelled with the domain, e.g. `"messagesUtk-domaindeinesshops" delete`).
- **Safari**: open the browser console via the Developer menu's **Show web inspector**. In the **Storage** tab, open **Cookies** for the administration's domain, select the `messagesUtk` entry, right-click, and choose the delete entry.
- After removing the cookie, reopen the chat in the administration and enter the email address again.

## Essential identifiers
- Cookie name: `messagesUtk`.
