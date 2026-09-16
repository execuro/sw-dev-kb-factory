---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/crud-service.md
title: CRUD service
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/crud-service.html
sourceHash: c6d235a00de18d610b88dd091047dcf7054d5429
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "crud service", "AbstractCrudService", "CrudServiceRequest", "CrudEntity", "IdValue", "RoleCrudService", "RoleRepository", "RoleValidationService", "ValidationException", "OwnershipContext", "create update delete", "entity repository pattern"]
summary: "B2B Suite CRUD pattern: CrudEntity entities, DBAL repositories with typed exceptions, ValidationService, and AbstractCrudService with CrudServiceRequest."
lastBuilt: 2026-09-15
---
## What it is

The CRUD service is the repeating pattern the B2B Suite uses to create, update and delete its own entities. Every entity uses the same naming convention and objects: Entity, Repository, ValidationService and CrudService (example: the Role component, namespace `Shopware\B2B\Role\Framework`).

## When to use

When implementing or extending a B2B Suite entity, or calling a B2B component service to write data.

## Key steps / config

1. **Entity** — uniquely identifiable storage object with public properties and a few convenience methods, optionally implementing `Shopware\B2B\Common\CrudEntity`. Ids are `Shopware\B2B\Common\IdValue` (`IdValue::null()`, `IdValue::create()`, `getValue()`, `getStorageValue()`). The Role example's shape:

```php
class RoleEntity implements CrudEntity
{
    public IdValue $id;
    public IdValue $contextOwnerId;
    public function isNew(): bool { /* ... */ }
    public function toDatabaseArray(): array { /* ... */ }
    public function fromDatabaseArray(array $roleData): CrudEntity { /* ... */ }
    public function setData(array $data) { /* ... */ }
    public function toArray(): array { /* ... */ }
    public function jsonSerialize(): array { /* ... */ }
}
```

2. **Repository** — all storage/retrieval via `Doctrine\DBAL\Connection` (no ORM, no exposed queries, no validation). `fetchOneById()`, `addRole()`, `updateRole()`, `removeRole()` throw typed exceptions: `NotFoundException`, `Shopware\B2B\Common\Repository\CanNotInsertExistingRecordException`, `CanNotUpdateExistingRecordException`, `CanNotRemoveExistingRecordException`.
3. **Validation service** — `RoleValidationService` built from `Shopware\B2B\Common\Validator\ValidationBuilder` and Symfony `ValidatorInterface`; `createInsertValidation()` / `createUpdateValidation()` return a `Shopware\B2B\Common\Validator\Validator` whose assertions a controller prints.
4. **CRUD service** — extends `Shopware\B2B\Common\Service\AbstractCrudService`; the I/O-independent entry point, never depending on HTTP. It builds `Shopware\B2B\Common\Service\CrudServiceRequest` objects whitelisting fields:

```php
public function createNewRecordRequest(array $data): CrudServiceRequest
{
    return new CrudServiceRequest($data, ['name', 'contextOwnerId', 'parentId']);
}
```

`createExistingRecordRequest()` allows `id`, `name`, `contextOwnerId`.
5. Call the action with the request plus e.g. an `OwnershipContext`: `create()`, `update()` (may throw `Shopware\B2B\Common\Validator\ValidationException`), `remove()`, `move()`.

## Essential identifiers

- `AbstractCrudService`, `CrudServiceRequest`, `CrudEntity`, `IdValue`
- `ValidationBuilder`, `Validator`, `ValidationException`

## Gotchas

- `CrudEntity` is a convenience interface, not required to assign context; whether an entity can be stored/retrieved is only securely determined by matching repository methods existing.
- Request objects filter a larger input down to allowed data points; content is still validated by the ValidationService.
- The B2B Suite classes are not in the installed Shopware packages, so the pattern could not be checked against code.

## Code check (6.7.13.0)
- unverified `Shopware\B2B\Common\CrudEntity` — B2B Suite interface, not in vendor/shopware core/storefront/administration
- unverified `Shopware\B2B\Common\IdValue` — B2B Suite class, out of scope of installed packages
- unverified `Shopware\B2B\Common\Service\AbstractCrudService` — B2B Suite base class, required members cannot be read
- unverified `Shopware\B2B\Common\Service\CrudServiceRequest` — B2B Suite class, out of scope
- unverified `Shopware\B2B\Common\Validator\ValidationException` — B2B Suite class, out of scope
- unverified `Symfony\Component\Validator\Validator\ValidatorInterface` — vendor/symfony, out of scope
- unverified `Doctrine\DBAL\Connection` — vendor/doctrine, out of scope
