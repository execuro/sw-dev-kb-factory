---
id: platform/func/saas/Frequently-asked-questions.md
title: Frequently Asked Questions
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/saas/Frequently-asked-questions"
sourceHash: "ef47e49b00b7e54e096703489d7909c7990436052cb24d2e0e856fe5366fef6a"
revision: { current: true, range: "current", swMax: null, swMin: null }
keywords: ["SaaS shop suspended", "shop lock", "maintenance mode", "IP whitelist", "test order", "support ticket", "Settings > System > Domains", "sales channel", "system backup", "system update", "support link", "extensions deactivation", "PayPal connection lost"]
summary: "SaaS-only FAQ: why shops get suspended, how to place test orders, activate maintenance mode, and get support or backups."
lastBuilt: "2026-09-15"
---
## What it is
This page collects frequently asked questions specific to a Shopware 6 SaaS shop: suspension causes, test orders, storefront display errors, maintenance mode, updates, and backups.

## When to use
Use this when a SaaS shop appears locked or suspended, when you need to test orders, troubleshoot a missing storefront, or find how backups and updates are handled.

## Key steps / config
- **Suspension**: three lock levels exist — storefront-only locked (admin still usable), storefront and admin both locked (viewable but not editable), or admin locked because the PayPal account is disconnected (link a new PayPal account to unlock).
- **Common suspension causes**: violation of applicable law; an unpaid invoice (collected via PayPal) — there is a 7-day window to update the payment method, during which the storefront stays reachable unless placed into maintenance mode; a lost PayPal connection — also a 7-day window to reconnect. After suspension ends, maintenance mode must be deactivated manually in Admin.
- **Test orders**: place them by being logged into both the admin and the store simultaneously in the same browser (no private/incognito session); a gray info message at the top of the storefront indicates test mode.
- **Technical issues**: first deactivate active extensions and re-check, since extensions can strongly affect the store; if the problem persists, create a support ticket via the Shopware account, under Support.
- **Storefront not displayed**: check whether a sales channel is assigned to the domain under **Settings > System > Domains**, and verify the domain is registered under the sales channel's **domains** area.
- **Maintenance mode**: activate it per sales channel under **Status**; the whitelist for IP addresses defines exceptions. Requires an already-booked plan.
- **System updates**: SaaS stores are updated automatically; incompatible extensions may be deactivated and must be updated/reactivated manually. Status of Shopware websites can be checked via the status page.
- **System backup**: a nightly automatic backup is created; restoration is technically possible but only carried out in special cases — contact support first.
- **Support link**: click the "?" icon in the top right of the admin, then "generate access link".

## Gotchas
An unpaid invoice or a lost PayPal connection each give only a 7-day grace period before the admin is blocked; maintenance mode must always be booked on a paid plan and deactivated manually after a suspension ends.
