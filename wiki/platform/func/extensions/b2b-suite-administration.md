---
id: platform/func/extensions/b2b-suite-administration.md
title: B2b Suite Administration
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/b2b-suite-administration
sourceHash: 3095f120d98725ce256de08f7ddeb4eab9235dceb7f69fb0203571c77c31ba0a
revision:
  current: true
  range: "4.5.0 - 4.9.1"
  swMax: "4.9.1"
  swMin: "4.5.0"
keywords: ["B2B Suite", "B2B Components", "Debtor", "Sales representative", "Easy Mode", "budgets", "quotas", "customer role", "employee accounts", "Evolve plan"]
summary: "Admin-side setup for the deprecated B2B Suite: installing the extension and assigning Debtor / Sales representative roles to a customer."
lastBuilt: "2026-09-15"
---

## What it is

Admin-side documentation for the deprecated B2B Suite extension: how to install it and assign a B2B role (Debtor or Sales representative) to a customer account.

## When to use

When administering existing B2B Suite roles for customers; new B2B functionality should be built on B2B Components instead.

## Key steps / config

- Install via **Extension > My Extensions** — only applies to Shopware Evolve plan (or higher) purchased by May 23, 2025; from May 24, 2025 only **B2B Components** is offered in Evolve and higher.
- Activate the extension via the button to the left of the extension entry.
- There is no separate B2B Suite config menu — options extend the customer administration edit mode.
- Assign one of two roles to a customer via checkboxes: **Debtor** or **Sales representative** (a customer can hold only one of the two).
- If assigned the Debtor role, **Easy Mode** can additionally be enabled for a simplified customer account view.
- **Debtor**: central account mapping a company organization, with employee accounts and individual budgets/quotas — configured in the "B2B-Suite - Customer account" article.
- **Sales representative**: a store-operator employee account; gets an extra tab in customer configuration for assigning debtor accounts (requires entering edit mode).

## Essential identifiers

B2B Suite, B2B Components, Debtor role, Sales representative role, Easy Mode

## Gotchas

- Easy Mode removes role administration and budget/quota management from the customer's view.
- Data migration from B2B Suite to B2B Components is required — see the developer documentation on the migration.

## Version notes

The B2B Suite is no longer being developed and will no longer be supported starting with Shopware 6.8; plan migration to B2B Components promptly.
