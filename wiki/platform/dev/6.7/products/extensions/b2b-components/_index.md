---
id: platform/dev/6.7/products/extensions/b2b-components/_index.md
title: B2B Components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/
sourceHash: 57670af639fb5f6aaf271cb7eac619526ee5dcc9
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b components", "b2b", "feature toggle", "customer-specific features", "CommercialB2BBundle", "describeFeatures", "TYPE_B2B", "CustomerSpecificFeatureService", "isAllowed", "customerHasFeature", "CustomerSpecificFeatureException", "QUICK_ORDER", "commercial plugin"]
summary: "B2B Components overview; per-customer feature toggles via CommercialB2BBundle, CustomerSpecificFeatureService and Twig customerHasFeature()"
lastBuilt: 2026-10-21
---
## What it is

Overview of the B2B Components of the Shopware Commercial plugin and how to gate a B2B component behind a per-customer feature toggle ("Customer-specific features" on the Administration customer detail page). Components listed: Employee Management, Quote Management, Order Approval, Individual Pricing, Quick Order and Shopping List, Organization Unit, Digital Sales Composables.

## When to use

When building or extending a B2B component that merchants must be able to switch on/off per customer, and that must also respect the permissions a B2B admin grants to employees.

## Key steps / config

Functionality must be hidden in two cases: the merchant has not activated the feature for the customer, or the B2B admin has not granted the employee access to it.

1. Place the component inside the `B2B` folder of the Commercial plugin (`src/B2B/<Component>`, next to `CommercialB2BBundle.php`).
2. Let the component bundle extend `CommercialB2BBundle` (not `CommercialBundle`) and mark each feature as B2B in `describeFeatures()`:

```php
namespace Shopware\Commercial\B2B\YourB2BComponent;

class YourB2BComponent extends CommercialB2BBundle
{
    public function describeFeatures(): array
    {
        return [[ /* ... */ 'type' => self::TYPE_B2B ]];
    }
}
```

3. In every route/controller/API, inject `Shopware\Commercial\B2B\QuickOrder\Domain\CustomerSpecificFeature\CustomerSpecificFeatureService` and call `isAllowed(customerId, technicalCode)` before doing work; throw `CustomerSpecificFeatureException::notAllowed('QUICK_ORDER')` when it returns false. The customer ID comes from `SalesChannelContext::getCustomerId()`; the docs' route uses `defaults: ['_noStore' => false, '_loginRequired' => true]`.
4. In Storefront Twig, use the `customerHasFeature()` function (one argument: the technical code), registered by `Shopware\Commercial\B2B\QuickOrder\Storefront\Framework\Twig\Extension\CustomerSpecificFeatureTwigExtension` with `needs_context => true`:

```twig
{% if customerHasFeature('QUICK_ORDER') %}
    ...
{% endif %}
```

## Essential identifiers

- `CommercialB2BBundle`, `describeFeatures()`, `self::TYPE_B2B`
- `Shopware\Commercial\B2B\QuickOrder\Domain\CustomerSpecificFeature\CustomerSpecificFeatureService::isAllowed()`
- `CustomerSpecificFeatureException::notAllowed()`
- Twig function `customerHasFeature()`
- `SalesChannelContext::getCustomerId()`

## Gotchas

- The docs' controller snippet injects `$customerSpecificFeatureService` but calls `$this->customerB2BFeatureService->isAllowed(...)`; use the injected property name.
- The Twig extension returns false when no customer is logged in (no customer ID in the context), so gated blocks are hidden for guests.
- `isAllowed()` takes the component's technical code (e.g. `QUICK_ORDER`), not a class name.

## Code check (6.7.15.1)
- confirmed `SalesChannelContext::getCustomerId()` — returns nullable customer ID — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:397
- confirmed `_noStore` — route attribute constant `ATTRIBUTE_NO_STORE` — vendor/shopware/core/PlatformRequest.php:81
- confirmed `_loginRequired` — route attribute constant `ATTRIBUTE_LOGIN_REQUIRED` — vendor/shopware/core/PlatformRequest.php:84
- unverified `CommercialB2BBundle` — Commercial plugin, not part of the installed code
- unverified `CustomerSpecificFeatureService::isAllowed()` — Commercial plugin, not part of the installed code
- unverified `CustomerSpecificFeatureException::notAllowed()` — Commercial plugin, not part of the installed code
- unverified `customerHasFeature` — Twig function from the Commercial plugin, not in installed code
