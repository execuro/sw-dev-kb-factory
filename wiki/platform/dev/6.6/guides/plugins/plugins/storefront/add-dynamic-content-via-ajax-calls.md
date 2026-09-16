---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-dynamic-content-via-ajax-calls.md
title: Add dynamic content via AJAX calls
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-dynamic-content-via-ajax-calls.html
sourceHash: d519a1d8b2947b4c4c96fae339a9f21a6f174619
keywords: ["AJAX", "dynamic content", "JsonResponse", "XmlHttpRequest", "StorefrontController", "ExampleController", "frontend.example.example", "AjaxLoadPlugin", "PluginManager.register", "sw_extends", "cms_content", "fetch"]
summary: How to add dynamic content to a Storefront plugin using a JSON-returning controller endpoint fetched via a JavaScript plugin's AJAX call.
lastBuilt: 2026-09-15
---
## What it is

This guide shows how to add dynamic content to the Storefront by combining a controller that returns JSON with a Storefront JavaScript plugin that fetches it via AJAX.

## When to use

Use this after already having a custom controller and custom Storefront JavaScript, when the goal is to load and display data asynchronously without a full page reload.

## Key steps / config

1. Add a controller action returning `JsonResponse` instead of a normal `Response`, with `XmlHttpRequest` allowed in the route defaults:

```php
namespace SwagBasicExample\Storefront\Controller;

use Shopware\Storefront\Controller\StorefrontController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route(defaults: ['_routeScope' => ['storefront']])]
class ExampleController extends StorefrontController
{
    #[Route(path: '/example', name: 'frontend.example.example', methods: ['GET'], defaults: ['XmlHttpRequest' => 'true'])]
    public function showExample(): JsonResponse
    {
        return new JsonResponse(['timestamp' => (new \DateTime())->format(\DateTimeInterface::W3C)]);
    }
}
```

Using `JsonResponse` automatically serializes the passed array to a `JSON` string. The `services.xml` and `routes.xml` needed to register the controller are the same as for a normal Storefront controller.

2. Add a Storefront JavaScript plugin that fetches the endpoint on a button click:

```javascript
export default class AjaxLoadPlugin extends PluginBaseClass {
    init() {
        this.button = this.el.children['ajax-button'];
        this.textdiv = this.el.children['ajax-display'];
        this._registerEvents();
    }
    async _fetch() {
        const response = await fetch('/example');
        const data = await response.json();
        this.textdiv.innerHTML = data.timestamp;
    }
}
```

Register it via `window.PluginManager.register('AjaxLoadPlugin', AjaxLoadPlugin, '[data-ajax-helper]')`.

3. Add a template block providing the `data-ajax-helper` markup the plugin binds to, using `{% sw_extends %}` and overriding `cms_content`.

## Essential identifiers

- route `frontend.example.example` on `/example`
- `Symfony\Component\HttpFoundation\JsonResponse`
- route default `XmlHttpRequest`
- `PluginManager.register()` and selector `[data-ajax-helper]`
- twig block `cms_content`

## Gotchas

The pattern shown (fetch-and-render) generalizes to data fetched from the database; for that case the DAL (Data Abstraction Layer) is the recommended way to load the data inside the controller.
