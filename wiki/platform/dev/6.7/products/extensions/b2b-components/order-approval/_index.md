---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/b2b-components/order-approval/_index.md
sourceHash: 6bae853e2f2b907db342bba508a8c2367bf9725c
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/order-approval/
title: Order Approval
version: "6.7"
versions: ["6.7"]
keywords: ["order approval", "b2b", "employee management", "approval rules", "pending orders", "approve order", "decline order", "b2b components", "order review", "commercial"]
summary: B2B Order Approval component overview - approval rules decide which employee orders need review; requires the Employee Management component.
lastBuilt: 2026-10-21
---
## What it is

Order Approval is a B2B component that belongs to B2B Employee Management. It lets you define rules that decide which orders require approval and which employees may approve them, and it gives you a view of all pending orders where they can be approved or declined.

## When to use

When orders placed by B2B employees must be reviewed by another employee (or the business partner) before they are placed.

## Key steps / config

- Install and activate the Employee Management component first. Order Approval depends on it.
- Define approval rules for the orders that need review and assign the employees who may approve them.
- Review the pending orders list and approve or decline each order.

## Gotchas

- Order Approval does not work without the Employee Management component installed and activated.
- The component ships with the Shopware Commercial B2B extension, not with the core packages.

## Code check (6.7.15.1)
- unverified `Order Approval` — Shopware Commercial B2B component, not in the core/storefront/administration packages
- unverified `Employee Management` — Shopware Commercial B2B component, not in the core/storefront/administration packages
