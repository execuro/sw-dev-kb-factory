---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/assignment-service.md
title: Assignment service
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/assignment-service.html
sourceHash: c4b3f00edd623bf4697ac0d3252e08ce4be9b673
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "assignment service", "m:n assignment", "RoleContactRepository", "RoleContactAssignmentService", "assignRoleContact", "removeRoleContactAssignment", "isMatchingDebtorForBothEntities", "Shopware\\B2B\\RoleContact\\Framework", "DbalHelper", "role contact"]
summary: B2B Suite M:N assignment pattern - repository plus service keyed by primary keys, e.g. RoleContactRepository and RoleContactAssignmentService
lastBuilt: 2026-09-15
---
## What it is

The Assignment service is a repeating B2B Suite pattern for connecting the suite's entities to each other through M:N assignments. Each assignment is implemented as a repository (storage access) plus a small service (the assign/remove API with an allowed-check).

## When to use

When you need to link two B2B Suite entities many-to-many (for example roles to contacts), or when reading or extending an existing assignment component.

## Key steps / config

### Repository

The repository is the exclusive access layer to the storage engine. Unlike CRUD operations, assignment methods take no objects, only plain integers (the primary keys). The default repository has three assignment-relevant methods (example from `Shopware\B2B\RoleContact\Framework`, using `Doctrine\DBAL\Connection` and `Shopware\B2B\Common\Repository\DbalHelper`):

```php
class RoleContactRepository
{
    public function removeRoleContactAssignment(int $roleId, int $contactId) { /* ... */ }
    public function assignRoleContact(int $roleId, int $contactId) { /* ... */ }
    public function isMatchingDebtorForBothEntities(int $roleId, int $contactId): bool { /* ... */ }
}
```

### Service

Services are even smaller and expose the two assignment methods. Internally they check whether the assignment is allowed and throw exceptions if not.

```php
/** Assigns roles to contacts M:N */
class RoleContactAssignmentService
{
    public function assign(int $roleId, int $contactId) { /* ... */ }
    public function removeAssignment(int $roleId, int $contactId) { /* ... */ }
}
```

## Essential identifiers

- `Shopware\B2B\RoleContact\Framework\RoleContactRepository` - `assignRoleContact()`, `removeRoleContactAssignment()`, `isMatchingDebtorForBothEntities()`
- `Shopware\B2B\RoleContact\Framework\RoleContactAssignmentService` - `assign()`, `removeAssignment()`
- `Shopware\B2B\Common\Repository\DbalHelper` - repository helper from the common library

## Gotchas

- The allowed-check and the exceptions for disallowed assignments are in the service, not in the repository's `assignRoleContact()`/`removeRoleContactAssignment()`.
- Assignment methods work on integer primary keys only; no entity objects are passed.

## Code check (6.7.13.0)
- unverified `Shopware\B2B\RoleContact\Framework\RoleContactRepository` — B2B Suite class; no match in installed vendor/shopware/{core,storefront}, extension not installed
- unverified `Shopware\B2B\RoleContact\Framework\RoleContactAssignmentService` — B2B Suite class; out of scope of the installed vendor/shopware roots
- unverified `Shopware\B2B\Common\Repository\DbalHelper` — B2B Suite common library; not present in the installed vendor/shopware roots
- unverified `RoleContactRepository::isMatchingDebtorForBothEntities()` — B2B Suite method; cannot be checked against installed code
