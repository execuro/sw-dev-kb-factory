---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables-via-subscriber.md
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md"]
sourceHash: f0dbbfcd44b866d93d4983fc8dd62b4cf5f2e3e5
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/styling/add-scss-variables-via-subscriber.html
title: Add SCSS Variables via Subscriber
version: "6.7"
versions: ["6.7"]
keywords: ["ThemeCompilerEnrichScssVariablesEvent", "addVariable", "getSalesChannelId", "SystemConfigService", "ThemeVariableSubscriber", "kernel.event_subscriber", "CamelCaseToSnakeCaseNameConverter", "config.xml", "scss variables", "sass variables", "theme compile", "event subscriber", "per sales channel styling"]
summary: "Plugin subscriber on ThemeCompilerEnrichScssVariablesEvent calling addVariable() to inject SCSS variables, optionally per sales channel via plugin config."
lastBuilt: 2026-09-15
---
## What it is

How a plugin injects SCSS variables into the Storefront theme compilation with an event subscriber instead of declaring them in `config.xml`. The subscriber receives the theme compiler's enrich-variables event and calls `addVariable()` on it; values can come from hard-coded strings or from plugin configuration read per sales channel.

## When to use

- The `config.xml`-based declaration (see [Add SCSS variables](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md)) is the recommended way; use a subscriber only when you need more flexibility (computed values, looping over config fields, conditional variables).
- You need a variable value that differs per Storefront sales channel.

## Key steps / config

1. Give the variable a fallback in the plugin's `src/Resources/app/storefront/src/scss/base.scss`, e.g. `$sass-plugin-header-bg-color: #ffcc00 !default;`. The subscriber value overrides it once the plugin is installed and active.
2. Create a subscriber (example name `ThemeVariableSubscriber`) implementing `EventSubscriberInterface` and subscribe to `Shopware\Storefront\Theme\Event\ThemeCompilerEnrichScssVariablesEvent` (see [Listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md)):

```php
use Shopware\Storefront\Theme\Event\ThemeCompilerEnrichScssVariablesEvent;

public static function getSubscribedEvents(): array
{
    return [ThemeCompilerEnrichScssVariablesEvent::class => 'onAddVariables'];
}

public function onAddVariables(ThemeCompilerEnrichScssVariablesEvent $event): void
{
    $event->addVariable('sass-plugin-header-bg-color', '#59ccff');
}
```

3. Register it in `src/Resources/config/services.php` with `->tag('kernel.event_subscriber')`; to read config, add `->args([service(SystemConfigService::class)])`.
4. `addVariable(string $name, string $value, bool $sanitize = false)`:
   - `$name` — used exactly as given, `$` prefix added automatically; kebab-case and a plugin/company prefix are recommended.
   - `$value` — string assigned to the variable.
   - `$sanitize` — when `true`, the installed code escapes the value with `addslashes()` and wraps it in single quotes (useful for arbitrary strings; not needed for hex colours).
5. Per-sales-channel values: add a field to `config.xml` (schema `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/SystemConfig/Schema/config.xsd`), e.g. `<input-field type="colorpicker">` with `<name>sassPluginHeaderBgColor</name>` and optional `<defaultValue>`, inject `Shopware\Core\System\SystemConfig\SystemConfigService`, then:

```php
$color = $this->systemConfig->get('SwagBasicExample.config.sassPluginHeaderBgColor', $event->getSalesChannelId());
if ($color) {
    $event->addVariable('sass-plugin-header-bg-color', $color);
}
```

6. All config fields at once: `get('SwagBasicExample.config', $salesChannelId)` returns the field map; loop it, convert keys with `Symfony\Component\Serializer\NameConverter\CamelCaseToSnakeCaseNameConverter` and `str_replace('_', '-', ...)` to kebab-case, and call `addVariable()` per entry.

## Essential identifiers

- `Shopware\Storefront\Theme\Event\ThemeCompilerEnrichScssVariablesEvent` — `addVariable()`, `getVariables()`, `getSalesChannelId()`, `getContext()`
- `Shopware\Core\System\SystemConfig\SystemConfigService::get()`
- `kernel.event_subscriber`
- `SwagBasicExample.config.<fieldName>` (dot-notation config key)
- `CamelCaseToSnakeCaseNameConverter`

## Gotchas

- Plugins are not sales-channel specific: variables added without a sales-channel lookup are global to all themes and Storefront sales channels.
- The source's second and third snippets import `Shopware\Storefront\Event\ThemeCompilerEnrichScssVariablesEvent`, which does not exist in 6.7.13.0; the class lives under `Shopware\Storefront\Theme\Event\`.
- The docs describe `$sanitize` as removing special characters; the code escapes (`addslashes`) and quotes instead.
- `addVariable()` takes `string $value`; when looping over all config fields, non-string values (booleans, numbers, arrays) must be cast or skipped under `strict_types`.
- camelCase config names become camelCase SCSS names unless converted.

## Code check (6.7.13.0)
- absent `Shopware\Storefront\Event\ThemeCompilerEnrichScssVariablesEvent` — namespace used in the docs' config snippets; real class is `Shopware\Storefront\Theme\Event\ThemeCompilerEnrichScssVariablesEvent`
- confirmed `Shopware\Storefront\Theme\Event\ThemeCompilerEnrichScssVariablesEvent` — class declaration — vendor/shopware/storefront/Theme/Event/ThemeCompilerEnrichScssVariablesEvent.php:11
- confirmed `ThemeCompilerEnrichScssVariablesEvent::addVariable()` — signature `(string $name, string $value, bool $sanitize = false)` — vendor/shopware/storefront/Theme/Event/ThemeCompilerEnrichScssVariablesEvent.php:23
- corrected `$sanitize` — docs: removes special characters; code applies `addslashes()` and wraps in single quotes — vendor/shopware/storefront/Theme/Event/ThemeCompilerEnrichScssVariablesEvent.php:26
- confirmed `ThemeCompilerEnrichScssVariablesEvent::getVariables()` — returns the variable map — vendor/shopware/storefront/Theme/Event/ThemeCompilerEnrichScssVariablesEvent.php:35
- confirmed `ThemeCompilerEnrichScssVariablesEvent::getSalesChannelId()` — returns string sales channel id — vendor/shopware/storefront/Theme/Event/ThemeCompilerEnrichScssVariablesEvent.php:40
- confirmed `ThemeCompilerEnrichScssVariablesEvent` — dispatched by the theme compiler before dumping variables — vendor/shopware/storefront/Theme/ThemeCompiler.php:731
- confirmed `SystemConfigService::get()` — `(string $key, ?string $salesChannelId = null)` — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:59
- confirmed `colorpicker` — valid `input-field` type in config.xsd — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:55
- unverified `kernel.event_subscriber` — Symfony tag, vendor/symfony out of scope
