---
id: platform/func/extensions/customproducts.md
title: Customproducts
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/customproducts
sourceHash: 02fc8d8fbfb0931249d77bb4c558d05788dc78949c482239afbe1cabf452536c
revision:
  current: true
  range: "3.1.0 - 3.1.0"
  swMax: "3.1.0"
  swMin: "3.1.0"
keywords: ["Custom Products", "product templates", "option types", "Selection field", "Image upload", "Colour selection", "HTML editor", "Text area", "Number field", "surcharges", "rule builder", "lineItem.payload", "Rise plan"]
summary: "Rise-plan extension for product templates with individualization options (text, image, date, color) and per-option surcharges."
lastBuilt: "2026-09-15"
---

## What it is

Custom Products (Shopware Rise-plan extension) lets merchants create product templates with selectable individualization options — text, images, dates, colors, and more — that customers configure on the product detail page, with optional surcharges.

## When to use

When products need buyer-supplied customization (e.g. engravings, custom colors or dates) beyond standard variants, or when the order confirmation/invoice needs to display the chosen options.

## Key steps / config

- Install under **Extensions > My Extensions** (Rise plan); manage under **Catalogues > Custom Products**.
- Create a **product template**: internal name, active flag, display name, description, picture, step-by-step mode, self-collapsing options, and "customers need to confirm their configuration".
- Add **options** of type Selection field, Image upload (JPG, PNG, GIF, WEBP, SVG, BMP, TIFF, EPS), Picture selection, Checkbox, File Upload (PDF), Date field, Colour selection, HTML editor, Text area, Text field, Number field, or Time field — each with a name, mandatory flag, description, and (for most) an order number.
- **Surcharges** per option: absolute (select a tax rate, then gross/net price, with an extended surcharge via rule builder and currency-dependent prices) or relative (percentage of the product price, also via rule builder); "Surcharge once per order" applies it once even if the option is selected multiple times in one order.
- **Exclude options from each other**: define exclusion combinations between non-mandatory options, based on whether a field is filled or left empty.
- Assign a template to a product under the product's **Specifications > Custom Products** tab.
- Order confirmation/invoice: since extension version 3.1.1, selected values are output automatically in the standard template. Earlier versions require manually extending the email template's loop over `order.lineItems`, branching on `lineItem.payload.type`:
```twig
{% for lineItem in order.lineItems %}
  {{ lineItem.label }}
  {% if lineItem.payload.options is defined %}
    {% for option in lineItem.payload.options %}
      {{ option.group }}: {{ option.option }}
    {% endfor %}
  {% endif %}
  {% if lineItem.payload.type == "textfield" %}{{ lineItem.payload.value }}{% endif %}
{% endfor %}
```

## Essential identifiers

`lineItem.payload.options`, `lineItem.payload.type`, `lineItem.payload.value`, `lineItem.payload.media`, `lineItem.payload.productNumber`, Custom Products templates, Specifications > Custom Products

## Gotchas

- Only one surcharge type (absolute or relative) is available per option.
- The "No selection" element is unavailable once an option is marked mandatory.
- Some image/file formats for Image upload are only supported in the Admin.
- Extension versions older than 3.1.1 need manual e-mail-template edits to show selected option values on invoices/order confirmations.

## Version notes

As of extension version 3.1.1, selected option content (text, numbers, dates, etc.) is output automatically in the standard invoice/order-confirmation template.
