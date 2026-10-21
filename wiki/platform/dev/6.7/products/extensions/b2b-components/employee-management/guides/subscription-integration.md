---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/subscription-integration.md
relatedPages:
  - platform/dev/6.7/products/extensions/subscriptions/concept.md
  - platform/dev/6.7/products/extensions/b2b-components/employee-management/concepts/_index.md
  - platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-plugin.md
  - platform/dev/6.7/products/extensions/subscriptions/guides/mixed-checkout.md
sourceHash: ee494c94a92fadc7028f093c5e217995cc4fa41f
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/guides/subscription-integration.html
title: Subscription Integration
version: "6.7"
versions:
  - "6.7"
keywords: ["subscription.read.all", "organization_unit.subscription.read", "b2b_components_subscription_employee", "SubscriptionRouteDecorator", "SubscriptionEmployeeFilter", "SubscriptionTransformedEvent", "SUBSCRIPTION_CART_CONVERTED", "CheckoutOrderPlacedEvent", "subscriptionEmployee", "orderEmployee", "b2b employee subscriptions", "subscription permissions"]
summary: How B2B Employee Management ties employees to subscriptions - permission filtering, subscriptionEmployee association, employee/org context on orders.
lastBuilt: 2026-10-21
---
## What it is

Describes how the B2B Employee Management module integrates with the Subscriptions extension: employee-based permission filtering of subscription lists, tracking which employee created a subscription, and keeping organization context on initial and renewal orders. All B2B logic lives in the Employee Management module (decorators, entity extensions, event subscribers); the Subscription module itself is not modified. Requires Shopware 6.7 with the Subscriptions extension and B2B Components with Employee Management. Background: [Subscription concept](platform/dev/6.7/products/extensions/subscriptions/concept.md), [Employee Management concepts](platform/dev/6.7/products/extensions/b2b-components/employee-management/concepts/_index.md).

## When to use

Reading or extending subscription data for B2B employees: restricting which subscriptions an employee sees, reading the creating employee or organization from a subscription or order, or adding custom B2B logic to subscription flows.

## Key steps / config

Permissions checked when an employee loads subscription lists:

| Permission | Access |
|---|---|
| `subscription.read.all` | all subscriptions (no filter) |
| `organization_unit.subscription.read` | own + assigned organization unit (OR filter) |
| none | only own (filter by `employeeId`) |

Components in Employee Management:
- Decorators: `SubscriptionRouteDecorator` (wraps `SubscriptionRoute`, calls `$this->subscriptionEmployeeFilter->applyEmployeeFilter($criteria, $employee)`), `SalesChannelContextServiceDecorator`.
- Subscribers (all priority 0): `SubscriptionTransformedSubscriber` on `SubscriptionTransformedEvent`; `SubscriptionCartConvertedSubscriber` on `SUBSCRIPTION_CART_CONVERTED`; `SubscriptionOrderPlacedSubscriber` on `CheckoutOrderPlacedCriteriaEvent` and `CheckoutOrderPlacedEvent` (renewal orders).
- Entity extension `SubscriptionExtension` adds to `SubscriptionDefinition`:

```php
new OneToOneAssociationField('subscriptionEmployee', 'id', 'subscription_id', SubscriptionEmployeeDefinition::class, false);
```

Table `b2b_components_subscription_employee`: `id`, `subscription_id` (UNIQUE FK to `subscription`), `employee_id` (FK to `b2b_employee`), `created_at`, `updated_at` — one employee per subscription.

Reading the data:

```php
$criteria = new Criteria();
$criteria->addAssociation('subscriptionEmployee.employee');
$employee = $subscription->getSubscriptionEmployee()?->getEmployee();

$orderEmployee = $order->getExtension('orderEmployee');   // ->getEmployeeId()
$organization  = $order->getExtension('organization');    // ->getId()
```

Adding custom logic: decorate subscription services following the `SubscriptionRouteDecorator` pattern (extend the abstract service, inject `$decorated`, implement `getDecorated()`), subscribe to the subscription events above, and use entity extensions for new associations.

## Essential identifiers

- `subscription.read.all`, `organization_unit.subscription.read`
- `SubscriptionRouteDecorator`, `SalesChannelContextServiceDecorator`, `SubscriptionEmployeeFilter::applyEmployeeFilter()`
- `SubscriptionTransformedSubscriber`, `SubscriptionCartConvertedSubscriber`, `SubscriptionOrderPlacedSubscriber`
- `SubscriptionTransformedEvent`, `SUBSCRIPTION_CART_CONVERTED`, `CheckoutOrderPlacedCriteriaEvent`, `CheckoutOrderPlacedEvent`
- `SubscriptionExtension`, `SubscriptionEmployeeDefinition`, association `subscriptionEmployee`
- Table `b2b_components_subscription_employee`; order extensions `orderEmployee`, `organization`
- Subscription field `convertedOrder` (stores employee/org data reused by renewal orders)

## Gotchas

- The source recommends checking context state rather than relying on event priorities for a more robust integration.
- The source's decorator example declares `getDecorated(): AbstractService` while extending `AbstractSubscriptionService`; neither class is in core, so match the return type to the actual abstract class of the Subscriptions extension.

## Code check (6.7.15.1)
- unverified `SubscriptionRouteDecorator` — B2B Employee Management (commercial extension), not in installed core code
- unverified `SubscriptionTransformedEvent` — Subscriptions extension, not in installed core code
- unverified `SUBSCRIPTION_CART_CONVERTED` — Subscriptions extension constant, not in installed core code
- unverified `SubscriptionDefinition` — Subscriptions extension entity, not in installed core code
- confirmed `convertedOrder` — field listed for the `subscription` entity in the usage-data allow list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:1817
- confirmed `b2b_employee` — entity name listed in the usage-data allow list — vendor/shopware/core/System/UsageData/usage-data-allow-list.json:2084
- confirmed `CheckoutOrderPlacedEvent` — core checkout event — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:32
- confirmed `CheckoutOrderPlacedCriteriaEvent` — core event carrying Criteria + SalesChannelContext — vendor/shopware/core/Checkout/Cart/Event/CheckoutOrderPlacedCriteriaEvent.php:16
- confirmed `OneToOneAssociationField` — constructor takes propertyName, storageName, referenceField, referenceClass, autoload — vendor/shopware/core/Framework/DataAbstractionLayer/Field/OneToOneAssociationField.php:13
- confirmed `Criteria::addAssociation()` — accepts a dotted association path — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:333
