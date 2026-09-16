---
id: platform/func/commercial-features/b2b-components.md
title: B2b Components
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/commercial-features/b2b-components
sourceHash: 7b83e22a8ab5b9473423fb0a47578eedd695395cb01f2097a7f1d199b790e200
revision:
  current: true
  range: "6.7.13.0 - 6.7.13.1"
  swMax: "6.7.13.1"
  swMin: "6.7.13.0"
keywords: ["B2B Components", "Shopware Commercial", "Shopware Evolve", "employee management", "order approval", "quote management", "organisation units", "budget", "shopping list", "quick order", "individual pricing", "sales agent"]
summary: "B2B Components (Shopware Evolve/Commercial) provide roles, employee/order approval, quote management, organisation units and budgets for B2B customers."
lastBuilt: 2026-09-15
---
## What it is
B2B Components equip a Shopware store with core B2B functionality: roles and employee sub-accounts, order approval workflows, quote management, organisation units, budgets, shopping lists, quick orders and individual pricing. Available from the Shopware Evolve plan via the Shopware Commercial extension.

## When to use
Use when a store sells to business customers who need multi-user company accounts, order-approval chains, negotiated pricing, or hierarchical organisational structures (locations, departments, cost centres).

## Key steps / config
- Enable per customer: Admin > Customers > Overview > edit customer, activate individual B2B options.
- Enable per customer group: Settings > Shop > customer groups, activate the customised registration form, then toggle Quick Orders, Employee Management, Quote Management, Order Approvals, Shopping Lists and/or Organisation Units.
- Global default: Settings > Customer > B2B Components lets you pre-select which areas are enabled automatically for newly registered business customers (applies only going forward, existing customers can still be changed individually).
- Quote management: storefront customers build a quote draft from the cart (status "Draft" until sent); merchants manage requests under Orders > Quotes in the Admin, with statuses such as Open request, Quote sent, Accepted, Cancelled, Expired; sending a quote requires an Expiry date and can attach a document.
- Employee management (from 6.5.6.0, Evolve plan): activated per customer; employees are invited by first name, last name and email, accept within 2 hours, and can be assigned roles with permissions limited to employee management, role management and orders.
- Order Approvals (from 6.5.8.0, Evolve plan): activated per customer; approval rules are created under Roles with Name, Priority, "Gives order approvals", "Needs order approvals", Applies to (All orders / Custom condition using Rule Builder conditions) and Status.
- Organisation units: hierarchical sub-structures (locations, departments, teams, cost centres) each with their own employees, addresses, payment/shipping methods, product catalogues and budgets; created in the storefront via "Create unit" or in Admin under the customer's Company tab.
- Advanced product catalogues: per organisation unit, restrict visible product categories; blocked categories/products return a 404 Not Found.
- Budget (from 6.7.4.0, Evolve plan): configured under Customers > Overview > Company tab; fields include Active, Budget name, Cost centre, Amount in EUR, Technical name, Organisation units, Start date, Renews (None/Weekly/Monthly/Quarterly/Biannual/Yearly), End date, Allow approval requests, notification thresholds and Recipients.
- Individual Pricing (from 6.7.8.0, requires organisation units): configured under Catalogues > Individual pricing; a pricing rule sets General settings + Target assignment (Companies and organisation units, or Tags), then Conditions on Target products and Discounts (Percentage off, Fixed amount off, Final price to fixed value, Volume pricing).
- Quick orders (from 6.5.4.0, Evolve plan): activated per customer; lets customers add items by product number or upload a CSV with `product_number` and `quantity` columns.
- Shopping list (from 6.6.3.0): activated per customer; storefront users can create, duplicate, rename, delete lists and add all items to the cart at once.
- Sales Agent: a separately installed login for sales agents/dealers to access B2B customers, set up on its own server or subdomain.

## Essential identifiers
- Settings > Customer > B2B Components (global activation)
- Customers > Overview > Company tab (organisation units, budgets, shopping lists)
- Orders > Quotes (Admin quote management)
- CSV columns for quick order upload: `product_number`, `quantity`

## Gotchas
- Employee management, Order Approvals, Budget and Individual Pricing each require a specific minimum Shopware version and the Evolve plan.
- A quote is only visible to the merchant after the customer explicitly sends it; a Draft is not.
- Once a budget limit is exceeded, an order can only be completed with approval.

## Version notes
- Employee Management requires 6.5.6.0+, Order Approvals 6.5.8.0+, Quick orders 6.5.4.0+, Shopping list 6.6.3.0+, Budget 6.7.4.0+, Individual Pricing 6.7.8.0+.
