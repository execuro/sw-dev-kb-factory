---
id: platform/func/tutorials-and-faq/customers-vat-id.md
title: Customers Vat Id
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/customers-vat-id
sourceHash: fea7dc28f4bec17c1a049e16cb230b4d7a89c8a6ea79c6e3a301d27fcc7f7655
revision: {current: true, range: "6.3.4.0 - 6.3.4.1", swMax: "6.3.4.1", swMin: "6.3.4.0"}
keywords: ["VAT ID", "commercial customer", "customer account", "customer details", "login registration", "invoice", "edit mode", "profile", "business customer", "tax ID", "6.3.5.0"]
summary: "Where a customer's VAT ID is entered, viewed and edited in admin/customer account, and since when it prints on invoices."
lastBuilt: "2026-09-15"
---
## What it is
Explains where a customer's VAT ID is used and can be edited, for commercial (business) customers only.

## When to use
When you need to display, edit, or troubleshoot a customer's VAT ID in the admin or customer account, or understand why it appears on invoices.

## Key steps / config
- The VAT ID field is only available to commercial customers; it is hidden for private customers. To let customers register as commercial, activate the option to show a selection between commercial and private customer account in the **Login / Registration** settings.
- Admin: open the customer's details (via search bar or customer overview); the VAT ID is stored in the **General** section — activate **edit mode** to view/edit it, then save.
- Customer account: the VAT ID is shown in the profile overview for commercial customers, editable via **Change profile**.
- As of Shopware 6.3.5.0, the VAT ID is printed on the invoice. If a document-template adjustment for VAT ID was made in an earlier version, it should be reverted to avoid the ID printing twice.

## Essential identifiers
Admin section: customer details **General** area / **edit mode**; Settings: **Login / Registration** (commercial/private selection option).

## Gotchas
If you previously customized the document template to print the VAT ID manually, revert that customization after upgrading past 6.3.5.0 to avoid a duplicated VAT ID on invoices.

## Version notes
Since Shopware 6.3.5.0 the VAT ID is printed on the invoice automatically.
