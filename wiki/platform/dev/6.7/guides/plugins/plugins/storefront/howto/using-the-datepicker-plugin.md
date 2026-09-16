---
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/using-the-datepicker-plugin.md
title: Using the Datepicker Plugin
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/using-the-datepicker-plugin.html
sourceHash: 6bba7cdf14a559b88b789aa213e4d5c7f48ea6bf
codeCheckedAgainst: "6.7.13.0"
keywords: ["datepicker", "date picker", "DatePicker", "DatePickerPlugin", "data-date-picker", "data-date-picker-options", "flatpickr", "enableTime", "dateFormat", "altInput", "minDate", "maxDate", "time picker", "storefront js plugin"]
summary: Storefront DatePicker JS plugin (flatpickr) enabled by data-date-picker and configured via data-date-picker-options; option defaults and button selectors.
lastBuilt: 2026-09-15
---
## What it is

The Storefront ships a `DatePicker` JavaScript plugin (`DatePickerPlugin`, a wrapper around `flatpickr`) that turns an input element into a date/time picker. The core registers it for plugins only; the core templates do not use it.

## When to use

You need a date and/or time input in a Storefront template of your plugin (template extension basics: plugin base guide and template customization guide).

## Key steps / config

1. Add an input to a template (the docs override block `base_main_inner` of `@Storefront/storefront/page/content/index.html.twig`) and add the `data-date-picker` attribute. The plugin is registered as an async plugin on selector `[data-date-picker]`, so its code is only loaded when such an element is on the page.
2. Pass options as JSON through `data-date-picker-options`, built from a Twig variable:
   ```twig
   {% sw_extends '@Storefront/storefront/page/content/index.html.twig' %}
   {% block base_main_inner %}
       {% set pickerOptions = { locale: app.request.locale, enableTime: true,
           selectors: { openButton: ".openDatePicker", closeButton: ".closeDatePicker", clearButton: ".resetDatePicker" } } %}
       <input type="text" name="customDate" value="2021-01-01T00:00:00+00:00"
              data-date-picker
              data-date-picker-options="{{ pickerOptions|json_encode|escape('html_attr') }}"/>
       {{ parent() }}
   {% endblock %}
   ```
3. `locale: app.request.locale` makes formatting follow the current Storefront language.
4. Preselect a date by setting the input's `value`.
5. `selectors.openButton` / `closeButton` / `clearButton` take DOM selectors (resolved with `document.querySelector`) that open, close or clear the picker. With `clearButton` set, the clear button is disabled while the input is empty.

### Option defaults (installed `DatePickerPlugin.options`)

| Option | Default |
|---|---|
| `dateFormat` | `'Y-m-dTH:i:S+00:00'` |
| `altFormat` | `'j. F Y, H:i'` (overridden at init, see Gotchas) |
| `altInput` | `true` (hides the original input, creates a new one) |
| `time_24hr` | `true` (overridden by the flatpickr locale) |
| `enableTime` | `true` |
| `noCalendar` | `false` |
| `weekNumbers` | `true` |
| `allowInput` | `false` |
| `minDate` / `maxDate` | `null` (inclusive bounds) |
| `locale` | `'default'` |
| `selectors` | `{ openButton: null, closeButton: null, clearButton: null }` |

## Essential identifiers

- `PluginManager` name `DatePicker`, selector `[data-date-picker]`
- `data-date-picker-options`
- `src/plugin/date-picker/date-picker.plugin` (`DatePickerPlugin`)
- `flatpickr`

## Gotchas

- Time selection is on by default (`enableTime: true`); pass `enableTime: false` for date-only.
- The docs list `allowInput` default `true`; the installed plugin defaults to `false`.
- `altFormat` and `time_24hr` from your options are replaced at init by locale-derived values: for `de` `d. F Y` / `H:i`, for `en`/default `F J, Y` / `h:i K`, otherwise `Y-m-d` / `H:i`; when `enableTime` is true only the time format is used as `altFormat`.
- With `enableTime` and `noCalendar`, time-only `minDate`/`maxDate` strings are converted to today's full date string.

## Code check (6.7.13.0)
- confirmed `DatePicker` — registered async on `[data-date-picker]`, not used in core — vendor/shopware/storefront/Resources/app/storefront/src/main.js:100
- confirmed `DatePickerPlugin` — extends Plugin, wraps flatpickr — vendor/shopware/storefront/Resources/app/storefront/src/plugin/date-picker/date-picker.plugin.js:10
- confirmed `dateFormat` — default 'Y-m-dTH:i:S+00:00' — vendor/shopware/storefront/Resources/app/storefront/src/plugin/date-picker/date-picker.plugin.js:18
- corrected `altFormat` — docs: 'j. FY, H:i'; code 'j. F Y, H:i', then replaced by getAltFormat — vendor/shopware/storefront/Resources/app/storefront/src/plugin/date-picker/date-picker.plugin.js:19
- confirmed `enableTime` — default true — vendor/shopware/storefront/Resources/app/storefront/src/plugin/date-picker/date-picker.plugin.js:22
- corrected `allowInput` — docs: default true; code false — vendor/shopware/storefront/Resources/app/storefront/src/plugin/date-picker/date-picker.plugin.js:25
- confirmed `minDate` — default null — vendor/shopware/storefront/Resources/app/storefront/src/plugin/date-picker/date-picker.plugin.js:26
- confirmed `selectors` — openButton/closeButton/clearButton default null — vendor/shopware/storefront/Resources/app/storefront/src/plugin/date-picker/date-picker.plugin.js:29
- confirmed `time_24hr` — overridden from flatpickr locale — vendor/shopware/storefront/Resources/app/storefront/src/plugin/date-picker/date-picker.plugin.js:151
- confirmed `base_main_inner` — block in content index template — vendor/shopware/storefront/Resources/views/storefront/page/content/index.html.twig:8
