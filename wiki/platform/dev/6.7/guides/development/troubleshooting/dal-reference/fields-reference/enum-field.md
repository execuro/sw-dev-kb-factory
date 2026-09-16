---
id: platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/enum-field.md
title: EnumField Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/dal-reference/fields-reference/enum-field.html
sourceHash: 358703e7dc62079bad5ba901ab898d2540efef0f
codeCheckedAgainst: "6.7.13.0"
keywords: ["EnumField", "FieldType::ENUM", "BackedEnum", "tryFrom", "EnumFieldSerializer", "AttributeEntityCompiler", "enum", "dal field", "entity attribute", "string backed enum", "int backed enum", "restrict values"]
summary: DAL EnumField maps a PHP BackedEnum (string or int) to an entity property via FieldType::ENUM; invalid values are resolved with tryFrom to null.
lastBuilt: 2026-09-15
---
## What it is

`EnumField` (`Shopware\Core\Framework\DataAbstractionLayer\Field\EnumField`) is a DAL field that stores a PHP `\BackedEnum`. It restricts a `string` or `int` value to the fixed set of cases of the enum; the database column can additionally restrict the values.

## When to use

When an entity property may only hold one of a fixed set of values (payment method type, batch size, status), and you want the entity to expose a typed enum instead of a raw string/int.

## Key steps / config

1. Define a backed enum, string- or int-backed. The docs use a string-backed `PaymentMethod` (values such as `'invoice'`) and an int-backed `BatchOrderSize` (values such as `12`, `144`):

```php
enum PaymentMethod: string {
    case INVOICE = 'invoice';
    // further cases
}
enum BatchOrderSize: int {
    // cases backed by int values
}
```

2. Use it in an attribute entity. The property must be typed with the enum class; the compiler maps `FieldType::ENUM` to `EnumField` and passes the enum's first case to the field constructor:

```php
class BatchOrderEntity extends Entity {
    #[Field(type: FieldType::ENUM, column: 'payment_method')]
    protected PaymentMethod $paymentMethod;

    #[Field(type: FieldType::ENUM, column: 'amount')]
    protected BatchOrderSize $amount;
    // getters/setters typed with the enum
}
```

3. Database column: for string enums an `ENUM('invoice', ...)` or string column, e.g. `` `payment_method` ENUM(...) NOT NULL ``; for int enums use a regular `INT` column (`` `amount` INT NOT NULL ``).

4. When defining fields manually, the constructor is `new EnumField(string $storageName, string $propertyName, \BackedEnum $enum)`; any case of the enum may be passed, and the backing type decides the DBAL type (`Types::STRING` or `Types::INTEGER`).

5. Working with values:
   - Set: `$batchOrder->setPaymentMethod(PaymentMethod::INVOICE);`
   - Validate user input: `PaymentMethod::tryFrom($userProvidedInput)` returns `null` for invalid input, otherwise an instance of `PaymentMethod`.
   - The docs build a Twig `select` element by iterating `PaymentMethod::cases()` and using `method.value` / `method.name`.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Field\EnumField`
- `FieldType::ENUM` (value `'enum'`)
- `#[Field(type: ..., column: ...)]` attribute
- `\BackedEnum`, `tryFrom()`, `cases()`
- `EnumFieldSerializer`

## Gotchas

- `ENUM` column types are not advisable for integer values: most RDBMS only support string values in `ENUM` and use integers internally. Use `INT`; the `BackedEnum` still restricts values unless the database is modified manually.
- The attribute compiler throws `invalidEnumField` if the property type is not a single named type or not a `\BackedEnum` class, so a pure (non-backed) enum is rejected; the `EnumField` constructor itself throws `fieldHasNoType` for an enum without backing type.
- On write, `EnumFieldSerializer` converts the incoming value with `tryFrom()`; an unknown value becomes `null` rather than an exception from the enum. A `Required` flag then fails `NotBlank` validation.
- On read, int-backed values that are not numeric throw an "expected field value of type" exception.
- The docs' example enum cases `PAYPAL`, `CREDIT_CARD` (and `DOZEN`, `SCORE`, `SMALL_GROSS`, `GROSS`, `GRAND` for `BatchOrderSize`) are example names only, not Shopware identifiers.

## Code check (6.7.13.0)
- absent `PAYPAL` — example enum case from the docs, not an identifier in the installed code
- absent `CREDIT_CARD` — example enum case from the docs, not an identifier in the installed code
- confirmed `EnumField` — class extends Field implements StorageAware — vendor/shopware/core/Framework/DataAbstractionLayer/Field/EnumField.php:14
- confirmed `FieldType::ENUM` — constant value 'enum', compiled to EnumField — vendor/shopware/core/Framework/DataAbstractionLayer/AttributeEntityCompiler.php:252
- confirmed `Types::INTEGER` — int backing maps to INTEGER, string to STRING — vendor/shopware/core/Framework/DataAbstractionLayer/Field/EnumField.php:35
- confirmed `AttributeEntityCompiler::getFirstEnumCase()` — property type must be a \BackedEnum, first case passed — vendor/shopware/core/Framework/DataAbstractionLayer/AttributeEntityCompiler.php:502
- confirmed `Field::$column` — attribute column parameter — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/Field.php:25
- confirmed `tryFrom` — write path resolves value via tryFrom, invalid becomes null — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/EnumFieldSerializer.php:41
- confirmed `EnumFieldSerializer::decode()` — returns ?\BackedEnum via tryFrom — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/EnumFieldSerializer.php:49
- confirmed `NotBlank` — added only when field has Required flag — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/EnumFieldSerializer.php:77
