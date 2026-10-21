---
id: platform/hubs/b2b-components.md
title: "B2B Components"
summary: "B2B Components, B2B Suite and migration: employees, approvals, organization units, quotes, shopping lists, feature toggles."
keywords: ["b2b components", "b2b suite", "employee management", "order approval", "organization unit", "quotes management", "shopping lists", "customer-specific features", "b2b suite migration", "CustomerSpecificFeatureService", "commercial", "flow actions"]
members: [platform/dev/6.6/products/extensions/_index.md, platform/dev/6.6/products/extensions/b2b-components/_index.md, platform/dev/6.6/products/extensions/b2b-components/employee-management/_index.md, platform/dev/6.6/products/extensions/b2b-components/employee-management/concepts/_index.md, platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/b2b-roles.md, platform/dev/6.6/products/extensions/b2b-components/order-approval/_index.md, platform/dev/6.6/products/extensions/b2b-components/organization-unit/_index.md, platform/dev/6.6/resources/references/core-reference/actions-reference.md, platform/dev/6.7/products/extensions/_index.md, platform/dev/6.7/products/extensions/b2b-components/_index.md, platform/dev/6.7/products/extensions/b2b-components/employee-management/_index.md, platform/dev/6.7/products/extensions/b2b-components/employee-management/concepts/_index.md, platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/_index.md, platform/dev/6.7/products/extensions/b2b-components/order-approval/_index.md, platform/dev/6.7/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.md, platform/dev/6.7/products/extensions/b2b-components/organization-unit/_index.md, platform/dev/6.7/products/extensions/b2b-components/organization-unit/concepts/entities-and-schema.md, platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/how-to-identify-organization-from-context.md, platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/store-api.md, platform/dev/6.7/products/extensions/b2b-components/quotes-management/_index.md, platform/dev/6.7/products/extensions/b2b-components/shopping-lists/_index.md, platform/dev/6.7/products/extensions/b2b-components/shopping-lists/concepts/entities-and-schema.md, platform/dev/6.7/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md, platform/dev/6.7/products/extensions/b2b-suite-migration/_index.md, platform/dev/6.7/products/extensions/b2b-suite-migration/concept/_index.md, platform/dev/6.7/products/extensions/b2b-suite-migration/concept/migration-table.md, platform/dev/6.7/products/extensions/b2b-suite/concept/_index.md, platform/dev/6.7/products/extensions/b2b-suite/guides/_index.md, platform/dev/6.7/products/extensions/subscriptions/guides/b2b-employee-integration.md, platform/dev/6.7/resources/references/core-reference/actions-reference.md, platform/func/commercial-features/b2b-components.md, platform/func/extensions/b2b-suite-administration.md, platform/func/extensions/digital-sales-rooms.md, platform/func/extensions/shopware-commercial.md, platform/func/features/b2b-components.md, platform/func/settings/customergroups.md]
lastBuilt: 2026-10-21
---

# B2B Components

This hub covers Shopware's B2B functionality: the B2B Components (employee management, order approval, organization units, quote management, shopping lists, quick orders), the older B2B Suite they replace, the B2B Suite Migration extension, and the per-customer feature toggles (`CustomerSpecificFeatureService`, Twig `customerHasFeature`). Come here to pick the right page for a B2B question before searching the wiki directly. The B2B Suite is described as deprecated and unsupported from Shopware 6.8; B2B Components are part of Shopware Commercial and gated by plan.

## Developer: 6.6

- [Extensions](platform/dev/6.6/products/extensions/_index.md) — index of Shopware extensions including B2B Suite and B2B Components.
- [B2B Components](platform/dev/6.6/products/extensions/b2b-components/_index.md) — overview and per-customer feature toggling via Customer-specific features.
- [Employee Management](platform/dev/6.6/products/extensions/b2b-components/employee-management/_index.md) — company-customer-scoped employees, roles and permissions.
- [Concepts](platform/dev/6.6/products/extensions/b2b-components/employee-management/concepts/_index.md) — employees are identified by unique email address.
- [B2B Roles](platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/b2b-roles.md) — roles bind permissions; default role for new employees.
- [Order Approval](platform/dev/6.6/products/extensions/b2b-components/order-approval/_index.md) — rules deciding which orders need approval.
- [Organization unit](platform/dev/6.6/products/extensions/b2b-components/organization-unit/_index.md) — units grouping employees with own payment/shipping methods.
- [Actions Reference](platform/dev/6.6/resources/references/core-reference/actions-reference.md) — B2B flow actions `ChangeEmployeeStatusAction` and `ChangeCustomerSpecificFeaturesAction`.

