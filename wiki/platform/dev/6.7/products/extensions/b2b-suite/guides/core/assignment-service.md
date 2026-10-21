---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/assignment-service.md
title: Assignment service
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/assignment-service.html
sourceHash: c4b3f00edd623bf4697ac0d3252e08ce4be9b673
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "assignment service", "m:n assignment", "many to many", "RoleContactRepository", "RoleContactAssignmentService", "assignRoleContact", "removeRoleContactAssignment", "isMatchingDebtorForBothEntities", "role contact", "repository pattern"]
summary: B2B Suite assignment pattern for M:N links between entities - repository methods on primary keys plus a small service that validates and assigns.
lastBuilt: 2026-10-21
---
## What it is

The Assignment service is a recurring pattern in the B2B Suite for connecting its many entities to each other through M:N assignments. Each assignment is implemented by a repository (the exclusive access layer to storage) and a small service that validates and performs the assignment.

## When to use

When you need to link two B2B Suite entities M:N (for example roles to contacts), or when implementing a new assignment in your own B2B component following the same pattern.

## Key steps / config

1. **Repository** — the only access layer to the storage engine. Unlike CRUD operations, it works with plain integers (primary keys), not objects. The default repository has three methods relevant for assignment, e.g. in `Shopware\B2B\RoleContact\Framework`:

```php
class RoleContactRepository
{
    public function removeRoleContactAssignment(int $roleId, int $contactId) { /* ... */ }
    public function assignRoleContact(int $roleId, int $contactId) { /* ... */ }
    public function isMatchingDebtorForBothEntities(int $roleId, int $contactId): bool { /* ... */ }
}
```

2. **Service** — smaller still, with the two methods relevant for assignment. Internally it checks whether the assignment is allowed and throws exceptions if not:

```php
/** Assigns roles to contacts M:N */
class RoleContactAssignmentService
{
    public function assign(int $roleId, int $contactId) { /* ... */ }
    public function removeAssignment(int $roleId, int $contactId) { /* ... */ }
}
```

## Essential identifiers

- `Shopware\B2B\RoleContact\Framework\RoleContactRepository` — `assignRoleContact()`, `removeRoleContactAssignment()`, `isMatchingDebtorForBothEntities()`
- `Shopware\B2B\RoleContact\Framework\RoleContactAssignmentService` — `assign()`, `removeAssignment()`
- `Shopware\B2B\Common\Repository\DbalHelper` (imported by the repository), `Doctrine\DBAL\Connection`

## Gotchas

- Assignment repositories operate on primary key integers, not entity objects.
- The allowed-assignment check and the exceptions for disallowed assignments live in the service, not in the repository.

## Code check (6.7.15.1)
- unverified `RoleContactRepository` — B2B Suite plugin class, not in vendor/shopware core, storefront or administration
- unverified `RoleContactAssignmentService` — B2B Suite plugin class, out of the checked vendor roots
- unverified `Shopware\B2B\Common\Repository\DbalHelper` — B2B Suite namespace, no `Shopware\B2B` code in the checked roots
