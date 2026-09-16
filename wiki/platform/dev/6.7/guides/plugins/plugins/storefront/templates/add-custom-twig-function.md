---
id: platform/dev/6.7/guides/plugins/plugins/storefront/templates/add-custom-twig-function.md
title: Add Custom Twig Functions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/add-custom-twig-function.html
sourceHash: f51ce22bd7f4adbd93f925bad11051bfae173f75
codeCheckedAgainst: "6.7.13.0"
keywords: ["twig function", "TwigFunction", "AbstractExtension", "getFunctions", "twig.extension", "services.php", "createMd5Hash", "sw_extends", "custom twig extension", "template helper", "storefront twig"]
summary: Register a custom Twig function in a plugin - class extending Twig AbstractExtension returning TwigFunction objects, service tagged twig.extension.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to add your own Twig function to a plugin so templates can call PHP code, using the example function `createMd5Hash` that returns the MD5 hash of a string.

## When to use

You need a PHP helper callable from Storefront Twig templates. The source advises against using Twig functions to fetch data from the database; use a CMS data resolver (the source calls it `DataResolver`) for that. Requires a plugin ([Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).

## Key steps / config

1. Create a class in `src/Twig/` that extends `Twig\Extension\AbstractExtension` and returns `Twig\TwigFunction` instances from `getFunctions()`:
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
2. Register the service in `src/Resources/config/services.php` with the `twig.extension` tag (required):
   ```php
   $services->set(SwagCreateMd5Hash::class)
       ->public()
       ->tag('twig.extension');
   ```
3. Call the function in any template:
   ```twig
   {% sw_extends '@Storefront/storefront/page/content/product-detail.html.twig' %}
   {% set md5Hash = createMd5Hash('Shopware is awesome') %}
   {% block page_content %}
       {{ parent() }}
       {{ md5Hash }}
   {% endblock %}
   ```

## Essential identifiers

- `Twig\Extension\AbstractExtension`, `getFunctions()`
- `Twig\TwigFunction`
- DI tag `twig.extension`
- `sw_extends`, block `page_content` in `@Storefront/storefront/page/content/product-detail.html.twig`

## Gotchas

- Without the `twig.extension` tag the function is not registered.
- The source's example imports `Shopware\Core\Framework\Context` but never uses it; it is not needed.
- Once registered the function is available in all templates, not only your plugin's.

## Code check (6.7.13.0)
- confirmed `twig.extension` — tag used by Shopware's own Twig extensions — vendor/shopware/storefront/DependencyInjection/services.php:314
- confirmed `AbstractExtension` — Shopware extensions extend it — vendor/shopware/storefront/Framework/Twig/TemplateDataExtension.php:19
- confirmed `getFunctions()` — signature `getFunctions(): array` in core extensions — vendor/shopware/core/Framework/Adapter/Twig/Extension/SeoUrlFunctionExtension.php:26
- confirmed `sw_extends` — Shopware extends token parser — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `page_content` — block in product-detail template — vendor/shopware/storefront/Resources/views/storefront/page/content/product-detail.html.twig:9
- corrected `DataResolver` — docs: `DataResolver`; no class of that exact name, CMS resolvers live in the DataResolver namespace — vendor/shopware/core/Content/Cms/DataResolver/CmsSlotsDataResolver.php:28
- unverified `Twig\TwigFunction` — vendor/twig, out of scope
