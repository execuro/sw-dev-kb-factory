# `dev-31` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-31` · `dev` · `Storefront` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2117-22-31` |
| Core version | `6.7.13.0` |

**Query:** How do I expose a plugin configuration value, such as a colour picked in the Administration, as an SCSS variable in my Storefront styling?

**Expected answer — every fact an answer must contain:**

1. The `config.xml` `<input-field>` carries a `<css>` child naming the SCSS variable, e.g. `<css>sass-plugin-header-bg-color</css>`; core's own `ThemeCompilerEnrichScssVarSubscriber` — registered out of the box, so the plugin needs no listener of its own — resolves the `<TechnicalName>.config` domain per sales channel and emits `$<css value>: <stored value or defaultValue>;` into `theme-variables.scss` during theme compilation, so the value only takes effect after a theme recompile. In 6.7 this is still the whole answer for plugin config: `ThemeConfigValueAccessor::getCssVarValues()` reads only merged `theme.json` fields, so a plugin `<css>` value never becomes a `--custom-property`. `[code: storefront: Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:42-79, Theme/ThemeCompiler.php:674-681,694-747, DependencyInjection/theme.php:420-425, Theme/ThemeConfigValueAccessor.php:60-78]`
2. `hasCssValue()` skips the element unless `config.css` is set **and** the resolved value (or `defaultValue`) is a **string**. A `type="colorpicker"` field satisfies this — `ConfigReader` casts it with the `default => (string) $value` arm and the Administration stores a colour string (`#rrggbb[aa]`, or `rgba(…)`/`hsl(…)`), so the query's colour case works; a `bool`/`checkbox` field does not — it is cast to a PHP bool and silently dropped, with no 0/1 conversion on this route. PR 13584 ("Allow boolean field types in SCSS validation") changed only `SCSSValidator`, which runs on the `theme.json` route, so in 6.7.13.0 bool config fields are still skipped here. `[code: storefront: Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:82-101; System/SystemConfig/Util/ConfigReader.php:257-273; System/SystemConfig/Service/ConfigurationService.php:196-211]`
3. The plugin must declare its own fallback with `!default` in `<plugin root>/src/Resources/app/storefront/src/scss/base.scss` (e.g. `$sass-plugin-header-bg-color: #ffcc00 !default;`), because the dumped variables are concatenated **before** all bundle styles; an empty value is emitted as the SCSS literal `null`. The `<css>` flag exists from Shopware 6.4.13.0 onward. `[code: storefront: Theme/ThemeCompiler.php:597,617-620,674-681; shopware/shopware changelog/release-6-4-13-0/2022-03-28-allow-plugin-config-scss-vars.md]`

