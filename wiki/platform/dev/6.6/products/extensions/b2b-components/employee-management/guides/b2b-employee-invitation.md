---
id: platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/b2b-employee-invitation.md
title: Employee Invitation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/employee-management/guides/b2b-employee-invitation.html
sourceHash: ae9721de31189442efb847e2234345f642527293
keywords: ["employee invitation", "b2b.employee.invitationURL", "store-api/employee/create", "invitation URL", "RECOVERHASH", "business partner", "employee onboarding", "Store API", "Administration invite", "Storefront invite", "system config", "B2B employee"]
summary: "How employees are invited via Storefront, Store API, or Administration, and how to override the invitation URL."
lastBuilt: "2026-09-15"
---
## What it is

This page explains the three ways an employee account can be created for a business partner (Storefront, Store API, Administration) and how the invitation acceptance URL works, including how to override it.

## When to use

Read this when integrating a custom employee-invitation flow, or when you need to point the invitation acceptance link at a custom endpoint instead of the default Storefront URL.

## Key steps / config

- **Storefront**: business partners log in, navigate to the `employee` page, and add a new employee from there.
- **Store API**: use the `/store-api/employee/create` endpoint while logged in as a customer to invite employees.
- **Administration**: merchants log in to the administration interface, select the business partner customer, open the `company` tab, and add a new employee account in edit mode.

Every invited employee receives an invitation email that must be confirmed to set a password; confirming it also activates the employee for the business partner's company. The default acceptance URL is `/account/business-partner/employee/invite/%%RECOVERHASH%%`, where the recovery hash is a unique identifier valid for exactly one employee's invitation.

To override the invitation URL, set the key-value system config key `b2b.employee.invitationURL` to your own URL string — useful when you want a custom endpoint to handle acceptance instead of the default Storefront route.

## Essential identifiers

- `/store-api/employee/create` — the Store API endpoint used to create an employee.
- `/account/business-partner/employee/invite/%%RECOVERHASH%%` — the default invitation acceptance URL pattern.
- `b2b.employee.invitationURL` — the system config key used to override the invitation URL.
