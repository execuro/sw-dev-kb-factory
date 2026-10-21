---
id: platform/func/commercial-features/b2b-components.md
title: B2b Components
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/commercial-features/b2b-components
sourceHash: ad53f4ab0925eca1d426e9deae4f5cd54b088526b5ae4897224cbd5937a4bb53
revision:
  current: true
  range: "6.7.13.0 - 6.7.13.1"
  swMax: "6.7.13.1"
  swMin: "6.7.13.0"
keywords: ["B2B Components", "quote management", "employee management", "order approvals", "organisation units", "budget", "individual pricing", "quick orders", "shopping lists", "sales agent", "Shopware Commercial", "Evolve plan", "approval rules", "product_number", "b2b"]
summary: "B2B Components: quotes, employees, order approvals, organisation units, budgets, individual pricing, quick orders and shopping lists."
lastBuilt: 2026-10-20
---
## What it is

The B2B Components are a set of business-customer functions delivered with the Shopware Commercial extension from the Evolve plan. They let store customers model their company with roles, employees, organisation units, approvals, budgets and quotes.

## When to use

When enabling B2B functions for customers or customer groups, or configuring quotes, employee roles, approval rules, organisation units, budgets, individual prices, quick orders or shopping lists.

## Key steps / config

Activation:

- Per customer: Admin **Customers > Overview**, edit mode, toggle the individual functions.
- Per customer group: **Settings > Shop** customer groups, with the customised registration form enabled; functions Quick Orders, Employee Management, Quote Management, Order Approval, Shopping Lists and Organisation Units.
- Global default for new business customers: **Settings > Customer > B2B Components** (existing customers are not changed).

Functions:

- **Quote management**: customers create a quote draft from the cart (status Draft, invisible to the merchant), then send the request with an optional message. In the Administration under **Orders > Quotes** the merchant edits items, discounts and shipping, then sends the quote with a required expiry date, optional message and document option (none, generated, custom upload). Statuses include Open request, Quote sent, Accepted, Cancelled, Expired. A sent quote can be withdrawn or cancelled; History holds messages, and **Resolve message** marks requests processed.
- **Employee management** (from 6.5.6.0): invite employees by first name, last name, email; the invitation must be accepted within 2 hours. Roles have a name, an optional default-role flag, and permissions limited to employee management, role management and orders. An employee can belong to multiple companies and organisation units, with a role per assignment.
- **Order approvals** (from 6.5.8.0): enable per customer, create roles, then approval rules with Name, Priority (higher wins), Gives order approvals, Needs order approvals, Applies to (All orders or Custom condition via Rule Builder style conditions), Status.
- **Organisation units**: hierarchical units per location, department or cost centre with employees, shipping and billing addresses, payment and shipping methods, product catalogues and budgets; each unit sees only its own orders, addresses and users. Employees switch units after login or in the customer account. Advanced product catalogues restrict visible categories per unit (other categories return 404).
- **Budget** (from 6.7.4.0): fields Active, Budget name, Cost centre, Amount, Technical name, Organisation units, Start date, Renews (None, Weekly, Monthly, Quarterly, Biannual, Yearly), End date, Allow approval requests, Show remaining budget, notification trigger (X percent used, specific date, X days before end) and recipients. Selected at checkout; exceeding it requires approval.
- **Individual pricing** (from 6.7.8.0, requires organisation units): **Catalogues > Individual pricing**; target Companies and organisation units or Tags; discount types Percentage off, Fixed amount off, Final price to fixed value, Volume pricing; products filtered with Rule Builder conditions.
- **Quick orders** (from 6.5.4.0): add by product number or name, or upload a CSV with columns `product_number` and `quantity`.
- **Shopping lists** (from 6.6.3.0): enabled per customer; create, open, duplicate, rename, delete, add products to cart; merchants manage lists in the customer's Company tab.
- **Order confirmation to employees**: Flow Builder, Order placed flow (trigger Checkout / Order / Placed), Send email action with the Order confirmation template, recipient Employee.
- **Sales Agent**: separate installation for agents and dealers.

## Essential identifiers

- `product_number`, `quantity` (quick order CSV columns)
- Admin paths: **Settings > Customer > B2B Components**, **Orders > Quotes**, **Catalogues > Individual pricing**, **Settings > Automation > Flow Builder**

## Gotchas

- Global activation only affects newly created business customers.
- The Company tab appears only when employee management is active for the customer.
- A sub organisation unit needs a parent; subordinate budgets can optionally use the parent budget.

## Version notes

Employee management 6.5.6.0, order approvals 6.5.8.0, quick orders 6.5.4.0, shopping lists 6.6.3.0, budgets 6.7.4.0, individual pricing 6.7.8.0.
