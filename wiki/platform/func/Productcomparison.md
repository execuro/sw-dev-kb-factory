---
id: platform/func/Productcomparison.md
title: Productcomparison
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/Productcomparison
sourceHash: 4238a2fca2b177c9bef0d0a27ed448b1ad7427597015a6d6fc6ba70000ace5f5
revision:
  current: true
  range: "6.4.0.0 - 6.6.10.29"
  swMax: "6.6.10.29"
  swMin: "6.4.0.0"
keywords: ["product comparison", "productExport", "product export", "price portal", "google shopping", "twig template", "scheduled-task:run", "dynamic product group", "product.translated.name", "product.calculatedPrice.unitPrice", "FRAMEWORK__STRING_TEMPLATE_RENDERING_FAILED", "export url", "productvergleich", "feed"]
summary: "Product comparison sales channel: CSV/XML feeds for price portals built from Twig header, product and footer templates; variables, troubleshooting."
lastBuilt: 2026-10-20
---
## What it is

The product comparison sales channel exports products to price portals and marketplaces as a CSV or XML file. The file structure is defined by a Twig export template split into header row, product row and footer row. The export URL can be entered in the portal.

## When to use

When setting up a product feed (for example Google Shopping), adjusting an export template, adding variables or custom fields to a feed, or fixing a failing export.

## Key steps / config

Sales channel tabs:

- **General**: name, optional portal template, storefront sales channel and domain, currency, language, customer group.
- **Product export**: filename, encoding (UTF-8 or ISO-8859-1), file format (CSV or XML), include variants, generation interval, **Generate via scheduler**, and a dynamic product group that selects the exported items. Run the scheduler with `bin/console scheduled-task:run` in the shop main directory; the file is only regenerated automatically once the interval expired and the scheduler option is active.
- **API access**: generates an API Access ID and shows the export URL for the portal. If calling the URL errors, check the dynamic product group and add feed conditions such as "Sales price > 0".
- **Status**: deactivate temporarily, or enable maintenance mode with a whitelist of IP addresses.
- **Template**: header row (CSV column names, or the XML header and start tag), product row (looped per product, one line per article for CSV), footer row (XML end tags only). **Test template** checks syntax, **Generate preview** shows the output. More calculations in the feed make generation slower.

Twig constructs used: `{% if product.active %} ... {% endif %}`, `{% elseif %}`/`{% else %}`, `{% set price = product.calculatedPrice %}`, `{% for properties in product.properties %}`, whitespace control with `{%- -%}` and `{{- -}}`, `{#- -#}`.

Variable roots are `product`, `productExport` and `context`. Frequently used:

- `product.productNumber`, `product.id`, `product.ean`, `product.manufacturerNumber`, `product.parentId`, `product.translated.name`, `product.translated.description`, `product.translated.customFields.<technical_name>`
- `product.cover.media.url`, `product.media`, `product.manufacturer.translated.name`
- `product.calculatedPrice.unitPrice`, `product.calculatedPrice.listPrice.price`, `product.calculatedPrices`, `product.calculatedCheapestPrice.unitPrice`, `product.tax.taxRate`
- `product.active`, `product.available`, `product.stock`, `product.availableStock`, `product.deliveryTime.translated.name`
- `product.categories`, `product.properties`, `product.options`, `product.variation`
- `productExport.fileName`, `productExport.accessKey`, `productExport.encoding`, `productExport.fileFormat`, `productExport.salesChannelDomain.url`
- `context.currency.isoCode`, `context.taxState`, `context.languageInfo.localeCode`

Custom field patterns: `{{ product.translated.customFields.technical_name_of_the_custom_field }}` and `{{ product.manufacturer.translated.customFields.technical_name_of_the_custom_field }}`, optionally wrapped in `{% if ... is defined %}`.

Multiple image URLs: loop `product.media|slice(0, 5)` and output `mediaAssociation.media.url`.

## Essential identifiers

- `bin/console scheduled-task:run`
- `product`, `productExport`, `context` template variables
- `entitySeoUrl('product', product.id)` (product URL, since 6.7.14.0); `seoUrl('frontend.detail.page', {'productId': product.id})` for earlier Storefront versions
- `product.seoCategory`, `product.seoCategory.breadcrumb` (since 6.7.14.0)
- `product.categories.first.getBreadCrumb|slice(1)|join(' > ')|raw|escape`

## Gotchas

- Missing content: for Google Shopping (XML) the export can be cancelled if a product in the group has no image. Wrap `{{ product.cover.media.url }}` in `{% if product.cover.media.url is defined and product.cover.media.url is not null %}`; the same pattern works for other variables.
- A product without a valid category fails with `FRAMEWORK__STRING_TEMPLATE_RENDERING_FAILED` ("Impossible to access an attribute (getBreadCrumb) on a null variable"). Guard with `{% if product.categories.first.getBreadCrumb is defined and product.categories.first.getBreadCrumb is not null %}`.
- `product.productNumber` is case-sensitive; `product.deliveryTimeId` has a lowercase "d" in `Id`.
- `product.variation` and `product.sortedProperties` are only populated if the template also uses `product.options` / `product.properties` with the corresponding group.
- `product.media` order is not fixed; sort by position to follow the Administration order.

## Version notes

- `product.availableStock`: from 6.6.0.0 equal to `product.stock`; before that open order quantities are deducted.
- `product.type` since 6.7.7.0; `product.translated.ogTitle`/`ogDescription` and `product.openGraphMedia.url` since 6.7.10.0; `product.translated.descriptionTeaser` and `productExport.feedLabel` since 6.7.12.0; guarantee fields (`product.guaranteeMonths`, `product.guaranteeConfirmed`) since 6.7.14.0.
- `context.languageInfo.localeCode` and `context.languageInfo.name` since 6.6.10.0; `product.measurements.units.weight.value` and `context.measurementSystem.system` since 6.7.1.0.
- `product.deliveryTime.min`/`max`/`unit` since 6.4.14.0; `product.sortedProperties` since 6.4.9.0.
