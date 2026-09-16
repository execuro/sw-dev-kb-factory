---
id: platform/func/extensions/b2b-suite-customer-account.md
title: B2b Suite Customer Account
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/b2b-suite-customer-account
sourceHash: c68bbb11989eafe524b713583321960226fee25c18104db0851a765c985bd840
revision:
  current: true
  range: "4.6.4 - 4.6.6"
  swMax: "4.6.6"
  swMin: "4.6.4"
keywords: ["B2B Suite", "B2B-Dashboard", "Company", "Role management", "Contacts", "Billing addresses", "Shipping addresses", "Budgets", "Contingents", "Order lists", "Fast order", "Offers", "Order numbers", "Easy Mode", "Redis cart persister"]
summary: "Storefront-facing B2B Suite functions for debtor accounts: roles, budgets, quotas, order lists, fast orders, offers and order numbers."
lastBuilt: "2026-09-15"
---

## What it is

Storefront-facing documentation for the deprecated B2B Suite, describing how a store customer (debtor) and their sub-account contacts manage roles, budgets/quotas, order lists, fast orders, offers and custom order numbers.

## When to use

When a debtor or authorized B2B contact needs to administer their company's contacts, budgets, quotas, order lists, or review B2B order/statistics history in the storefront. New functionality should use B2B Components instead.

## Key steps / config

- Areas: **B2B-Dashboard**, **Company** (roles/contacts/addresses/budgets/quotas), **Statistics**, **Orders**, **Order lists**, **Fast order**, **Offers**, **Order numbers**, **My Account**.
- **My profile**: edit salutation, first/last name, email, and password directly in the storefront.
- **Company > Role management**: create a role, then set **Permission management** rights per component — List, Detail, Edit, Create, Delete, Assign — with inheritance and visibility controls; assign contingents, order lists and budgets to the role.
- **Contacts**: create sub-accounts with title, first/last name, email, optional department; choose **Send password reset email** or set active immediately.
- **Billing addresses** / **Shipping addresses**: create, edit, duplicate, delete; visibility to other roles/contacts is configured separately from creation.
- **Budgets**: define a value, area of validity (reset period), start of the fiscal year, and an optional responsible contact notified at a usage threshold; orders exceeding budget trigger an order clearance request.
- **Contingents**: contingent rules limit order total, number of ordered products, or number of orders per reset period (calculated from 01.01); contingent restrictions exclude by product price, product number, or category. At least one contingent rule is required, otherwise only clearance requests are possible.
- **Order lists**: create, sort, search; export as CSV (comma-separated, containing product number and quantity — the same format used for fast orders); add directly to the shopping cart.
- **Fast order**: enter product number + quantity manually, or upload a CSV/XLS/XLSX file with configurable column mapping, separator, capsule character, and header-row handling.
- **Offers**: view, accept, or decline requested offers; accepting converts the offer into an order at the negotiated conditions and prices.
- **Order numbers**: store custom product numbers alongside Shopware's own, entered manually or via CSV/XLS(X) import — import replaces all existing custom order-number data.

## Essential identifiers

B2B-Dashboard, Role management, Contacts, Billing addresses, Shipping addresses, Budgets, Contingents, Order lists, Fast order, Offers, Order numbers

## Gotchas

- If Easy Mode is active for the account, Role management, Budgets, and Contingents are unavailable.
- Order-number import via CSV/XLS(X) replaces all existing custom order numbers — export first to avoid data loss.
- A contingent must have at least one contingent rule, otherwise only order-clearance requests are possible.
- Deleting a debtor account also removes its subordinate contacts.

## Version notes

As of Shopware 6.4.11.0, shopping-cart performance for large carts can be improved by activating Redis (see the developer documentation on the Redis cart persister).
