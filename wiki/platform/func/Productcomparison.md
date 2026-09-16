---
id: platform/func/Productcomparison.md
title: Productcomparison
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/Productcomparison
sourceHash: ac1de92a62aead0664a270e668e0908c561572057912d1739b15d4a3a0358566
revision:
  current: true
  range: "6.3.0.0 - 6.3.5.4"
  swMin: "6.3.0.0"
  swMax: "6.3.5.4"
keywords: ["product comparison", "sales channel product comparison", "price portal export", "product export", "Twig template export", "product feed", "dynamic product group", "API Access ID", "export URL", "maintenance mode", "bin/console scheduled-task:run", "productExport.fileName", "product.productNumber"]
summary: "Configuring the product comparison sales channel to export products via a Twig template to price-comparison portals and marketplaces."
lastBuilt: "2026-09-15"
---
## What it is
The product comparison sales channel exports products to price-comparison portals using a Twig-based export template, either as a pollable file link or on a scheduled interval.

## When to use
When setting up an automated product feed for a price portal or marketplace, or troubleshooting an existing product export.

## Key steps / config
General settings: name the product comparison and optionally pick a portal-specific template. Storefront tab: choose the sales channel, storefront domain, currency, language and customer group the export refers to. Product export tab: set filename, encoding (UTF-8 or ISO-8859-1), file format (CSV or XML), whether to include variants, and the regeneration interval; enable "Generate via scheduler" so the file regenerates when the interval expires. The scheduler is run with:

```
bin/console scheduled-task:run
```

Assign a dynamic product group to control which items are exported. API Access tab generates an API Access ID and shows the export URL for the portal. Status tab can deactivate the comparison or restrict it to maintenance mode / whitelisted IPs.

Template structure (header row, product row, footer row) is written in Twig, e.g.:

```twig
{% if product.active %}
  "{{ product.productNumber }}",{#- -#}
{% endif %}
```

Variables are dot-notated and start with `product` or `productExport`, e.g. `product.productNumber`, `product.translated.name`, `productExport.fileName`, `productExport.accessKey`. Custom fields: `{{ product.translated.customFields.technical_name_of_the_custom_field }}`.

## Essential identifiers
- `product.active`, `product.productNumber`, `product.translated.name`, `product.calculatedPrice`, `product.cover.media.url`, `product.categories.first.getBreadCrumb`
- `productExport.fileName`, `productExport.accessKey`, `productExport.encoding`, `productExport.fileFormat`, `productExport.includeVariants`, `productExport.salesChannelDomain.url`
- `bin/console scheduled-task:run`

## Gotchas
If items in the dynamic product group lack a required field (e.g. a product image or a valid category), the export can fail with an error like `FRAMEWORK__STRING_TEMPLATE_RENDERING_FAILED`; guard such fields with an `if ... is defined and ... is not null` check in the template before rendering them, e.g. wrapping `{{ product.cover.media.url }}` or `{{ product.categories.first.getBreadCrumb|slice(1)|join(' > ')|raw|escape }}`.
