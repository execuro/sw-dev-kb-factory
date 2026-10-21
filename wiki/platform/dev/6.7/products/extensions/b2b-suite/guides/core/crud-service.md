---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/crud-service.md
title: CRUD service
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/crud-service.html
sourceHash: c6d235a00de18d610b88dd091047dcf7054d5429
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "crud service", "AbstractCrudService", "CrudServiceRequest", "CrudEntity", "IdValue", "RoleCrudService", "RoleRepository", "RoleValidationService", "ValidationBuilder", "ValidationException", "OwnershipContext", "create update delete", "entity repository"]
summary: B2B Suite CRUD pattern - CrudEntity entity, DBAL repository, ValidationService and AbstractCrudService with CrudServiceRequest whitelists.
lastBuilt: 2026-10-21
---
## What it is

The B2B Suite ships its own entities and implements create/update/delete for all of them with one naming convention and pattern: an **entity**, a **repository**, a **validation service** and a **CRUD service**. The example used throughout is the role component (`Shopware\B2B\Role\Framework`).

## When to use

When you add your own B2B Suite entity, or call/extend an existing B2B entity's write path (e.g. roles) and need to know which object does what.

## Key steps / config

1. **Entity** - a uniquely identifiable storage object with public properties and few convenience methods. It may implement the convenience interface `Shopware\B2B\Common\CrudEntity` (not required to assign context). Ids are `Shopware\B2B\Common\IdValue` (`IdValue::null()`, `IdValue::create()`, `getValue()`, `getStorageValue()`). The `RoleEntity` example has `isNew()`, `toDatabaseArray()`, `fromDatabaseArray(array): CrudEntity`, `setData(array)`, `toArray()` and `jsonSerialize()`.
2. **Repository** - handles all storage and retrieval. Unlike Shopware default repositories it does not use the ORM (DAL) and does not expose queries; it works on a `Doctrine\DBAL\Connection`. No validation here. Methods throw typed exceptions:
   - `fetchOneById(int $id)` - `NotFoundException`
   - `addRole(RoleEntity)` - `Shopware\B2B\Common\Repository\CanNotInsertExistingRecordException`
   - `updateRole(RoleEntity)` - `...\CanNotUpdateExistingRecordException`
   - `removeRole(RoleEntity)` - `...\CanNotRemoveExistingRecordException`
3. **Validation service** - one per entity (`RoleValidationService`), built from `Shopware\B2B\Common\Validator\ValidationBuilder` and Symfony `ValidatorInterface`; `createInsertValidation(RoleEntity): Validator` and `createUpdateValidation(RoleEntity): Validator` return assertions a controller can evaluate and print.
4. **CRUD service** - the real entry point; reusable, independent of I/O, must not depend on HTTP. It extends `Shopware\B2B\Common\Service\AbstractCrudService` and builds request objects that whitelist the allowed fields:

```php
public function createNewRecordRequest(array $data): CrudServiceRequest
{
    return new CrudServiceRequest($data, ['name', 'contextOwnerId', 'parentId']);
}

public function createExistingRecordRequest(array $data): CrudServiceRequest
{
    return new CrudServiceRequest($data, ['id', 'name', 'contextOwnerId']);
}
```

5. Pass the filled `CrudServiceRequest` to the action - `create`, `update`, `remove`, `move` - together with an `OwnershipContext`; `create`/`update` throw `Shopware\B2B\Common\Validator\ValidationException`. Other parameters may be needed, e.g. an `Identity` deciding whether the logged-in user may access the data.

## Essential identifiers

- `Shopware\B2B\Common\Service\AbstractCrudService`, `Shopware\B2B\Common\Service\CrudServiceRequest`
- `Shopware\B2B\Common\CrudEntity`, `Shopware\B2B\Common\IdValue`
- `Shopware\B2B\Common\Validator\ValidationBuilder`, `Shopware\B2B\Common\Validator\ValidationException`
- `Shopware\B2B\Common\Repository\CanNotInsertExistingRecordException`, `CanNotUpdateExistingRecordException`, `CanNotRemoveExistingRecordException`
- `Shopware\B2B\Role\Framework\RoleCrudService`, `RoleRepository`, `RoleValidationService`, `RoleEntity`

## Gotchas

- Whether an entity can be stored or retrieved can only be determined securely by the existence of the corresponding repository methods, not by `CrudEntity`.
- The `CrudServiceRequest` field list both filters a larger request and limits what enters the service; content validation still happens in the validation service.

## Code check (6.7.15.1)
- unverified `Shopware\B2B\Common\Service\AbstractCrudService` — B2B Suite plugin code, not in the installed core/storefront/administration packages
- unverified `Shopware\B2B\Common\Service\CrudServiceRequest` — B2B Suite plugin code, out of scope
- unverified `Shopware\B2B\Common\CrudEntity` — B2B Suite plugin code, out of scope
- unverified `Shopware\B2B\Common\Validator\ValidationBuilder` — B2B Suite plugin code, out of scope
- confirmed `Doctrine\DBAL\Connection` — DBAL connection type used by core services — vendor/shopware/core/Checkout/Customer/Validation/CustomerEmailUniqueChecker.php:6
- confirmed `Symfony\Component\Validator\Validator\ValidatorInterface` — Symfony validator also injected by core — vendor/shopware/core/Framework/Validation/DataValidator.php:9
