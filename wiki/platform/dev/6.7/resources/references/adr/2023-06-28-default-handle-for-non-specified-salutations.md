---
id: platform/dev/6.7/resources/references/adr/2023-06-28-default-handle-for-non-specified-salutations.md
title: Default handling for non specified salutations
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-06-28-default-handle-for-non-specified-salutations.html
sourceHash: 9b6fb92e960594210eab21fb695b4a921821c456
codeCheckedAgainst: "6.7.13.0"
keywords: ["not_specified", "SalutationDefinition::NOT_SPECIFIED", "salutation", "salutation_key", "default salutation", "CustomerSalutationSubscriber", "OrderSalutationSubscriber", "letter_name", "null salutation", "anrede", "inclusivity", "adr"]
summary: "ADR: a null salutation falls back to the not_specified salutation (SalutationDefinition::NOT_SPECIFIED), which acts as the non-deletable default."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2023-06-28, area core, tag salutation): when a customer or administrator leaves the salutation empty, Shopware uses the salutation with key `not_specified` as the default. That salutation must not be deletable by the shop owner.

## When to use

When customer, address or order data arrives without a salutation. Also relevant when templates render salutation text for such customers, or when deciding whether the `not_specified` salutation may be removed.

## Key steps / config

- The fallback salutation is identified by its `salutation_key` value `not_specified`, exposed in code as `Shopware\Core\System\Salutation\SalutationDefinition::NOT_SPECIFIED`.
- After customer writes (`CustomerEvents::CUSTOMER_WRITTEN_EVENT`, `CustomerEvents::CUSTOMER_ADDRESS_WRITTEN_EVENT`), `CustomerSalutationSubscriber::setDefaultSalutation()` sets `salutation_id` to the `not_specified` salutation for rows where it is still `NULL`. `OrderSalutationSubscriber` runs the same fallback query for order data.
- The Store API routes `RegisterRoute`, `ChangeCustomerProfileRoute` and `UpsertAddressRoute` look up the salutation with `salutationKey` = `NOT_SPECIFIED`.
- Import/export (`SalutationSerializer`) falls back to `not_specified` when a salutation key cannot be resolved.
- The shop owner can customize the display and letter text of the `not_specified` salutation or keep the generic value. A 6.6 migration sets its `letter_name` to `Dear` (en-GB) and `Guten Tag` (de-DE), unless the translation was already edited.

## Essential identifiers

- `not_specified` / `SalutationDefinition::NOT_SPECIFIED`
- `Shopware\Core\Checkout\Customer\Subscriber\CustomerSalutationSubscriber`
- `Shopware\Core\Checkout\Order\Subscriber\OrderSalutationSubscriber`
- `salutation.salutation_key`, `salutation_translation.letter_name`

## Gotchas

- The ADR names location-specific defaults: "Dear Customer" in letters and documents, "Hello" in emails, and `not_specified` in user interfaces. In the installed code, the default letter name set by migration is only `Dear` / `Guten Tag`. Any further wording comes from the templates.
- The ADR requires `not_specified` to be non-deletable. The mechanism enforcing this was not located in the checked code (see Code check).

## Code check (6.7.13.0)
- confirmed `SalutationDefinition::NOT_SPECIFIED` — constant value not_specified — vendor/shopware/core/System/Salutation/SalutationDefinition.php:31
- confirmed `CustomerSalutationSubscriber::setDefaultSalutation()` — subscribed to customer and address written events — vendor/shopware/core/Checkout/Customer/Subscriber/CustomerSalutationSubscriber.php:34
- confirmed `salutation_id` — only NULL salutation_id is replaced with not_specified — vendor/shopware/core/Checkout/Customer/Subscriber/CustomerSalutationSubscriber.php:61
- confirmed `notSpecified` — OrderSalutationSubscriber runs the same fallback query — vendor/shopware/core/Checkout/Order/Subscriber/OrderSalutationSubscriber.php:63
- confirmed `salutationKey` — RegisterRoute filters by NOT_SPECIFIED — vendor/shopware/core/Checkout/Customer/SalesChannel/RegisterRoute.php:579
- confirmed `not_specified` — SalutationSerializer import fallback — vendor/shopware/core/Content/ImportExport/DataAbstractionLayer/Serializer/Entity/SalutationSerializer.php:46
- corrected `letter_name` — docs: "Dear Customer" in letters; migration sets Dear / Guten Tag — vendor/shopware/core/Migration/V6_6/Migration1730191192UpdateDefaultSalutation.php:52
- unverified `non-deletable not_specified` — no deletion guard found in System/Salutation or the admin sw-settings-salutation module
