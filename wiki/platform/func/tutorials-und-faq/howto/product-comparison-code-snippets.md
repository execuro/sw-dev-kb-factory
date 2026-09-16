---
id: platform/func/tutorials-und-faq/howto/product-comparison-code-snippets.md
title: "Product Comparison Code Snippets"
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-und-faq/howto/product-comparison-code-snippets"
sourceHash: "848291d9578283af0c881ff739ed411f431838a5216b39a0f8f2d16cf4f3b8ea"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["Twig", "product comparison template", "social shopping", "calculatedPrice", "calculatedPrices", "listPrice", "purchaseUnit", "unit.shortCode", "referenceUnit", "additional_image_link", "product.options", "Google Shopping feed"]
summary: "Twig snippets to extend Shopware's product comparison/social shopping export templates: list prices, extra images and variant properties."
lastBuilt: "2026-09-15"
---
## What it is
Collection of Twig code snippets for extending Shopware's product comparison and social shopping export templates.

## When to use
Use when customizing a product comparison/social shopping feed template to export list prices, extra image links, shipping costs, sales/basic units, or variant properties, beyond the fixed price used by default.

## Key steps / config
- Default price code uses `product.calculatedPrice`, falling back to `product.calculatedPrices.last` when multiple calculated prices exist:

```twig
{% set price = product.calculatedPrice %}
{%- if product.calculatedPrices.count > 0 -%}
   {% set price = product.calculatedPrices.last %}
{%- endif -%}
```

- To also export list prices, check `product.calculatedPrice.listPrice` and use `product.calculatedPrices.first.unitPrice` / `product.calculatedPrice.unitPrice` together with `context.currency.isoCode`.
- For additional images beyond the first, loop `product.media` when `product.media|length > 1`, using `media.media.url`; these are exported with the `additional_image_link` tag.
- The shipping-cost block checks `product.shippingFree` and can be removed if not required for Google Shopping.
- Sales/basic unit snippets read `product.unit.shortCode` (or `product.unit.translated.shortCode` as a fallback), combined with `product.purchaseUnit` for the sales unit and `product.referenceUnit` for the basic unit.
- Variant properties loop:

```twig
{% for option in product.options %}
    {{ option.name }}
{% endfor %}
```

## Essential identifiers
- `product.calculatedPrice`, `product.calculatedPrices`, `product.calculatedPrice.listPrice`
- `product.media`, `media.media.url`, `additional_image_link`
- `product.shippingFree`
- `product.unit.shortCode`, `product.unit.translated.shortCode`, `product.purchaseUnit`, `product.referenceUnit`
- `product.options`

## Gotchas
If `product.unit.shortCode` does not work, try `product.unit.translated.shortCode` instead.
