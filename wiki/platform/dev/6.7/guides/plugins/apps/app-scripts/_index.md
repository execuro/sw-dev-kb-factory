---
id: platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md
title: App Scripts
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-scripts/
sourceHash: 7feda38c0c22f96f36a3c98676cc81ffdb498e60
codeCheckedAgainst: "6.7.15.1"
keywords: ["app scripts", "script hooks", "Resources/scripts", "twig", "ServiceStubs", "sw_macro_function", "interface hooks", "cache_key", "foreach", "intval", "debug.dump", "product-page-loaded", "sandboxed twig"]
summary: "App scripts: sandboxed Twig files in Resources/scripts/<hook>/ run on script hooks; includes, interface hooks, extended syntax, services, debugging."
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-translations.md
---
## What it is

App scripts are Twig files executed in a sandboxed environment inside the Shopware execution stack. Each script is registered to a "hook"; when the hook fires, the script gets the hook's data plus a set of pre-defined services and can react to or manipulate that data. Available since Shopware 6.4.8.0.

## When to use

When an app needs server-side logic without its own backend — loading extra data into Storefront pages, manipulating the cart, custom API endpoints. The full hook list with data and services per hook is in the script hooks reference.

## Key steps / config

1. Place scripts under `Resources/scripts` of the app. Create one subdirectory per hook, named exactly like the hook; each `.twig` file in it runs when the hook is triggered (multiple scripts per hook allowed).

```text
DemoApp/
  manifest.xml
  Resources/scripts/
    product-page-loaded/my-first-script.twig
    cart/first-cart-script.twig
    include/media-repository.twig
```

2. Reusable code: put macros in the `include` folder and import them. Declare them with the `sw_macro_function` tag; `return` hands a value back to the caller:

```twig
{# Resources/scripts/include/media-repository.twig #}
{% sw_macro_function getById(mediaId) %}
    {% return services.repository.search('media', { 'ids': [ mediaId ] }).first %}
{% end_sw_macro_function %}

{# Resources/scripts/cart/first-cart-script.twig #}
{% import "include/media-repository.twig" as mediaRepository %}
{% set mediaEntity = mediaRepository.getById(myMediaId) %}
```

3. Interface hooks (e.g. the Store API hook) define functions; implement each as a Twig block named after the function, e.g. `{% block cache_key %}` (optional — without it the endpoint is not cached) and `{% block response %}` (required — missing it is an error). Each block gets its own data and services.
4. Translations: use the `|trans` filter, e.g. `'my.snippet.key'|trans` (Storefront snippet mechanism).
5. Extended syntax available in scripts:
   - `===` / `!==` strict comparison; `&&` / `||` instead of `and` / `or`
   - `{% foreach list as entry %} … {% break %} … {% endforeach %}`
   - type tests with `is`: `true`, `false`, `boolean`/`bool`, `string`, `scalar`, `object`, `integer`/`int`, `float`, `callable`, `array`
   - cast filters: `intval`, `strval`, `boolval`, `floatval`
6. IDE type hints: `{# @var services \Shopware\Core\Framework\Script\ServiceStubs #}`, then e.g. `services.config.app('my-app-config')`. The stub lists every service; which ones exist depends on the hook.
7. Example: on `product-page-loaded`, read `hook.page`, load the media by the id in `page.product.customFields.myCustomMediaField` via `services.repository.search('media', criteria).first`, and attach it with `page.addExtension('swagMyCustomMediaField', media)`.

## Essential identifiers

- `Resources/scripts/<hook-name>/*.twig`, `Resources/scripts/include/`
- `\Shopware\Core\Framework\Script\ServiceStubs`
- `sw_macro_function`, `return`, `foreach`, `===`, `!==`, `&&`, `||`
- Filters `intval`, `strval`, `boolval`, `floatval`, `trans`
- `services.repository.search()`, `services.config.app()`, `debug.dump()`
- Hook `product-page-loaded`; interface functions `cache_key`, `response`

## Gotchas

- The Symfony debug toolbar (script icon → profiler script view showing triggered hooks and executed scripts) only appears with `APP_ENV = dev`. Use `{% do debug.dump(hook.page) %}` to dump data into that view.
- In the `cache_key` block you do not necessarily have the same data/services as in `response`.
- The source shows reusable includes written with the plain Twig `macro` tag; in 6.7 the `macro` override for app scripts is deprecated for removal in 6.8 in favour of `sw_macro_function`.

## Version notes

- App scripts require Shopware 6.4.8.0 or later.
- Plain `macro` in app scripts: deprecated, removed in v6.8.0 — use `sw_macro_function`.

## Code check (6.7.15.1)
- confirmed `SCRIPT_DIR` — scripts are read from /Resources/scripts — vendor/shopware/core/Framework/App/Lifecycle/ScriptFileReader.php:18
- confirmed `include` — scripts in the include folder are treated as includes — vendor/shopware/core/Framework/Script/Execution/ScriptLoader.php:141
- deprecated `macro` — app-script macro override, removed in v6.8.0, use sw_macro_function — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/MacroOverrideTokenParserMacro.php:11
- confirmed `sw_macro_function` — tag, closed by end_sw_macro_function — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/SwMacroFunctionTokenParser.php:67
- confirmed `return` — return tag parser — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ReturnNodeTokenParser.php:32
- confirmed `===` — strict-equality operator registered — vendor/shopware/core/Framework/Adapter/Twig/Extension/PhpSyntaxExtension.php:187
- confirmed `intval` — cast filter (also floatval, strval, boolval) — vendor/shopware/core/Framework/Adapter/Twig/Extension/PhpSyntaxExtension.php:65
- confirmed `StoreApiHook::FUNCTIONS` — cache_key and response functions — vendor/shopware/core/Framework/Script/Api/StoreApiHook.php:29
- confirmed `ServiceStubs` — stub class for IDE hints — vendor/shopware/core/Framework/Script/ServiceStubs.php:26
- confirmed `ProductPageLoadedHook::HOOK_NAME` — product-page-loaded — vendor/shopware/storefront/Page/Product/ProductPageLoadedHook.php:24
