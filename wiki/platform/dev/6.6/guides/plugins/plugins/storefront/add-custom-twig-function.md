---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-twig-function.md
title: Add custom twig functions
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-custom-twig-function.html
sourceHash: 89e0e9ad3adcd293dd6f5ee0ae33d0b2ea8a17c2
keywords: ["custom twig function", "TwigFunction", "AbstractExtension", "getFunctions", "twig.extension", "SwagCreateMd5Hash", "services.xml tag", "createMd5Hash", "sw_extends", "twig extension", "DataResolver"]
summary: How to register a custom Twig function in a Shopware 6 plugin via an AbstractExtension class tagged twig.extension.
lastBuilt: 2026-09-15
---
## What it is

This guide shows how to create a custom Twig function for use inside Storefront templates, backed by a PHP class registered as a Twig extension.

## When to use

Use this when template logic needs to call custom PHP code directly from Twig — for example computing a hash from a string during theme development. It is not recommended for retrieving data from the database from within a twig function; a `DataResolver` should be used for that instead.

## Key steps / config

1. Create a PHP class in a `Twig` folder inside `src`, extending `AbstractExtension` and returning a `TwigFunction` from `getFunctions()`:

```php
// <plugin root>/src/Twig/SwagCreateMd5Hash.php
namespace SwagBasicExample\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class SwagCreateMd5Hash extends AbstractExtension
{
    public function getFunctions()
    {
        return [
            new TwigFunction('createMd5Hash', [$this, 'createMd5Hash']),
        ];
    }

    public function createMd5Hash(string $str)
    {
        return md5($str);
    }
}
```

2. Register the class as a service tagged `twig.extension` in `services.xml`:

```xml
<service id="SwagBasicExample\Twig\SwagCreateMd5Hash" public="true">
    <tag name="twig.extension"/>
</service>
```

3. Call the function from any template, e.g.:

```twig
{% sw_extends '@Storefront/storefront/layout/header/header.html.twig' %}
{% set md5Hash = createMd5Hash('Shopware is awesome') %}
{% block layout_header_logo %}
    {{ parent() }}
    {{ md5Hash }}
{% endblock %}
```

## Essential identifiers

- `Twig\Extension\AbstractExtension` — base class for the extension
- `Twig\TwigFunction` — wraps the callable exposed to templates
- tag `twig.extension` in `services.xml`
- example class `SwagBasicExample\Twig\SwagCreateMd5Hash`

## Gotchas

It is not recommended to use a custom Twig function to retrieve data from the database directly; use a `DataResolver` for that case instead.
