---
id: platform/dev/6.6/guides/plugins/plugins/storefront/using-custom-fields-storefront.md
title: Add custom field in the storefront
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/using-custom-fields-storefront.html
sourceHash: ab4d476061b132d2746a27b58e0177634da32cd6
keywords: ["custom fields", "sw_sanitize", "customFields snippet", "my_test_field", "page_product_detail_description_content_text", "sw_extends", "address-personal.html.twig", "trans filter", "storefront custom field display"]
summary: How to render a custom field's value and translated snippet label in Storefront templates and forms.
lastBuilt: 2026-09-15
---

## What it is

Shows how to display a custom field's value in the Storefront, including its auto-generated translation snippet, and how to add a custom field as an input in a form (e.g. customer registration).

## When to use

When a plugin adds a custom field via API/Administration and needs to show or collect its value on the Storefront.

## Key steps / config

Custom field snippets are auto-created with the naming pattern `customFields.<field_name>` (e.g. field `my_test_field` gets snippet `customFields.my_test_field`), editable via the Administration's snippet settings.

Render label and value using `trans` and `sw_sanitize`:

```twig
{{ "customFields.my_test_field"|trans|sw_sanitize }}: {{ page.product.translated.customFields.my_test_field }}
```

Extend the product description template to inject it:

```twig
{% sw_extends '@Storefront/storefront/page/product-detail/description.html.twig' %}

{% block page_product_detail_description_content_text %}
    {{ parent() }}
    {{ "customFields.my_test_field"|trans|sw_sanitize }}: {{ page.product.translated.customFields.my_test_field }}
{% endblock %}
```

Add a custom field as a form input (e.g. on the customer address form), no subscriber/listener required:

```twig
{% sw_extends '@Storefront/storefront/component/address/address-personal.html.twig' %}

{% block component_address_personal_fields %}
    {{ parent() }}
    <input type="text" name="customFields[custom_field_name]" id="customFields[custom_field_name]" value="{{context.customer.customFields['custom_field_name'] }}" required="required">
{% endblock %}
```

## Essential identifiers

- Snippet naming: `customFields.<field_name>`
- `sw_sanitize` Twig filter
- Blocks: `page_product_detail_description_content_text`, `component_address_personal_fields`
- Form field name pattern: `customFields[<field_name>]`

## Gotchas

- `sw_sanitize` is a Shopware-specific Twig function that filters tags/attributes from a string — use it whenever outputting custom-field content.
