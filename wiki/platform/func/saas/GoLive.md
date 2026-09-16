---
id: platform/func/saas/GoLive.md
title: GoLive
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/saas/GoLive"
sourceHash: "41b8f6f97af7e300b5dcf263f1a6ac5b952b7a91bf65dea56bacf4dd45d24a65"
revision: { current: true, range: "current", swMax: null, swMin: null }
keywords: ["GoLive", "Book Now", "trial period", "Shopware Rise", "Shopware Evolve", "Shopware Beyond", "VAT identification number", "billing information", "connect PayPal", "Settings > Company", "legal texts", "shipping methods", "payment methods", "SaaS onboarding"]
summary: "Steps to go live with a Shopware SaaS shop: choose a plan, enter billing/VAT data, connect PayPal, and finish legal, product and shipping setup."
lastBuilt: "2026-09-15"
---
## What it is
This page documents what is needed when clicking **Book Now** in the admin to move a Shopware SaaS shop out of its trial period and go live.

## When to use
Use this when the 30-day SaaS trial is ending and the shop needs a plan, billing details, and a payment method before launch, or as a checklist of remaining setup tasks.

## Key steps / config
1. **Select a plan**: during the 30-day trial, book **Shopware Rise**, **Shopware Evolve**, or **Shopware Beyond**, or switch to a self-hosted store instead.
2. **VAT identification number**: under **Settings > Company**, choose **I own a VAT ID**, **I do not have a VAT ID**, or **I am a small tradesman**. The VAT ID must not be confused with a (turnover) tax number or the Swiss VAT ID.
3. **Billing information**: mandatory fields (marked with an asterisk) include Company name, Sector of industry, E-mail, Street, Zip code, City, Country; Email address for reminders is optional.
4. **Connect PayPal** (under **Settings > Account > Payment**): click **connect new PayPal account**, then log in or create a PayPal account; PayPal is the default payment method used to charge SaaS expenses.
5. Review the **Overview**: Company, Selected plan, Payment method, and a link to Shopware Account Settings.
6. Complete the dashboard checklist before launch: update legal texts (imprint, terms and conditions, privacy policy, cancellation policy) under **Content > Shopping Experiences**, whose category assignments live under **Catalogues > Categories** (Footer Menu > Legal); create products under **Catalogues > Products**; set up a theme under **Themes**; configure shipping under **Settings > Shop > Shipping**; configure payment methods under **Settings > Shop > Payment methods** (defaults: cash on delivery, advance payment, invoice).

## Essential identifiers
- Admin paths: **Settings > Company**, **Settings > Account > Payment**, **Content > Shopping Experiences**, **Catalogues > Categories**, **Catalogues > Products**, **Themes**, **Settings > Shop > Shipping**, **Settings > Shop > Payment methods**.
- Plans: **Shopware Rise**, **Shopware Evolve**, **Shopware Beyond**.

## Gotchas
Legal-text shopping experiences ship with dummy "Lorem ipsum" text that must be edited and saved before launch; the VAT ID field must not be used for a tax number or the Swiss VAT ID.
