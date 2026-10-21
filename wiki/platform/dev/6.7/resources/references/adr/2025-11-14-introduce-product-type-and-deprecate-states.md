---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2025-11-14-introduce-product-type-and-deprecate-states.md
sourceHash: ec046fd7db357a3aef8e3e65259f1163f0d2f972
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-11-14-introduce-product-type-and-deprecate-states.html
title: Introduce Product Type And Deprecate Product States
version: "6.7"
versions:
  - "6.7"
keywords: ["product.type", "product.states", "ProductTypeRegistry", "LineItemProductTypeRule", "LineItemProductStatesRule", "cartLineItemProductType", "shopware.product.allowed_types", "StatesUpdater", "/api/_action/product/types", "digital product", "physical product", "product type", "adr"]
summary: "ADR: immutable product.type (physical/digital, extensible via shopware.product.allowed_types) replaces deprecated product.states."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (2025-11-14, area inventory) that replaces the JSON-array field `product.states` (`is-download` / `is-physical`, written by `StatesUpdater` on every save) with a single, immutable `product.type` string field, adds a product type registry that extensions can extend, a new rule condition, and an Admin API endpoint listing all registered types.

## When to use

- You filter, query or create digital vs. physical products, or write rule conditions / product stream filters on that distinction.
- You want to add your own product type (e.g. `bundle`, `container`).
- You maintain code that reads `product.states`, `order_line_item.states` or the states rule and must migrate before 6.8.

## Key steps / config

1. Use the `type` field of `product`: allowed by default `physical` and `digital` (`ProductDefinition::TYPE_PHYSICAL`, `ProductDefinition::TYPE_DIGITAL`), default `physical`. The field is `Immutable` — set it on creation; set `type` to `digital` explicitly when creating digital products. Query with a plain filter (`product.type = 'digital'`).
2. Register additional types via the container parameter `%shopware.product.allowed_types%` in `config/packages/shopware.yaml`. The core default list is `physical`, `digital`:

   ```yaml
   shopware:
       product:
           allowed_types:
             - physical
             - digital
             - bundle
             - container
   ```

3. `Shopware\Core\Content\Product\ProductTypeRegistry` (final, built from that parameter) exposes `addType(string $type)`, `getTypes()`, `hasType(string $type)`; it also acts as the enum-choice provider for the `product.type` field.
4. Fetch all registered types in admin UIs (stream filters, listing filters) with `GET /api/_action/product/types` (route `api.action.product.types`), which returns the registry's `getTypes()` list.
5. On order conversion the line item payload carries the product type under `LineItem::PAYLOAD_PRODUCT_TYPE` (payload key `productType`); `LineItemTransformer` fills it from the product's type and falls back to `physical` when an order line item has none.
6. Rule builder: use `LineItemProductTypeRule` (rule name `cartLineItemProductType`). It picks up custom types from the registry, so PHP conditions stay consistent with storefront/admin filters.

## Essential identifiers

- `product.type`, `ProductDefinition::TYPE_PHYSICAL`, `ProductDefinition::TYPE_DIGITAL`
- `Shopware\Core\Content\Product\ProductTypeRegistry`
- `shopware.product.allowed_types`
- `GET /api/_action/product/types`
- `Shopware\Core\Checkout\Cart\Rule\LineItemProductTypeRule` / `cartLineItemProductType`
- `LineItem::PAYLOAD_PRODUCT_TYPE` (`productType`)

## Gotchas

- `product.states` is a JSON array, not indexed, so "only digital products" filtering on it is slow; the new field is a single value — a product has exactly one type.
- Be explicit in queries: filter by the type you want (e.g. `type = 'physical'`) rather than "not digital", because extensions may add types like `container` you do not know about.
- The ADR names the payload key `order_line_item.payload.product_type`; the installed code uses `productType`.
- Deprecated, still present until 6.8: `product.states` (DAL field deprecated since v6.7.6.0, replaced by `type`), `order_line_item.states`, `LineItemProductStatesRule` (`cartLineItemProductStates`), `StatesUpdater`, `ProductStatesBeforeChangeEvent`, `ProductStatesChangedEvent`, and stream/listing filters on `states`. The UI should warn when `states` is used.

## Version notes

- 6.7: backward compatible — the legacy `states` column is still written only while `Feature::isActive('v6.8.0.0') === false`; existing `product.states` / `order_line_item.states` data is migrated to the type, and rules referencing `cartLineItemProductStates` keep working but should be migrated.
- 6.8: `states` fields disappear; `product.type` becomes `Required` when the `v6.8.0.0` flag is active.

## Code check (6.7.15.1)
- confirmed `ProductTypeRegistry` — final class implementing FieldEnumProviderInterface — vendor/shopware/core/Content/Product/ProductTypeRegistry.php:9
- confirmed `ProductTypeRegistry::addType()` — skips already-registered types — vendor/shopware/core/Content/Product/ProductTypeRegistry.php:26
- confirmed `shopware.product.allowed_types` — default list physical, digital — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:733
- confirmed `product.type` — Immutable StringField with Choice; Required only under v6.8.0.0 flag — vendor/shopware/core/Content/Product/ProductDefinition.php:295
- deprecated `product.states` — Deprecated('v6.7.6.0', 'v6.8.0.0', 'type') — vendor/shopware/core/Content/Product/ProductDefinition.php:310
- confirmed `/api/_action/product/types` — GET route api.action.product.types — vendor/shopware/core/Content/Product/Api/ProductActionController.php:36
- confirmed `LineItemProductTypeRule` — rule name cartLineItemProductType — vendor/shopware/core/Checkout/Cart/Rule/LineItemProductTypeRule.php:21
- deprecated `LineItemProductStatesRule` — removed in v6.8.0, use LineItemProductTypeRule — vendor/shopware/core/Checkout/Cart/Rule/LineItemProductStatesRule.php:16
- deprecated `StatesUpdater` — will be removed in v6.8.0 — vendor/shopware/core/Content/Product/DataAbstractionLayer/StatesUpdater.php:19
- corrected `LineItem::PAYLOAD_PRODUCT_TYPE` — docs: payload key `product_type`; code uses `productType` — vendor/shopware/core/Checkout/Cart/LineItem/LineItem.php:33
