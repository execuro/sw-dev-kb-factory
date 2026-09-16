---
id: platform/dev/6.7/products/extensions/b2b-components/_index.md
title: B2B Components
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/
sourceHash: 57670af639fb5f6aaf271cb7eac619526ee5dcc9
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b components", "CommercialB2BBundle", "describeFeatures", "CustomerSpecificFeatureService", "isAllowed", "customerHasFeature", "CustomerSpecificFeatureException", "TYPE_B2B", "feature toggle", "customer-specific features", "QUICK_ORDER", "commercial plugin"]
summary: "B2B Components overview and per-customer feature toggles: CommercialB2BBundle, CustomerSpecificFeatureService isAllowed(), Twig customerHasFeature()."
lastBuilt: 2026-09-15
---
## What it is

The B2B Components are Commercial plugin features for B2B commerce: Employee Management, Quote Management, Order Approval, Individual Pricing, Quick Order and Shopping List, Organization Unit, and Digital Sales Composables. The page also explains how to gate a B2B component per customer with "customer-specific features" toggles.

## When to use

When building or extending a B2B component that merchants must be able to switch on/off per customer (the **Customer-specific features** section on the Administration customer detail page), and that must stay hidden when the B2B admin has not granted an employee access.

## Key steps / config

1. Place B2B components in the `B2B` folder of the Commercial plugin (`src/B2B/<Component>`, with `CommercialB2BBundle.php` in `src/B2B`).
2. Extend `CommercialB2BBundle` (not `CommercialBundle`) and mark each feature with `'type' => self::TYPE_B2B` in `describeFeatures()`:

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

3. In routes/controllers/API, inject `Shopware\Commercial\B2B\QuickOrder\Domain\CustomerSpecificFeature\CustomerSpecificFeatureService` and call `isAllowed(customerId, technicalCode)` before handling the request; throw `CustomerSpecificFeatureException::notAllowed('QUICK_ORDER')` when it returns false.
4. In Storefront Twig, use the `customerHasFeature()` function (registered by `Shopware\Commercial\B2B\QuickOrder\Storefront\Framework\Twig\Extension\CustomerSpecificFeatureTwigExtension`, `needs_context: true`). It takes one argument, the component's technical code, and returns false when there is no logged-in customer in the Twig `context`:

```twig
{% if customerHasFeature('QUICK_ORDER') %}
    ...
{% endif %}
```

## Essential identifiers

- `CommercialB2BBundle`, `CommercialBundle`, `describeFeatures()`, `self::TYPE_B2B`
- `Shopware\Commercial\B2B\QuickOrder\Domain\CustomerSpecificFeature\CustomerSpecificFeatureService::isAllowed()`
- `CustomerSpecificFeatureException::notAllowed()`
- `customerHasFeature()` Twig function, `CustomerSpecificFeatureTwigExtension`
- Technical code example: `QUICK_ORDER`

## Gotchas

- The source's controller example injects `$customerSpecificFeatureService` but calls `$this->customerB2BFeatureService->isAllowed(...)`; use the injected property name.
- Two visibility cases must both be handled: the merchant has not activated the feature for the customer, and the B2B admin has not granted the employee permission.
- All identifiers here belong to the Commercial plugin, which is not part of the installed core/storefront/administration packages.

## Code check (6.7.13.0)
- unverified `CommercialB2BBundle` — Commercial plugin class, not in the installed shopware core/storefront/administration packages
- unverified `CustomerSpecificFeatureService::isAllowed()` — Commercial plugin service, out of scope
- unverified `CustomerSpecificFeatureException::notAllowed()` — Commercial plugin class, out of scope
- unverified `customerHasFeature` — Twig function from Commercial plugin; no match in installed storefront
- unverified `TYPE_B2B` — Commercial plugin constant, out of scope
