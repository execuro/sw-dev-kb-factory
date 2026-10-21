---
id: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-dynamic-content-via-ajax-calls.md
title: Add Dynamic Content via AJAX Calls
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/add-dynamic-content-via-ajax-calls.html
sourceHash: 5c87609f20b05eba825d4261b64887592beb18bf
codeCheckedAgainst: "6.7.15.1"
keywords: ["XmlHttpRequest", "JsonResponse", "StorefrontController", "StorefrontRouteScope", "PluginBaseClass", "PluginManager.register", "cms_content", "ajax", "xhr", "fetch", "dynamic content", "storefront javascript plugin", "json endpoint"]
summary: Storefront AJAX pattern - controller route with defaults XmlHttpRequest returning JsonResponse, fetched by a PluginBaseClass JS plugin
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md", "platform/dev/6.7/concepts/framework/data-abstraction-layer.md"]
---
## What it is

A pattern for loading dynamic content into the Storefront: a Storefront controller route that returns JSON and is allowed for XmlHttpRequests, plus a Storefront JavaScript plugin that fetches it and writes it into the DOM. It builds on [adding a custom controller](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md) and [adding custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md).

## When to use

You need to fetch data from the server after page load (e.g. on a button click) without rendering a full template.

## Key steps / config

1. Controller (`PLUGIN_ROOT/Storefront/Controller/ExampleController.php`) extending `Shopware\Storefront\Controller\StorefrontController`, class-level `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]`. The action allows XHR via the route default and returns a `Symfony\Component\HttpFoundation\JsonResponse` (arrays are JSON-encoded automatically):

```php
#[Route(path: '/example', name: 'frontend.example.example', methods: ['GET'], defaults: ['XmlHttpRequest' => 'true'])]
public function showExample(): JsonResponse
{
    return new JsonResponse(['timestamp' => (new \DateTime())->format(\DateTimeInterface::W3C)]);
}
```

2. `src/Resources/config/services.php`: `$services->set(ExampleController::class)->public()->call('setContainer', [service('service_container')]);`
3. `src/Resources/config/routes.php`: `$routes->import('../../Storefront/Controller/**/*Controller.php', 'attribute');`
4. JS plugin `src/Resources/app/storefront/src/example-plugin/example-plugin.plugin.js`: `const { PluginBaseClass } = window;` then `class AjaxLoadPlugin extends PluginBaseClass` with `init()` grabbing `this.el.children['ajax-button']` / `['ajax-display']`, binding a click handler that does `await fetch('/example')`, `response.json()`, and sets `innerHTML` to `data.timestamp`.
5. Register in `src/Resources/app/storefront/src/main.js`: `window.PluginManager.register('AjaxLoadPlugin', AjaxLoadPlugin, '[data-ajax-helper]');`
6. Template `src/Resources/views/storefront/page/content/index.html.twig`:

```twig
{% sw_extends '@Storefront/storefront/page/content/index.html.twig' %}
{% block cms_content %}
    <div data-ajax-helper>
        <div id="ajax-display"></div>
        <button id="ajax-button">Button</button>
    </div>
{% endblock %}
```

## Essential identifiers

- route default `XmlHttpRequest`, `JsonResponse`, `StorefrontController`, `StorefrontRouteScope::ID`
- `window.PluginBaseClass`, `window.PluginManager.register(name, class, selector)`
- twig block `cms_content`, selector `[data-ajax-helper]`

## Gotchas

- The prose writes `defaults: ['XmlHttpRequest' => true]`, the code `'true'` (string). The Storefront reads the attribute with `getBoolean()`, so both are treated as allowed.
- The check only runs for requests that identify themselves as XmlHttpRequests (`$request->isXmlHttpRequest()`) on storefront-scoped routes; such requests to a route without the default are rejected with an access-denied routing exception.

## Code check (6.7.15.1)
- confirmed `XmlHttpRequest` — read via `$request->attributes->getBoolean('XmlHttpRequest')` — vendor/shopware/storefront/Framework/Routing/StorefrontSubscriber.php:245
- confirmed `RoutingException::accessDeniedForXmlHttpRequest()` — thrown for XHR to a storefront route lacking the default — vendor/shopware/storefront/Framework/Routing/StorefrontSubscriber.php:254
- confirmed `StorefrontController` — abstract base controller — vendor/shopware/storefront/Controller/StorefrontController.php:41
- confirmed `StorefrontRouteScope::ID` — value `storefront` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `PluginManager.register()` — signature `(pluginName, pluginClass, selector, options)` — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:79
- confirmed `window.PluginBaseClass` — exposed globally — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:972
- confirmed `cms_content` — block exists in content page template — vendor/shopware/storefront/Resources/views/storefront/page/content/index.html.twig:29
