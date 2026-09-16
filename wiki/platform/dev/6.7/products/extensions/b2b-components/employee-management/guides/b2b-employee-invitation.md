---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/b2b-employee-invitation.md
title: Employee Invitation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/guides/b2b-employee-invitation.html
sourceHash: 7afe76c8932d830d62d4f787d95d1c2a6bba60ae
codeCheckedAgainst: "6.7.13.0"
keywords: ["employee invitation", "invite employee", "b2b.employee.invitationURL", "/store-api/employee/create", "%%RECOVERHASH%%", "/account/business-partner/employee/invite/%%RECOVERHASH%%", "system config", "SystemConfigService", "invitation mail", "business partner", "recovery hash", "b2b components"]
summary: "How B2B employees are invited via Storefront, Store API or Administration, the default acceptance URL, and overriding it with b2b.employee.invitationURL."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/apps/lifecycle/configuration.md"]
---
## What it is

How employees of a B2B business partner are created by invitation in the B2B Components Employee Management module, and how the URL in the invitation mail is built and overridden.

## When to use

When you need to invite employees programmatically or through the UI, build a custom invitation acceptance page, or change the link employees receive in the invitation mail.

## Key steps / config

1. Invite the employee through one of three channels:
   - Storefront: the business partner logs in, opens the `employee` page and adds a new employee.
   - Store API: call `/store-api/employee/create` while logged in as a customer.
   - Administration: the merchant selects the business partner customer, opens the `company` tab and adds a new employee account in edit mode.
2. The invited employee receives an invitation mail that must be confirmed to set a password. Confirming also activates the employee for the business partner's company.
3. The default acceptance URL is `/account/business-partner/employee/invite/%%RECOVERHASH%%`. The recovery hash is a unique identifier, valid for the invitation of one employee only.
4. To replace the URL (for example to point at a custom endpoint or headless frontend), store the URL as a string in the key-value system config under the key `b2b.employee.invitationURL`. Keep the `%%RECOVERHASH%%` placeholder so the hash can be inserted. See [System Config guide](platform/dev/6.7/guides/plugins/apps/lifecycle/configuration.md).

## Essential identifiers

- `/store-api/employee/create`
- `/account/business-partner/employee/invite/%%RECOVERHASH%%`
- `%%RECOVERHASH%%`
- `b2b.employee.invitationURL` (system config key)
- `Shopware\Core\System\SystemConfig\SystemConfigService` (core key-value system config store)

## Gotchas

- The recovery hash only works for the single employee it was generated for; do not reuse it.
- When writing the config key from PHP, `SystemConfigService::set()` carries a `@deprecated tag:v6.8.0` marker: a `$silent` parameter will be added in 6.8.0 with default `true`.

## Code check (6.7.13.0)
- confirmed `SystemConfigService` — core key-value system config service — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:30
- confirmed `SystemConfigService::get()` — reads a config key, optionally per sales channel — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:59
- deprecated `SystemConfigService::set()` — signature change in v6.8.0 (new optional `$silent` parameter) — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:208
- unverified `b2b.employee.invitationURL` — read by the Shopware Commercial B2B extension, not in vendor/shopware roots
- unverified `/store-api/employee/create` — route defined in the Commercial extension, out of scope
- unverified `%%RECOVERHASH%%` — invitation mail placeholder defined in the Commercial extension, out of scope
