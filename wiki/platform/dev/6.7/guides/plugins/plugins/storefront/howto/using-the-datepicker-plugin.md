---
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/using-the-datepicker-plugin.md
title: Using the Datepicker Plugin
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/using-the-datepicker-plugin.html
sourceHash: 6bba7cdf14a559b88b789aa213e4d5c7f48ea6bf
codeCheckedAgainst: "6.7.15.1"
keywords: ["data-date-picker", "data-date-picker-options", "DatePickerPlugin", "flatpickr", "pickerOptions", "app.request.locale", "enableTime", "dateFormat", "altFormat", "allowInput", "selectors", "date picker", "datetime input", "storefront plugin"]
summary: Storefront date/time inputs via the data-date-picker attribute (flatpickr), passing options, preselected values and open/close/clear buttons.
lastBuilt: 2026-10-21
---
## What it is

The Storefront ships a JavaScript datepicker plugin (`DatePickerPlugin`, built on the `flatpickr` library) that turns an input field into a date/time picker. It is activated by the `data-date-picker` attribute and configured with a JSON object in `data-date-picker-options`. The core registers it but does not use it itself; it exists for plugins.

## When to use

You need a date and/or time input field in a Storefront template of your plugin. For flatpickr-specific configuration beyond the options below, the flatpickr documentation applies.

## Key steps / config

1. Override a template block, e.g. `base_main_inner` of `storefront/page/content/index.html.twig`, in `<plugin root>/src/Resources/views/storefront/page/content/index.html.twig`.
2. Add an input with `data-date-picker`; the plugin is lazy-loaded when that selector is present.
3. Pass options as a Twig variable encoded with `json_encode|escape('html_attr')`. Set `locale: app.request.locale` so formatting matches the active Storefront language.
4. Preselect a value via the input's `value` attribute (e.g. `2021-01-01T00:00:00+00:00`).
5. Optional: control the picker with buttons via `selectors.openButton`, `selectors.closeButton`, `selectors.clearButton` (DOM selectors).

```twig
{% sw_extends '@Storefront/storefront/page/content/index.html.twig' %}
{% block base_main_inner %}
    {% set pickerOptions = { locale: app.request.locale, enableTime: true,
        selectors: { openButton: ".openDatePicker", closeButton: ".closeDatePicker", clearButton: ".resetDatePicker" } } %}
    <input type="text" name="customDate" value="2021-01-01T00:00:00+00:00"
           data-date-picker
           data-date-picker-options="{{ pickerOptions|json_encode|escape('html_attr') }}"/>
    <button class="openDatePicker">Open</button>
    {{ parent() }}
{% endblock %}
```

Defaults of `DatePickerPlugin.options` in the installed code:

| Option | Default |
|---|---|
| `dateFormat` | `'Y-m-dTH:i:S+00:00'` (value stored in the input) |
| `altInput` | `true` (hides the original input, renders a new one) |
| `altFormat` | `'j. F Y, H:i'` (display pattern when `altInput` is on) |
| `time_24hr` | `true` |
| `enableTime` | `true` (time selection on by default) |
| `noCalendar` | `false` |
| `weekNumbers` | `true` |
| `allowInput` | `false` |
| `minDate` / `maxDate` | `null` (inclusive bounds) |
| `locale` | `'default'` |

## Essential identifiers

- `data-date-picker`, `data-date-picker-options`
- `DatePickerPlugin` (registered as `DatePicker`)
- `selectors.openButton`, `selectors.closeButton`, `selectors.clearButton`
- `app.request.locale`

## Gotchas

- The docs table lists `allowInput` as `true` and `altFormat` as `'j. FY, H:i'`; the code defaults are `false` and `'j. F Y, H:i'`.
- At runtime `altFormat`, `locale` and `time_24hr` are overridden from the locale: the first two letters of `locale` select the flatpickr locale (non-`en` only), and the display format is chosen per locale (`de`, `en`/default, others), returning only a time format when `enableTime` is on.
- With `enableTime` and `noCalendar` both on, time-only `minDate`/`maxDate` strings are converted to today's full date string.
- When `clearButton` is set, the button is disabled while the input is empty.

## Code check (6.7.15.1)
- confirmed `DatePickerPlugin` — extends the Storefront Plugin base class, wraps flatpickr — vendor/shopware/storefront/Resources/app/storefront/src/plugin/date-picker/date-picker.plugin.js:10
- confirmed `data-date-picker` — core registers `DatePicker` as async plugin on this selector — vendor/shopware/storefront/Resources/app/storefront/src/main.js:102
- confirmed `dateFormat` — default 'Y-m-dTH:i:S+00:00' — vendor/shopware/storefront/Resources/app/storefront/src/plugin/date-picker/date-picker.plugin.js:18
- corrected `altFormat` — docs: default 'j. FY, H:i'; code 'j. F Y, H:i', then replaced per locale — vendor/shopware/storefront/Resources/app/storefront/src/plugin/date-picker/date-picker.plugin.js:19
- corrected `allowInput` — docs: default true; code default false — vendor/shopware/storefront/Resources/app/storefront/src/plugin/date-picker/date-picker.plugin.js:25
- confirmed `minDate` — default null, alongside maxDate — vendor/shopware/storefront/Resources/app/storefront/src/plugin/date-picker/date-picker.plugin.js:26
- confirmed `openButton` — selectors.openButton/closeButton/clearButton default null — vendor/shopware/storefront/Resources/app/storefront/src/plugin/date-picker/date-picker.plugin.js:30
- confirmed `DatePickerPlugin::generateFlatpickrOptions()` — derives altFormat, locale, time_24hr from locale — vendor/shopware/storefront/Resources/app/storefront/src/plugin/date-picker/date-picker.plugin.js:142
- confirmed `base_main_inner` — block exists in page/content/index.html.twig — vendor/shopware/storefront/Resources/views/storefront/page/content/index.html.twig:8
