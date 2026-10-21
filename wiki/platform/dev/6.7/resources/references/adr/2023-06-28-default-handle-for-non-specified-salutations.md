---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2023-06-28-default-handle-for-non-specified-salutations.md
sourceHash: 9b6fb92e960594210eab21fb695b4a921821c456
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-06-28-default-handle-for-non-specified-salutations.html
title: Default handling for non specified salutations
version: "6.7"
versions: ["6.7"]
keywords: ["not_specified", "SalutationDefinition::NOT_SPECIFIED", "salutationKey", "salutation_id", "CustomerSalutationSubscriber", "OrderSalutationSubscriber", "NewsletterRecipientSalutationSubscriber", "default salutation", "missing salutation", "null salutation", "anrede", "adr", "inclusivity"]
summary: "ADR: a null salutation on customers, addresses, orders and newsletter recipients falls back to the non-deletable not_specified salutation."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2023-06-28, area core) that makes `not_specified` the default salutation whenever a customer or administrator leaves the salutation empty (null). The goal is inclusive, consistent addressing of customers even when salutation data is missing.

## When to use

Read this when you handle customers, addresses, orders or newsletter recipients without a salutation, render greetings in mails/documents, or wonder why a `salutation_id` that you wrote as null ends up filled in.

## Key steps / config

Decision points from the ADR, aligned with the installed code:

- The salutation with `salutationKey` `not_specified` is the fallback. In code the key is the constant `SalutationDefinition::NOT_SPECIFIED` (`Shopware\Core\System\Salutation\SalutationDefinition`).
- When an entity is written without a salutation, core subscribers set `salutation_id` to the id of the `not_specified` salutation, but only where `salutation_id` is still NULL:
  - `CustomerSalutationSubscriber` on customer and customer-address written events;
  - `OrderSalutationSubscriber` for orders;
  - `NewsletterRecipientSalutationSubscriber` for newsletter recipients.
- Store API routes that create/update customers and addresses (`RegisterRoute`, `UpsertAddressRoute`, `ChangeCustomerProfileRoute`) look up the default salutation id via an `EqualsFilter('salutationKey', SalutationDefinition::NOT_SPECIFIED)`.
- A migration (`Migration1691057865UpdateSalutationDefaultForCustomer`) backfilled existing customers with a NULL `salutation_id` in batches of 1000.
- The shop owner can configure the `not_specified` salutation itself (e.g. its display name/letter name), but per the ADR it must not be deletable, so a fallback always exists.

Default wording by location (from the ADR):

| Location | Default |
|---|---|
| Letters and documents | "Dear Customer" or a customised alternative |
| Email communications | "Hello" or a customised greeting |
| User interfaces | displayed as `not_specified` |

## Essential identifiers

- `not_specified` (`salutationKey`)
- `Shopware\Core\System\Salutation\SalutationDefinition::NOT_SPECIFIED`
- `CustomerSalutationSubscriber`, `OrderSalutationSubscriber`, `NewsletterRecipientSalutationSubscriber`
- `Migration1691057865UpdateSalutationDefaultForCustomer`

## Gotchas

- The fallback is applied after the write (subscriber runs an SQL UPDATE on the row), so the payload you wrote does not contain the salutation — reload the entity to see it.
- In the address salutation Twig snippet the salutation display name is skipped when the key is `not_specified`, so templates do not print a literal "not specified".
- The ADR states the salutation must not be deletable; no deletion guard for it was found in the checked core/admin code — do not rely on a runtime check, simply never delete it.

## Code check (6.7.15.1)
- confirmed `SalutationDefinition::NOT_SPECIFIED` — constant value `not_specified` — vendor/shopware/core/System/Salutation/SalutationDefinition.php:34
- confirmed `CustomerSalutationSubscriber::setDefaultSalutation()` — subscribed to customer and customer-address written events — vendor/shopware/core/Checkout/Customer/Subscriber/CustomerSalutationSubscriber.php:29
- confirmed `CustomerSalutationSubscriber` — updates only rows where `salutation_id` is NULL — vendor/shopware/core/Checkout/Customer/Subscriber/CustomerSalutationSubscriber.php:17
- confirmed `OrderSalutationSubscriber` — same fallback for orders — vendor/shopware/core/Checkout/Order/Subscriber/OrderSalutationSubscriber.php:17
- confirmed `NewsletterRecipientSalutationSubscriber` — same fallback for newsletter recipients — vendor/shopware/core/Content/Newsletter/Subscriber/NewsletterRecipientSalutationSubscriber.php:17
- confirmed `RegisterRoute::getDefaultSalutationId()` — default salutation looked up by `salutationKey` filter — vendor/shopware/core/Checkout/Customer/SalesChannel/RegisterRoute.php:588
- confirmed `Migration1691057865UpdateSalutationDefaultForCustomer` — backfills NULL customer salutations in batches of 1000 — vendor/shopware/core/Migration/V6_5/Migration1691057865UpdateSalutationDefaultForCustomer.php:16
- confirmed `not_specified` — address salutation snippet hides the display name for this key — vendor/shopware/core/Framework/Resources/views/snippets/address/salutation.html.twig:3
- unverified `not_specified` non-deletable — no deletion guard found in checked core/administration code
