---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/core/entity-acl.md
title: Entity based ACL
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/core/entity-acl.html"
sourceHash: "5f2bbad1e4f10eadc50713dece6d1130a5175c1d"
keywords: ["entity ACL", "AclRepository", "AclTable", "AclContextResolver", "AclDdlService", "AclQuery", "AclUnsupportedContextException", "b2b_acl.table", "getUnionizedSqlQuery", "isAllowed", "isGrantable", "b2b suite", "access control"]
summary: "The B2B Suite's ACL component implements entity-level M:N access control tables, queried and extended via AclRepository/AclTable/AclContextResolver."
lastBuilt: "2026-09-15"
---
## What it is

Describes the B2B Suite's Entity based ACL component: a dependency-free M:N relation manager in the database that lets any entity ("Subject") be access-restricted for any "Context" (usually a user or role). The base component covers repository filtering and service checks; a separate Authentication component provides the logged-in user context, and a separate ACL route component secures routes.

## When to use

Use when a new B2B Suite entity needs per-role or per-contact access restriction (allow/deny/grantable), or when extending the ACL to a custom context type.

## Key steps / config

ACL tables are always shaped like:

```sql
CREATE TABLE `b2b_acl_*` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `entity_id` INT(11) NOT NULL,
    `referenced_entity_id` INT(11) NOT NULL,
    `grantable` TINYINT(4) NOT NULL DEFAULT '0'
);
```

No record means no access; a record means access; `grantable = 1` means the context may grant access to others.

Access is read/written through `Shopware\B2B\Acl\Framework\AclRepository` (e.g. retrieved from the DIC via a component-specific key such as `b2b_address.acl_repository`), which exposes `allow()`, `allowAll()`, `deny()`, `denyAll()`, `isAllowed()`, `isGrantable()`, `getAllAllowedIds()`, `fetchAllGrantableIds()`, `fetchAllDirectlyIds()`, and `getUnionizedSqlQuery()`. All methods act on a context, which must be one of: `Shopware\B2B\Contact\Framework\ContactEntity`, `Shopware\B2B\StoreFrontAuthentication\Framework\Identity`, `Shopware\B2B\StoreFrontAuthentication\Framework\OwnershipContext`, `Shopware\B2B\Role\Framework\RoleEntity`, `Shopware\B2B\Role\Framework\RoleAclGrantContext`, or `Shopware\B2B\Contact\Framework\ContactAclGrantContext`; an unsupported context throws `Shopware\B2B\Acl\Framework\AclUnsupportedContextException` (e.g. debtor identities are unknown to the ACL). Reading typically uses both role and contact tables; writing uses only the directly related table.

To filter a query by ACL in a repository, join the query built from `getUnionizedSqlQuery($context)`:

```php
$aclQuery = $this->aclRepository->getUnionizedSqlQuery($context);
$query->innerJoin(self::TABLE_ALIAS, '(' . $aclQuery->sql . ')', 'acl_query',
    self::TABLE_ALIAS . '.id = acl_query.referenced_entity_id');
foreach ($aclQuery->params as $name => $value) {
    $query->setParameter($name, $value);
}
```

To add a new Subject (e.g. addresses):
1. Define a relation class extending `Shopware\B2B\Acl\Framework\AclTable`, passing a name suffix, context table, context primary key, subject table name, and subject primary key to the parent constructor, and implementing `getContextResolvers()`.
2. Create the DDL table once during plugin installation via `Shopware\B2B\Acl\Framework\AclDdlService::create()->createTable(new AddressContactTable())`.
3. Register the table class as a service tagged `b2b_acl.table`.
4. Register the repository, using the `b2b_acl.repository_factory` factory service's `createRepository` method with the subject table name as an argument.

To add a new context type, implement `Shopware\B2B\Acl\Framework\AclContextResolver`, providing `getQuery(string $aclTableName, int $contextId, QueryBuilder $queryContext): AclQuery`, `extractId($context): int`, and `isMainContext(): bool`; `extractId()` should throw `AclUnsupportedContextException` when no id can be produced.

## Essential identifiers

- `Shopware\B2B\Acl\Framework\AclRepository`
- `Shopware\B2B\Acl\Framework\AclTable`
- `Shopware\B2B\Acl\Framework\AclContextResolver`
- `Shopware\B2B\Acl\Framework\AclDdlService`
- `Shopware\B2B\Acl\Framework\AclQuery`
- `Shopware\B2B\Acl\Framework\AclUnsupportedContextException`
- `allow()` / `deny()` / `isAllowed()` / `isGrantable()` / `getUnionizedSqlQuery()`
- `b2b_acl.table` (service tag), `b2b_acl.repository_factory` (factory service id)

## Gotchas

Only one `AclContextResolver` may be flagged `isMainContext(): true` per context type — it is the resolver responsible for writes, notifying `AclRepository`. The ACL component itself is only a collection of commonly used functions, not an automatically wired security layer; developers remain responsible for securing their own workflow.
