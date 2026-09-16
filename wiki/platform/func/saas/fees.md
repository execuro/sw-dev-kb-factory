---
id: platform/func/saas/fees.md
title: Fees
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/saas/fees"
sourceHash: "91e9945b574cf15d399b53294bf12e8215266287ed0913459bd139d01a964655"
revision: { current: true, range: "current", swMax: null, swMin: null }
keywords: ["SaaS fees", "billing interval", "revenue share", "plan booking", "PayPal debit 0.01", "shop deletion", "Settings > Account > Deletion", "invoice", "Shopware account", "posting interval", "sales commission"]
summary: "How SaaS plan fees, the monthly billing interval, revenue-share bookings, and the 0.01€ PayPal verification debit work, plus shop deletion."
lastBuilt: "2026-09-15"
---
## What it is
This page documents how fees for a Shopware 6 SaaS shop are structured, when invoices are issued, and how to delete a SaaS shop entirely.

## When to use
Use this when trying to understand plan billing, locating booking/revenue-share details, understanding the 0.01€ PayPal debit, or when planning to terminate a SaaS shop.

## Key steps / config
- To book a plan, contact Sales (reachable Monday–Thursday 09:00–17:00 and Friday 09:00–15:00 via `customer@shopware.com`) so the right plan can be offered per project.
- Test orders and orders placed by the merchant/store operator are included in the fee calculation, since the new license and pricing model.
- Daily calculated revenue share details are found in the shop merchant area of the Shopware account, by selecting the SaaS shop and opening its details via the domain.
- **Billing interval**: invoices are issued at the monthly posting interval starting from the date of the first plan booking (e.g. booked on the 15th runs 15th–14th of the following month); invoices are retrievable from the Shopware account, in the shop's account details.
- **0.01€ PayPal debit**: after the first plan booking, PayPal is debited 0.01€ once to verify the account, and the full amount is credited back to the Shopware account balance, to be offset against future sales-commission billing.
- **Deleting a shop**: use **Settings > Account > Deletion** in the administration to terminate and completely delete the shop (it becomes inaccessible); no proportional refund of the basic fee for the current interval is given.

## Essential identifiers
- Admin path: **Settings > Account > Deletion**.
- Sales contact: `customer@shopware.com`.

## Gotchas
Deleting a shop is final — the shop can no longer be accessed, and there is no partial refund of the current interval's basic fee.