## Developer: 6.7

Overview and feature toggles:
- [Extensions](platform/dev/6.7/products/extensions/_index.md) — index of Shopware extensions (6.7 counterpart of the 6.6 index).
- [B2B Components](platform/dev/6.7/products/extensions/b2b-components/_index.md) — overview, `CommercialB2BBundle`, `CustomerSpecificFeatureService`, `customerHasFeature()`.
- [Actions Reference](platform/dev/6.7/resources/references/core-reference/actions-reference.md) — B2B flow actions (6.7 counterpart of the 6.6 reference).

Employee management and order approval:
- [Employee Management](platform/dev/6.7/products/extensions/b2b-components/employee-management/_index.md) — employees acting for a company customer, roles and permissions.
- [Concepts](platform/dev/6.7/products/extensions/b2b-components/employee-management/concepts/_index.md) — email uniqueness and invitations.
- [Guides](platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/_index.md) — permission model: groups, dependencies, base permissions.
- [Order Approval](platform/dev/6.7/products/extensions/b2b-components/order-approval/_index.md) — approval rules; requires Employee Management.
- [How to add a new approval condition](platform/dev/6.7/products/extensions/b2b-components/order-approval/guides/04-add-new-approval-condition.md) — plugin Rule tagged `shopware.approval_rule.definition` or app rule-condition.

Organization unit:
- [Organization unit](platform/dev/6.7/products/extensions/b2b-components/organization-unit/_index.md) — unit overview; requires Employee Management.
- [Entities & Schema](platform/dev/6.7/products/extensions/b2b-components/organization-unit/concepts/entities-and-schema.md) — `b2b_components_organization` tables.
- [How to identify the organization unit from the context](platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/how-to-identify-organization-from-context.md) — read `organizationId` from `SalesChannelContext`.
- [Store API](platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/store-api.md) — `/store-api/organization-unit` routes.

Quotes and shopping lists:
- [Quotes Management](platform/dev/6.7/products/extensions/b2b-components/quotes-management/_index.md) — quote requests from cart to order.
- [Shopping lists](platform/dev/6.7/products/extensions/b2b-components/shopping-lists/_index.md) — shopping list overview.
- [Entities & Schema](platform/dev/6.7/products/extensions/b2b-components/shopping-lists/concepts/entities-and-schema.md) — `b2b_components_shopping_list` tables.
- [API & Pricing](platform/dev/6.7/products/extensions/b2b-components/shopping-lists/guides/api-and-pricing.md) — Store API routes and on-load price calculation.

B2B Suite (legacy), migration and integrations:
- [Concepts](platform/dev/6.7/products/extensions/b2b-suite/concept/_index.md) — B2B Suite architecture and conventions.
- [Guides](platform/dev/6.7/products/extensions/b2b-suite/guides/_index.md) — B2B Suite installation and component guides.
- [B2B Suite Migration](platform/dev/6.7/products/extensions/b2b-suite-migration/_index.md) — moves data from B2B Suite to B2B Components.
- [Concept](platform/dev/6.7/products/extensions/b2b-suite-migration/concept/_index.md) — message-queue, XML-defined mappings, sequential order.
- [Migration Table](platform/dev/6.7/products/extensions/b2b-suite-migration/concept/migration-table.md) — state, map and errors tables.
- [B2B Employee Integration](platform/dev/6.7/products/extensions/subscriptions/guides/b2b-employee-integration.md) — Subscriptions with employee permissions.

## Merchant

- [B2b Components](platform/func/commercial-features/b2b-components.md) — Commercial feature overview of all components.
- [B2b Components](platform/func/features/b2b-components.md) — near-duplicate feature page: employee roles, approvals, quotes, quick order, lists.
- [B2b Suite Administration](platform/func/extensions/b2b-suite-administration.md) — admin setup of the deprecated B2B Suite.
- [Digital Sales Rooms](platform/func/extensions/digital-sales-rooms.md) — Beyond-plan live shopping extension with quote requests.
- [Shopware Commercial](platform/func/extensions/shopware-commercial.md) — plan-gated Commercial extension and installation.
- [Customergroups](platform/func/settings/customergroups.md) — customer groups and B2B Components registration options.
