---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/references/role-permission-mapping.md
title: Role and Permission Mapping
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/references/role-permission-mapping.html
sourceHash: 3933849655b099305821f1458c5b4801c91904aa
codeCheckedAgainst: "6.7.15.1"
keywords: ["B2BMigrationPermissionEvent", "permission mapping", "role mapping", "b2b suite migration", "b2b commercial", "employee role", "approval_rule.create", "organization_unit.read", "employee.read", "quote.request", "role.edit", "acl"]
summary: B2B Suite to B2B Commercial permission mapping, merging of multiple roles into one, and overrides via B2BMigrationPermissionEvent.
lastBuilt: 2026-10-21
---
## What it is

Reference of how B2B Suite permissions and roles are transformed into B2B Commercial permissions and roles during the migration, including the dependency permissions added so that related functionality keeps working.

## When to use

When you need to know which B2B Commercial permission an employee gets for a given B2B Suite permission, how migrated role names are built, or how to customise the default mapping.

## Key steps / config

**Permission mapping (condensed by category)**

Some B2B Suite permissions have no B2B Commercial counterpart because the feature does not exist there; they map to the nearest equivalent.

| B2B Suite | B2B Commercial | Dependencies |
|---|---|---|
| `address_assign`, `address_create` | `organization_unit.shipping_address.create` | `organization_unit.billing_address.create`, `organization_unit.create`, `organization_unit.update` |
| `address_delete` | `organization_unit.shipping_address.delete` | `organization_unit.billing_address.delete` |
| `address_detail` | `organization_unit.shipping_address.update` | `organization_unit.billing_address.update`, `organization_unit.create`, `organization_unit.update` |
| `address_update` | `organization_unit.shipping_address.update` | `organization_unit.create`, `organization_unit.update` |
| `address_list` | `organization_unit.read` | `organization_unit.create`, `organization_unit.update` |
| `company_list` | `organization_unit.read` | none |
| `budget_*`, `contingent_*`, `contingentrule_*` | `approval_rule.create` (assign/create), `.read` (detail/list), `.update`, `.delete` | none |
| `contact_create` / `contact_delete` | `employee.create` / `employee.delete` | `employee.read`, `employee.edit`, `role.read` |
| `contact_update` | `employee.edit` | `employee.read`, `role.read` |
| `contact_detail`, `contact_list` | `employee.read` | none |
| `fastorder_create`, `offer_create` | `quote.request` | none |
| `offer_delete` | `quote.decline` | none |
| `offer_detail` / `offer_list` | `quote.read.all` | `offer_list`: `organization_unit.quote.read` |
| `offer_update` | `quote.request_change` | `quote.accept` |
| `order_create` | `organization_unit.order.read` | none |
| `order_delete` | `pending_order.approve_decline_all` | `pending_order.read_all`, `pending_order.approve_decline` |
| `order_detail`, `order_list`, `order_update` | `order.read.all` | none |
| `role_assign`, `role_create`, `route_assign` | `role.create` | `role.read`, `role.edit` |
| `role_delete` | `role.delete` | `role.read`, `role.edit` |
| `role_detail`, `role_update`, `route_detail` | `role.edit` | `role.read` |
| `role_list`, `route_list` | `role.read` | none |

To override the default mapping (add or change permissions), subscribe to `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\Event\B2BMigrationPermissionEvent`.

**Role mapping**

B2B Suite lets an employee hold several roles plus individual permissions; B2B Commercial assigns exactly one role per employee. The migration resolves this as follows:

1. Single role: migrated as is, with its permissions and dependencies.
2. Multiple roles: merged into one role containing all permissions (with dependencies); name = original role names joined by underscores, e.g. `role1_role2_role3`.
3. Multiple roles plus individual permissions: merged into one role containing all of them; name = role names plus the employee's email, joined by underscores, e.g. `role1_role2_foo@gmail.com`.

## Essential identifiers

- `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\Event\B2BMigrationPermissionEvent`
- B2B Commercial permission keys: `organization_unit.*`, `approval_rule.*`, `employee.*`, `quote.*`, `order.read.all`, `pending_order.*`, `role.*`

## Gotchas

- Mapping to the nearest equivalent can broaden or narrow access, e.g. `order_delete` becomes `pending_order.approve_decline_all` and `order_create` becomes `organization_unit.order.read`.
- Merged roles can be renamed in B2B Commercial after migration; their permissions stay unchanged.

## Code check (6.7.15.1)
- unverified `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\Event\B2BMigrationPermissionEvent` — Shopware Commercial plugin class, outside vendor/shopware/core, storefront and administration
- unverified `approval_rule.create` — B2B Commercial permission key, not defined in the three installed package roots
- unverified `organization_unit.read` — B2B Commercial permission key, out of scope of the checked roots
