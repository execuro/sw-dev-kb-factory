---
id: platform/dev/6.7/guides/plugins/apps/app-scripts/_index.md
title: App Scripts
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/apps/app-scripts/
sourceHash: 7feda38c0c22f96f36a3c98676cc81ffdb498e60
codeCheckedAgainst: "6.7.13.0"
keywords: ["app scripts", "script hooks", "Resources/scripts", "twig", "ServiceStubs", "sw_macro_function", "interface hooks", "cache_key", "foreach", "intval", "debug.dump", "product-page-loaded", "sandbox"]
summary: App scripts are sandboxed Twig files in Resources/scripts/<hook>/ run on hooks; covers includes, interface hook blocks, extended syntax, services, debugging.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-translations.md"]
---
## What it is

App scripts are Twig files executed in a sandbox inside the Shopware execution stack. Each script is registered to a "hook"; when the hook fires, the script gets the hook's data (`hook`) and a set of pre-defined services (`services`). Introduced in Shopware 6.4.8.0.

## When to use

An app needs server-side logic (load extra data into pages, manipulate the cart, provide custom endpoints) without a plugin.

## Key steps / config

1. Place scripts in the app's `Resources/scripts` directory, one subdirectory per hook, named exactly like the hook. Multiple `.twig` files per hook are allowed.

```text
DemoApp/
  manifest.xml
  Resources/scripts/
    include/media-repository.twig
    product-page-loaded/my-first-script.twig
    cart/first-cart-script.twig
```

2. Reusable code: put it in `Resources/scripts/include/` as reusable functions and import it with Twig `import`. Scripts in `include` are not run as hooks. In 6.7 define such functions with the `sw_macro_function` tag, which supports `{% return %}` of real values:

```twig
{% sw_macro_function getById(mediaId) %}
    {% return services.repository.search('media', { 'ids': [ mediaId ] }).first %}
{% end_sw_macro_function %}
```
   Use it via `{% import "include/media-repository.twig" as mediaRepository %}` then `mediaRepository.getById(id)`.
3. Interface hooks require functions implemented as Twig blocks named after the function. For `store-api-*` hooks: `{% block cache_key %}` (optional; without it the endpoint is not cached) and `{% block response %}` (required, missing it errors). Each block receives different data/services.
4. Translations: `'my.snippet.key'|trans` uses the Storefront snippet mechanism ([add translations](platform/dev/6.7/guides/plugins/plugins/storefront/styling/add-translations.md)).
5. Extended syntax: `===` / `!==`; `&&` / `||`; `{% foreach list as entry %}...{% break %}...{% endforeach %}`; type tests `is true|false|boolean|bool|string|scalar|object|integer|int|float|callable|array`; cast filters `intval`, `strval`, `boolval`, `floatval`; `{% return %}` tag.
6. IDE autocompletion: `{# @var services \Shopware\Core\Framework\Script\ServiceStubs #}`; e.g. `services.config.app('my-app-config')`. Not all stub services exist in every hook.
7. Example on `product-page-loaded`: read `hook.page` (`\Shopware\Storefront\Page\Product\ProductPage`), search `media` by the id stored in a custom field, then `{% do page.addExtension('swagMyCustomMediaField', media) %}`.

## Essential identifiers

- `Resources/scripts/<hook-name>/`, `Resources/scripts/include/`
- `hook`, `services`, `debug`
- `\Shopware\Core\Framework\Script\ServiceStubs`
- `sw_macro_function`, `return`, `foreach`, `break`
- `cache_key`, `response` (interface hook blocks)
- `intval`, `strval`, `boolval`, `floatval`, `|trans`
- `debug.dump()`

## Gotchas

- The source shows reusable functions defined with the plain Twig `macro` tag. In the installed code the app-script override of `macro` is deprecated for v6.8.0; switch to `sw_macro_function`/`end_sw_macro_function`.
- Debugging: the Symfony debug toolbar's `script` panel lists triggered hooks and executed scripts only with `APP_ENV = dev`; `{% do debug.dump(hook.page) %}` dumps into that view.
- In debug mode scripts are re-read from the app on load and Twig caching is disabled; otherwise compiled scripts are cached per app name and version.

## Code check (6.7.13.0)
- confirmed `SCRIPT_DIR` — `/Resources/scripts` — vendor/shopware/core/Framework/App/Lifecycle/ScriptFileReader.php:18
- confirmed `include` — scripts with hook `include` are skipped as executable scripts — vendor/shopware/core/Framework/Script/Execution/ScriptLoader.php:116
- deprecated `macro` — app-script macro override deprecated tag:v6.8.0, use `sw_macro_function` — vendor/shopware/core/Framework/Adapter/Twig/Extension/PhpSyntaxExtension.php:50
- confirmed `sw_macro_function` — tag, closed by `end_sw_macro_function` — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/SwMacroFunctionTokenParser.php:65
- confirmed `StoreApiHook::FUNCTIONS` — `cache_key` and `response` functions — vendor/shopware/core/Framework/Script/Api/StoreApiHook.php:29
- confirmed `ForeachTokenParser` — foreach/break/continue/return tags registered — vendor/shopware/core/Framework/Adapter/Twig/Extension/PhpSyntaxExtension.php:45
- confirmed `intval` — cast filters intval/floatval/strval/boolval — vendor/shopware/core/Framework/Adapter/Twig/Extension/PhpSyntaxExtension.php:60
- confirmed `===` — `||`, `&&`, `===`, `!==` operators — vendor/shopware/core/Framework/Adapter/Twig/Extension/PhpSyntaxExtension.php:182
- confirmed `ServiceStubs` — final class for twig autocompletion — vendor/shopware/core/Framework/Script/ServiceStubs.php:26
- confirmed `Debug::dump()` — `debug` global added during script trace — vendor/shopware/core/Framework/Script/Debugging/Debug.php:15
