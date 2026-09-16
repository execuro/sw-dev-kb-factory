---
id: platform/dev/6.7/products/extensions/subscriptions/guides/b2b-employee-integration.md
title: B2B Employee Integration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/subscriptions/guides/b2b-employee-integration.html
sourceHash: 69aa0a5753d2b49b98f5c389f8a2f57354652cb6
codeCheckedAgainst: "6.7.13.0"
keywords: ["subscription.read.all", "organization_unit.subscription.read", "b2b employee", "employee management", "b2b components", "subscriptions", "subscription permissions", "organization unit", "employee tracking", "renewal orders", "b2b subscriptions"]
summary: "Subscriptions with B2B Employee Management: permission-based subscription visibility, employee/organization data in initial and renewal orders."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/subscription-integration.md", "platform/dev/6.7/products/extensions/subscriptions/concept.md", "platform/dev/6.7/products/extensions/subscriptions/guides/mixed-checkout.md", "platform/dev/6.7/products/extensions/b2b-components/employee-management/_index.md"]
---
## What it is

Overview of how the Subscriptions extension works together with B2B Components Employee Management: subscriptions can be viewed and tracked in a B2B employee context. The integration provides permission-based subscription access, tracking of which employee created a subscription, and organization context in both initial and renewal subscription orders.

## When to use

- A B2B store with employee management enabled.
- Employees manage subscriptions on behalf of their organization.
- Access to subscription data must be controlled by permissions.
- You need to know which employee initiated a subscription (audit, reporting).

## Key steps / config

Prerequisites:

1. Shopware 6.7 with the **Subscriptions** extension installed.
2. **B2B Components** with the Employee Management module enabled.
3. Employees configured with roles and permissions.

Permission levels for viewing subscriptions:

| Permission | Employee sees |
|---|---|
| `subscription.read.all` | all subscriptions in the system |
| `organization_unit.subscription.read` | subscriptions of their organization unit plus their own |
| no subscription permission | only subscriptions they created |

Behaviour when an employee creates a subscription:

- The initial order includes employee and organization data.
- All renewal orders keep this context automatically.
- Employee context is added automatically when an employee is logged in; no changes to subscription products or plans are needed.
- Works with both the [separate checkout](platform/dev/6.7/products/extensions/subscriptions/guides/separate-checkout.md) and [mixed checkout](platform/dev/6.7/products/extensions/subscriptions/guides/mixed-checkout.md).

For architecture (decorators, event subscribers, entity extensions), database schema, flow diagrams and code examples see the [B2B Employee Subscription Integration Guide](platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/subscription-integration.md) and the [B2B Employee Management](platform/dev/6.7/products/extensions/b2b-components/employee-management/_index.md) basics.

## Essential identifiers

- `subscription.read.all`
- `organization_unit.subscription.read`

## Code check (6.7.13.0)
- unverified `subscription.read.all` — B2B Components / Subscriptions code is not installed in the checked vendor roots
- unverified `organization_unit.subscription.read` — B2B Components / Subscriptions code is not installed in the checked vendor roots
