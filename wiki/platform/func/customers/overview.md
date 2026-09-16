---
id: platform/func/customers/overview.md
title: Overview
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/customers/overview
sourceHash: 6ca059962ef22eeb70843f390c169662fa8799d42815c39fe67064bdbd9de04f
revision:
  current: true
  range: "6.7.0.0 - 6.7.12.2"
  swMax: "6.7.12.2"
  swMin: "6.7.0.0"
keywords: ["customer overview", "customer module", "view customer", "General tab", "Log in as customer", "Convert to registered account", "Addresses tab", "Company tab", "employee management", "Add employee account", "quick order function", "bulk edit", "AI-generated Customer Classification", "customer group"]
summary: "Admin Customer module: list/search customers, view/edit records, Company employee management, quick order, bulk edit, and AI customer classification."
lastBuilt: "2026-09-15"
---

## What it is

The admin "Customer" module documentation covers browsing and searching the customer base, viewing/editing individual customer records, creating new customers, plus the storefront quick order function, admin bulk edit, and AI-generated customer classification.

## When to use

When administering customer records in the Shopware Administration, converting guest customers, managing B2B-style company/employee data on a customer, or bulk-editing many customers at once.

## Key steps / config

- Customer overview list: search (1), view (2), edit (3), delete (4) customers; **Add customer (5)** creates a new one; the **Created by admin** badge flags manually created customers (e.g. phone orders).
- **View a customer > General** tab: shows detailed customer data; **Log in as customer** lets an admin log into the storefront as the customer for a chosen sales channel.
- **Convert a guest customer into a registered customer**: click **Convert to registered account**, then either **Send password reset email** (recommended) or set the password manually via **New password**.
- **Addresses** tab: set standard delivery/billing address, search, add a new address, or edit/duplicate/delete via the context menu.
- **Orders** tab: search orders and open order details.
- **Company** tab (from Shopware 6.5.6.0, Evolve plan): available once employee management is activated on the customer; invite employees via **Add employee account button** (first name, last name, email, optional role), accepted within 2 hours; create roles via **Add role**, setting a name, default-role flag, and permissions limited to employee management, role management and orders.
- **Edit a customer**: configure the General tab, including standard delivery/billing address.
- **Create a new customer**: assign a **customer group**, a **sales channel**, and **tags**; mandatory fields are marked red.
- **Quick order function** (from 6.5.4.0, Evolve plan): activate per customer in edit mode; in the storefront, customers search by name/number, adjust quantity, or upload a CSV containing `product_number` and `quantity` columns.
- **Bulk edit**: select customers, click **Bulk edit**, tick the fields to change and set their per-block handling — **Overwrite**, **Clear**, **Add**, or **Remove** — then **Apply changes**.
- **AI-generated Customer Classification** (Rise plan): select customers, click **Classify**, optionally fill **Generate content** and **Number of tags**, click **Generate tags**; review generated name/description/condition per tag, then **Start** to assign matching customers.

## Essential identifiers

`Created by admin`, `Log in as customer`, `Convert to registered account`, `Add employee account`, `Add role`, `product_number`, `quantity` (quick-order CSV columns), `Bulk edit`, `Classify`, `Generate tags`

## Gotchas

- The Company tab only appears once employee management is activated in the customer's edit mode.
- Bulk edit only changes values whose checkbox is ticked.
- The quick order CSV upload must contain the columns "product_number" and "quantity".
- Re-running AI classification removes all AI-generated tags from the previous run (and deletes the tags themselves) before creating new ones.

## Version notes

Company/employee management available from Shopware 6.5.6.0 (Evolve plan). Quick order function available from 6.5.4.0 (Evolve plan). AI-generated Customer Classification available from the Rise plan.
