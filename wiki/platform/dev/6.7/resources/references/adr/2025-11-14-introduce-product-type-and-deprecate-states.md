---
id: platform/dev/6.7/resources/references/adr/2025-11-14-introduce-product-type-and-deprecate-states.md
title: Introduce Product Type And Deprecate Product States
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-11-14-introduce-product-type-and-deprecate-states.html
sourceHash: ec046fd7db357a3aef8e3e65259f1163f0d2f972
codeCheckedAgainst: "6.7.13.0"
keywords: ["product.type", "ProductTypeRegistry", "shopware.product.allowed_types", "LineItemProductTypeRule", "cartLineItemProductType", "/api/_action/product/types", "LineItem::PAYLOAD_PRODUCT_TYPE", "product.states", "StatesUpdater", "LineItemProductStatesRule", "digital product", "physical product", "product type"]
summary: "ADR (2025-11-14): product.type (physical/digital, extensible via shopware.product.allowed_types) replaces deprecated product.states, removed in 6.8."
lastBuilt: 2026-09-15
---
## What it is

Inventory ADR introducing a single, immutable `product.type` field (default `physical`, platform types `physical` and `digital`) and a server-side `ProductTypeRegistry`, replacing the JSON-array product states field, which mixed responsibilities, could not be indexed and was rewritten on every product save.

## When to use

- Creating digital products, or filtering/querying products and line items by digital vs. physical.
- Registering custom product types (e.g. `bundle`, `container`) from a plugin or project.
- Migrating rule conditions, product streams, listing filters or custom code away from the deprecated states field (see Gotchas).

## Key steps / config

1. Set `type` explicitly when creating products: `digital` for downloads; default is `physical`. The DAL `type` field is `ApiAware`, `Immutable` and validated by `Choice` against the registered types. Querying is a plain filter, e.g. `product.type = 'digital'`.
2. Register additional types via `shopware.product.allowed_types` in `config/packages/shopware.yaml`; the parameter `%shopware.product.allowed_types%` is injected into `ProductTypeRegistry`:

```yaml
shopware:
    product:
        allowed_types:
            - physical
            - digital
            - bundle
            - container
```

   The shipped default list is `physical`, `digital`.
3. `Shopware\Core\Content\Product\ProductTypeRegistry` (final) exposes `addType(string $type): void`, `getTypes(): array`, `hasType(string $type): bool`; it implements `FieldEnumProviderInterface` for the product `type` field.
4. Rule builder: use `LineItemProductTypeRule` (rule name `cartLineItemProductType`).
5. Line items carry the product type in the payload key `productType` (`LineItem::PAYLOAD_PRODUCT_TYPE`), persisted into the order line item payload.
6. Admin API: `GET /api/_action/product/types` (route `api.action.product.types`) returns all registered types, for product stream and listing filters in the Administration.

## Essential identifiers

- `product.type`, `ProductDefinition::TYPE_PHYSICAL`, `ProductDefinition::TYPE_DIGITAL`
- `Shopware\Core\Content\Product\ProductTypeRegistry`
- `shopware.product.allowed_types`
- `Shopware\Core\Checkout\Cart\Rule\LineItemProductTypeRule` / `cartLineItemProductType`
- `LineItem::PAYLOAD_PRODUCT_TYPE` (`productType`)
- `GET /api/_action/product/types`

## Gotchas

- Deprecated for 6.8 removal: `product.states`, `order_line_item.states`, `LineItemProductStatesRule` (`cartLineItemProductStates`), `StatesUpdater` and its events `ProductStatesBeforeChangeEvent` / `ProductStatesChangedEvent`, plus product stream and listing filters based on `product.states`.
- The ADR names the payload key `order_line_item.payload.product_type`; the installed key is `productType`.
- Filter by `type` explicitly: third-party types (e.g. `container`) can otherwise produce unexpected results.
- The core migrates existing states data to `type`; `LineItemTransformer` reconstructs legacy states when needed. The UI should warn when `states` is used in streams, rules or listing filters.

## Version notes

- 6.7: backwards compatible; legacy states are still written only while `Feature::isActive('v6.8.0.0') === false`, and the `states` field carries a `Deprecated('v6.7.6.0', 'v6.8.0.0', 'type')` flag. Rules using `cartLineItemProductStates` work until 6.8.
- 6.8: `states` fields disappear; the `type` field additionally becomes `Required`.

## Code check (6.7.13.0)
- confirmed `ProductTypeRegistry` — final, implements FieldEnumProviderInterface; types injected via constructor — vendor/shopware/core/Content/Product/ProductTypeRegistry.php:9
- confirmed `ProductTypeRegistry::addType()` — ignores already registered types — vendor/shopware/core/Content/Product/ProductTypeRegistry.php:26
- confirmed `allowed_types` — default [physical, digital] — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:689
- confirmed `ProductDefinition::TYPE_PHYSICAL` — default value of the product entity `type` — vendor/shopware/core/Content/Product/ProductEntity.php:81
- corrected `LineItem::PAYLOAD_PRODUCT_TYPE` — docs: payload key product_type; code uses productType — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:33
- confirmed `LineItemProductTypeRule` — rule name cartLineItemProductType — vendor/shopware/core/Checkout/Cart/Rule/LineItemProductTypeRule.php:19
- confirmed `/api/_action/product/types` — GET route api.action.product.types — vendor/shopware/core/Content/Product/Api/ProductActionController.php:36
- deprecated `LineItemProductStatesRule` — tag:v6.8.0, use LineItemProductTypeRule — vendor/shopware/core/Checkout/Cart/Rule/LineItemProductStatesRule.php:19
- deprecated `StatesUpdater` — tag:v6.8.0, product states deprecated — vendor/shopware/core/Content/Product/DataAbstractionLayer/StatesUpdater.php:22
- deprecated `ProductStatesChangedEvent` — tag:v6.8.0 removal — vendor/shopware/core/Content/Product/Events/ProductStatesChangedEvent.php:16
