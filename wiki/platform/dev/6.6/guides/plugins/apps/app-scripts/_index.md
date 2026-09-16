---
id: platform/dev/6.6/guides/plugins/apps/app-scripts/_index.md
title: App Scripts
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-scripts/
sourceHash: 13a12f93fd1197a59b118793428c9d555b34e278
keywords: ["app scripts", "twig hooks", "Resources/scripts", "ServiceStubs", "hook.page", "debug.dump", "cache_key", "response block", "twig macro", "return tag", "interface hooks", "foreach"]
summary: "App Scripts run twig files inside Shopware's execution stack on registered hooks, with access to hook data and services."
lastBuilt: "2026-09-15"
---
## What it is

App Scripts let an app run twig-file logic inside the Shopware execution stack, triggered by named "hooks", to build deeper extensions than manifest-only apps allow. Introduced in Shopware 6.4.8.0.

## Key steps / config

Scripts live under `Resources/scripts/<hook-name>/*.twig`; one or more `.twig` files per hook subdirectory are all executed when that hook fires:

```
Resources/scripts/product-page-loaded/my-first-script.twig
Resources/scripts/cart/first-cart-script.twig
Resources/scripts/cart/second-cart-script.twig
```

Reusable script parts go under `Resources/scripts/include/*.twig` as twig macros, imported with `{% import "include/x.twig" as x %}`. Scripts can `{% return %}` values to the caller.

**Interface hooks** (e.g. `store-api-hook`) require named blocks matching the hook's functions, e.g. `cache_key` (optional) and `response` (required — omitting it errors):

```twig
{% block cache_key %}{% endblock %}
{% block response %}{% endblock %}
```

Translation: `{% set translated = 'my.snippet.key'|trans %}`.

Extended twig syntax available in app scripts: `===`/`!==` equality, `foreach ... as ... { break }`, `is string`/`bool`/`array`/etc. type checks, `intval`/`strval`/`boolval`/`floatval` casts, `&&`/`||` boolean operators, and a `return` tag inside macros.

A typed stub for autocompletion:

```twig
{# @var services \Shopware\Core\Framework\Script\ServiceStubs #}
{% set configValue = services.config.app('my-app-config') %}
```

## Essential identifiers

- `Resources/scripts/<hook>/*.twig`, `Resources/scripts/include/`
- `\Shopware\Core\Framework\Script\ServiceStubs`
- `debug.dump()`, `hook.page`

## Gotchas

The `response` function of an interface hook is required; skipping it causes an error, while `cache_key` is optional (caching just won't work). The `ServiceStubs` class exposes all services for typehinting, but not all are available for every hook.

## Version notes

App scripts were introduced in Shopware 6.4.8.0 and are not supported in earlier versions.
