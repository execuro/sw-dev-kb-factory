---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables-via-subscriber.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md
  - platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md
  - platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md
sourceHash: f0dbbfcd44b866d93d4983fc8dd62b4cf5f2e3e5
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/styling/add-scss-variables-via-subscriber.html
title: Add SCSS Variables via Subscriber
version: "6.7"
versions:
  - "6.7"
keywords: ["ThemeCompilerEnrichScssVariablesEvent", "addVariable", "getSalesChannelId", "ThemeVariableSubscriber", "SystemConfigService", "kernel.event_subscriber", "CamelCaseToSnakeCaseNameConverter", "scss variables", "theme compile", "plugin config", "sales channel", "colorpicker"]
summary: "Add SCSS variables at theme compile via a ThemeCompilerEnrichScssVariablesEvent subscriber and addVariable(), optionally from plugin config."
lastBuilt: 2026-10-21
---
## What it is

A subscriber on the theme compiler's event `Shopware\Storefront\Theme\Event\ThemeCompilerEnrichScssVariablesEvent` adds SCSS variables while the theme is compiled. The values can be hard-coded or read per sales channel from the plugin configuration. Declaring a `<css>` element in `config.xml` ([Add SCSS variables](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-scss-variables.md)) is the recommended route. Use the subscriber when you need more flexibility.

## When to use

You need computed SCSS variables, variables derived from several config fields, or transformed names and values that a plain `<css>` config element cannot express.

## Key steps / config

1. Give the variable a fallback in `<plugin root>/src/Resources/app/storefront/src/scss/base.scss`:
   ```scss
   $sass-plugin-header-bg-color: #ffcc00 !default;
   .header-main { background-color: $sass-plugin-header-bg-color; }
   ```
2. Write the subscriber (see [Listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md)). This one reads a plugin config field per sales channel:
   ```php
   use Shopware\Core\System\SystemConfig\SystemConfigService;
   use Shopware\Storefront\Theme\Event\ThemeCompilerEnrichScssVariablesEvent;

   class ThemeVariableSubscriber implements EventSubscriberInterface
   {
       public function __construct(private SystemConfigService $systemConfig) {}
       public static function getSubscribedEvents(): array
       { return [ThemeCompilerEnrichScssVariablesEvent::class => 'onAddVariables']; }
       public function onAddVariables(ThemeCompilerEnrichScssVariablesEvent $event): void
       {
           $color = $this->systemConfig->get('SwagBasicExample.config.sassPluginHeaderBgColor', $event->getSalesChannelId());
           if ($color) { $event->addVariable('sass-plugin-header-bg-color', $color); }
       }
   }
   ```
3. Register it in `src/Resources/config/services.php`: `$services->set(ThemeVariableSubscriber::class)->args([service(SystemConfigService::class)])->tag('kernel.event_subscriber');`
4. The config field is a normal `config.xml` input ([plugin configuration](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-plugin-configuration.md)), e.g. `<input-field type="colorpicker">` with `<name>sassPluginHeaderBgColor</name>` and an optional `<defaultValue>`. The schema is `https://raw.githubusercontent.com/shopware/shopware/trunk/src/Core/System/SystemConfig/Schema/config.xsd`.

`addVariable(string $name, string $value, bool $sanitize = false)`:
- `$name`: variable name without `$` (added automatically). Use kebab-case with a plugin or company prefix.
- `$value`: the raw SCSS value.
- `$sanitize`: when `true`, the value is escaped with `addslashes()` and wrapped in single quotes, for string values. Leave it off for colors and sizes.

To expose every config field, loop over `$this->systemConfig->get('SwagBasicExample.config', $event->getSalesChannelId())`. Convert each key to kebab-case with `Symfony\Component\Serializer\NameConverter\CamelCaseToSnakeCaseNameConverter` plus `str_replace('_', '-', ...)`.

## Essential identifiers

- `Shopware\Storefront\Theme\Event\ThemeCompilerEnrichScssVariablesEvent`
- `addVariable()`, `getSalesChannelId()`, `getVariables()`, `getContext()`
- `Shopware\Core\System\SystemConfig\SystemConfigService::get()`
- `kernel.event_subscriber`

## Gotchas

- The second code sample in the docs imports `Shopware\Storefront\Event\ThemeCompilerEnrichScssVariablesEvent`. That class does not exist. The event lives in `Shopware\Storefront\Theme\Event`.
- Without plugin config the variables are global. Plugins are not sales-channel specific, so a hard-coded variable is available to all themes and Storefront sales channels. Use `getSalesChannelId()` with config values to vary them per sales channel.
- `addVariable()` accepts `string` values only. When looping over all config fields, skip or cast non-string values such as booleans, ints and arrays, or a `TypeError` is raised under `strict_types`.
- Changes take effect only after the theme is recompiled.

## Code check (6.7.15.1)
- absent `Shopware\Storefront\Event\ThemeCompilerEnrichScssVariablesEvent` — wrong namespace in the docs' second sample; real class is in `Theme\Event`
- confirmed `ThemeCompilerEnrichScssVariablesEvent` — namespace `Shopware\Storefront\Theme\Event` — vendor/shopware/storefront/Theme/Event/ThemeCompilerEnrichScssVariablesEvent.php:11
- corrected `ThemeCompilerEnrichScssVariablesEvent::addVariable()` — docs: sanitize removes special characters; code addslashes() and single-quotes the value — vendor/shopware/storefront/Theme/Event/ThemeCompilerEnrichScssVariablesEvent.php:23
- confirmed `ThemeCompilerEnrichScssVariablesEvent::getSalesChannelId()` — returns the compiled sales channel id — vendor/shopware/storefront/Theme/Event/ThemeCompilerEnrichScssVariablesEvent.php:40
- confirmed `SystemConfigService::get()` — `(string $key, ?string $salesChannelId = null)` — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:60
- confirmed `colorpicker` — valid input-field type — vendor/shopware/core/System/SystemConfig/Schema/config.xsd:55
- confirmed `ThemeCompilerEnrichScssVarSubscriber::enrichExtensionVars()` — core subscriber that maps `<css>` config to variables — vendor/shopware/storefront/Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:42
- unverified `CamelCaseToSnakeCaseNameConverter` — vendor/symfony, out of scope
