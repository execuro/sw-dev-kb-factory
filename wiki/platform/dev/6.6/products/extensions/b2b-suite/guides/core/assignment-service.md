---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/core/assignment-service.md
title: Assignment service
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/core/assignment-service.html"
sourceHash: "c4b3f00edd623bf4697ac0d3252e08ce4be9b673"
keywords: ["assignment service", "b2b suite", "M:N assignment", "RoleContactRepository", "RoleContactAssignmentService", "repository", "primary keys", "assign", "removeAssignment"]
summary: "The B2B Suite's Assignment service pattern connects entities via M:N relations using a repository and a thin service layer."
lastBuilt: "2026-09-15"
---
## What it is

Describes the Assignment service, a repeating B2B Suite pattern used to connect the Suite's many entities to each other through M:N assignments.

## When to use

Relevant when implementing a new M:N relation between two B2B Suite entities (e.g. roles and contacts).

## Key steps / config

- The repository is the exclusive access layer to the storage engine for the assignment; unlike CRUD operations, it works with plain integers (primary keys) rather than objects. Example default repository methods:

```php
namespace Shopware\B2B\RoleContact\Framework;

class RoleContactRepository
{
    public function removeRoleContactAssignment(int $roleId, int $contactId)
    public function assignRoleContact(int $roleId, int $contactId)
    public function isMatchingDebtorForBothEntities(int $roleId, int $contactId): bool
}
```

- The service layer is smaller and contains only the two methods relevant for assignment; it internally checks whether the assignment is allowed and throws exceptions if not:

```php
namespace Shopware\B2B\RoleContact\Framework;

class RoleContactAssignmentService
{
    public function assign(int $roleId, int $contactId)
    public function removeAssignment(int $roleId, int $contactId)
}
```

## Essential identifiers

- `Shopware\B2B\RoleContact\Framework\RoleContactRepository`
- `Shopware\B2B\RoleContact\Framework\RoleContactAssignmentService`
- `assignRoleContact()` / `removeRoleContactAssignment()` / `isMatchingDebtorForBothEntities()`
- `assign()` / `removeAssignment()`
