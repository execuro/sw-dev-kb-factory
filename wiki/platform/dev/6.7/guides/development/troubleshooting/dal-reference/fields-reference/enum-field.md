---
id: platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/enum-field.md
title: EnumField Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/dal-reference/fields-reference/enum-field.html
sourceHash: 358703e7dc62079bad5ba901ab898d2540efef0f
codeCheckedAgainst: "6.7.15.1"
keywords: ["EnumField", "BackedEnum", "FieldType::ENUM", "enum field", "php enum", "EnumFieldSerializer", "string backed enum", "int backed enum", "tryFrom", "attribute entity", "restrict values", "mysql enum column"]
summary: EnumField maps a PHP BackedEnum (string or int) to a DAL column; usage via FieldType::ENUM in attribute entities, storage type and validation rules.
lastBuilt: 2026-10-21
---
## What it is

`EnumField` (`Shopware\Core\Framework\DataAbstractionLayer\Field\EnumField`, extends `Field`, implements `StorageAware`) restricts a property to the cases of a PHP `\BackedEnum`. String-backed enums are stored as DBAL `string`, int-backed enums as DBAL `integer`.

## When to use

When an entity property may only hold a fixed set of `string` or `int` values and you want the DAL to hydrate it as an enum instance instead of a raw scalar.

## Key steps / config

1. Define a backed enum:

```php
enum PaymentMethod: string {
    case CREDIT_CARD = 'credit_card';
    case INVOICE = 'invoice';
}
enum BatchOrderSize: int { case DOZEN = 12; case GROSS = 144; }
```

2. Attribute-based entity: type the property with the enum and use `FieldType::ENUM` (the compiler maps it to `EnumField` and passes the enum's first case):

```php
#[Field(type: FieldType::ENUM, column: 'payment_method')]
protected PaymentMethod $paymentMethod;

#[Field(type: FieldType::ENUM, column: 'amount')]
protected BatchOrderSize $amount;
```

   Plus typed getters/setters (`getPaymentMethod(): PaymentMethod`, `setPaymentMethod(PaymentMethod $paymentMethod): void`, same for `amount`).

3. Classic definition: `new EnumField(string $storageName, string $propertyName, \BackedEnum $enum)` - pass any case of the enum, e.g. `PaymentMethod::INVOICE`.

4. Database column: a string enum may use an `ENUM('credit_card', 'invoice')` column; for int enums use a plain `INT` column.

5. Using it: `$batchOrder->setPaymentMethod(PaymentMethod::INVOICE);`, list options with `PaymentMethod::cases()` (`method.value` / `method.name` in Twig), validate input with `PaymentMethod::tryFrom($userProvidedInput)` (returns `null` for invalid values).

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Field\EnumField`
- `FieldType::ENUM` (`'enum'`), `#[Field(type: ..., column: ...)]`
- `\BackedEnum`, `tryFrom()`, `cases()`
- `EnumFieldSerializer`

## Gotchas

- The property type must be a `\BackedEnum` class; a union/untyped property or a pure (non-backed) enum throws `invalidEnumField` at compile time. A backed type other than `int`/`string` throws `fieldHasNoType`.
- On write, the serializer runs `tryFrom()` on the input; an unknown value becomes `null`, so it then fails only if the field is `Required` (adds `NotBlank`).
- Avoid MySQL `ENUM` for int values: most RDBMS only support string enum values and use integers internally. The `BackedEnum` still restricts values unless the database is modified manually.
- The source's examples use a `PAYPAL` case; that is example enum content only, not a core identifier.

## Code check (6.7.15.1)
- absent `PAYPAL` — example enum case from the docs; no such identifier in core
- confirmed `EnumField` — extends Field implements StorageAware — vendor/shopware/core/Framework/DataAbstractionLayer/Field/EnumField.php:14
- confirmed `EnumField::__construct()` — (storageName, propertyName, BackedEnum case) — vendor/shopware/core/Framework/DataAbstractionLayer/Field/EnumField.php:27
- confirmed `EnumField::getType()` — int maps to integer, string to string, else fieldHasNoType — vendor/shopware/core/Framework/DataAbstractionLayer/Field/EnumField.php:57
- confirmed `FieldType::ENUM` — value 'enum' — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/FieldType.php:16
- confirmed `FieldType::ENUM` — compiled to EnumField with the first enum case — vendor/shopware/core/Framework/DataAbstractionLayer/AttributeEntityCompiler.php:310
- confirmed `AttributeEntityCompiler::getFirstEnumCase()` — property type must be a BackedEnum — vendor/shopware/core/Framework/DataAbstractionLayer/AttributeEntityCompiler.php:310
- confirmed `EnumFieldSerializer::encode()` — tryFrom on input, invalid becomes null — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/EnumFieldSerializer.php:28
- confirmed `Field::$column` — attribute parameter for the storage column — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/Field.php:27
