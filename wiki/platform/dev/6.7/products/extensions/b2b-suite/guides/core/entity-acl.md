---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/entity-acl.md
title: Entity based ACL
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/entity-acl.html
sourceHash: 065bd2235f5044e91497ab819548a07568c427e3
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "acl", "access control", "AclRepository", "AclTable", "AclContextResolver", "AclDdlService", "AclQuery", "AclUnsupportedContextException", "b2b_acl.table", "b2b_acl.repository_factory", "b2b_address.acl_repository", "getUnionizedSqlQuery", "entity permissions", "m:n relation"]
summary: "B2B Suite entity ACL: M:N b2b_acl_* tables, AclRepository allow/deny/isAllowed, AclTable subjects tagged b2b_acl.table, custom AclContextResolver."
lastBuilt: 2026-09-15
---
## What it is

The B2B Suite ACL component restricts access to any entity through M:N relation tables in the database. It creates the tables, stores/removes relations, and reads them, resolving several relations (e.g. contact and role) into a single `true`/`false` result or a SQL join. It has no dependencies on other parts of the framework and covers repository filtering and service checks; authentication context and route protection are handled by separate B2B components.

Naming: the **context** is the user or role; the **subject** is the entity that is allowed/denied.

## When to use

- Checking or changing whether a contact/role may access a B2B entity (e.g. addresses).
- Filtering a listing query by ACL assignments.
- Making your own entity ACL-aware (new subject) or restricting by a context other than contact/role.

## Key steps / config

Table shape (always the same):

```sql
CREATE TABLE `b2b_acl_*` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `entity_id` INT(11) NOT NULL,
    `referenced_entity_id` INT(11) NOT NULL,
    `grantable` TINYINT(4) NOT NULL DEFAULT '0',
    [...]
);
```

No record = not accessible; record exists = accessible; `grantable` = `1` means the context may grant access to others.

**Using a repository.** Fetch an `Shopware\B2B\Acl\Framework\AclRepository` from the DIC (address example: `b2b_address.acl_repository`). Methods: `allow($context, IdValue $subjectId, bool $grantable = false)`, `allowAll`, `deny`, `denyAll`, `isAllowed`, `isGrantable`, `getAllAllowedIds`, `fetchAllGrantableIds`, `fetchAllDirectlyIds`, `getUnionizedSqlQuery($context): AclQuery`. Supported context types:

- `Shopware\B2B\Contact\Framework\ContactEntity`
- `Shopware\B2B\StoreFrontAuthentication\Framework\Identity`
- `Shopware\B2B\StoreFrontAuthentication\Framework\OwnershipContext`
- `Shopware\B2B\Role\Framework\RoleEntity`
- `Shopware\B2B\Role\Framework\RoleAclGrantContext`
- `Shopware\B2B\Contact\Framework\ContactAclGrantContext`

Reads usually use both tables; writes use only the directly related table.

**Filtering a listing.** Call `getUnionizedSqlQuery($context)`, `innerJoin` `'(' . $aclQuery->sql . ')'` as `acl_query` on `<alias>.id = acl_query.referenced_entity_id`, copy `$aclQuery->params` with `setParameter`, and catch `AclUnsupportedContextException`.

**Adding a subject.**
1. Extend `Shopware\B2B\Acl\Framework\AclTable`: call `parent::__construct(<name suffix>, <context table>, <context PK>, <subject table>, <subject PK>)` (e.g. `'contact_address', 'b2b_debtor_contact', 'id', 's_user_addresses', 'id'`) and return resolvers from `getContextResolvers()` (e.g. `new AclTableContactContextResolver()`). Create one class per context (contact and role).
2. During plugin installation create the table via the static factory: `AclDdlService::create()->createTable(new <YourAclTable>())`.
3. Tag the table service:
   ```php
   $services->set('b2b_address.contact_acl_table', AddressContactAclTable::class)
       ->tag('b2b_acl.table');
   $services->set('b2b_address.acl_repository', AclRepository::class)
       ->factory([service('b2b_acl.repository_factory'), 'createRepository'])
       ->args(['s_user_addresses']);
   ```

**Adding a context.** Create an `AclContextResolver` subclass implementing `getQuery(string $aclTableName, int $contextId, QueryBuilder $queryBuilder): AclQuery`, `extractId($context): int` and `isMainContext(): bool`. `getQuery` should use `$this->getNextPrefix()` for aliases and return `(new AclQuery())->fromQueryBuilder($queryBuilder)`. `extractId` throws `AclUnsupportedContextException` when no ID can be produced. `isMainContext` marks the single resolver responsible for writes.

## Essential identifiers

- `Shopware\B2B\Acl\Framework\AclRepository`, `AclTable`, `AclContextResolver`, `AclDdlService`, `AclQuery`, `AclUnsupportedContextException`
- `Shopware\B2B\Contact\Framework\AclTableContactContextResolver`
- Service tag `b2b_acl.table`; factory service `b2b_acl.repository_factory` (`createRepository`)
- Service ids `b2b_address.acl_repository`, `b2b_contact.repository`
- Table prefix `b2b_acl_*`

## Gotchas

- Unsupported contexts throw `AclUnsupportedContextException`; debtor identities are unknown to the ACL and always trigger it.
- The ACL is not an automatically wired security layer; you must secure your workflows yourself.
- The unionized SQL is tuned for MySQL and may look unusual when inspected.
- The source is internally inconsistent: it names `AddressContactTable` in the DDL snippet but `AddressContactAclTable` for the class, refers to `getContextResolver`/`getMainPrefix`/`UnsupportedContextException` in prose while snippets use `getContextResolvers`, `getNextPrefix` and `AclUnsupportedContextException`.

## Code check (6.7.13.0)
- unverified `Shopware\B2B\Acl\Framework\AclRepository` — B2B Suite package not installed; not in vendor/shopware core/storefront/administration
- unverified `Shopware\B2B\Acl\Framework\AclTable` — B2B Suite package not installed
- unverified `Shopware\B2B\Acl\Framework\AclContextResolver` — B2B Suite package not installed
- unverified `AclDdlService::create()` — B2B Suite package not installed
- unverified `Shopware\B2B\Acl\Framework\AclUnsupportedContextException` — B2B Suite package not installed
- unverified `b2b_acl.table` — tag not found in the installed Shopware packages; defined by the B2B Suite
- unverified `b2b_acl.repository_factory` — service not found in the installed Shopware packages
- unverified `b2b_address.acl_repository` — service not found in the installed Shopware packages
