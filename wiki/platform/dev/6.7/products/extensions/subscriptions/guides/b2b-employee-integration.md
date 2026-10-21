---
id: platform/dev/6.7/products/extensions/subscriptions/guides/b2b-employee-integration.md
title: B2B Employee Integration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/subscriptions/guides/b2b-employee-integration.html
sourceHash: 69aa0a5753d2b49b98f5c389f8a2f57354652cb6
codeCheckedAgainst: "6.7.15.1"
keywords: ["subscription.read.all", "organization_unit.subscription.read", "b2b components", "employee management", "employee permissions", "organization unit", "subscription renewal orders", "b2b subscriptions", "employee tracking", "subscriptions extension", "acl"]
summary: "Subscriptions with B2B Employee Management: permission-based subscription visibility, employee/organization data in initial and renewal orders."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/subscription-integration.md", "platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md", "platform/dev/6.7/products/extensions/subscriptions/guides/mixed-checkout.md", "platform/dev/6.7/products/extensions/subscriptions/concept.md"]
---
## What it is

An overview of how the Subscriptions extension works together with B2B Components Employee Management. With both active, subscriptions can be managed and tracked in a B2B employee context: access to subscriptions is permission-based, the employee who created each subscription is recorded for audit and reporting, and organization information is kept in both the initial order and all renewal orders. Technical details live in the B2B-side guide (see below).

## When to use

Relevant when:

- you run a B2B store with employee management enabled;
- employees should manage subscriptions on behalf of their organization;
- you need permission-based access control on subscription data;
- you need to track which employee initiated a subscription.

## Key steps / config

**Prerequisites**

- Shopware 6.7 with the **Subscriptions** extension installed.
- **B2B Components** with the Employee Management module enabled.
- Employees configured with appropriate roles and permissions.

**Permission levels** — what an employee can see:

| Permission | Visible subscriptions |
|---|---|
| `subscription.read.all` | all subscriptions in the system |
| `organization_unit.subscription.read` | subscriptions of their organization unit plus their own |
| no subscription permission | only subscriptions they personally created |

**Employee context in orders** — when an employee creates a subscription, the initial order includes employee and organization data; all renewal orders automatically keep this context, so employee information is preserved for reporting and compliance.

**Integration behaviour** — works with both the [separate checkout](platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md) and the [mixed checkout](platform/dev/6.7/products/extensions/subscriptions/guides/mixed-checkout.md) flows; existing subscription products and plans need no changes; employee context is added automatically when an employee is logged in.

**Technical details** — the [B2B Employee Subscription Integration Guide](platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/subscription-integration.md) covers architecture and integration patterns (decorators, event subscribers, entity extensions), the database schema for employee–subscription relationships, flow diagrams for initial orders, renewals and permission filtering, code examples for reading employee data from subscriptions and orders, and extension points for custom B2B logic. Role basics: [B2B Employee Management](platform/dev/6.7/products/extensions/b2b-components/employee-management/_index.md). Fundamentals: [Subscription concept](platform/dev/6.7/products/extensions/subscriptions/concept.md).

## Essential identifiers

- `subscription.read.all`
- `organization_unit.subscription.read`

## Code check (6.7.15.1)
- unverified `subscription.read.all` — B2B/Subscriptions permission defined in commercial code, not in core/storefront/administration
- unverified `organization_unit.subscription.read` — B2B Components permission, commercial code out of scope
- confirmed `order.subscriptionId` — core usage-data allow list knows the order-to-subscription reference used by renewal orders — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1494
- confirmed `subscription_customer.customerId` — subscriptions keep their own customer record — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1855
