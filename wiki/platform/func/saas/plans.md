---
id: platform/func/saas/plans.md
title: Plans
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/saas/plans
sourceHash: d6f845c4f3277c19230f5001528918103a4999203276fa12abe687ee0a053b95
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["plans", "SaaS plan", "booked edition", "Rise", "Evolve", "Beyond", "PayPal", "billing information", "company data", "fees", "book now"]
summary: "How to book and manage a Rise, Evolve or Beyond plan for a Shopware SaaS instance, including PayPal billing prerequisites."
lastBuilt: 2026-09-15
---
## What it is
This page explains how to book and manage a functional plan (Rise, Evolve or Beyond) for a Shopware SaaS instance, including the required billing setup.

## When to use
Use when activating or changing a SaaS instance's booked plan, or when setting up billing prerequisites (company data, PayPal) before booking.

## Key steps / config
- Prerequisites: company/billing data under Settings > Account > Company, and a connected PayPal account under Settings > Account > Payment method (PayPal is used to invoice SaaS fees).
- Admin area: view the currently booked plan (Rise, Evolve or Beyond) under Settings > Account > Booked edition, including activation date, next invoice date and invoice email; billing data is pulled from the connected Shopware account if the shop was created from it, otherwise it is checked/edited under Settings > Account > Company.
- Shopware account: under Merchant area > Shops you see all SaaS shops and their currently booked plan; click "book now" to book a plan, or "create new shop" to start the shop-creation assistant.
- Booking from the Shopware account: clicking "Book now" opens a contact/booking dialog; stored default billing information is reused automatically, otherwise you are prompted to fill it in; PayPal must be set as the default payment method in the Shopware account, added via Accounting > Add payment method > Register PayPal account.
- Fees are made up of the monthly basic fee for the booked plan.

## Essential identifiers
- Plans: `Rise`, `Evolve`, `Beyond`
- Menu path: `Settings > Account > Booked edition`

## Gotchas
- Verifying a new PayPal account triggers a small test charge that is credited back shortly afterwards.
