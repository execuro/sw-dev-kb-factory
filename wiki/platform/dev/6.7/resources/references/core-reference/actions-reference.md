---
id: platform/dev/6.7/resources/references/core-reference/actions-reference.md
title: Actions Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/core-reference/actions-reference.html
sourceHash: 0082be362947530cfb6015deab87100a023e27fe
codeCheckedAgainst: "6.7.15.1"
keywords: ["actions reference", "flow actions", "flow builder", "B2B", "ChangeEmployeeStatusAction", "ChangeCustomerSpecificFeaturesAction", "employee management", "employee status", "b2b components", "customer specific features", "FlowAction"]
summary: Lists B2B flow actions - ChangeEmployeeStatusAction sets employee status, ChangeCustomerSpecificFeaturesAction toggles B2B components per customer.
lastBuilt: 2026-10-21
---
## What it is

A reference table of action classes, grouped by area. In 6.7 it lists only B2B actions, both belonging to the Employee Management component:

| Class | Description |
| :-- | :-- |
| `ChangeEmployeeStatusAction` | Assigns the configured status to the employee |
| `ChangeCustomerSpecificFeaturesAction` | Adds or removes the configured B2B components for the customer |

## When to use

When you build or debug a flow that should change a B2B employee's status, or enable/disable B2B components for a specific customer, and need the action class name.

## Gotchas

- Neither class is part of the Shopware core, Storefront or Administration packages; they ship with the B2B (Employee Management) component, so they are only available where that component is installed.
- In core, Flow Builder actions extend `FlowAction`, which declares `requirements()`, `handleFlow()` and `getName()`; the source does not state the base class of the two B2B actions.

## Code check (6.7.15.1)
- unverified `ChangeEmployeeStatusAction` — not defined in vendor/shopware core, storefront or administration; B2B component code is out of scope
- unverified `ChangeCustomerSpecificFeaturesAction` — not defined in vendor/shopware core, storefront or administration; B2B component code is out of scope
- confirmed `FlowAction` — abstract base class of core flow actions — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:9
- confirmed `FlowAction::handleFlow()` — abstract method every flow action implements — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:16
