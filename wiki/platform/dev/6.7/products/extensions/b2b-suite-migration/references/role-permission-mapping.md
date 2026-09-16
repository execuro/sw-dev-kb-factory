---
id: platform/dev/6.7/products/extensions/b2b-suite-migration/references/role-permission-mapping.md
title: Role and Permission Mapping
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite-migration/references/role-permission-mapping.html
sourceHash: 3933849655b099305821f1458c5b4801c91904aa
codeCheckedAgainst: "6.7.13.0"
keywords: ["B2BMigrationPermissionEvent", "organization_unit.read", "approval_rule.create", "employee.read", "role.edit", "quote.read.all", "order.read.all", "permission mapping", "role mapping", "b2b suite migration", "b2b commercial", "acl", "employee roles"]
summary: B2B Suite to B2B Commercial permission and role mapping during migration, role merging rules, and override via B2BMigrationPermissionEvent.
lastBuilt: 2026-09-15
---
## What it is

Reference of how B2B Suite roles/permissions are transformed into B2B Commercial permissions and roles during the migration, including dependency permissions added to keep features working.

## When to use

When verifying employee access after migration, customizing permission mapping, or explaining why migrated roles have combined names.

## Key steps / config

**Permission mapping (condensed)** — Suite permission → Commercial permission (dependencies):

- Address: `address_assign`, `address_create` → `organization_unit.shipping_address.create` (billing_address.create, create, update); `address_delete` → `organization_unit.shipping_address.delete` (billing_address.delete); `address_detail`, `address_update` → `organization_unit.shipping_address.update`; `address_list` → `organization_unit.read`
- Budget, Contingent, Contingent Rule (`budget_*`, `contingent_*`, `contingentrule_*`): assign/create → `approval_rule.create`; delete → `approval_rule.delete`; detail/list → `approval_rule.read`; update → `approval_rule.update` (no dependencies)
- Company: `company_list` → `organization_unit.read`
- Contact: create → `employee.create`; delete → `employee.delete`; detail/list → `employee.read`; update → `employee.edit` (dependencies `employee.read`, `employee.edit`, `role.read` as applicable)
- Order: `fastorder_create`, `offer_create` → `quote.request`; `offer_delete` → `quote.decline`; `offer_detail`, `offer_list` → `quote.read.all`; `offer_update` → `quote.request_change` (`quote.accept`); `order_create` → `organization_unit.order.read`; `order_delete` → `pending_order.approve_decline_all`; `order_detail`/`order_list`/`order_update` → `order.read.all`
- Role, Route: assign/create → `role.create`; `role_delete` → `role.delete`; detail/update → `role.edit`; list → `role.read` (dependencies `role.read`, `role.edit`)

**Override the mapping**: subscribe to `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\Event\B2BMigrationPermissionEvent` to add or change permission mappings.

**Role mapping** — B2B Suite allows multiple roles plus individual permissions per employee; B2B Commercial allows one role per employee:
1. Single role → migrated as is, with mapped permissions and dependencies.
2. Multiple roles → merged into one role with all permissions; name = role names joined by underscores, e.g. `role1_role2_role3`.
3. Multiple roles + specific permissions → merged into one role; name = role names plus the employee's email joined by underscores, e.g. `role1_role2_foo@gmail.com`.

## Essential identifiers

- `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\Event\B2BMigrationPermissionEvent`
- Commercial permission prefixes: `organization_unit.`, `approval_rule.`, `employee.`, `role.`, `quote.`, `order.read.all`, `pending_order.`

## Gotchas

- Some B2B Suite permissions have no B2B Commercial counterpart (feature missing); they map to the nearest equivalent permission.
- Roles can be renamed in B2B Commercial after migration; permissions stay unchanged.

## Code check (6.7.13.0)
- unverified `Shopware\Commercial\B2B\B2BSuiteMigration\Core\Domain\Event\B2BMigrationPermissionEvent` — Shopware Commercial plugin class, not in vendor/shopware core/storefront/administration
- unverified `organization_unit.shipping_address.create` — Commercial B2B permission key, out of scope of installed core code
- unverified `approval_rule.create` — Commercial B2B permission key, out of scope of installed core code
- unverified `employee.read` — Commercial B2B permission key, out of scope of installed core code
- unverified `quote.read.all` — Commercial B2B permission key, out of scope of installed core code
