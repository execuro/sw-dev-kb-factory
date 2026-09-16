---
id: "platform/func/getting-started/create-shopware-account.md"
title: "Create Shopware Account"
docType: "functional"
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/getting-started/create-shopware-account"
sourceHash: "4b45632bece7b8cde4d029e4cd2299effb6a995e966b4e0ab9c49159b8332548"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["shopware account", "create account", "master data", "shop domain", "sw-domain-hash.html", "payment method", "PayPal", "SEPA direct debit", "top up account", "purchase extensions", "booking domain", "customer number", "merchant shops"]
summary: "Creating and using a Shopware Account: registration, master data, linking a shop domain, payment methods, and purchasing extensions."
lastBuilt: "2026-09-15"
---
## What it is
The Shopware Account is the central hub for services related to using Shopware: an overview of shop plans, support information, offering/purchasing extensions in the store, and managing software and extension subscriptions. It replaces the former Shopware ID, now superseded by user administration.

## When to use
Use it when setting up a new Shopware Account, linking a shop domain to it, adding a payment method, or purchasing extensions.

## Key steps / config
- Register: open `https://account.shopware.com/register`, fill in email, first name, last name, salutation, language and password, then click **Create account**.
- Log in at `https://account.shopware.com/` with your credentials; after first login, complete your profile to finish basic setup.
- Provide accurate master data (address, email, phone, exact company/trade name); an EU VAT ID is required for net invoices, otherwise gross invoices are issued. The 8-character customer number encodes a 6-digit customer id plus a 2-digit suffix (`00` = manual invoice, `01`/`02`/`03`... = domain-linked invoice).
- Add a shop: select **Merchant > Shops**, click **Register a store**, choose a new SaaS shop or an existing self-hosted shop, enter the shop domain and Shopware version and usage type, keep `sw-domain-hash.html` on the server until domain verification completes, then confirm the terms and conditions.
- Add a payment method under **Account > Accounting**: PayPal (requires authorizing "merchant debit with debit agreement"), credit card (Mastercard/Visa), or SEPA BASIS direct debit (euro accounts only).
- Top up the account (minimum 5.00 EUR), per shop domain, under **Merchant > Shops > Shop details > Account details**, or pay via PayPal to `finance@shopware.com`, stating the customer number and domain.
- Purchase extensions: accept the store terms and conditions and have a payment method deposited, then buy either via the Store (verify the booking domain matches the intended shop domain at checkout) or via the Administration's **Extensions > Store** section.

## Essential identifiers
- `Merchant > Shops`
- `Account > Accounting`
- `sw-domain-hash.html`

## Gotchas
Client and agency master data must not be mixed. Selecting the wrong booking domain or shop domain at checkout can cause billing problems or leave the extension unusable in the intended shop.
