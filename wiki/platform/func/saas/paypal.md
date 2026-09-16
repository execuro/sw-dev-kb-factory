---
id: platform/func/saas/paypal.md
title: Paypal
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/saas/paypal"
sourceHash: "dd2a615051126700b7bd4ae2f4411fe732baa3eee4b71a9f2505e0f71c2f46d6"
revision: { current: true, range: "current", swMax: null, swMin: null }
keywords: ["PayPal extension", "PayPal test mode", "PayPal Express Checkout", "Pay Later banner", "Pay upon invoice", "Smart Payment Buttons", "Vaulting", "3D Secure", "merchant location", "Settings > Extensions", "sandbox account", "excluded products", "locale code", "installment payment"]
summary: "Configuring the PayPal extension in a SaaS shop: linking accounts, test mode, checkout options, Pay Later, and Smart Payment Buttons."
lastBuilt: "2026-09-15"
---
## What it is
This page documents the PayPal extension for a Shopware 6 SaaS shop: linking accounts, general behaviour settings, Express Checkout, Pay Later/installment payments, and Smart Payment Buttons.

## When to use
Use this when enabling PayPal as a payment method, testing PayPal purchases, configuring PayPal behaviour per sales channel, or setting up Express Checkout / Pay Later / Smart Payment Buttons on the storefront.

## Key steps / config
- **Installation**: no install step needed — the extension already exists under **Settings > Shop > Payment methods**; activate it and link a PayPal account via **Connect PayPal account**, entering PayPal login credentials in the modal that opens.
- **Test mode**: the **Test mode switch** connects the store to a general sandbox account for test purchases; these orders appear in the order overview but not in the real PayPal merchant account. Test mode is for evaluation only, not production.
- **Change/disconnect**: once connected, the status shows "Connected" with the account name; use **Change PayPal account** to switch accounts, or **Disconnect PayPal account** to remove the link. Only one PayPal account can be linked at a time.
- **General configuration** under **Settings > Extensions > PayPal**:
  - **Sales channels**: apply settings to all or individual sales channels; **Set PayPal as default** activates PayPal and makes it the default payment method for the selected channel.
  - **Behaviour**: **Merchant location**, **Payment acquisition** (when payment is collected/closed), **Submit cart** (whether cart line items, not just the total, are sent to PayPal), **Your own brand name on PayPal page**, **PayPal landing page** (registration form or login screen), **Submit order number** (with an **Order number prefix** option, e.g. `myShopSW20001`), **Excluded products**, and **Excluded dynamic product groups**.
  - **Vaulting (One-time Checkout)**: lets customers save PayPal data for future use; currently in beta.
  - **Credit- or debit card**: PayPal checks whether 3D Secure strong customer authentication is required; **Block payments from non-3DS countries**, if active, blocks cards when a 3DS check is unavailable.
  - **Pay upon invoice**: customer orders as a purchase on account; PayPal settles the invoice to the store operator, and the customer pays PayPal/Ratepay. A configuration field lets additional payment-method information be added to customer e-mails.
- **PayPal Express Checkout**: toggles for showing the Express button on the item detail page, shopping cart, off-canvas cart, login page, and listing pages; **Button color** (gold, blue, silver, black), **Button shape** (round or square), and **Button language** (locale code, e.g. `en_GB`; defaults to the sales channel language if empty), plus an option to display **'Pay Later'** next to the PayPal Checkout button.
- **'Pay Later' banner**: shown on the detail page, (off-canvas) cart, and payment step for eligible items; customers select PayPal in checkout and log in to see if installment payment is available. Requirements: Pay Later applies to a cart of 1–1,000 Euro; installment payment applies to a cart of 5–5,000 Euro. Configuration toggles control display on detail page, cart, off-canvas cart, login page, and footer.
- **Smart Payment Buttons**: shown when **Other merchant location** is selected under Behaviour; configuration includes enabling alternative payment methods, **Display Pay Later as a separate button** (30-day payment option), **Button color**, **Button shape**, and **Button language**.

## Essential identifiers
- Admin paths: **Settings > Shop > Payment methods**, **Settings > Extensions > PayPal**.
- Config fields: Merchant location, Payment acquisition, Submit cart, PayPal landing page, Submit order number, Order number prefix, Excluded products, Excluded dynamic product groups.
- Locale code example: `en_GB`.

## Gotchas
- Test mode must not be used in production; orders placed in test mode never appear in the real PayPal merchant account.
- Only one PayPal account can be connected at a time.
- Pay Later/installment payment eligibility is cart-value bound (1–1,000 Euro for Pay Later, 5–5,000 Euro for installment payment).
