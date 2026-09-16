---
id: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-dynamic-content-via-ajax-calls.md
title: Add Dynamic Content via AJAX Calls
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/add-dynamic-content-via-ajax-calls.html
sourceHash: 5c87609f20b05eba825d4261b64887592beb18bf
codeCheckedAgainst: "6.7.13.0"
keywords: ["ajax", "XmlHttpRequest", "JsonResponse", "StorefrontController", "StorefrontRouteScope", "PluginBaseClass", "PluginManager.register", "fetch", "dynamic content", "storefront javascript plugin", "cms_content", "frontend.example.example"]
summary: "Storefront AJAX pattern: controller route with XmlHttpRequest default returning JsonResponse, fetched by a JS plugin registered via PluginManager."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md", "platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md", "platform/dev/6.7/concepts/framework/data-abstraction-layer.md"]
---
## What it is

A guide combining a Storefront controller that returns JSON with a Storefront JavaScript plugin that fetches it and updates the DOM. It covers only the differences from [adding a custom controller](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md) and [adding custom JavaScript](platform/dev/6.7/guides/plugins/plugins/storefront/javascript/add-custom-javascript.md).

## When to use

You need content loaded dynamically in the Storefront (without a full page render), e.g. data fetched on a button click.

## Key steps / config

1. Controller `ExampleController extends StorefrontController`, class-level `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]`. The action allows XHR and returns a `JsonResponse` (data is serialized to JSON automatically):

```php
#[Route(path: '/example', name: 'frontend.example.example', methods: ['GET'], defaults: ['XmlHttpRequest' => 'true'])]
public function showExample(): JsonResponse
{
    return new JsonResponse(['timestamp' => (new \DateTime())->format(\DateTimeInterface::W3C)]);
}
```

2. `src/Resources/config/services.php`: `$services->set(ExampleController::class)->public()->call('setContainer', [service('service_container')]);`
3. `src/Resources/config/routes.php`: `$routes->import('../../Storefront/Controller/**/*Controller.php', 'attribute');`
4. JS plugin `src/Resources/app/storefront/src/example-plugin/example-plugin.plugin.js`: `const { PluginBaseClass } = window;`, `class AjaxLoadPlugin extends PluginBaseClass`; in `init()` read `this.el.children['ajax-button']` / `['ajax-display']`, bind the button's click to an async method that does `await fetch('/example')`, `response.json()`, and writes `data.timestamp` into the display element.
5. Register in `src/Resources/app/storefront/src/main.js`:
   `window.PluginManager.register('AjaxLoadPlugin', AjaxLoadPlugin, '[data-ajax-helper]');`
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

- `Shopware\Storefront\Controller\StorefrontController`
- `Shopware\Storefront\Framework\Routing\StorefrontRouteScope::ID`
- `defaults: ['XmlHttpRequest' => 'true']`
- `Symfony\Component\HttpFoundation\JsonResponse`
- `window.PluginBaseClass`, `window.PluginManager.register()`
- Twig block `cms_content`

## Gotchas

- Storefront-scoped routes reject XmlHttpRequests unless the route sets the `XmlHttpRequest` default (enforced by `StorefrontSubscriber`).
- The same pattern applies when fetching database data; then see the [DAL concept](platform/dev/6.7/concepts/framework/data-abstraction-layer.md).

## Code check (6.7.13.0)
- confirmed `StorefrontController` — abstract base controller — vendor/shopware/storefront/Controller/StorefrontController.php:40
- confirmed `StorefrontRouteScope::ID` — value 'storefront' — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `XmlHttpRequest` — route attribute checked before allowing XHR on storefront scope — vendor/shopware/storefront/Framework/Routing/StorefrontSubscriber.php:245
- confirmed `window.PluginBaseClass` — exposed globally — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:799
- confirmed `PluginManager.register()` — signature (pluginName, pluginClass, selector, options) — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:666
- confirmed `cms_content` — block in content page template — vendor/shopware/storefront/Resources/views/storefront/page/content/index.html.twig:29
- unverified `JsonResponse` — vendor/symfony, out of scope
