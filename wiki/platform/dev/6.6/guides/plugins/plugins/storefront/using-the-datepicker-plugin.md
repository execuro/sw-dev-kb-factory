---
id: platform/dev/6.6/guides/plugins/plugins/storefront/using-the-datepicker-plugin.md
title: Using the datepicker plugin
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/using-the-datepicker-plugin.html
sourceHash: 7eba75d499b421b63fe03246fb21c47a7b98a4b7
keywords: ["datepicker", "data-date-picker", "data-date-picker-options", "flatpickr", "enableTime", "altInput", "dateFormat", "minDate", "maxDate", "date input field", "picker selectors"]
summary: How to activate and configure Shopware's flatpickr-based datepicker on a Storefront input via data attributes.
lastBuilt: 2026-09-15
---

## What it is

Documents Shopware's Storefront datepicker plugin, which wraps the `flatpickr` library, and how to activate, configure, preselect and control it via data attributes.

## When to use

When a plugin needs a date/time input field in the Storefront.

## Key steps / config

Activate the datepicker on an input by adding the `data-date-picker` attribute:

```twig
<input type="text" name="customDate" class="customDate" data-date-picker />
```

Pass options as JSON via `data-date-picker-options`:

```twig
{% set pickerOptions = {
    locale: app.request.locale,
    enableTime: true
} %}
<input type="text" name="customDate" class="customDate" data-date-picker
       data-date-picker-options="{{ pickerOptions|json_encode|escape('html_attr') }}" />
```

Preselect a value by setting the input's `value` attribute (e.g. `value="2021-01-01T00:00:00+00:00"`).

Control the picker via buttons using `selectors` in the options: `openButton`, `closeButton`, `clearButton` (each a CSS selector).

## Essential identifiers

- `data-date-picker` attribute
- `data-date-picker-options` attribute (JSON, `json_encode|escape('html_attr')`)
- Option keys: `locale`, `enableTime`, `dateFormat`, `altInput`, `altFormat`, `time_24hr`, `noCalendar`, `weekNumbers`, `allowInput`, `minDate`, `maxDate`
- `selectors.openButton` / `selectors.closeButton` / `selectors.clearButton`

## Gotchas

- Time selection (`enableTime`) is active by default; disable it explicitly via options if not wanted.
- `locale` should typically be set from `app.request.locale` so the picker matches the active Storefront language.
