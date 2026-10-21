---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/b2b-employee-invitation.md
title: Employee Invitation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/guides/b2b-employee-invitation.html
sourceHash: 7afe76c8932d830d62d4f787d95d1c2a6bba60ae
codeCheckedAgainst: "6.7.15.1"
keywords: ["employee invitation", "invite employee", "b2b.employee.invitationURL", "/store-api/employee/create", "%%RECOVERHASH%%", "/account/business-partner/employee/invite/%%RECOVERHASH%%", "invitation url", "business partner", "system config", "b2b employee management", "set password"]
summary: Invite B2B employees via Storefront, /store-api/employee/create or Admin; override the acceptance URL with config key b2b.employee.invitationURL.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/apps/lifecycle/configuration.md"]
---
## What it is

How B2B employees are created and invited in the Employee Management component, and how the invitation acceptance URL in the invitation mail can be replaced.

## When to use

When you build an employee invitation flow (Storefront, Store API or Administration) or need the invitation mail to point at a custom endpoint.

## Key steps / config

Employees can be created in three ways:

- **Storefront**: the business partner logs in, opens the `employee` page and adds a new employee.
- **Store API**: call `/store-api/employee/create` while logged in as a customer.
- **Administration**: the merchant selects the business partner customer, opens the `company` tab and adds a new employee account in edit mode.

The invited employee receives an invitation mail that must be confirmed to set a password; confirming also activates the employee for the business partner's company.

- Default acceptance URL: `/account/business-partner/employee/invite/%%RECOVERHASH%%`. The recovery hash is a unique identifier, valid only for the invitation of one employee.
- Override: store the custom URL as a string in the key-value system config under the key `b2b.employee.invitationURL` (see [System Config guide](platform/dev/6.7/guides/plugins/apps/lifecycle/configuration.md)).

## Essential identifiers

- `/store-api/employee/create`
- `/account/business-partner/employee/invite/%%RECOVERHASH%%`
- `b2b.employee.invitationURL`
- `%%RECOVERHASH%%` placeholder

## Gotchas

- Each recovery hash is bound to a single employee invitation; it cannot be reused.

## Code check (6.7.15.1)
- unverified `/store-api/employee/create` — route of the Shopware Commercial B2B extension, not in core/storefront/administration; out of scope
- unverified `b2b.employee.invitationURL` — config key read by the Commercial B2B extension; out of scope
- unverified `/account/business-partner/employee/invite/%%RECOVERHASH%%` — Commercial B2B default URL; out of scope
- confirmed `%%RECOVERHASH%%` — same placeholder core uses for password-recovery URLs — vendor/shopware/core/Checkout/Customer/SalesChannel/SendPasswordRecoveryMailRoute.php:246
- confirmed `SystemConfigService::get()` — key-value system config read API — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:60
