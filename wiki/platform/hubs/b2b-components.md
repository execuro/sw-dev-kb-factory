---
id: platform/hubs/b2b-components.md
title: "B2B Components"
summary: "B2B Components (Employee Management, Order Approval, Organization Unit, Quotes, Shopping Lists, Individual Pricing) across dev 6.6/6.7 and merchant docs."
keywords: ["b2b components", "employee management", "order approval", "organization unit", "quotes management", "shopping lists", "individual pricing", "b2b suite migration", "customer-specific features", "commercialb2bbundle", "shopware commercial", "customer groups", "digital sales rooms", "b2b suite"]
members: ["platform/dev/6.6/products/extensions/_index.md", "platform/dev/6.6/products/extensions/b2b-components/_index.md", "platform/dev/6.6/products/extensions/b2b-components/employee-management/_index.md", "platform/dev/6.6/products/extensions/b2b-components/employee-management/concepts/_index.md", "platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/b2b-roles.md", "platform/dev/6.6/products/extensions/b2b-components/order-approval/_index.md", "platform/dev/6.6/products/extensions/b2b-components/organization-unit/_index.md", "platform/dev/6.6/resources/references/core-reference/actions-reference.md", "platform/dev/6.7/products/extensions/_index.md", "platform/dev/6.7/products/extensions/b2b-components/_index.md", "platform/dev/6.7/products/extensions/b2b-components/employee-management/_index.md", "platform/dev/6.7/products/extensions/b2b-components/employee-management/concepts/_index.md", "platform/dev/6.7/products/extensions/b2b-components/employee-management/concepts/entities-and-schema.md", "platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/b2b-employee-invitation.md", "platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/b2b-roles.md", "platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.md", "platform/dev/6.7/products/extensions/b2b-components/individual-pricing/_index.md", "platform/dev/6.7/products/extensions/b2b-components/order-approval/_index.md", "platform/dev/6.7/products/extensions/b2b-components/organization-unit/_index.md", "platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/how-to-identify-organization-from-context.md", "platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/store-api.md", "platform/dev/6.7/products/extensions/b2b-components/quotes-management/_index.md", "platform/dev/6.7/products/extensions/b2b-components/shopping-lists/_index.md", "platform/dev/6.7/products/extensions/b2b-components/shopping-lists/concepts/entities-and-schema.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/_index.md", "platform/dev/6.7/products/extensions/subscriptions/guides/b2b-employee-integration.md", "platform/dev/6.7/resources/references/core-reference/actions-reference.md", "platform/func/commercial-features/b2b-components.md", "platform/func/extensions/b2b-suite-administration.md", "platform/func/extensions/digital-sales-rooms.md", "platform/func/extensions/shopware-commercial.md", "platform/func/features/b2b-components.md", "platform/func/settings/customergroups.md"]
lastBuilt: "2026-09-15"
---

B2B Components is Shopware's commercial (Rise/Evolve/Beyond) plugin set that adds employee accounts, order approval, organization units, quotes, shopping lists and individual pricing on top of a regular customer account, toggled per business partner via customer-specific features. Come here instead of grepping directly when you need to locate which sub-component (Employee Management, Order Approval, Organization Unit, Quotes, Shopping Lists, Individual Pricing, or the legacy B2B Suite migration) covers a given permission, entity or Store API route, or when a request could be either developer- or merchant-facing.

## Developer — dev/6.6

- [Extensions](platform/dev/6.6/products/extensions/_index.md) — overview index of Migration Assistant, B2B Suite, B2B Components, Advanced Search, Subscriptions.
- [B2B Components](platform/dev/6.6/products/extensions/b2b-components/_index.md) — introduces the components and per-partner toggling via Customer-specific features.
- [Employee Management](platform/dev/6.6/products/extensions/b2b-components/employee-management/_index.md) — company-customer-scoped employee, role and permission management.
- [Concepts](platform/dev/6.6/products/extensions/b2b-components/employee-management/concepts/_index.md) — employees are uniquely identified by email, checked on invitation.
- [B2B Roles](platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/b2b-roles.md) — roles bind permissions to employees; a default role can be set for new employees.
- [Order Approval](platform/dev/6.6/products/extensions/b2b-components/order-approval/_index.md) — rules for which orders need approval and which employees can approve or decline.
- [Organization unit](platform/dev/6.6/products/extensions/b2b-components/organization-unit/_index.md) — units group employees with their own payment/shipping methods and access rights.
- [Actions Reference](platform/dev/6.6/resources/references/core-reference/actions-reference.md) — B2B flow actions: `ChangeEmployeeStatusAction`, `ChangeCustomerSpecificFeaturesAction`.

## Developer — dev/6.7

The 6.7 tree covers the same components as 6.6 plus newer additions (Individual Pricing, Quotes Management, Shopping Lists, B2B Suite Migration, Subscriptions integration). The 6.6 and 6.7 `Extensions`, `B2B Components`, `Employee Management`, `Concepts`, `B2B Roles`, `Order Approval`, `Organization unit` and `Actions Reference` pages are near-duplicate content updated per version — prefer the 6.7 copy unless you're specifically on a 6.6 install.

