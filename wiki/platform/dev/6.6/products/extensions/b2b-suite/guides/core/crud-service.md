---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/core/crud-service.md
title: CRUD service
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/core/crud-service.html"
sourceHash: "c6d235a00de18d610b88dd091047dcf7054d5429"
keywords: ["CRUD service", "b2b suite", "CrudEntity", "AbstractCrudService", "CrudServiceRequest", "ValidationService", "ValidationException", "RoleEntity", "RoleRepository", "RoleCrudService", "IdValue"]
summary: "The B2B Suite's CRUD pattern: a CrudEntity, a plain repository, a ValidationService, and an AbstractCrudService entry point."
lastBuilt: "2026-09-15"
---
## What it is

Describes the CRUD service pattern the B2B Suite uses for creating, updating, and deleting its own entities. An example plugin ("B2bAcl.zip") showcasing the topic is referenced by the docs.

## Key steps / config

- Entity: a uniquely identifiable storage object with public properties, implementing `Shopware\B2B\Common\CrudEntity`. Example shape (`RoleEntity`):

```php
class RoleEntity implements CrudEntity
{
    public IdValue $id;
    public string $name;
    public IdValue $contextOwnerId;
    // ... left, right, level, hasChildren, children
    public function isNew(): bool
    public function toDatabaseArray(): array
    public function fromDatabaseArray(array $roleData): CrudEntity
    public function setData(array $data)
    public function toArray(): array
    public function jsonSerialize(): array
}
```

- Repository: handles storage/retrieval directly (no ORM, no exposed queries), e.g. `RoleRepository` with `fetchOneById()`, `addRole()`, `updateRole()`, `removeRole()`, each typed to throw a specific exception (`CanNotInsertExistingRecordException`, `CanNotUpdateExistingRecordException`, `CanNotRemoveExistingRecordException`).
- Validation service: every entity has a corresponding `ValidationService` (e.g. `RoleValidationService`) with `createInsertValidation()`/`createUpdateValidation()`, producing assertions a controller can evaluate and print.
- CRUD service: the real entry point, extending `Shopware\B2B\Common\Service\AbstractCrudService`. It builds a `CrudServiceRequest` restricted to allowed fields (e.g. `createNewRecordRequest()`/`createExistingRecordRequest()`), then exposes `create()`, `update()`, `remove()`, `move()`, each taking the request plus an `OwnershipContext` and throwing `ValidationException` where relevant.

## Essential identifiers

- `Shopware\B2B\Common\CrudEntity`
- `Shopware\B2B\Common\Service\AbstractCrudService`
- `Shopware\B2B\Common\Service\CrudServiceRequest`
- `ValidationException`
- `create()` / `update()` / `remove()` / `move()`

## Gotchas

CRUD services are not allowed to depend on HTTP implementations directly; they define their own request classes (`CrudServiceRequest`) so only validated, source-independent data reaches the service, with actual validation performed by the `ValidationService`.
