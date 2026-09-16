---
id: platform/func/tutorials-and-faq/affiliateprogram.md
title: Affiliateprogram
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/affiliateprogram
sourceHash: ba4595a87f28a3be15db0e1b552263eefddbf1c4bf9e93a5c2e63c43881c0ac3
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["affiliate program", "affiliateCode", "campaignCode", "partner marketing", "affiliate URL", "campaign URL", "combined URL", "customer overview", "order overview", "affiliate code filter", "campaign code filter"]
summary: "Merchants track referral sales by appending affiliateCode/campaignCode query parameters to shop URLs; codes are stored on orders/customers without cookies."
lastBuilt: "2026-09-15"
---
## What it is

The affiliate program lets merchants evaluate direct links from partner platforms by attributing customers and orders to a partner via a URL parameter, without using cookies since codes are stored directly in the database.

## When to use

Use this to give partners a percentage of sales for referring customers, or to track which comparison portal, ad or banner customers arrive from.

## Key steps / config

- **Affiliate URL**: append `?affiliateCode=` followed by a custom code to the shop URL (e.g. to the shop root or a category URL) to track which partner referred a customer.
- **Campaign URL**: append `?campaignCode=` followed by a custom code to track a specific banner or ad campaign.
- **Combined URL**: both parameters can be combined in one URL, e.g. `?affiliateCode=<code>&campaignCode=<code>`.
- The affiliate/campaign code is stored on the order or the created customer account whenever a customer places an order or registers via such a URL.
- Affiliate URLs are not created inside the Shopware 6 Admin; they are built by appending the query syntax to the shop URL yourself.
- Codes can be shown as **Affiliate Code** and **Campaign Code** columns (enable via the context menu) in both the customer overview and the order overview, and both overviews support filtering by a specific code.

## Essential identifiers

- Query parameters: `affiliateCode`, `campaignCode`
- Admin locations: customer overview, order overview (Affiliate Code / Campaign Code columns and filters)

## Gotchas

- Since codes are stored in the database rather than cookies, the affiliate/campaign link effectively does not expire.
- In the customer overview, a code is only assigned when the customer registers via the tracked URL; an already-registered customer placing an order via the URL does not get a new code on their customer record, though the order itself still receives the code.
