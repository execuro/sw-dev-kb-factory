---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/concepts/_index.md
title: Concepts
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/concepts/
sourceHash: 9afc22365ce4ae8a7581de28133dca85bc4cb2ab
codeCheckedAgainst: "6.7.13.0"
keywords: ["employee management", "b2b components", "concepts", "employee", "email address", "unique email", "employee invitation", "b2b_employee", "business partner", "duplicate email check"]
summary: Overview of B2B Employee Management concepts; employees are uniquely identified by email, checked for uniqueness when a new employee is invited.
lastBuilt: 2026-09-15
---
## What it is

The landing section for the concepts behind the B2B Components Employee Management module (Shopware Commercial). It groups the concept pages for employees and adds one cross-cutting rule that applies to every employee record: an employee is uniquely identified by its email address.

## When to use

Read this before creating, inviting or importing employees for a business partner, or when an invitation fails because the email address already exists.

## Gotchas

- Employees are uniquely identified via their email address, not by a separate username.
- When a new employee is invited, a check is performed to ensure that the email address is in use only once. Inviting a second employee with an email that is already taken is rejected, so reuse or clean up existing employee records instead of re-inviting the same address.

## Code check (6.7.13.0)
- unverified `employee email uniqueness check` — implemented in the Shopware Commercial B2B extension, not in vendor/shopware core, storefront or administration
- confirmed `b2b_employee` — employee entity name listed in the core usage-data allow list only — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2084
