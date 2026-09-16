---
id: platform/func/extensions/sales-agent.md
docType: functional
title: Sales Agent
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/sales-agent
sourceHash: 44fdc9ab80496d48fc84e7004546fffb98c3038511a6d4b3d022e3d5f47ea13a
revision:
  current: true
  range: "6.7.3.0"
  swMax: null
  swMin: null
keywords: ["Sales Agent", "sales representative", "user management", "customer assignment", "quote management", "Sales Agent area", "Create quote", "Send quote", "Evolve Plan", "GitLab repository", "Settings > System > Sales Agent", "quote line items", "quote discounts", "B2B"]
summary: "Sales Agent lets admins create sales-staff users, assign them customers, and manage/send quotes; a separate frontend app built from a GitLab source repo."
lastBuilt: "2026-09-15"
---
## What it is

Sales Agent is a user management and quoting feature for sales staff, released with Shopware 6.5.0.0 and available from the Evolve Plan. Unlike a one-click extension, it is a **separate frontend application**: source code is provided via a GitLab repository so agencies/developers can build, configure and integrate their own app into the Shopware environment.

## When to use

Use it when a sales team needs its own accounts to manage assigned customers directly, and to create, edit and send price quotes to those customers.

## Key steps / config

- Manage sales representatives under **Settings > System > Sales Agent - Users & Permissions**.
- Create a representative: **Sales Agent > User Management**, **New User**, enter name/email/language, save.
- Assign customers: open the representative, **Add customers**, select one or more customers, confirm with **Add customers**. Only administrators can assign or change these assignments.
- Account management options per representative: **Administrator** (full admin access to customers/user management), **Deactivate account** (login blocked, data kept), **Delete account** (permanent, all associated data removed).
- New representatives get an automatic invitation email with a link to set their own password and access the Sales Agent area.
- In the Sales Agent area, representatives can edit personal settings (language, time zone, name, phone, password); only an admin can change their email address or assigned customers.
- **Customers** section: shows customers assigned to the logged-in representative; opening one shows personal data/orders and allows **Create order**.
- **Quotes** section: overview table (Status, Quote number, Created on, Customer, Email address, Actions); **Create quote** starts a new quote in Draft status, with **Save as draft**/**Discard** actions.
- New quote — **General information**: mandatory **Customer** and **Sales channel** fields; contact person, email, company and customer number are auto-filled from the selected customer.
- Quote details: **Send quote** button to send, **Edit quote** to modify line items; **Save**, **Discard**, **Send quote** actions at top.
- Line items: **Add product**, price (net), quote price (net, adjustable), plus a price summary — Subtotal (net), Total discounts (absolute or relative), Quote subtotal (net), VAT, Total (gross).
- **Documents**: lists quote-related files (e.g. auto-generated quote PDF) with **Open document**/**Download document** actions.
- **Delete quote**: permanently removes a quote draft; irreversible.
- **Send quote** dialog: review summary (company, customer, line item count, price breakdown), set a mandatory **Expiration date**, optional message and attached document (none / generate / upload custom), then **Send quote** or **Cancel**.

## Essential identifiers

- Admin path: **Settings > System > Sales Agent - Users & Permissions**
- Sections: User Management, Customers, Quotes
- Quote fields: Customer, Sales channel, Expiration date

## Gotchas

Sales Agent is not installed/activated like a normal extension — it is a separately built frontend app whose source is distributed via a GitLab repository, so it requires developer setup rather than a store install. Deleting a quote draft or a sales representative account is permanent.
