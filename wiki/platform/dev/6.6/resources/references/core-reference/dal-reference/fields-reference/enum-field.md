---
id: platform/dev/6.6/resources/references/core-reference/dal-reference/fields-reference/enum-field.md
title: EnumField reference
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/core-reference/dal-reference/fields-reference/enum-field.html
sourceHash: cae816b5f054bd5bbeb367bc1b0ed1d2c6e100af
keywords: ["EnumField", "BackedEnum", "FieldType::ENUM", "enum field", "DAL field", "PHP enum", "tryFrom", "restricted values", "entity field", "enum usage"]
summary: "How to use EnumField to restrict string/int Entity properties to a PHP BackedEnum's fixed value set."
lastBuilt: 2026-09-15
---
## What it is

`EnumField` restricts a `string` or `int` DAL field value to a fixed set of values, backed by a PHP `\BackedEnum` class.

## When to use

Use `EnumField` when an entity property should only ever hold one of a fixed set of values, enforced both in PHP and (optionally) in the RDBMS schema.

## Key steps / config

1. Define a `\BackedEnum` class:

```php
enum PaymentMethod : string {
    case PAYPAL = 'paypal';
    case CREDIT_CARD = 'credit_card';
    case INVOICE = 'invoice';
}
```

2. Use it on an Entity property with the `#[Field(type: FieldType::ENUM, column: '...')]` attribute:

```php
class BatchOrderEntity extends Entity {
    #[Field(type: FieldType::ENUM, column: 'payment_method')]
    protected PaymentMethod $paymentMethod;
}
```

3. Optionally restrict the column in the RDBMS, e.g. `payment_method ENUM('paypal', 'credit_card', 'invoice') NOT NULL`.

4. Validate untrusted input with `PaymentMethod::tryFrom($userProvidedInput)`, checking for `null` or `instanceof PaymentMethod`.

## Essential identifiers

- `EnumField`
- `FieldType::ENUM`
- `\BackedEnum`
- `PaymentMethod::tryFrom()`, `PaymentMethod::cases()`

## Gotchas

It's not advisable to use `ENUM` RDBMS types for integer-backed enums, since most RDBMS only support string values internally; use a regular `INT` column instead in that case. The `BackedEnum` restricts values in PHP, but this restriction can still be bypassed if the database is modified manually.
