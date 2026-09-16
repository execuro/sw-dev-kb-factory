---
id: platform/dev/6.7/resources/references/adr/2020-08-14-merchant-registration.md
title: Merchant registration
docType: developer
version: "6.7"
versions:
  - "6.7"
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-08-14-merchant-registration.html
sourceHash: 2f53e129ad4d754e9842b2bca1aef46338c3b4ec
codeCheckedAgainst: "6.7.13.0"
keywords: ["merchant registration", "customer group registration", "requestedGroupId", "requested_customer_group_id", "registrationActive", "store-api.customer-group-registration.config", "store-api.account.register", "api.customer-group.accept", "api.customer-group.decline", "b2b registration", "adr", "customer group"]
summary: "ADR: merchant/B2B signup via customer group registration; customer stores requestedGroupId, admin accepts or declines to switch the group."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2020-08-14) for merchant registration. "Merchant" is not a core concept: the core implements a generic **customer group registration** system, and a merchant is simply a customer in a customer group that allows registration.

## When to use

- Building a B2B/merchant signup flow, especially in a headless frontend.
- Understanding why a customer carries a pending "requested" group next to its actual group, and how accept/decline works.

## Key steps / config

Process described by the ADR, aligned with the installed code:

1. The shop owner enables registration on a customer group (`customer_group.registrationActive`) and shares the generated registration URL (footer, social media, mails).
2. The customer registers on the individual registration page/URL.
3. The customer is created with the **default** customer group; the desired group is stored in the foreign key `requested_customer_group_id` (API field `requestedGroupId`, association `requestedGroup`) on `customer`.
4. The shop operator accepts or declines in the Administration customer module.
   - Accept: `POST /api/_action/customer-group-registration/accept` sets `groupId` to the requested group and resets `requestedGroupId` to `null`.
   - Decline: `POST /api/_action/customer-group-registration/decline` only resets `requestedGroupId` to `null`.
   - Both read `customerIds` (array) from the request body and accept an optional `silentError` boolean.

Headless frontend flow:

1. Resolve the registration URL to the customer group id via the SEO URL Store API route `/store-api/seo-url`.
2. Fetch the form configuration: `GET /store-api/customer-group-registration/config/{customerGroupId}`.
3. Register through `POST /store-api/account/register`, passing `requestedGroupId`:

```json
{
  "requestedGroupId": "<customer group id>",
  "...": "regular registration fields"
}
```

## Essential identifiers

- `requestedGroupId` / `requested_customer_group_id` (customer field, FK to `customer_group`)
- `registrationActive` (customer group field)
- `store-api.customer-group-registration.config` — `/store-api/customer-group-registration/config/{customerGroupId}`
- `store-api.account.register` — `/store-api/account/register`
- `api.customer-group.accept` / `api.customer-group.decline`
- `CustomerGroupRegistrationAccepted` / `CustomerGroupRegistrationDeclined` events

## Gotchas

- Registration always creates a customer account, even if the group request is later declined — a declined customer stays in the default group.
- The core does not react to "merchant" groups in any special way; any behaviour tied to merchants must be built on the customer group.

## Code check (6.7.13.0)
- confirmed `requestedGroupId` — FkField on requested_customer_group_id pointing to CustomerGroupDefinition — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:166
- confirmed `registrationActive` — BoolField registration_active on the customer group — vendor/shopware/core/Checkout/Customer/Aggregate/CustomerGroup/CustomerGroupDefinition.php:57
- confirmed `store-api.customer-group-registration.config` — GET route taking customerGroupId — vendor/shopware/core/Checkout/Customer/SalesChannel/CustomerGroupRegistrationSettingsRoute.php:39
- confirmed `store-api.account.register` — Store API registration route — vendor/shopware/core/Checkout/Customer/SalesChannel/RegisterRoute.php:102
- confirmed `requestedGroupId` — read from the registration request data — vendor/shopware/core/Checkout/Customer/SalesChannel/RegisterRoute.php:402
- confirmed `/store-api/seo-url` — SEO URL Store API route used to resolve the URL — vendor/shopware/core/Content/Seo/SalesChannel/SeoUrlRoute.php:36
- confirmed `api.customer-group.accept` — switches groupId and resets the requested group to null — vendor/shopware/core/Checkout/Customer/Api/CustomerGroupRegistrationActionController.php:49
- confirmed `api.customer-group.decline` — only resets the requested group to null — vendor/shopware/core/Checkout/Customer/Api/CustomerGroupRegistrationActionController.php:103
- confirmed `customerIds` — required request array for accept and decline — vendor/shopware/core/Checkout/Customer/Api/CustomerGroupRegistrationActionController.php:146
- confirmed `CustomerGroupRegistrationAccepted` — event dispatched after accept — vendor/shopware/core/Checkout/Customer/Api/CustomerGroupRegistrationActionController.php:90
