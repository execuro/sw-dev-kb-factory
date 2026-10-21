---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/using-custom-fields-storefront.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md
sourceHash: 45198e11f617fa426ef803207108e0bc769bdb79
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/using-custom-fields-storefront.html
title: Add Custom Field in the Storefront
version: "6.7"
versions:
  - "6.7"
keywords: ["customFields", "sw_sanitize", "trans", "allowCustomerWrite", "Modifiable via Store API", "component_address_personal_fields", "address-personal.html.twig", "component_product_description_content_text", "custom field snippet", "custom field label", "registration form", "storefront twig"]
summary: Show custom field values and their auto-created customFields.<name> snippet labels in Storefront Twig, and write customer custom fields from forms.
lastBuilt: 2026-10-21
---
## What it is

How to output custom field values and labels in Storefront templates, and how to let customers fill a custom field from a Storefront form (e.g. registration). Creating a custom field via API or Administration automatically creates a snippet per snippet set named `customFields.<name>`.

## When to use

A plugin or merchant has added a custom field (e.g. `my_test_field` on product, or a customer custom field) and it must be displayed with a translated label in the Storefront or captured through a customer form.

## Key steps / config

1. Label + value: the snippet key is `customFields.` + field name; the value lives under the entity's `translated.customFields`:

```twig
{{ "customFields.my_test_field"|trans|sw_sanitize }}: {{ product.translated.customFields.my_test_field }}
```

2. Place it by extending a template block and keeping the original with `parent()`. For the product description in 6.7, the block is `component_product_description_content_text` in `@Storefront/storefront/component/product/description.html.twig` (the entity variable there is `product`):

```twig
{% sw_extends '@Storefront/storefront/component/product/description.html.twig' %}
{% block component_product_description_content_text %}
    {{ parent() }}
    {{ "customFields.my_test_field"|trans|sw_sanitize }}: {{ product.translated.customFields.my_test_field }}
{% endblock %}
```

3. Forms: no subscriber needed — add an input named `customFields[<field name>]` to the form, e.g. in `<plugin root>/src/Resources/views/storefront/component/address/address-personal.html.twig` extending block `component_address_personal_fields`:

```twig
{% block component_address_personal_fields %}
    {{ parent() }}
    <label for="customFields[custom_field_name]">{{ "customFields.custom_field_name"|trans|sw_sanitize }}*</label>
    <input type="text" name="customFields[custom_field_name]"
           value="{{ context.customer.customFields['custom_field_name'] }}" required="required">
{% endblock %}
```

4. Enable **Modifiable via Store API** on the custom field (stored as `allowCustomerWrite` / column `allow_customer_write`); without it the Store API will not write customer-submitted values.

## Essential identifiers

- Snippet key pattern `customFields.<name>` (editable/translatable in the Administration snippet settings)
- Twig filter `sw_sanitize` (strips tags/attributes, Shopware-specific)
- `allowCustomerWrite` custom field flag (Admin label "Modifiable via Store API")
- Blocks `component_product_description_content_text`, `component_address_personal_fields`
- Form field name `customFields[<name>]`

## Gotchas

- The source extends `@Storefront/storefront/page/product-detail/description.html.twig` block `page_product_detail_description_content_text` and reads `page.product`; neither template nor block exists in 6.7 — use `component/product/description.html.twig` as above.
- The source calls `sw_sanitize` a Twig function; it is registered as a Twig filter (used with `|`).

## Code check (6.7.15.1)
- confirmed `customFields.` — snippet translation_key prefix created on custom field insert — vendor/shopware/core/System/Snippet/Subscriber/CustomFieldSubscriber.php:111
- corrected `sw_sanitize` — docs: Twig function; registered as TwigFilter — vendor/shopware/core/Framework/Adapter/Twig/Extension/SwSanitizeTwigFilter.php:32
- confirmed `allowCustomerWrite` — custom field flag allowing customer writes — vendor/shopware/core/System/CustomField/CustomFieldDefinition.php:69
- confirmed `labelAllowCustomerWrite` — admin label "Modifiable via Store API" — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-custom-field/snippet/en.json:73
- confirmed `component_address_personal_fields` — block in address-personal template — vendor/shopware/storefront/Resources/views/storefront/component/address/address-personal.html.twig:8
- confirmed `component_product_description_container` — product description template wrapper containing content_text block — vendor/shopware/storefront/Resources/views/storefront/component/product/description.html.twig:4
- absent `page_product_detail_description_content_text` — block not found in installed code; product-detail/description.html.twig no longer exists
