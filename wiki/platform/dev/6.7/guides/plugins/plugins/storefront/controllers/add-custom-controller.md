---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.7/guides/plugins/plugins/storefront/templates/customize-templates.md
  - platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md
sourceHash: 338b19be02546abf617fdaaa3045b81fc5d6a687
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/controllers/add-custom-controller.html
title: Add Custom Controller
version: "6.7"
versions:
  - "6.7"
keywords: ["StorefrontController", "StorefrontRouteScope::ID", "PlatformRequest::ATTRIBUTE_ROUTE_SCOPE", "_routeScope", "renderStorefront", "setContainer", "routes.php", "services.php", "storefront.router.allowed_routes", "SalesChannelContext", "custom storefront controller", "storefront route", "frontend route prefix"]
summary: "Plugin Storefront controller: StorefrontController subclass, route scope, services.php setContainer, routes.php import, allowed_routes."
lastBuilt: 2026-10-21
---
## What it is

How to add a custom Storefront controller to a plugin: the controller class with route attributes, its DI service definition, the route import that makes Shopware discover its routes, the rendered Twig template, and (since 6.7.2.0) allowing route names without the usual prefixes.

## When to use

You need a new Storefront URL in a plugin, e.g. as the first step of [creating a custom page](platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-page.md). Requires a plugin base ([Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).

## Key steps / config

1. Create `<plugin root>/src/Storefront/Controller/ExampleController.php` extending `Shopware\Storefront\Controller\StorefrontController`, with the route scope set on the class (it can also be set per route via the same `defaults`):

```php
#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]
class ExampleController extends StorefrontController
{
    #[Route(path: '/example', name: 'frontend.example.example', methods: ['GET'])]
    public function showExample(Request $request, SalesChannelContext $context): Response
    {
        return $this->renderStorefront('@SwagBasicExample/storefront/page/example.html.twig', ['example' => 'Hello world']);
    }
}
```

   Imports: `Shopware\Core\PlatformRequest`, `Shopware\Storefront\Framework\Routing\StorefrontRouteScope`, `Symfony\Component\Routing\Attribute\Route`. `Request` and `SalesChannelContext` method arguments are optional. Every routed method returns a `Response`.
2. Route name prefix: use `frontend`, `widgets`, `payment`, `api` or `store-api`; the first three mark it as a Storefront route.
3. Register the controller in `src/Resources/config/services.php` as public and inject the container:
   `$services->set(ExampleController::class)->public()->call('setContainer', [service('service_container')]);`
   Add it alongside existing definitions rather than replacing them.
4. Import routes in `src/Resources/config/routes.php`:
   `$routes->import('../../Storefront/Controller/*Controller.php', 'attribute');`
   Without this import the controller is a valid service but exposes no URL.
5. Add the template `src/Resources/views/storefront/page/example.html.twig`:

```twig
{% sw_extends '@Storefront/storefront/base.html.twig' %}
{% block base_content %}<h1>Our example controller!</h1>{% endblock %}
```

6. Optional (6.7.2.0+), custom route names without prefix — `src/Resources/config/packages/storefront.yaml`:

```yaml
storefront:
    router:
        allowed_routes:
            - swag.test.foo-bar
```

   Ensure it is loaded: override `build(ContainerBuilder $container)` in the plugin base class, call `parent::build()`, and load `$confDir . '/{packages}/*.yaml'` with a `DelegatingLoader` over `YamlFileLoader`, `GlobFileLoader` and `DirectoryLoader`. Then `name: 'swag.test.foo-bar'` works in a `#[Route]`.

## Essential identifiers

- `Shopware\Storefront\Controller\StorefrontController`, `renderStorefront()`
- `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` (`_routeScope`), `StorefrontRouteScope::ID` (`storefront`)
- `setContainer` / `service_container`
- `storefront.router.allowed_routes`
- `@Storefront/storefront/base.html.twig`, block `base_content`

## Gotchas

- The source prose mentions an `index.html.twig` in `page/example/`, but the controller renders `@SwagBasicExample/storefront/page/example.html.twig`; the template path must match the `renderStorefront()` argument.
- The `call('setContainer', ...)` in the service definition is required so the controller gets the DI container.
- The installed router checks `allowed_routes` first, then the `frontend.`/`widgets.`/`payment.` prefixes.

## Version notes

- Before 6.4.11.0 the scope was set with the `@RouteScope` annotation, deprecated for 6.5; use the `_routeScope` route default instead.
- `storefront.router.allowed_routes` is available since 6.7.2.0.

## Code check (6.7.15.1)
- confirmed `StorefrontController` — abstract base controller — vendor/shopware/storefront/Controller/StorefrontController.php:41
- confirmed `StorefrontController::renderStorefront()` — protected, returns Response — vendor/shopware/storefront/Controller/StorefrontController.php:68
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — vendor/shopware/core/PlatformRequest.php:78
- confirmed `StorefrontRouteScope::ID` — value `storefront` — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `allowed_routes` — array node under storefront.router — vendor/shopware/storefront/DependencyInjection/Configuration.php:43
- confirmed `storefront.router.allowed_routes` — parameter injected into the Storefront router — vendor/shopware/storefront/DependencyInjection/services.php:300
- confirmed `frontend.` — prefix check after allowed_routes (also `widgets.`, `payment.`) — vendor/shopware/storefront/Framework/Routing/Router.php:204
- confirmed `base_content` — block in Storefront base template — vendor/shopware/storefront/Resources/views/storefront/base.html.twig:105
- unverified `RoutingConfigurator::import()` — vendor/symfony, out of scope
