---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/concepts/_index.md
title: Concepts
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/concepts/
sourceHash: 9afc22365ce4ae8a7581de28133dca85bc4cb2ab
codeCheckedAgainst: "6.7.15.1"
keywords: ["employee management", "concepts", "b2b components", "employee", "email", "unique email", "employee invite", "invitation", "identification", "commercial plugin"]
summary: B2B Employee Management concepts - employees are uniquely identified by email address; inviting an employee checks the address is used only once.
lastBuilt: 2026-10-21
---
## What it is

Entry page for the concepts of the B2B Employee Management component (Commercial plugin). Its one stated rule: employees are uniquely identified via their email address.

## When to use

When designing imports, invitations or integrations that create B2B employees and need to know how an employee is identified.

## Gotchas

- When a new employee is invited, a check ensures the email address is in use only once; inviting a second employee with an existing address fails that check.
- The email is the employee's unique identifier, so it cannot be shared between employees.

## Code check (6.7.15.1)
- confirmed `email` — core customer email is a required field; employee email lives separately — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:127
- unverified `employee email uniqueness` — invite check lives in the Commercial plugin, not in installed code
