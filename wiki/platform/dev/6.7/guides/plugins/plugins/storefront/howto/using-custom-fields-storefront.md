---
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/using-custom-fields-storefront.md
title: Add Custom Field in the Storefront
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/using-custom-fields-storefront.html
sourceHash: 45198e11f617fa426ef803207108e0bc769bdb79
codeCheckedAgainst: "6.7.13.0"
keywords: ["custom fields", "customFields", "sw_sanitize", "trans", "sw_extends", "component_product_description_content_text", "component_address_personal_fields", "StoreApiCustomFieldMapper", "allowCustomerWrite", "modifiable via store api", "snippet", "registration form", "storefront twig"]
summary: Output custom field values and their auto-created customFields.<name> snippets in Storefront Twig, and write customer custom fields via registration forms.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to render custom field labels and values in Storefront Twig templates, and how to let customers fill a custom field from a Storefront form (e.g. registration) without a subscriber.

## When to use

You have a plugin and a custom field (see [adding custom fields](platform/dev/6.7/guides/plugins/plugins/framework/custom-field/add-custom-field.md); plugin setup in the [plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)) and want to show it on a page or collect it in a customer form.

## Key steps / config

1. **Snippet naming.** Creating a custom field via API or Administration automatically creates a snippet for every snippet set, key `customFields.` + field name (e.g. `my_test_field` -> `customFields.my_test_field`). The snippet value defaults to the field's label for that locale, else the name. Edit/translate it in the Administration snippet settings.
2. **Render label + value** in Twig:
   ```twig
   {{ "customFields.my_test_field"|trans|sw_sanitize }}: {{ product.translated.customFields.my_test_field }}
   ```
   `sw_sanitize` is a Shopware Twig filter that strips tags/attributes not allowed for Shopware output. On product-page contexts the docs use `page.product.translated.customFields...`; inside the product description component the variable is `product`.
3. **Extend a template block** and keep the original with `parent()`. In 6.7.13 the product description text lives in `@Storefront/storefront/component/product/description.html.twig`, block `component_product_description_content_text`:
   ```twig
   {% sw_extends '@Storefront/storefront/component/product/description.html.twig' %}
   {% block component_product_description_content_text %}
       {{ parent() }}
       {{ "customFields.my_test_field"|trans|sw_sanitize }}: {{ product.translated.customFields.my_test_field }}
   {% endblock %}
   ```
4. **Custom fields in forms.** Enable **Modifiable via Store API** on the custom field (stored as `allowCustomerWrite` / column `allow_customer_write`). Then add an input named `customFields[<field_name>]` to the form, e.g. in `<plugin root>/src/Resources/views/storefront/component/address/address-personal.html.twig`:
   ```twig
   {% sw_extends '@Storefront/storefront/component/address/address-personal.html.twig' %}
   {% block component_address_personal_fields %}
       {{ parent() }}
       <label for="customFields[custom_field_name]">{{ "customFields.custom_field_name"|trans|sw_sanitize }}*</label>
       <input type="text" name="customFields[custom_field_name]"
              value="{{ context.customer.customFields['custom_field_name'] }}" required="required">
   {% endblock %}
   ```
   `RegisterRoute` passes the `customFields` request bag through `StoreApiCustomFieldMapper::map()`, which only keeps fields with `allow_customer_write = 1`.

## Essential identifiers

- Snippet key pattern `customFields.<name>`
- Twig filters `trans`, `sw_sanitize`; tag `sw_extends`
- Blocks `component_product_description_content_text`, `component_address_personal_fields`
- Form field name `customFields[<name>]`
- `allowCustomerWrite` (Administration: "Modifiable via Store API")
- `Shopware\Core\System\SalesChannel\StoreApiCustomFieldMapper`

## Gotchas

- The docs extend `@Storefront/storefront/page/product-detail/description.html.twig` and block `page_product_detail_description_content_text`; neither exists in the installed 6.7.13 Storefront — use the component template/block above.
- Without "Modifiable via Store API", form-submitted custom field values are silently dropped by the mapper.
- The docs call `sw_sanitize` a Twig function; it is registered as a filter.

## Code check (6.7.13.0)
- confirmed `translation_key` — set to 'customFields.' + field name on custom field creation — vendor/shopware/core/System/Snippet/Subscriber/CustomFieldSubscriber.php:108
- corrected `sw_sanitize` — docs: Twig function; registered as a TwigFilter — vendor/shopware/core/Framework/Adapter/Twig/Extension/SwSanitizeTwigFilter.php:33
- confirmed `sw_extends` — token parser tag — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- corrected `component_product_description_content_text` — docs: page_product_detail_description_content_text in page/product-detail/description.html.twig — vendor/shopware/storefront/Resources/views/storefront/component/product/description.html.twig:13
- confirmed `component_address_personal_fields` — block exists — vendor/shopware/storefront/Resources/views/storefront/component/address/address-personal.html.twig:8
- confirmed `allowCustomerWrite` — entity property, defaults to false — vendor/shopware/core/System/CustomField/CustomFieldEntity.php:33
- confirmed `customFields` — RegisterRoute maps the request bag via StoreApiCustomFieldMapper — vendor/shopware/core/Checkout/Customer/SalesChannel/RegisterRoute.php:184
- confirmed `allow_customer_write` — mapper filters on it — vendor/shopware/core/System/SalesChannel/StoreApiCustomFieldMapper.php:65
