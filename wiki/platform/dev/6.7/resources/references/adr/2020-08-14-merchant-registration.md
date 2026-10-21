---
id: platform/dev/6.7/resources/references/adr/2020-08-14-merchant-registration.md
title: Merchant registration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-08-14-merchant-registration.html
sourceHash: 2f53e129ad4d754e9842b2bca1aef46338c3b4ec
codeCheckedAgainst: "6.7.15.1"
keywords: ["merchant registration", "b2b registration", "customer group registration", "requestedGroupId", "requested_customer_group_id", "registrationActive", "/store-api/customer-group-registration/config/{customerGroupId}", "/store-api/account/register", "/store-api/seo-url", "api.customer-group.accept", "api.customer-group.decline", "customer group", "headless", "adr"]
summary: "ADR: merchant sign-up is a customer group registration; customer stores requestedGroupId until an admin accepts or declines it."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2020-08-14) on registering merchants. Merchants are modelled as customer groups, and the core does not treat "merchant" groups specially — the feature is a generic customer group registration system: a customer applies for a target customer group, and the shop operator accepts or declines that request.

## When to use

- You build a B2B / merchant sign-up page, especially in a headless frontend.
- You need to know which field and endpoints carry a requested customer group and how accept/decline works.

## Key steps / config

Process:

1. The shop owner enables registration for a customer group (`registrationActive` on the customer group) and gets a URL for it, which they share with customers (footer, social media, mails, etc.).
2. The customer registers on that individual registration page.
3. The customer account is created in the default customer group; the requested group is stored in the customer's foreign key `requested_customer_group_id` (entity property `requestedGroupId`).
4. The shop operator accepts or declines in the administration customer module. Accept switches the customer's `groupId` to the requested group and resets `requestedGroupId` to null; decline only resets `requestedGroupId`.

Headless frontend flow:

1. Resolve the registration URL to the customer group ID via the SEO URL Store API route `/store-api/seo-url`.
2. Load the form configuration with `GET /store-api/customer-group-registration/config/{customerGroupId}` (only groups with registration active are returned).
3. Register via `POST /store-api/account/register`, passing `requestedGroupId`.

Admin API actions behind the accept/decline buttons: `POST /api/_action/customer-group-registration/accept` (`api.customer-group.accept`) and `POST /api/_action/customer-group-registration/decline` (`api.customer-group.decline`).

## Essential identifiers

- `requestedGroupId` / `requested_customer_group_id` (customer), `registrationActive` (customer group)
- `store-api.customer-group-registration.config`, `store-api.account.register`, `/store-api/seo-url`
- `api.customer-group.accept`, `api.customer-group.decline`

## Gotchas

- Registration always creates a customer account, even when the group request is later declined.

## Code check (6.7.15.1)
- confirmed `requested_customer_group_id` — FK to customer group, property `requestedGroupId` — vendor/shopware/core/Checkout/Customer/CustomerDefinition.php:166
- confirmed `requestedGroupId` — read from the registration payload — vendor/shopware/core/Checkout/Customer/SalesChannel/RegisterRoute.php:415
- confirmed `/store-api/account/register` — registration route — vendor/shopware/core/Checkout/Customer/SalesChannel/RegisterRoute.php:105
- confirmed `/store-api/customer-group-registration/config/{customerGroupId}` — form config route — vendor/shopware/core/Checkout/Customer/SalesChannel/CustomerGroupRegistrationSettingsRoute.php:39
- confirmed `registrationActive` — config route only returns groups with registration active — vendor/shopware/core/Checkout/Customer/SalesChannel/CustomerGroupRegistrationSettingsRoute.php:43
- confirmed `/store-api/seo-url` — SEO URL Store API route — vendor/shopware/core/Content/Seo/SalesChannel/SeoUrlRoute.php:36
- confirmed `api.customer-group.accept` — accept action — vendor/shopware/core/Checkout/Customer/Api/CustomerGroupRegistrationActionController.php:49
- confirmed `groupId` — accept sets groupId to the requested group and clears requestedGroupId — vendor/shopware/core/Checkout/Customer/Api/CustomerGroupRegistrationActionController.php:70
- confirmed `api.customer-group.decline` — decline action clears requestedGroupId — vendor/shopware/core/Checkout/Customer/Api/CustomerGroupRegistrationActionController.php:103