**Trap:** Values on the `<css>` route are **not** validated or sanitised. `SCSSValidator` has exactly three call sites, all on the `theme.json` route, and the enrich event is dispatched *after* that validation loop; `addVariable()` writes the value verbatim unless the caller passes `$sanitize = true`, which the core subscriber does not.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/storefront/styling/add-scss-variables.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Core ships a subscriber turning plugin `config.xml` fields into SCSS variables: for every storefront plugin configuration it resolves the domain `<technicalName>.config` and, for each element declaring a `css` key, calls `addVariable(<css value>, <value or defaultValue>)`. | `storefront: Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:42-79` | `$event->addVariable($element['config']['css'], $element['value'] ?? $element['defaultValue']);` |
| The field is skipped unless `config.css` is set **and** the resolved value (or defaultValue) is a **string**. | `storefront: Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:82-101` | `if (!\is_string($element['value'] ?? $element['defaultValue'])) { return false; }` |
| `ConfigReader` casts config values per type; only bool/checkbox, int, float and multi-select have a cast arm — everything else, colorpicker included, falls through to `(string) $value`. | `System/SystemConfig/Util/ConfigReader.php:257-273` | `self::INPUT_TYPE_BOOL, self::INPUT_TYPE_CHECKBOX => (bool) $value, … default => (string) $value,` |
| `ConfigurationService::enrichValues()` sets `$element['value']` to the stored system_config value, falling back to `defaultValue` and then `''` — a string for a colorpicker field, so `hasCssValue()` returns true. | `System/SystemConfig/Service/ConfigurationService.php:196-211` | `$element['value'] = $this->systemConfigService->get($element['name'], $salesChannelId) ?? $element['config']['defaultValue'] ?? '';` |
| The Administration treats `colorpicker` as a string-valued field (empty value `''`), rendering `mt-colorpicker`/`sw-colorpicker`. | `administration: src/module/sw-settings/component/sw-system-config/index.js:356-368` | `case 'colorpicker': … { return ''; }` |
| The emitted colour string is `#rrggbb[aa]` hex or a legacy `rgba(…)`/`hsl(…)` string depending on `colorOutput`; with the default `auto` it is hex when alpha is 1, `rgba(…)` otherwise. Never a structure, never a number. | `administration: src/app/component/form/sw-colorpicker-deprecated/index.js:228-247, :611` | `case 'auto': { return this.alphaValue < 1 ? this.rgbValue : this.hexValue; }` … ``rgbValue.string = `rgba(${red}, ${green}, ${blue}, ${alpha})`;`` |
| `css` reaches `$element['config']['css']` because `ConfigurationService::getConfiguration()` moves every element key except `name`/`type` under `config`, and `ConfigReader` copies unknown `<input-field>` children verbatim. | `System/SystemConfig/Service/ConfigurationService.php:73-89`; `System/SystemConfig/Util/ConfigReader.php:249-251` | `unset($field['type'], $field['name']); $newField['config'] = $field;` … `$elementData[$option->nodeName] = $option->nodeValue;` |
| A `<css>` child is schema-legal only through a lax wildcard in the XSD. | `System/SystemConfig/Schema/config.xsd:33-39` | `<xs:any processContents="lax" minOccurs="0" maxOccurs="unbounded"/>` |
| `StorefrontPluginRegistry::getConfigurations()` includes every registered Shopware `Bundle`, so a plain plugin — not only a theme — is scanned. | `storefront: Theme/StorefrontPluginRegistry.php:73-96` | `foreach ($this->kernel->getBundles() as $bundle) { if (!$bundle instanceof Bundle) { continue; }` |
| The event is `Shopware\Storefront\Theme\Event\ThemeCompilerEnrichScssVariablesEvent`, with `addVariable(string $name, string $value, bool $sanitize = false)`; `$sanitize` wraps in single quotes and `addslashes()`. | `storefront: Theme/Event/ThemeCompilerEnrichScssVariablesEvent.php:16-38` | `$this->variables[$name] = '\'' . addslashes($value) . '\'';` |
| The event is dispatched from `ThemeCompiler::dumpVariables()`; the map is written to `theme-variables.scss`. | `storefront: Theme/ThemeCompiler.php:726-747` | `$this->eventDispatcher->dispatch($themeVariablesEvent);` … `$this->tempFilesystem->write('theme-variables.scss', $dump);` |
| Each variable is emitted as `$<name>: <value>;`; an unset/empty value becomes the SCSS literal `null`. | `storefront: Theme/ThemeCompiler.php:674-681` | `sprintf('$%s: %s;', $key, isset($value) && $value !== '' ? $value : 'null')` |
| Variables are prepended **before** all bundle styles, so a local fallback must use `!default`. | `storefront: Theme/ThemeCompiler.php:597,617-620` | `$features . $variables . $concatenatedStyles` |
| For a **theme**, the second route is `theme.json` config fields: each becomes a variable named after its key unless it declares `"scss": false`; switch/checkbox become 0/1. | `storefront: Theme/ThemeCompiler.php:688-724` | `(\array_key_exists('scss', $data) && $data['scss'] === false)` … `$variables[$key] = (int) $data['value'];` |
| `SCSSValidator` exists in 6.7.13.0 as a static class dispatching per field type (checkbox/switch/boolean/bool, color, fontFamily, text); textarea/url/media are deliberately not validated. | `storefront: Theme/Validator/SCSSValidator.php:13-45` | `'checkbox', 'switch', 'boolean', 'bool' => self::validateTypeCheckbox($data['value']), 'color' => self::validateTypeColor(…)` |
| It has exactly three call sites, all on the theme-config route: `ThemeService::validateThemeConfig()`, `ThemeCompiler::dumpVariables()` over `$config['fields']` (only when built with `$validate = true`), and `ThemeController::validateVariables()`. | `storefront: Theme/ThemeService.php:309, Theme/ThemeCompiler.php:704, Theme/Controller/ThemeController.php:207` | `ThemeCompiler.php:704: $data['value'] = SCSSValidator::validate($this->scssCompiler, $data, $this->customAllowedRegex, true);` |
| In `dumpVariables()` the validation loop finishes **before** `ThemeCompilerEnrichScssVariablesEvent` is dispatched, and the core subscriber calls `addVariable()` without `$sanitize`, so plugin `<css>` values reach `theme-variables.scss` unvalidated and unsanitised. | `storefront: Theme/ThemeCompiler.php:694-737`; `Theme/Event/ThemeCompilerEnrichScssVariablesEvent.php:23-29` | `if ($this->validate) { $data['value'] = SCSSValidator::validate(…); }` … `$this->eventDispatcher->dispatch($themeVariablesEvent);` |
| Compile-time validation is off by default: the `ThemeCompiler` constructor defaults `$validate` to false and `storefront.theme.validate_on_compile` is `defaultFalse()`. | `storefront: DependencyInjection/Configuration.php:36, DependencyInjection/theme.php:131, Theme/ThemeCompiler.php:69` | `->booleanNode('validate_on_compile')->defaultFalse()->end()` … `private readonly bool $validate = false,` |
| PR 13584 (commit `3beaf0f4`, "fix: Allow boolean field types in SCSS validation") changed exactly one production line — the match arm in `SCSSValidator::validate` — and did not touch `ThemeCompilerEnrichScssVarSubscriber`. | `https://api.github.com/repos/shopware/shopware/commits/3beaf0f4` | `-'checkbox', 'switch' => …` / `+'checkbox', 'switch', 'boolean', 'bool' => …` |
| Issues 11526 (→ 6.7.3.0) and 12947 (→ 6.7.4.0) were fixed on the `SCSSValidator` route only; the 6.7.13.0 file returns the original colour function and accepts modern `rgb()`/`hsl()` syntax. | `shopware/shopware changelog/release-6-7-3-0/2025-09-24-fix-scss-validaor-to-save-color-functions.md`, `changelog/release-6-7-4-0/2025-10-14-improve-scss-color-validation.md`; `storefront: Theme/Validator/SCSSValidator.php:92-104` | `if ((str_starts_with($value, 'hsl') && !self::isHSL($value)) …) { throw ThemeException::InvalidScssValue(…); }` |
| 6.7 also emits **theme** config values as native CSS custom properties via `ThemeConfigValueAccessor::getCssVarValues()`, excluded by the same `scss: false` switch; switch/checkbox become 0/1, media/url are wrapped in `url('…')`, SCSS-only functions are skipped. | `storefront: Theme/ThemeConfigValueAccessor.php:60-145` | `(\array_key_exists('scss', $data) && $data['scss'] === false) { continue; }` |
| Those custom properties are rendered by `theme_css_vars()` into an inline `<style> :root { … }` block in the head. | `storefront: Framework/Twig/TemplateConfigAccessor.php:114-117`; `Resources/views/storefront/layout/meta.html.twig:143-153` | `{% block layout_head_theme_css_vars %}` … `--{{ key\|raw }}: {{ value\|raw }};` |
| The `<css>` flag was introduced in 6.4.13.0, together with `ThemeCompilerEnrichScssVarSubscriber`, the enrich event and `ConfigurationService::getResolvedConfiguration()`. | `shopware/shopware changelog/release-6-4-13-0/2022-03-28-allow-plugin-config-scss-vars.md` (sha `e27518a9`) | "Now you can declare a config field in your plugin `config.xml` to be available as scss variable. The new tag is `<css>`…" |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| The exported SCSS variable name is derived from the config field name | absent | The name is taken verbatim from the `<css>` element's content; the field's own name is never used. Without `<css>` the field is skipped. `storefront: Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:77` |
| `css` is a declared element in the plugin config XSD | absent | No `css` in `config.xsd`; accepted only through `<xs:any processContents="lax">` and read generically by `ConfigReader`. `System/SystemConfig/Schema/config.xsd:33-37` |
| Plugin config values reach SCSS without a theme recompile | absent | The only path writing these variables is `ThemeCompiler::dumpVariables()`, run during theme compilation. `storefront: Theme/ThemeCompiler.php:688-747` |
| `SCSSValidator` (or any sanitiser) runs on the plugin `config.xml` `<css>` path | absent | Grep returns only three call sites, all theme-config; the subscriber neither imports nor calls it and passes no `$sanitize`. `storefront: Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:1-102` |
| PR 13584 / issue 13290 made bool or switch plugin config fields usable with `<css>` | absent | The commit touches only `SCSSValidator.php` and its test; `hasCssValue()`'s `\is_string()` guard is unchanged in 6.7.13.0. `storefront: Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:96-98` |
| Plugin `<css>` variables become CSS custom properties in 6.7 | absent | `getCssVarValues()` reads only `ThemeRuntimeConfig::$resolvedConfig['fields']`, filled from `getPlainThemeConfiguration()` (theme.json). `storefront: Theme/ThemeConfigValueAccessor.php:60-78`; `Theme/ThemeRuntimeConfigService.php:140` |
| A changelog entry records the issue-13290 boolean fix | absent | Code search over `changelog/` for 13290 and for the fix title returns nothing; traceable only through commit `3beaf0f4`. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| The active unit test of the plugin-config `<css>` subscriber covers the no-storefront-plugin short circuit, DBAL exception silencing and the corrupt-element case `hasCssValue()` guards — but has no bool-valued case and none asserting an emitted colour. | `shopware/shopware @ v6.7.13.0, tests/unit/Storefront/Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriberTest.php:96-128` |
| The data-provider cases PR 13584 added, showing the `boolean`/`bool` types the validator now accepts (theme-config route only). | `shopware/shopware, tests/unit/Storefront/Theme/Validator/SCSSValidatorTest.php @ 3beaf0f4` |
| _The dist tree strips the Storefront theme tests, so no in-vendor anchor exists._ | `vendor/shopware/storefront/Test/Theme` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Theme/plugin config fields of type bool/switch with `scss` enabled always compiled to true; toggling off fell back to the `base_config` default. Fixed by PR 13584. | 6.7.3.1 | closed | https://github.com/shopware/shopware/issues/13290 |
| Merged core fix: "Allow boolean field types in SCSS validation". | 6.7 | merged | https://github.com/shopware/shopware/pull/13584 |
| The `SCSSValidator` converts/miscalculates SCSS functions (`hsl()`, `rgba()`), so a value entered in the Administration does not arrive intact and compilation fails. | 6.6/6.7 | closed | https://github.com/shopware/shopware/issues/11526 |
| Theme compile fails with `hsl()`/`rgba()` errors after an SCSS validator update. | 6.x | closed | https://github.com/shopware/shopware/issues/12947 |
| The try/catch around `ThemeCompilerEnrichScssVariablesEvent` swallows failures in a variable-adding subscriber. | 6.4-era | closed | https://github.com/shopware/shopware/issues/3007 |
| Open story to replace the PHP SCSS compiler with the dart-sass port; SCSS config plumbing under rework. | 6.7 / trunk | open | https://github.com/shopware/shopware/issues/15159 |
| Docs issue asking for JavaScript examples on "use-plugin-configuration". | unclear | closed | https://github.com/shopware/docs/issues/1721 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `ThemeCompilerEnrichScssVariablesEvent` still exist and is it still dispatched in 6.7? | code | Yes — `storefront: Theme/Event/ThemeCompilerEnrichScssVariablesEvent.php`, dispatched by `ThemeCompiler::dumpVariables()` (`ThemeCompiler.php:726-747`). Namespace is `Shopware\Storefront\Theme\Event\`. |
| What is the subscriber API, and does the event carry the sales channel id? | code | `addVariable(string $name, string $value, bool $sanitize = false)`; the event carries `salesChannelId` and `Context`. `ThemeCompilerEnrichScssVariablesEvent.php:16-38` |
| Is plugin config automatically exposed, or does it require a subscriber? | code | Automatic — `ThemeCompilerEnrichScssVarSubscriber` is a registered `kernel.event_subscriber` scanning every bundle's `<technicalName>.config`. `theme.php:420-425` |
| Is the `$` prefix added automatically? | code | Yes — variables are emitted as `$<name>: <value>;`. `ThemeCompiler.php:674-681` |
| How does the sanitiser treat a colour-picker, a bool/switch and an arbitrary string value? | deep code | `SCSSValidator` never runs on the `<css>` route — three call sites, all theme-config, and the validation loop completes before the event is dispatched. `<css>` values are written verbatim. `SCSSValidator.php:13-45`; `ThemeCompiler.php:694-737` |
| Does a colour-picker field store a string usable directly as an SCSS value? | deep code | Yes — `ConfigReader` casts it via `default => (string) $value`, and the Administration emits `#rrggbb[aa]` or `rgba(…)`. `ConfigReader.php:257-273`; `sw-colorpicker-deprecated/index.js:228-247` |
| After PR 13584, are bool/switch plugin config fields still skipped on the `<css>` route? | deep code | Still skipped — the commit changed only the `SCSSValidator` match arm; `hasCssValue()`'s `\is_string()` guard is untouched. `3beaf0f4`; `ThemeCompilerEnrichScssVarSubscriber.php:96-98` |
| Does 6.7 also emit config values as native CSS custom properties, and is `scss: false` the switch? | deep code | Yes for **theme** config, same `scss: false` exclusion, rendered via `theme_css_vars()`. Plugin `<css>` values are not covered. `ThemeConfigValueAccessor.php:60-145`; `TemplateConfigAccessor.php:114-117` |
| Was the `css` flag introduced in 6.4.13.0? | deep code | Yes — upstream changelog `release-6-4-13-0/2022-03-28-allow-plugin-config-scss-vars.md`. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| A plugin config field is exposed by adding a `<css>` tag inside the input-field, whose value is the SCSS variable name. | "The new tag is `<css>` and takes the name of the scss variable as its value." | `docs/.../styling/add-scss-variables.md` | yes — `ThemeCompilerEnrichScssVarSubscriber.php:42-79` |
| The `css` flag is available from 6.4.13.0. | "The configuration flag `css` is available from Shopware Version 6.4.13.0" | same | yes — `changelog/release-6-4-13-0/2022-03-28-allow-plugin-config-scss-vars.md` |
| The `config.xml` route is recommended; the subscriber route is for more flexibility. | "We recommend using the declaration of SCSS variables via the `config.xml`." | same | guidance, not a code fact |
| A `!default` fallback must be declared in the plugin's `base.scss`. | "you should provide a fallback value for your custom SCSS variable in your plugin `base.scss`" | same | yes — variables are prepended before bundle styles. `ThemeCompiler.php:597,617-620` |
| The variable takes the Administration value, falling back to `defaultValue`; the theme must be recompiled manually. | "**When this value is changed you still have to recompile the theme manually…**" | same | yes — `$element['value'] ?? $element['defaultValue']`; `ThemeCompiler.php:688-747` |
| The alternative route is a subscriber on `ThemeCompilerEnrichScssVariablesEvent` calling `$event->addVariable()`. | "The subscriber listens to the `ThemeCompilerEnrichScssVariablesEvent`." | `docs/.../styling/add-scss-variables-via-subscriber.md` | yes — `ThemeCompiler.php:726-747` |
| `addVariable()` takes `$name`, `$value`, optional `$sanitize`; the `$` prefix is added automatically. | "The variable prefix `$` will be added automatically." | same | yes — `ThemeCompilerEnrichScssVariablesEvent.php:16-38`, `ThemeCompiler.php:674-681` |
| `$sanitize` removes special characters and adds quotes. | "Optional parameter to remove special characters from the variables value." | same | partly — code quotes and `addslashes()`; nothing is removed |
| Subscriber-added variables are global across all themes and sales channels. | "Your SCSS variables … will be globally available throughout all themes and Storefront sales channels." | same | contradicted for the `config.xml` route — resolved per `salesChannelId`. `ThemeCompilerEnrichScssVarSubscriber.php:54-58` |
| Per-sales-channel values are read with `SystemConfigService::get('<Plugin>.config.<field>', $event->getSalesChannelId())`. | "$this->systemConfig->get('SwagBasicExample.config.sassPluginHeaderBgColor', $event->getSalesChannelId());" | same | the event does carry `getSalesChannelId()`; the manual read is unnecessary on the `<css>` route |
| A colour is picked with an `<input-field type="colorpicker">` rendered by `sw-colorpicker`. | "we add an input field of the type colorpicker for our plugin" | same | yes — `sw-system-config/index.js:356-368`; the stored value is a colour string |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The subscriber page imports the event from two namespaces on the same page: `Shopware\Storefront\Theme\Event\…` and `Shopware\Storefront\Event\…`, both presented as correct. | Only `Shopware\Storefront\Theme\Event\ThemeCompilerEnrichScssVariablesEvent` exists; the second sample's import is wrong. | `storefront: Theme/Event/ThemeCompilerEnrichScssVariablesEvent.php:16-38` |
| `$sanitize` "removes special characters" from the value. | It wraps the value in single quotes and runs `addslashes()` — it escapes, it does not remove. | `storefront: Theme/Event/ThemeCompilerEnrichScssVariablesEvent.php:16-38` |
| Variables from a plugin are "globally available throughout all themes and Storefront sales channels". | The core subscriber resolves each plugin's config per `salesChannelId`, so `<css>`-declared values are per sales channel without any plugin subscriber. | `storefront: Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:54-58` |
| The pages do not state that the field's value type matters. | The field is silently skipped unless the resolved value (or defaultValue) is a **string** — bool/checkbox fields never reach SCSS on this route. | `storefront: Theme/Subscriber/ThemeCompilerEnrichScssVarSubscriber.php:82-101`; `System/SystemConfig/Util/ConfigReader.php:257-273` |
| `<css>` is presented as "the new tag" of the config schema. | It is not in `config.xsd`; it passes only through the `<xs:any processContents="lax">` wildcard and is read generically. | `System/SystemConfig/Schema/config.xsd:33-39` |
| Neither page mentions validation or sanitisation of the exposed value. | `SCSSValidator` never runs on this route: three call sites, all theme-config, and the loop completes before the enrich event; `addVariable()` is called without `$sanitize`. | `storefront: Theme/ThemeCompiler.php:694-737`; `Theme/Validator/SCSSValidator.php:13-45` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The `config.xml` `<input-field>` carries a `<css>` tag naming the SCSS variable, e.g. `<css>sass-plugin-header-bg-color</css>`, and its `<defaultValue>` is used when the merchant has set nothing. | rewritten | Correct but incomplete: it omitted that core's registered `ThemeCompilerEnrichScssVarSubscriber` does the work per sales channel at compile time, and that in 6.7 the plugin route yields a SCSS variable only, never a CSS custom property. |
| A fallback must be declared with `!default` in `<plugin root>/src/Resources/app/storefront/src/scss/base.scss`, e.g. `$sass-plugin-header-bg-color: #ffcc00 !default;`. | kept, extended | Confirmed by `ThemeCompiler.php:597,617-620`; extended with the empty-value → `null` emission. |
| The `css` configuration flag requires Shopware 6.4.13.0 or later, and changing the value still requires recompiling the theme before it takes effect. | rewritten | Both halves confirmed, but split: the recompile requirement belongs with fact 1 (the compile-time dispatch), the 6.4.13.0 availability with fact 3. |
| _new_ | added | The `\is_string()` guard in `hasCssValue()` is load-bearing and was missing: it is what makes the query's colour case work and what silently drops bool fields, including after PR 13584. |
