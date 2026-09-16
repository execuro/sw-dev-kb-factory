---
id: platform/dev/6.6/products/extensions/b2b-components/_index.md
title: B2B Components
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/
sourceHash: 6663e3f8e49122bd271ef27ff2363cabe69932d7
keywords: ["B2B components", "Employee Management", "Quote Management", "Order Approval", "Quick Order and Shopping List", "Organization Unit", "Digital Sales Composables", "CustomerSpecificFeatureService", "CommercialB2BBundle", "customerHasFeature", "feature toggle", "describeFeatures", "Customer-specific features"]
summary: "Introduces the B2B Components and how merchants toggle them per business partner via Customer-specific features."
lastBuilt: "2026-09-15"
---
## What it is

This page introduces the B2B Components, a set of features that add B2B ecommerce functionality to a shop: Employee Management (a buyer platform for business partners), Quote Management (sales-representative quote negotiation), Order Approval (an approval workflow for buying), Quick Order and Shopping List (B2B buying behaviors), Organization Unit (differentiated access rights for complex business structures), and Digital Sales Composables (composable frontends for sales-representative jobs).

## When to use

Use this page when you need an overview of the available B2B Components, or when building a plugin that must check whether a specific B2B feature is enabled for a given customer — for example gating a custom route, controller, API, or Twig template behind a feature toggle.

## Key steps / config

B2B Components can be individually activated or deactivated per business partner via the **Customer-specific features** section on the Customer detail page. A feature must be hidden both when a merchant has not activated it for the customer, and when the B2B admin has not granted an employee access to it.

To build a custom B2B component that participates in this toggle system:

1. Place it under the `B2B` folder inside the Commercial plugin (e.g. `src/B2B/YourB2BComponent`).
2. Extend `CommercialB2BBundle` instead of `CommercialBundle`, and add `'type' => self::TYPE_B2B` inside `describeFeatures()`:

```php
namespace Shopware\Commercial\B2B\YourB2BComponent;

class YourB2BComponent extends CommercialB2BBundle
{
    public function describeFeatures(): array
    {
        return [['type' => self::TYPE_B2B]];
    }
}
```

3. In a route/controller/API, check access with `CustomerSpecificFeatureService::isAllowed($customerId, $featureCode)` before the logic runs, throwing `CustomerSpecificFeatureException::notAllowed($featureCode)` when denied.
4. In Storefront Twig templates, use the `customerHasFeature('CODE')` function (registered via `CustomerSpecificFeatureTwigExtension`, which extends `AbstractExtension` and registers the `TwigFunction` named `customerHasFeature`).

## Essential identifiers

- `Shopware\Commercial\B2B\QuickOrder\Domain\CustomerSpecificFeature\CustomerSpecificFeatureService` — service with `isAllowed($customerId, $code)` used to check feature access.
- `CommercialB2BBundle` — base class B2B components must extend instead of `CommercialBundle`.
- `describeFeatures()` — the bundle method that must declare `'type' => self::TYPE_B2B`.
- `customerHasFeature()` — the Twig function for checking feature access in Storefront templates.
- `CustomerSpecificFeatureTwigExtension` — the Twig extension class registering `customerHasFeature`.
