---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/entity-acl.md
title: Entity based ACL
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/entity-acl.html
sourceHash: 065bd2235f5044e91497ab819548a07568c427e3
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "acl", "access control", "permissions", "AclRepository", "AclTable", "AclContextResolver", "AclDdlService", "AclQuery", "getUnionizedSqlQuery", "AclUnsupportedContextException", "b2b_acl.table", "b2b_acl.repository_factory", "grantable", "b2b_address.acl_repository"]
summary: B2B Suite entity ACL - M:N b2b_acl_* tables, AclRepository allow/deny/isAllowed, query filtering, and adding subjects (AclTable) or contexts.
lastBuilt: 2026-10-21
---
## What it is

The B2B Suite ACL component restricts access to any entity. At its core it is an implementation of **M:N relation management** in the database: it creates the tables, stores/removes relations and reads them, so several relations (e.g. user and role) resolve to one `true`/`false` or can be joined into a query. It has no dependencies on other framework parts and covers repository filtering and service checks; the Authentication component supplies the logged-in user context and the ACL route component secures routes.

Naming: **Context** = the user or role; **Subject** = the entity that is allowed/denied.

## When to use

- Granting/denying a contact or role access to records (e.g. addresses).
- Filtering a listing query by ACL assignments.
- Making your own entity ACL-aware, or adding a new context type besides contact and role.

## Key steps / config

**Data structure** - every ACL table looks like:

```sql
CREATE TABLE `b2b_acl_*` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `entity_id` INT(11) NOT NULL,
    `referenced_entity_id` INT(11) NOT NULL,
    `grantable` TINYINT(4) NOT NULL DEFAULT '0',
    [...]
);
```

No record = not accessible; record = accessible; `grantable` = `1` means the context may grant access to others. Addresses, for example, are allowed via a role table and a contact table, so one query selects all addresses allowed to a user through role and direct assignment.

**Usage** - there is no service, only `Shopware\B2B\Acl\Framework\AclRepository` (address instance: DIC id `b2b_address.acl_repository`). Methods, all taking a `$context`:
`allow($context, IdValue $subjectId, bool $grantable = false)`, `allowAll($context, array $subjectIds, bool $grantable = false)`, `deny`, `denyAll`, `isAllowed`, `isGrantable`, `getAllAllowedIds`, `fetchAllGrantableIds`, `fetchAllDirectlyIds`, `getUnionizedSqlQuery($context): AclQuery`.

Supported context types: `Shopware\B2B\Contact\Framework\ContactEntity`, `Shopware\B2B\StoreFrontAuthentication\Framework\Identity`, `Shopware\B2B\StoreFrontAuthentication\Framework\OwnershipContext`, `Shopware\B2B\Role\Framework\RoleEntity`, `Shopware\B2B\Role\Framework\RoleAclGrantContext`, `Shopware\B2B\Contact\Framework\ContactAclGrantContext`. Reads usually use both tables, writes only the directly related one. Unsupported contexts (e.g. any debtor identity) throw `Shopware\B2B\Acl\Framework\AclUnsupportedContextException`.

Filtering a listing (Doctrine `QueryBuilder`):

```php
$aclQuery = $this->aclRepository->getUnionizedSqlQuery($context);
$query->innerJoin(self::TABLE_ALIAS, '(' . $aclQuery->sql . ')', 'acl_query',
    self::TABLE_ALIAS . '.id = acl_query.referenced_entity_id');
foreach ($aclQuery->params as $name => $value) { $query->setParameter($name, $value); }
// catch AclUnsupportedContextException
```

**Add a new subject**:

1. Extend `Shopware\B2B\Acl\Framework\AclTable` per relation (e.g. `AddressContactAclTable`): call `parent::__construct(<name suffix>, <context table>, <context primary key>, <subject table name>, <subject primary key>)` (contact example: `'contact_address'`, `'b2b_debtor_contact'`, `'id'`, subject table, `'id'`) and implement `getContextResolvers(): array` returning e.g. `new AclTableContactContextResolver()`. Create an identical class for the role relation.
2. During plugin installation (container not set up yet) create the table: `AclDdlService::create()->createTable(new AddressContactAclTable());` (`Shopware\B2B\Acl\Framework\AclDdlService`).
3. Tag the table definition and register a repository via the factory:

```php
$services->set('b2b_address.contact_acl_table', Shopware\B2B\Address\Framework\AddressContactAclTable::class)
    ->tag('b2b_acl.table');
$services->set('b2b_address.acl_repository', Shopware\B2B\Acl\Framework\AclRepository::class)
    ->factory([service('b2b_acl.repository_factory'), 'createRepository'])
    ->args(['<subject table name>']);
```

**Add a new context** - extend `Shopware\B2B\Acl\Framework\AclContextResolver` and implement `getQuery(string $aclTableName, int $contextId, QueryBuilder $queryContext): AclQuery`, `extractId($context): int` and `isMainContext(): bool`. A generic `getQuery` uses `$this->getNextPrefix()` as alias, selects from `$aclTableName` where `entity_id = :p_<prefix>`, and returns `(new AclQuery())->fromQueryBuilder($queryBuilder)`. `extractId` returns the id for supported context objects (`ContactIdentity`, `OwnershipContext` whose `identityClassName` is a `ContactIdentity`, `ContactEntity`) and otherwise throws `AclUnsupportedContextException`. `isMainContext` flags the one resolver responsible for writes when several can extract an id.

## Essential identifiers

- `Shopware\B2B\Acl\Framework\AclRepository`, `AclQuery` (`sql`, `params`), `AclTable`, `AclContextResolver`, `AclDdlService`
- `Shopware\B2B\Acl\Framework\AclUnsupportedContextException`
- DIC: `b2b_address.acl_repository`, `b2b_acl.repository_factory` (`createRepository`), tag `b2b_acl.table`
- `AclTableContactContextResolver`, `RoleAclGrantContext`, `ContactAclGrantContext`

## Gotchas

- The ACL is a collection of functions, not an automatically wired security layer - you secure your workflows yourself.
- The source's address example uses the Shopware 5 table `s_user_addresses` as subject table; that table does not exist in Shopware 6.7 (the core address entity is `customer_address`).
- The source is inconsistent: it calls `AddressContactTable` in the DDL step (class defined is `AddressContactAclTable`), mentions `getContextResolver`/`getMainPrefix` (code uses `getContextResolvers`/`getNextPrefix`) and `UnsupportedContextException` (thrown class is `AclUnsupportedContextException`).
- The generated union query may look strange due to MySQL performance tuning.

## Code check (6.7.15.1)
- unverified `Shopware\B2B\Acl\Framework\AclRepository` — B2B Suite plugin code, not in the installed core/storefront/administration packages
- unverified `Shopware\B2B\Acl\Framework\AclTable` — B2B Suite plugin code, out of scope
- unverified `Shopware\B2B\Acl\Framework\AclContextResolver` — B2B Suite plugin code, out of scope
- unverified `Shopware\B2B\Acl\Framework\AclDdlService` — B2B Suite plugin code, out of scope
- unverified `b2b_acl.table` — B2B Suite service tag, out of scope
- absent `s_user_addresses` — Shopware 5 table, not found anywhere in the installed code
- confirmed `CustomerAddressDefinition::ENTITY_NAME` — 6.7 address entity is customer_address — vendor/shopware/core/Checkout/Customer/Aggregate/CustomerAddress/CustomerAddressDefinition.php:28
- confirmed `Doctrine\DBAL\Query\QueryBuilder` — DBAL query builder used by core — vendor/shopware/core/Framework/Migration/MigrationRuntime.php:6
