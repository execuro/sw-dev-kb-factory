---
id: platform/dev/6.7/guides/plugins/plugins/storefront/templates/add-custom-twig-function.md
title: Add Custom Twig Functions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/add-custom-twig-function.html
sourceHash: f51ce22bd7f4adbd93f925bad11051bfae173f75
codeCheckedAgainst: "6.7.15.1"
keywords: ["twig function", "TwigFunction", "AbstractExtension", "getFunctions", "twig.extension", "twig extension", "createMd5Hash", "SwagCreateMd5Hash", "services.php", "custom template function", "sw_extends", "DataResolver"]
summary: Add a custom Twig function in a Shopware plugin via a Twig AbstractExtension returning TwigFunction objects, tagged twig.extension in services.php.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to expose a PHP callable to Storefront templates as a Twig function from a plugin. The example function `createMd5Hash` takes a string and returns its MD5 hash.

## When to use

When a template needs a computation done in PHP. Do not use Twig functions to fetch data from the database — the source points to a `DataResolver` for that case.

## Key steps / config

Prerequisite: a plugin ([Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)). Two files are involved: the extension class and `services.php`.

1. Create `PLUGIN_ROOT/src/Twig/SwagCreateMd5Hash.php` extending `Twig\Extension\AbstractExtension` and return `Twig\TwigFunction` instances from `getFunctions()`:

```php
namespace SwagBasicExample\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class SwagCreateMd5Hash extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [new TwigFunction('createMd5Hash', [$this, 'createMd5Hash'])];
    }

    public function createMd5Hash(string $str): string { return md5($str); }
}
```

2. Register the service in `PLUGIN_ROOT/src/Resources/config/services.php` with the `twig.extension` tag (required):

```php
$services->set(SwagCreateMd5Hash::class)
    ->public()
    ->tag('twig.extension');
```

3. Call it in any template:

```twig
{% sw_extends '@Storefront/storefront/page/content/product-detail.html.twig' %}
{% set md5Hash = createMd5Hash('Shopware is awesome') %}
{% block page_content %}
    {{ parent() }}
    {{ md5Hash }}
{% endblock %}
```

## Essential identifiers

- `Twig\Extension\AbstractExtension`
- `Twig\TwigFunction`
- `getFunctions()`
- `twig.extension`
- `createMd5Hash`, `SwagCreateMd5Hash`
- `sw_extends`, `page_content`

## Gotchas

- Without the `twig.extension` tag the function is not registered in the Twig environment.
- The source snippet declares `getFunctions()` without a return type; core Storefront extensions declare `getFunctions(): array`, as shown above.

## Code check (6.7.15.1)
- confirmed `AbstractExtension` — core Storefront Twig extensions extend it — vendor/shopware/storefront/Framework/Twig/Extension/ConfigExtension.php:16
- confirmed `ConfigExtension::getFunctions()` — core pattern, declared with `: array` returning `TwigFunction` list — vendor/shopware/storefront/Framework/Twig/Extension/ConfigExtension.php:25
- confirmed `TwigFunction` — imported from `Twig\TwigFunction` — vendor/shopware/storefront/Framework/Twig/Extension/ConfigExtension.php:13
- confirmed `twig.extension` — service tag used to register Twig extensions — vendor/shopware/storefront/DependencyInjection/services.php:324
- confirmed `sw_extends` — Shopware extends tag — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `page_content` — block exists in product-detail.html.twig — vendor/shopware/storefront/Resources/views/storefront/page/content/product-detail.html.twig:9
- confirmed `DataResolver` — CMS data-resolver namespace `Shopware\Core\Content\Cms\DataResolver` — vendor/shopware/core/Content/Cms/SalesChannel/SalesChannelCmsPageLoader.php:11
- unverified `Twig\Extension\AbstractExtension` — base class lives in vendor/twig, out of scope
