---
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/_index.md
title: How-To Guides
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/
sourceHash: 5d8867e41e5620e8f34a53699a684c2c9d1a0844
codeCheckedAgainst: "6.7.13.0"
keywords: ["storefront how-to", "storefront customization", "custom captcha", "product listing sorting", "listing filters", "media thumbnails", "custom fields storefront", "modal window", "datepicker", "nested line items", "AbstractCaptcha", "DatePicker"]
summary: "Index of Storefront how-to guides: custom captcha, listing sorting and filters, media thumbnails, custom fields, modal window, datepicker, nested line items."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-custom-captcha.md", "platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-listing-filters.md", "platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-custom-sorting-product-listing.md", "platform/dev/6.7/guides/plugins/plugins/storefront/howto/using-a-modal-window.md"]
---
## What it is

Section index for practical guides that implement common customization and extension scenarios in the Shopware Storefront from a plugin. The page itself contains no instructions; it lists the individual guides.

## When to use

You are looking for a task-oriented Storefront guide and want to find the matching page quickly.

## Key steps / config

Guides in this section:

- [Add custom captcha](platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-custom-captcha.md) — add a captcha type to the Storefront.
- [Add custom sorting for product listing](platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-custom-sorting-product-listing.md) — additional sort options for product listings.
- [Add custom listing filters](platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-listing-filters.md) — additional filters for product listings.
- [Working with media and thumbnails](platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-media-thumbnails.md) — using media and their thumbnails in the Storefront.
- [Add custom field in the Storefront](platform/dev/6.7/guides/plugins/plugins/storefront/howto/using-custom-fields-storefront.md) — displaying custom fields in Storefront templates.
- [Using a modal window](platform/dev/6.7/guides/plugins/plugins/storefront/howto/using-a-modal-window.md) — opening content in a modal.
- [Using the datepicker plugin](platform/dev/6.7/guides/plugins/plugins/storefront/howto/using-the-datepicker-plugin.md) — the Storefront datepicker JavaScript plugin.
- [Use nested line items](platform/dev/6.7/guides/plugins/plugins/storefront/howto/use-nested-line-items.md) — working with nested line items.

## Code check (6.7.13.0)
- confirmed `AbstractCaptcha` — base class used by the custom captcha guide — vendor/shopware/storefront/Framework/Captcha/AbstractCaptcha.php:10
- confirmed `DatePicker` — Storefront JS plugin registered for plugins on data-date-picker — vendor/shopware/storefront/Resources/app/storefront/src/main.js:100
- confirmed `AjaxModal` — Storefront JS modal plugin registration — vendor/shopware/storefront/Resources/app/storefront/src/main.js:108