- [Extensions](platform/dev/6.7/products/extensions/_index.md) — overview of Migration Assistant, B2B Suite, B2B Components, Advanced Search, Subscriptions.
- [B2B Components](platform/dev/6.7/products/extensions/b2b-components/_index.md) — `CommercialB2BBundle`, `CustomerSpecificFeatureService::isAllowed()`, Twig `customerHasFeature()`.
- [Employee Management](platform/dev/6.7/products/extensions/b2b-components/employee-management/_index.md) — employees tied to a company customer, roles define permissions, extendable via app/plugin.
- [Concepts](platform/dev/6.7/products/extensions/b2b-components/employee-management/concepts/_index.md) — employees uniquely identified by email, duplicate check on invitation.
- [Entities & Schema](platform/dev/6.7/products/extensions/b2b-components/employee-management/concepts/entities-and-schema.md) — `swag_b2b_business_partner`, `swag_b2b_employee`, `swag_b2b_role` tables and relations to `customer`.
- [Employee Invitation](platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/b2b-employee-invitation.md) — invite flow, `/store-api/employee/create`, default acceptance URL, `b2b.employee.invitationURL` override.
- [B2B Roles](platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/b2b-roles.md) — roles bundle permissions; a business partner can set a preselected default role.
- [Create permissions via App](platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.md) — register custom role permissions via `/store-api/permission`, labels via `b2b.role-edit.permissions.[name]` snippets.
- [Individual Pricing](platform/dev/6.7/products/extensions/b2b-components/individual-pricing/_index.md) — since 6.7.8.0: company/tag-targeted pricing rules with tiers, product filters, priorities and strike-through.
- [Order Approval](platform/dev/6.7/products/extensions/b2b-components/order-approval/_index.md) — approval rules; requires Employee Management installed and active.
- [Organization unit](platform/dev/6.7/products/extensions/b2b-components/organization-unit/_index.md) — units with own employees, payment and shipping methods; requires Employee Management.
- [How to identify the organization unit from the context](platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/how-to-identify-organization-from-context.md) — read the employee extension from `SalesChannelContext` customer, then its `organizationId`.
- [Store API](platform/dev/6.7/products/extensions/b2b-components/organization-unit/guides/store-api.md) — `/store-api/organization-unit(s)` endpoints for create/update/get/list/delete.
- [Quotes Management](platform/dev/6.7/products/extensions/b2b-components/quotes-management/_index.md) — quote requested from cart, merchant discounts in admin, accepted quote proceeds through checkout.
- [Shopping lists](platform/dev/6.7/products/extensions/b2b-components/shopping-lists/_index.md) — customers create/edit/organize product lists with quantities for repeated purchasing.
- [Entities & Schema](platform/dev/6.7/products/extensions/b2b-components/shopping-lists/concepts/entities-and-schema.md) — `b2b_components_shopping_list` and its `b2b_components_shopping_list_line_item` child table.
- [B2B Suite Migration](platform/dev/6.7/products/extensions/b2b-suite-migration/_index.md) — moves data from the legacy B2B Suite to B2B Components; B2B Suite is unsupported from Shopware 6.8.
- [B2B Employee Integration](platform/dev/6.7/products/extensions/subscriptions/guides/b2b-employee-integration.md) — Subscriptions + Employee Management: permission-based visibility, employee/organization data on initial and renewal orders.
- [Actions Reference](platform/dev/6.7/resources/references/core-reference/actions-reference.md) — `ChangeEmployeeStatusAction`, `ChangeCustomerSpecificFeaturesAction`.

## Merchant

- [B2b Components](platform/func/commercial-features/b2b-components.md) — Shopware Evolve/Commercial feature summary: roles, employee/order approval, quote management, organisation units, budgets.
- [B2b Suite Administration](platform/func/extensions/b2b-suite-administration.md) — admin setup for the deprecated B2B Suite: install and assign Debtor/Sales representative roles.
- [Digital Sales Rooms](platform/func/extensions/digital-sales-rooms.md) — Beyond-plan live shopping-event presentations with real-time discounts, wishlists and quote requests.
- [Shopware Commercial](platform/func/extensions/shopware-commercial.md) — unlocks Rise/Evolve/Beyond plan features; pre-installed in cloud, manual install self-hosted.
- [B2b Components](platform/func/features/b2b-components.md) — merchant-facing feature list: employee roles, order approvals, quote management, quick ordering, shopping lists.
- [Customergroups](platform/func/settings/customergroups.md) — customer groups, net/gross pricing, custom registration forms, B2B Components registration options.

Note the two merchant pages both titled "B2b Components" (`platform/func/commercial-features/b2b-components.md` and `platform/func/features/b2b-components.md`) are distinct pages with overlapping but not identical content, not duplicates of each other.
