---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-scss-variables-via-subscriber.md
title: Add SCSS variables via Subscriber
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-scss-variables-via-subscriber.html
sourceHash: 541157e21c378b21da56ad64e18c0cd275bd41d7
keywords: ["ThemeCompilerEnrichScssVariablesEvent", "addVariable", "SystemConfigService", "scss variable subscriber", "sass-plugin-header-bg-color", "CamelCaseToSnakeCaseNameConverter", "sales channel config", "kernel.event_subscriber", "config.xml"]
summary: How to expose SCSS variables via a subscriber on ThemeCompilerEnrichScssVariablesEvent, including per-sales-channel config values.
lastBuilt: 2026-09-15
---
## What it is

Explains adding SCSS variables to a plugin theme via a subscriber, as a more flexible alternative to declaring them in `config.xml`.

## When to use

When SCSS variables must be set programmatically, e.g. with per-sales-channel values, rather than statically via `config.xml`.

## Key steps / config

Provide a `!default` fallback in `base.scss`:

```css
$sass-plugin-header-bg-color: #ffcc00 !default;
```

Subscribe to `ThemeCompilerEnrichScssVariablesEvent` and call `addVariable($name, $value, $sanitize = false)`:

```php
class ThemeVariableSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [ThemeCompilerEnrichScssVariablesEvent::class => 'onAddVariables'];
    }

    public function onAddVariables(ThemeCompilerEnrichScssVariablesEvent $event): void
    {
        $event->addVariable('sass-plugin-header-bg-color', '#59ccff');
    }
}
```

To read plugin config per sales channel, inject `SystemConfigService` and call `$this->systemConfig->get('SwagBasicExample.config.sassPluginHeaderBgColor', $event->getSalesChannelId())`. Loop over `$this->systemConfig->get('SwagBasicExample.config', $event->getSalesChannelId())` to convert all config fields, using `CamelCaseToSnakeCaseNameConverter` to turn `customVariableName` into `custom-variable-name`.

## Essential identifiers

- `ThemeCompilerEnrichScssVariablesEvent`
- `addVariable()`
- `SystemConfigService::get()`
- `getSalesChannelId()`
- `CamelCaseToSnakeCaseNameConverter`

## Gotchas

Plugins are not sales-channel specific by default: SCSS variables added this way are compiled globally across all themes/sales channels unless read from a per-sales-channel plugin config value. The `$` variable prefix is added automatically — do not include it in the name; kebab-case is recommended, and using `$sanitize` strips special characters and wraps the value in quotes.
