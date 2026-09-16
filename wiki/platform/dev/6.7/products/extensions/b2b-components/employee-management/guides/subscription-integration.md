---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/subscription-integration.md
title: Subscription Integration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/guides/subscription-integration.html
sourceHash: ee494c94a92fadc7028f093c5e217995cc4fa41f
codeCheckedAgainst: "6.7.13.0"
keywords: ["SubscriptionRouteDecorator", "SubscriptionEmployeeFilter", "SubscriptionTransformedSubscriber", "SubscriptionOrderPlacedSubscriber", "b2b_components_subscription_employee", "subscriptionEmployee", "subscription.read.all", "organization_unit.subscription.read", "orderEmployee", "CheckoutOrderPlacedEvent", "b2b employee subscriptions", "subscription permissions"]
summary: "How B2B Employee Management links subscriptions to employees: subscriptionEmployee association, permission-based filtering, employee/org data on orders."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/subscriptions/concept.md", "platform/dev/6.7/products/extensions/b2b-components/employee-management/concepts/_index.md", "platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-plugin.md", "platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/api-route-restriction-for-employees.md"]
---
## What it is

The B2B Employee Management integration with the Subscriptions extension: it records which employee created a subscription, filters subscription lists by permission, and keeps employee and organization context on initial and renewal orders, via decorators, subscribers and an entity extension. Requires Shopware 6.7 with Subscriptions and B2B Components Employee Management; see [Subscription concept](platform/dev/6.7/products/extensions/subscriptions/concept.md).

## When to use

Reading the employee behind a subscription or order, explaining which subscriptions an employee sees, or adding custom B2B logic to subscriptions.

## Key steps / config

**Permissions** (applied by `SubscriptionEmployeeFilter` when lists load):

| Permission | Visible subscriptions |
|---|---|
| `subscription.read.all` | all (no filter) |
| `organization_unit.subscription.read` | own OR from assigned organization unit |
| none | own only (filter by `employeeId`) |

**Components:**
- `SubscriptionRouteDecorator` wraps `SubscriptionRoute`: calls `load()`, then `applyEmployeeFilter($criteria, $employee)`. `SalesChannelContextServiceDecorator` adds employee context to subscription sales channel contexts.
- Subscribers (priority 0): `SubscriptionTransformedSubscriber` on `SubscriptionTransformedEvent` (sets `subscriptionEmployee`, and `orderEmployee`/organization on `convertedOrder`); `SubscriptionCartConvertedSubscriber` on `SUBSCRIPTION_CART_CONVERTED` (initial order); `SubscriptionOrderPlacedSubscriber` on `CheckoutOrderPlacedCriteriaEvent` and `CheckoutOrderPlacedEvent` (renewal orders).
- `SubscriptionExtension` adds to `SubscriptionDefinition`: `new OneToOneAssociationField('subscriptionEmployee', 'id', 'subscription_id', SubscriptionEmployeeDefinition::class, false)`.

**Table `b2b_components_subscription_employee`:** `id`, `subscription_id` (FK `subscription`, UNIQUE), `employee_id` (FK `b2b_employee`), `created_at`, `updated_at`.

```php
$criteria->addAssociation('subscriptionEmployee.employee');
$employee = $subscription->getSubscriptionEmployee()?->getEmployee();
$orderEmployee = $order->getExtension('orderEmployee'); // ->getEmployeeId()
$organization  = $order->getExtension('organization');  // ->getId()
```

For custom logic: decorate subscription services like `SubscriptionRouteDecorator`, subscribe to subscription events, use entity extensions, and check context state instead of relying on event priorities.

## Essential identifiers

- `SubscriptionRouteDecorator`, `SalesChannelContextServiceDecorator`, `SubscriptionEmployeeFilter`
- `SubscriptionTransformedSubscriber`, `SubscriptionCartConvertedSubscriber`, `SubscriptionOrderPlacedSubscriber`
- `SubscriptionExtension`, `SubscriptionEmployeeDefinition`, `b2b_components_subscription_employee`
- `SubscriptionTransformedEvent`, `SUBSCRIPTION_CART_CONVERTED`, `CheckoutOrderPlacedCriteriaEvent`, `CheckoutOrderPlacedEvent`

## Gotchas

- The association is declared with autoload `false` (core default `true`), so add `subscriptionEmployee.employee` to the Criteria explicitly.
- Order employee/organization data lives in extensions and is null on orders without employee context.

## Code check (6.7.13.0)
- confirmed `CheckoutOrderPlacedEvent` — core checkout event — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:27
- confirmed `CheckoutOrderPlacedCriteriaEvent` — core event exposing the order Criteria — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedCriteriaEvent.php:13
- confirmed `OneToOneAssociationField` — constructor (propertyName, storageName, referenceField, referenceClass, autoload = true) matches snippet — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToOneAssociationField.php:10
- confirmed `Criteria::addAssociation()` — accepts dotted path — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:321
- confirmed `ExtendableTrait::getExtension()` — returns nullable Struct — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:51
- confirmed `b2b_employee` — entity name referenced in core usage-data allow list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2084
- unverified `SubscriptionTransformedEvent` — Subscriptions extension (commercial), not installed in vendor roots
- unverified `SUBSCRIPTION_CART_CONVERTED` — Subscriptions extension, not installed
- unverified `SubscriptionRouteDecorator` — B2B Components, not installed
- unverified `b2b_components_subscription_employee` — B2B Components table, not installed
