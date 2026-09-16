---
id: platform/dev/6.7/resources/references/core-reference/actions-reference.md
title: Actions Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/core-reference/actions-reference.html
sourceHash: 0082be362947530cfb6015deab87100a023e27fe
codeCheckedAgainst: "6.7.13.0"
keywords: ["actions reference", "flow builder actions", "ChangeEmployeeStatusAction", "ChangeCustomerSpecificFeaturesAction", "b2b", "employee management", "employee status", "b2b components", "flow action"]
summary: B2B flow actions reference - ChangeEmployeeStatusAction sets an employee status, ChangeCustomerSpecificFeaturesAction toggles a customer's B2B components.
lastBuilt: 2026-09-15
---
## What it is

A reference table of action classes. The only section is B2B, and both listed actions belong to the Employee Management component.

## When to use

When working with B2B Employee Management and you need the class name of the action that changes an employee's status or a customer's enabled B2B components.

## Essential identifiers

| Class | Description | Component |
|---|---|---|
| `ChangeEmployeeStatusAction` | Assigns the configured status to the employee | Employee Management |
| `ChangeCustomerSpecificFeaturesAction` | Adds or removes the configured B2B components for the customer | Employee Management |

## Gotchas

- Neither class exists in the installed `shopware/core`, `shopware/storefront` or Administration source; they come with the separate B2B components package.

## Code check (6.7.13.0)
- unverified `ChangeEmployeeStatusAction` — not in core/storefront/administration roots; B2B package, out of scope
- unverified `ChangeCustomerSpecificFeaturesAction` — not in core/storefront/administration roots; B2B package, out of scope
